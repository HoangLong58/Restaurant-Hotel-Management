import { ClearOutlined, CloseOutlined } from "@mui/icons-material";
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Checkbox } from "@mui/material";

// SERVICES
import * as RoomTypeService from "../../service/RoomTypeService";
import * as ServiceDetailService from "../../service/ServiceDetailService";
import * as ServiceService from "../../service/ServiceService";

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
    width: 500px;
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
    object-fit: cover;
    height: 200px;
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
    top: 20px;
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
const Modal = ({ showModal, setShowModal, type, roomType, setReRenderData, handleClose, showToastFromOut }) => {
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

    // =============== Xử lý cập nhật Loại phòng ===============
    useEffect(() => {
        setRoomTypeNameModalNew();
        setServiceChooseList([]);
    }, [showModal]);

    const handleUpdateRoomType = async (newRoomTypeName, roomTypeId) => {
        try {
            const updateRoomTypeRes = await RoomTypeService.updateRoomType({
                roomTypeId: roomTypeId,
                roomTypeName: newRoomTypeName
            });
            if (!updateRoomTypeRes) {
                // Toast
                const dataToast = { message: updateRoomTypeRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }

            // Success
            setShowModal(prev => !prev);
            handleClose();  //Đóng thanh tìm kiếm và render lại giá trị mới ở compo Main
            // Toast
            const dataToast = { message: updateRoomTypeRes.data.message, type: "success" };
            showToastFromOut(dataToast);
            return;
        } catch (err) {
            console.log("ERR: ", err.response)
            setShowModal(prev => !prev);
            handleClose();  //Đóng thanh tìm kiếm và render lại giá trị mới ở compo Main
            // Toast
            const dataToast = { message: err.response.data.message, type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
    }
    //  test
    const [roomTypeModal, setRoomTypeModal] = useState();
    const [roomTypeIdModal, setRoomTypeIdModal] = useState();
    const [roomTypeNameModal, setRoomTypeNameModal] = useState();
    const [roomTypeVoteTotalModal, setRoomTypeVoteTotalModal] = useState();

    const [roomTypeModalOld, setRoomTypeModalOld] = useState();
    const [roomTypeIdModalOld, setRoomTypeIdModalOld] = useState();
    const [roomTypeNameModalOld, setRoomTypeNameModalOld] = useState();
    const [roomTypeVoteTotalModalOld, setRoomTypeVoteTotalModalOld] = useState();
    useEffect(() => {
        const getRoomType = async () => {
            try {
                const roomTypeRes = await RoomTypeService.findRoomTypeById({
                    roomTypeId: roomType.room_type_id
                });
                console.log("RES: ", roomTypeRes);
                setRoomTypeModal(roomTypeRes.data.data);
                setRoomTypeIdModal(roomTypeRes.data.data.room_type_id);
                setRoomTypeNameModal(roomTypeRes.data.data.room_type_name);
                setRoomTypeVoteTotalModal(roomTypeRes.data.data.room_type_vote_total);

                setRoomTypeModalOld(roomTypeRes.data.data);
                setRoomTypeIdModalOld(roomTypeRes.data.data.room_type_id);
                setRoomTypeNameModalOld(roomTypeRes.data.data.room_type_name);
                setRoomTypeVoteTotalModalOld(roomTypeRes.data.data.room_type_vote_total);
            } catch (err) {
                console.log("Lỗi lấy danh mục: ", err.response);
            }
        }
        if (roomType) {
            getRoomType();
        }
    }, [roomType]);
    console.log("Room type modal: ", roomTypeModal);

    const handleCloseUpdate = () => {
        // Set lại giá trị cũ sau khi đóng Modal
        setRoomTypeNameModal(roomTypeNameModalOld);

        setShowModal(prev => !prev);
    }

    // =============== Xử lý thêm Loại phòng ===============
    const [roomTypeNameModalNew, setRoomTypeNameModalNew] = useState();

    // Create new room type
    const handleCreateRoomType = async (newName) => {
        try {
            const createRoomTypeRes = await RoomTypeService.createRoomType({
                roomTypeName: newName
            });
            if (!createRoomTypeRes) {
                // Toast
                const dataToast = { message: createRoomTypeRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }

            // Success
            setReRenderData(prev => !prev); //Render lại csdl ở Compo cha là - DanhMucMain & DanhMucRight.jsx
            setShowModal(prev => !prev);
            // Toast
            const dataToast = { message: createRoomTypeRes.data.message, type: "success" };
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

    // =============== Xử lý xóa Loại phòng ===============
    const handleDeleteRoomType = async (roomTypeId) => {
        try {
            const deleteRoomTypeRes = await RoomTypeService.deleteRoomType(roomTypeId);
            if (!deleteRoomTypeRes) {
                // Toast
                const dataToast = { message: deleteRoomTypeRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }
            // Success
            setShowModal(prev => !prev);
            handleClose();  //Đóng thanh tìm kiếm và render lại giá trị mới ở compo Main
            // Toast
            const dataToast = { message: deleteRoomTypeRes.data.message, type: "success" };
            showToastFromOut(dataToast);
            return;
        } catch (err) {
            // Toast
            const dataToast = { message: err.response.data.message, type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
    }
    // Thêm Dịch vụ
    const [serviceDetailList, setServiceDetailList] = useState([]);
    const [serviceList, setServiceList] = useState([]);

    useEffect(() => {
        const getServiceDetailByRoomTypeId = async () => {
            try {
                const serviceDetailListRes = await ServiceDetailService.getServiceDetailsByRoomTypeId(roomType.room_type_id);
                setServiceDetailList(serviceDetailListRes.data.data);
            } catch (err) {
                console.log("ERR: ", err.response);
            }
        };
        if (roomType) {
            getServiceDetailByRoomTypeId();
        }
    }, [roomType, showModal]);

    const [isUpdate, setIsUpdate] = useState(false);
    useEffect(() => {
        // Lấy những dịch vụ của Loại phòng
        const getServiceDetailByRoomTypeId = async () => {
            try {
                const serviceDetailListRes = await ServiceDetailService.getServiceDetailsByRoomTypeId(roomType.room_type_id);
                setServiceDetailList(serviceDetailListRes.data.data);
            } catch (err) {
                console.log("ERR: ", err.response);
            }
        };
        // Lấy dịch vụ mà loại phòng chưa có
        const getAllServiceByRoomTypeId = async () => {
            try {
                const serviceListRes = await ServiceService.getAllServiceByRoomTypeId(roomType.room_type_id);
                setServiceList(serviceListRes.data.data);
            } catch (err) {
                console.log("ERR: ", err.response);
            }
        };
        if (roomType) {
            getServiceDetailByRoomTypeId();
            getAllServiceByRoomTypeId();
        }
    }, [roomType, showModal, isUpdate]);

    // Xóa dịch vụ
    const handleDeleteServiceDetail = async (serviceDetailId) => {
        try {
            const deleteServiceDetailRes = await ServiceDetailService.deleteServiceDetailByServiceDetailId(serviceDetailId);
            if (!deleteServiceDetailRes) {
                // Toast
                const dataToast = { message: deleteServiceDetailRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }
            //  Success
            setIsUpdate(prev => !prev);

            // Toast
            const dataToast = { message: deleteServiceDetailRes.data.message, type: "success" };
            showToastFromOut(dataToast);
        } catch (err) {
            // Toast
            const dataToast = { message: err.response.data.message, type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
    };

    // Create service detail check box
    const [serviceChooseList, setServiceChooseList] = useState([]);
    const handleCheckService = (e) => {
        setIsUpdate(prev => !prev);
        const value = parseInt(e.target.value);
        if (e.currentTarget.checked) {
            if (!serviceChooseList.includes(value)) {
                serviceChooseList.push(value);
            }
        } else {
            if (serviceChooseList.includes(value)) {
                let index = serviceChooseList.indexOf(value);
                serviceChooseList.splice(index, 1);
            }
        }
        console.log("serviceChooseList: ", serviceChooseList);
    };
    const handleCreateDetailService = async (e, serviceChooseList, roomTypeIdModal) => {
        e.preventDefault();
        try {
            const createServiceListRes = await ServiceDetailService.createServiceDetailByListServiceId({
                serviceListId: serviceChooseList,
                roomTypeId: roomTypeIdModal
            });
            if (!createServiceListRes) {
                // Toast
                const dataToast = { message: createServiceListRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }
            //  Success
            setIsUpdate(prev => !prev);
            setServiceChooseList([]);   //Thêm thành công thì bỏ mảng chọn cũ

            // Toast
            const dataToast = { message: createServiceListRes.data.message, type: "success" };
            showToastFromOut(dataToast);
        } catch (err) {
            // Toast
            const dataToast = { message: err.response.data.message, type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
    };
    const handleCancleCreateDetailService = async (e, serviceChooseList) => {
        e.preventDefault();
        if (serviceChooseList.length === 0) {
            // Toast
            const dataToast = { message: "Bạn vẫn chưa chọn Dịch vụ nào!", type: "warning" };
            showToastFromOut(dataToast);
            return;
        } else {
            setServiceChooseList([]);
            setIsUpdate(prev => !prev);
            // Toast
            const dataToast = { message: "Hủy chọn thành công!", type: "success" };
            showToastFromOut(dataToast);
            return;
        }
    };

    console.log("serviceDetailList: ", serviceDetailList, serviceList);
    // ================================================================
    //  =============== Thêm Dịch vụ ===============
    if (type === "addService") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column`, width: "90%" }}>
                            <LeftVoteTitle style={{ marginTop: "10px", fontSize: "1.6rem" }}>Thêm Dịch vụ cho Loại phòng</LeftVoteTitle>
                            <ModalForm style={{ padding: "0px 20px" }}>
                                <div className="col-lg-12">
                                    <div className="row">
                                        <LeftVote className="col-lg-6">
                                            <LeftVoteItem className="row">
                                                <LeftVoteTitle>Thông tin Loại phòng</LeftVoteTitle>
                                                <InforCustomer className="col-lg-12">
                                                    <InfoItem className="row">
                                                        <InfoTitle className="col-lg-4">Mã Loại phòng: </InfoTitle>
                                                        <InfoDetail className="col-lg-8">{roomTypeModal ? roomTypeModal.room_type_id : null}</InfoDetail>
                                                    </InfoItem>
                                                    <InfoItem className="row">
                                                        <InfoTitle className="col-lg-4">Trạng thái: </InfoTitle>
                                                        <InfoDetail className="col-lg-8" style={{ fontWeight: "bold", color: "var(--color-primary)" }}>Đang hoạt động</InfoDetail>
                                                    </InfoItem>
                                                </InforCustomer>
                                                <LeftImage src="https://firebasestorage.googleapis.com/v0/b/longpets-50c17.appspot.com/o/1667472609150room%20types.png?alt=media&token=9a495a96-060f-4c28-bb88-8e9c81aabd78" />
                                                <CartItem style={{ position: "absolute", bottom: "12px", left: "12px", width: "96%", borderRadius: "20px" }}>
                                                    <Circle />
                                                    <Course>
                                                        <Content>
                                                            <span style={{ width: "320px", fontWeight: "bold" }}>{roomTypeModal ? roomTypeModal.room_type_name : null}</span>
                                                            <span style={{ fontWeight: "400", color: "var(--color-primary)", width: "145px", textAlign: "right" }}>{roomTypeModal ? roomTypeModal.room_type_vote_total : null} sao</span>
                                                        </Content>
                                                    </Course>
                                                </CartItem>
                                            </LeftVoteItem>
                                            <LeftVoteItem2 className="row">
                                                <LeftVoteTitle>Những Dịch vụ hiện tại của Loại phòng này</LeftVoteTitle>
                                                <ServiceList className="col-lg-12">
                                                    {
                                                        serviceDetailList.length > 0
                                                            ? (
                                                                serviceDetailList.map((serviceDetail, key) => {
                                                                    return (
                                                                        <ServiceItem className="row">
                                                                            <ServiceIconContainer className="col-lg-3">
                                                                                <ServiceIcon src={serviceDetail.service_image} />
                                                                            </ServiceIconContainer>
                                                                            <div className="col-lg-9">
                                                                                <ServiceTitle className="row">
                                                                                    <ServiceName>{serviceDetail.service_name}</ServiceName>
                                                                                </ServiceTitle>
                                                                                <ServiceInfo className="row">
                                                                                    <ServiceTime>{serviceDetail.service_time}</ServiceTime>
                                                                                </ServiceInfo>
                                                                            </div>
                                                                            <DeleteService onClick={() => handleDeleteServiceDetail(serviceDetail.service_detail_id)}>
                                                                                <ClearOutlined />
                                                                            </DeleteService>
                                                                        </ServiceItem>
                                                                    )
                                                                })
                                                            ) : (
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
                                                                    <EmptyContent class="EmptyStatestyles__StyledTitle-sc-qsuc29-2 gAMClh">Hiện tại chưa có Dịch vụ nào cho Loại phòng này!</EmptyContent>
                                                                </EmptyItem>
                                                            )
                                                    }
                                                </ServiceList>
                                            </LeftVoteItem2>
                                        </LeftVote>

                                        <RightVote className="col-lg-6">
                                            <RightVoteItem className="row">
                                                <RightVoteTitle className="col-lg-12">Những Dịch vụ hiện có tại Khách sạn</RightVoteTitle>
                                                <Surcharge className="col-lg-12" style={{ height: "450px", maxHeight: "450px" }}>
                                                    {
                                                        serviceChooseList.length > 0
                                                            ? (
                                                                <RightVoteTitle style={{ fontSize: "1rem" }} className="col-lg-12"><span style={{ color: "var(--color-primary)", marginLeft: "5px" }}>Bạn muốn thêm {serviceChooseList.length} dịch vụ cho Loại phòng này?</span></RightVoteTitle>
                                                            ) : (
                                                                <RightVoteTitle style={{ fontSize: "1rem" }} className="col-lg-12"><span style={{ color: "var(--color-primary)", marginLeft: "5px" }}>Hãy chọn Dịch vụ bạn muốn thêm vào Loại phòng này!</span></RightVoteTitle>
                                                            )
                                                    }
                                                    {
                                                        serviceList.length > 0
                                                            ? (
                                                                serviceList.map((service, key) => {
                                                                    return (
                                                                        <LabelCheckbox>
                                                                            <ServiceItem className="row">
                                                                                <div className="col-lg-2">
                                                                                    <Checkbox checked={!serviceChooseList.includes(service.service_id) ? false : true} value={service.service_id} onChange={(e) => handleCheckService(e)} />
                                                                                </div>
                                                                                <ServiceIconContainer className="col-lg-3">
                                                                                    <ServiceIcon src={service.service_image} />
                                                                                </ServiceIconContainer>
                                                                                <div className="col-lg-7">
                                                                                    <ServiceTitle className="row">
                                                                                        <ServiceName>{service.service_name}</ServiceName>
                                                                                    </ServiceTitle>
                                                                                    <ServiceInfo className="row">
                                                                                        <ServiceTime>{service.service_time}</ServiceTime>
                                                                                    </ServiceInfo>
                                                                                </div>
                                                                            </ServiceItem>
                                                                        </LabelCheckbox>
                                                                    )
                                                                })
                                                            ) : (
                                                                <div className="col-lg-12">
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
                                                                        <EmptyContent class="EmptyStatestyles__StyledTitle-sc-qsuc29-2 gAMClh">Loại phòng này đã có tất cả Dịch vụ của Khách sạn!</EmptyContent>
                                                                    </EmptyItem>
                                                                </div>
                                                            )
                                                    }
                                                </Surcharge>
                                                <FormChucNang style={{ marginTop: "20px" }}>
                                                    <SignInBtn
                                                        onClick={(e) => handleCreateDetailService(e, serviceChooseList, roomTypeIdModal)}
                                                    >Thêm Dịch vụ</SignInBtn>
                                                    <SignUpBtn
                                                        onClick={(e) => handleCancleCreateDetailService(e, serviceChooseList)}
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
    if (type === "detailRoomType") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ChiTietWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>Chi tiết Loại phòng</H1>
                            <ModalForm>
                                <div className="row">
                                    <div className="col-lg-4">
                                        <ModalFormItem style={{ margin: "0 10px" }}>
                                            <FormSpan>Mã Loại phòng:</FormSpan>
                                            <FormInput type="text" value={roomTypeModal ? roomTypeModal.room_type_id : null} readOnly />
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-4">
                                        <ModalFormItem style={{ margin: "0 10px" }}>
                                            <FormSpan>Tên Loại phòng:</FormSpan>
                                            <FormInput type="text" value={roomTypeModal ? roomTypeModal.room_type_name : null} readOnly />
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-4">
                                        <ModalFormItem style={{ margin: "0 10px" }}>
                                            <FormSpan>Sao đánh giá:</FormSpan>
                                            <FormInput type="text" value={roomTypeModal ? roomTypeModal.room_type_vote_total : null} readOnly />
                                        </ModalFormItem>
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
    //  =============== Thêm Loại phòng ===============
    if (type === "createRoomType") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>Thêm Loại phòng mới</H1>
                            <ModalForm>
                                <ModalFormItem>
                                    <FormSpan>Tên Loại phòng:</FormSpan>
                                    <FormInput type="text" onChange={(e) => setRoomTypeNameModalNew(e.target.value)} placeholder="Nhập vào tên Loại phòng" />
                                </ModalFormItem>
                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => handleCreateRoomType(roomTypeNameModalNew)}
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
    // =============== Chỉnh sửa Loại phòng ===============
    if (type === "updateRoomType") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>Cập nhật Loại phòng</H1>
                            <ModalForm>
                                <ModalFormItem>
                                    <FormSpan>Tên Loại phòng:</FormSpan>
                                    <FormInput type="text" onChange={(e) => setRoomTypeNameModal(e.target.value)} value={roomTypeNameModal} />
                                </ModalFormItem>
                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => handleUpdateRoomType(roomTypeNameModal, roomTypeIdModal)}
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
    // =============== Xóa Loại phòng ===============
    if (type === "deleteRoomType") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ backgroundImage: `url("https://img.freepik.com/free-vector/alert-safety-background_97886-3460.jpg?w=1060")`, backgroundPosition: `center center`, backgroundRepeat: `no-repeat`, backgroundSize: `cover`, width: `600px`, height: `400px` }} >
                            <ModalContent>
                                <h1>Bạn muốn xóa Loại phòng <span style={{ color: `var(--color-primary)` }}>{roomTypeNameModal}</span> này?</h1>
                                <p>Những Phòng của Loại phòng này cũng sẽ bị xóa</p>
                                <Button>
                                    <ButtonContainer>
                                        <ButtonClick
                                            onClick={() => { handleDeleteRoomType(roomTypeIdModal) }}
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