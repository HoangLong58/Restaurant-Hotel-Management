import { CloseOutlined } from "@mui/icons-material";
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";

// SERVICES
import * as PartyBookingTypeService from "../../service/PartyBookingTypeService";

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


const Modal = ({ showModal, setShowModal, type, partyBookingType, setReRenderData, handleClose, showToastFromOut }) => {
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

    // =============== X??? l?? c???p nh???t danh m???c ===============
    useEffect(() => {
        setPartyBookingTypeNameModalNew();
    }, [showModal]);

    const handleUpdatePartyBookingType = async (newPartyBookingTypeName, partyBookingTypeId) => {
        try {
            const updatePartyBookingTypeRes = await PartyBookingTypeService.updatePartyBookingType({
                partyBookingTypeId: partyBookingTypeId,
                partyBookingTypeName: newPartyBookingTypeName
            });
            if (!updatePartyBookingTypeRes) {
                // Toast
                const dataToast = { message: updatePartyBookingTypeRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }

            // Success
            setShowModal(prev => !prev);
            handleClose();  //????ng thanh t??m ki???m v?? render l???i gi?? tr??? m???i ??? compo Main
            // Toast
            const dataToast = { message: updatePartyBookingTypeRes.data.message, type: "success" };
            showToastFromOut(dataToast);
            return;
        } catch (err) {
            setShowModal(prev => !prev);
            handleClose();  //????ng thanh t??m ki???m v?? render l???i gi?? tr??? m???i ??? compo Main
            // Toast
            const dataToast = { message: err.response.data.message, type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
    }
    //  test
    const [partyBookingTypeModal, setPartyBookingTypeModal] = useState();
    const [partyBookingTypeIdModal, setPartyBookingTypeIdModal] = useState();
    const [partyBookingTypeNameModal, setPartyBookingTypeNameModal] = useState();

    const [partyBookingTypeModalOld, setPartyBookingTypeModalOld] = useState();
    const [partyBookingTypeNameModalOld, setPartyBookingTypeNameModalOld] = useState();
    useEffect(() => {
        const getPartyBookingType = async () => {
            try {
                const partyBookingTypeRes = await PartyBookingTypeService.findPartyBookingTypeById({
                    partyBookingTypeId: partyBookingType.party_booking_type_id
                });
                console.log("RES: ", partyBookingTypeRes);
                setPartyBookingTypeModal(partyBookingTypeRes.data.data);
                setPartyBookingTypeIdModal(partyBookingTypeRes.data.data.party_booking_type_id);
                setPartyBookingTypeNameModal(partyBookingTypeRes.data.data.party_booking_type_name);

                setPartyBookingTypeModalOld(partyBookingTypeRes.data.data);
                setPartyBookingTypeNameModalOld(partyBookingTypeRes.data.data.party_booking_type_name);
            } catch (err) {
                console.log("L???i l???y danh m???c: ", err.response);
            }
        }
        if (partyBookingType) {
            getPartyBookingType();
        }
    }, [partyBookingType]);
    console.log("Danh m???c modal: ", partyBookingTypeModal);

    const handleCloseUpdate = () => {
        // Set l???i gi?? tr??? c?? sau khi ????ng Modal
        setPartyBookingTypeNameModal(partyBookingTypeNameModalOld);

        setShowModal(prev => !prev);
    }

    // =============== X??? l?? th??m danh m???c ===============
    const [partyBookingTypeNameModalNew, setPartyBookingTypeNameModalNew] = useState();

    // Create new party booking type
    const handleCreatePartyBookingType = async (newName) => {
        try {
            const createPartyBookingTypeRes = await PartyBookingTypeService.createPartyBookingType({
                partyBookingTypeName: newName
            });
            if (!createPartyBookingTypeRes) {
                // Toast
                const dataToast = { message: createPartyBookingTypeRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }

            // Success
            setReRenderData(prev => !prev); //Render l???i csdl ??? Compo cha l?? - DanhMucMain & DanhMucRight.jsx
            setShowModal(prev => !prev);
            // Toast
            const dataToast = { message: createPartyBookingTypeRes.data.message, type: "success" };
            showToastFromOut(dataToast);
            return;

        } catch (err) {
            setReRenderData(prev => !prev); //Render l???i csdl ??? Compo cha l?? - DanhMucMain & DanhMucRight.jsx
            setShowModal(prev => !prev);
            // Toast
            const dataToast = { message: err.response.data.message, type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
    }

    // =============== X??? l?? x??a danh m???c ===============
    const handleDeletePartyBookingType = async (partyBookingTypeId) => {
        try {
            const deletePartyBookingTypeRes = await PartyBookingTypeService.deletePartyBookingType(partyBookingTypeId);
            if (!deletePartyBookingTypeRes) {
                // Toast
                const dataToast = { message: deletePartyBookingTypeRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }
            // Success
            setShowModal(prev => !prev);
            handleClose();  //????ng thanh t??m ki???m v?? render l???i gi?? tr??? m???i ??? compo Main
            // Toast
            const dataToast = { message: deletePartyBookingTypeRes.data.message, type: "success" };
            showToastFromOut(dataToast);
            return;
        } catch (err) {
            // Toast
            const dataToast = { message: err.response.data.message, type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
    }

    // =============== X??? l?? Disable Party booking type ===============
    const handleDisablePartyBookingType = async (partyBookingTypeId) => {
        try {
            const disablePartyBookingTypeRes = await PartyBookingTypeService.disablePartyBookingTypeById({
                partyBookingTypeId: partyBookingTypeId
            });
            if (!disablePartyBookingTypeRes) {
                // Toast
                const dataToast = { message: disablePartyBookingTypeRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }
            // Success
            setShowModal(prev => !prev);
            handleClose();  //????ng thanh t??m ki???m v?? render l???i gi?? tr??? m???i ??? compo Main
            // Toast
            const dataToast = { message: disablePartyBookingTypeRes.data.message, type: "success" };
            showToastFromOut(dataToast);
            return;
        } catch (err) {
            setShowModal(prev => !prev);
            handleClose();  //????ng thanh t??m ki???m v?? render l???i gi?? tr??? m???i ??? compo Main
            // Toast
            const dataToast = { message: err.response.data.message, type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
    }

    // =============== X??? l?? Able Party booking type ===============
    const handleAblePartyBookingType = async (partyBookingTypeId) => {
        try {
            const ablePartyBookingTypeRes = await PartyBookingTypeService.ablePartyBookingTypeById({
                partyBookingTypeId: partyBookingTypeId
            });
            if (!ablePartyBookingTypeRes) {
                // Toast
                const dataToast = { message: ablePartyBookingTypeRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }
            // Success
            setShowModal(prev => !prev);
            handleClose();  //????ng thanh t??m ki???m v?? render l???i gi?? tr??? m???i ??? compo Main
            // Toast
            const dataToast = { message: ablePartyBookingTypeRes.data.message, type: "success" };
            showToastFromOut(dataToast);
            return;
        } catch (err) {
            setShowModal(prev => !prev);
            handleClose();  //????ng thanh t??m ki???m v?? render l???i gi?? tr??? m???i ??? compo Main
            // Toast
            const dataToast = { message: err.response.data.message, type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
    }
    // ================================================================
    //  =============== Chi ti???t Lo???i ?????t ti???c ===============
    if (type === "detailPartyBookingType") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>Chi ti???t Lo???i ?????t ti???c</H1>
                            <ModalForm>
                                <ModalFormItem>
                                    <FormSpan>M?? s??? Lo???i ?????t ti???c:</FormSpan>
                                    <FormInput type="text" value={partyBookingTypeModal ? partyBookingTypeModal.party_booking_type_id : null} readOnly />
                                </ModalFormItem>
                                <ModalFormItem>
                                    <FormSpan>T??n Lo???i ?????t ti???c:</FormSpan>
                                    <FormInput type="text" value={partyBookingTypeModal ? partyBookingTypeModal.party_booking_type_name : null} readOnly />
                                </ModalFormItem>
                                <ModalFormItem>
                                    <FormSpan>Tr???ng th??i:</FormSpan>
                                    <FormInput type="text" value={partyBookingTypeModal ? partyBookingTypeModal.party_booking_type_state === 0 ? "??ang ho???t ?????ng" : partyBookingTypeModal.party_booking_type_state === 1 ? "Ng??ng ho???t ?????ng" : null : null} readOnly />
                                </ModalFormItem>
                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => setShowModal(prev => !prev)}
                                    >????ng</ButtonClick>
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
    //  =============== Th??m danh m???c ===============
    if (type === "createPartyBookingType") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>Th??m Lo???i ?????t ti???c m???i</H1>
                            <ModalForm>
                                <ModalFormItem>
                                    <FormSpan>T??n Lo???i ?????t ti???c:</FormSpan>
                                    <FormInput type="text" onChange={(e) => setPartyBookingTypeNameModalNew(e.target.value)} placeholder="Nh???p v??o t??n Lo???i ?????t ti???c" />
                                </ModalFormItem>
                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => handleCreatePartyBookingType(partyBookingTypeNameModalNew)}
                                    >Th??m v??o</ButtonClick>
                                </ButtonContainer>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => setShowModal(prev => !prev)}
                                    >H???y b???</ButtonClick>
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
    // =============== Ch???nh s???a danh m???c ===============
    if (type === "updatePartyBookingType") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>C???p nh???t Lo???i ?????t ti???c</H1>
                            <ModalForm>
                                <ModalFormItem>
                                    <FormSpan>T??n Lo???i ?????t ti???c:</FormSpan>
                                    <FormInput type="text" onChange={(e) => setPartyBookingTypeNameModal(e.target.value)} value={partyBookingTypeNameModal} />
                                </ModalFormItem>
                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => handleUpdatePartyBookingType(partyBookingTypeNameModal, partyBookingTypeIdModal)}
                                    >C???p nh???t</ButtonClick>
                                </ButtonContainer>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => handleCloseUpdate()}
                                    >H???y b???</ButtonClick>
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
        // =============== Disable PartyBookingType ===============
        if (type === "disablePartyBookingType") {
            return (
                <>
                    {showModal ? (
                        <Background ref={modalRef} onClick={closeModal}>
                            <AlertWrapper showModal={showModal}>
                                <ModalForm>
                                    <ModalFormItem>
                                        <h1>B???n mu???n V?? hi???u h??a Lo???i ?????t ti???c <span style={{ color: `var(--color-primary)` }}>{partyBookingTypeModal ? partyBookingTypeModal.party_booking_type_name : null}</span> n??y?</h1>
                                        <p style={{ marginTop: "10px" }}>Lo???i ?????t ti???c n??y s??? ng??ng ho???t ?????ng v?? Kh??ch h??ng kh??ng th??? ?????t ???????c n???a!</p>
                                    </ModalFormItem>
                                </ModalForm>
                                <ButtonUpdate>
                                    <ButtonContainer>
                                        <ButtonClick
                                            onClick={() => handleDisablePartyBookingType(partyBookingTypeIdModal)}
                                        >?????ng ??</ButtonClick>
                                    </ButtonContainer>
                                    <ButtonContainer>
                                        <ButtonClick
                                            onClick={() => setShowModal(prev => !prev)}
                                        >H???y b???</ButtonClick>
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
        // =============== able PartyBookingType ===============
        if (type === "ablePartyBookingType") {
            return (
                <>
                    {showModal ? (
                        <Background ref={modalRef} onClick={closeModal}>
                            <AlertWrapper showModal={showModal}>
                                <ModalForm>
                                    <ModalFormItem>
                                        <h1>B???n mu???n M??? kh??a Lo???i ?????t ti???c <span style={{ color: `var(--color-primary)` }}>{partyBookingTypeModal ? partyBookingTypeModal.party_booking_type_name : null}</span> n??y?</h1>
                                        <p style={{ marginTop: "10px" }}>Kh??ch h??ng l???i c?? th??? ?????t lo???i ti???c n??y nh?? tr?????c!</p>
                                    </ModalFormItem>
                                </ModalForm>
                                <ButtonUpdate>
                                    <ButtonContainer>
                                        <ButtonClick
                                            onClick={() => handleAblePartyBookingType(partyBookingTypeIdModal)}
                                        >?????ng ??</ButtonClick>
                                    </ButtonContainer>
                                    <ButtonContainer>
                                        <ButtonClick
                                            onClick={() => setShowModal(prev => !prev)}
                                        >H???y b???</ButtonClick>
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
    // =============== X??a danh m???c ===============
    if (type === "deletePartyBookingType") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ backgroundImage: `url("https://img.freepik.com/free-vector/alert-safety-background_97886-3460.jpg?w=1060")`, backgroundPosition: `center center`, backgroundRepeat: `no-repeat`, backgroundSize: `cover`, width: `600px`, height: `400px` }} >
                            <ModalContent>
                                <h1>B???n mu???n x??a Lo???i ?????t ti???c <span style={{ color: `var(--color-primary)` }}>{partyBookingTypeNameModal}</span> n??y?</h1>
                                <p>Nh???ng ?????t ti???c c???a lo???i n??y c??ng s??? b??? x??a</p>
                                <Button>
                                    <ButtonContainer>
                                        <ButtonClick
                                            onClick={() => { handleDeletePartyBookingType(partyBookingTypeIdModal) }}
                                        >?????ng ??</ButtonClick>
                                    </ButtonContainer>
                                    <ButtonContainer>
                                        <ButtonClick
                                            onClick={() => setShowModal(prev => !prev)}
                                        >H???y b???</ButtonClick>
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