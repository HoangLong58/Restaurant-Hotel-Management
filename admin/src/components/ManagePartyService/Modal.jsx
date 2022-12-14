import { CloseOutlined } from "@mui/icons-material";
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";

// SERVICES
import * as PartyServiceService from "../../service/PartyServiceService";
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
    width: 900px;
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
    object-fit: contain;
    height: 200px;
`

const ModalChiTietItem = styled.div`
margin: 2px 30px;
display: flex;
flex-direction: column;
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
// Chi ti???t
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

const H1Delete = styled.h1` 
    width: "90%";
    text-align: center;
`
const Modal = ({ showModal, setShowModal, type, partyService, setReRenderData, handleClose, showToastFromOut }) => {
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
        setPartyServiceNameModalNew();
        setPartyServicePriceModalNew();
        setPartyServiceTypeIdModalNew();
    }, [showModal]);

    const handleUpdatePartyService = async (partyServiceName, partyServicePrice, partyServiceTypeId, partyServiceId) => {
        try {
            const updatePartyServiceRes = await PartyServiceService.updatePartyService({
                partyServiceName: partyServiceName,
                partyServicePrice: partyServicePrice,
                partyServiceTypeId: partyServiceTypeId,
                partyServiceId: partyServiceId
            });
            if (!updatePartyServiceRes) {
                // Toast
                const dataToast = { message: updatePartyServiceRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }

            // Success
            setShowModal(prev => !prev);
            handleClose();  //????ng thanh t??m ki???m v?? render l???i gi?? tr??? m???i ??? compo Main
            // Toast
            const dataToast = { message: updatePartyServiceRes.data.message, type: "success" };
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

    useEffect(() => {
        const getPartyServiceType = async () => {
            try {
                const partyServiceTypeRes = await PartyServiceTypeService.getAllPartyServiceTypes();
                setPartyServiceTypeList(partyServiceTypeRes.data.data);
            } catch (err) {
                console.log("L???i l???y device type: ", err);
            }
        };
        getPartyServiceType();
    }, []);

    // STATE:
    const [partyServiceModal, setPartyServiceModal] = useState();
    const [partyServiceIdModal, setPartyServiceIdModal] = useState();
    const [partyServiceNameModal, setPartyServiceNameModal] = useState();
    const [partyServicePriceModal, setPartyServicePriceModal] = useState();
    const [partyServiceTypeIdModal, setPartyServiceTypeIdModal] = useState();

    const [partyServiceModalOld, setPartyServiceModalOld] = useState();
    const [partyServiceIdModalOld, setPartyServiceIdModalOld] = useState();
    const [partyServiceNameModalOld, setPartyServiceNameModalOld] = useState();
    const [partyServicePriceModalOld, setPartyServicePriceModalOld] = useState();
    const [partyServiceTypeIdModalOld, setPartyServiceTypeIdModalOld] = useState();

    const [partyServiceList, setPartyServiceTypeList] = useState([]);
    useEffect(() => {
        const getPartyService = async () => {
            try {
                const partyServiceRes = await PartyServiceService.findPartyServiceById({
                    partyServiceId: partyService.party_service_id
                });
                console.log("RES: ", partyServiceRes);
                setPartyServiceModal(partyServiceRes.data.data);
                setPartyServiceIdModal(partyServiceRes.data.data.party_service_id);
                setPartyServiceNameModal(partyServiceRes.data.data.party_service_name);
                setPartyServicePriceModal(partyServiceRes.data.data.party_service_price);
                setPartyServiceTypeIdModal(partyServiceRes.data.data.party_service_type_id);

                setPartyServiceModalOld(partyServiceRes.data.data);
                setPartyServiceIdModalOld(partyServiceRes.data.data.party_service_id);
                setPartyServiceNameModalOld(partyServiceRes.data.data.party_service_name);
                setPartyServicePriceModalOld(partyServiceRes.data.data.party_service_price);
                setPartyServiceTypeIdModalOld(partyServiceRes.data.data.party_service_type_id);
            } catch (err) {
                console.log("L???i l???y party service: ", err.response);
            }
        }
        if (partyService) {
            getPartyService();
        }
    }, [partyService]);
    console.log("Danh m???c modal: ", partyServiceModal);


    const handleCloseUpdate = () => {
        // Set l???i gi?? tr??? c?? sau khi ????ng Modal
        setPartyServiceNameModal(partyServiceNameModalOld);
        setPartyServicePriceModal(partyServicePriceModalOld);
        setPartyServiceTypeIdModal(partyServiceTypeIdModalOld);

        setShowModal(prev => !prev);
    }

    // =============== X??? l?? th??m danh m???c ===============
    const [partyServiceNameModalNew, setPartyServiceNameModalNew] = useState();
    const [partyServicePriceModalNew, setPartyServicePriceModalNew] = useState();
    const [partyServiceTypeIdModalNew, setPartyServiceTypeIdModalNew] = useState();

    // Create new divice
    const handleCreatePartyService = async (newName, newPrice, partyServiceTypeId) => {
        try {
            const createPartyServiceRes = await PartyServiceService.createPartyService({
                partyServiceName: newName,
                partyServicePrice: newPrice,
                partyServiceTypeId: partyServiceTypeId
            });
            if (!createPartyServiceRes) {
                // Toast
                const dataToast = { message: createPartyServiceRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }

            // Success
            setReRenderData(prev => !prev); //Render l???i csdl ??? Compo cha l?? - DanhMucMain & DanhMucRight.jsx
            setShowModal(prev => !prev);
            // Toast
            const dataToast = { message: createPartyServiceRes.data.message, type: "success" };
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
    const handleDeletePartyService = async (partyServiceId) => {
        try {
            const deletePartyServiceRes = await PartyServiceService.deletePartyService(partyServiceId);
            if (!deletePartyServiceRes) {
                // Toast
                const dataToast = { message: deletePartyServiceRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }
            // Success
            setShowModal(prev => !prev);
            handleClose();  //????ng thanh t??m ki???m v?? render l???i gi?? tr??? m???i ??? compo Main
            // Toast
            const dataToast = { message: deletePartyServiceRes.data.message, type: "success" };
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
    // Chi ti???t
    if (type === "detailPartyService") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ChiTietWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>Chi ti???t D???ch v??? Ti???c</H1>
                            <ModalForm>
                                <div className="row">
                                    <div className="col-lg-12">
                                        <ModalFormItem style={{ margin: "0 10px" }}>
                                            <FormSpan>M?? D???ch v??? Ti???c:</FormSpan>
                                            <FormInput type="text" value={partyServiceModal ? partyServiceModal.party_service_id : null} readOnly />
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-12">
                                        <ModalFormItem style={{ margin: "0 10px" }}>
                                            <FormSpan>T??n D???ch v??? Ti???c:</FormSpan>
                                            <FormInput type="text" value={partyServiceModal ? partyServiceModal.party_service_name : null} readOnly />
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-12">
                                        <ModalFormItem style={{ margin: "0 10px" }}>
                                            <FormSpan>Ph??n lo???i:</FormSpan>
                                            <FormInput type="text" value={partyServiceModal ? partyServiceModal.party_service_type_name : null} readOnly />
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-12">
                                        <ModalFormItem style={{ margin: "0 10px" }}>
                                            <FormSpan>Gi?? ti???n:</FormSpan>
                                            <FormInput type="text" value={partyServiceModal ? partyServiceModal.party_service_price : null} readOnly />
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
    //  =============== Th??m D???ch v??? Ti???c ===============
    if (type === "createPartyService") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>Th??m D???ch v??? Ti???c m???i</H1>
                            <ModalForm>
                                <div className="row">
                                    <div className="col-lg-12">
                                        <ModalFormItem style={{ flex: "1" }}>
                                            <FormSpan>Lo???i D???ch v??? Ti???c:</FormSpan>
                                            <FormSelect onChange={(e) => { setPartyServiceTypeIdModalNew(parseInt(e.target.value)) }}>
                                                {
                                                    partyServiceList.map((partyServiceType, key) => {
                                                        return (
                                                            <FormOption value={partyServiceType.party_service_type_id}>{partyServiceType.party_service_type_name}</FormOption>
                                                        )
                                                    })
                                                }
                                            </FormSelect>
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-12">
                                        <ModalFormItem>
                                            <FormSpan>T??n D???ch v??? Ti???c:</FormSpan>
                                            <FormInput type="text" onChange={(e) => setPartyServiceNameModalNew(e.target.value)} placeholder="Nh???p v??o T??n D???ch v??? Ti???c" />
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-12">
                                        <ModalFormItem>
                                            <FormSpan>Gi?? ti???n:</FormSpan>
                                            <FormInput type="number" min={0} onChange={(e) => setPartyServicePriceModalNew(e.target.value)} placeholder="Nh???p v??o Gi?? ti???n c???a D???ch v??? Ti???c" />
                                        </ModalFormItem>
                                    </div>
                                </div>
                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => handleCreatePartyService(partyServiceNameModalNew, partyServicePriceModalNew, partyServiceTypeIdModalNew)}
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
    // =============== Ch???nh s???a D???ch v??? Ti???c ===============
    if (type === "updatePartyService") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>C???p nh???t D???ch v??? Ti???c</H1>
                            <ModalForm>
                                <div className="row">
                                    <div className="col-lg-12">
                                        <ModalFormItem style={{ flex: "1", margin: "0 30px" }}>
                                            <FormSpan>Lo???i D???ch v??? Ti???c:</FormSpan>
                                            <FormSelect onChange={(e) => { setPartyServiceTypeIdModal(parseInt(e.target.value)) }}>
                                                {partyServiceList.map((partyServiceType, key) => {
                                                    if (partyServiceType.party_service_type_id === partyServiceTypeIdModal) {
                                                        return (
                                                            <FormOption value={partyServiceType.party_service_type_id} selected> {partyServiceType.party_service_type_name} </FormOption>
                                                        )
                                                    } else {
                                                        return (
                                                            <FormOption value={partyServiceType.party_service_type_id}> {partyServiceType.party_service_type_name} </FormOption>
                                                        )
                                                    }
                                                })}
                                            </FormSelect>
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-12">
                                        <ModalFormItem style={{ margin: "0 30px" }}>
                                            <FormSpan>T??n D???ch v??? Ti???c:</FormSpan>
                                            <FormInput type="text" onChange={(e) => setPartyServiceNameModal(e.target.value)} value={partyServiceNameModal} />
                                        </ModalFormItem>
                                    </div>
                                    <div className="col-lg-12">
                                        <ModalFormItem style={{ margin: "0 30px" }}>
                                            <FormSpan>Gi?? ti???n:</FormSpan>
                                            <FormInput type="number" onChange={(e) => setPartyServicePriceModal(e.target.value)} value={partyServicePriceModal} />
                                        </ModalFormItem>
                                    </div>
                                </div>
                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    {/* newDeviceName, newDeviceDate, newDeviceDescription, newDeviceImage, newDeviceState, partyServiceTypeId, partyServiceId */}
                                    <ButtonClick
                                        onClick={() => handleUpdatePartyService(partyServiceNameModal, partyServicePriceModal, partyServiceTypeIdModal, partyServiceIdModal)}
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
    if (type === "deletePartyService") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ backgroundImage: `url("https://img.freepik.com/free-vector/alert-safety-background_97886-3460.jpg?w=1060")`, backgroundPosition: `center center`, backgroundRepeat: `no-repeat`, backgroundSize: `cover`, width: `600px`, height: `400px` }} >
                            <ModalContent>
                                <H1Delete>B???n mu???n x??a D???ch v??? Ti???c <span style={{ color: `var(--color-primary)` }}>{partyServiceNameModal}</span> n??y?</H1Delete>
                                <p>Click ?????ng ?? n???u b???n mu???n th???c hi???n h??nh ?????ng n??y!</p>
                                <Button>
                                    <ButtonContainer>
                                        <ButtonClick
                                            onClick={() => { handleDeletePartyService(partyServiceIdModal) }}
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