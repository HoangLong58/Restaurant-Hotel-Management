import { format_money } from "../../utils/utils";
import styled from "styled-components";
import { CloseOutlined } from "@mui/icons-material";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from "../../firebase";

// SERVICES
import * as RoomBookingOrderService from "../../service/RoomBookingOrderService";
import * as RoomBookingFoodDetailService from "../../service/RoomBookingFoodDetailService";

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
    width: 90%;
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
    color: var(--color-white);
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

const Modal = ({ showModal, setShowModal, type, roomBookingOrder, setReRenderData, handleClose, showToastFromOut }) => {
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

    // Chi tiết đặt phòng
    useEffect(() => {
        setRoomBookingOrderIdentityCardModal();
        setRoomBookingOrderPhoneNumberModal();
        setRoomBookingOrderEmailModal();
        setRoomBookingOrderNationModal();
        setRoomBookingOrderFirstNameModal();
        setRoomBookingOrderLastNameModal();
    }, [showModal]);

    const [roomBookingOrderModal, setRoomBookingOrderModal] = useState();
    const [roomBookingOrderIdModal, setRoomBookingOrderIdModal] = useState();
    const [roomBookingFoodDetailListModal, setRoomBookingFoodDetailListModal] = useState([]);
    useEffect(() => {
        const getRoomBookingOrderById = async () => {
            try {
                const roomBookingOrderRes = await RoomBookingOrderService.findRoomBookingById({
                    roomBookingId: roomBookingOrder.room_booking_order_id
                });
                setRoomBookingOrderModal(roomBookingOrderRes.data.data);
                setRoomBookingOrderIdModal(roomBookingOrderRes.data.data.room_booking_order_id);
            } catch (err) {
                console.log("Lỗi lấy room booking order: ", err.response);
            }
        }
        const getRoomBookingFoodDetails = async () => {
            try {
                const roomBookingFoodDetailRes = await RoomBookingFoodDetailService.getRoomBookingFoodDetailsByRoomBookingOrderId(
                    roomBookingOrder.room_booking_detail_id
                );
                setRoomBookingFoodDetailListModal(roomBookingFoodDetailRes.data.data);
            } catch (err) {
                console.log("Lỗi lấy room booking food detail: ", err.response);
            }
        }
        if (roomBookingOrder) {
            getRoomBookingOrderById();
            getRoomBookingFoodDetails();
        }
    }, [roomBookingOrder, showModal]);

    // Check in
    const [roomBookingOrderIdentityCardModal, setRoomBookingOrderIdentityCardModal] = useState();
    const [roomBookingOrderPhoneNumberModal, setRoomBookingOrderPhoneNumberModal] = useState();
    const [roomBookingOrderEmailModal, setRoomBookingOrderEmailModal] = useState();
    const [roomBookingOrderNationModal, setRoomBookingOrderNationModal] = useState();
    const [roomBookingOrderFirstNameModal, setRoomBookingOrderFirstNameModal] = useState();
    const [roomBookingOrderLastNameModal, setRoomBookingOrderLastNameModal] = useState();

    const handleChangeIdentityCard = (e) => {
        const resultKey = e.target.value.replace(/[^0-9 ]/gi, '');
        setRoomBookingOrderIdentityCardModal(resultKey);
    }
    const handleChangePhoneNumber = (e) => {
        const resultKey = e.target.value.replace(/[^0-9 ]/gi, '');
        setRoomBookingOrderPhoneNumberModal(resultKey);
    }
    const handleChangeEmail = (e) => {
        // Được nhập @ và . nhưng kí tự đb khác thì không
        const resultEmail = e.target.value.replace(/[`~!#$%^&*()|+\-=?;:'",<>\{\}\[\]\\\/]/gi, '');
        setRoomBookingOrderEmailModal(resultEmail);
    }
    const handleChangeNation = (e) => {
        // Được nhập @ và . nhưng kí tự đb khác thì không
        const resultNation = e.target.value.replace(/[`~!#$%^&*()|+\-=?;:'",<>\{\}\[\]\\\/0-9]/gi, '');
        setRoomBookingOrderNationModal(resultNation);
    }
    const handleChangeFirstName = (e) => {
        // Được nhập @ và . nhưng kí tự đb khác thì không
        const resultFirstName = e.target.value.replace(/[`~!#$%^&*()|+\-=?;:'",<>\{\}\[\]\\\/0-9]/gi, '');
        setRoomBookingOrderFirstNameModal(resultFirstName);
    }
    const handleChangeLastName = (e) => {
        // Được nhập @ và . nhưng kí tự đb khác thì không
        const resultLastName = e.target.value.replace(/[`~!#$%^&*()|+\-=?;:'",<>\{\}\[\]\\\/0-9]/gi, '');
        setRoomBookingOrderLastNameModal(resultLastName);
    }

    const handleCheckin = async (
        customerFirstName,
        customerLastName,
        customerEmail,
        customerPhoneNumber,
        roomBookingOrderIdentityCard,
        roomBookingOrderNation,
        roomBookingOrderId
    ) => {
        try {
            const checkInRes = await RoomBookingOrderService.checkIn({
                customerFirstName: customerFirstName,
                customerLastName: customerLastName,
                customerEmail: customerEmail,
                customerPhoneNumber: customerPhoneNumber,
                roomBookingOrderIdentityCard: roomBookingOrderIdentityCard,
                roomBookingOrderNation: roomBookingOrderNation,
                roomBookingOrderId: roomBookingOrderId
            });
            if (!checkInRes) {
                // Toast
                const dataToast = { message: checkInRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }
            // Success
            setShowModal(prev => !prev);
            handleClose();
            // Toast
            const dataToast = { message: checkInRes.data.message, type: "success" };
            showToastFromOut(dataToast);
            return;
        } catch (err) {
            setShowModal(prev => !prev);
            handleClose();
            // Toast
            const dataToast = { message: err.response.data.message, type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
    }

    const handleCheckout = async (roomBookingOrderId) => {
        try {
            const checkOutRes = await RoomBookingOrderService.checkOut({
                roomBookingOrderId: roomBookingOrderId
            });
            if (!checkOutRes) {
                // Toast
                const dataToast = { message: checkOutRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }
            // Success
            setShowModal(prev => !prev);
            handleClose();
            // Toast
            const dataToast = { message: checkOutRes.data.message, type: "success" };
            showToastFromOut(dataToast);
            return;
        } catch (err) {
            setShowModal(prev => !prev);
            handleClose();
            // Toast
            const dataToast = { message: err.response.data.message, type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
    }

    console.log("SHOW: ", roomBookingOrderModal, roomBookingFoodDetailListModal);
    // ================================================================
    //  =============== Checkin ===============
    if (type === "checkin") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column`, width: "50%" }}>
                            <H1>Checkin nhận Phòng 14</H1>
                            <ModalForm>
                                <ModalFormItem>
                                    <div className="row">
                                        <div className="col-lg-6">
                                            <FormSpan>Họ của khách hàng:</FormSpan>
                                            <FormInput style={{ width: "100%" }} type="text"
                                                value={roomBookingOrderFirstNameModal}
                                                placeholder="Họ của Khách hàng"
                                                onChange={(e) => handleChangeFirstName(e)}
                                            />
                                        </div>
                                        <div className="col-lg-6">
                                            <FormSpan>Tên của khách hàng:</FormSpan>
                                            <FormInput style={{ width: "100%" }} type="text"
                                                value={roomBookingOrderLastNameModal}
                                                placeholder="Tên của Khách hàng"
                                                onChange={(e) => handleChangeLastName(e)}
                                            />
                                        </div>
                                    </div>
                                </ModalFormItem>
                                <ModalFormItem>
                                    <FormSpan>Chứng minh nhân dân:</FormSpan>
                                    <FormInput type="text"
                                        placeholder="Chứng minh thư của Khách hàng"
                                        value={roomBookingOrderIdentityCardModal}
                                        onChange={(e) => handleChangeIdentityCard(e)} />
                                </ModalFormItem>
                                <ModalFormItem>
                                    <FormSpan>Quốc tịch:</FormSpan>
                                    <FormInput type="text"
                                        placeholder="Quốc tịch của Khách hàng"
                                        value={roomBookingOrderNationModal}
                                        onChange={(e) => handleChangeNation(e)}
                                    />
                                </ModalFormItem>
                                <ModalFormItem>
                                    <FormSpan>Email Khách hàng:</FormSpan>
                                    <FormInput type="text"
                                        placeholder="Email đã đặt phòng"
                                        value={roomBookingOrderEmailModal}
                                        onChange={(e) => handleChangeEmail(e)}
                                    />
                                </ModalFormItem>
                                <ModalFormItem>
                                    <FormSpan>Số điện thoại:</FormSpan>
                                    <FormInput type="text"
                                        placeholder="Số điện thoại đã đặt phòng"
                                        value={roomBookingOrderPhoneNumberModal}
                                        onChange={(e) => handleChangePhoneNumber(e)} />
                                </ModalFormItem>
                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => handleCheckin(
                                            roomBookingOrderFirstNameModal,
                                            roomBookingOrderLastNameModal,
                                            roomBookingOrderEmailModal,
                                            roomBookingOrderPhoneNumberModal,
                                            roomBookingOrderIdentityCardModal,
                                            roomBookingOrderNationModal,
                                            roomBookingOrderIdModal
                                        )}
                                    >Check in</ButtonClick>
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
    // =============== Checkout ===============
    if (type === "checkout") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <AlertWrapper showModal={showModal} >
                            <ModalForm>
                                <ModalFormItem>
                                    <h1>Bạn muốn Check out <span style={{ color: `var(--color-primary)` }}>{roomBookingOrder ? roomBookingOrder.room_name : null}</span> này?</h1>
                                    <p style={{ marginTop: "10px" }}>Đảm bảo Khách hàng đã thanh toán Phụ phí trước khi tiến hành Check out!</p>
                                </ModalFormItem>
                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => handleCheckout(roomBookingOrderIdModal)}
                                    >Check out</ButtonClick>
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
    //  =============== Xem chi tiết Phòng ===============
    if (type === "detailRoomBookingOrder") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <LeftVoteTitle style={{ marginTop: "10px", fontSize: "1.6rem" }}>Chi tiết Đặt phòng</LeftVoteTitle>
                            <ModalForm style={{ padding: "0px 20px" }}>
                                <div className="col-lg-12">
                                    <div className="row">
                                        <LeftVote className="col-lg-6">
                                            <LeftVoteItem className="row">
                                                <LeftVoteTitle>Thông tin Đặt phòng</LeftVoteTitle>
                                                <InforCustomer className="col-lg-12">
                                                    <InfoItem className="row">
                                                        <InfoTitle className="col-lg-4">Thời gian: </InfoTitle>
                                                        <InfoDetail className="col-lg-8">Từ ngày {roomBookingOrderModal ? roomBookingOrderModal.room_booking_detail_checkin_date : null} đến {roomBookingOrderModal ? roomBookingOrderModal.room_booking_detail_checkout_date : null}</InfoDetail>
                                                    </InfoItem>
                                                    <InfoItem className="row">
                                                        <InfoTitle className="col-lg-4">Trạng thái: </InfoTitle>
                                                        <InfoDetail className="col-lg-8" style={{ fontWeight: "bold", color: "var(--color-primary)" }}>{roomBookingOrderModal ? roomBookingOrderModal.room_booking_order_state === 2 ? "Hoàn thành lúc: " + roomBookingOrderModal.room_booking_order_finish_date : roomBookingOrderModal.room_booking_order_state === 1 ? "Đã checkin lúc: " + roomBookingOrderModal.room_booking_order_start_date : roomBookingOrderModal.room_booking_order_state === 0 ? "Đã đặt lúc: " + roomBookingOrderModal.room_booking_order_book_date : null : null}</InfoDetail>
                                                    </InfoItem>
                                                </InforCustomer>
                                                <LeftImage src={roomBookingOrderModal ? roomBookingOrderModal.room_image_content : null} />
                                                <CartItem style={{ position: "absolute", bottom: "12px", left: "12px", width: "96%", borderRadius: "20px" }}>
                                                    <Circle />
                                                    <Course>
                                                        <Content>
                                                            <span style={{ width: "320px", fontWeight: "bold" }}> {roomBookingOrderModal ? roomBookingOrderModal.room_name + ", " + roomBookingOrderModal.floor_name : null} </span>
                                                            <span style={{ fontWeight: "400", color: "var(--color-primary)", width: "145px", textAlign: "right" }}>{roomBookingOrderModal ? roomBookingOrderModal.room_booking_order_price : null} VNĐ</span>
                                                        </Content>
                                                        <span style={{ fontWeight: "400" }}><span style={{ color: "var(--color-primary)" }}>1</span> x {roomBookingOrderModal ? roomBookingOrderModal.room_type_name : null}</span>
                                                    </Course>
                                                </CartItem>
                                            </LeftVoteItem>
                                            <LeftVoteItem2 className="row">
                                                <LeftVoteTitle>Thông tin Khách hàng</LeftVoteTitle>
                                                <InforCustomer className="col-lg-12">
                                                    <InfoItem className="row">
                                                        <InfoTitle className="col-lg-4">Họ tên: </InfoTitle>
                                                        <InfoDetail className="col-lg-8">{roomBookingOrderModal ? roomBookingOrderModal.customer_first_name + " " + roomBookingOrderModal.customer_last_name : null}</InfoDetail>
                                                    </InfoItem>
                                                    <InfoItem className="row">
                                                        <InfoTitle className="col-lg-4">Chứng minh thư: </InfoTitle>
                                                        <InfoDetail className="col-lg-8">{roomBookingOrderModal ? roomBookingOrderModal.room_booking_order_state === 0 ? "Chưa Checkin" : roomBookingOrderModal.room_booking_order_identity_card : null}</InfoDetail>
                                                    </InfoItem>
                                                    <InfoItem className="row">
                                                        <InfoTitle className="col-lg-4">Quốc tịch: </InfoTitle>
                                                        <InfoDetail className="col-lg-8">{roomBookingOrderModal ? roomBookingOrderModal.room_booking_order_state === 0 ? "Chưa Checkin" : roomBookingOrderModal.room_booking_order_nation : null}</InfoDetail>
                                                    </InfoItem>
                                                    <InfoItem className="row">
                                                        <InfoTitle className="col-lg-4">Email: </InfoTitle>
                                                        <InfoDetail className="col-lg-8">{roomBookingOrderModal ? roomBookingOrderModal.customer_email : null}</InfoDetail>
                                                    </InfoItem>
                                                    <InfoItem className="row">
                                                        <InfoTitle className="col-lg-4">SDT: </InfoTitle>
                                                        <InfoDetail className="col-lg-8">{roomBookingOrderModal ? roomBookingOrderModal.customer_phone_number : null}</InfoDetail>
                                                    </InfoItem>
                                                </InforCustomer>
                                            </LeftVoteItem2>
                                        </LeftVote>

                                        <RightVote className="col-lg-6">
                                            <RightVoteItem className="row">
                                                <RightVoteTitle className="col-lg-12">Thông tin Phụ phí</RightVoteTitle>
                                                <Surcharge className="col-lg-12">
                                                    {
                                                        roomBookingFoodDetailListModal.length > 0
                                                            ?
                                                            roomBookingFoodDetailListModal.map((roomBookingFoodDetail, key) => {
                                                                const foodArray = roomBookingFoodDetail.foodArray;
                                                                const bookDate = roomBookingFoodDetail.bookDate;
                                                                const total = roomBookingFoodDetail.total;
                                                                return (
                                                                    <>
                                                                        <RightVoteTitle style={{ fontSize: "1.1rem" }} className="col-lg-12">Ngày {bookDate}: Đã đặt <span style={{ color: "var(--color-primary)", marginLeft: "5px" }}> {total}VNĐ</span></RightVoteTitle>
                                                                        {
                                                                            foodArray.map((food, key) => {
                                                                                return (
                                                                                    <CartItem>
                                                                                        <Circle />
                                                                                        <Course>
                                                                                            <Content>
                                                                                                <span style={{ width: "320px", fontWeight: "bold" }}> {food.food_name} </span>
                                                                                                <span style={{ fontWeight: "400", color: "var(--color-primary)", width: "145px", textAlign: "right" }}>{food.room_booking_food_detail_price} VNĐ</span>
                                                                                            </Content>
                                                                                            <span style={{ fontWeight: "400" }}><span style={{ color: "var(--color-primary)" }}>{food.room_booking_food_detail_quantity}</span> x {food.food_type_name}</span>
                                                                                        </Course>
                                                                                    </CartItem>
                                                                                )
                                                                            })
                                                                        }
                                                                    </>
                                                                )
                                                            })
                                                            : (
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
                                                                    <EmptyContent class="EmptyStatestyles__StyledTitle-sc-qsuc29-2 gAMClh">Khách hàng chưa có Phụ phí nào!</EmptyContent>
                                                                </EmptyItem>
                                                            )
                                                    }
                                                </Surcharge>
                                            </RightVoteItem>
                                            <RightVoteItem2 className="row">
                                                <RightVoteTitle>Tổng cộng</RightVoteTitle>
                                                <InforTotal className="col-lg-12">
                                                    <InfoTotalItem className="row">
                                                        <InfoTotalTitle className="col-lg-8">Tiền đặt phòng: (Đã thanh toán) </InfoTotalTitle>
                                                        <InfoTotalDetail className="col-lg-4">{roomBookingOrderModal ? roomBookingOrderModal.room_booking_order_price : null} VNĐ</InfoTotalDetail>
                                                    </InfoTotalItem>
                                                    <InfoTotalItem className="row">
                                                        <InfoTotalTitle className="col-lg-8">Phụ phí: </InfoTotalTitle>
                                                        <InfoTotalDetail className="col-lg-4">{roomBookingOrderModal ? roomBookingOrderModal.room_booking_order_surcharge : null} VNĐ</InfoTotalDetail>
                                                    </InfoTotalItem>
                                                    <InfoTotalItem className="row">
                                                        <InfoTotalTitle className="col-lg-8">Tổng tiền thanh toán khi Check out: </InfoTotalTitle>
                                                        <InfoTotalDetail className="col-lg-4">{roomBookingOrderModal ? roomBookingOrderModal.room_booking_order_surcharge : null} VNĐ</InfoTotalDetail>
                                                    </InfoTotalItem>
                                                </InforTotal>
                                            </RightVoteItem2>
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
    }
};

export default Modal;