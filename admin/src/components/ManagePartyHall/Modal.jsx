import { CloseOutlined } from "@mui/icons-material";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import app from "../../firebase";

// SERVICES
import * as FloorService from "../../service/FloorService";
import * as PartyHallImageService from "../../service/PartyHallImageService";
import * as PartyHallService from "../../service/PartyHallService";
import * as PartyHallTypeService from "../../service/PartyHallTypeService";


const Background = styled.div`
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;

    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    animation: fadeIn linear 0.1s;
`

const ModalWrapper = styled.div`
    width: 900px;
    height: auto;
    box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
    background: var(--color-white);
    color: var(--color-dark);
    display: flex;
    justify-content: center;
    align-items: center;

    position: relative;
    z-index: 10;
    border-radius: 10px;
    --growth-from: 0.7;
    --growth-to: 1;
    animation: growth linear 0.1s;
`

const ModalContent = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    line-height: 1.8;
    color: #141414;

    p {
        margin-bottom: 1rem;
    }
`

const CloseModalButton = styled.span`
    cursor: pointer;
    position: absolute;
    top: 20px;
    right: 20px;
    width: 32px;
    height: 32px;
    padding: 0;
    z-index: 10;
`

const Button = styled.div`
    margin-top: 30px;
    width: 100%;
    display: flex;
    justify-content: space-around;
    flex-direction: row;
`

const H1 = styled.h1`
margin-top: 30px;
`

const ModalForm = styled.form`
width: 100%;    
height: 100%;
    display: flex;
    flex-direction: column;
    border-radius: var(--card-border-radius);
    padding: var(--card-padding);
    box-shadow: var(--box-shadow);
    transition: all 300ms ease;
    &:hover {
        box-shadow: none;
    }
`

const ModalFormItem = styled.div`
margin: 0px 30px;
display: flex;
flex-direction: column;
`
const FormSpan = styled.span`
font-size: 1.2rem;
height: 600;
color: var(--color-dark-light);
margin-bottom: 3px;
`
const FormInput = styled.input`
background-color: var(--color-white);
color: var(--color-dark);
width: auto;
padding: 12px 20px;
margin: 8px 0;
display: inline-block;
border: 1px solid #ccc;
border-radius: 4px;
box-sizing: border-box;
&:focus {
    border: 1px solid var(--color-success);
    box-shadow: var(--color-success) 0px 1px 4px, var(--color-success) 0px 0px 0px 3px;
}
`

const ButtonUpdate = styled.div`
    width: 100%;
    margin: 18px 0px;
    display: flex;
    justify-content: space-around;
    flex-direction: row;
`
const ButtonContainer = styled.div`
    position: relative;
    float: right;
    margin: 0 22px 22px 0;
    &::after {
        content: "";
        border: 2px solid black;
        position: absolute;
        top: 5px;
        left: 5px;
        right: 20px;
        background-color: transperent;
        width: 95%;
        height: 95%;
        z-index: -1;
    }
`

const ButtonClick = styled.button`
    padding: 10px;
    border: 2px solid black;
    background-color: black;
    color: white;
    cursor: pointer;
    font-weight: 500;
    &:hover {
        background-color: #fe6430;
    }
    &:active {
        background-color: #333;
        transform: translate(5px, 5px);
        transition: transform 0.25s;
    }
`

const FormImg = styled.img`
    margin: auto;
    width: 100px;
    object-fit: contain;
    height: 100px;
`

const ModalChiTietItem = styled.div`
margin: 2px 30px;
display: flex;
flex-direction: column;
`
const FormSelect = styled.select`
    background-color: var(--color-white);
    color: var(--color-dark);
    width: auto;
    padding: 12px 20px;
    margin: 8px 0;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    &:focus {
        border: 1px solid var(--color-success);
        box-shadow: var(--color-success) 0px 1px 4px, var(--color-success) 0px 0px 0px 3px;
    }
`

const FormOption = styled.option`
    margin: auto;
`

const FormTextArea = styled.textarea`
    background-color: var(--color-white);
    color: var(--color-dark);
    width: auto;
    padding: 12px 20px;
    margin: 8px 0;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    resize: none;
    &:focus {
        border: 1px solid var(--color-success);
        box-shadow: var(--color-success) 0px 1px 4px, var(--color-success) 0px 0px 0px 3px;
    }
`
// Chi tiết
const ChiTietHinhAnh = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    margin: auto;
`
const ImageWrapper = styled.div`
    display: flex;
    flex-direction: row;
    &img {
        margin: 0px 20px;
    }
`
const ChiTietWrapper = styled.div`
    width: 70%;
    height: auto;
    box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
    background: var(--color-white);
    color: var(--color-dark);
    display: flex;
    justify-content: center;
    align-items: center;

    position: relative;
    z-index: 10;
    border-radius: 10px;
    --growth-from: 0.7;
    --growth-to: 1;
    animation: growth linear 0.1s;
`

const H1Delete = styled.h1` 
    width: "90%";
    text-align: center;
`

// Left
const LeftVote = styled.div``
const LeftVoteItem = styled.div`
    position: relative;
    padding-bottom: 20px;
    margin-bottom: 20px;
    box-shadow: 6px 6px 30px #d1d9e6;
    border-radius: 20px;
    background-color: var(--color-white);
`
const LeftImage = styled.img`
    margin: auto;
    width: 95%;
    max-height: 150px;
    object-fit: cover;
    border-radius: 20px;
`
const LeftVoteTitle = styled.span`
    margin: auto;
    font-size: 1.5rem;
    font-weight: bold;
    letter-spacing: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 0px 15px 0px;
    color: var(--color-dark);
`
const LeftVoteItemRating = styled.div`
    /* position: relative; */
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    width: 95%;
    height: auto;
    box-shadow: 6px 6px 30px #d1d9e6;
    border-radius: 20px;
    background-color: var(--color-white);
`
const CartItem = styled.div`
display: flex;
width: 100%;
font-size: 1.1rem;
background: var(--color-grey);
margin-top: 10px;
padding: 10px 12px;
border-radius: 5px;
cursor: pointer;
border: 1px solid transparent;
`

