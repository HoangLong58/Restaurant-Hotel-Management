import { CloseOutlined } from "@mui/icons-material";
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";

// SERVICES
import * as FloorService from "../../service/FloorService";
import * as TableBookingService from "../../service/TableBookingService";
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

const Modal = ({ showModal, setShowModal, type, tableBooking, setReRenderData, handleClose, showToastFromOut }) => {
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

    // State chứa mảng floor và table type - Lấy về floor và table type để hiện select-option
    const [floorList, setFloorList] = useState([]);
    const [tableTypeList, setTableTypeList] = useState([]);
    useEffect(() => {
        const getFloorList = async () => {
            try {
                const floorListRes = await FloorService.getFloors();
                setFloorList(floorListRes.data.data);
            } catch (err) {
                console.log("Lỗi lấy floor list: ", err.response);
            }
        }
        getFloorList();
        const getTableTypeList = async () => {
            try {
                const tableTypeListRes = await TableTypeService.getAllTableTypes();
                setTableTypeList(tableTypeListRes.data.data);
            } catch (err) {
                console.log("Lỗi lấy party hall type list: ", err.response);
            }
        }
        getTableTypeList();
    }, []);
    // =============== Xử lý cập nhật danh mục ===============
    useEffect(() => {
        setTableBookingNameModalNew();
        setTableTypeIdModalNew();
        setFloorIdModalNew();
    }, [showModal]);

    const handleUpdateTableBooking = async (
        tableBookingName,
        tableTypeId,
        floorId,
        tableBookingId
    ) => {
        try {
            const updateTableBookingRes = await TableBookingService.updateTableBooking({
                tableBookingName: tableBookingName,
                tableTypeId: tableTypeId,
                floorId: floorId,
                tableBookingId: tableBookingId
            });
            if (!updateTableBookingRes) {
                // Toast
                const dataToast = { message: updateTableBookingRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }

            // Success
            setShowModal(prev => !prev);
            handleClose();  //Đóng thanh tìm kiếm và render lại giá trị mới ở compo Main
            // Toast
            const dataToast = { message: updateTableBookingRes.data.message, type: "success" };
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
    //  STATE
    const [tableBookingModal, setTableBookingModal] = useState();
    const [tableBookingIdModal, setTableBookingIdModal] = useState();
    const [tableBookingNameModal, setTableBookingNameModal] = useState();
    const [tableTypeIdModal, setTableTypeIdModal] = useState();
    const [floorIdModal, setFloorIdModal] = useState();

    const [tableBookingModalOld, setTableBookingModalOld] = useState();
    const [tableBookingNameModalOld, setTableBookingNameModalOld] = useState();
    const [tableTypeIdModalOld, setTableTypeIdModalOld] = useState();
    const [floorIdModalOld, setFloorIdModalOld] = useState();
    useEffect(() => {
        const getTableBooking = async () => {
            try {
                const tableBookingRes = await TableBookingService.findTableBookingById({
                    tableBookingId: tableBooking.table_booking_id
                });
                console.log("RES: ", tableBookingRes);
                setTableBookingModal(tableBookingRes.data.data);
                setTableBookingIdModal(tableBookingRes.data.data.table_booking_id);
                setTableBookingNameModal(tableBookingRes.data.data.table_booking_name);
                setTableTypeIdModal(tableBookingRes.data.data.table_type_id);
                setFloorIdModal(tableBookingRes.data.data.floor_id);

                setTableBookingModalOld(tableBookingRes.data.data);
                setTableBookingNameModalOld(tableBookingRes.data.data.table_booking_name);
                setTableTypeIdModalOld(tableBookingRes.data.data.table_type_id);
                setFloorIdModalOld(tableBookingRes.data.data.floor_id);
            } catch (err) {
                console.log("Lỗi lấy danh mục: ", err.response);
            }
        }
        if (tableBooking) {
            getTableBooking();
        }
    }, [tableBooking]);
    console.log("Danh mục modal: ", tableBookingModal);

    const handleCloseUpdate = () => {
        // Set lại giá trị cũ sau khi đóng Modal
        setTableBookingNameModal(tableBookingNameModalOld);
        setTableTypeIdModal(tableTypeIdModalOld);
        setFloorIdModal(floorIdModalOld);

        setShowModal(prev => !prev);
    }

    // =============== Xử lý thêm danh mục ===============
    const [tableBookingNameModalNew, setTableBookingNameModalNew] = useState();
    const [tableTypeIdModalNew, setTableTypeIdModalNew] = useState();
    const [floorIdModalNew, setFloorIdModalNew] = useState();

    // Create new divice type
    const handleCreateTableBooking = async (
        tableBookingName,
        tableTypeId,
        floorId
    ) => {
        try {
            const createTableBookingRes = await TableBookingService.createTableBooking({
                tableBookingName: tableBookingName,
                tableTypeId: tableTypeId,
                floorId: floorId
            });
            if (!createTableBookingRes) {
                // Toast
                const dataToast = { message: createTableBookingRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }

            // Success
            setReRenderData(prev => !prev); //Render lại csdl ở Compo cha là - DanhMucMain & DanhMucRight.jsx
            setShowModal(prev => !prev);
            // Toast
            const dataToast = { message: createTableBookingRes.data.message, type: "success" };
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
    const handleDeleteTableBooking = async (tableBookingId) => {
        try {
            const deleteTableBookingRes = await TableBookingService.deleteTableBooking(tableBookingId);
            if (!deleteTableBookingRes) {
                // Toast
                const dataToast = { message: deleteTableBookingRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }
            // Success
            setShowModal(prev => !prev);
            handleClose();  //Đóng thanh tìm kiếm và render lại giá trị mới ở compo Main
            // Toast
            const dataToast = { message: deleteTableBookingRes.data.message, type: "success" };
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
    //  =============== Chi tiết Bàn ăn ===============
    if (type === "detailTableBooking") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>Chi tiết Bàn ăn</H1>
                            <ModalForm>
                                <ModalFormItem>
                                    <FormSpan>Mã số Bàn ăn:</FormSpan>
                                    <FormInput type="text" value={tableBookingModal ? tableBookingModal.table_booking_id : null} readOnly />
                                </ModalFormItem>
                                <ModalFormItem>
                                    <FormSpan>Tên Bàn ăn:</FormSpan>
                                    <FormInput type="text" value={tableBookingModal ? tableBookingModal.table_booking_name : null} readOnly />
                                </ModalFormItem>
                                <ModalFormItem>
                                    <FormSpan>Loại bàn ăn:</FormSpan>
                                    <FormInput type="text" value={tableBookingModal ? tableBookingModal.table_type_name : null} readOnly />
                                </ModalFormItem>
                                <ModalFormItem>
                                    <FormSpan>Thuộc Tầng:</FormSpan>
                                    <FormInput type="text" value={tableBookingModal ? tableBookingModal.floor_name : null} readOnly />
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
    if (type === "createTableBooking") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>Thêm Bàn ăn mới</H1>
                            <ModalForm>
                                <ModalFormItem>
                                    <FormSpan>Tên Bàn ăn:</FormSpan>
                                    <FormInput type="text" onChange={(e) => setTableBookingNameModalNew(e.target.value)} placeholder="Nhập vào tên Bàn ăn" />
                                </ModalFormItem>
                                <ModalFormItem style={{ flex: "1" }}>
                                    <FormSpan>Bàn ăn thuộc Loại:</FormSpan>
                                    <FormSelect onChange={(e) => { setTableTypeIdModalNew(parseInt(e.target.value)) }}>
                                        {tableTypeList.map((tableType, key) => {
                                            if (tableType.table_type_id === tableTypeIdModal) {
                                                return (
                                                    <FormOption value={tableType.table_type_id} selected> {tableType.table_type_name} </FormOption>
                                                )
                                            } else {
                                                return (
                                                    <FormOption value={tableType.table_type_id}> {tableType.table_type_name} </FormOption>
                                                )
                                            }
                                        })}
                                    </FormSelect>
                                </ModalFormItem>
                                <ModalFormItem style={{ flex: "1" }}>
                                    <FormSpan>Bàn ăn thuộc Tầng:</FormSpan>
                                    <FormSelect onChange={(e) => { setFloorIdModalNew(parseInt(e.target.value)) }}>
                                        {floorList.map((floor, key) => {
                                            if (floor.floor_id === floorIdModal) {
                                                return (
                                                    <FormOption value={floor.floor_id} selected> {floor.floor_name} </FormOption>
                                                )
                                            } else {
                                                return (
                                                    <FormOption value={floor.floor_id}> {floor.floor_name} </FormOption>
                                                )
                                            }
                                        })}
                                    </FormSelect>
                                </ModalFormItem>
                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => handleCreateTableBooking(tableBookingNameModalNew, tableTypeIdModalNew, floorIdModalNew)}
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
    if (type === "updateTableBooking") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column` }}>
                            <H1>Cập nhật Bàn ăn</H1>
                            <ModalForm>
                                <ModalFormItem>
                                    <FormSpan>Tên Bàn ăn:</FormSpan>
                                    <FormInput type="text" onChange={(e) => setTableBookingNameModal(e.target.value)} value={tableBookingNameModal} />
                                </ModalFormItem>
                                <ModalFormItem style={{ flex: "1" }}>
                                    <FormSpan>Bàn ăn thuộc Loại:</FormSpan>
                                    <FormSelect onChange={(e) => { setTableTypeIdModal(parseInt(e.target.value)) }}>
                                        {tableTypeList.map((tableType, key) => {
                                            if (tableType.table_type_id === tableTypeIdModal) {
                                                return (
                                                    <FormOption value={tableType.table_type_id} selected> {tableType.table_type_name} </FormOption>
                                                )
                                            } else {
                                                return (
                                                    <FormOption value={tableType.table_type_id}> {tableType.table_type_name} </FormOption>
                                                )
                                            }
                                        })}
                                    </FormSelect>
                                </ModalFormItem>
                                <ModalFormItem style={{ flex: "1" }}>
                                    <FormSpan>Bàn ăn thuộc Tầng:</FormSpan>
                                    <FormSelect onChange={(e) => { setFloorIdModal(parseInt(e.target.value)) }}>
                                        {floorList.map((floor, key) => {
                                            if (floor.floor_id === floorIdModal) {
                                                return (
                                                    <FormOption value={floor.floor_id} selected> {floor.floor_name} </FormOption>
                                                )
                                            } else {
                                                return (
                                                    <FormOption value={floor.floor_id}> {floor.floor_name} </FormOption>
                                                )
                                            }
                                        })}
                                    </FormSelect>
                                </ModalFormItem>
                            </ModalForm>
                            <ButtonUpdate>
                                <ButtonContainer>
                                    <ButtonClick
                                        onClick={() => handleUpdateTableBooking(tableBookingNameModal, tableTypeIdModal, floorIdModal, tableBookingIdModal)}
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
    // =============== Xóa danh mục ===============
    if (type === "deleteTableBooking") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ backgroundImage: `url("https://img.freepik.com/free-vector/alert-safety-background_97886-3460.jpg?w=1060")`, backgroundPosition: `center center`, backgroundRepeat: `no-repeat`, backgroundSize: `cover`, width: `600px`, height: `400px` }} >
                            <ModalContent>
                                <h1>Bạn muốn xóa Bàn ăn <span style={{ color: `var(--color-primary)` }}>{tableBookingNameModal}</span> này?</h1>
                                <p>Click Đồng ý nếu bạn muốn thực hiện hành động này!</p>
                                <Button>
                                    <ButtonContainer>
                                        <ButtonClick
                                            onClick={() => { handleDeleteTableBooking(tableBookingIdModal) }}
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