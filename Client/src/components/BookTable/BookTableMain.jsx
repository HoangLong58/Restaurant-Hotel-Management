import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
// Date picker
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import moment from 'moment';
// Time picker
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { AccessAlarmsOutlined, ArrowRightAltOutlined, CheckCircleRounded, ReplayOutlined, RestaurantMenuOutlined } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../img/logos/logo.png';
import Toast from '../Toast';

// SERVICES
import * as TableBookingOrderService from "../../service/TableBookingOrderService";
import * as TableBookingService from "../../service/TableBookingService";
import * as TableTypeService from "../../service/TableTypeService";

const Box2 = styled.div`
width: 100%;
padding: 10px 40px;
background-color: #f8f9fa;
margin-top: 22px;
`

const InfomationForm = styled.div`
    color: var(--color-dark);
`

const ModalChiTietItem = styled.div`
margin: 2px 0px;
display: flex;
flex-direction: column;
`

const FormSpan = styled.span`
font-size: 1.1rem;
font-weight: 700;
color: var(--color-dark-light);
margin-bottom: 3px;
`
const FormInput = styled.input`
background-color: var(--color-white);
color: var(--color-dark);
width: auto;
padding: 8px 20px;
margin: 5px 0;
display: inline-block;
outline: 0;
border: 1px solid #ccc;
border-radius: 4px;
box-sizing: border-box;
&:focus {
    border: 1px solid var(--color-success);
    box-shadow: var(--color-success) 0px 1px 4px, var(--color-success) 0px 0px 0px 3px;
}
`

const FormTextArea = styled.textarea`
background-color: var(--color-white);
color: var(--color-dark);
width: auto;
padding: 8px 20px;
margin: 5px 0;
display: inline-block;
outline: 0;
border: 1px solid #ccc;
border-radius: 4px;
box-sizing: border-box;
&:focus {
    border: 1px solid var(--color-success);
    box-shadow: var(--color-success) 0px 1px 4px, var(--color-success) 0px 0px 0px 3px;
}
`

// Button
const Button = styled.div``

const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
`

const BookButtonContainer = styled.div`
    justify-content: center;
    position: relative;
    float: right;
    margin: 10px 22px 22px 0;
    display: flex;
    &::after {
        content: "";
        border: 2px solid black;
        position: absolute;
        top: 5px;
        right: -5px;
        background-color: transperent;
        width: 150px;
        height: 100%;
        z-index: 5;
    }
`

const BookButton = styled.button`
    padding: 10px;
    width: 150px;
    border: 2px solid black;
    background-color: black;
    color: white;
    cursor: pointer;
    font-weight: 500;
    z-index: 10;
    &:hover {
        background-color: var(--color-primary);
    }
    &:active {
        background-color: #333;
        transform: translate(5px, 5px);
        transition: transform 0.25s;
    }
`

const InputDateRangeFormItem = styled.div``
const BookingNumberNiceSelect = styled.div``
const BookingNumberNiceSelectSpan = styled.span``
const BookingNumberNiceSelectUl = styled.ul``
const BookingNumberNiceSelectLi = styled.li``

const ButtonClick = styled.button`
    min-width: 100px;
    border: none;
    text-decoration: none;
    padding: 9px;
    display: block;
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    font-size: 13px;
    text-transform: uppercase;
    line-height: 20px;
    letter-spacing: 2px;
    color: #fff;
    transition: all 0.3s ease-out;
    background-color: #41f1b6;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    &:hover {
        background-color: black;
    }
`

const RightColMd6 = styled.div``

// Modal
const ModalBackground = styled.div`
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 99000;

    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    animation: fadeIn linear 0.1s;
`

const ModalWrapperMessage = styled.div`
    width: 750px;
    height: auto;
    box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
    background: #F8F9FA;
    color: var(--color-dark);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    border: 2px solid black;

    position: relative;
    z-index: 99999;
    border-radius: 10px;
    --growth-from: 0.7;
    --growth-to: 1;
    animation: growth linear 0.1s;
`

const ModalH2 = styled.h2`
  font-size: 1.8rem;
  margin-top: 20px;
  color: var(--color-primary);
  font-weight: 700;
  letter-spacing: 2px;
`
const ModalSmall = styled.small`
  margin-top: 15px;
  font-size: 1.2rem;
`
const ModalButtonContainer = styled.div`
  justify-content: center;
  position: relative;
  margin: 22px 0;
  display: flex;
  &::after {
      content: "";
      border: 2px solid black;
      position: absolute;
      top: 5px;
      left: 5px;
      background-color: transperent;
      width: 300px;
      height: 100%;
      z-index: 5;
  }
`

const ModalButton = styled.button`
  padding: 10px;
  width: 300px;
  border: 2px solid black;
  background-color: black;
  color: white;
  cursor: pointer;
  font-weight: 500;
  z-index: 10;
  &:hover {
      background-color: var(--color-primary);
  }
  &:active {
      background-color: #333;
      transform: translate(5px, 5px);
      transition: transform 0.25s;
  }