const Circle = styled.span`
height: 12px;
width: 12px;
background: #ccc;
border-radius: 50%;
margin-right: 15px;
border: 4px solid transparent;
display: inline-block;
`

const Course = styled.div`
width: 100%;
color: var(--color-dark);
`

const Content = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
`

const InforCustomer = styled.div``
const InfoItem = styled.div``
const InfoTitle = styled.div`
    font-size: 1.1rem;
    font-weight: 400;
    letter-spacing: 1px;
    padding: 10px 0px 10px 50px;
    color: var(--color-dark);
`
const InfoDetail = styled.div`
    font-size: 1.1rem;
    font-weight: 400;
    letter-spacing: 1px;
    padding: 10px 20px;
    color: var(--color-dark);
`
const LeftVoteItem2 = styled.div`
    position: relative;
    padding-bottom: 20px;
    margin-bottom: 20px;
    box-shadow: 6px 6px 30px #d1d9e6;
    border-radius: 20px;
    background-color: var(--color-white);
    display: flex;
    flex-direction: column;
`

// Right
const RightVote = styled.div`
    padding-left: 40px;
`
const RightVoteItem = styled.div`
    position: relative;
    padding-bottom: 20px;
    margin-bottom: 20px;
    box-shadow: 6px 6px 30px #d1d9e6;
    border-radius: 20px;
    background-color: var(--color-white);
`

const RightVoteTitle = styled.span`
    margin: auto;
    font-size: 1.5rem;
    font-weight: bold;
    letter-spacing: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 0px 15px 0px;
    color: var(--color-dark);
`
const Surcharge = styled.div`
    height: 310px;
    max-height: 310px;
    overflow-y: scroll;
`
const RightVoteItem2 = styled.div`
    position: relative;
    padding-bottom: 20px;
    margin-bottom: 20px;
    box-shadow: 6px 6px 30px #d1d9e6;
    border-radius: 20px;
    background-color: var(--color-white);
    display: flex;
    flex-direction: column;
`

const InforTotal = styled.div``
const InfoTotalItem = styled.div``
const InfoTotalTitle = styled.div`
    font-size: 1.1rem;
    font-weight: 400;
    letter-spacing: 1px;
    padding: 10px 0px 10px 50px;
    color: var(--color-dark);
`
const InfoTotalDetail = styled.div`
    font-size: 1.1rem;
    font-weight: bold;
    letter-spacing: 1px;
    padding: 10px 20px;
    color: var(--color-primary);
`

const AlertWrapper = styled.div`
    width: 50%;
    height: auto;
    box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
    background: var(--color-white);
    color: var(--color-dark);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    position: relative;
    z-index: 10;
    border-radius: 10px;
    --growth-from: 0.7;
    --growth-to: 1;
    animation: growth linear 0.1s;
`

// Empty item
const EmptyItem = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`
const EmptyItemSvg = styled.div``
const EmptyContent = styled.div`
    letter-spacing: 2px;
    font-size: 1.2rem;
    color: var(--color-primary);
    font-weight: bold;
`

// Service Item
const ServiceItem = styled.div`
    background-color: var(--color-light);
    padding: 10px 30px;
    width: 80%;
    margin: 5px auto 10px auto;
    border-radius: 20px;
    position: relative;
`;
const ServiceIcon = styled.img`
    width: 40px;
    height: auto;
`;
const ServiceName = styled.div`
    font-size: 1rem;
    font-weight: bold;
`;
const ServiceTime = styled.div`
    font-size: 0.9rem;
    font-weight: 300;
    letter-spacing: 2px;
`;
const ServiceTitle = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
`;
const ServiceInfo = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
`;
const ServiceIconContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;
const ServiceList = styled.div`
    min-height: 200px;
    max-height: 200px;
    overflow-y: scroll;
`;

// Checkbox
const LabelCheckbox = styled.label`
    cursor: pointer;
`
const FormChucNang = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    /* position: absolute;
    left: 50%;
    bottom: 50%; */
    /* transform: translateX(-50%); */
    text-align: center;
    justify-content: space-around;
`

const SignInBtn = styled.button`
    padding: 0px 35px;
    width: auto;
    height: 42px;
    margin: 5px 0px 10px 0px;
    border: none;
    outline: none;
    border-radius: 20px;
    text-transform: uppercase;
    font-size: 0.9rem;
    letter-spacing: 1px;
    font-weight: 700;
    box-shadow: 2px 2px 30px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    color: var(--color-dark);
    background-color: var(--color-light);
    transition: all 0.3s ease;
    &:hover {
        background-color: var(--color-primary);
        color: var(--color-white);
    }
    &:active {
        transform: scale(1.05);
    }
`

const SignUpBtn = styled.button`
    padding: 0px 35px;
    width: auto;
    height: 42px;
    margin: 5px 0px;
    border: none;
    outline: none;
    border-radius: 20px;
    text-transform: uppercase;
    font-size: 0.9rem;
    letter-spacing: 1px;
    font-weight: 700;
    box-shadow: 2px 2px 30px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    color: var(--color-dark);
    background-color: var(--color-light);
    transition: all 0.3s ease;
    &:hover {
        color: var(--color-white);
        background-color: var(--color-primary);
    }
    &:active {
        transform: scale(1.05);
    }   
`

const DeleteService = styled.span`
    cursor: pointer;
    color: var(--color-dark);
    position: absolute;
    top: 17px;
    right: 20px;
    width: 32px;
    height: 32px;
    padding: 0;
    z-index: 10;
    &:hover {
        color: var(--color-primary);
        transform: scale(1.3);
        transition: all 200ms linear; 
    }
`


// Device Item
const DeviceList = styled.div`
    min-height: 200px;
    max-height: 200px;
    overflow-y: scroll;
