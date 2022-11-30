import { CloseOutlined } from "@mui/icons-material";
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";

// SERVICES
import * as PositionService from "../../service/PositionService";
import { format_money } from "../../utils/utils";

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

const Modal = ({ showModal, setShowModal, type, position, setReRenderData, handleClose, showToastFromOut }) => {
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

    // =============== Xử lý cập nhật Chức vụ ===============
    const handleUpdatePosition = async (positionName, positionSalary, positionBonusSalary, positionId) => {
        try {
            const updatePositionRes = await PositionService.updatePosition({
                positionId: positionId,
                positionName: positionName,
                positionSalary: positionSalary,
                positionBonusSalary: positionBonusSalary
            });
            if (!updatePositionRes) {
                // Toast
                const dataToast = { message: updatePositionRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }

            // Success
            setShowModal(prev => !prev);
            handleClose();  //Đóng thanh tìm kiếm và render lại giá trị mới ở compo Main
            // Toast
            const dataToast = { message: updatePositionRes.data.message, type: "success" };
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
    const [positionModal, setPositionModal] = useState();
    const [positionIdModal, setPositionIdModal] = useState();
    const [positionNameModal, setPositionNameModal] = useState();
    const [positionSalaryModal, setPositionSalaryModal] = useState();
    const [positionBonusSalaryModal, setPositionBonusSalaryModal] = useState();
    useEffect(() => {
        const getPosition = async () => {
            try {
                const positionRes = await PositionService.findPositionById({
                    positionId: position.position_id
                });
                console.log("RES: ", positionRes);
                setPositionModal(positionRes.data.data);
                setPositionIdModal(positionRes.data.data.position_id);
                setPositionNameModal(positionRes.data.data.position_name);
                setPositionSalaryModal(positionRes.data.data.position_salary);
                setPositionBonusSalaryModal(positionRes.data.data.position_bonus_salary);
            } catch (err) {
                console.log("Lỗi lấy Chức vụ: ", err.response);
            }
        }
        if (position) {
            getPosition();
        }
    }, [position, showModal]);
    console.log("Position modal: ", positionModal);

    // =============== Xử lý thêm Chức vụ ===============
    const [positionNameModalNew, setPositionNameModalNew] = useState();
    const [positionSalaryModalNew, setPositionSalaryModalNew] = useState();
    const [positionBonusSalaryModalNew, setPositionBonusSalaryModalNew] = useState();

    // Create new position
    const handleCreatePosition = async (newName, newSalary, newBonusSalary) => {
        console.log("asssssss: ", newName, newSalary, newBonusSalary);
        try {
            const createPositionRes = await PositionService.createPosition({
                positionName: newName,
                positionSalary: newSalary,
                positionBonusSalary: newBonusSalary
            });
            if (!createPositionRes) {
                // Toast
                const dataToast = { message: createPositionRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }

            // Success
            setReRenderData(prev => !prev); //Render lại csdl ở Compo cha là - DanhMucMain & DanhMucRight.jsx
            setShowModal(prev => !prev);
            // Toast
            const dataToast = { message: createPositionRes.data.message, type: "success" };
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

    // =============== Xử lý xóa Chức vụ ===============
    const handleDeletePosition = async (positionId) => {
        try {
            const deletePositionRes = await PositionService.deletePosition(positionId);
            if (!deletePositionRes) {
                // Toast
                const dataToast = { message: deletePositionRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }
            // Success
            setShowModal(prev => !prev);
            handleClose();  //Đóng thanh tìm kiếm và render lại giá trị mới ở compo Main
            // Toast
            const dataToast = { message: deletePositionRes.data.message, type: "success" };
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
    //  =============== Chi tiết Chức vụ ===============
    if (type === "detailPosition") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>Chi tiết Chức vụ</H1>
                            <ModalForm>
                                <ModalFormItem>
                                    <FormSpan>Mã Chức vụ:</FormSpan>
                                    <FormInput type="text" value={positionModal ? positionModal.position_id : null} readOnly />
                                </ModalFormItem>
                                <ModalFormItem>
                                    <FormSpan>Tên Chức vụ:</FormSpan>
                                    <FormInput type="text" value={positionModal ? positionModal.position_name : null} readOnly />
                                </ModalFormItem>
                                <ModalFormItem>
                                    <FormSpan>Lương cơ bản:</FormSpan>
                                    <FormInput type="text" value={positionModal ? format_money(positionModal.position_salary) + " VNĐ" : null} readOnly />
                                </ModalFormItem>
                                <ModalFormItem>
                                    <FormSpan>Lương thưởng:</FormSpan>
                                    <FormInput type="text" value={positionModal ? format_money(positionModal.position_bonus_salary) + " VNĐ" : null} readOnly />
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
    //  =============== Thêm Chức vụ ===============
    if (type === "createPosition") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>Thêm Chức vụ mới</H1>
                            <ModalForm>
                                <ModalFormItem>
                                    <FormSpan>Tên Chức vụ mới:</FormSpan>
                                    <FormInput type="text" onChange={(e) => setPositionNameModalNew(e.target.value)} placeholder="Nhập vào tên Chức vụ" />
                                </ModalFormItem>
                                <ModalFormItem>
                                    <FormSpan>Mức lương cơ bản:</FormSpan>
                                    <FormInput type="number" onChange={(e) => setPositionSalaryModalNew(parseInt(e.target.value))} placeholder="Nhập vào số tiền Lương cơ bản" />
                                </ModalFormItem>
                                <ModalFormItem>
                                    <FormSpan>Mức lương Thưởng:</FormSpan>
                                    <FormInput type="number" onChange={(e) => setPositionBonusSalaryModalNew(parseInt(e.target.value))} placeholder="Nhập vào số tiền Lương thưởng" />
                                </ModalFormItem>
                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => handleCreatePosition(positionNameModalNew, positionSalaryModalNew, positionBonusSalaryModalNew)}
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
    // =============== Chỉnh sửa Chức vụ ===============
    if (type === "updatePosition") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>Cập nhật Chức vụ nhân viên</H1>
                            <ModalForm>
                                <ModalFormItem>
                                    <FormSpan>Tên chức vụ nhân viên:</FormSpan>
                                    <FormInput type="text" onChange={(e) => setPositionNameModal(e.target.value)} value={positionNameModal} />
                                </ModalFormItem>
                                <ModalFormItem>
                                    <FormSpan>Mức lương cơ bản:</FormSpan>
                                    <FormInput type="number" onChange={(e) => setPositionSalaryModal(parseInt(e.target.value))} value={positionSalaryModal} />
                                </ModalFormItem>
                                <ModalFormItem>
                                    <FormSpan>Mức lương Thưởng:</FormSpan>
                                    <FormInput type="number" onChange={(e) => setPositionBonusSalaryModal(parseInt(e.target.value))} value={positionBonusSalaryModal} />
                                </ModalFormItem>
                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => handleUpdatePosition(positionNameModal, positionSalaryModal, positionBonusSalaryModal, positionIdModal)}
                                    >Cập nhật</ButtonClick>
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
    // =============== Xóa Chức vụ ===============
    if (type === "deletePosition") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ backgroundImage: `url("https://img.freepik.com/free-vector/alert-safety-background_97886-3460.jpg?w=1060")`, backgroundPosition: `center center`, backgroundRepeat: `no-repeat`, backgroundSize: `cover`, width: `600px`, height: `400px` }} >
                            <ModalContent>
                                <h1>Bạn muốn xóa Chức vụ <span style={{ color: `var(--color-primary)` }}>{positionNameModal}</span> này?</h1>
                                <p>Những thiết bị của loại này cũng sẽ bị xóa</p>
                                <Button>
                                    <ButtonContainer>
                                        <ButtonClick
                                            onClick={() => { handleDeletePosition(positionIdModal) }}
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