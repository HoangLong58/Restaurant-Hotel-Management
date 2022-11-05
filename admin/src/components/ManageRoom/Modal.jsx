import { ClearOutlined, CloseOutlined, KeyboardReturnTwoTone } from "@mui/icons-material";
import { Box, Checkbox, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import app from "../../firebase";

// SERVICES
import * as FloorService from "../../service/FloorService";
import * as RoomImageService from "../../service/RoomImageService";
import * as RoomService from "../../service/RoomService";
import * as RoomTypeService from "../../service/RoomTypeService";
import * as DeviceDetailService from "../../service/DeviceDetailService";
import * as DeviceService from "../../service/DeviceService";
import * as DeviceTypeService from "../../service/DeviceTypeService";
import * as RoomEmployeeService from "../../service/RoomEmployeeService";
import * as PositionService from "../../service/PositionService";
import * as EmployeeService from "../../service/EmployeeService";


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

const Modal = ({ showModal, setShowModal, type, room, roomAddEmployee, setReRenderData, handleClose, showToastFromOut }) => {
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

    // ==================== Xử lý thêm Phòng ====================
    useEffect(() => {
        setRoomImageListModalNew([]);
        setRoomImageListModalChange([]);
        setEmployeeChooseList([]);
    }, [showModal]);
    // STATE
    const [roomTypeIdModalNew, setRoomTypeIdModalNew] = useState();
    const [floorIdModalNew, setFloorIdModalNew] = useState();
    const [roomNameModalNew, setRoomNameModalNew] = useState();
    const [roomViewModalNew, setRoomViewModalNew] = useState();
    const [roomFeatureModalNew, setRoomFeatureModalNew] = useState();
    const [roomSizeModalNew, setRoomSizeModalNew] = useState();
    const [roomDescriptionModalNew, setRoomDescriptionModalNew] = useState();
    const [roomAdultQuantityModalNew, setRoomAdultQuantityModalNew] = useState();
    const [roomChildQuantityModalNew, setRoomChildQuantityModalNew] = useState();
    const [roomPriceModalNew, setRoomPriceModalNew] = useState();
    const [roomImageListModalNew, setRoomImageListModalNew] = useState([]);

    // Thay đổi hình ảnh
    const handleShowImg = (hinhmoiarray) => {
        // Chạy vòng lặp thêm từng hình trong mảng lên firebase rồi lưu vô mảng [roomImageListModalNew] ở modal Thêm Phòng
        setRoomImageListModalNew([]);
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
                            setRoomImageListModalNew(prev => [...prev, downloadURL]);
                            console.log("Up thành công 1 hình: ", downloadURL);
                        } catch (err) {
                            console.log("Lỗi show hình ảnh:", err);
                        }
                    });
                }
            );
        }
    }

    const handleCreateRoom = async (
        roomTypeIdModalNew,
        floorIdModalNew,
        roomNameModalNew,
        roomViewModalNew,
        roomFeatureModalNew,
        roomSizeModalNew,
        roomDescriptionModalNew,
        roomAdultQuantityModalNew,
        roomChildQuantityModalNew,
        roomPriceModalNew,
        roomImageListModalNew  //Mảng hình nhe
    ) => {
        try {
            const createRoomRes = await RoomService.createRoom({
                roomTypeId: roomTypeIdModalNew,
                floorId: floorIdModalNew,
                roomName: roomNameModalNew,
                roomView: roomViewModalNew,
                roomFeature: roomFeatureModalNew,
                roomSize: roomSizeModalNew,
                roomDescription: roomDescriptionModalNew,
                roomAdultQuantity: roomAdultQuantityModalNew,
                roomChildQuantity: roomChildQuantityModalNew,
                roomPrice: roomPriceModalNew,
                roomImageList: roomImageListModalNew
            });
            if (!createRoomRes) {
                // Toast
                const dataToast = { message: createRoomRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }
            setReRenderData(prev => !prev); //Render lại csdl ở Compo cha là - DanhMucMain & DanhMucRight.jsx
            setShowModal(prev => !prev);
            setRoomImageListModalNew([]);  //Làm rỗng mảng hình
            // Toast
            const dataToast = { message: createRoomRes.data.message, type: "success" };
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

    // State chứa mảng floor và room type - Lấy về floor và room type để hiện select-option
    const [floorList, setFloorList] = useState([]);
    const [roomTypeList, setRoomTypeList] = useState([]);
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
        const getRoomTypeList = async () => {
            try {
                const roomTypeListRes = await RoomTypeService.getRoomTypes();
                setRoomTypeList(roomTypeListRes.data.data);
            } catch (err) {
                console.log("Lỗi lấy room type list: ", err.response);
            }
        }
        getRoomTypeList();
    }, [room]);

    // =============== Xử lý cập nhật Room ===============
    // STATE
    const [roomModal, setRoomModal] = useState();
    const [roomIdModal, setRoomIdModal] = useState();
    const [roomTypeIdModal, setRoomTypeIdModal] = useState();
    const [floorIdModal, setFloorIdModal] = useState();
    const [roomNameModal, setRoomNameModal] = useState();
    const [roomViewModal, setRoomViewModal] = useState();
    const [roomFeatureModal, setRoomFeatureModal] = useState();
    const [roomSizeModal, setRoomSizeModal] = useState();
    const [roomDescriptionModal, setRoomDescriptionModal] = useState();
    const [roomAdultQuantityModal, setRoomAdultQuantityModal] = useState();
    const [roomChildQuantityModal, setRoomChildQuantityModal] = useState();
    const [roomPriceModal, setRoomPriceModal] = useState();
    const [roomImageListModal, setRoomImageListModal] = useState([]);
    const [roomImageListModalChange, setRoomImageListModalChange] = useState([]);

    const [roomModalOld, setRoomModalOld] = useState();
    const [roomTypeIdModalOld, setRoomTypeIdModalOld] = useState();
    const [floorIdModalOld, setFloorIdModalOld] = useState();
    const [roomNameModalOld, setRoomNameModalOld] = useState();
    const [roomViewModalOld, setRoomViewModalOld] = useState();
    const [roomFeatureModalOld, setRoomFeatureModalOld] = useState();
    const [roomSizeModalOld, setRoomSizeModalOld] = useState();
    const [roomDescriptionModalOld, setRoomDescriptionModalOld] = useState();
    const [roomAdultQuantityModalOld, setRoomAdultQuantityModalOld] = useState();
    const [roomChildQuantityModalOld, setRoomChildQuantityModalOld] = useState();
    const [roomPriceModalOld, setRoomPriceModalOld] = useState();
    const [roomImageListModalOld, setRoomImageListModalOld] = useState([]);

    const handleUpdateRoom = async (
        roomIdModal,
        roomTypeIdModal,
        floorIdModal,
        roomNameModal,
        roomViewModal,
        roomFeatureModal,
        roomSizeModal,
        roomDescriptionModal,
        roomAdultQuantityModal,
        roomChildQuantityModal,
        roomPriceModal,
        roomImageListModal
    ) => {
        try {
            if (roomImageListModalChange.length > 0) {
                const updateRoomRes = await RoomService.updateRoom({
                    roomId: roomIdModal,
                    roomTypeId: roomTypeIdModal,
                    floorId: floorIdModal,
                    roomName: roomNameModal,
                    roomView: roomViewModal,
                    roomFeature: roomFeatureModal,
                    roomSize: roomSizeModal,
                    roomDescription: roomDescriptionModal,
                    roomAdultQuantity: roomAdultQuantityModal,
                    roomChildQuantity: roomChildQuantityModal,
                    roomPrice: roomPriceModal,
                    roomImageList: roomImageListModalChange
                });
                if (!updateRoomRes) {
                    // Toast
                    const dataToast = { message: updateRoomRes.data.message, type: "warning" };
                    showToastFromOut(dataToast);
                    return;
                }
                // Success
                setShowModal(prev => !prev);
                handleClose();
                setRoomImageListModalChange([]);
                // Toast
                const dataToast = { message: updateRoomRes.data.message, type: "success" };
                showToastFromOut(dataToast);
                return;
            } else {
                const updateRoomRes = await RoomService.updateRoom({
                    roomId: roomIdModal,
                    roomTypeId: roomTypeIdModal,
                    floorId: floorIdModal,
                    roomName: roomNameModal,
                    roomView: roomViewModal,
                    roomFeature: roomFeatureModal,
                    roomSize: roomSizeModal,
                    roomDescription: roomDescriptionModal,
                    roomAdultQuantity: roomAdultQuantityModal,
                    roomChildQuantity: roomChildQuantityModal,
                    roomPrice: roomPriceModal,
                    roomImageList: roomImageListModal
                });
                if (!updateRoomRes) {
                    // Toast
                    const dataToast = { message: updateRoomRes.data.message, type: "warning" };
                    showToastFromOut(dataToast);
                    return;
                }
                // Success
                setShowModal(prev => !prev);
                handleClose();
                setIsUpdate(prev => !prev);
                // Toast
                const dataToast = { message: updateRoomRes.data.message, type: "success" };
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

    useEffect(() => {
        const getRoom = async () => {
            try {
                const roomRes = await RoomService.findRoomById({
                    roomId: room.room_id
                });
                setRoomModal(roomRes.data.data);
                setRoomIdModal(roomRes.data.data.room_id);
                setRoomTypeIdModal(roomRes.data.data.room_type_id);
                setFloorIdModal(roomRes.data.data.floor_id);
                setRoomNameModal(roomRes.data.data.room_name);
                setRoomViewModal(roomRes.data.data.room_view);
                setRoomFeatureModal(roomRes.data.data.room_feature);
                setRoomSizeModal(roomRes.data.data.room_size);
                setRoomDescriptionModal(roomRes.data.data.room_description);
                setRoomAdultQuantityModal(roomRes.data.data.room_adult_quantity);
                setRoomChildQuantityModal(roomRes.data.data.room_child_quantity);
                setRoomPriceModal(roomRes.data.data.room_price);

                setRoomModalOld(roomRes.data.data);
                setRoomTypeIdModalOld(roomRes.data.data.room_type_id);
                setFloorIdModalOld(roomRes.data.data.floor_id);
                setRoomNameModalOld(roomRes.data.data.room_name);
                setRoomViewModalOld(roomRes.data.data.room_view);
                setRoomFeatureModalOld(roomRes.data.data.room_feature);
                setRoomSizeModalOld(roomRes.data.data.room_size);
                setRoomDescriptionModalOld(roomRes.data.data.room_description);
                setRoomAdultQuantityModalOld(roomRes.data.data.room_adult_quantity);
                setRoomChildQuantityModalOld(roomRes.data.data.room_child_quantity);
                setRoomPriceModalOld(roomRes.data.data.room_price);
            } catch (err) {
                console.log("Lỗi lấy room: ", err.response);
            }
        }
        const getRoomImage = async () => {
            try {
                setRoomImageListModal([]);
                const roomImageListModalRes = await RoomImageService.getRoomImagesByRoomId(room.room_id);
                console.log("roomImageListModalRes: ", roomImageListModalRes);
                roomImageListModalRes.data.data.map((roomImage, index) => {
                    setRoomImageListModal(prev => {
                        const isHave = roomImageListModal.includes(roomImage.room_image_content);
                        if (isHave) {
                            return [...prev];
                        } else {
                            return [...prev, roomImage.room_image_content];
                        }
                    });
                    setRoomImageListModalOld(prev => {
                        const isHave = roomImageListModalOld.includes(roomImage.room_image_content);
                        if (isHave) {
                            return [...prev];
                        } else {
                            return [...prev, roomImage.room_image_content];
                        }
                    });
                })
            } catch (err) {
                console.log("Lỗi lấy hình ảnh thú cưng: ", err.response);
            }
        }
        const getRoomAndImageWhenAddDevice = async () => {
            try {
                const roomRes = await RoomService.findRoomAndImageWhenAddDeviceByRoomId(room.room_id);
                setRoomModalAddDevice(roomRes.data.data);
            } catch (err) {
                console.log("Lỗi lấy room modal add device: ", err.response);
            }
        }
        const getAllDeviceTypes = async () => {
            try {
                const deviceTypeRes = await DeviceTypeService.getDeviceTypes();
                setAllDeviceTypeListAddDevice(deviceTypeRes.data.data);
            } catch (err) {
                console.log("Lỗi lấy device type: ", err.response);
            }
        }
        if (room) {
            getRoom();
            getRoomImage();
            getRoomAndImageWhenAddDevice();
            getAllDeviceTypes();
        }
    }, [room, showModal]);

    const [isUpdate, setIsUpdate] = useState(true);
    useEffect(() => {
        const getImageUpdate = async () => {
            try {
                const roomImageUpdateRes = await RoomImageService.getRoomImagesByRoomId(room.room_id);
                setRoomImageListModal(roomImageUpdateRes.data.data);
            } catch (err) {
                console.log("Lỗi lấy hình ảnh room: ", err.response);
            }
        }
        getImageUpdate();
    }, [isUpdate])
    // Thay đổi hình ảnh
    const handleChangeImg = (hinhmoiarray) => {
        setRoomImageListModalChange([]);
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
                            setRoomImageListModalChange(prev => [...prev, downloadURL]);
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
        setRoomModal(roomModalOld);
        setRoomTypeIdModal(roomTypeIdModalOld);
        setFloorIdModal(floorIdModalOld);
        setRoomNameModal(roomNameModalOld);
        setRoomViewModal(roomViewModalOld);
        setRoomFeatureModal(roomFeatureModalOld);
        setRoomSizeModal(roomSizeModalOld);
        setRoomDescriptionModal(roomDescriptionModalOld);
        setRoomAdultQuantityModal(roomAdultQuantityModalOld);
        setRoomChildQuantityModal(roomChildQuantityModalOld);
        setRoomPriceModal(roomPriceModalOld);

        setShowModal(prev => !prev);
    }
    // =============== Xử lý xóa Phòng ===============
    const handleDeleteRoom = async (roomId) => {
        try {
            const deleteRoomRes = await RoomService.deleteRoom(roomId);
            if (!deleteRoomRes) {
                // Toast
                const dataToast = { message: deleteRoomRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }
            // Success
            setShowModal(prev => !prev);
            handleClose();  //Đóng thanh tìm kiếm và render lại giá trị mới ở compo Main
            // Toast
            const dataToast = { message: deleteRoomRes.data.message, type: "success" };
            showToastFromOut(dataToast);
            return;
        } catch (err) {
            // Toast
            const dataToast = { message: err.response.data.message, type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
    }

    // Add device
    const [isUpdateAddDeviceModal, setIsUpdateAddDeviceModal] = useState(true);
    const [roomModalAddDevice, setRoomModalAddDevice] = useState();
    const [deviceTypeIdModalAddDevice, setDeviceTypeIdModalAddDevice] = useState();
    const [deviceListAddDevice, setDeviceListAddDevice] = useState([]);
    const [deviceDetailListAddDevice, setDeviceDetailListAddDevice] = useState([]);
    const [allDeviceTypeListAddDevice, setAllDeviceTypeListAddDevice] = useState([]);
    useEffect(() => {
        // Lấy thiết bị mà phòng chưa có
        const getAllDeviceByDeviceTypeIdAndRoomId = async () => {
            try {
                const deviceListRes = await DeviceService.getAllDeviceByDeviceTypeIdAndRoomId({
                    deviceTypeId: deviceTypeIdModalAddDevice,
                    roomId: room.room_id
                });
                setDeviceListAddDevice(deviceListRes.data.data);
            } catch (err) {
                console.log("ERR: ", err.response);
            }
        };
        // Lấy những Thiết bị của Phòng
        const getDeviceDetailByRoomId = async () => {
            try {
                const deviceDetailListRes = await DeviceDetailService.getDeviceDetailsByRoomId(room.room_id);
                setDeviceDetailListAddDevice(deviceDetailListRes.data.data);
            } catch (err) {
                console.log("ERR: ", err.response);
            }
        };
        if (room && !deviceTypeIdModalAddDevice) {
            getDeviceDetailByRoomId();
        }
        if (room && deviceTypeIdModalAddDevice) {
            getAllDeviceByDeviceTypeIdAndRoomId();
            getDeviceDetailByRoomId();
        }
    }, [room, showModal, deviceTypeIdModalAddDevice, isUpdateAddDeviceModal]);

    // Xóa Thiết bị
    const handleDeleteDeviceDetail = async (deviceDetailId) => {
        try {
            const deleteDeviceDetailRes = await DeviceDetailService.deleteDeviceDetailByDeviceDetailId(deviceDetailId);
            if (!deleteDeviceDetailRes) {
                // Toast
                const dataToast = { message: deleteDeviceDetailRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }
            //  Success
            setIsUpdateAddDeviceModal(prev => !prev);

            // Toast
            const dataToast = { message: deleteDeviceDetailRes.data.message, type: "success" };
            showToastFromOut(dataToast);
        } catch (err) {
            // Toast
            const dataToast = { message: err.response.data.message, type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
    };

    // Create device detail check box
    const [deviceChooseList, setDeviceChooseList] = useState([]);
    const handleCheckDevice = (e) => {
        setIsUpdateAddDeviceModal(prev => !prev);
        const value = parseInt(e.target.value);
        if (e.currentTarget.checked) {
            if (!deviceChooseList.includes(value)) {
                deviceChooseList.push(value);
            }
        } else {
            if (deviceChooseList.includes(value)) {
                let index = deviceChooseList.indexOf(value);
                deviceChooseList.splice(index, 1);
            }
        }
        console.log("deviceChooseList: ", deviceChooseList);
    };
    const handleCreateDetailDevice = async (e, deviceChooseList, roomIdModal) => {
        console.log("e, deviceChooseList, roomIdModal: ", e, deviceChooseList, roomIdModal)
        e.preventDefault();
        try {
            const createDeviceListRes = await DeviceDetailService.createDeviceDetailByListDeviceId({
                deviceListId: deviceChooseList,
                roomId: roomIdModal
            });
            if (!createDeviceListRes) {
                // Toast
                const dataToast = { message: createDeviceListRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }
            //  Success
            setIsUpdateAddDeviceModal(prev => !prev);
            setDeviceChooseList([]);   //Thêm thành công thì bỏ mảng chọn cũ

            // Toast
            const dataToast = { message: createDeviceListRes.data.message, type: "success" };
            showToastFromOut(dataToast);
        } catch (err) {
            // Toast
            const dataToast = { message: err.response.data.message, type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
    };
    const handleCancleCreateDetailDevice = async (e, deviceChooseList) => {
        e.preventDefault();
        if (deviceChooseList.length === 0) {
            // Toast
            const dataToast = { message: "Bạn vẫn chưa chọn Thiết bị nào!", type: "warning" };
            showToastFromOut(dataToast);
            return;
        } else {
            setDeviceChooseList([]);
            setIsUpdateAddDeviceModal(prev => !prev);
            // Toast
            const dataToast = { message: "Hủy chọn thành công!", type: "success" };
            showToastFromOut(dataToast);
            return;
        }
    };

    // ADD EMPLOYEE
    const [roomModalAddEmployee, setRoomModalAddEmployee] = useState();
    const [roomIdModalAddEmployee, setRoomIdModalAddEmployee] = useState();
    const [positionIdModalAddEmployee, setPositionIdModalAddEmployee] = useState();
    const [isUpdateAddEmployeeModal, setIsUpdateAddEmployeeModal] = useState();
    const [roomEmployeeListAddEmployee, setRoomEmployeeListAddEmployee] = useState([]);
    const [employeeListAddEmployee, setEmployeeListAddEmployee] = useState([]);
    // Lấy Chức vụ
    const [positionList, setPositionList] = useState([]);
    useEffect(() => {
        const getPositions = async () => {
            try {
                const positionRes = await PositionService.getPositions();
                setPositionList(positionRes.data.data);
            } catch (err) {
                console.log("Lỗi lấy position: ", err.response);
            }
        }
        getPositions();
    }, []);

    useEffect(() => {
        // Lấy thông tin phòng cần thêm nhân viên
        const getRoomAndImageWhenAddEmployee = async () => {
            try {
                const roomRes = await RoomService.findRoomAndImageWhenAddDeviceByRoomId(roomAddEmployee.room_id);
                setRoomModalAddEmployee(roomRes.data.data);
                setRoomIdModalAddEmployee(roomRes.data.data.room_id);
            } catch (err) {
                console.log("Lỗi lấy room modal add employee: ", err.response);
            }
        }
        // Lấy Nhân viên mà phòng chưa có
        const getAllEmployeeByPositionIdAndRoomId = async () => {
            try {
                const employeeListRes = await EmployeeService.getAllEmployeeByPositionIdAndRoomId({
                    positionId: positionIdModalAddEmployee,
                    roomId: roomAddEmployee.room_id
                });
                setEmployeeListAddEmployee(employeeListRes.data.data);
            } catch (err) {
                console.log("ERR: ", err.response);
            }
        };
        // Lấy những Room employee của Phòng
        const getAllRoomEmployeeByRoomId = async () => {
            try {
                const roomEmployeeListRes = await RoomEmployeeService.getAllRoomEmployeeByRoomId(roomAddEmployee.room_id);
                setRoomEmployeeListAddEmployee(roomEmployeeListRes.data.data);
            } catch (err) {
                console.log("ERR: ", err.response);
            }
        };
        if (roomAddEmployee && !positionIdModalAddEmployee) {
            getRoomAndImageWhenAddEmployee();
            getAllRoomEmployeeByRoomId();
        }
        if (roomAddEmployee && positionIdModalAddEmployee) {
            getRoomAndImageWhenAddEmployee();
            getAllRoomEmployeeByRoomId();
            getAllEmployeeByPositionIdAndRoomId();
        }
    }, [roomAddEmployee, showModal, positionIdModalAddEmployee, isUpdateAddEmployeeModal]);

    // Xóa Nhân viên
    const handleDeleteRoomEmployee = async (roomEmployeeId) => {
        try {
            const deleteRoomEmployeeRes = await RoomEmployeeService.deleteRoomEmployeeByRoomEmployeeId(roomEmployeeId);
            if (!deleteRoomEmployeeRes) {
                // Toast
                const dataToast = { message: deleteRoomEmployeeRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }
            //  Success
            setIsUpdateAddEmployeeModal(prev => !prev);

            // Toast
            const dataToast = { message: deleteRoomEmployeeRes.data.message, type: "success" };
            showToastFromOut(dataToast);
        } catch (err) {
            // Toast
            const dataToast = { message: err.response.data.message, type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
    };

    // Create room employee check box
    const [employeeChooseList, setEmployeeChooseList] = useState([]);
    const handleCheckEmployee = (e) => {
        setIsUpdateAddEmployeeModal(prev => !prev);
        const value = parseInt(e.target.value);
        if (e.currentTarget.checked) {
            if (!employeeChooseList.includes(value)) {
                employeeChooseList.push(value);
            }
        } else {
            if (employeeChooseList.includes(value)) {
                let index = employeeChooseList.indexOf(value);
                employeeChooseList.splice(index, 1);
            }
        }
        console.log("employeeChooseList: ", employeeChooseList);
    };
    const handleCreateRoomEmployee = async (e, employeeChooseList, roomIdModalAddEmployee) => {
        console.log("e, employeeChooseList, roomIdModalAddEmployee: ", e, employeeChooseList, roomIdModalAddEmployee)
        e.preventDefault();
        try {
            const createRoomEmployeeRes = await RoomEmployeeService.createRoomEmployeeByListEmployeeId({
                employeeListId: employeeChooseList,
                roomId: roomIdModalAddEmployee
            });
            if (!createRoomEmployeeRes) {
                // Toast
                const dataToast = { message: createRoomEmployeeRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }
            //  Success
            setIsUpdateAddEmployeeModal(prev => !prev);
            setEmployeeChooseList([]);   //Thêm thành công thì bỏ mảng chọn cũ

            // Toast
            const dataToast = { message: createRoomEmployeeRes.data.message, type: "success" };
            showToastFromOut(dataToast);
        } catch (err) {
            // Toast
            const dataToast = { message: err.response.data.message, type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
    };
    const handleCancleCreateRoomEmployee = async (e, employeeChooseList) => {
        e.preventDefault();
        if (employeeChooseList.length === 0) {
            // Toast
            const dataToast = { message: "Bạn vẫn chưa chọn Nhân viên nào!", type: "warning" };
            showToastFromOut(dataToast);
            return;
        } else {
            setEmployeeChooseList([]);
            setIsUpdateAddEmployeeModal(prev => !prev);
            // Toast
            const dataToast = { message: "Hủy chọn thành công!", type: "success" };
            showToastFromOut(dataToast);
            return;
        }
    };

    console.log("roomIdModalAddEmployee: ", roomIdModalAddEmployee);
    // ================================================================
    //  =============== Thêm Nhân viên ===============
    if (type === "addEmployee") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column`, width: "90%" }}>
                            <LeftVoteTitle style={{ marginTop: "10px", fontSize: "1.6rem" }}>Thêm Nhân viên cho Phòng - Khách sạn</LeftVoteTitle>
                            <ModalForm style={{ padding: "0px 20px" }}>
                                <div className="col-lg-12">
                                    <div className="row">
                                        <LeftVote className="col-lg-6">
                                            <LeftVoteItem className="row">
                                                <LeftVoteTitle>Thông tin Phòng - Khách sạn</LeftVoteTitle>
                                                <InforCustomer className="col-lg-12">
                                                    <InfoItem className="row">
                                                        <InfoTitle className="col-lg-4">Mã Phòng: </InfoTitle>
                                                        <InfoDetail className="col-lg-8">{roomModalAddEmployee ? roomModalAddEmployee.room_id : null}</InfoDetail>
                                                    </InfoItem>
                                                    <InfoItem className="row">
                                                        <InfoTitle className="col-lg-4">Trạng thái: </InfoTitle>
                                                        <InfoDetail className="col-lg-8" style={{ fontWeight: "bold", color: "var(--color-primary)" }}>{roomModalAddEmployee ? roomModalAddEmployee.room_state === 0 ? "Đang trống" : roomModal.room_state === 1 ? "Đã được khóa" : null : null}</InfoDetail>
                                                    </InfoItem>
                                                </InforCustomer>
                                                <LeftImage src={roomModalAddEmployee ? roomModalAddEmployee.room_image_content : null} />
                                                <CartItem style={{ position: "absolute", bottom: "12px", left: "12px", width: "96%", borderRadius: "20px" }}>
                                                    <Circle />
                                                    <Course>
                                                        <Content>
                                                            <span style={{ width: "320px", fontWeight: "bold" }}> {roomModalAddEmployee ? roomModalAddEmployee.room_name : null} </span>
                                                            <span style={{ fontWeight: "400", color: "var(--color-primary)", width: "145px", textAlign: "right" }}>{roomModalAddEmployee ? roomModalAddEmployee.room_price : null} VNĐ</span>
                                                        </Content>
                                                        <span style={{ fontWeight: "400" }}><span style={{ color: "var(--color-primary)" }}>{roomModalAddEmployee ? roomModalAddEmployee.room_type_name : null}</span></span>
                                                    </Course>
                                                </CartItem>
                                            </LeftVoteItem>
                                            <LeftVoteItem2 className="row">
                                                <LeftVoteTitle>Những Nhân viên phụ trách Phòng này</LeftVoteTitle>

                                                <DeviceList className="col-lg-12">
                                                    {
                                                        roomEmployeeListAddEmployee.length > 0
                                                            ?
                                                            roomEmployeeListAddEmployee.map((roomEmployee, key) => {
                                                                return (
                                                                    <DeviceItem className="row">
                                                                        <DeviceIconContainer className="col-lg-3">
                                                                            <DeviceIcon src={roomEmployee.employee_gender === "Nam" ? "https://firebasestorage.googleapis.com/v0/b/longpets-50c17.appspot.com/o/1667675091004employee%20(2).png?alt=media&token=9171617a-2e61-4539-ab8d-4a6ae5337394" : roomEmployee.employee_gender === "Nữ" ? "https://firebasestorage.googleapis.com/v0/b/longpets-50c17.appspot.com/o/1667675091006employee%20(1).png?alt=media&token=b0e97bfd-5180-4c1b-827c-23c1808a2222" : null} />
                                                                        </DeviceIconContainer>
                                                                        <div className="col-lg-9">
                                                                            <DeviceTitle className="row">
                                                                                <DeviceName>{roomEmployee.employee_first_name + " " + roomEmployee.employee_last_name}</DeviceName>
                                                                            </DeviceTitle>
                                                                            <DeviceInfo className="row">
                                                                                <DeviceTime>Phụ trách Phòng từ: {roomEmployee.room_employee_add_date}</DeviceTime>
                                                                            </DeviceInfo>
                                                                        </div>
                                                                        <DeviceDetailContainer>
                                                                            <DeviceDetailImage src={roomEmployee.employee_image} />
                                                                        </DeviceDetailContainer>
                                                                        <DeleteService
                                                                            onClick={() => handleDeleteRoomEmployee(roomEmployee.room_employee_id)}
                                                                        >
                                                                            <ClearOutlined />
                                                                        </DeleteService>
                                                                    </DeviceItem>
                                                                )
                                                            }) : (
                                                                <EmptyItem>
                                                                    <EmptyItemSvg>
                                                                        <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="EmptyStatestyles__StyledSvg-sc-qsuc29-0 cHfQrS">
                                                                            <path d="M186 63V140H43V177H200V63H186Z" fill="#D6DADC"></path>
                                                                            <path d="M170.5 45H13.5V159H170.5V45Z" fill="white"></path>
                                                                            <path d="M29.5 26V45H170.5V140H186.5V26H29.5Z" fill="#1952B3"></path>
                                                                            <path d="M175 155V42H167H121.5V44H15H11V84H15V64H161V60H15V48H121.5V50H167V155H31V163H175V155Z" fill="#232729"></path>
                                                                            <path d="M28 52H24V56H28V52Z" fill="#232729"></path>
                                                                            <path d="M35 52H31V56H35V52Z" fill="#232729"></path>
                                                                            <path d="M42 52H38V56H42V52Z" fill="#232729"></path>
                                                                            <path d="M120 76H30V106H120V76Z" fill="#F3F4F6"></path>
                                                                            <path d="M153.5 76H126.5V142H153.5V76Z" fill="#F3F4F6"></path>
                                                                            <path d="M120 112H30V142H120V112Z" fill="#F3F4F6"></path>
                                                                            <path d="M44 120.77H26.23V103H17.77V120.77H0V129.23H17.77V147H26.23V129.23H44V120.77Z" fill="#FF5100"></path>
                                                                            <path d="M60.0711 146.314L62.1924 144.192L55.1213 137.121L53 139.243L60.0711 146.314Z" fill="#232729"></path>
                                                                            <path d="M53.0711 105.071L55.1924 107.192L62.2634 100.121L60.1421 98L53.0711 105.071Z" fill="#232729"></path>
                                                                            <path d="M70.1924 124.192V121.192H59.1924V124.192H70.1924Z" fill="#232729"></path>
                                                                        </svg>
                                                                    </EmptyItemSvg>
                                                                    <EmptyContent class="EmptyStatestyles__StyledTitle-sc-qsuc29-2 gAMClh">Hiện tại Phòng này chưa có Nhân viên nào!</EmptyContent>
                                                                </EmptyItem>
                                                            )
                                                    }
                                                </DeviceList>
                                            </LeftVoteItem2>
                                        </LeftVote>

                                        <RightVote className="col-lg-6">
                                            <RightVoteItem className="row">
                                                <RightVoteTitle className="col-lg-12">Những Nhân viên khác của Khách sạn</RightVoteTitle>

                                                <RightVoteTitle style={{ fontSize: "1rem", padding: "0" }} className="col-lg-12"><span style={{ color: "var(--color-primary)", marginLeft: "5px" }}>Hãy chọn Thiết bị bạn muốn thêm vào Phòng này!</span></RightVoteTitle>
                                                <Box sx={{ minWidth: 120, width: "80%", margin: "10px auto" }}>
                                                    <FormControl fullWidth>
                                                        <InputLabel id="demo-simple-select-label"></InputLabel>
                                                        <Select
                                                            labelId="demo-simple-select-label"
                                                            id="demo-simple-select"
                                                            value={positionIdModalAddEmployee}
                                                            label="Age"
                                                            sx={{
                                                                '& legend': { display: 'none' },
                                                                '& fieldset': { top: 0 }
                                                            }}
                                                            onChange={(e) => setPositionIdModalAddEmployee(parseInt(e.target.value))}
                                                        >
                                                            {
                                                                positionList.length > 0
                                                                    ?
                                                                    positionList.map((position, key) => {
                                                                        return (
                                                                            <MenuItem value={position.position_id}>{position.position_name}</MenuItem>
                                                                        )
                                                                    }) : null
                                                            }
                                                        </Select>
                                                    </FormControl>
                                                </Box>

                                                <Surcharge className="col-lg-12" style={{ height: "355px", maxHeight: "355px" }}>
                                                    {
                                                        employeeListAddEmployee.length > 0
                                                            ?
                                                            employeeListAddEmployee.map((employee, key) => {
                                                                return (
                                                                    <LabelCheckbox>
                                                                        <ServiceItem className="row">
                                                                            <div className="col-lg-2">
                                                                                <Checkbox checked={!employeeChooseList.includes(employee.employee_id) ? false : true} value={employee.employee_id} onChange={(e) => handleCheckEmployee(e)} />
                                                                            </div>
                                                                            <ServiceIconContainer className="col-lg-3">
                                                                                <ServiceIcon style={{ width: "40px", height: "40px", objectFix: "cover" }} src={employee.employee_image} />
                                                                            </ServiceIconContainer>
                                                                            <div className="col-lg-7">
                                                                                <ServiceTitle className="row">
                                                                                    <ServiceName>{employee.employee_first_name + " " + employee.employee_last_name}</ServiceName>
                                                                                </ServiceTitle>
                                                                                <ServiceInfo className="row">
                                                                                    <ServiceTime>{employee.employee_email + " - " + employee.employee_phone_number}</ServiceTime>
                                                                                </ServiceInfo>
                                                                            </div>
                                                                        </ServiceItem>
                                                                    </LabelCheckbox>
                                                                )
                                                            }) : (
                                                                <EmptyItem>
                                                                    <EmptyItemSvg>
                                                                        <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="EmptyStatestyles__StyledSvg-sc-qsuc29-0 cHfQrS">
                                                                            <path d="M186 63V140H43V177H200V63H186Z" fill="#D6DADC"></path>
                                                                            <path d="M170.5 45H13.5V159H170.5V45Z" fill="white"></path>
                                                                            <path d="M29.5 26V45H170.5V140H186.5V26H29.5Z" fill="#1952B3"></path>
                                                                            <path d="M175 155V42H167H121.5V44H15H11V84H15V64H161V60H15V48H121.5V50H167V155H31V163H175V155Z" fill="#232729"></path>
                                                                            <path d="M28 52H24V56H28V52Z" fill="#232729"></path>
                                                                            <path d="M35 52H31V56H35V52Z" fill="#232729"></path>
                                                                            <path d="M42 52H38V56H42V52Z" fill="#232729"></path>
                                                                            <path d="M120 76H30V106H120V76Z" fill="#F3F4F6"></path>
                                                                            <path d="M153.5 76H126.5V142H153.5V76Z" fill="#F3F4F6"></path>
                                                                            <path d="M120 112H30V142H120V112Z" fill="#F3F4F6"></path>
                                                                            <path d="M44 120.77H26.23V103H17.77V120.77H0V129.23H17.77V147H26.23V129.23H44V120.77Z" fill="#FF5100"></path>
                                                                            <path d="M60.0711 146.314L62.1924 144.192L55.1213 137.121L53 139.243L60.0711 146.314Z" fill="#232729"></path>
                                                                            <path d="M53.0711 105.071L55.1924 107.192L62.2634 100.121L60.1421 98L53.0711 105.071Z" fill="#232729"></path>
                                                                            <path d="M70.1924 124.192V121.192H59.1924V124.192H70.1924Z" fill="#232729"></path>
                                                                        </svg>
                                                                    </EmptyItemSvg>
                                                                    <EmptyContent class="EmptyStatestyles__StyledTitle-sc-qsuc29-2 gAMClh">Không có Nhân viên khác hoặc tất cả Nhân viên của Chức vụ này đã được thêm vào Phòng!</EmptyContent>
                                                                </EmptyItem>
                                                            )
                                                    }
                                                </Surcharge>
                                                <FormChucNang style={{ marginTop: "20px" }}>
                                                    <SignInBtn
                                                        onClick={(e) => handleCreateRoomEmployee(e, employeeChooseList, roomIdModalAddEmployee)}
                                                    >Thêm Nhân viên</SignInBtn>
                                                    <SignUpBtn
                                                        onClick={(e) => handleCancleCreateRoomEmployee(e, employeeChooseList)}
                                                    >Hủy chọn</SignUpBtn>
                                                </FormChucNang>
                                            </RightVoteItem>
                                        </RightVote>
                                    </div>
                                </div>
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
    };
    //  =============== Thêm Thiết bị ===============
    if (type === "addDevice") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column`, width: "90%" }}>
                            <LeftVoteTitle style={{ marginTop: "10px", fontSize: "1.6rem" }}>Thêm Thiết bị cho Phòng - Khách sạn</LeftVoteTitle>
                            <ModalForm style={{ padding: "0px 20px" }}>
                                <div className="col-lg-12">
                                    <div className="row">
                                        <LeftVote className="col-lg-6">
                                            <LeftVoteItem className="row">
                                                <LeftVoteTitle>Thông tin Phòng - Khách sạn</LeftVoteTitle>
                                                <InforCustomer className="col-lg-12">
                                                    <InfoItem className="row">
                                                        <InfoTitle className="col-lg-4">Mã Phòng: </InfoTitle>
                                                        <InfoDetail className="col-lg-8">{roomModalAddDevice ? roomModalAddDevice.room_id : null}</InfoDetail>
                                                    </InfoItem>
                                                    <InfoItem className="row">
                                                        <InfoTitle className="col-lg-4">Trạng thái: </InfoTitle>
                                                        <InfoDetail className="col-lg-8" style={{ fontWeight: "bold", color: "var(--color-primary)" }}>{roomModalAddDevice ? roomModalAddDevice.room_state === 0 ? "Đang trống" : roomModal.room_state === 1 ? "Đã được khóa" : null : null}</InfoDetail>
                                                    </InfoItem>
                                                </InforCustomer>
                                                <LeftImage src={roomModalAddDevice ? roomModalAddDevice.room_image_content : null} />
                                                <CartItem style={{ position: "absolute", bottom: "12px", left: "12px", width: "96%", borderRadius: "20px" }}>
                                                    <Circle />
                                                    <Course>
                                                        <Content>
                                                            <span style={{ width: "320px", fontWeight: "bold" }}> {roomModalAddDevice ? roomModalAddDevice.room_name : null} </span>
                                                            <span style={{ fontWeight: "400", color: "var(--color-primary)", width: "145px", textAlign: "right" }}>{roomModalAddDevice ? roomModalAddDevice.room_price : null} VNĐ</span>
                                                        </Content>
                                                        <span style={{ fontWeight: "400" }}><span style={{ color: "var(--color-primary)" }}>{roomModalAddDevice ? roomModalAddDevice.room_type_name : null}</span></span>
                                                    </Course>
                                                </CartItem>
                                            </LeftVoteItem>
                                            <LeftVoteItem2 className="row">
                                                <LeftVoteTitle>Những Thiết bị hiện tại của Phòng này</LeftVoteTitle>

                                                <DeviceList className="col-lg-12">
                                                    {
                                                        deviceDetailListAddDevice.length > 0
                                                            ?
                                                            deviceDetailListAddDevice.map((deviceDetail, key) => {
                                                                return (
                                                                    <DeviceItem className="row">
                                                                        <DeviceIconContainer className="col-lg-3">
                                                                            <DeviceIcon src={deviceDetail.device_type_image} />
                                                                        </DeviceIconContainer>
                                                                        <div className="col-lg-9">
                                                                            <DeviceTitle className="row">
                                                                                <DeviceName>{deviceDetail.device_name}</DeviceName>
                                                                            </DeviceTitle>
                                                                            <DeviceInfo className="row">
                                                                                <DeviceTime>Thêm vào phòng ngày: {deviceDetail.device_detail_check_date}</DeviceTime>
                                                                            </DeviceInfo>
                                                                        </div>
                                                                        <DeviceDetailContainer>
                                                                            {/* deice.device_image */}
                                                                            <DeviceDetailImage src={deviceDetail.device_image} />
                                                                        </DeviceDetailContainer>
                                                                        <DeleteService
                                                                            onClick={() => handleDeleteDeviceDetail(deviceDetail.device_detail_id)}
                                                                        >
                                                                            <ClearOutlined />
                                                                        </DeleteService>
                                                                    </DeviceItem>
                                                                )
                                                            }) : (
                                                                <EmptyItem>
                                                                    <EmptyItemSvg>
                                                                        <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="EmptyStatestyles__StyledSvg-sc-qsuc29-0 cHfQrS">
                                                                            <path d="M186 63V140H43V177H200V63H186Z" fill="#D6DADC"></path>
                                                                            <path d="M170.5 45H13.5V159H170.5V45Z" fill="white"></path>
                                                                            <path d="M29.5 26V45H170.5V140H186.5V26H29.5Z" fill="#1952B3"></path>
                                                                            <path d="M175 155V42H167H121.5V44H15H11V84H15V64H161V60H15V48H121.5V50H167V155H31V163H175V155Z" fill="#232729"></path>
                                                                            <path d="M28 52H24V56H28V52Z" fill="#232729"></path>
                                                                            <path d="M35 52H31V56H35V52Z" fill="#232729"></path>
                                                                            <path d="M42 52H38V56H42V52Z" fill="#232729"></path>
                                                                            <path d="M120 76H30V106H120V76Z" fill="#F3F4F6"></path>
                                                                            <path d="M153.5 76H126.5V142H153.5V76Z" fill="#F3F4F6"></path>
                                                                            <path d="M120 112H30V142H120V112Z" fill="#F3F4F6"></path>
                                                                            <path d="M44 120.77H26.23V103H17.77V120.77H0V129.23H17.77V147H26.23V129.23H44V120.77Z" fill="#FF5100"></path>
                                                                            <path d="M60.0711 146.314L62.1924 144.192L55.1213 137.121L53 139.243L60.0711 146.314Z" fill="#232729"></path>
                                                                            <path d="M53.0711 105.071L55.1924 107.192L62.2634 100.121L60.1421 98L53.0711 105.071Z" fill="#232729"></path>
                                                                            <path d="M70.1924 124.192V121.192H59.1924V124.192H70.1924Z" fill="#232729"></path>
                                                                        </svg>
                                                                    </EmptyItemSvg>
                                                                    <EmptyContent class="EmptyStatestyles__StyledTitle-sc-qsuc29-2 gAMClh">Hiện tại Phòng này chưa có Thiết bị nào!</EmptyContent>
                                                                </EmptyItem>
                                                            )
                                                    }
                                                </DeviceList>
                                            </LeftVoteItem2>
                                        </LeftVote>

                                        <RightVote className="col-lg-6">
                                            <RightVoteItem className="row">
                                                <RightVoteTitle className="col-lg-12">Những Thiết bị đang Lưu kho của Khách sạn</RightVoteTitle>

                                                <RightVoteTitle style={{ fontSize: "1rem", padding: "0" }} className="col-lg-12"><span style={{ color: "var(--color-primary)", marginLeft: "5px" }}>Hãy chọn Thiết bị bạn muốn thêm vào Phòng này!</span></RightVoteTitle>
                                                <Box sx={{ minWidth: 120, width: "80%", margin: "10px auto" }}>
                                                    <FormControl fullWidth>
                                                        <InputLabel id="demo-simple-select-label"></InputLabel>
                                                        <Select
                                                            labelId="demo-simple-select-label"
                                                            id="demo-simple-select"
                                                            value={deviceTypeIdModalAddDevice}
                                                            label="Age"
                                                            sx={{
                                                                '& legend': { display: 'none' },
                                                                '& fieldset': { top: 0 }
                                                            }}
                                                            onChange={(e) => setDeviceTypeIdModalAddDevice(parseInt(e.target.value))}
                                                        >
                                                            {
                                                                allDeviceTypeListAddDevice.length > 0
                                                                    ?
                                                                    allDeviceTypeListAddDevice.map((deviceType, key) => {
                                                                        return (
                                                                            <MenuItem value={deviceType.device_type_id}>{deviceType.device_type_name}</MenuItem>
                                                                        )
                                                                    }) : null
                                                            }
                                                        </Select>
                                                    </FormControl>
                                                </Box>

                                                <Surcharge className="col-lg-12" style={{ height: "355px", maxHeight: "355px" }}>
                                                    {
                                                        deviceListAddDevice.length > 0
                                                            ?
                                                            deviceListAddDevice.map((device, key) => {
                                                                return (
                                                                    <LabelCheckbox>
                                                                        <ServiceItem className="row">
                                                                            <div className="col-lg-2">
                                                                                <Checkbox checked={!deviceChooseList.includes(device.device_id) ? false : true} value={device.device_id} onChange={(e) => handleCheckDevice(e)} />
                                                                            </div>
                                                                            <ServiceIconContainer className="col-lg-3">
                                                                                <ServiceIcon src={device.device_image} />
                                                                            </ServiceIconContainer>
                                                                            <div className="col-lg-7">
                                                                                <ServiceTitle className="row">
                                                                                    <ServiceName>{device.device_name}</ServiceName>
                                                                                </ServiceTitle>
                                                                                <ServiceInfo className="row">
                                                                                    <ServiceTime>Ngày nhập thiết bị: {device.device_date}</ServiceTime>
                                                                                </ServiceInfo>
                                                                            </div>
                                                                        </ServiceItem>
                                                                    </LabelCheckbox>
                                                                )
                                                            }) : (
                                                                <EmptyItem>
                                                                    <EmptyItemSvg>
                                                                        <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="EmptyStatestyles__StyledSvg-sc-qsuc29-0 cHfQrS">
                                                                            <path d="M186 63V140H43V177H200V63H186Z" fill="#D6DADC"></path>
                                                                            <path d="M170.5 45H13.5V159H170.5V45Z" fill="white"></path>
                                                                            <path d="M29.5 26V45H170.5V140H186.5V26H29.5Z" fill="#1952B3"></path>
                                                                            <path d="M175 155V42H167H121.5V44H15H11V84H15V64H161V60H15V48H121.5V50H167V155H31V163H175V155Z" fill="#232729"></path>
                                                                            <path d="M28 52H24V56H28V52Z" fill="#232729"></path>
                                                                            <path d="M35 52H31V56H35V52Z" fill="#232729"></path>
                                                                            <path d="M42 52H38V56H42V52Z" fill="#232729"></path>
                                                                            <path d="M120 76H30V106H120V76Z" fill="#F3F4F6"></path>
                                                                            <path d="M153.5 76H126.5V142H153.5V76Z" fill="#F3F4F6"></path>
                                                                            <path d="M120 112H30V142H120V112Z" fill="#F3F4F6"></path>
                                                                            <path d="M44 120.77H26.23V103H17.77V120.77H0V129.23H17.77V147H26.23V129.23H44V120.77Z" fill="#FF5100"></path>
                                                                            <path d="M60.0711 146.314L62.1924 144.192L55.1213 137.121L53 139.243L60.0711 146.314Z" fill="#232729"></path>
                                                                            <path d="M53.0711 105.071L55.1924 107.192L62.2634 100.121L60.1421 98L53.0711 105.071Z" fill="#232729"></path>
                                                                            <path d="M70.1924 124.192V121.192H59.1924V124.192H70.1924Z" fill="#232729"></path>
                                                                        </svg>
                                                                    </EmptyItemSvg>
                                                                    <EmptyContent class="EmptyStatestyles__StyledTitle-sc-qsuc29-2 gAMClh">Không có Thiết bị khác hoặc tất cả Thiết bị của Loại này đã được thêm vào Phòng!</EmptyContent>
                                                                </EmptyItem>
                                                            )
                                                    }
                                                </Surcharge>
                                                <FormChucNang style={{ marginTop: "20px" }}>
                                                    <SignInBtn
                                                        onClick={(e) => handleCreateDetailDevice(e, deviceChooseList, roomIdModal)}
                                                    >Thêm Thiết bị</SignInBtn>
                                                    <SignUpBtn
                                                        onClick={(e) => handleCancleCreateDetailDevice(e, deviceChooseList)}
                                                    >Hủy chọn</SignUpBtn>
                                                </FormChucNang>
                                            </RightVoteItem>
                                        </RightVote>
                                    </div>
                                </div>
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
    };
    //  =============== Xem chi tiết Phòng ===============
    if (type === "detailRoom") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>Chi tiết Phòng</H1>
                            <ModalForm>
                                <div className="row">
                                    <div className="col-lg-3">
                                        <ModalFormItem style={{ flex: "1" }}>
                                            <FormSpan>Mã của Phòng:</FormSpan>
                                            <FormInput type="text" value={roomModal ? roomModal.room_id : null} readOnly />
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-3">
                                        <ModalFormItem style={{ flex: "1" }}>
                                            <FormSpan>Thuộc Tầng:</FormSpan>
                                            <FormInput type="text" value={roomModal ? roomModal.floor_name : null} readOnly />
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-3">
                                        <ModalFormItem style={{ flex: "1" }}>
                                            <FormSpan>Loại Phòng:</FormSpan>
                                            <FormInput type="text" value={roomModal ? roomModal.room_type_name : null} readOnly />
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-3">
                                        <ModalFormItem>
                                            <FormSpan>Tên Phòng:</FormSpan>
                                            <FormInput type="text" value={roomModal ? roomModal.room_name : null} readOnly />
                                        </ModalFormItem>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-4">
                                        <ModalFormItem>
                                            <FormSpan>View hướng:</FormSpan>
                                            <FormInput type="text" value={roomModal ? roomModal.room_view : null} readOnly />
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-4">
                                        <ModalFormItem>
                                            <FormSpan>Feature nổi bật:</FormSpan>
                                            <FormInput type="text" value={roomModal ? roomModal.room_feature : null} readOnly />
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-4">
                                        <ModalFormItem>
                                            <FormSpan>Kích thước:</FormSpan>
                                            <FormInput type="text" value={roomModal ? roomModal.room_size : null} readOnly />
                                        </ModalFormItem>
                                    </div>
                                </div>

                                <ModalFormItem>
                                    <FormSpan>Mô tả về Phòng:</FormSpan>
                                    <FormTextArea style={{ height: "140px" }} rows="2" cols="50" value={roomModal ? roomModal.room_description : null} readOnly />
                                </ModalFormItem>

                                <div className="row">

                                    <div className="col-lg-4">
                                        <ModalFormItem>
                                            <FormSpan>Số lượng Người lớn:</FormSpan>
                                            <FormInput type="text" value={roomModal ? roomModal.room_adult_quantity : null} readOnly />
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-4">
                                        <ModalFormItem>
                                            <FormSpan>Số lượng Trẻ em:</FormSpan>
                                            <FormInput type="text" value={roomModal ? roomModal.room_child_quantity : null} readOnly />
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-4">
                                        <ModalFormItem>
                                            <FormSpan>Giá Phòng:</FormSpan>
                                            <FormInput type="text" value={roomModal ? roomModal.room_price : null} readOnly />
                                        </ModalFormItem>
                                    </div>
                                </div>

                                <ModalChiTietItem>
                                    <FormSpan>Hình ảnh:</FormSpan>
                                    <ImageWrapper>
                                        {
                                            roomImageListModal.length > 0   //Khi mảng hình có hình thì hiện các hình trong mảng
                                                ?
                                                roomImageListModal.map((roomImage, index) => {
                                                    return (
                                                        <FormImg src={roomImage} />
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
    if (type === "createRoom") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>Thêm Phòng mới</H1>
                            <ModalForm>
                                <div className="row">
                                    <div className="col-lg-4">
                                        <ModalFormItem style={{ flex: "1" }}>
                                            <FormSpan>Phòng thuộc Tầng:</FormSpan>
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
                                            <FormSpan>Phòng thuộc Loại:</FormSpan>
                                            <FormSelect onChange={(e) => { setRoomTypeIdModalNew(parseInt(e.target.value)) }}>
                                                {
                                                    roomTypeList.map((roomType, key) => {
                                                        return (
                                                            <FormOption value={roomType.room_type_id}>{roomType.room_type_name}</FormOption>
                                                        )
                                                    })
                                                }
                                            </FormSelect>
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-4">
                                        <ModalFormItem>
                                            <FormSpan>Tên Phòng:</FormSpan>
                                            <FormInput type="text" onChange={(e) => setRoomNameModalNew(e.target.value)} placeholder="Nhập vào tên Phòng" />
                                        </ModalFormItem>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-4">
                                        <ModalFormItem>
                                            <FormSpan>View hướng:</FormSpan>
                                            <FormInput type="text" onChange={(e) => setRoomViewModalNew(e.target.value)} placeholder="Nhập vào tên Phòng" />
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-4">
                                        <ModalFormItem>
                                            <FormSpan>Feature nổi bật:</FormSpan>
                                            <FormInput type="text" onChange={(e) => setRoomFeatureModalNew(e.target.value)} placeholder="Nhập vào Feature Phòng" />
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-4">
                                        <ModalFormItem>
                                            <FormSpan>Kích thước:</FormSpan>
                                            <FormInput type="text" onChange={(e) => setRoomSizeModalNew(e.target.value)} placeholder="Nhập vào Kích thước Phòng" />
                                        </ModalFormItem>
                                    </div>
                                </div>

                                <ModalFormItem>
                                    <FormSpan>Mô tả về Phòng:</FormSpan>
                                    <FormTextArea rows="2" cols="50" onChange={(e) => setRoomDescriptionModalNew(e.target.value)} placeholder="Mô tả về Phòng này" />
                                </ModalFormItem>

                                <div className="row">

                                    <div className="col-lg-4">
                                        <ModalFormItem>
                                            <FormSpan>Số lượng Người lớn:</FormSpan>
                                            <FormInput type="number" min={1} onChange={(e) => setRoomAdultQuantityModalNew(parseInt(e.target.value))} placeholder="Số lượng người lớn tối đa" />
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-4">
                                        <ModalFormItem>
                                            <FormSpan>Số lượng Trẻ em:</FormSpan>
                                            <FormInput type="number" min={0} onChange={(e) => setRoomChildQuantityModalNew(parseInt(e.target.value))} placeholder="Số lượng trẻ em tối đa" />
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-4">
                                        <ModalFormItem>
                                            <FormSpan>Giá Phòng:</FormSpan>
                                            <FormInput type="number" onChange={(e) => setRoomPriceModalNew(parseInt(e.target.value))} placeholder="Giá của Phòng này" />
                                        </ModalFormItem>
                                    </div>
                                </div>

                                <ModalChiTietItem>
                                    <FormSpan>Hình ảnh:</FormSpan>
                                    <FormInput type="file" multiple onChange={(e) => handleShowImg(e.target.files)} />
                                    <ImageWrapper>
                                        {
                                            roomImageListModalNew.length > 0   //Khi mảng hình có hình thì hiện các hình trong mảng
                                                ?
                                                roomImageListModalNew.map((roomImage, index) => {
                                                    return (
                                                        <FormImg src={roomImage} />
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
                                            handleCreateRoom(
                                                roomTypeIdModalNew,
                                                floorIdModalNew,
                                                roomNameModalNew,
                                                roomViewModalNew,
                                                roomFeatureModalNew,
                                                roomSizeModalNew,
                                                roomDescriptionModalNew,
                                                roomAdultQuantityModalNew,
                                                roomChildQuantityModalNew,
                                                roomPriceModalNew,
                                                roomImageListModalNew
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
    if (type === "updateRoom") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>Cập nhật Phòng</H1>
                            <ModalForm>
                                <div className="row">
                                    <div className="col-lg-4">
                                        <ModalFormItem style={{ flex: "1" }}>
                                            <FormSpan>Phòng thuộc Tầng:</FormSpan>
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
                                            <FormSpan>Phòng thuộc Loại:</FormSpan>
                                            <FormSelect onChange={(e) => { setRoomTypeIdModal(parseInt(e.target.value)) }}>
                                                {roomTypeList.map((roomType, key) => {
                                                    if (roomType.room_type_id === roomTypeIdModal) {
                                                        return (
                                                            <FormOption value={roomType.room_type_id} selected> {roomType.room_type_name} </FormOption>
                                                        )
                                                    } else {
                                                        return (
                                                            <FormOption value={roomType.room_type_id}> {roomType.room_type_name} </FormOption>
                                                        )
                                                    }
                                                })}
                                            </FormSelect>
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-4">
                                        <ModalFormItem>
                                            <FormSpan>Tên Phòng:</FormSpan>
                                            <FormInput type="text" onChange={(e) => setRoomNameModal(e.target.value)} value={roomNameModal} maxLength={150} />
                                        </ModalFormItem>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-4">
                                        <ModalFormItem>
                                            <FormSpan>View hướng:</FormSpan>
                                            <FormInput type="text" onChange={(e) => setRoomViewModal(e.target.value)} value={roomViewModal} maxLength={150} />
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-4">
                                        <ModalFormItem>
                                            <FormSpan>Feature nổi bật:</FormSpan>
                                            <FormInput type="text" onChange={(e) => setRoomFeatureModal(e.target.value)} value={roomFeatureModal} maxLength={150} />
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-4">
                                        <ModalFormItem>
                                            <FormSpan>Kích thước:</FormSpan>
                                            <FormInput type="text" onChange={(e) => setRoomSizeModal(e.target.value)} value={roomSizeModal} maxLength={150} />
                                        </ModalFormItem>
                                    </div>
                                </div>

                                <ModalFormItem>
                                    <FormSpan>Mô tả về Phòng:</FormSpan>
                                    <FormTextArea rows="2" cols="50" onChange={(e) => setRoomDescriptionModal(e.target.value)} value={roomDescriptionModal} maxLength={150} />
                                </ModalFormItem>

                                <div className="row">

                                    <div className="col-lg-4">
                                        <ModalFormItem>
                                            <FormSpan>Số lượng Người lớn:</FormSpan>
                                            <FormInput type="number" min={1} onChange={(e) => setRoomAdultQuantityModal(parseInt(e.target.value))} value={roomAdultQuantityModal} />
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-4">
                                        <ModalFormItem>
                                            <FormSpan>Số lượng Trẻ em:</FormSpan>
                                            <FormInput type="number" min={0} onChange={(e) => setRoomChildQuantityModal(parseInt(e.target.value))} value={roomChildQuantityModal} />
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-4">
                                        <ModalFormItem>
                                            <FormSpan>Giá Phòng:</FormSpan>
                                            <FormInput type="number" onChange={(e) => setRoomPriceModal(parseInt(e.target.value))} value={roomPriceModal} />
                                        </ModalFormItem>
                                    </div>
                                </div>

                                <ModalChiTietItem>
                                    <FormSpan>Hình ảnh:</FormSpan>
                                    <FormInput type="file" multiple onChange={(e) => handleChangeImg(e.target.files)} />
                                    <ImageWrapper>
                                        {
                                            roomImageListModalChange.length > 0   //Khi mảng hình có hình thì hiện các hình trong mảng
                                                ?
                                                roomImageListModalChange.map((roomImage, key) => {
                                                    return (
                                                        <FormImg src={roomImage} />
                                                    );
                                                })
                                                :
                                                roomImageListModal.length > 0
                                                    ?
                                                    roomImageListModal.map((roomImage, key) => {
                                                        return (
                                                            <FormImg src={roomImage} />
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
                                                roomIdModal,
                                                roomTypeIdModal,
                                                floorIdModal,
                                                roomNameModal,
                                                roomViewModal,
                                                roomFeatureModal,
                                                roomSizeModal,
                                                roomDescriptionModal,
                                                roomAdultQuantityModal,
                                                roomChildQuantityModal,
                                                roomPriceModal,
                                                roomImageListModal,
                                                roomImageListModalChange
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
    // =============== Xóa Phòng ===============
    if (type === "deleteRoom") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ backgroundImage: `url("https://img.freepik.com/free-vector/alert-safety-background_97886-3460.jpg?w=1060")`, backgroundPosition: `center center`, backgroundRepeat: `no-repeat`, backgroundSize: `cover`, width: `600px`, height: `400px` }} >
                            <ModalContent>
                                <H1Delete>Bạn muốn xóa Phòng <span style={{ color: `var(--color-primary)` }}>{roomNameModal}</span> này?</H1Delete>
                                <p>Click Đồng ý nếu bạn muốn thực hiện hành động này!</p>
                                <Button>
                                    <ButtonContainer>
                                        <ButtonClick
                                            onClick={() => { handleDeleteRoom(roomIdModal) }}
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