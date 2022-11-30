import { CloseOutlined } from "@mui/icons-material";
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";

// SERVICES
import * as PartyServiceTypeService from "../../service/PartyServiceTypeService";

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

const Modal = ({ showModal, setShowModal, type, partyServiceType, setReRenderData, handleClose, showToastFromOut }) => {
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
        setPartyServiceTypeNameModalNew();
    }, [showModal]);

    const handleUpdatePartyServiceType = async (newPartyServiceTypeName, partyServiceTypeId) => {
        try {
            const updatePartyServiceTypeRes = await PartyServiceTypeService.updatePartyServiceType({
                partyServiceTypeId: partyServiceTypeId,
                partyServiceTypeName: newPartyServiceTypeName
            });
            if (!updatePartyServiceTypeRes) {
                // Toast
                const dataToast = { message: updatePartyServiceTypeRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }

            // Success
            setShowModal(prev => !prev);
            handleClose();  //Đóng thanh tìm kiếm và render lại giá trị mới ở compo Main
            // Toast
            const dataToast = { message: updatePartyServiceTypeRes.data.message, type: "success" };
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
    const [partyServiceTypeModal, setPartyServiceTypeModal] = useState();
    const [partyServiceTypeIdModal, setPartyServiceTypeIdModal] = useState();
    const [partyServiceTypeNameModal, setPartyServiceTypeNameModal] = useState();

    const [partyServiceTypeModalOld, setPartyServiceTypeModalOld] = useState();
    const [partyServiceTypeNameModalOld, setPartyServiceTypeNameModalOld] = useState();
    useEffect(() => {
        const getPartyServiceType = async () => {
            try {
                const partyServiceTypeRes = await PartyServiceTypeService.findPartyServiceTypeById({
                    partyServiceTypeId: partyServiceType.party_service_type_id
                });
                console.log("RES: ", partyServiceTypeRes);
                setPartyServiceTypeModal(partyServiceTypeRes.data.data);
                setPartyServiceTypeIdModal(partyServiceTypeRes.data.data.party_service_type_id);
                setPartyServiceTypeNameModal(partyServiceTypeRes.data.data.party_service_type_name);

                setPartyServiceTypeModalOld(partyServiceTypeRes.data.data);
                setPartyServiceTypeNameModalOld(partyServiceTypeRes.data.data.party_service_type_name);
            } catch (err) {
                console.log("Lỗi lấy danh mục: ", err.response);
            }
        }
        if (partyServiceType) {
            getPartyServiceType();
        }
    }, [partyServiceType]);
    console.log("Danh mục modal: ", partyServiceTypeModal);

    const handleCloseUpdate = () => {
        // Set lại giá trị cũ sau khi đóng Modal
        setPartyServiceTypeNameModal(partyServiceTypeNameModalOld);

        setShowModal(prev => !prev);
    }

    // =============== Xử lý thêm danh mục ===============
    const [partyServiceTypeNameModalNew, setPartyServiceTypeNameModalNew] = useState();

    // Create new party booking type
    const handleCreatePartyServiceType = async (newName) => {
        try {
            const createPartyServiceTypeRes = await PartyServiceTypeService.createPartyServiceType({
                partyServiceTypeName: newName
            });
            if (!createPartyServiceTypeRes) {
                // Toast
                const dataToast = { message: createPartyServiceTypeRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }

            // Success
            setReRenderData(prev => !prev); //Render lại csdl ở Compo cha là - DanhMucMain & DanhMucRight.jsx
            setShowModal(prev => !prev);
            // Toast
            const dataToast = { message: createPartyServiceTypeRes.data.message, type: "success" };
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
    const handleDeletePartyServiceType = async (partyServiceTypeId) => {
        try {
            const deletePartyServiceTypeRes = await PartyServiceTypeService.deletePartyServiceType(partyServiceTypeId);
            if (!deletePartyServiceTypeRes) {
                // Toast
                const dataToast = { message: deletePartyServiceTypeRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }
            // Success
            setShowModal(prev => !prev);
            handleClose();  //Đóng thanh tìm kiếm và render lại giá trị mới ở compo Main
            // Toast
            const dataToast = { message: deletePartyServiceTypeRes.data.message, type: "success" };
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
    const handleDisablePartyServiceType = async (partyServiceTypeId) => {
        try {
            const disablePartyServiceTypeRes = await PartyServiceTypeService.disablePartyServiceTypeById({
                partyServiceTypeId: partyServiceTypeId
            });
            if (!disablePartyServiceTypeRes) {
                // Toast
                const dataToast = { message: disablePartyServiceTypeRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }
            // Success
            setShowModal(prev => !prev);
            handleClose();  //Đóng thanh tìm kiếm và render lại giá trị mới ở compo Main
            // Toast
            const dataToast = { message: disablePartyServiceTypeRes.data.message, type: "success" };
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
    const handleAblePartyServiceType = async (partyServiceTypeId) => {
        try {
            const ablePartyServiceTypeRes = await PartyServiceTypeService.ablePartyServiceTypeById({
                partyServiceTypeId: partyServiceTypeId
            });
            if (!ablePartyServiceTypeRes) {
                // Toast
                const dataToast = { message: ablePartyServiceTypeRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }
            // Success
            setShowModal(prev => !prev);
            handleClose();  //Đóng thanh tìm kiếm và render lại giá trị mới ở compo Main
            // Toast
            const dataToast = { message: ablePartyServiceTypeRes.data.message, type: "success" };
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
    //  =============== Chi tiết Loại Dịch vụ tiệc ===============
    if (type === "detailPartyServiceType") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>Chi tiết Loại Dịch vụ tiệc</H1>
                            <ModalForm>
                                <ModalFormItem>
                                    <FormSpan>Mã số Loại Dịch vụ tiệc:</FormSpan>
                                    <FormInput type="text" value={partyServiceTypeModal ? partyServiceTypeModal.party_service_type_id : null} readOnly />
                                </ModalFormItem>
                                <ModalFormItem>
                                    <FormSpan>Tên Loại Dịch vụ tiệc:</FormSpan>
                                    <FormInput type="text" value={partyServiceTypeModal ? partyServiceTypeModal.party_service_type_name : null} readOnly />
                                </ModalFormItem>
                                <ModalFormItem>
                                    <FormSpan>Trạng thái:</FormSpan>
                                    <FormInput type="text" value={partyServiceTypeModal ? partyServiceTypeModal.party_service_type_state === 0 ? "Đang hoạt động" : partyServiceTypeModal.party_service_type_state === 1 ? "Ngưng hoạt động" : null : null} readOnly />
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
    if (type === "createPartyServiceType") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>Thêm Loại Dịch vụ tiệc mới</H1>
                            <ModalForm>
                                <ModalFormItem>
                                    <FormSpan>Tên Loại Dịch vụ tiệc:</FormSpan>
                                    <FormInput type="text" onChange={(e) => setPartyServiceTypeNameModalNew(e.target.value)} placeholder="Nhập vào tên Loại Dịch vụ tiệc" />
                                </ModalFormItem>
                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => handleCreatePartyServiceType(partyServiceTypeNameModalNew)}
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
    if (type === "updatePartyServiceType") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>Cập nhật Loại Dịch vụ tiệc</H1>
                            <ModalForm>
                                <ModalFormItem>
                                    <FormSpan>Tên Loại Dịch vụ tiệc:</FormSpan>
                                    <FormInput type="text" onChange={(e) => setPartyServiceTypeNameModal(e.target.value)} value={partyServiceTypeNameModal} />
                                </ModalFormItem>
                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => handleUpdatePartyServiceType(partyServiceTypeNameModal, partyServiceTypeIdModal)}
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
    // =============== Disable PartyServiceType ===============
    if (type === "disablePartyServiceType") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <AlertWrapper showModal={showModal}>
                            <ModalForm>
                                <ModalFormItem>
                                    <h1>Bạn muốn Vô hiệu hóa Loại Dịch vụ tiệc <span style={{ color: `var(--color-primary)` }}>{partyServiceTypeModal ? partyServiceTypeModal.party_service_type_name : null}</span> này?</h1>
                                    <p style={{ marginTop: "10px" }}>Loại Dịch vụ tiệc này sẽ ngưng hoạt động và Khách hàng không thể đặt được nữa!</p>
                                </ModalFormItem>
                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => handleDisablePartyServiceType(partyServiceTypeIdModal)}
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
    // =============== able PartyServiceType ===============
    if (type === "ablePartyServiceType") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <AlertWrapper showModal={showModal}>
                            <ModalForm>
                                <ModalFormItem>
                                    <h1>Bạn muốn Mở khóa Loại Dịch vụ tiệc <span style={{ color: `var(--color-primary)` }}>{partyServiceTypeModal ? partyServiceTypeModal.party_service_type_name : null}</span> này?</h1>
                                    <p style={{ marginTop: "10px" }}>Khách hàng lại có thể Đặt loại tiệc này như trước!</p>
                                </ModalFormItem>
                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => handleAblePartyServiceType(partyServiceTypeIdModal)}
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
    if (type === "deletePartyServiceType") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ backgroundImage: `url("https://img.freepik.com/free-vector/alert-safety-background_97886-3460.jpg?w=1060")`, backgroundPosition: `center center`, backgroundRepeat: `no-repeat`, backgroundSize: `cover`, width: `600px`, height: `400px` }} >
                            <ModalContent>
                                <h1>Bạn muốn xóa Loại Dịch vụ tiệc <span style={{ color: `var(--color-primary)` }}>{partyServiceTypeNameModal}</span> này?</h1>
                                <p>Những Dịch vụ tiệc của loại này cũng sẽ bị xóa</p>
                                <Button>
                                    <ButtonContainer>
                                        <ButtonClick
                                            onClick={() => { handleDeletePartyServiceType(partyServiceTypeIdModal) }}
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