`;
const DeviceIcon = styled.img`
    width: 40px;
    height: auto;
`;
const DeviceName = styled.div`
    font-size: 1rem;
    font-weight: bold;
`;
const DeviceTime = styled.div`
    font-size: 0.9rem;
    font-weight: 300;
    letter-spacing: 2px;
`;
const DeviceTitle = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
`;
const DeviceInfo = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
`;
const DeviceIconContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

// Device detail
const DeviceDetailContainer = styled.div`
    border-radius: 5px;
    padding: 12px;
    /* position: absolute;
    bottom: calc(100% + 20px);
    right: -100px; */
    position: fixed;
    bottom: 400px;
    left: 650px;
    background-color: #f5f5f5;
    width: 250px;
    border-radius: 2px;
    box-shadow: 0 1px 3.125rem 0 rgb(0 0 0 / 20%);
    -webkit-animation: fadeIn ease-in 0.2s;
    animation: fadeIn ease-in 0.2s;
    transition: all 0.85s ease;
    cursor: default;
    z-index: 10;
    display: none;
    /* opacity: 0; */
    &::after {
        content: "";
        position: absolute;
        cursor: pointer;
        left: 24px;
        bottom: -28px;
        border-width: 16px 20px;
        border-style: solid;
        border-color: #f5f5f5 transparent transparent transparent;
    }
`;
const DeviceDetailImage = styled.img`
    border-radius: 5px;
    width: 100%;
`;

const DeviceItem = styled.div`
    border-radius: 20px;
    background-color: var(--color-light);
    padding: 10px 30px;
    width: 80%;
    margin: 5px auto 10px auto;
    position: relative;
    cursor: pointer;
    transition: all 0.5s ease;
    &:hover {
        background-color: #f5f5f5;
        ${DeviceDetailContainer} {
            /* opacity: 1; */
            display: block;
        }
        &::after {
            opacity: 1;
        }
    }
    &::after {
        content: "";
        position: absolute;
        top: 20px;
        left: 20px;
        height: 5px;
        width: 5px;
        background: var(--color-primary);
        border-radius: 50%;
        margin-right: 15px;
        border: 4px solid transparent;
        display: block;
        opacity: 0;
    }
