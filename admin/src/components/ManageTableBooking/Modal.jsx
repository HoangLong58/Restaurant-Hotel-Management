import { ClearOutlined, CloseOutlined } from "@mui/icons-material";
import { Box, Checkbox, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";

// SERVICES
import * as FloorService from "../../service/FloorService";
import * as TableBookingService from "../../service/TableBookingService";
import * as TableTypeService from "../../service/TableTypeService";
import * as EmployeeService from "../../service/EmployeeService";
import * as TableEmployeeService from "../../service/TableEmployeeService";
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

const LeftVoteTitle = styled.span`
    margin: auto;
    font-size: 1.5rem;
    font-weight: bold;
    letter-spacing: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 0px 15px 0px;
    color: var(--color-dark);
`

// Left
const LeftVote = styled.div``
const LeftVoteItem = styled.div`
    position: relative;
    padding-bottom: 20px;
    margin-bottom: 20px;
    box-shadow: 6px 6px 30px #d1d9e6;
    border-radius: 20px;
    background-color: var(--color-white);
`
const LeftImage = styled.img`
    margin: auto;
    width: 95%;
    max-height: 150px;
    object-fit: cover;
    border-radius: 20px;
`

const InforCustomer = styled.div``
const InfoItem = styled.div``
const InfoTitle = styled.div`
    font-size: 1.1rem;
    font-weight: 400;
    letter-spacing: 1px;
    padding: 10px 0px 10px 50px;
    color: var(--color-dark);
`
const InfoDetail = styled.div`
    font-size: 1.1rem;
    font-weight: 400;
    letter-spacing: 1px;
    padding: 10px 20px;
    color: var(--color-dark);
`

const CartItem = styled.div`
display: flex;
width: 100%;
font-size: 1.1rem;
background: var(--color-grey);
margin-top: 10px;
padding: 10px 12px;
border-radius: 5px;
cursor: pointer;
border: 1px solid transparent;
`

const Circle = styled.span`
height: 12px;
width: 12px;
background: #ccc;
border-radius: 50%;
margin-right: 15px;
border: 4px solid transparent;
display: inline-block;
`

const Course = styled.div`
width: 100%;
color: var(--color-dark);
`

const Content = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
`

const LeftVoteItem2 = styled.div`
    position: relative;
    padding-bottom: 20px;
    margin-bottom: 20px;
    box-shadow: 6px 6px 30px #d1d9e6;
    border-radius: 20px;
    background-color: var(--color-white);
    display: flex;
    flex-direction: column;
`

// Device Item
const DeviceList = styled.div`
    min-height: 200px;
    max-height: 200px;
    overflow-y: scroll;
`;
const DeviceIcon = styled.img`
    width: 40px;
    height: auto;
`;
const DeviceName = styled.div`
    font-size: 1rem;
    font-weight: bold;
`;
const DeviceTime = styled.div`
    font-size: 0.9rem;
    font-weight: 300;
    letter-spacing: 2px;
`;
const DeviceTitle = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
`;
const DeviceInfo = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
`;
const DeviceIconContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

// Device detail
const DeviceDetailContainer = styled.div`
    border-radius: 5px;
    padding: 12px;
    /* position: absolute;
    bottom: calc(100% + 20px);
    right: -100px; */
    position: fixed;
    bottom: 400px;
    left: 650px;
    background-color: #f5f5f5;
    width: 250px;
    border-radius: 2px;
    box-shadow: 0 1px 3.125rem 0 rgb(0 0 0 / 20%);
    -webkit-animation: fadeIn ease-in 0.2s;
    animation: fadeIn ease-in 0.2s;
    transition: all 0.85s ease;
    cursor: default;
    z-index: 10;
    display: none;
    /* opacity: 0; */
    &::after {
        content: "";
        position: absolute;
        cursor: pointer;
        left: 24px;
        bottom: -28px;
        border-width: 16px 20px;
        border-style: solid;
        border-color: #f5f5f5 transparent transparent transparent;
    }
`;
const DeviceDetailImage = styled.img`
    border-radius: 5px;
    width: 100%;
`;

const DeviceItem = styled.div`
    border-radius: 20px;
    background-color: var(--color-light);
    padding: 10px 30px;
    width: 80%;
    margin: 5px auto 10px auto;
    position: relative;
    cursor: pointer;
    transition: all 0.5s ease;
    &:hover {
        background-color: #f5f5f5;
        ${DeviceDetailContainer} {
            /* opacity: 1; */
            display: block;
        }
        &::after {
            opacity: 1;
        }
    }
    &::after {
        content: "";
        position: absolute;
        top: 20px;
        left: 20px;
        height: 5px;
        width: 5px;
        background: var(--color-primary);
        border-radius: 50%;
        margin-right: 15px;
        border: 4px solid transparent;
        display: block;
        opacity: 0;
    }
`;

const DeleteService = styled.span`
    cursor: pointer;
    color: var(--color-dark);
    position: absolute;
    top: 17px;
    right: 20px;
    width: 32px;
    height: 32px;
    padding: 0;
    z-index: 10;
    &:hover {
        color: var(--color-primary);
        transform: scale(1.3);
        transition: all 200ms linear; 
    }
`

// Empty item
const EmptyItem = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`
const EmptyItemSvg = styled.div``
const EmptyContent = styled.div`
    letter-spacing: 2px;
    font-size: 1.2rem;
    color: var(--color-primary);
    font-weight: bold;
`
// Right
const RightVote = styled.div`
    padding-left: 40px;
`
const RightVoteItem = styled.div`
    position: relative;
    padding-bottom: 20px;
    margin-bottom: 20px;
    box-shadow: 6px 6px 30px #d1d9e6;
    border-radius: 20px;
    background-color: var(--color-white);
`

const RightVoteTitle = styled.span`
    margin: auto;
    font-size: 1.5rem;
    font-weight: bold;
    letter-spacing: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 0px 15px 0px;
    color: var(--color-dark);
`
const Surcharge = styled.div`
    height: 310px;
    max-height: 310px;
    overflow-y: scroll;
`
const RightVoteItem2 = styled.div`
    position: relative;
    padding-bottom: 20px;
    margin-bottom: 20px;
    box-shadow: 6px 6px 30px #d1d9e6;
    border-radius: 20px;
    background-color: var(--color-white);
    display: flex;
    flex-direction: column;
`

const FormChucNang = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    /* position: absolute;
    left: 50%;
    bottom: 50%; */
    /* transform: translateX(-50%); */
    text-align: center;
    justify-content: space-around;
`

const SignInBtn = styled.button`
    padding: 0px 35px;
    width: auto;
    height: 42px;
    margin: 5px 0px 10px 0px;
    border: none;
    outline: none;
    border-radius: 20px;
    text-transform: uppercase;
    font-size: 0.9rem;
    letter-spacing: 1px;
    font-weight: 700;
    box-shadow: 2px 2px 30px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    color: var(--color-dark);
    background-color: var(--color-light);
    transition: all 0.3s ease;
    &:hover {
        background-color: var(--color-primary);
        color: var(--color-white);
    }
    &:active {
        transform: scale(1.05);
    }
`

const SignUpBtn = styled.button`
    padding: 0px 35px;
    width: auto;
    height: 42px;
    margin: 5px 0px;
    border: none;
    outline: none;
    border-radius: 20px;
    text-transform: uppercase;
    font-size: 0.9rem;
    letter-spacing: 1px;
    font-weight: 700;
    box-shadow: 2px 2px 30px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    color: var(--color-dark);
    background-color: var(--color-light);
    transition: all 0.3s ease;
    &:hover {
        color: var(--color-white);
        background-color: var(--color-primary);
    }
    &:active {
        transform: scale(1.05);
    }   
`

// Checkbox
const LabelCheckbox = styled.label`
    cursor: pointer;
`
// Service Item
const ServiceItem = styled.div`
    background-color: var(--color-light);
    padding: 10px 30px;
    width: 80%;
    margin: 5px auto 10px auto;
    border-radius: 20px;
    position: relative;
`;
const ServiceIcon = styled.img`
    width: 40px;
    height: auto;
`;
const ServiceName = styled.div`
    font-size: 1rem;
    font-weight: bold;
`;
const ServiceTime = styled.div`
    font-size: 0.9rem;
    font-weight: 300;
    letter-spacing: 2px;
`;
const ServiceTitle = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
`;
const ServiceInfo = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
`;
const ServiceIconContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;
const Modal = ({ showModal, setShowModal, type, tableBooking, tableBookingAddEmployee, setReRenderData, handleClose, showToastFromOut }) => {
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

    // ADD EMPLOYEE
    const [tableBookingModalAddEmployee, setTableBookingModalAddEmployee] = useState();
    const [tableBookingIdModalAddEmployee, setTableBookingIdModalAddEmployee] = useState();
    const [positionIdModalAddEmployee, setPositionIdModalAddEmployee] = useState();
    const [isUpdateAddEmployeeModal, setIsUpdateAddEmployeeModal] = useState();
    const [tableEmployeeListAddEmployee, setTableEmployeeListAddEmployee] = useState([]);
    const [employeeListAddEmployee, setEmployeeListAddEmployee] = useState([]);
    // Lấy Chức vụ
    const [positionList, setPositionList] = useState([]);
    useEffect(() => {
        const getPositions = async () => {
            try {
                const positionRes = await PositionService.getPositions();
                setPositionList(positionRes.data.data);
            } catch (err) {
                console.log("Lỗi lấy position: ", err.response);
            }
        }
        getPositions();
    }, []);

    useEffect(() => {
        // Lấy thông tin bàn cần thêm nhân viên
        const getTableBookingAndImageWhenAddEmployee = async () => {
            try {
                const tableBookingRes = await TableBookingService.findTableBookingById({
                    tableBookingId: tableBookingAddEmployee.table_booking_id
                });
                setTableBookingModalAddEmployee(tableBookingRes.data.data);
                setTableBookingIdModalAddEmployee(tableBookingRes.data.data.table_booking_id);
            } catch (err) {
                console.log("Lỗi lấy table modal add employee: ", err.response);
            }
        }
        // Lấy Nhân viên mà bàn chưa có
        const getAllEmployeeByPositionIdAndTableBookingId = async () => {
            try {
                const employeeListRes = await EmployeeService.getAllEmployeeByPositionIdAndTableBookingId({
                    positionId: positionIdModalAddEmployee,
                    tableBookingId: tableBookingAddEmployee.table_booking_id
                });
                setEmployeeListAddEmployee(employeeListRes.data.data);
            } catch (err) {
                console.log("ERR: ", err.response);
            }
        };
        // Lấy những TableBooking employee của Bàn
        const getAllTableBookingEmployeeByTableBookingId = async () => {
            try {
                const tableEmployeeListRes = await TableEmployeeService.getAllTableEmployeeByTableBookingId(tableBookingAddEmployee.table_booking_id);
                setTableEmployeeListAddEmployee(tableEmployeeListRes.data.data);
            } catch (err) {
                console.log("ERR: ", err.response);
            }
        };
        if (tableBookingAddEmployee && !positionIdModalAddEmployee) {
            getTableBookingAndImageWhenAddEmployee();
            getAllTableBookingEmployeeByTableBookingId();
        }
        if (tableBookingAddEmployee && positionIdModalAddEmployee) {
            getTableBookingAndImageWhenAddEmployee();
            getAllTableBookingEmployeeByTableBookingId();
            getAllEmployeeByPositionIdAndTableBookingId();
        }
    }, [tableBookingAddEmployee, showModal, positionIdModalAddEmployee, isUpdateAddEmployeeModal]);

    // Xóa Nhân viên
    const handleDeleteTableBookingEmployee = async (tableEmployeeId) => {
        try {
            const deleteTableBookingEmployeeRes = await TableEmployeeService.deleteTableEmployeeByTableEmployeeId(tableEmployeeId);
            if (!deleteTableBookingEmployeeRes) {
                // Toast
                const dataToast = { message: deleteTableBookingEmployeeRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }
            //  Success
            setIsUpdateAddEmployeeModal(prev => !prev);

            // Toast
            const dataToast = { message: deleteTableBookingEmployeeRes.data.message, type: "success" };
            showToastFromOut(dataToast);
        } catch (err) {
            // Toast
            const dataToast = { message: err.response.data.message, type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
    };

    // Create room employee check box
    const [employeeChooseList, setEmployeeChooseList] = useState([]);
    const handleCheckEmployee = (e) => {
        setIsUpdateAddEmployeeModal(prev => !prev);
        const value = parseInt(e.target.value);
        if (e.currentTarget.checked) {
            if (!employeeChooseList.includes(value)) {
                employeeChooseList.push(value);
            }
        } else {
            if (employeeChooseList.includes(value)) {
                let index = employeeChooseList.indexOf(value);
                employeeChooseList.splice(index, 1);
            }
        }
        console.log("employeeChooseList: ", employeeChooseList);
    };
    const handleCreateTableBookingEmployee = async (e, employeeChooseList, tableBookingIdModalAddEmployee) => {
        console.log("e, employeeChooseList, tableBookingIdModalAddEmployee: ", e, employeeChooseList, tableBookingIdModalAddEmployee)
        e.preventDefault();
        try {
            const createTableBookingEmployeeRes = await TableEmployeeService.createTableEmployeeByListEmployeeId({
                employeeListId: employeeChooseList,
                tableBookingId: tableBookingIdModalAddEmployee
            });
            if (!createTableBookingEmployeeRes) {
                // Toast
                const dataToast = { message: createTableBookingEmployeeRes.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }
            //  Success
            setIsUpdateAddEmployeeModal(prev => !prev);
            setEmployeeChooseList([]);   //Thêm thành công thì bỏ mảng chọn cũ

            // Toast
            const dataToast = { message: createTableBookingEmployeeRes.data.message, type: "success" };
            showToastFromOut(dataToast);
        } catch (err) {
            // Toast
            const dataToast = { message: err.response.data.message, type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
    };
    const handleCancleCreateTableBookingEmployee = async (e, employeeChooseList) => {
        e.preventDefault();
        if (employeeChooseList.length === 0) {
            // Toast
            const dataToast = { message: "Bạn vẫn chưa chọn Nhân viên nào!", type: "warning" };
            showToastFromOut(dataToast);
            return;
        } else {
            setEmployeeChooseList([]);
            setIsUpdateAddEmployeeModal(prev => !prev);
            // Toast
            const dataToast = { message: "Hủy chọn thành công!", type: "success" };
            showToastFromOut(dataToast);
            return;
        }
    };
    // ================================================================
    //  =============== Thêm Nhân viên ===============
    if (type === "addEmployee") {
        return (
            <>
                {showModal ? (
                    <Background ref={modalRef} onClick={closeModal}>
                        <ModalWrapper showModal={showModal} style={{ flexDirection: `column`, width: "90%" }}>
                            <LeftVoteTitle style={{ marginTop: "10px", fontSize: "1.6rem" }}>Thêm Nhân viên cho Bàn - Nhà hàng</LeftVoteTitle>
                            <ModalForm style={{ padding: "0px 20px" }}>
                                <div className="col-lg-12">
                                    <div className="row">
                                        <LeftVote className="col-lg-6">
                                            <LeftVoteItem className="row">
                                                <LeftVoteTitle>Thông tin Bàn - Nhà hàng</LeftVoteTitle>
                                                <InforCustomer className="col-lg-12">
                                                    <InfoItem className="row">
                                                        <InfoTitle className="col-lg-4">Mã Bàn: </InfoTitle>
                                                        <InfoDetail className="col-lg-8">{tableBookingModalAddEmployee ? tableBookingModalAddEmployee.table_booking_id : null}</InfoDetail>
                                                    </InfoItem>
                                                    <InfoItem className="row">
                                                        <InfoTitle className="col-lg-4">Trạng thái: </InfoTitle>
                                                        <InfoDetail className="col-lg-8" style={{ fontWeight: "bold", color: "var(--color-primary)" }}>{tableBookingModalAddEmployee ? tableBookingModalAddEmployee.table_booking_state === 0 ? "Đang trống" : tableBookingModalAddEmployee.table_booking_state === 1 ? "Đã được khóa" : null : null}</InfoDetail>
                                                    </InfoItem>
                                                </InforCustomer>
                                                <LeftImage src={"https://i.ibb.co/8m4nCKN/pexels-chan-walrus-941861.jpg"} />
                                                <CartItem style={{ position: "absolute", bottom: "12px", left: "12px", width: "96%", borderRadius: "20px" }}>
                                                    <Circle />
                                                    <Course>
                                                        <Content>
                                                            <span style={{ width: "320px", fontWeight: "bold" }}> {tableBookingModalAddEmployee ? tableBookingModalAddEmployee.table_booking_name : null} </span>
                                                            <span style={{ fontWeight: "400", color: "var(--color-primary)", width: "300px", textAlign: "right", paddingRight: "30px" }}>{tableBookingModalAddEmployee ? tableBookingModalAddEmployee.floor_name : null}</span>
                                                        </Content>
                                                        <span style={{ fontWeight: "400" }}><span style={{ color: "var(--color-primary)" }}>{tableBookingModalAddEmployee ? tableBookingModalAddEmployee.table_type_name : null}</span></span>
                                                    </Course>
                                                </CartItem>
                                            </LeftVoteItem>
                                            <LeftVoteItem2 className="row">
                                                <LeftVoteTitle>Những Nhân viên phụ trách Bàn này</LeftVoteTitle>

                                                <DeviceList className="col-lg-12">
                                                    {
                                                        tableEmployeeListAddEmployee.length > 0
                                                            ?
                                                            tableEmployeeListAddEmployee.map((tableEmployee, key) => {
                                                                return (
                                                                    <DeviceItem className="row">
                                                                        <DeviceIconContainer className="col-lg-3">
                                                                            <DeviceIcon src={tableEmployee.employee_gender === "Nam" ? "https://firebasestorage.googleapis.com/v0/b/longpets-50c17.appspot.com/o/1667675091004employee%20(2).png?alt=media&token=9171617a-2e61-4539-ab8d-4a6ae5337394" : tableEmployee.employee_gender === "Nữ" ? "https://firebasestorage.googleapis.com/v0/b/longpets-50c17.appspot.com/o/1667675091006employee%20(1).png?alt=media&token=b0e97bfd-5180-4c1b-827c-23c1808a2222" : null} />
                                                                        </DeviceIconContainer>
                                                                        <div className="col-lg-9">
                                                                            <DeviceTitle className="row">
                                                                                <DeviceName>{'Nhân viên mã ' + tableEmployee.employee_id + ': ' + tableEmployee.employee_first_name + " " + tableEmployee.employee_last_name}</DeviceName>
                                                                            </DeviceTitle>
                                                                            <DeviceInfo className="row">
                                                                                <DeviceTime>Phụ trách Bàn từ: {tableEmployee.table_employee_add_date}</DeviceTime>
                                                                            </DeviceInfo>
                                                                        </div>
                                                                        <DeviceDetailContainer>
                                                                            <DeviceDetailImage src={tableEmployee.employee_image} />
                                                                        </DeviceDetailContainer>
                                                                        <DeleteService
                                                                            onClick={() => handleDeleteTableBookingEmployee(tableEmployee.table_employee_id)}
                                                                        >
                                                                            <ClearOutlined />
                                                                        </DeleteService>
                                                                    </DeviceItem>
                                                                )
                                                            }) : (
                                                                <EmptyItem>
                                                                    <EmptyItemSvg>
                                                                        <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="EmptyStatestyles__StyledSvg-sc-qsuc29-0 cHfQrS">
                                                                            <path d="M186 63V140H43V177H200V63H186Z" fill="#D6DADC"></path>
                                                                            <path d="M170.5 45H13.5V159H170.5V45Z" fill="white"></path>
                                                                            <path d="M29.5 26V45H170.5V140H186.5V26H29.5Z" fill="#1952B3"></path>
                                                                            <path d="M175 155V42H167H121.5V44H15H11V84H15V64H161V60H15V48H121.5V50H167V155H31V163H175V155Z" fill="#232729"></path>
                                                                            <path d="M28 52H24V56H28V52Z" fill="#232729"></path>
                                                                            <path d="M35 52H31V56H35V52Z" fill="#232729"></path>
                                                                            <path d="M42 52H38V56H42V52Z" fill="#232729"></path>
                                                                            <path d="M120 76H30V106H120V76Z" fill="#F3F4F6"></path>
                                                                            <path d="M153.5 76H126.5V142H153.5V76Z" fill="#F3F4F6"></path>
                                                                            <path d="M120 112H30V142H120V112Z" fill="#F3F4F6"></path>
                                                                            <path d="M44 120.77H26.23V103H17.77V120.77H0V129.23H17.77V147H26.23V129.23H44V120.77Z" fill="#FF5100"></path>
                                                                            <path d="M60.0711 146.314L62.1924 144.192L55.1213 137.121L53 139.243L60.0711 146.314Z" fill="#232729"></path>
                                                                            <path d="M53.0711 105.071L55.1924 107.192L62.2634 100.121L60.1421 98L53.0711 105.071Z" fill="#232729"></path>
                                                                            <path d="M70.1924 124.192V121.192H59.1924V124.192H70.1924Z" fill="#232729"></path>
                                                                        </svg>
                                                                    </EmptyItemSvg>
                                                                    <EmptyContent class="EmptyStatestyles__StyledTitle-sc-qsuc29-2 gAMClh">Hiện tại Bàn này chưa có Nhân viên nào!</EmptyContent>
                                                                </EmptyItem>
                                                            )
                                                    }
                                                </DeviceList>
                                            </LeftVoteItem2>
                                        </LeftVote>

                                        <RightVote className="col-lg-6">
                                            <RightVoteItem className="row">
                                                <RightVoteTitle className="col-lg-12">Những Nhân viên khác của Nhà hàng</RightVoteTitle>

                                                <RightVoteTitle style={{ fontSize: "1rem", padding: "0" }} className="col-lg-12"><span style={{ color: "var(--color-primary)", marginLeft: "5px" }}>Hãy chọn Nhân viên bạn muốn thêm vào Bàn này!</span></RightVoteTitle>
                                                <Box sx={{ minWidth: 120, width: "80%", margin: "10px auto" }}>
                                                    <FormControl fullWidth>
                                                        <InputLabel id="demo-simple-select-label"></InputLabel>
                                                        <Select
                                                            labelId="demo-simple-select-label"
                                                            id="demo-simple-select"
                                                            value={positionIdModalAddEmployee}
                                                            label="Age"
                                                            sx={{
                                                                '& legend': { display: 'none' },
                                                                '& fieldset': { top: 0 }
                                                            }}
                                                            onChange={(e) => setPositionIdModalAddEmployee(parseInt(e.target.value))}
                                                        >
                                                            {
                                                                positionList.length > 0
                                                                    ?
                                                                    positionList.map((position, key) => {
                                                                        return (
                                                                            <MenuItem value={position.position_id}>{position.position_name}</MenuItem>
                                                                        )
                                                                    }) : null
                                                            }
                                                        </Select>
                                                    </FormControl>
                                                </Box>

                                                <Surcharge className="col-lg-12" style={{ height: "355px", maxHeight: "355px" }}>
                                                    {
                                                        employeeListAddEmployee.length > 0
                                                            ?
                                                            employeeListAddEmployee.map((employee, key) => {
                                                                return (
                                                                    <LabelCheckbox>
                                                                        <ServiceItem className="row">
                                                                            <div className="col-lg-2">
                                                                                <Checkbox checked={!employeeChooseList.includes(employee.employee_id) ? false : true} value={employee.employee_id} onChange={(e) => handleCheckEmployee(e)} />
                                                                            </div>
                                                                            <ServiceIconContainer className="col-lg-3">
                                                                                <ServiceIcon style={{ width: "40px", height: "40px", objectFix: "cover" }} src={employee.employee_image} />
                                                                            </ServiceIconContainer>
                                                                            <div className="col-lg-7">
                                                                                <ServiceTitle className="row">
                                                                                    <ServiceName>{employee.employee_first_name + " " + employee.employee_last_name}</ServiceName>
                                                                                </ServiceTitle>
                                                                                <ServiceInfo className="row">
                                                                                    <ServiceTime>{employee.employee_email + " - " + employee.employee_phone_number}</ServiceTime>
                                                                                </ServiceInfo>
                                                                            </div>
                                                                        </ServiceItem>
                                                                    </LabelCheckbox>
                                                                )
                                                            }) : (
                                                                <EmptyItem>
                                                                    <EmptyItemSvg>
                                                                        <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="EmptyStatestyles__StyledSvg-sc-qsuc29-0 cHfQrS">
                                                                            <path d="M186 63V140H43V177H200V63H186Z" fill="#D6DADC"></path>
                                                                            <path d="M170.5 45H13.5V159H170.5V45Z" fill="white"></path>
                                                                            <path d="M29.5 26V45H170.5V140H186.5V26H29.5Z" fill="#1952B3"></path>
                                                                            <path d="M175 155V42H167H121.5V44H15H11V84H15V64H161V60H15V48H121.5V50H167V155H31V163H175V155Z" fill="#232729"></path>
                                                                            <path d="M28 52H24V56H28V52Z" fill="#232729"></path>
                                                                            <path d="M35 52H31V56H35V52Z" fill="#232729"></path>
                                                                            <path d="M42 52H38V56H42V52Z" fill="#232729"></path>
                                                                            <path d="M120 76H30V106H120V76Z" fill="#F3F4F6"></path>
                                                                            <path d="M153.5 76H126.5V142H153.5V76Z" fill="#F3F4F6"></path>
                                                                            <path d="M120 112H30V142H120V112Z" fill="#F3F4F6"></path>
                                                                            <path d="M44 120.77H26.23V103H17.77V120.77H0V129.23H17.77V147H26.23V129.23H44V120.77Z" fill="#FF5100"></path>
                                                                            <path d="M60.0711 146.314L62.1924 144.192L55.1213 137.121L53 139.243L60.0711 146.314Z" fill="#232729"></path>
                                                                            <path d="M53.0711 105.071L55.1924 107.192L62.2634 100.121L60.1421 98L53.0711 105.071Z" fill="#232729"></path>
                                                                            <path d="M70.1924 124.192V121.192H59.1924V124.192H70.1924Z" fill="#232729"></path>
                                                                        </svg>
                                                                    </EmptyItemSvg>
                                                                    <EmptyContent class="EmptyStatestyles__StyledTitle-sc-qsuc29-2 gAMClh">Không có Nhân viên khác hoặc tất cả Nhân viên của Chức vụ này đã được thêm vào Bàn!</EmptyContent>
                                                                </EmptyItem>
                                                            )
                                                    }
                                                </Surcharge>
                                                <FormChucNang style={{ marginTop: "20px" }}>
                                                    <SignInBtn
                                                        onClick={(e) => handleCreateTableBookingEmployee(e, employeeChooseList, tableBookingIdModalAddEmployee)}
                                                    >Thêm Nhân viên</SignInBtn>
                                                    <SignUpBtn
                                                        onClick={(e) => handleCancleCreateTableBookingEmployee(e, employeeChooseList)}
                                                    >Hủy chọn</SignUpBtn>
                                                </FormChucNang>
                                            </RightVoteItem>
                                        </RightVote>
                                    </div>
                                </div>
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
    };
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