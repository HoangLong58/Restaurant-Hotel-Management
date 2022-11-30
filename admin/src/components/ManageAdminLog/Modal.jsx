import { CloseOutlined } from "@mui/icons-material";
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";

// SERVICES
import * as AdminLogService from "../../service/AdminLogService";

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
    width: 750px;
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
    height: 140px;
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
const Modal = ({ showModal, setShowModal, type, adminLog, setReRenderData, handleClose, showToastFromOut }) => {
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

    //  test
    const [adminLogModal, setAdminLogModal] = useState();
    const [adminLogIdModal, setAdminLogIdModal] = useState();
    const [adminLogNameModal, setAdminLogNameModal] = useState();
    const [adminLogImageModal, setAdminLogImageModal] = useState();
    useEffect(() => {
        const getAdminLog = async () => {
            try {
                const adminLogRes = await AdminLogService.findAdminLogById({
                    adminLogId: adminLog.admin_log_id
                });
                console.log("RES: ", adminLogRes);
                setAdminLogModal(adminLogRes.data.data);
                setAdminLogIdModal(adminLogRes.data.data.admin_log_id);
                setAdminLogNameModal(adminLogRes.data.data.admin_log_name);
                setAdminLogImageModal(adminLogRes.data.data.admin_log_image);

            } catch (err) {
                console.log("Lỗi lấy danh mục: ", err.response);
            }
        }
        if (adminLog) {
            getAdminLog();
        }
    }, [adminLog]);

    // ================================================================
    //  =============== Chi tiết Nhật ký hoạt động ===============
    if (type === "detailAdminLog") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>Chi tiết Nhật ký hoạt động</H1>
                            <ModalForm>
                                <div className="row">
                                    <div className="col-lg-3">
                                        <ModalFormItem>
                                            <FormSpan>Mã số:</FormSpan>
                                            <FormInput type="text" value={adminLogModal ? adminLogModal.admin_log_id : null} readOnly />
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-5">
                                        <ModalFormItem>
                                            <FormSpan>Thời gian thực hiện:</FormSpan>
                                            <FormInput type="text" value={adminLogModal ? adminLogModal.admin_log_date : null} readOnly />
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-4">
                                        <ModalFormItem>
                                            <FormSpan>Loại thao tác:</FormSpan>
                                            <FormInput type="text" value={adminLogModal ? adminLogModal.admin_log_type : null} readOnly />
                                        </ModalFormItem>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-4">
                                        <ModalFormItem>
                                            <FormSpan>Họ tên:</FormSpan>
                                            <FormInput type="text" value={adminLogModal ? adminLogModal.employee_first_name + " " + adminLogModal.employee_last_name : null} readOnly />
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-4">
                                        <ModalFormItem>
                                            <FormSpan>Email:</FormSpan>
                                            <FormInput type="text" value={adminLogModal ? adminLogModal.employee_email : null} readOnly />
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-4">
                                        <ModalFormItem>
                                            <FormSpan>Số điện thoại:</FormSpan>
                                            <FormInput type="text" value={adminLogModal ? adminLogModal.employee_phone_number : null} readOnly />
                                        </ModalFormItem>
                                    </div>
                                </div>
                                <ModalFormItem>
                                    <FormSpan>Nội dung Hoạt động:</FormSpan>
                                    <FormTextArea style={{ height: "65px" }} rows="2" cols="50" value={adminLogModal ? adminLogModal.employee_first_name + " " + adminLogModal.employee_last_name + " " + adminLogModal.admin_log_content : null} readOnly />
                                </ModalFormItem>
                                <ModalFormItem>
                                    <FormSpan>Hình ảnh:</FormSpan>
                                    <FormImg src={adminLogModal ? adminLogModal.employee_image : null}></FormImg>
                                </ModalFormItem>

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