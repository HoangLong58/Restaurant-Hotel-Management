import { CloseOutlined } from "@mui/icons-material";
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";

// SERVICES
import * as TableTypeService from "../../service/TableTypeService";

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


const Modal = ({ showModal, setShowModal, type, tableType, setReRenderData, handleClose, showToastFromOut }) => {
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
        setTableTypeNameModalNew();
    }, [showModal]);

    const handleUpdateTableType = async (newTableTypeName, tableTypeId) => {
        try {
            const updateTableTypeRes = await TableTypeService.updateTableType({
                tableTypeId: tableTypeId,
                tableTypeName: newTableTypeName
            });
            if (!updateTableTypeRes) {
                // Toast
                const dataToast = { message: updateTableTypeRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }

            // Success
            setShowModal(prev => !prev);
            handleClose();  //????ng thanh t??m ki???m v?? render l???i gi?? tr??? m???i ??? compo Main
            // Toast
            const dataToast = { message: updateTableTypeRes.data.message, type: "success" };
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
    const [tableTypeModal, setTableTypeModal] = useState();
    const [tableTypeIdModal, setTableTypeIdModal] = useState();
    const [tableTypeNameModal, setTableTypeNameModal] = useState();

    const [tableTypeModalOld, setTableTypeModalOld] = useState();
    const [tableTypeNameModalOld, setTableTypeNameModalOld] = useState();
    useEffect(() => {
        const getTableType = async () => {
            try {
                const tableTypeRes = await TableTypeService.findTableTypeById({
                    tableTypeId: tableType.table_type_id
                });
                console.log("RES: ", tableTypeRes);
                setTableTypeModal(tableTypeRes.data.data);
                setTableTypeIdModal(tableTypeRes.data.data.table_type_id);
                setTableTypeNameModal(tableTypeRes.data.data.table_type_name);

                setTableTypeModalOld(tableTypeRes.data.data);
                setTableTypeNameModalOld(tableTypeRes.data.data.table_type_name);
            } catch (err) {
                console.log("L???i l???y danh m???c: ", err.response);
            }
        }
        if (tableType) {
            getTableType();
        }
    }, [tableType]);
    console.log("Danh m???c modal: ", tableTypeModal);

    const handleCloseUpdate = () => {
        // Set l???i gi?? tr??? c?? sau khi ????ng Modal
        setTableTypeNameModal(tableTypeNameModalOld);

        setShowModal(prev => !prev);
    }

    // =============== X??? l?? th??m danh m???c ===============
    const [tableTypeNameModalNew, setTableTypeNameModalNew] = useState();

    // Create new party booking type
    const handleCreateTableType = async (newName) => {
        try {
            const createTableTypeRes = await TableTypeService.createTableType({
                tableTypeName: newName
            });
            if (!createTableTypeRes) {
                // Toast
                const dataToast = { message: createTableTypeRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }

            // Success
            setReRenderData(prev => !prev); //Render l???i csdl ??? Compo cha l?? - DanhMucMain & DanhMucRight.jsx
            setShowModal(prev => !prev);
            // Toast
            const dataToast = { message: createTableTypeRes.data.message, type: "success" };
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
    const handleDeleteTableType = async (tableTypeId) => {
        try {
            const deleteTableTypeRes = await TableTypeService.deleteTableType(tableTypeId);
            if (!deleteTableTypeRes) {
                // Toast
                const dataToast = { message: deleteTableTypeRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }
            // Success
            setShowModal(prev => !prev);
            handleClose();  //????ng thanh t??m ki???m v?? render l???i gi?? tr??? m???i ??? compo Main
            // Toast
            const dataToast = { message: deleteTableTypeRes.data.message, type: "success" };
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
    const handleDisableTableType = async (tableTypeId) => {
        try {
            const disableTableTypeRes = await TableTypeService.disableTableTypeById({
                tableTypeId: tableTypeId
            });
            if (!disableTableTypeRes) {
                // Toast
                const dataToast = { message: disableTableTypeRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }
            // Success
            setShowModal(prev => !prev);
            handleClose();  //????ng thanh t??m ki???m v?? render l???i gi?? tr??? m???i ??? compo Main
            // Toast
            const dataToast = { message: disableTableTypeRes.data.message, type: "success" };
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
    const handleAbleTableType = async (tableTypeId) => {
        console.log("ccccccccc", tableTypeId)
        try {
            const ableTableTypeRes = await TableTypeService.ableTableTypeById({
                tableTypeId: tableTypeId
            });
            if (!ableTableTypeRes) {
                // Toast
                const dataToast = { message: ableTableTypeRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }
            // Success
            setShowModal(prev => !prev);
            handleClose();  //????ng thanh t??m ki???m v?? render l???i gi?? tr??? m???i ??? compo Main
            // Toast
            const dataToast = { message: ableTableTypeRes.data.message, type: "success" };
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
    //  =============== Chi ti???t Lo???i b??n ===============
    if (type === "detailTableType") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>Chi ti???t Lo???i b??n</H1>
                            <ModalForm>
                                <ModalFormItem>
                                    <FormSpan>M?? s??? Lo???i b??n:</FormSpan>
                                    <FormInput type="text" value={tableTypeModal ? tableTypeModal.table_type_id : null} readOnly />
                                </ModalFormItem>
                                <ModalFormItem>
                                    <FormSpan>T??n Lo???i b??n:</FormSpan>
                                    <FormInput type="text" value={tableTypeModal ? tableTypeModal.table_type_name : null} readOnly />
                                </ModalFormItem>
                                <ModalFormItem>
                                    <FormSpan>Tr???ng th??i:</FormSpan>
                                    <FormInput type="text" value={tableTypeModal ? tableTypeModal.table_type_state === 0 ? "??ang ho???t ?????ng" : tableTypeModal.table_type_state === 1 ? "Ng??ng ho???t ?????ng" : null : null} readOnly />
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
    if (type === "createTableType") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>Th??m Lo???i b??n m???i</H1>
                            <ModalForm>
                                <ModalFormItem>
                                    <FormSpan>T??n Lo???i b??n:</FormSpan>
                                    <FormInput type="text" onChange={(e) => setTableTypeNameModalNew(e.target.value)} placeholder="Nh???p v??o t??n Lo???i b??n" />
                                </ModalFormItem>
                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => handleCreateTableType(tableTypeNameModalNew)}
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
    if (type === "updateTableType") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>C???p nh???t Lo???i b??n</H1>
                            <ModalForm>
                                <ModalFormItem>
                                    <FormSpan>T??n Lo???i b??n:</FormSpan>
                                    <FormInput type="text" onChange={(e) => setTableTypeNameModal(e.target.value)} value={tableTypeNameModal} />
                                </ModalFormItem>
                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => handleUpdateTableType(tableTypeNameModal, tableTypeIdModal)}
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
    // =============== Disable tableType ===============
    if (type === "disableTableType") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <AlertWrapper showModal={showModal}>
                            <ModalForm>
                                <ModalFormItem>
                                    <h1>B???n mu???n V?? hi???u h??a Lo???i b??n <span style={{ color: `var(--color-primary)` }}>{tableTypeModal ? tableTypeModal.table_type_name : null}</span> n??y?</h1>
                                    <p style={{ marginTop: "10px" }}>Lo???i b??n n??y s??? ng??ng ho???t ?????ng v?? Kh??ch h??ng kh??ng th??? ?????t ???????c n???a!</p>
                                </ModalFormItem>
                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => handleDisableTableType(tableTypeIdModal)}
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
    // =============== able tableType ===============
    if (type === "ableTableType") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <AlertWrapper showModal={showModal}>
                            <ModalForm>
                                <ModalFormItem>
                                    <h1>B???n mu???n M??? kh??a Lo???i b??n <span style={{ color: `var(--color-primary)` }}>{tableTypeModal ? tableTypeModal.table_type_name : null}</span> n??y?</h1>
                                    <p style={{ marginTop: "10px" }}>Kh??ch h??ng l???i c?? th??? ?????t lo???i b??n n??y nh?? tr?????c!</p>
                                </ModalFormItem>
                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => handleAbleTableType(tableTypeIdModal)}
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
    if (type === "deleteTableType") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ backgroundImage: `url("https://img.freepik.com/free-vector/alert-safety-background_97886-3460.jpg?w=1060")`, backgroundPosition: `center center`, backgroundRepeat: `no-repeat`, backgroundSize: `cover`, width: `600px`, height: `400px` }} >
                            <ModalContent>
                                <h1>B???n mu???n x??a Lo???i b??n <span style={{ color: `var(--color-primary)` }}>{tableTypeNameModal}</span> n??y?</h1>
                                <p>Nh???ng b??n c???a lo???i n??y c??ng s??? b??? x??a</p>
                                <Button>
                                    <ButtonContainer>
                                        <ButtonClick
                                            onClick={() => { handleDeleteTableType(tableTypeIdModal) }}
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