import { CloseOutlined } from "@mui/icons-material";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import app from "../../firebase";

// SERVICES
import * as FoodVoteService from "../../service/FoodVoteService";

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

// Chi ti???t
const ChiTietHinhAnh = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
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
const Modal = ({ showModal, setShowModal, type, foodVote, setReRenderData, handleClose, showToastFromOut }) => {
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

    // Chi ti???t
    const [foodVoteModal, setFoodVoteModal] = useState();
    const [foodVoteReplyModal, setFoodVoteReplyModal] = useState();
    const [foodVoteIdModal, setFoodVoteIdModal] = useState();
    const [foodVoteReplyModalOld, setFoodVoteReplyModalOld] = useState();
    useEffect(() => {
        const getFoodVote = async () => {
            try {
                const foodVoteRes = await FoodVoteService.findFoodVoteById({
                    foodVoteId: foodVote.food_vote_id
                });
                console.log("RES: ", foodVoteRes.data.data);
                setFoodVoteModal(foodVoteRes.data.data);
                setFoodVoteReplyModal(foodVoteRes.data.data.food_vote_reply);

                setFoodVoteIdModal(foodVoteRes.data.data.food_vote_id);
                setFoodVoteReplyModalOld(foodVoteRes.data.data.food_vote_reply);
            } catch (err) {
                console.log("L???i l???y food vote: ", err.response);
            }
        }
        if (foodVote) {
            getFoodVote();
        }
    }, [foodVote, showModal]);

    const handleCloseUpdate = () => {
        // Set l???i gi?? tr??? c?? sau khi ????ng Modal
        setFoodVoteReplyModal(foodVoteReplyModalOld);

        setShowModal(prev => !prev);
    }
    // Ph???n h???i b??nh lu???n
    const handleReplyComment = async (foodVoteReplyModal, foodVoteIdModal) => {
        try {
            const updateFoodVoteRes = await FoodVoteService.replyCustomerComment({
                foodVoteReply: foodVoteReplyModal,
                foodVoteId: foodVoteIdModal
            });
            if (!updateFoodVoteRes) {
                // Toast
                const dataToast = { message: updateFoodVoteRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }

            // Success
            setShowModal(prev => !prev);
            handleClose();  //????ng thanh t??m ki???m v?? render l???i gi?? tr??? m???i ??? compo Main
            // Toast
            const dataToast = { message: updateFoodVoteRes.data.message, type: "success" };
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
    //  X??a b??nh lu???n
    const handleDeleteFoodVote = async (foodVoteId) => {
        try {
            const deleteFoodVoteRes = await FoodVoteService.deleteFoodVoteAdminById(foodVoteId);
            if (!deleteFoodVoteRes) {
                // Toast
                const dataToast = { message: deleteFoodVoteRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }
            // Success
            setShowModal(prev => !prev);
            handleClose();  //????ng thanh t??m ki???m v?? render l???i gi?? tr??? m???i ??? compo Main
            // Toast
            const dataToast = { message: deleteFoodVoteRes.data.message, type: "success" };
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
    // CHI TI???T B??NH LU???N
    if (type === "detailFoodVote") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ChiTietWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>Chi ti???t B??nh lu???n - ????nh gi?? M??n ??n</H1>
                            <ModalForm>
                                <div className="row">
                                    <div className="col-lg-3">
                                        <ChiTietHinhAnh src={foodVoteModal ? foodVoteModal.food_image : null} />
                                    </div>
                                    <div className="col-lg-9">
                                        <div className="row">
                                            <div className="col-lg-4">
                                                <ModalFormItem style={{ margin: "0 10px" }}>
                                                    <FormSpan>M?? B??nh lu???n:</FormSpan>
                                                    <FormInput type="text" value={foodVoteModal ? foodVoteModal.food_vote_id : null} readOnly />
                                                </ModalFormItem>
                                            </div>
                                            <div className="col-lg-4">
                                                <ModalFormItem style={{ margin: "0 10px" }}>
                                                    <FormSpan>T??n M??n ??n:</FormSpan>
                                                    <FormInput type="text" value={foodVoteModal ? foodVoteModal.food_name : null} readOnly />
                                                </ModalFormItem>
                                            </div>
                                            <div className="col-lg-4">
                                                <ModalFormItem style={{ margin: "0 10px" }}>
                                                    <FormSpan>Ph??n lo???i:</FormSpan>
                                                    <FormInput type="text" value={foodVoteModal ? foodVoteModal.food_type_name : null} readOnly />
                                                </ModalFormItem>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-6">
                                                <ModalFormItem style={{ margin: "0 10px" }}>
                                                    <FormSpan>H??? t??n Kh??ch h??ng:</FormSpan>
                                                    <FormInput type="text" value={foodVoteModal ? foodVoteModal.customer_first_name + " " + foodVoteModal.customer_last_name : null} readOnly />
                                                </ModalFormItem>
                                            </div>
                                            <div className="col-lg-6">
                                                <ModalFormItem style={{ margin: "0 10px" }}>
                                                    <FormSpan>Email Kh??ch h??ng:</FormSpan>
                                                    <FormInput type="text" value={foodVoteModal ? foodVoteModal.customer_email : null} readOnly />
                                                </ModalFormItem>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-6">
                                                <ModalFormItem style={{ margin: "0 10px" }}>
                                                    <FormSpan>H??? t??n Nh??n vi??n:</FormSpan>
                                                    <FormInput type="text" value={foodVoteModal ? foodVoteModal.employee_id ? foodVoteModal.employee_first_name + " " + foodVoteModal.employee_last_name : "Nh??n vi??n ch??a ph???n h???i b??nh lu???n n??y!" : null} readOnly />
                                                </ModalFormItem>
                                            </div>
                                            <div className="col-lg-6">
                                                <ModalFormItem style={{ margin: "0 10px" }}>
                                                    <FormSpan>Email Nh??n vi??n:</FormSpan>
                                                    <FormInput type="text" value={foodVoteModal ? foodVoteModal.employee_id ? foodVoteModal.employee_email : "Nh??n vi??n ch??a ph???n h???i b??nh lu???n n??y!" : null} readOnly />
                                                </ModalFormItem>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-8">
                                                <ModalFormItem style={{ margin: "0 10px" }}>
                                                    <FormSpan>B??nh lu???n c???a Kh??ch h??ng:</FormSpan>
                                                    <FormTextArea style={{ height: "100px" }} rows="2" cols="50" value={foodVoteModal ? foodVoteModal.food_vote_comment : null} readOnly />
                                                </ModalFormItem>
                                            </div>
                                            <div className="col-lg-4">
                                                <ModalFormItem style={{ margin: "0 10px" }}>
                                                    <FormSpan>Sao ????nh gi??:</FormSpan>
                                                    <FormInput type="text" value={foodVoteModal ? foodVoteModal.food_vote_number : null} readOnly />
                                                </ModalFormItem>
                                            </div>
                                            <div className="col-lg-8">
                                                <ModalFormItem style={{ margin: "0 10px" }}>
                                                    <FormSpan>Ph???n h???i c???a nh??n vi??n:</FormSpan>
                                                    <FormTextArea style={{ height: "100px" }} rows="2" cols="50" value={foodVoteModal ? foodVoteModal.employee_id ? foodVoteModal.food_vote_reply : "Nh??n vi??n ch??a ph???n h???i b??nh lu???n n??y!" : null} readOnly />
                                                </ModalFormItem>
                                            </div>
                                            <div className="col-lg-4">
                                                <ModalFormItem style={{ margin: "0 10px" }}>
                                                    <FormSpan>Ng??y ph???n h???i:</FormSpan>
                                                    <FormInput type="text" value={foodVoteModal ? foodVoteModal.employee_id ? foodVoteModal.food_vote_reply_date : "Nh??n vi??n ch??a ph???n h???i b??nh lu???n n??y!" : null} readOnly />
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
                                    >????ng</ButtonClick>
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
    // PH???N H???I B??NH LU???N
    if (type === "addEmployeeComment") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ChiTietWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>Ph???n h???i B??nh lu???n - ????nh gi?? M??n ??n</H1>
                            <ModalForm>
                                <div className="row">
                                    <div className="col-lg-3">
                                        <ChiTietHinhAnh src={foodVoteModal ? foodVoteModal.food_image : null} />
                                    </div>
                                    <div className="col-lg-9">
                                        <div className="row">
                                            <div className="col-lg-4">
                                                <ModalFormItem style={{ margin: "0 10px" }}>
                                                    <FormSpan>M?? B??nh lu???n:</FormSpan>
                                                    <FormInput type="text" value={foodVoteModal ? foodVoteModal.food_vote_id : null} readOnly style={{ backgroundColor: "#f5f5f5" }} />
                                                </ModalFormItem>
                                            </div>
                                            <div className="col-lg-4">
                                                <ModalFormItem style={{ margin: "0 10px" }}>
                                                    <FormSpan>T??n M??n ??n:</FormSpan>
                                                    <FormInput type="text" value={foodVoteModal ? foodVoteModal.food_name : null} readOnly style={{ backgroundColor: "#f5f5f5" }} />
                                                </ModalFormItem>
                                            </div>
                                            <div className="col-lg-4">
                                                <ModalFormItem style={{ margin: "0 10px" }}>
                                                    <FormSpan>Ph??n lo???i:</FormSpan>
                                                    <FormInput type="text" value={foodVoteModal ? foodVoteModal.food_type_name : null} readOnly style={{ backgroundColor: "#f5f5f5" }} />
                                                </ModalFormItem>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-6">
                                                <ModalFormItem style={{ margin: "0 10px" }}>
                                                    <FormSpan>H??? t??n Kh??ch h??ng:</FormSpan>
                                                    <FormInput type="text" value={foodVoteModal ? foodVoteModal.customer_first_name + " " + foodVoteModal.customer_last_name : null} readOnly style={{ backgroundColor: "#f5f5f5" }} />
                                                </ModalFormItem>
                                            </div>
                                            <div className="col-lg-6">
                                                <ModalFormItem style={{ margin: "0 10px" }}>
                                                    <FormSpan>Email Kh??ch h??ng:</FormSpan>
                                                    <FormInput type="text" value={foodVoteModal ? foodVoteModal.customer_email : null} readOnly style={{ backgroundColor: "#f5f5f5" }} />
                                                </ModalFormItem>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-6">
                                                <ModalFormItem style={{ margin: "0 10px" }}>
                                                    <FormSpan>H??? t??n Nh??n vi??n:</FormSpan>
                                                    <FormInput type="text" value={foodVoteModal ? foodVoteModal.employee_id ? foodVoteModal.employee_first_name + " " + foodVoteModal.employee_last_name : "Nh??n vi??n ch??a ph???n h???i b??nh lu???n n??y!" : null} readOnly style={{ backgroundColor: "#f5f5f5" }} />
                                                </ModalFormItem>
                                            </div>
                                            <div className="col-lg-6">
                                                <ModalFormItem style={{ margin: "0 10px" }}>
                                                    <FormSpan>Email Nh??n vi??n:</FormSpan>
                                                    <FormInput type="text" value={foodVoteModal ? foodVoteModal.employee_id ? foodVoteModal.employee_email : "Nh??n vi??n ch??a ph???n h???i b??nh lu???n n??y!" : null} readOnly style={{ backgroundColor: "#f5f5f5" }} />
                                                </ModalFormItem>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-8">
                                                <ModalFormItem style={{ margin: "0 10px" }}>
                                                    <FormSpan>B??nh lu???n c???a Kh??ch h??ng:</FormSpan>
                                                    <FormTextArea style={{ height: "100px", backgroundColor: "#f5f5f5" }} rows="2" cols="50" value={foodVoteModal ? foodVoteModal.food_vote_comment : null} readOnly />
                                                </ModalFormItem>
                                            </div>
                                            <div className="col-lg-4">
                                                <ModalFormItem style={{ margin: "0 10px" }}>
                                                    <FormSpan>Sao ????nh gi??:</FormSpan>
                                                    <FormInput type="text" value={foodVoteModal ? foodVoteModal.food_vote_number : null} readOnly style={{ backgroundColor: "#f5f5f5" }} />
                                                </ModalFormItem>
                                            </div>
                                            <div className="col-lg-8">
                                                <ModalFormItem style={{ margin: "0 10px" }}>
                                                    <FormSpan>Ph???n h???i c???a nh??n vi??n:</FormSpan>
                                                    <FormTextArea style={{ height: "100px" }} rows="2" cols="50" value={foodVoteReplyModal} onChange={(e) => setFoodVoteReplyModal(e.target.value)} placeholder="H??y Ph???n h???i b??nh lu???n tr??n c???a Kh??ch h??ng v??? M??n ??n!" />
                                                </ModalFormItem>
                                            </div>
                                            <div className="col-lg-4">
                                                <ModalFormItem style={{ margin: "0 10px" }}>
                                                    <FormSpan>Ng??y ph???n h???i:</FormSpan>
                                                    <FormInput type="text" value={foodVoteModal ? foodVoteModal.employee_id ? foodVoteModal.food_vote_reply_date : "Nh??n vi??n ch??a ph???n h???i b??nh lu???n n??y!" : null} readOnly style={{ backgroundColor: "#f5f5f5" }} />
                                                </ModalFormItem>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => handleReplyComment(foodVoteReplyModal, foodVoteIdModal)}
                                    >Ph???n h???i</ButtonClick>
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
                        </ChiTietWrapper>
                    </Background>
                ) : null}
            </>
        );
    }
    // // =============== X??a danh m???c ===============
    if (type === "deleteFoodVote") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ backgroundImage: `url("https://img.freepik.com/free-vector/alert-safety-background_97886-3460.jpg?w=1060")`, backgroundPosition: `center center`, backgroundRepeat: `no-repeat`, backgroundSize: `cover`, width: `600px`, height: `400px` }} >
                            <ModalContent>
                                <h1>B???n mu???n x??a B??nh lu???n c?? m?? s??? <span style={{ color: `var(--color-primary)` }}>{foodVoteIdModal}</span> n??y?</h1>
                                <p>B??nh lu???n s??? ???????c x??a sau khi click ?????ng ??!</p>
                                <Button>
                                    <ButtonContainer>
                                        <ButtonClick
                                            onClick={() => { handleDeleteFoodVote(foodVoteIdModal) }}
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