`;

const Modal = ({ showModal, setShowModal, type, partyHall, setReRenderData, handleClose, showToastFromOut }) => {
    // Modal
    const modalRef = useRef();
    const closeModal = (e) => {
        if (modalRef.current === e.target) {
            setShowModal(false);
        }
    }

    const keyPress = useCallback(
        (e) => {
            if (e.key === 'Escape' && showModal) {
                setShowModal(false);
            }
        },
        [setShowModal, showModal]
    );

    useEffect(
        () => {
            document.addEventListener('keydown', keyPress);
            return () => document.removeEventListener('keydown', keyPress);
        },
        [keyPress]
    );

    // ==================== Xử lý thêm Sảnh tiệc ====================
    useEffect(() => {
        setPartyHallImageListModalNew([]);
        setPartyHallImageListModalChange([]);
    }, [showModal]);
    // STATE
    const [partyHallTypeIdModalNew, setPartyHallTypeIdModalNew] = useState();
    const [floorIdModalNew, setFloorIdModalNew] = useState();
    const [partyHallNameModalNew, setPartyHallNameModalNew] = useState();
    const [partyHallViewModalNew, setPartyHallViewModalNew] = useState();
    const [partyHallDescriptionModalNew, setPartyHallDescriptionModalNew] = useState();
    const [partyHallSizeModalNew, setPartyHallSizeModalNew] = useState();
    const [partyHallOccupancyModalNew, setPartyHallOccupancyModalNew] = useState();
    const [partyHallPriceModalNew, setPartyHallPriceModalNew] = useState();
    const [partyHallImageListModalNew, setPartyHallImageListModalNew] = useState([]);

    // Thay đổi hình ảnh
    const handleShowImg = (hinhmoiarray) => {
        // Chạy vòng lặp thêm từng hình trong mảng lên firebase rồi lưu vô mảng [partyHallImageListModalNew] ở modal Thêm Sảnh tiệc
        setPartyHallImageListModalNew([]);
        for (let i = 0; i < hinhmoiarray.length; i++) {
            // console.log("hinh moi: ", hinhmoiarray[i]);
            const hinhanhunique = new Date().getTime() + hinhmoiarray[i].name;
            const storage = getStorage(app);
            const storageRef = ref(storage, hinhanhunique);
            const uploadTask = uploadBytesResumable(storageRef, hinhmoiarray[i]);

            // Listen for state changes, errors, and completion of the upload.
            uploadTask.on('state_changed',
                (snapshot) => {
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                        case 'running':
                            console.log('Upload is running');
                            break;
                        default:
                    }
                },
                (error) => {
                    // A full list of error codes is available at
                    // https://firebase.google.com/docs/storage/web/handle-errors
                    switch (error.code) {
                        case 'storage/unauthorized':
                            // User doesn't have permission to access the object
                            break;
                        case 'storage/canceled':
                            // User canceled the upload
                            break;

                        // ...

                        case 'storage/unknown':
                            // Unknown error occurred, inspect error.serverResponse
                            break;
                    }
                },
                () => {
                    // Upload completed successfully, now we can get the download URL
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        console.log('File available at', downloadURL);
                        try {
                            setPartyHallImageListModalNew(prev => [...prev, downloadURL]);
                            console.log("Up thành công 1 hình: ", downloadURL);
                        } catch (err) {
                            console.log("Lỗi show hình ảnh:", err);
                        }
                    });
                }
            );
        }
    }

    const handleCreatePartyHall = async (
        partyHallTypeIdModalNew,
        floorIdModalNew,
        partyHallNameModalNew,
        partyHallViewModalNew,
        partyHallDescriptionModalNew,
        partyHallSizeModalNew,
        partyHallOccupancyModalNew,
        partyHallPriceModalNew,
        partyHallImageListModalNew  //Mảng hình nhe
    ) => {
        try {
            const createPartyHallRes = await PartyHallService.createPartyHall({
                partyHallName: partyHallNameModalNew,
                partyHallView: partyHallViewModalNew,
                partyHallDescription: partyHallDescriptionModalNew,
                partyHallSize: partyHallSizeModalNew,
                partyHallOccupancy: partyHallOccupancyModalNew,
                partyHallPrice: partyHallPriceModalNew,
                floorId: floorIdModalNew,
                partyHallTypeId: partyHallTypeIdModalNew,
                partyHallImageList: partyHallImageListModalNew
            });
            if (!createPartyHallRes) {
                // Toast
                const dataToast = { message: createPartyHallRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }
            setReRenderData(prev => !prev); //Render lại csdl ở Compo cha là - DanhMucMain & DanhMucRight.jsx
            setShowModal(prev => !prev);
            setPartyHallImageListModalNew([]);  //Làm rỗng mảng hình
            // Toast
            const dataToast = { message: createPartyHallRes.data.message, type: "success" };
            showToastFromOut(dataToast);
            return;
        } catch (err) {
            setReRenderData(prev => !prev); //Render lại csdl ở Compo cha là - DanhMucMain & DanhMucRight.jsx
            setShowModal(prev => !prev);
            // Toast
            const dataToast = { message: err.response.data.message, type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
    }

    // State chứa mảng floor và party hall type - Lấy về floor và party hall type để hiện select-option
    const [floorList, setFloorList] = useState([]);
    const [partyHallTypeList, setPartyHallTypeList] = useState([]);
    useEffect(() => {
        const getFloorList = async () => {
            try {
                const floorListRes = await FloorService.getFloors();
                setFloorList(floorListRes.data.data);
            } catch (err) {
                console.log("Lỗi lấy floor list: ", err.response);
            }
        }
        getFloorList();
        const getPartyHallTypeList = async () => {
            try {
                const partyHallTypeListRes = await PartyHallTypeService.getAllPartyHallTypes();
                setPartyHallTypeList(partyHallTypeListRes.data.data);
            } catch (err) {
                console.log("Lỗi lấy party hall type list: ", err.response);
            }
        }
        getPartyHallTypeList();
    }, [partyHall]);

    // =============== Xử lý cập nhật Room ===============
    // STATE
    const [partyHallModal, setPartyHallModal] = useState();
    const [partyHallIdModal, setPartyHallIdModal] = useState();
    const [partyHallTypeIdModal, setPartyHallTypeIdModal] = useState();
    const [floorIdModal, setFloorIdModal] = useState();
    const [partyHallNameModal, setPartyHallNameModal] = useState();
    const [partyHallViewModal, setPartyHallViewModal] = useState();
    const [partyHallDescriptionModal, setPartyHallDescriptionModal] = useState();
    const [partyHallSizeModal, setPartyHallSizeModal] = useState();
    const [partyHallOccupancyModal, setPartyHallOccupancyModal] = useState();
    const [partyHallPriceModal, setPartyHallPriceModal] = useState();
    const [partyHallImageListModal, setPartyHallImageListModal] = useState([]);
    const [partyHallImageListModalChange, setPartyHallImageListModalChange] = useState([]);

    const [partyHallModalOld, setPartyHallModalOld] = useState();
    const [partyHallTypeIdModalOld, setPartyHallTypeIdModalOld] = useState();
    const [floorIdModalOld, setFloorIdModalOld] = useState();
    const [partyHallNameModalOld, setPartyHallNameModalOld] = useState();
    const [partyHallViewModalOld, setPartyHallViewModalOld] = useState();
    const [partyHallDescriptionModalOld, setPartyHallDescriptionModalOld] = useState();
    const [partyHallSizeModalOld, setPartyHallSizeModalOld] = useState();
    const [partyHallOccupancyModalOld, setPartyHallOccupancyModalOld] = useState();
    const [partyHallPriceModalOld, setPartyHallPriceModalOld] = useState();
    const [partyHallImageListModalOld, setPartyHallImageListModalOld] = useState([]);

    const handleUpdateRoom = async (
        partyHallIdModal,
        partyHallTypeIdModal,
        floorIdModal,
        partyHallNameModal,
        partyHallViewModal,
        partyHallDescriptionModal,
        partyHallSizeModal,
        partyHallOccupancyModal,
        partyHallPriceModal,
        partyHallImageListModal
    ) => {
        try {
            if (partyHallImageListModalChange.length > 0) {
                const updatePartyHallRes = await PartyHallService.updatePartyHall({
                    partyHallName: partyHallNameModal,
                    partyHallView: partyHallViewModal,
                    partyHallDescription: partyHallDescriptionModal,
                    partyHallSize: partyHallSizeModal,
                    partyHallOccupancy: partyHallOccupancyModal,
                    partyHallPrice: partyHallPriceModal,
                    floorId: floorIdModal,
                    partyHallTypeId: partyHallTypeIdModal,
                    partyHallId: partyHallIdModal,
                    partyHallImageList: partyHallImageListModalChange
                });
                if (!updatePartyHallRes) {
                    // Toast
                    const dataToast = { message: updatePartyHallRes.data.message, type: "warning" };
                    showToastFromOut(dataToast);
                    return;
                }
                // Success
                setShowModal(prev => !prev);
                handleClose();
                setPartyHallImageListModalChange([]);
                // Toast
                const dataToast = { message: updatePartyHallRes.data.message, type: "success" };
                showToastFromOut(dataToast);
                return;
            } else {
                const updatePartyHallRes = await PartyHallService.updatePartyHall({
                    partyHallName: partyHallNameModal,
                    partyHallView: partyHallViewModal,
                    partyHallDescription: partyHallDescriptionModal,
                    partyHallSize: partyHallSizeModal,
                    partyHallOccupancy: partyHallOccupancyModal,
                    partyHallPrice: partyHallPriceModal,
                    floorId: floorIdModal,
                    partyHallTypeId: partyHallTypeIdModal,
                    partyHallId: partyHallIdModal,
                    partyHallImageList: partyHallImageListModal
                });
                if (!updatePartyHallRes) {
                    // Toast
                    const dataToast = { message: updatePartyHallRes.data.message, type: "warning" };
                    showToastFromOut(dataToast);
                    return;
                }
                // Success
                setShowModal(prev => !prev);
                handleClose();
                setIsUpdate(prev => !prev);
                // Toast
                const dataToast = { message: updatePartyHallRes.data.message, type: "success" };
                showToastFromOut(dataToast);
                return;
            }
        } catch (err) {
            setShowModal(prev => !prev);
            handleClose();
            // Toast
            const dataToast = { message: err.response.data.message, type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
    }

    const [isUpdate, setIsUpdate] = useState(true);
    useEffect(() => {
        const getPartyHall = async () => {
            try {
                const partyHallRes = await PartyHallService.findPartyHallById({
                    partyHallId: partyHall.party_hall_id
                });
                setPartyHallModal(partyHallRes.data.data);
                setPartyHallIdModal(partyHallRes.data.data.party_hall_id);
                setPartyHallTypeIdModal(partyHallRes.data.data.party_hall_type_id);
                setFloorIdModal(partyHallRes.data.data.floor_id);
                setPartyHallNameModal(partyHallRes.data.data.party_hall_name);
                setPartyHallViewModal(partyHallRes.data.data.party_hall_view);
                setPartyHallDescriptionModal(partyHallRes.data.data.party_hall_description);
                setPartyHallSizeModal(partyHallRes.data.data.party_hall_size);
                setPartyHallOccupancyModal(partyHallRes.data.data.party_hall_occupancy);
                setPartyHallPriceModal(partyHallRes.data.data.party_hall_price);

                setPartyHallModalOld(partyHallRes.data.data);
                setPartyHallTypeIdModalOld(partyHallRes.data.data.party_hall_type_id);
                setFloorIdModalOld(partyHallRes.data.data.floor_id);
                setPartyHallNameModalOld(partyHallRes.data.data.party_hall_name);
                setPartyHallViewModalOld(partyHallRes.data.data.party_hall_view);
                setPartyHallDescriptionModalOld(partyHallRes.data.data.party_hall_description);
                setPartyHallSizeModalOld(partyHallRes.data.data.party_hall_size);
                setPartyHallOccupancyModalOld(partyHallRes.data.data.party_hall_occupancy);
                setPartyHallPriceModalOld(partyHallRes.data.data.party_hall_price);
            } catch (err) {
                console.log("Lỗi lấy PartyHall: ", err.response);
            }
        }
        const getPartyHallImage = async () => {
            try {
                setPartyHallImageListModal([]);
                const partyHallImageListModalRes = await PartyHallImageService.getPartyHallImagesByPartyHallId(partyHall.party_hall_id);
                console.log("partyHallImageListModalRes: ", partyHallImageListModalRes);
                partyHallImageListModalRes.data.data.map((partyHallImage, index) => {
                    setPartyHallImageListModal(prev => {
                        const isHave = partyHallImageListModal.includes(partyHallImage.party_hall_image_content);
                        if (isHave) {
                            return [...prev];
                        } else {
                            return [...prev, partyHallImage.party_hall_image_content];
                        }
                    });
                    setPartyHallImageListModalOld(prev => {
                        const isHave = partyHallImageListModalOld.includes(partyHallImage.party_hall_image_content);
                        if (isHave) {
                            return [...prev];
                        } else {
                            return [...prev, partyHallImage.party_hall_image_content];
                        }
                    });
                })
            } catch (err) {
                console.log("Lỗi lấy hình ảnh sảnh: ", err.response);
            }
        }
        getPartyHall();
        getPartyHallImage();
    }, [partyHall, showModal, isUpdate]);

    useEffect(() => {
        const getImageUpdate = async () => {
            try {
                const partyHallImageUpdateRes = await PartyHallImageService.getPartyHallImagesByPartyHallId(partyHall.party_hall_id);
                partyHallImageUpdateRes.data.data.map((partyHallImage, index) => {
                    setPartyHallImageListModal(prev => {
                        const isHave = partyHallImageListModal.includes(partyHallImage.party_hall_image_content);
                        if (isHave) {
                            return [...prev];
                        } else {
                            return [...prev, partyHallImage.party_hall_image_content];
                        }
                    });
                })
            } catch (err) {
                console.log("Lỗi lấy hình ảnh party hall: ", err.response);
            }
        }
        getImageUpdate();
    }, [isUpdate])
    // Thay đổi hình ảnh
    const handleChangeImg = (hinhmoiarray) => {
        setPartyHallImageListModalChange([]);
        for (let i = 0; i < hinhmoiarray.length; i++) {
            // console.log("hinh moi: ", hinhmoiarray[i]);
            const hinhanhunique = new Date().getTime() + hinhmoiarray[i].name;
            const storage = getStorage(app);
            const storageRef = ref(storage, hinhanhunique);
            const uploadTask = uploadBytesResumable(storageRef, hinhmoiarray[i]);

            // Listen for state changes, errors, and completion of the upload.
            uploadTask.on('state_changed',
                (snapshot) => {
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                        case 'running':
                            console.log('Upload is running');
                            break;
                        default:
                    }
                },
                (error) => {
                    // A full list of error codes is available at
                    // https://firebase.google.com/docs/storage/web/handle-errors
                    switch (error.code) {
                        case 'storage/unauthorized':
                            // User doesn't have permission to access the object
                            break;
                        case 'storage/canceled':
                            // User canceled the upload
                            break;

                        // ...

                        case 'storage/unknown':
                            // Unknown error occurred, inspect error.serverResponse
                            break;
                    }
                },
                () => {
                    // Upload completed successfully, now we can get the download URL
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        console.log('File available at', downloadURL);
                        try {
                            setPartyHallImageListModalChange(prev => [...prev, downloadURL]);
                        } catch (err) {
                            console.log("Lỗi cập nhật hình ảnh:", err);
                        }
                    });
                }
            );
        }
    }

    const handleCloseUpdate = () => {
        // Set lại giá trị cũ sau khi đóng Modal
        setPartyHallModal(partyHallModalOld);
        setPartyHallTypeIdModal(partyHallTypeIdModalOld);
        setFloorIdModal(floorIdModalOld);
        setPartyHallNameModal(partyHallNameModalOld);
        setPartyHallViewModal(partyHallViewModalOld);
        setPartyHallDescriptionModal(partyHallDescriptionModalOld);
        setPartyHallSizeModal(partyHallSizeModalOld);
        setPartyHallOccupancyModal(partyHallOccupancyModalOld);
        setPartyHallPriceModal(partyHallPriceModalOld);

        setShowModal(prev => !prev);
    }
    // =============== Xử lý xóa Sảnh tiệc ===============
    const handleDeletePartyHall = async (partyHallId) => {
        try {
            const deletePartyHallRes = await PartyHallService.deletePartyHall(partyHallId);
            if (!deletePartyHallRes) {
                // Toast
                const dataToast = { message: deletePartyHallRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }
            // Success
            setShowModal(prev => !prev);
            handleClose();  //Đóng thanh tìm kiếm và render lại giá trị mới ở compo Main
            // Toast
            const dataToast = { message: deletePartyHallRes.data.message, type: "success" };
            showToastFromOut(dataToast);
            return;
        } catch (err) {
            // Toast
            const dataToast = { message: err.response.data.message, type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
    }
    // ================================================================
    //  =============== Xem chi tiết Sảnh tiệc ===============
    if (type === "detailPartyHall") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>Chi tiết Sảnh tiệc</H1>
                            <ModalForm>
                                <div className="row">
                                    <div className="col-lg-3">
                                        <ModalFormItem style={{ flex: "1" }}>
                                            <FormSpan>Mã của Sảnh:</FormSpan>
                                            <FormInput type="text" value={partyHallModal ? partyHallModal.party_hall_id : null} readOnly />
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-3">
                                        <ModalFormItem style={{ flex: "1" }}>
                                            <FormSpan>Thuộc Tầng:</FormSpan>
                                            <FormInput type="text" value={partyHallModal ? partyHallModal.floor_name : null} readOnly />
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-3">
                                        <ModalFormItem style={{ flex: "1" }}>
                                            <FormSpan>Loại Sảnh:</FormSpan>
                                            <FormInput type="text" value={partyHallModal ? partyHallModal.party_hall_type_name : null} readOnly />
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-3">
                                        <ModalFormItem>
                                            <FormSpan>Tên Sảnh:</FormSpan>
                                            <FormInput type="text" value={partyHallModal ? partyHallModal.party_hall_name : null} readOnly />
                                        </ModalFormItem>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-4">
                                        <ModalFormItem>
                                            <FormSpan>View hướng:</FormSpan>
                                            <FormInput type="text" value={partyHallModal ? partyHallModal.party_hall_view : null} readOnly />
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-4">
                                        <ModalFormItem>
                                            <FormSpan>Kích thước:</FormSpan>
                                            <FormInput type="text" value={partyHallModal ? partyHallModal.party_hall_size : null} readOnly />
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-4">
                                        <ModalFormItem>
                                            <FormSpan>Sức chứa:</FormSpan>
                                            <FormInput type="text" value={partyHallModal ? partyHallModal.party_hall_occupancy : null} readOnly />
                                        </ModalFormItem>
                                    </div>
                                </div>

                                <ModalFormItem>
                                    <FormSpan>Mô tả về Sảnh:</FormSpan>
                                    <FormTextArea style={{ height: "140px" }} rows="2" cols="50" value={partyHallModal ? partyHallModal.party_hall_description : null} readOnly />
                                </ModalFormItem>

                                <div className="row">
                                    <div className="col-lg-6">
                                        <ModalFormItem>
                                            <FormSpan>Trạng thái:</FormSpan>
                                            <FormInput type="text" value={partyHallModal ? partyHallModal.party_hall_state === 0 ? "Đang trống" : partyHallModal.party_hall_state === 1 ? "Đang bị khóa" : null : null} readOnly />
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-6">
                                        <ModalFormItem>
                                            <FormSpan>Giá Sảnh:</FormSpan>
                                            <FormInput type="text" value={partyHallModal ? partyHallModal.party_hall_price : null} readOnly />
                                        </ModalFormItem>
                                    </div>
                                </div>

                                <ModalChiTietItem>
                                    <FormSpan>Hình ảnh:</FormSpan>
                                    <ImageWrapper>
                                        {
                                            partyHallImageListModal.length > 0   //Khi mảng hình có hình thì hiện các hình trong mảng
                                                ?
                                                partyHallImageListModal.map((partyHallImage, index) => {
                                                    return (
                                                        <FormImg src={partyHallImage} />
                                                    );
                                                })
                                                :   //Khi mảng hình trống thì hiện No Available Image
                                                <FormImg src={"https://firebasestorage.googleapis.com/v0/b/longpets-50c17.appspot.com/o/1650880603321No-Image-Placeholder.svg.png?alt=media&token=2a1b17ab-f114-41c0-a00d-dd81aea80d3e"} />
                                        }
                                    </ImageWrapper>
                                </ModalChiTietItem>

                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => setShowModal(prev => !prev)}
                                    >Đóng</ButtonClick>
                                </ButtonContainer>
                            </ButtonUpdate>
                            <CloseModalButton
                                aria-label="Close modal"
                                onClick={() => setShowModal(prev => !prev)}
                            >
                                <CloseOutlined />
                            </CloseModalButton>
                        </ModalWrapper>
                    </Background>
                ) : null}
            </>
        );
    }
    //  =============== Thêm Room ===============
    if (type === "createPartyHall") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>Thêm Sảnh tiệc mới</H1>
                            <ModalForm>
                                <div className="row">
                                    <div className="col-lg-4">
                                        <ModalFormItem style={{ flex: "1" }}>
                                            <FormSpan>Sảnh tiệc thuộc Tầng:</FormSpan>
                                            <FormSelect onChange={(e) => { setFloorIdModalNew(parseInt(e.target.value)) }}>
                                                {
                                                    floorList.map((floor, key) => {
                                                        return (
                                                            <FormOption value={floor.floor_id}>{floor.floor_name}</FormOption>
                                                        )
                                                    })
                                                }
                                            </FormSelect>
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-4">
                                        <ModalFormItem style={{ flex: "1" }}>
                                            <FormSpan>Sảnh tiệc thuộc Loại:</FormSpan>
                                            <FormSelect onChange={(e) => { setPartyHallTypeIdModalNew(parseInt(e.target.value)) }}>
                                                {
                                                    partyHallTypeList.map((partyHallType, key) => {
                                                        return (
                                                            <FormOption value={partyHallType.party_hall_type_id}>{partyHallType.party_hall_type_name}</FormOption>
                                                        )
                                                    })
                                                }
                                            </FormSelect>
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-4">
                                        <ModalFormItem>
                                            <FormSpan>Tên Sảnh tiệc:</FormSpan>
                                            <FormInput type="text" onChange={(e) => setPartyHallNameModalNew(e.target.value)} placeholder="Nhập vào tên Sảnh tiệc" />
                                        </ModalFormItem>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-4">
                                        <ModalFormItem>
                                            <FormSpan>View hướng:</FormSpan>
                                            <FormInput type="text" onChange={(e) => setPartyHallViewModalNew(e.target.value)} placeholder="Nhập vào tên Sảnh tiệc" />
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-4">
                                        <ModalFormItem>
                                            <FormSpan>Kích thước:</FormSpan>
                                            <FormInput type="text" onChange={(e) => setPartyHallSizeModalNew(e.target.value)} placeholder="Nhập vào Kích thước Sảnh tiệc" />
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-4">
                                        <ModalFormItem>
                                            <FormSpan>Sức chứa:</FormSpan>
                                            <FormInput type="number" min={1} onChange={(e) => setPartyHallOccupancyModalNew(parseInt(e.target.value))} placeholder="Nhập vào Sức chứa Sảnh tiệc" />
                                        </ModalFormItem>
                                    </div>
                                </div>

                                <ModalFormItem>
                                    <FormSpan>Mô tả về Sảnh tiệc:</FormSpan>
                                    <FormTextArea rows="2" cols="50" onChange={(e) => setPartyHallDescriptionModalNew(e.target.value)} placeholder="Mô tả về Sảnh tiệc này" />
                                </ModalFormItem>

                                <ModalFormItem>
                                    <FormSpan>Giá Sảnh tiệc:</FormSpan>
                                    <FormInput type="number" min={1} onChange={(e) => setPartyHallPriceModalNew(parseInt(e.target.value))} placeholder="Giá của Sảnh tiệc này" />
                                </ModalFormItem>

                                <ModalChiTietItem>
                                    <FormSpan>Hình ảnh:</FormSpan>
                                    <FormInput type="file" multiple onChange={(e) => handleShowImg(e.target.files)} />
                                    <ImageWrapper>
                                        {
                                            partyHallImageListModalNew.length > 0   //Khi mảng hình có hình thì hiện các hình trong mảng
                                                ?
                                                partyHallImageListModalNew.map((partyHallImage, index) => {
                                                    return (
                                                        <FormImg src={partyHallImage} />
                                                    );
                                                })
                                                :   //Khi mảng hình trống thì hiện No Available Image
                                                <FormImg src={"https://firebasestorage.googleapis.com/v0/b/longpets-50c17.appspot.com/o/1650880603321No-Image-Placeholder.svg.png?alt=media&token=2a1b17ab-f114-41c0-a00d-dd81aea80d3e"} />
                                        }
                                    </ImageWrapper>
                                </ModalChiTietItem>

                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() =>
                                            handleCreatePartyHall(
                                                partyHallTypeIdModalNew,
                                                floorIdModalNew,
                                                partyHallNameModalNew,
                                                partyHallViewModalNew,
                                                partyHallDescriptionModalNew,
                                                partyHallSizeModalNew,
                                                partyHallOccupancyModalNew,
                                                partyHallPriceModalNew,
                                                partyHallImageListModalNew
                                            )}
                                    >Thêm vào</ButtonClick>
                                </ButtonContainer>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => setShowModal(prev => !prev)}
                                    >Hủy bỏ</ButtonClick>
                                </ButtonContainer>
                            </ButtonUpdate>
                            <CloseModalButton
                                aria-label="Close modal"
                                onClick={() => setShowModal(prev => !prev)}
                            >
                                <CloseOutlined />
                            </CloseModalButton>
                        </ModalWrapper>
                    </Background>
                ) : null}
            </>
        );
    }
    //  =============== Cập nhật Room ===============
    if (type === "updatePartyHall") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>Cập nhật Sảnh tiệc</H1>
                            <ModalForm>
                                <div className="row">
                                    <div className="col-lg-4">
                                        <ModalFormItem style={{ flex: "1" }}>
                                            <FormSpan>Sảnh tiệc thuộc Tầng:</FormSpan>
                                            <FormSelect onChange={(e) => { setFloorIdModal(parseInt(e.target.value)) }}>
                                                {floorList.map((floor, key) => {
                                                    if (floor.floor_id === floorIdModal) {
                                                        return (
                                                            <FormOption value={floor.floor_id} selected> {floor.floor_name} </FormOption>
                                                        )
                                                    } else {
                                                        return (
                                                            <FormOption value={floor.floor_id}> {floor.floor_name} </FormOption>
                                                        )
                                                    }
                                                })}
                                            </FormSelect>
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-4">
                                        <ModalFormItem style={{ flex: "1" }}>
                                            <FormSpan>Sảnh tiệc thuộc Loại:</FormSpan>
                                            <FormSelect onChange={(e) => { setPartyHallTypeIdModal(parseInt(e.target.value)) }}>
                                                {partyHallTypeList.map((partyHallType, key) => {
                                                    if (partyHallType.party_hall_type_id === partyHallTypeIdModal) {
                                                        return (
                                                            <FormOption value={partyHallType.party_hall_type_id} selected> {partyHallType.party_hall_type_name} </FormOption>
                                                        )
                                                    } else {
                                                        return (
                                                            <FormOption value={partyHallType.party_hall_type_id}> {partyHallType.party_hall_type_name} </FormOption>
                                                        )
                                                    }
                                                })}
                                            </FormSelect>
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-4">
                                        <ModalFormItem>
                                            <FormSpan>Tên Sảnh tiệc:</FormSpan>
                                            <FormInput type="text" onChange={(e) => setPartyHallNameModal(e.target.value)} value={partyHallNameModal} maxLength={150} />
                                        </ModalFormItem>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-4">
                                        <ModalFormItem>
                                            <FormSpan>View hướng:</FormSpan>
                                            <FormInput type="text" onChange={(e) => setPartyHallViewModal(e.target.value)} value={partyHallViewModal} maxLength={150} />
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-4">
                                        <ModalFormItem>
                                            <FormSpan>Kích thước:</FormSpan>
                                            <FormInput type="text" onChange={(e) => setPartyHallSizeModal(e.target.value)} value={partyHallSizeModal} maxLength={150} />
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-4">
                                        <ModalFormItem>
                                            <FormSpan>Sức chứa:</FormSpan>
                                            <FormInput type="number" min={1} onChange={(e) => setPartyHallOccupancyModal(parseInt(e.target.value))} value={partyHallOccupancyModal} />
                                        </ModalFormItem>
                                    </div>
                                </div>

                                <ModalFormItem>
                                    <FormSpan>Mô tả về Sảnh tiệc:</FormSpan>
                                    <FormTextArea rows="2" cols="50" onChange={(e) => setPartyHallDescriptionModal(e.target.value)} value={partyHallDescriptionModal} maxLength={150} />
                                </ModalFormItem>

                                <div className="row">
                                    <div className="col-lg-12">
                                        <ModalFormItem>
                                            <FormSpan>Giá Sảnh tiệc:</FormSpan>
                                            <FormInput type="number" min={1} onChange={(e) => setPartyHallPriceModal(parseInt(e.target.value))} value={partyHallPriceModal} />
                                        </ModalFormItem>
                                    </div>
                                </div>

                                <ModalChiTietItem>
                                    <FormSpan>Hình ảnh:</FormSpan>
                                    <FormInput type="file" multiple onChange={(e) => handleChangeImg(e.target.files)} />
                                    <ImageWrapper>
                                        {
                                            partyHallImageListModalChange.length > 0   //Khi mảng hình có hình thì hiện các hình trong mảng
                                                ?
                                                partyHallImageListModalChange.map((partyHallImage, key) => {
                                                    return (
                                                        <FormImg src={partyHallImage} />
                                                    );
                                                })
                                                :
                                                partyHallImageListModal.length > 0
                                                    ?
                                                    partyHallImageListModal.map((partyHallImage, key) => {
                                                        return (
                                                            <FormImg src={partyHallImage} />
                                                        );
                                                    })
                                                    : null
                                        }
                                    </ImageWrapper>
                                </ModalChiTietItem>

                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() =>
                                            handleUpdateRoom(
                                                partyHallIdModal,
                                                partyHallTypeIdModal,
                                                floorIdModal,
                                                partyHallNameModal,
                                                partyHallViewModal,
                                                partyHallDescriptionModal,
                                                partyHallSizeModal,
                                                partyHallOccupancyModal,
                                                partyHallPriceModal,
                                                partyHallImageListModal
                                            )}
                                    >Cập nhật</ButtonClick>
                                </ButtonContainer>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => handleCloseUpdate()}
                                    >Hủy bỏ</ButtonClick>
                                </ButtonContainer>
                            </ButtonUpdate>
                            <CloseModalButton
                                aria-label="Close modal"
                                onClick={() => handleCloseUpdate()}
                            >
                                <CloseOutlined />
                            </CloseModalButton>
                        </ModalWrapper>
                    </Background>
                ) : null}
            </>
        );
    }
    // =============== Xóa Sảnh tiệc ===============
    if (type === "deletePartyHall") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ backgroundImage: `url("https://img.freepik.com/free-vector/alert-safety-background_97886-3460.jpg?w=1060")`, backgroundPosition: `center center`, backgroundRepeat: `no-repeat`, backgroundSize: `cover`, width: `600px`, height: `400px` }} >
                            <ModalContent>
                                <H1Delete>Bạn muốn xóa Sảnh tiệc <span style={{ color: `var(--color-primary)` }}>{partyHallNameModal}</span> này?</H1Delete>
                                <p>Click Đồng ý nếu bạn muốn thực hiện hành động này!</p>
                                <Button>
                                    <ButtonContainer>
                                        <ButtonClick
                                            onClick={() => { handleDeletePartyHall(partyHallIdModal) }}
                                        >Đồng ý</ButtonClick>
                                    </ButtonContainer>
                                    <ButtonContainer>
                                        <ButtonClick
                                            onClick={() => setShowModal(prev => !prev)}
                                        >Hủy bỏ</ButtonClick>
                                    </ButtonContainer>
                                </Button>
                            </ModalContent>
                            <CloseModalButton
                                aria-label="Close modal"
                                onClick={() => setShowModal(prev => !prev)}
                            >
                                <CloseOutlined />
                            </CloseModalButton>
                        </ModalWrapper>
                    </Background>
                ) : null}
            </>
        );
    }
};

export default Modal;