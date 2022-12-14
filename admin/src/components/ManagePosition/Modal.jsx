import { CloseOutlined } from "@mui/icons-material";
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";

// SERVICES
import * as PositionService from "../../service/PositionService";

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

    // =============== X??? l?? c???p nh???t Ch???c v??? ===============
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
            handleClose();  //????ng thanh t??m ki???m v?? render l???i gi?? tr??? m???i ??? compo Main
            // Toast
            const dataToast = { message: updatePositionRes.data.message, type: "success" };
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
                console.log("L???i l???y Ch???c v???: ", err.response);
            }
        }
        if (position) {
            getPosition();
        }
    }, [position, showModal]);
    console.log("Position modal: ", positionModal);

    // =============== X??? l?? th??m Ch???c v??? ===============
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
            setReRenderData(prev => !prev); //Render l???i csdl ??? Compo cha l?? - DanhMucMain & DanhMucRight.jsx
            setShowModal(prev => !prev);
            // Toast
            const dataToast = { message: createPositionRes.data.message, type: "success" };
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

    // =============== X??? l?? x??a Ch???c v??? ===============
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
            handleClose();  //????ng thanh t??m ki???m v?? render l???i gi?? tr??? m???i ??? compo Main
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
    //  =============== Chi ti???t Ch???c v??? ===============
    if (type === "detailPosition") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>Chi ti???t Ch???c v???</H1>
                            <ModalForm>
                                <ModalFormItem>
                                    <FormSpan>M?? Ch???c v???:</FormSpan>
                                    <FormInput type="text" value={positionModal ? positionModal.position_id : null} readOnly />
                                </ModalFormItem>
                                <ModalFormItem>
                                    <FormSpan>T??n Ch???c v???:</FormSpan>
                                    <FormInput type="text" value={positionModal ? positionModal.position_name : null} readOnly />
                                </ModalFormItem>
                                <ModalFormItem>
                                    <FormSpan>L????ng c?? b???n:</FormSpan>
                                    <FormInput type="text" value={positionModal ? positionModal.position_salary : null} readOnly />
                                </ModalFormItem>
                                <ModalFormItem>
                                    <FormSpan>L????ng th?????ng:</FormSpan>
                                    <FormInput type="text" value={positionModal ? positionModal.position_bonus_salary : null} readOnly />
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
    //  =============== Th??m Ch???c v??? ===============
    if (type === "createPosition") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>Th??m Ch???c v??? m???i</H1>
                            <ModalForm>
                                <ModalFormItem>
                                    <FormSpan>T??n Ch???c v??? m???i:</FormSpan>
                                    <FormInput type="text" onChange={(e) => setPositionNameModalNew(e.target.value)} placeholder="Nh???p v??o t??n Ch???c v???" />
                                </ModalFormItem>
                                <ModalFormItem>
                                    <FormSpan>M???c l????ng c?? b???n:</FormSpan>
                                    <FormInput type="number" onChange={(e) => setPositionSalaryModalNew(parseInt(e.target.value))} placeholder="Nh???p v??o s??? ti???n L????ng c?? b???n" />
                                </ModalFormItem>
                                <ModalFormItem>
                                    <FormSpan>M???c l????ng Th?????ng:</FormSpan>
                                    <FormInput type="number" onChange={(e) => setPositionBonusSalaryModalNew(parseInt(e.target.value))} placeholder="Nh???p v??o s??? ti???n L????ng th?????ng" />
                                </ModalFormItem>
                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => handleCreatePosition(positionNameModalNew, positionSalaryModalNew, positionBonusSalaryModalNew)}
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
    // =============== Ch???nh s???a Ch???c v??? ===============
    if (type === "updatePosition") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>C???p nh???t Ch???c v??? nh??n vi??n</H1>
                            <ModalForm>
                                <ModalFormItem>
                                    <FormSpan>T??n ch???c v??? nh??n vi??n:</FormSpan>
                                    <FormInput type="text" onChange={(e) => setPositionNameModal(e.target.value)} value={positionNameModal} />
                                </ModalFormItem>
                                <ModalFormItem>
                                    <FormSpan>M???c l????ng c?? b???n:</FormSpan>
                                    <FormInput type="number" onChange={(e) => setPositionSalaryModal(parseInt(e.target.value))} value={positionSalaryModal} />
                                </ModalFormItem>
                                <ModalFormItem>
                                    <FormSpan>M???c l????ng Th?????ng:</FormSpan>
                                    <FormInput type="number" onChange={(e) => setPositionBonusSalaryModal(parseInt(e.target.value))} value={positionBonusSalaryModal} />
                                </ModalFormItem>
                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => handleUpdatePosition(positionNameModal, positionSalaryModal, positionBonusSalaryModal, positionIdModal)}
                                    >C???p nh???t</ButtonClick>
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
    // =============== X??a Ch???c v??? ===============
    if (type === "deletePosition") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ backgroundImage: `url("https://img.freepik.com/free-vector/alert-safety-background_97886-3460.jpg?w=1060")`, backgroundPosition: `center center`, backgroundRepeat: `no-repeat`, backgroundSize: `cover`, width: `600px`, height: `400px` }} >
                            <ModalContent>
                                <h1>B???n mu???n x??a Ch???c v??? <span style={{ color: `var(--color-primary)` }}>{positionNameModal}</span> n??y?</h1>
                                <p>Nh???ng thi???t b??? c???a lo???i n??y c??ng s??? b??? x??a</p>
                                <Button>
                                    <ButtonContainer>
                                        <ButtonClick
                                            onClick={() => { handleDeletePosition(positionIdModal) }}
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