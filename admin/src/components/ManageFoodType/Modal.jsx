import { CloseOutlined } from "@mui/icons-material";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import app from "../../firebase";

// SERVICES
import * as FoodTypeService from "../../service/FoodTypeService";

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

const Modal = ({ showModal, setShowModal, type, foodType, setReRenderData, handleClose, showToastFromOut }) => {
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
        setFoodTypeNameModalNew();
    }, [showModal]);

    const handleUpdateFoodType = async (newFoodTypeName, foodTypeId) => {
        try {
            const updateFoodTypeRes = await FoodTypeService.updateFoodType({
                foodTypeId: foodTypeId,
                foodTypeName: newFoodTypeName
            });
            if (!updateFoodTypeRes) {
                // Toast
                const dataToast = { message: updateFoodTypeRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }

            // Success
            setShowModal(prev => !prev);
            handleClose();  //????ng thanh t??m ki???m v?? render l???i gi?? tr??? m???i ??? compo Main
            // Toast
            const dataToast = { message: updateFoodTypeRes.data.message, type: "success" };
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
    const [foodTypeModal, setFoodTypeModal] = useState();
    const [foodTypeIdModal, setFoodTypeIdModal] = useState();
    const [foodTypeNameModal, setFoodTypeNameModal] = useState();

    const [foodTypeModalOld, setFoodTypeModalOld] = useState();
    const [foodTypeIdModalOld, setFoodTypeIdModalOld] = useState();
    const [foodTypeNameModalOld, setFoodTypeNameModalOld] = useState();
    useEffect(() => {
        const getFoodType = async () => {
            try {
                const foodTypeRes = await FoodTypeService.findFoodTypeById({
                    foodTypeId: foodType.food_type_id
                });
                console.log("RES: ", foodTypeRes);
                setFoodTypeModal(foodTypeRes.data.data);
                setFoodTypeIdModal(foodTypeRes.data.data.food_type_id);
                setFoodTypeNameModal(foodTypeRes.data.data.food_type_name);

                setFoodTypeModalOld(foodTypeRes.data.data);
                setFoodTypeIdModalOld(foodTypeRes.data.data.food_type_id);
                setFoodTypeNameModalOld(foodTypeRes.data.data.food_type_name);
            } catch (err) {
                console.log("L???i l???y danh m???c: ", err);
            }
        }
        if (foodType) {
            getFoodType();
        }
    }, [foodType]);
    console.log("Danh m???c modal: ", foodTypeModal);

    const handleCloseUpdate = () => {
        // Set l???i gi?? tr??? c?? sau khi ????ng Modal
        setFoodTypeNameModal(foodTypeNameModalOld);

        setShowModal(prev => !prev);
    }

    // =============== X??? l?? th??m danh m???c ===============
    const [foodTypeNameModalNew, setFoodTypeNameModalNew] = useState();

    // Create new divice type
    const handleCreateFoodType = async (newName) => {
        try {
            const createFoodTypeRes = await FoodTypeService.createFoodType({
                foodTypeName: newName
            });
            if (!createFoodTypeRes) {
                // Toast
                const dataToast = { message: createFoodTypeRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }

            // Success
            setReRenderData(prev => !prev); //Render l???i csdl ??? Compo cha l?? - DanhMucMain & DanhMucRight.jsx
            setShowModal(prev => !prev);
            // Toast
            const dataToast = { message: createFoodTypeRes.data.message, type: "success" };
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
    const handleDeleteFoodType = async (foodTypeId) => {
        try {
            const deleteFoodTypeRes = await FoodTypeService.deleteFoodType(foodTypeId);
            if (!deleteFoodTypeRes) {
                // Toast
                const dataToast = { message: deleteFoodTypeRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }
            // Success
            setShowModal(prev => !prev);
            handleClose();  //????ng thanh t??m ki???m v?? render l???i gi?? tr??? m???i ??? compo Main
            // Toast
            const dataToast = { message: deleteFoodTypeRes.data.message, type: "success" };
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
    //  =============== Chi ti???t Lo???i m??n ??n ===============
    if (type === "detailFoodType") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>Chi ti???t Lo???i m??n ??n</H1>
                            <ModalForm>
                                <ModalFormItem>
                                    <FormSpan>M?? s??? Lo???i m??n ??n:</FormSpan>
                                    <FormInput type="text" value={foodTypeModal ? foodTypeModal.food_type_id : null} readOnly />
                                </ModalFormItem>
                                <ModalFormItem>
                                    <FormSpan>T??n Lo???i m??n ??n:</FormSpan>
                                    <FormInput type="text" value={foodTypeModal ? foodTypeModal.food_type_name : null} readOnly />
                                </ModalFormItem>
                                <ModalFormItem>
                                    <FormSpan>Tr???ng th??i:</FormSpan>
                                    <FormInput type="text" value={foodTypeModal ? foodTypeModal.food_type_state === 0 ? "??ang ho???t ?????ng" : foodTypeModal.food_type_state === 1 ? "D???ng ho???t ?????ng" : null : null} readOnly />
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
    if (type === "createFoodType") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>Th??m Lo???i m??n ??n m???i</H1>
                            <ModalForm>
                                <ModalFormItem>
                                    <FormSpan>T??n Lo???i m??n ??n:</FormSpan>
                                    <FormInput type="text" onChange={(e) => setFoodTypeNameModalNew(e.target.value)} placeholder="Nh???p v??o t??n Lo???i m??n ??n" />
                                </ModalFormItem>
                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => handleCreateFoodType(foodTypeNameModalNew)}
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
    if (type === "updateFoodType") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>C???p nh???t Lo???i m??n ??n</H1>
                            <ModalForm>
                                <ModalFormItem>
                                    <FormSpan>T??n Lo???i m??n ??n:</FormSpan>
                                    <FormInput type="text" onChange={(e) => setFoodTypeNameModal(e.target.value)} value={foodTypeNameModal} />
                                </ModalFormItem>
                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => handleUpdateFoodType(foodTypeNameModal, foodTypeIdModal)}
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
    // =============== X??a danh m???c ===============
    if (type === "deleteFoodType") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ backgroundImage: `url("https://img.freepik.com/free-vector/alert-safety-background_97886-3460.jpg?w=1060")`, backgroundPosition: `center center`, backgroundRepeat: `no-repeat`, backgroundSize: `cover`, width: `600px`, height: `400px` }} >
                            <ModalContent>
                                <h1>B???n mu???n x??a Lo???i m??n ??n <span style={{ color: `var(--color-primary)` }}>{foodTypeNameModal}</span> n??y?</h1>
                                <p>Nh???ng M??n ??n c???a lo???i n??y c??ng s??? b??? x??a</p>
                                <Button>
                                    <ButtonContainer>
                                        <ButtonClick
                                            onClick={() => { handleDeleteFoodType(foodTypeIdModal) }}
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