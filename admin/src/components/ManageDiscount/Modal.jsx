import { CloseOutlined } from "@mui/icons-material";
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";

// SERVICES
import * as DiscountService from "../../service/DiscountService";

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

const H1Delete = styled.h1` 
    width: "90%";
    text-align: center;
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

const Modal = ({ showModal, setShowModal, type, discount, setReRenderData, handleClose, showToastFromOut }) => {
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
        setDiscountNameModalNew();
        setDiscountQuantityModalNew();
        setDiscountPercentModalNew();
    }, [showModal]);

    const handleUpdateDiscount = async (newDiscountCode, newDiscountPercent, newDiscountId) => {
        try {
            const updateDiscountRes = await DiscountService.updateDiscount({
                discountCode: newDiscountCode,
                discountPercent: newDiscountPercent,
                discountId: newDiscountId
            });
            if (!updateDiscountRes) {
                // Toast
                const dataToast = { message: updateDiscountRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }

            // Success
            setShowModal(prev => !prev);
            handleClose();  //????ng thanh t??m ki???m v?? render l???i gi?? tr??? m???i ??? compo Main
            // Toast
            const dataToast = { message: updateDiscountRes.data.message, type: "success" };
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
    const [discountModal, setDiscountModal] = useState();
    const [discountIdModal, setDiscountIdModal] = useState();
    const [discountCodeModal, setDiscountCodeModal] = useState();
    const [discountPercentModal, setDiscountPercentModal] = useState();

    const [discountModalOld, setDiscountModalOld] = useState();
    const [discountIdModalOld, setDiscountIdModalOld] = useState();
    const [discountCodeModalOld, setDiscountCodeModalOld] = useState();
    const [discountPercentModalOld, setDiscountPercentModalOld] = useState();
    useEffect(() => {
        const getDiscount = async () => {
            try {
                const discountRes = await DiscountService.findDiscountById({
                    discountId: discount.discount_id
                });
                console.log("RES: ", discountRes);
                setDiscountModal(discountRes.data.data);
                setDiscountIdModal(discountRes.data.data.discount_id);
                setDiscountCodeModal(discountRes.data.data.discount_code);
                setDiscountPercentModal(discountRes.data.data.discount_percent);

                setDiscountModalOld(discountRes.data.data);
                setDiscountIdModalOld(discountRes.data.data.discount_id);
                setDiscountCodeModalOld(discountRes.data.data.discount_code);
                setDiscountPercentModalOld(discountRes.data.data.discount_percent);
            } catch (err) {
                console.log("L???i l???y discount: ", err);
            }
        }
        if (discount) {
            getDiscount();
        }
    }, [discount]);
    console.log("Discount modal: ", discountModal);

    const handleCloseUpdate = () => {
        // Set l???i gi?? tr??? c?? sau khi ????ng Modal
        setDiscountCodeModal(discountCodeModalOld);
        setDiscountPercentModal(discountPercentModalOld);

        setShowModal(prev => !prev);
    }

    // =============== X??? l?? th??m m?? gi???m gi?? ===============
    const [discountCodeModalNew, setDiscountCodeModalNew] = useState();
    const [discountPercentModalNew, setDiscountPercentModalNew] = useState();
    const [discountQuantityModalNew, setDiscountQuantityModalNew] = useState();
    const [discountNameModalNew, setDiscountNameModalNew] = useState();

    // Create new divice type
    const handleCreateDiscount = async (newPercent, newName, newQuantity) => {
        console.log("newPercent, newName, newQuantity: ", newPercent, newName, newQuantity);
        try {
            const createDiscountRes = await DiscountService.createDiscount({
                discountPercent: newPercent,
                discountName: newName,
                discountQuantity: newQuantity
            });
            if (!createDiscountRes) {
                // Toast
                const dataToast = { message: createDiscountRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }

            // Success
            setReRenderData(prev => !prev); //Render l???i csdl ??? Compo cha l?? - DanhMucMain & DanhMucRight.jsx
            setShowModal(prev => !prev);
            setDiscountPercentModalNew();
            setDiscountCodeModalNew();
            // Toast
            const dataToast = { message: createDiscountRes.data.message, type: "success" };
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
    const handleDeleteDiscount = async (discountId) => {
        try {
            const deleteDiscountRes = await DiscountService.deleteDiscount(discountId);
            if (!deleteDiscountRes) {
                // Toast
                const dataToast = { message: deleteDiscountRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }
            // Success
            setShowModal(prev => !prev);
            handleClose();  //????ng thanh t??m ki???m v?? render l???i gi?? tr??? m???i ??? compo Main
            // Toast
            const dataToast = { message: deleteDiscountRes.data.message, type: "success" };
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
    //  =============== Chi ti???t ===============
    if (type === "detailDiscount") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ChiTietWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>Chi ti???t M?? gi???m gi??</H1>
                            <ModalForm>
                                <div className="row">
                                    <div className="col-lg-4">
                                        <ModalFormItem style={{ margin: "0 10px" }}>
                                            <FormSpan>M?? s??? M?? gi???m gia:</FormSpan>
                                            <FormInput type="text" value={discountModal ? discountModal.discount_id : null} readOnly />
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-4">
                                        <ModalFormItem style={{ margin: "0 10px" }}>
                                            <FormSpan>T??? l??? gi???m gi??:</FormSpan>
                                            <FormInput type="text" value={discountModal ? discountModal.discount_percent : null} readOnly />
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-4">
                                        <ModalFormItem style={{ margin: "0 10px" }}>
                                            <FormSpan>Tr???ng th??i:</FormSpan>
                                            <FormInput type="text" value={discountModal ? discountModal.discount_state === 0 ? "Ch??a s??? d???ng" : discountModal.discount_state === 1 ? "???? s??? d???ng" : null : null} readOnly />
                                        </ModalFormItem>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-12">
                                        <ModalFormItem style={{ margin: "0 10px" }}>
                                            <FormSpan>M?? gi???m gi??:</FormSpan>
                                            <FormInput type="text" value={discountModal ? discountModal.discount_code : null} readOnly />
                                        </ModalFormItem>
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
    //  =============== Th??m M?? gi???m gi?? ===============
    if (type === "createDiscount") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>Th??m M?? gi???m gi?? m???i</H1>
                            <ModalForm>
                                <ModalFormItem>
                                    <FormSpan>T??? l??? gi???m gi??:</FormSpan>
                                    <FormSelect onChange={(e) => { setDiscountPercentModalNew(parseInt(e.target.value)) }}>
                                        <FormOption value={5}> Gi???m gi?? 5% </FormOption>
                                        <FormOption value={10}> Gi???m gi?? 10% </FormOption>
                                        <FormOption value={15}> Gi???m gi?? 15% </FormOption>
                                        <FormOption value={20}> Gi???m gi?? 20% </FormOption>
                                        <FormOption value={25}> Gi???m gi?? 25% </FormOption>
                                        <FormOption value={30}> Gi???m gi?? 30% </FormOption>
                                    </FormSelect>
                                </ModalFormItem>
                                <ModalFormItem>
                                    <FormSpan>T??n M?? gi???m gi??:</FormSpan>
                                    <FormInput type="text" value={discountNameModalNew} onChange={(e) => setDiscountNameModalNew(e.target.value.toUpperCase())} />
                                </ModalFormItem>
                                <ModalFormItem>
                                    <FormSpan>S??? l?????ng m?? gi???m gi??:</FormSpan>
                                    <FormInput type="number" onChange={(e) => setDiscountQuantityModalNew(parseInt(e.target.value))} />
                                </ModalFormItem>
                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => handleCreateDiscount(discountPercentModalNew, discountNameModalNew, discountQuantityModalNew)}
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
    // =============== Ch???nh s???a M?? gi???m gi?? ===============
    if (type === "updateDiscount") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>C???p nh???t M?? gi???m gi??</H1>
                            <ModalForm>
                                <ModalFormItem>
                                    <FormSpan>T??? l??? gi???m gi??:</FormSpan>
                                    <FormInput type="number" value={discountPercentModal} onChange={(e) => setDiscountPercentModal(parseInt(e.target.value))} />
                                </ModalFormItem>
                                <ModalFormItem>
                                    <FormSpan>M?? gi???m gi??:</FormSpan>
                                    <FormInput type="text" value={discountCodeModal} onChange={(e) => setDiscountCodeModal(e.target.value.toUpperCase())} />
                                </ModalFormItem>
                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => handleUpdateDiscount(discountCodeModal, discountPercentModal, discountIdModal)}
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
    // // =============== X??a gi???m gi?? ===============
    if (type === "deleteDiscount") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ backgroundImage: `url("https://img.freepik.com/free-vector/alert-safety-background_97886-3460.jpg?w=1060")`, backgroundPosition: `center center`, backgroundRepeat: `no-repeat`, backgroundSize: `cover`, width: `600px`, height: `400px` }} >
                            <ModalContent>
                                <H1Delete>B???n mu???n x??a M?? gi???m gi?? <span style={{ color: `var(--color-primary)` }}>{discountCodeModal}</span> n??y?</H1Delete>
                                <p>Click ?????ng ?? n???u b???n mu???n th???c hi???n h??nh ?????ng n??y!</p>
                                <Button>
                                    <ButtonContainer>
                                        <ButtonClick
                                            onClick={() => { handleDeleteDiscount(discountIdModal) }}
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