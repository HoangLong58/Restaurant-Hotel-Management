import { CloseOutlined } from "@mui/icons-material";
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";

// SERVICES
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

const Modal = ({ showModal, setShowModal, type, partyHallType, setReRenderData, handleClose, showToastFromOut }) => {
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
        setPartyHallTypeNameModalNew();
    }, [showModal]);

    const handleUpdatePartyHallType = async (newPartyHallTypeName, partyHallTypeId) => {
        try {
            const updatePartyHallTypeRes = await PartyHallTypeService.updatePartyHallType({
                partyHallTypeId: partyHallTypeId,
                partyHallTypeName: newPartyHallTypeName
            });
            if (!updatePartyHallTypeRes) {
                // Toast
                const dataToast = { message: updatePartyHallTypeRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }

            // Success
            setShowModal(prev => !prev);
            handleClose();  //Đóng thanh tìm kiếm và render lại giá trị mới ở compo Main
            // Toast
            const dataToast = { message: updatePartyHallTypeRes.data.message, type: "success" };
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
    //  test
    const [partyHallTypeModal, setPartyHallTypeModal] = useState();
    const [partyHallTypeIdModal, setPartyHallTypeIdModal] = useState();
    const [partyHallTypeNameModal, setPartyHallTypeNameModal] = useState();

    const [partyHallTypeModalOld, setPartyHallTypeModalOld] = useState();
    const [partyHallTypeNameModalOld, setPartyHallTypeNameModalOld] = useState();
    useEffect(() => {
        const getPartyHallType = async () => {
            try {
                const partyHallTypeRes = await PartyHallTypeService.findPartyHallTypeById({
                    partyHallTypeId: partyHallType.party_hall_type_id
                });
                console.log("RES: ", partyHallTypeRes);
                setPartyHallTypeModal(partyHallTypeRes.data.data);
                setPartyHallTypeIdModal(partyHallTypeRes.data.data.party_hall_type_id);
                setPartyHallTypeNameModal(partyHallTypeRes.data.data.party_hall_type_name);

                setPartyHallTypeModalOld(partyHallTypeRes.data.data);
                setPartyHallTypeNameModalOld(partyHallTypeRes.data.data.party_hall_type_name);
            } catch (err) {
                console.log("Lỗi lấy danh mục: ", err.response);
            }
        }
        if (partyHallType) {
            getPartyHallType();
        }
    }, [partyHallType]);
    console.log("Danh mục modal: ", partyHallTypeModal);

    const handleCloseUpdate = () => {
        // Set lại giá trị cũ sau khi đóng Modal
        setPartyHallTypeNameModal(partyHallTypeNameModalOld);

        setShowModal(prev => !prev);
    }

    // =============== Xử lý thêm danh mục ===============
    const [partyHallTypeNameModalNew, setPartyHallTypeNameModalNew] = useState();

    // Create new party booking type
    const handleCreatePartyHallType = async (newName) => {
        try {
            const createPartyHallTypeRes = await PartyHallTypeService.createPartyHallType({
                partyHallTypeName: newName
            });
            if (!createPartyHallTypeRes) {
                // Toast
                const dataToast = { message: createPartyHallTypeRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }

            // Success
            setReRenderData(prev => !prev); //Render lại csdl ở Compo cha là - DanhMucMain & DanhMucRight.jsx
            setShowModal(prev => !prev);
            // Toast
            const dataToast = { message: createPartyHallTypeRes.data.message, type: "success" };
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
    const handleDeletePartyHallType = async (partyHallTypeId) => {
        try {
            const deletePartyHallTypeRes = await PartyHallTypeService.deletePartyHallType(partyHallTypeId);
            if (!deletePartyHallTypeRes) {
                // Toast
                const dataToast = { message: deletePartyHallTypeRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }
            // Success
            setShowModal(prev => !prev);
            handleClose();  //Đóng thanh tìm kiếm và render lại giá trị mới ở compo Main
            // Toast
            const dataToast = { message: deletePartyHallTypeRes.data.message, type: "success" };
            showToastFromOut(dataToast);
            return;
        } catch (err) {
            // Toast
            const dataToast = { message: err.response.data.message, type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
    }

    // =============== Xử lý Disable Party booking type ===============
    const handleDisablePartyHallType = async (partyHallTypeId) => {
        try {
            const disablePartyHallTypeRes = await PartyHallTypeService.disablePartyHallTypeById({
                partyHallTypeId: partyHallTypeId
            });
            if (!disablePartyHallTypeRes) {
                // Toast
                const dataToast = { message: disablePartyHallTypeRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }
            // Success
            setShowModal(prev => !prev);
            handleClose();  //Đóng thanh tìm kiếm và render lại giá trị mới ở compo Main
            // Toast
            const dataToast = { message: disablePartyHallTypeRes.data.message, type: "success" };
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

    // =============== Xử lý Able Party booking type ===============
    const handleAblePartyHallType = async (partyHallTypeId) => {
        try {
            const ablePartyHallTypeRes = await PartyHallTypeService.ablePartyHallTypeById({
                partyHallTypeId: partyHallTypeId
            });
            if (!ablePartyHallTypeRes) {
                // Toast
                const dataToast = { message: ablePartyHallTypeRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }
            // Success
            setShowModal(prev => !prev);
            handleClose();  //Đóng thanh tìm kiếm và render lại giá trị mới ở compo Main
            // Toast
            const dataToast = { message: ablePartyHallTypeRes.data.message, type: "success" };
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
    //  =============== Chi tiết Loại Sảnh tiệc ===============
    if (type === "detailPartyHallType") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>Chi tiết Loại Sảnh tiệc</H1>
                            <ModalForm>
                                <ModalFormItem>
                                    <FormSpan>Mã số Loại Sảnh tiệc:</FormSpan>
                                    <FormInput type="text" value={partyHallTypeModal ? partyHallTypeModal.party_hall_type_id : null} readOnly />
                                </ModalFormItem>
                                <ModalFormItem>
                                    <FormSpan>Tên Loại Sảnh tiệc:</FormSpan>
                                    <FormInput type="text" value={partyHallTypeModal ? partyHallTypeModal.party_hall_type_name : null} readOnly />
                                </ModalFormItem>
                                <ModalFormItem>
                                    <FormSpan>Trạng thái:</FormSpan>
                                    <FormInput type="text" value={partyHallTypeModal ? partyHallTypeModal.party_hall_type_state === 0 ? "Đang hoạt động" : partyHallTypeModal.party_hall_type_state === 1 ? "Ngưng hoạt động" : null : null} readOnly />
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
    //  =============== Thêm danh mục ===============
    if (type === "createPartyHallType") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>Thêm Loại Sảnh tiệc mới</H1>
                            <ModalForm>
                                <ModalFormItem>
                                    <FormSpan>Tên Loại Sảnh tiệc:</FormSpan>
                                    <FormInput type="text" onChange={(e) => setPartyHallTypeNameModalNew(e.target.value)} placeholder="Nhập vào tên Loại Sảnh tiệc" />
                                </ModalFormItem>
                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => handleCreatePartyHallType(partyHallTypeNameModalNew)}
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
    // =============== Chỉnh sửa danh mục ===============
    if (type === "updatePartyHallType") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>Cập nhật Loại Sảnh tiệc</H1>
                            <ModalForm>
                                <ModalFormItem>
                                    <FormSpan>Tên Loại Sảnh tiệc:</FormSpan>
                                    <FormInput type="text" onChange={(e) => setPartyHallTypeNameModal(e.target.value)} value={partyHallTypeNameModal} />
                                </ModalFormItem>
                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => handleUpdatePartyHallType(partyHallTypeNameModal, partyHallTypeIdModal)}
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
    // =============== Disable PartyHallType ===============
    if (type === "disablePartyHallType") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <AlertWrapper showModal={showModal}>
                            <ModalForm>
                                <ModalFormItem>
                                    <h1>Bạn muốn Vô hiệu hóa Loại Sảnh tiệc <span style={{ color: `var(--color-primary)` }}>{partyHallTypeModal ? partyHallTypeModal.party_hall_type_name : null}</span> này?</h1>
                                    <p style={{ marginTop: "10px" }}>Loại Sảnh tiệc này sẽ ngưng hoạt động và Khách hàng không thể đặt được nữa!</p>
                                </ModalFormItem>
                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => handleDisablePartyHallType(partyHallTypeIdModal)}
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
    // =============== able PartyHallType ===============
    if (type === "ablePartyHallType") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <AlertWrapper showModal={showModal}>
                            <ModalForm>
                                <ModalFormItem>
                                    <h1>Bạn muốn Mở khóa Loại Sảnh tiệc <span style={{ color: `var(--color-primary)` }}>{partyHallTypeModal ? partyHallTypeModal.party_hall_type_name : null}</span> này?</h1>
                                    <p style={{ marginTop: "10px" }}>Khách hàng lại có thể Đặt loại tiệc này như trước!</p>
                                </ModalFormItem>
                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => handleAblePartyHallType(partyHallTypeIdModal)}
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
    // =============== Xóa danh mục ===============
    if (type === "deletePartyHallType") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ backgroundImage: `url("https://img.freepik.com/free-vector/alert-safety-background_97886-3460.jpg?w=1060")`, backgroundPosition: `center center`, backgroundRepeat: `no-repeat`, backgroundSize: `cover`, width: `600px`, height: `400px` }} >
                            <ModalContent>
                                <h1>Bạn muốn xóa Loại Sảnh tiệc <span style={{ color: `var(--color-primary)` }}>{partyHallTypeNameModal}</span> này?</h1>
                                <p>Những Đặt tiệc của loại này cũng sẽ bị xóa</p>
                                <Button>
                                    <ButtonContainer>
                                        <ButtonClick
                                            onClick={() => { handleDeletePartyHallType(partyHallTypeIdModal) }}
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