`

const MessageImage = styled.img`
  transform: scale(0.8);
`

const MessageImageContainer = styled.div`
  border-top: 1px solid black;
  border-left: 2px solid black;
  border-right: 2px solid black;
  width: 750px;
  height: auto;
  background-color: #383838;
  display: flex;
  justify-content: center;
  border-top-left-radius: 7px;
  border-top-right-radius: 7px;
`

const H2 = styled.h2`
font-size: 1.8rem;
margin-top: 20px;
`
const Small = styled.small`
margin-top: 15px;
font-size: 1.3rem;
`
const SuccessButtonContainer = styled.div`
    justify-content: center;
    position: relative;
    margin: 22px 0;
    display: flex;
    &::after {
        content: "";
        border: 2px solid black;
        position: absolute;
        top: 5px;
        left: 5px;
        background-color: transperent;
        width: 300px;
        height: 100%;
        z-index: 5;
    }
`

const SuccessButton = styled.button`
    padding: 10px;
    width: 300px;
    border: 2px solid black;
    background-color: black;
    color: white;
    cursor: pointer;
    font-weight: 500;
    z-index: 10;
    &:hover {
        background-color: var(--color-primary);
    }
    &:active {
        background-color: #333;
        transform: translate(5px, 5px);
        transition: transform 0.25s;
    }
`
const ModalContent = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    line-height: 1.8;
    color: #141414;
    width: 100%;
`

// Right
const RightBackground = styled.div`
  padding: 30px;
`

const InfomationTitle = styled.div`
    font-size: 1.2rem;
    color: var(--color-dark);
`

// Right filter
const TitleSolid = styled.div`
  position: relative;
  color: var(--color-dark);
  margin: 30px 0px 40px 0px;
  display: flex;
  align-items: center;
  &::after {
    content: "";
    display: block;
    position: absolute;
    bottom: -20px;
    left: 0;
    width: 100%;
    border-top: 2px solid var(--color-dark);
  }
`
const TitleDashed = styled.div`
  position: relative;
  color: var(--color-dark);
  margin: 30px 0px 40px 0px;
  display: flex;
  align-items: center;
  &::after {
    content: "";
    display: block;
    position: absolute;
    bottom: -20px;
    left: 0;
    width: 100%;
    border-top: 2px dashed var(--color-dark);
  }
`
const BookingInfo = styled.div`
position: relative;
color: var(--color-dark);

&::after {
    content: "";
    display: block;
    position: absolute;
    bottom: -20px;
    left: 0;
    width: 100%;
    border-top: 2px dashed var(--color-dark);
  }
`
const BookingInfoTitle = styled.div`
font-weight: bold;
`
const BookingInfoDetail = styled.div``
const BookingInfoDetailRow = styled.div`
padding: 10px 0px 10px 0px;
`
const BookingInfoDetailRowMd5 = styled.div`
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
`
const BookingInfoDetailRowMd2 = styled.div`
display: flex;
justify-content: center;
align-items: center;
`

const DayTitle = styled.div`
font-size: 0.8rem;
font-weight: bold;
`
const DayDetail = styled.div`
font-size: 1.1rem;
font-weight: bold;
`

const BookingNumber = styled.div``
const BookingNumberRow = styled.div`
padding: 10px 0px 10px 0px;
display: flex;
justify-content: center;
align-items: center;
`
const BookingNumberRowMd5 = styled.div`
display: flex;
justify-content: center;
align-items: center;
background-color: white;
padding: 10px;
border-radius: 20px;
font-weight: 400;
`

// Table Info
const TableInformation = styled.div`
margin-top: 40px;
position: relative;
color: var(--color-dark);

&::after {
    content: "";
    display: block;
    position: absolute;
    bottom: -20px;
    left: 0;
    width: 100%;
    border-top: 2px dashed var(--color-dark);
  }
`

const TableInformationTitle = styled.div`
font-weight: bold;
padding-bottom: 8px;
`
const TableInformationDetail = styled.div``
const TableInformationRow = styled.div``
const TableDetailTitle = styled.div`
font-size: 0.9rem;
font-weight: 400;
`
const TableDetailPrice = styled.div`
font-size: 1.1rem;
font-weight: bold;
color: var(--color-primary);
display: flex;
justify-content: flex-end;
align-items: center;
`

const PictureNoResultFound = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 10%;
`;

const Img = styled.img`
    width: 500px;
    max-height: 600px;
    object-fit: cover;
`;

const H1NoResultFound = styled.h1`
    letter-spacing: 2px;
    font-size: 1.4rem;
    color: var(--color-primary);
    font-weight: bold;
