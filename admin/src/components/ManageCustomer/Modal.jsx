import { CloseOutlined } from "@mui/icons-material";
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";

// SERVICES
import * as CustomerService from "../../service/CustomerService";

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

const Modal = ({ showModal, setShowModal, type, customer, setReRenderData, handleClose, showToastFromOut }) => {
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
    //  Modal data
    const [customerModal, setCustomerModal] = useState();
    const [customerIdModal, setCustomerIdModal] = useState();
    useEffect(() => {
        const getCustomerModal = async () => {
            try {
                const customerRes = await CustomerService.findCustomerById(customer.customer_id);
                setCustomerModal(customerRes.data.data);
                setCustomerIdModal(customerRes.data.data.customer_id);
            } catch (err) {
                console.log("Lỗi lấy customer: ", err.response);
            }
        }
        if (customer) {
            getCustomerModal();
        }
    }, [customer]);
    console.log("customerModal: ", customerModal);

    // =============== Xử lý Disable Customer ===============
    const handleDisableCustomer = async (customerId) => {
        try {
            const disableCustomerRes = await CustomerService.updateCustomerStateToDisable({
                customerId: customerId
            });
            if (!disableCustomerRes) {
                // Toast
                const dataToast = { message: disableCustomerRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }
            // Success
            setShowModal(prev => !prev);
            handleClose();  //Đóng thanh tìm kiếm và render lại giá trị mới ở compo Main
            // Toast
            const dataToast = { message: disableCustomerRes.data.message, type: "success" };
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

    // =============== Xử lý Able Customer ===============
    const handleAbleCustomer = async (customerId) => {
        try {
            const ableCustomerRes = await CustomerService.updateCustomerStateToAble({
                customerId: customerId
            });
            if (!ableCustomerRes) {
                // Toast
                const dataToast = { message: ableCustomerRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }
            // Success
            setShowModal(prev => !prev);
            handleClose();  //Đóng thanh tìm kiếm và render lại giá trị mới ở compo Main
            // Toast
            const dataToast = { message: ableCustomerRes.data.message, type: "success" };
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
    // ================================================================
    //  =============== Chi tiết Khách hàng ===============
    if (type === "detailCustomer") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ChiTietWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>Chi tiết Khách hàng</H1>
                            <ModalForm>
                                <div className="row">
                                    <div className="col-lg-3">
                                        <ChiTietHinhAnh src={customerModal ? customerModal.customer_image : null} />
                                    </div>
                                    <div className="col-lg-9">
                                        <div className="row">
                                            <div className="col-lg-3">
                                                <ModalFormItem style={{ margin: "0 10px" }}>
                                                    <FormSpan>Mã Khách hàng:</FormSpan>
                                                    <FormInput type="text" value={customerModal ? customerModal.customer_id : null} readOnly />
                                                </ModalFormItem>
                                            </div>
                                            <div className="col-lg-3">
                                                <ModalFormItem style={{ margin: "0 10px" }}>
                                                    <FormSpan>Tên Khách hàng:</FormSpan>
                                                    <FormInput type="text" value={customerModal ? customerModal.customer_first_name + " " + customerModal.customer_last_name : null} readOnly />
                                                </ModalFormItem>
                                            </div>
                                            <div className="col-lg-3">
                                                <ModalFormItem style={{ margin: "0 10px" }}>
                                                    <FormSpan>Giới tính:</FormSpan>
                                                    <FormInput type="text" value={customerModal ? customerModal.customer_state === "ACTIVE" ? customerModal.customer_gender : "Khách hàng chưa cập nhật" : null} readOnly />
                                                </ModalFormItem>
                                            </div>
                                            <div className="col-lg-3">
                                                <ModalFormItem style={{ margin: "0 10px" }}>
                                                    <FormSpan>Ngày sinh:</FormSpan>
                                                    <FormInput type="text" value={customerModal ? customerModal.customer_state === "ACTIVE" ? customerModal.customer_birthday : "Khách hàng chưa cập nhật" : null} readOnly />
                                                </ModalFormItem>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-8">
                                                <ModalFormItem style={{ margin: "0 10px" }}>
                                                    <FormSpan>Email:</FormSpan>
                                                    <FormInput type="text" value={customerModal ? customerModal.customer_email : null} readOnly />
                                                </ModalFormItem>
                                                <ModalFormItem style={{ margin: "0 10px" }}>
                                                    <FormSpan>Số điện thoại:</FormSpan>
                                                    <FormInput type="text" value={customerModal ? customerModal.customer_phone_number : null} readOnly />
                                                </ModalFormItem>
                                            </div>
                                            <div className="col-lg-4">
                                                <ModalFormItem style={{ margin: "0 10px" }}>
                                                    <FormSpan>Trạng thái:</FormSpan>
                                                    <FormInput type="text" value={customerModal ? customerModal.customer_state : null} readOnly />
                                                </ModalFormItem>
                                                <ModalFormItem style={{ margin: "0 10px" }}>
                                                    <FormSpan>OTP:</FormSpan>
                                                    <FormInput type="text" value={customerModal ? customerModal.customer_otp === 0 || customerModal.customer_otp === null ? "Chưa cần xác minh OTP" : "Đang xác minh OTP" : null} readOnly />
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

    // =============== Disable Customer ===============
    if (type === "disableCustomer") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <AlertWrapper showModal={showModal} s >
                            <ModalForm>
                                <ModalFormItem>
                                    <h1>Bạn muốn Vô hiệu hóa Khách hàng <span style={{ color: `var(--color-primary)` }}>{customerModal ? customerModal.customer_first_name + " " + customerModal.customer_last_name : null}</span> này?</h1>
                                    <p style={{marginTop: "10px"}}>Tài khoản Email và Số điện thoại của người dùng sẽ không thể đăng nhập nữa!</p>
                                </ModalFormItem>
                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => handleDisableCustomer(customerIdModal)}
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
    // =============== able Customer ===============
    if (type === "ableCustomer") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <AlertWrapper showModal={showModal} s >
                            <ModalForm>
                                <ModalFormItem>
                                    <h1>Bạn muốn Mở khóa Khách hàng <span style={{ color: `var(--color-primary)` }}>{customerModal ? customerModal.customer_first_name + " " + customerModal.customer_last_name : null}</span> này?</h1>
                                    <p style={{marginTop: "10px"}}>Tài khoản Email và Số điện thoại của người dùng sẽ có thể đăng nhập lại như trước!</p>
                                </ModalFormItem>
                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => handleAbleCustomer(customerIdModal)}
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
};

export default Modal;