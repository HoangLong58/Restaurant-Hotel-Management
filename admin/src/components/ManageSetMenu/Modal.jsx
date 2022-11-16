import { ClearOutlined, CloseOutlined } from "@mui/icons-material";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import app from "../../firebase";

import { Box, Checkbox, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
// SERVICES
import * as SetMenuService from "../../service/SetMenuService";
import * as FoodTypeService from "../../service/FoodTypeService";
import * as FoodService from "../../service/FoodService";
import * as MenuDetailFoodService from "../../service/MenuDetailFoodService";

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
margin: 10px 30px;
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
    width: 50%;
    object-fit: contain;
    height: 200px;
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
const Modal = ({ showModal, setShowModal, type, setMenu, setMenuAddFood, setReRenderData, handleClose, showToastFromOut }) => {
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

    // =============== Xử lý cập nhật danh mục ===============
    useEffect(() => {
        setSetMenuImageModalNew(null);
        setSetMenuNameModalNew();
    }, [showModal]);

    const handleUpdateSetMenu = async (newSetMenuName, newSetMenuDescription, newSetMenuPrice, newSetMenuImage, setMenuId) => {
        try {
            const updateSetMenuRes = await SetMenuService.updateSetMenu({
                setMenuName: newSetMenuName,
                setMenuDescription: newSetMenuDescription,
                setMenuPrice: newSetMenuPrice,
                setMenuImage: newSetMenuImage,
                setMenuId: setMenuId
            });
            if (!updateSetMenuRes) {
                // Toast
                const dataToast = { message: updateSetMenuRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }

            // Success
            setShowModal(prev => !prev);
            handleClose();  //Đóng thanh tìm kiếm và render lại giá trị mới ở compo Main
            // Toast
            const dataToast = { message: updateSetMenuRes.data.message, type: "success" };
            showToastFromOut(dataToast);
            return;
        } catch (err) {
            setShowModal(prev => !prev);
            handleClose();  //Đóng thanh tìm kiếm và render lại giá trị mới ở compo Main
            // Toast
            const dataToast = { message: err.response.data.message, type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
    }

    // STATE:
    const [setMenuModal, setSetMenuModal] = useState();
    const [setMenuIdModal, setSetMenuIdModal] = useState();
    const [setMenuNameModal, setSetMenuNameModal] = useState();
    const [setMenuImageModal, setSetMenuImageModal] = useState();
    const [setMenuDescriptionModal, setSetMenuDescriptionModal] = useState();
    const [setMenuPriceModal, setSetMenuPriceModal] = useState();
    const [setMenuStateModal, setSetMenuStateModal] = useState();

    const [setMenuModalOld, setSetMenuModalOld] = useState();
    const [setMenuIdModalOld, setSetMenuIdModalOld] = useState();
    const [setMenuNameModalOld, setSetMenuNameModalOld] = useState();
    const [setMenuImageModalOld, setSetMenuImageModalOld] = useState();
    const [setMenuDescriptionModalOld, setSetMenuDescriptionModalOld] = useState();
    const [setMenuPriceModalOld, setSetMenuPriceModalOld] = useState();
    const [setMenuStateModalOld, setSetMenuStateModalOld] = useState();
    useEffect(() => {
        const getSetMenu = async () => {
            try {
                const setMenuRes = await SetMenuService.findSetMenuById({
                    setMenuId: setMenu.set_menu_id
                });
                console.log("RES: ", setMenuRes);
                setSetMenuModal(setMenuRes.data.data);
                setSetMenuIdModal(setMenuRes.data.data.set_menu_id);
                setSetMenuNameModal(setMenuRes.data.data.set_menu_name);
                setSetMenuDescriptionModal(setMenuRes.data.data.set_menu_description);
                setSetMenuPriceModal(setMenuRes.data.data.set_menu_price);
                setSetMenuStateModal(setMenuRes.data.data.set_menu_state);
                setSetMenuImageModal(setMenuRes.data.data.set_menu_image);

                setSetMenuModalOld(setMenuRes.data.data);
                setSetMenuIdModalOld(setMenuRes.data.data.set_menu_id);
                setSetMenuNameModalOld(setMenuRes.data.data.set_menu_name);
                setSetMenuDescriptionModalOld(setMenuRes.data.data.set_menu_description);
                setSetMenuPriceModalOld(setMenuRes.data.data.set_menu_price);
                setSetMenuStateModalOld(setMenuRes.data.data.set_menu_state);
                setSetMenuImageModalOld(setMenuRes.data.data.set_menu_image);
            } catch (err) {
                console.log("Lỗi lấy device: ", err.response);
            }
        }
        if (setMenu) {
            getSetMenu();
        }
    }, [setMenu]);
    console.log("Danh mục modal: ", setMenuModal);

    // Thay đổi hình ảnh
    const handleChangeImg = (hinhmoi) => {
        const hinhanhunique = new Date().getTime() + hinhmoi.name;
        const storage = getStorage(app);
        const storageRef = ref(storage, hinhanhunique);
        const uploadTask = uploadBytesResumable(storageRef, hinhmoi);

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
                        setSetMenuImageModal(downloadURL);
                    } catch (err) {
                        console.log("Lỗi cập nhật hình ảnh:", err);
                    }
                });
            }
        );
    }

    const handleCloseUpdate = () => {
        // Set lại giá trị cũ sau khi đóng Modal)
        setSetMenuNameModal(setMenuNameModalOld);
        setSetMenuDescriptionModal(setMenuDescriptionModalOld);
        setSetMenuPriceModal(setMenuPriceModalOld);
        setSetMenuImageModal(setMenuImageModalOld);

        setShowModal(prev => !prev);
    }

    // =============== Xử lý thêm danh mục ===============
    const [setMenuNameModalNew, setSetMenuNameModalNew] = useState();
    const [setMenuImageModalNew, setSetMenuImageModalNew] = useState(null);
    const [setMenuDescriptionModalNew, setSetMenuDescriptionModalNew] = useState();
    const [setMenuPriceModalNew, setSetMenuPriceModalNew] = useState();

    // Thay đổi hình ảnh
    const handleShowImg = (hinhmoi) => {
        const hinhanhunique = new Date().getTime() + hinhmoi.name;
        const storage = getStorage(app);
        const storageRef = ref(storage, hinhanhunique);
        const uploadTask = uploadBytesResumable(storageRef, hinhmoi);

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
                        setSetMenuImageModalNew(downloadURL);
                    } catch (err) {
                        console.log("Lỗi cập nhật hình ảnh:", err);
                    }
                });
            }
        );
    }

    // Create new divice
    const handleCreateSetMenu = async (newName, newDescription, newPrice, newImage) => {
        try {
            const createSetMenuRes = await SetMenuService.createSetMenu({
                setMenuName: newName,
                setMenuDescription: newDescription,
                setMenuPrice: newPrice,
                setMenuImage: newImage
            });
            if (!createSetMenuRes) {
                // Toast
                const dataToast = { message: createSetMenuRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }

            // Success
            setReRenderData(prev => !prev); //Render lại csdl ở Compo cha là - DanhMucMain & DanhMucRight.jsx
            setShowModal(prev => !prev);
            setSetMenuImageModalNew(null);
            // Toast
            const dataToast = { message: createSetMenuRes.data.message, type: "success" };
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

    // =============== Xử lý xóa danh mục ===============
    const handleDeleteSetMenu = async (setMenuId) => {
        try {
            const deleteSetMenuRes = await SetMenuService.deleteSetMenu(setMenuId);
            if (!deleteSetMenuRes) {
                // Toast
                const dataToast = { message: deleteSetMenuRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }
            // Success
            setShowModal(prev => !prev);
            handleClose();  //Đóng thanh tìm kiếm và render lại giá trị mới ở compo Main
            // Toast
            const dataToast = { message: deleteSetMenuRes.data.message, type: "success" };
            showToastFromOut(dataToast);
            return;
        } catch (err) {
            // Toast
            const dataToast = { message: err.response.data.message, type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
    }

    // =============== Xử lý Disable set menu ===============
    const handleDisableSetMenu = async (setMenuId) => {
        try {
            const disableSetMenuRes = await SetMenuService.disableSetMenuById({
                setMenuId: setMenuId
            });
            if (!disableSetMenuRes) {
                // Toast
                const dataToast = { message: disableSetMenuRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }
            // Success
            setShowModal(prev => !prev);
            handleClose();  //Đóng thanh tìm kiếm và render lại giá trị mới ở compo Main
            // Toast
            const dataToast = { message: disableSetMenuRes.data.message, type: "success" };
            showToastFromOut(dataToast);
            return;
        } catch (err) {
            setShowModal(prev => !prev);
            handleClose();  //Đóng thanh tìm kiếm và render lại giá trị mới ở compo Main
            // Toast
            const dataToast = { message: err.response.data.message, type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
    }

    // =============== Xử lý Able set menu ===============
    const handleAbleSetMenu = async (setMenuId) => {
        try {
            const ableSetMenuRes = await SetMenuService.ableSetMenuById({
                setMenuId: setMenuId
            });
            if (!ableSetMenuRes) {
                // Toast
                const dataToast = { message: ableSetMenuRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }
            // Success
            setShowModal(prev => !prev);
            handleClose();  //Đóng thanh tìm kiếm và render lại giá trị mới ở compo Main
            // Toast
            const dataToast = { message: ableSetMenuRes.data.message, type: "success" };
            showToastFromOut(dataToast);
            return;
        } catch (err) {
            setShowModal(prev => !prev);
            handleClose();  //Đóng thanh tìm kiếm và render lại giá trị mới ở compo Main
            // Toast
            const dataToast = { message: err.response.data.message, type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
    }

    // ADD FOOD
    const [setMenuModalAddFood, setSetMenuModalAddFood] = useState();
    const [setMenuIdModalAddFood, setSetMenuIdModalAddFood] = useState();
    const [foodTypeIdModalAddFood, setFoodTypeIdModalAddFood] = useState();
    const [isUpdateAddFoodModal, setIsUpdateAddFoodModal] = useState();

    const [menuDetailFoodListAddFood, setMenuDetailFoodListAddFood] = useState([]);
    const [foodListAddFood, setFoodListAddFood] = useState([]);
    // Lấy Loại món ăn
    const [foodTypeList, setFoodTypeList] = useState([]);
    useEffect(() => {
        const getFoodTypes = async () => {
            try {
                const foodTypeListRes = await FoodTypeService.getAllFoodTypes();
                setFoodTypeList(foodTypeListRes.data.data);
            } catch (err) {
                console.log("Lỗi lấy food type: ", err.response);
            }
        }
        getFoodTypes();
    }, []);

    useEffect(() => {
        // Lấy thông tin set menu cần thêm food
        const getSetMenu = async () => {
            try {
                const setMenuRes = await SetMenuService.findSetMenuById({
                    setMenuId: setMenuAddFood.set_menu_id
                });
                setSetMenuModalAddFood(setMenuRes.data.data);
                setSetMenuIdModalAddFood(setMenuRes.data.data.set_menu_id);
            } catch (err) {
                console.log("Lỗi lấy set menu modal add food: ", err.response);
            }
        }
        // Lấy Food mà set menu chưa có
        const getAllFoodByFoodTypeIdAndSetMenuId = async () => {
            try {
                const foodListRes = await FoodService.getAllFoodByFoodTypeIdAndSetMenuId({
                    foodTypeId: foodTypeIdModalAddFood,
                    setMenuId: setMenuAddFood.set_menu_id
                });
                setFoodListAddFood(foodListRes.data.data);
            } catch (err) {
                console.log("ERR: ", err.response);
            }
        };
        // Lấy những Menu detail food của Set menu
        const getAllMenuDetailFoodBySetMenuId = async () => {
            try {
                const menuDetaillFoodListRes = await MenuDetailFoodService.getAllMenuDetailFoodBySetMenuId(setMenuAddFood.set_menu_id);
                setMenuDetailFoodListAddFood(menuDetaillFoodListRes.data.data);
            } catch (err) {
                console.log("ERR: ", err.response);
            }
        };
        if (setMenuAddFood && !foodTypeIdModalAddFood) {
            getSetMenu();
            getAllMenuDetailFoodBySetMenuId();
        }
        if (setMenuAddFood && foodTypeIdModalAddFood) {
            getSetMenu();
            getAllMenuDetailFoodBySetMenuId();
            getAllFoodByFoodTypeIdAndSetMenuId();
        }
    }, [setMenuAddFood, showModal, foodTypeIdModalAddFood, isUpdateAddFoodModal]);

    // Xóa Món ăn
    const handleDeleteMenuDetailFood = async (menuDetailFoodId) => {
        try {
            const deleteMenuDetailFoodRes = await MenuDetailFoodService.deleteMenuDetailFoodByMenuDetailFoodId(menuDetailFoodId);
            if (!deleteMenuDetailFoodRes) {
                // Toast
                const dataToast = { message: deleteMenuDetailFoodRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }
            //  Success
            setIsUpdateAddFoodModal(prev => !prev);

            // Toast
            const dataToast = { message: deleteMenuDetailFoodRes.data.message, type: "success" };
            showToastFromOut(dataToast);
        } catch (err) {
            // Toast
            const dataToast = { message: err.response.data.message, type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
    };

    // Create Menu detail food check box
    const [foodChooseList, setFoodChooseList] = useState([]);
    const handleCheckFood = (e) => {
        setIsUpdateAddFoodModal(prev => !prev);
        const value = parseInt(e.target.value);
        if (e.currentTarget.checked) {
            if (!foodChooseList.includes(value)) {
                foodChooseList.push(value);
            }
        } else {
            if (foodChooseList.includes(value)) {
                let index = foodChooseList.indexOf(value);
                foodChooseList.splice(index, 1);
            }
        }
        console.log("foodChooseList: ", foodChooseList);
    };
    const handleCreateMenuDetailFood = async (e, foodChooseList, setMenuIdModalAddFood) => {
        console.log("e, foodChooseList, setMenuIdModalAddFood: ", e, foodChooseList, setMenuIdModalAddFood)
        e.preventDefault();
        try {
            const createMenuDetailFoodRes = await MenuDetailFoodService.createMenuDetailFoodByListFoodId({
                foodListId: foodChooseList,
                setMenuId: setMenuIdModalAddFood
            });
            if (!createMenuDetailFoodRes) {
                // Toast
                const dataToast = { message: createMenuDetailFoodRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }
            //  Success
            setIsUpdateAddFoodModal(prev => !prev);
            setFoodChooseList([]);   //Thêm thành công thì bỏ mảng chọn cũ

            // Toast
            const dataToast = { message: createMenuDetailFoodRes.data.message, type: "success" };
            showToastFromOut(dataToast);
        } catch (err) {
            // Toast
            const dataToast = { message: err.response.data.message, type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
    };
    const handleCancleCreateMenuDetailFood = async (e, foodChooseList) => {
        e.preventDefault();
        if (foodChooseList.length === 0) {
            // Toast
            const dataToast = { message: "Bạn vẫn chưa chọn Món ăn nào!", type: "warning" };
            showToastFromOut(dataToast);
            return;
        } else {
            setFoodChooseList([]);
            setIsUpdateAddFoodModal(prev => !prev);
            // Toast
            const dataToast = { message: "Hủy chọn thành công!", type: "success" };
            showToastFromOut(dataToast);
            return;
        }
    };

    console.log("setMenuIdModalAddFood: ", setMenuIdModalAddFood);
    // ================================================================
    //  =============== Thêm Món ăn ===============
    if (type === "addFoodToSetMenu") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column`, width: "90%" }}>
                            <LeftVoteTitle style={{ marginTop: "10px", fontSize: "1.6rem" }}>Thêm Món ăn cho Set Menu - Nhà hàng</LeftVoteTitle>
                            <ModalForm style={{ padding: "0px 20px" }}>
                                <div className="col-lg-12">
                                    <div className="row">
                                        <LeftVote className="col-lg-6">
                                            <LeftVoteItem className="row">
                                                <LeftVoteTitle>Thông tin Set Menu - Nhà hàng</LeftVoteTitle>
                                                <InforCustomer className="col-lg-12">
                                                    <InfoItem className="row">
                                                        <InfoTitle className="col-lg-4">Mã Set Menu: </InfoTitle>
                                                        <InfoDetail className="col-lg-8">{setMenuAddFood ? setMenuAddFood.set_menu_id : null}</InfoDetail>
                                                    </InfoItem>
                                                    <InfoItem className="row">
                                                        <InfoTitle className="col-lg-4">Trạng thái: </InfoTitle>
                                                        <InfoDetail className="col-lg-8" style={{ fontWeight: "bold", color: "var(--color-primary)" }}>{setMenuAddFood ? setMenuAddFood.set_menu_state === 0 ? "Đang hoạt động" : setMenuAddFood.set_menu_state === 1 ? "Ngưng hoạt động" : null : null}</InfoDetail>
                                                    </InfoItem>
                                                </InforCustomer>
                                                <LeftImage src={setMenuAddFood ? setMenuAddFood.set_menu_image : null} />
                                                <CartItem style={{ position: "absolute", bottom: "12px", left: "12px", width: "96%", borderRadius: "20px" }}>
                                                    <Circle />
                                                    <Course>
                                                        <Content>
                                                            <span style={{ width: "320px", fontWeight: "bold" }}> {setMenuAddFood ? setMenuAddFood.set_menu_name : null} </span>
                                                            <span style={{ fontWeight: "400", color: "var(--color-primary)", width: "145px", textAlign: "right" }}>{setMenuAddFood ? setMenuAddFood.set_menu_price : null} VNĐ</span>
                                                        </Content>
                                                        {/* <span style={{ fontWeight: "400" }}><span style={{ color: "var(--color-primary)" }}>{setMenuAddFood ? setMenuAddFood.set_menu_type_name : null}</span></span> */}
                                                    </Course>
                                                </CartItem>
                                            </LeftVoteItem>
                                            <LeftVoteItem2 className="row">
                                                <LeftVoteTitle>Những Món ăn của Set Menu này</LeftVoteTitle>

                                                <DeviceList className="col-lg-12">
                                                    {
                                                        menuDetailFoodListAddFood.length > 0
                                                            ?
                                                            menuDetailFoodListAddFood.map((menuDetailFood, key) => {
                                                                return (
                                                                    <DeviceItem className="row">
                                                                        <DeviceIconContainer className="col-lg-3">
                                                                            <DeviceIcon src={"https://i.ibb.co/1TRMVPS/salad.png"} />
                                                                        </DeviceIconContainer>
                                                                        <div className="col-lg-9">
                                                                            <DeviceTitle className="row">
                                                                                <DeviceName>{menuDetailFood.food_name}</DeviceName>
                                                                            </DeviceTitle>
                                                                            <DeviceInfo className="row">
                                                                                <DeviceTime>Thuộc loại: {menuDetailFood.food_type_name}</DeviceTime>
                                                                            </DeviceInfo>
                                                                        </div>
                                                                        <DeviceDetailContainer>
                                                                            <DeviceDetailImage src={menuDetailFood.food_image} />
                                                                        </DeviceDetailContainer>
                                                                        <DeleteService
                                                                            onClick={() => handleDeleteMenuDetailFood(menuDetailFood.menu_detail_food_id)}
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
                                                                    <EmptyContent class="EmptyStatestyles__StyledTitle-sc-qsuc29-2 gAMClh">Hiện tại Set Menu này chưa có Món ăn nào!</EmptyContent>
                                                                </EmptyItem>
                                                            )
                                                    }
                                                </DeviceList>
                                            </LeftVoteItem2>
                                        </LeftVote>

                                        <RightVote className="col-lg-6">
                                            <RightVoteItem className="row">
                                                <RightVoteTitle className="col-lg-12">Những Món ăn khác của Nhà hàng</RightVoteTitle>

                                                <RightVoteTitle style={{ fontSize: "1rem", padding: "0" }} className="col-lg-12"><span style={{ color: "var(--color-primary)", marginLeft: "5px" }}>Hãy chọn Món ăn bạn muốn thêm vào Set Menu này!</span></RightVoteTitle>
                                                <Box sx={{ minWidth: 120, width: "80%", margin: "10px auto" }}>
                                                    <FormControl fullWidth>
                                                        <InputLabel id="demo-simple-select-label"></InputLabel>
                                                        <Select
                                                            labelId="demo-simple-select-label"
                                                            id="demo-simple-select"
                                                            value={foodTypeIdModalAddFood}
                                                            label="Age"
                                                            sx={{
                                                                '& legend': { display: 'none' },
                                                                '& fieldset': { top: 0 }
                                                            }}
                                                            onChange={(e) => setFoodTypeIdModalAddFood(parseInt(e.target.value))}
                                                        >
                                                            {
                                                                foodTypeList.length > 0
                                                                    ?
                                                                    foodTypeList.map((foodType, key) => {
                                                                        return (
                                                                            <MenuItem value={foodType.food_type_id}>{foodType.food_type_name}</MenuItem>
                                                                        )
                                                                    }) : null
                                                            }
                                                        </Select>
                                                    </FormControl>
                                                </Box>

                                                <Surcharge className="col-lg-12" style={{ height: "355px", maxHeight: "355px" }}>
                                                    {
                                                        foodListAddFood.length > 0
                                                            ?
                                                            foodListAddFood.map((food, key) => {
                                                                return (
                                                                    <LabelCheckbox>
                                                                        <ServiceItem className="row">
                                                                            <div className="col-lg-2">
                                                                                <Checkbox checked={!foodChooseList.includes(food.food_id) ? false : true} value={food.food_id} onChange={(e) => handleCheckFood(e)} />
                                                                            </div>
                                                                            <ServiceIconContainer className="col-lg-3">
                                                                                <ServiceIcon style={{ width: "40px", height: "40px", objectFix: "cover" }} src={food.food_image} />
                                                                            </ServiceIconContainer>
                                                                            <div className="col-lg-7">
                                                                                <ServiceTitle className="row">
                                                                                    <ServiceName>{food.food_name}</ServiceName>
                                                                                </ServiceTitle>
                                                                                <ServiceInfo className="row">
                                                                                    <ServiceTime>Giá tiền: {food.food_price} VNĐ</ServiceTime>
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
                                                                    <EmptyContent class="EmptyStatestyles__StyledTitle-sc-qsuc29-2 gAMClh">Không có Món ăn khác hoặc tất cả Món ăn của Loại món ăn này đã được thêm vào Set Menu!</EmptyContent>
                                                                </EmptyItem>
                                                            )
                                                    }
                                                </Surcharge>
                                                <FormChucNang style={{ marginTop: "20px" }}>
                                                    <SignInBtn
                                                        onClick={(e) => handleCreateMenuDetailFood(e, foodChooseList, setMenuIdModalAddFood)}
                                                    >Thêm Món ăn</SignInBtn>
                                                    <SignUpBtn
                                                        onClick={(e) => handleCancleCreateMenuDetailFood(e, foodChooseList)}
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
    if (type === "detailSetMenu") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ChiTietWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>Chi tiết Set Menu</H1>
                            <ModalForm>
                                <div className="row">
                                    <div className="col-lg-4">
                                        <ChiTietHinhAnh src={setMenuModal ? setMenuModal.set_menu_image : null} />
                                    </div>
                                    <div className="col-lg-8">
                                        <div className="row">
                                            <div className="col-lg-6">
                                                <ModalFormItem style={{ margin: "0 10px" }}>
                                                    <FormSpan>Mã Set Menu:</FormSpan>
                                                    <FormInput type="text" value={setMenuModal ? setMenuModal.set_menu_id : null} readOnly />
                                                </ModalFormItem>
                                            </div>
                                            <div className="col-lg-6">
                                                <ModalFormItem style={{ margin: "0 10px" }}>
                                                    <FormSpan>Tên Set Menu:</FormSpan>
                                                    <FormInput type="text" value={setMenuModal ? setMenuModal.set_menu_name : null} readOnly />
                                                </ModalFormItem>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-8">
                                                <ModalFormItem style={{ margin: "0 10px" }}>
                                                    <FormSpan>Mô tả chi tiết:</FormSpan>
                                                    <FormTextArea style={{ height: "140px" }} rows="2" cols="50" value={setMenuModal ? setMenuModal.set_menu_description : null} readOnly />
                                                </ModalFormItem>
                                            </div>
                                            <div className="col-lg-4">
                                                <ModalFormItem style={{ margin: "0 10px" }}>
                                                    <FormSpan>Trạng thái:</FormSpan>
                                                    <FormInput type="text" value={setMenuModal ? setMenuModal.set_menu_state === 0 ? "Đang hoạt động" : setMenuModal.set_menu_state === 1 ? "Ngưng hoạt động" : null : null} readOnly />
                                                </ModalFormItem>
                                                <ModalFormItem style={{ margin: "0 10px" }}>
                                                    <FormSpan>Giá tiền:</FormSpan>
                                                    <FormInput type="text" value={setMenuModal ? setMenuModal.set_menu_price : null} readOnly />
                                                </ModalFormItem>
                                            </div>
                                        </div>
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
                        </ChiTietWrapper>
                    </Background>
                ) : null}
            </>
        );
    }
    //  =============== Thêm Set Menu ===============
    if (type === "createSetMenu") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>Thêm Set Menu mới</H1>
                            <ModalForm>
                                <div className="row">
                                    <div className="col-lg-6">
                                        <ModalFormItem>
                                            <FormSpan>Tên Set Menu:</FormSpan>
                                            <FormInput type="text" onChange={(e) => setSetMenuNameModalNew(e.target.value)} placeholder="Nhập vào Tên Set Menu" />
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-6">
                                        <ModalFormItem>
                                            <FormSpan>Giá tiền:</FormSpan>
                                            <FormInput type="number" min={1} onChange={(e) => setSetMenuPriceModalNew(parseInt(e.target.value))} placeholder="Giá tiền cùa Set Menu này" />
                                        </ModalFormItem>
                                    </div>
                                </div>

                                <ModalFormItem>
                                    <FormSpan>Mô tả Set Menu:</FormSpan>
                                    <FormTextArea rows="2" cols="50" onChange={(e) => setSetMenuDescriptionModalNew(e.target.value)} placeholder="Mô tả về Set Menu này" />
                                </ModalFormItem>

                                <ModalFormItem>
                                    <FormSpan>Hình ảnh:</FormSpan>
                                    <FormInput type="file" onChange={(e) => handleShowImg(e.target.files[0])} />
                                    <FormImg src={setMenuImageModalNew !== null ? setMenuImageModalNew : "https://firebasestorage.googleapis.com/v0/b/longpets-50c17.appspot.com/o/1650880603321No-Image-Placeholder.svg.png?alt=media&token=2a1b17ab-f114-41c0-a00d-dd81aea80d3e"} key={setMenuImageModalNew}></FormImg>
                                </ModalFormItem>

                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => handleCreateSetMenu(setMenuNameModalNew, setMenuDescriptionModalNew, setMenuPriceModalNew, setMenuImageModalNew)}
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
    // =============== Disable SetMenu ===============
    if (type === "disableSetMenu") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <AlertWrapper showModal={showModal}>
                            <ModalForm>
                                <ModalFormItem>
                                    <h1>Bạn muốn Vô hiệu hóa Set Menu <span style={{ color: `var(--color-primary)` }}>{setMenuModal ? setMenuModal.set_menu_name : null}</span> này?</h1>
                                    <p style={{ marginTop: "10px" }}>Set Menu này sẽ ngưng hoạt động và Khách hàng không thể đặt được nữa!</p>
                                </ModalFormItem>
                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => handleDisableSetMenu(setMenuIdModal)}
                                    >Đồng ý</ButtonClick>
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
                        </AlertWrapper>
                    </Background>
                ) : null}
            </>
        );
    }
    // =============== able SetMenu ===============
    if (type === "ableSetMenu") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <AlertWrapper showModal={showModal}>
                            <ModalForm>
                                <ModalFormItem>
                                    <h1>Bạn muốn Mở khóa Set Menu <span style={{ color: `var(--color-primary)` }}>{setMenuModal ? setMenuModal.set_menu_name : null}</span> này?</h1>
                                    <p style={{ marginTop: "10px" }}>Khách hàng lại có thể Đặt Set Menu này như trước!</p>
                                </ModalFormItem>
                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => handleAbleSetMenu(setMenuIdModal)}
                                    >Đồng ý</ButtonClick>
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
                        </AlertWrapper>
                    </Background>
                ) : null}
            </>
        );
    }
    // =============== Chỉnh sửa Set Menu ===============
    if (type === "updateSetMenu") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>Cập nhật Set Menu</H1>
                            <ModalForm>
                                <div className="row">
                                    <div className="col-lg-6">
                                        <ModalFormItem style={{ margin: "0 30px" }}>
                                            <FormSpan>Tên Set Menu:</FormSpan>
                                            <FormInput type="text" onChange={(e) => setSetMenuNameModal(e.target.value)} value={setMenuNameModal} />
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-6">
                                        <ModalFormItem>
                                            <FormSpan>Giá tiền:</FormSpan>
                                            <FormInput type="number" min={1} onChange={(e) => setSetMenuPriceModal(parseInt(e.target.value))} value={setMenuPriceModal} placeholder="Giá tiền cùa Set Menu này" />
                                        </ModalFormItem>
                                    </div>
                                </div>

                                <ModalFormItem style={{ margin: "0 30px" }}>
                                    <FormSpan>Mô tả Set Menu:</FormSpan>
                                    <FormTextArea rows="2" cols="50" onChange={(e) => setSetMenuDescriptionModal(e.target.value)} value={setMenuDescriptionModal} />
                                </ModalFormItem>

                                <ModalFormItem style={{ margin: "0 30px" }}>
                                    <FormSpan>Hình ảnh:</FormSpan>
                                    <FormInput type="file" onChange={(e) => handleChangeImg(e.target.files[0])} />
                                    <FormImg src={setMenuImageModal !== setMenuImageModalOld ? setMenuImageModal : setMenuImageModalOld} key={setMenuImageModal}></FormImg>
                                </ModalFormItem>
                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    {/* newDeviceName, newDeviceDate, newDeviceDescription, newDeviceImage, newDeviceState, deviceTypeId, deviceId */}
                                    <ButtonClick
                                        onClick={() => handleUpdateSetMenu(setMenuNameModal, setMenuDescriptionModal, setMenuPriceModal, setMenuImageModal, setMenuIdModal)}
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
    // =============== Xóa danh mục ===============
    if (type === "deleteSetMenu") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ backgroundImage: `url("https://img.freepik.com/free-vector/alert-safety-background_97886-3460.jpg?w=1060")`, backgroundPosition: `center center`, backgroundRepeat: `no-repeat`, backgroundSize: `cover`, width: `600px`, height: `400px` }} >
                            <ModalContent>
                                <H1Delete>Bạn muốn xóa Set Menu <span style={{ color: `var(--color-primary)` }}>{setMenuNameModal}</span> này?</H1Delete>
                                <p>Click Đồng ý nếu bạn muốn thực hiện hành động này!</p>
                                <Button>
                                    <ButtonContainer>
                                        <ButtonClick
                                            onClick={() => { handleDeleteSetMenu(setMenuIdModal) }}
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