`;

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

const BookTableMain = () => {
    const navigate = useNavigate();
    const customer = useSelector((state) => state.customer.currentCustomer);
    // STATE
    const [isSelectQuantity, setIsSelectQuantity] = useState(false);
    const [isAvailableTable, setIsAvailableTable] = useState(false);
    const [isBookSuccess, setIsBookSuccess] = useState(false);
    const [noResultFound, setNoResultFound] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [dateBooking, setDateBooking] = useState();
    const [timeBooking, setTimeBooking] = useState();
    const [tableTypeId, setTableTypeId] = useState();
    const [quantityBooking, setQuantityBooking] = useState();

    const [customerId, setCustomerId] = useState(customer.customer_id);
    const [firstName, setFirstName] = useState(customer.customer_first_name);
    const [lastName, setLastName] = useState(customer.customer_last_name);
    const [email, setEmail] = useState(customer.customer_email);
    const [phoneNumber, setPhoneNumber] = useState(customer.customer_phone_number);
    const [note, setNote] = useState("");

    const [tableTypeList, setTableTypeList] = useState([]);
    const [tableBooking, setTableBooking] = useState();

    useEffect(() => {
        const getTableTypes = async () => {
            try {
                const tableTypeRes = await TableTypeService.getTableTypes();
                setTableTypeList(tableTypeRes.data.data);
            } catch (err) {
                console.log("Lỗi getTableTypes: ", err);
            }
        };
        getTableTypes();
    }, []);

    // HANDLE
    const handleChangeDateBooking = (newValue) => {
        setDateBooking(newValue);
        console.log(moment(newValue).format("DD/MM/yyyy"));
    };

    // TO DO:
    const handleCheckAvailableTable = () => {
        const findTableBooking = async () => {
            try {
                const tableBookingRes = await TableBookingService.findTableBookings(
                    {
                        dateBooking: dateBooking,
                        timeBooking: timeBooking,
                        quantityBooking: quantityBooking,
                        tableTypeId: tableTypeId
                    }
                );
                if (tableBookingRes.data.data.length > 0) {
                    setNoResultFound(false);
                    setTableBooking(tableBookingRes.data.data[0]);
                    // Toast
                    const dataToast = { message: "Đã tìm được bàn trống!", type: "success" };
                    showToastFromOut(dataToast);
                    setIsAvailableTable(true);
                    // Block the table
                    try {
                        const updateTableBookingState = async () => {
                            console.log("tableBookingRes.data.data[0]: ", tableBookingRes.data.data[0].table_booking_id);
                            const updateTableBookingStateRes = await TableBookingService.updateTableBookingState(tableBookingRes.data.data[0].table_booking_id, 1);
                            if (updateTableBookingStateRes) {
                                // Toast
                                const dataToast = { message: "Bàn đã được giữ trong 5 phút", type: "success" };
                                showToastFromOut(dataToast);
                                return;
                            } else {
                                // Toast
                                const dataToast = { message: updateTableBookingStateRes.data.message, type: "warning" };
                                showToastFromOut(dataToast);
                                return;
                            }
                        }
                        updateTableBookingState();
                    } catch (err) {
                        // Toast
                        const dataToast = { message: err.response.data.message, type: "danger" };
                        showToastFromOut(dataToast);
                        return;
                    }
                    setMinutes(1);
                    setSeconds(59);
                } else {
                    setNoResultFound(true);
                    // Toast
                    const dataToast = { message: "Không tìm thấy bàn trống phù hợp!", type: "danger" };
                    showToastFromOut(dataToast);
                }
            } catch (err) {
                // Toast
                const dataToast = { message: err.response.data.message, type: "danger" };
                showToastFromOut(dataToast);
            }
        }
        handleLoading();
        findTableBooking();
    }

    // Update table booking to state 0 when UNMOUT: BACK TO PREVIOUS PAGE
    useEffect(() => {
        return () => {
            if (tableBooking) {
                // Update table booking to state 0
                try {
                    const updateTableBookingState = async () => {
                        const updateTableBookingStateRes = await TableBookingService.updateTableBookingState(tableBooking.table_booking_id, 0);
                        if (!updateTableBookingStateRes) {
                            // Toast
                            const dataToast = { message: updateTableBookingStateRes.data.message, type: "warning" };
                            showToastFromOut(dataToast);
                            return;
                        }
                    }
                    updateTableBookingState();
                } catch (err) {
                    // Toast
                    const dataToast = { message: err.response.data.message, type: "danger" };
                    showToastFromOut(dataToast);
                    return;
                }
            }
        }
    }, [tableBooking]);

    // --Handle time
    const [minutes, setMinutes] = useState();
    const [seconds, setSeconds] = useState();
    useEffect(() => {
        let myInterval = setInterval(() => {
            if (seconds > 0) {
                setSeconds(seconds - 1);
            }
            if (seconds === 0) {
                if (minutes === 0) {
                    clearInterval(myInterval)
                } else {
                    setMinutes(minutes - 1);
                    setSeconds(59);
                }
            }
        }, 1000)
        return () => {
            clearInterval(myInterval);
        };
    });

    useEffect(() => {
        if (minutes === 0 && seconds === 0) {
            try {
                const updateTableBookingState = async () => {
                    const updateTableBookingStateRes = await TableBookingService.updateTableBookingState(tableBooking.table_booking_id, 0);
                    if (updateTableBookingStateRes) {
                        // Toast
                        const dataToast = { message: "Thời gian giữ Bàn đã hết!", type: "success" };
                        showToastFromOut(dataToast);
                        return;
                    } else {
                        // Toast
                        const dataToast = { message: updateTableBookingStateRes.data.message, type: "warning" };
                        showToastFromOut(dataToast);
                        return;
                    }
                }
                updateTableBookingState();
            } catch (err) {
                // Toast
                const dataToast = { message: err.response.data.message, type: "danger" };
                showToastFromOut(dataToast);
                return;
            }
        }
    }, [minutes, seconds]);

    const handleUpdateTableBookingStateTo0 = () => {
        try {
            const updateTableBookingState = async () => {
                const updateTableBookingStateRes = await TableBookingService.updateTableBookingState(tableBooking.table_booking_id, 0);
                if (!updateTableBookingStateRes) {
                    // Toast
                    const dataToast = { message: updateTableBookingStateRes.data.message, type: "warning" };
                    showToastFromOut(dataToast);
                    return;
                }
            }
            updateTableBookingState();
        } catch (err) {
            // Toast
            const dataToast = { message: err.response.data.message, type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
    };

    // Update state to 0 when close tab booking
    useEffect(() => {
        window.addEventListener('beforeunload', handleUpdateTableBookingStateTo0);
        window.addEventListener('unload', handleUpdateTableBookingStateTo0);
        return () => {
            window.removeEventListener('beforeunload', handleUpdateTableBookingStateTo0);
            window.removeEventListener('unload', handleUpdateTableBookingStateTo0);
        }
    });

    // Toast
    const [dataToast, setDataToast] = useState({ message: "alo alo", type: "success" });
    const toastRef = useRef(null);

    const showToastFromOut = (dataShow) => {
        setDataToast(dataShow);
        toastRef.current.show();
    };

    // Handle book table
    const handleBookTable = () => {
        const createTableBookingOrder = async () => {
            try {
                const createTableBookingOrderRes = await TableBookingOrderService.createTableBookingOrder({
                    tableBookingOrderQuantity: quantityBooking,
                    tableBookingOrderTotal: 0,
                    tableBookingOrderNote: note,
                    customerId: customerId,
                    tableBookingId: tableBooking ? tableBooking.table_booking_id : null,

                    dateBooking: moment(dateBooking).format("YYYY-MM-DD"),
                    timeBooking: timeBooking ? timeBooking.$H + ":" + timeBooking.$m : null
                });
                if (createTableBookingOrderRes) {
                    // Update table state => 0 when create success!
                    try {
                        const updateTableBookingState = async () => {
                            const updateTableBookingStateRes = await TableBookingService.updateTableBookingState(tableBooking.table_booking_id, 0);
                            if (!updateTableBookingStateRes) {
                                // Toast
                                const dataToast = { message: updateTableBookingStateRes.data.message, type: "warning" };
                                showToastFromOut(dataToast);
                                return;
                            }
                        }
                        updateTableBookingState();
                    } catch (err) {
                        // Toast
                        const dataToast = { message: err.response.data.message, type: "danger" };
                        showToastFromOut(dataToast);
                        return;
                    }
                    // Success
                    setIsBookSuccess(true);
                    handleLoading();
                    // Toast
                    const dataToast = { message: createTableBookingOrderRes.data.message, type: "success" };
                    showToastFromOut(dataToast);
                    return;
                } else {
                    // Toast
                    const dataToast = { message: createTableBookingOrderRes.data.message, type: "warning" };
                    showToastFromOut(dataToast);
                    return;
                }
            } catch (err) {
                // Toast
                const dataToast = { message: err.response.data.message, type: "warning" };
                showToastFromOut(dataToast);
                return;
            }
        };
        createTableBookingOrder()
    };

    // Change table booking
    const handleCancelBookTable = () => {
        handleUpdateTableBookingStateTo0();
        navigate("/restaurant");
    };

    // Fake loading when fetch data
    const handleLoading = () => {
        // Scroll lên kết quả mới
        window.scrollTo({
            top: 300,
            behavior: "smooth"
        });
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 1200);
    };

    return (
        <>
            <div class="section padding-top-bottom z-bigger" style={{ paddingTop: "15px" }}>
                <div class="container">
                    {
                        isBookSuccess ? (
                            <div className="row">
                                <div className="col-lg-12">
                                    <ModalContent>
                                        <CheckCircleRounded style={{ fontSize: "6rem", color: "var(--color-success)", margin: "auto" }} />
                                        <span style={{ color: "var(--color-success)", fontSize: "1.5rem", fontWeight: "700", letterSpacing: "2px" }}>ĐẶT BÀN THÀNH CÔNG!</span>
                                        <H2>Cảm ơn bạn đã tin tưởng và lựa chọn <span style={{ color: "var(--color-primary)" }}>Hoàng Long Hotel &amp; Restaurant</span></H2>
                                        <Small className="text-muted">Bàn sẽ được chuẩn bị chỉnh chu để phục vụ quý khách!</Small>
                                        <Link to="/restaurant" style={{ textDecoration: "none" }}>
                                            <SuccessButtonContainer>
                                                <SuccessButton><ArrowRightAltOutlined />   Quay về trang chủ sau 4 giây ...</SuccessButton>
                                            </SuccessButtonContainer>
                                        </Link>
                                    </ModalContent>
                                </div>
                            </div>
                        ) : (
                            <div className="row">
                                <div className="col-lg-8">
                                    {
                                        isLoading ? (
                                            <div className="row">
                                                <div
                                                    class="spinner-border"
                                                    style={{ color: '#41F1B6', position: 'absolute', left: '50%', top: "25%", scale: "1.5" }}
                                                    role="status"
                                                >
                                                    <span class="visually-hidden"></span>
                                                </div>
                                            </div>
                                        ) : (
                                            <Box2>
                                                <div className="col-lg-12">
                                                    {
                                                        noResultFound ? (
                                                            <PictureNoResultFound id="No_Result_Found_Picture">
                                                                <Img
                                                                    src="https://img.freepik.com/premium-vector/file-found-illustration-with-confused-people-holding-big-magnifier-search-no-result_258153-336.jpg?w=2000"
                                                                    alt="Not Found Result"
                                                                />
                                                                <H1NoResultFound>No result found</H1NoResultFound>
                                                            </PictureNoResultFound>
                                                        )
                                                            : (
                                                                isAvailableTable ? (
                                                                    <>
                                                                        <div className="row">
                                                                            <InfomationTitle>
                                                                                <p style={{ fontWeight: "bold", margin: "10px 0 0 0" }}>Chi tiết Đặt bàn</p>
                                                                                <p style={{ fontSize: "1rem" }}>Hoàn tất Đặt bàn bằng việc cung cấp những thông tin sau</p>
                                                                            </InfomationTitle>
                                                                        </div>
                                                                        <div className="row">
                                                                            <InfomationForm className="col-lg-12">
                                                                                <div className="row">
                                                                                    <ModalChiTietItem className="col-lg-6">
                                                                                        <FormSpan>Họ tên:</FormSpan>
                                                                                        <FormInput type="text" value={firstName + " " + lastName} disabled />
                                                                                    </ModalChiTietItem>
                                                                                    <ModalChiTietItem className="col-lg-6">
                                                                                        <FormSpan>Số điện thoại:</FormSpan>
                                                                                        <FormInput type="text" value={phoneNumber} disabled />
                                                                                    </ModalChiTietItem>
                                                                                </div>
                                                                                <div className="row">

                                                                                    <ModalChiTietItem className="col-lg-12">
                                                                                        <FormSpan>Địa chỉ email:</FormSpan>
                                                                                        <FormInput type="email" value={email} disabled />
                                                                                    </ModalChiTietItem>
                                                                                </div>
                                                                                <div className="row">
                                                                                    <ModalChiTietItem className="col-lg-12">
                                                                                        <FormSpan>Ghi chú:</FormSpan>
                                                                                        <FormTextArea
                                                                                            rows="3"
                                                                                            placeholder="Ghi chú về vị trí bàn này"
                                                                                            value={note}
                                                                                            onChange={(e) => setNote(e.target.value)} />
                                                                                    </ModalChiTietItem>
                                                                                </div>
                                                                            </InfomationForm>

                                                                        </div>
                                                                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                                                            <BookButtonContainer>
                                                                                <BookButton disabled={minutes === 0 && seconds === 0 ? true : false}
                                                                                    onClick={() => handleBookTable()}
                                                                                >Đặt bàn</BookButton>
                                                                            </BookButtonContainer>


                                                                            <BookButtonContainer>
                                                                                <BookButton
                                                                                    onClick={() => handleCancelBookTable()}
                                                                                >Hủy đặt bàn</BookButton>
                                                                            </BookButtonContainer>

                                                                        </div>
                                                                    </>
                                                                ) : (
                                                                    <EmptyItem>
                                                                        <EmptyItemSvg>
                                                                            <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="EmptyStatestyles__StyledSvg-sc-qsuc29-0 cHfQrS">
                                                                                <path d="M72.94 132.45H25.97V54.5H0V143.5H79.13C76.58 140.15 74.49 136.43 72.94 132.45Z" fill="#D6DADC"></path>
                                                                                <path d="M141 30.5V41H25.86V119.5H13V30.5H141Z" fill="#1952B3"></path>
                                                                                <path d="M150 133H26V41H150V73.85V88.6V133Z" fill="white"></path>
                                                                                <path d="M117.5 152C142.629 152 163 131.629 163 106.5C163 81.3711 142.629 61 117.5 61C92.371 61 72 81.3711 72 106.5C72 131.629 92.371 152 117.5 152Z" fill="white"></path>
                                                                                <path d="M97.75 65.5H36.5V90.5H74.9C79.03 79.52 87.27 70.56 97.75 65.5Z" fill="#F3F4F6"></path>
                                                                                <path d="M72 106.5C72 103.06 72.39 99.72 73.12 96.5H36.5V121.5H74.54C72.9 116.8 72 111.76 72 106.5Z" fill="#F3F4F6"></path>
                                                                                <path d="M39.96 47.93H36.85V51.04H39.96V47.93Z" fill="#232729"></path>
                                                                                <path d="M45.4 47.93H42.29V51.04H45.4V47.93Z" fill="#232729"></path>
                                                                                <path d="M50.85 47.93H47.74V51.04H50.85V47.93Z" fill="#232729"></path>
                                                                                <path d="M157.59 138.1L155.4 140.29L151.7 136.59C158.77 128.56 163.07 118.05 163.07 106.54C163.07 96.64 159.89 87.48 154.5 80V39H153.5H146.5H106.5V41H25.5V133H80.5C88.77 144.54 102.28 152.08 117.53 152.08C128.76 152.08 139.05 147.98 147 141.22L150.74 144.96L148.55 147.15L183.74 182.34L192.79 173.29L157.59 138.1ZM148.74 73.43C148.72 73.41 148.69 73.38 148.67 73.36C148.7 73.38 148.72 73.41 148.74 73.43ZM29.5 129V58H139.5V54H29.5V45H106.5V47H146.5V71.43C138.62 64.92 128.52 61 117.53 61C92.42 61 71.99 81.43 71.99 106.54C71.99 114.7 74.16 122.37 77.94 129H29.5ZM117.53 145.41C96.1 145.41 78.66 127.97 78.66 106.54C78.66 85.11 96.1 67.67 117.53 67.67C138.96 67.67 156.4 85.1 156.4 106.54C156.4 127.98 138.96 145.41 117.53 145.41Z" fill="#232729"></path>
                                                                                <path d="M183.73 182.33L148.54 147.14L150.73 144.95L146.99 141.21C139.04 147.98 128.75 152.07 117.52 152.07C92.41 152.07 71.98 131.64 71.98 106.53C71.98 104.73 72.1 102.96 72.3 101.22C70.71 105.85 69.83 110.81 69.83 115.97C69.83 141.08 90.26 161.51 115.37 161.51C126.6 161.51 136.89 157.41 144.84 150.65L148.58 154.39L146.39 156.58L181.58 191.77L190.63 182.72L186.98 179.07L183.73 182.33Z" fill="#D6DADC"></path>
                                                                                <path d="M127.4 88.15C125.04 86.17 121.71 85.18 117.42 85.18C113.11 85.18 109.76 86.25 107.37 88.4C104.98 90.55 103.77 93.55 103.73 97.4H113.49C113.53 95.96 113.9 94.81 114.62 93.96C115.33 93.11 116.27 92.69 117.42 92.69C119.92 92.69 121.18 94.14 121.18 97.05C121.18 98.24 120.81 99.34 120.07 100.33C119.33 101.32 118.25 102.41 116.82 103.61C115.4 104.8 114.37 106.21 113.73 107.84C113.1 109.47 112.78 111.69 112.78 114.5H121.04C121.08 113.04 121.28 111.83 121.65 110.88C122.01 109.93 122.67 109 123.61 108.09L126.93 105C128.34 103.63 129.36 102.29 129.99 100.98C130.63 99.67 130.94 98.22 130.94 96.62C130.93 92.96 129.76 90.14 127.4 88.15Z" fill="#FF5200"></path>
                                                                                <path d="M117 120.12C115.46 120.12 114.17 120.58 113.14 121.49C112.11 122.4 111.59 123.57 111.59 125C111.59 126.43 112.11 127.6 113.14 128.51C114.17 129.43 115.46 129.88 117 129.88C118.54 129.88 119.83 129.42 120.86 128.51C121.89 127.6 122.41 126.42 122.41 125C122.41 123.57 121.89 122.4 120.86 121.49C119.83 120.57 118.54 120.12 117 120.12Z" fill="#FF5200"></path>
                                                                                <path d="M141.314 19.1213L139.192 17L132.121 24.0711L134.243 26.1924L141.314 19.1213Z" fill="#232729"></path>
                                                                                <path d="M100.071 26.1213L102.192 24L95.1213 16.9289L93 19.0503L100.071 26.1213Z" fill="#232729"></path>
                                                                                <path d="M119.192 9H116.192V20H119.192V9Z" fill="#232729"></path>
                                                                                <path d="M93 180.071L95.1213 182.192L102.192 175.121L100.071 173L93 180.071Z" fill="#232729"></path>
                                                                                <path d="M134.243 173.071L132.121 175.192L139.192 182.263L141.314 180.142L134.243 173.071Z" fill="#232729"></path>
                                                                                <path d="M115.121 190.192L118.121 190.192L118.121 179.192L115.121 179.192L115.121 190.192Z" fill="#232729"></path>
                                                                            </svg>
                                                                        </EmptyItemSvg>
                                                                        <EmptyContent class="EmptyStatestyles__StyledTitle-sc-qsuc29-2 gAMClh">Hãy tìm bàn trống phù hợp!</EmptyContent>
                                                                    </EmptyItem>
                                                                )
                                                            )
                                                    }
                                                </div>
                                            </Box2>
                                        )
                                    }
                                </div>
                                <div className="col-lg-4 order-first order-lg-last mt-4">
                                    {
                                        isAvailableTable ? (
                                            <RightBackground className="section background-dark p-4" style={{ backgroundColor: "#f5f5f5" }}>

                                                <TitleSolid className="row">
                                                    <RightColMd6 className='col-md-8' style={{ fontWeight: "600", padding: "0" }}>Thông tin đặt bàn</RightColMd6>
                                                </TitleSolid>
                                                <TitleDashed className="row">
                                                    <RightColMd6 className='col-md-8' style={{ fontWeight: "600", padding: "0" }}>Thời gian giữ bàn:</RightColMd6>
                                                    <RightColMd6 className='col-md-4' style={{ fontWeight: "600", fontSize: "1.3rem", display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                        <AccessAlarmsOutlined style={{ marginRight: "3px" }} />
                                                        {minutes}:{seconds < 10 ? '0' + seconds : seconds}
                                                    </RightColMd6>
                                                </TitleDashed>

                                                <BookingInfo className="row">
                                                    <BookingInfoTitle className="col-md-12">Hoàng Long Hotel &amp; Restaurant</BookingInfoTitle>
                                                    <BookingInfoDetail className="col-md-12">
                                                        <BookingInfoDetailRow className="row">
                                                            <BookingInfoDetailRowMd5 className="col-md-5">
                                                                <DayTitle>Ngày đặt bàn</DayTitle>
                                                                <DayDetail>{moment(dateBooking).format("DD/MM/YYYY")}</DayDetail>
                                                            </BookingInfoDetailRowMd5>
                                                            <BookingInfoDetailRowMd2 className="col-md-2">
                                                                <RestaurantMenuOutlined style={{ color: "var(--color-primary)" }} />
                                                            </BookingInfoDetailRowMd2>
                                                            <BookingInfoDetailRowMd5 className="col-md-5">
                                                                <DayTitle>Thời gian đến</DayTitle>
                                                                <DayDetail>{moment(timeBooking.$H + ":" + timeBooking.$m, "HH:mm").format("hh:mm A")}</DayDetail>
                                                            </BookingInfoDetailRowMd5>
                                                        </BookingInfoDetailRow>
                                                    </BookingInfoDetail>

                                                    <BookingNumber className="col-md-12">
                                                        <BookingNumberRow className="row">
                                                            <BookingNumberRowMd5 className="col-md-6">Số lượng khách: <b style={{ color: "var(--color-primary)", marginLeft: "5px" }}> {quantityBooking === 5 ? "4+" : quantityBooking}</b></BookingNumberRowMd5>
                                                        </BookingNumberRow>
                                                    </BookingNumber>
                                                </BookingInfo>

                                                <TableInformation className="row">
                                                    <TableInformationTitle className="col-md-12">Thông tin bàn</TableInformationTitle>
                                                    <TableInformationDetail className="col-md-12">
                                                        <TableInformationRow className="row">
                                                            <TableDetailTitle className="col-md-6">Số bàn:</TableDetailTitle>
                                                            <TableDetailPrice className="col-md-6">{tableBooking.table_booking_name}</TableDetailPrice>
                                                        </TableInformationRow>
                                                        <TableInformationRow className="row">
                                                            <TableDetailTitle className="col-md-6">Vị trí:</TableDetailTitle>
                                                            <TableDetailPrice className="col-md-6">{tableBooking.table_type_name}</TableDetailPrice>
                                                        </TableInformationRow>
                                                    </TableInformationDetail>
                                                </TableInformation>

                                                <Button className="row">
                                                    <ButtonContainer style={{ paddingTop: "40px" }}>
                                                        <ButtonClick
                                                            onClick={() => handleCancelBookTable()}
                                                        >
                                                            {/* <ButtonClick style={{marginLeft: "70%"}} className="button-disable"> */}
                                                            Chỉnh sửa đặt bàn
                                                        </ButtonClick>
                                                    </ButtonContainer>
                                                </Button>
                                            </RightBackground>
                                        ) : (
                                            <div className="section background-dark p-4">
                                                <div className="row">
                                                    <div className="col-12">
                                                        <div className="input-daterange input-group" id="flight-datepicker">
                                                            <div className="row">
                                                                <div className="col-12">
                                                                    <InputDateRangeFormItem classNameName="form-item">
                                                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                                            <Stack spacing={3}>
                                                                                <DesktopDatePicker
                                                                                    label="Ngày đặt bàn"
                                                                                    inputFormat="dd/MM/yyyy"
                                                                                    value={dateBooking}
                                                                                    onChange={(newValue) => handleChangeDateBooking(newValue)}
                                                                                    renderInput={(params) => <TextField {...params} />}
                                                                                    InputProps={{ sx: { '& .MuiSvgIcon-root': { color: "white" } } }}
                                                                                />
                                                                            </Stack>
                                                                        </LocalizationProvider>
                                                                    </InputDateRangeFormItem>
                                                                </div>
                                                                <div className="col-12 pt-4">
                                                                    <InputDateRangeFormItem>
                                                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                                            <Stack spacing={3}>
                                                                                <TimePicker
                                                                                    label="Thời gian đến"
                                                                                    value={timeBooking}
                                                                                    format="HH:mm"
                                                                                    onChange={(newValue) => {
                                                                                        setTimeBooking(newValue);
                                                                                    }}
                                                                                    renderInput={(params) => <TextField {...params} />}
                                                                                    InputProps={{ sx: { '& .MuiSvgIcon-root': { color: "white" } } }}
                                                                                />
                                                                            </Stack>
                                                                        </LocalizationProvider>
                                                                    </InputDateRangeFormItem>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12">
                                                        <div className="row">
                                                            <div className="col-12 pt-4">
                                                                <BookingNumberNiceSelect name="adults" className={isSelectQuantity ? "nice-select wide open" : "nice-select wide"} onClick={() => setIsSelectQuantity(prev => !prev)}>
                                                                    <BookingNumberNiceSelectSpan className='current'>{quantityBooking ? quantityBooking === 5 ? "4+ Khách" : quantityBooking + " Khách" : "Số lượng khách"}</BookingNumberNiceSelectSpan>
                                                                    <BookingNumberNiceSelectUl className='list'>
                                                                        <BookingNumberNiceSelectLi className='option focus selected'>Số lượng khách</BookingNumberNiceSelectLi>
                                                                        <BookingNumberNiceSelectLi className='option' onClick={() => setQuantityBooking(1)} >1 Khách</BookingNumberNiceSelectLi>
                                                                        <BookingNumberNiceSelectLi className='option' onClick={() => setQuantityBooking(2)} >2 Khách</BookingNumberNiceSelectLi>
                                                                        <BookingNumberNiceSelectLi className='option' onClick={() => setQuantityBooking(3)} >3 Khách</BookingNumberNiceSelectLi>
                                                                        <BookingNumberNiceSelectLi className='option' onClick={() => setQuantityBooking(4)} >4 Khách</BookingNumberNiceSelectLi>
                                                                        <BookingNumberNiceSelectLi className='option' onClick={() => setQuantityBooking(5)} >4+ Khách</BookingNumberNiceSelectLi>
                                                                    </BookingNumberNiceSelectUl>
                                                                </BookingNumberNiceSelect>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-md-6 col-lg-12 pt-5">
                                                        <h6 className="color-white mb-3">View:</h6>
                                                        <ul className="list">
                                                            {
                                                                tableTypeList.length > 0 ? (
                                                                    tableTypeList.map((tableType, key) => {
                                                                        return (
                                                                            <li className="list__item"
                                                                                onClick={() => setTableTypeId(tableType.table_type_id)}
                                                                            >
                                                                                <label className="label--checkbox">
                                                                                    <input type="radio" name='RadioTableType' className="checkbox" />
                                                                                    {tableType.table_type_name}
                                                                                </label>
                                                                            </li>
                                                                        )
                                                                    })
                                                                ) : null
                                                            }
                                                        </ul>
                                                    </div>
                                                    <div className="col-12 col-md-6 col-lg-12 pt-5" style={{ padding: "0", margin: "0" }}>
                                                        <Button className="row">
                                                            <ButtonContainer>
                                                                <ButtonClick
                                                                    onClick={() => handleCheckAvailableTable()}
                                                                >
                                                                    {/* <ButtonClick style={{marginLeft: "70%"}} className="button-disable"> */}
                                                                    tìm bàn trống
                                                                </ButtonClick>
                                                            </ButtonContainer>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
            {/* Modal */}
            {
                minutes === 0 && seconds === 0
                    ?
                    <ModalBackground>
                        <ModalWrapperMessage>
                            <MessageImageContainer>
                                <MessageImage src={logo} />
                            </MessageImageContainer>
                            <ModalH2>Chúc mừng bạn đã quay lại!</ModalH2>
                            <ModalSmall className="text-muted">Số lượng bàn trống có thể đã thay đổi, vui lòng tải lại trang để cập nhật giá mới nhất</ModalSmall>
                            <Link to="/restaurant" style={{ textDecoration: "none" }}>
                                <ModalButtonContainer>
                                    <ModalButton><ReplayOutlined />   Tải lại trang</ModalButton>
                                </ModalButtonContainer>
                            </Link>
                        </ModalWrapperMessage>
                    </ModalBackground>
                    : null
            }
            {/* TOAST */}
            <Toast
                ref={toastRef}
                dataToast={dataToast}
            />
        </>
    )
}

export default BookTableMain