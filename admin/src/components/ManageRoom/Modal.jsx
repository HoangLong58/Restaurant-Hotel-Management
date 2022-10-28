import { format_money } from "../../utils/utils";
import styled from "styled-components";
import { CloseOutlined } from "@mui/icons-material";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from "../../firebase";

// SERVICES
import * as RoomService from "../../service/RoomService";
import * as RoomTypeService from "../../service/RoomTypeService";
import * as FloorService from "../../service/FloorService";
import * as RoomImageService from "../../service/RoomImageService";

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

const Modal = ({ showModal, setShowModal, type, room, setReRenderData, handleClose, showToastFromOut }) => {
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
        getRoom();
        getRoomImage();
    }, [room]);

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
    // ================================================================
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
                                    <div className="col-lg-4">
                                        <ModalFormItem style={{ flex: "1" }}>
                                            <FormSpan>Phòng thuộc Tầng:</FormSpan>
                                            <FormInput type="text" value={roomModal ? roomModal.floor_name : null} readOnly />
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-4">
                                        <ModalFormItem style={{ flex: "1" }}>
                                            <FormSpan>Phòng thuộc Loại:</FormSpan>
                                            <FormInput type="text" value={roomModal ? roomModal.room_type_name : null} readOnly />
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-4">
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