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
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../img/logos/logo.png';
import Toast from '../Toast';

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

const BookTableMain = () => {
    const navigate = useNavigate();
    // STATE
    const [isSelectAdults, setIsSelectAdults] = useState(false);
    const [isAvailableTable, setIsAvailableTable] = useState(false);
    const [isBookSuccess, setIsBookSuccess] = useState(false);

    const [checkInDate, setCheckInDate] = useState();
    const [timeBooking, setTimeBooking] = useState();

    // HANDLE
    const handleChangeCheckInDate = (newValue) => {
        setCheckInDate(newValue);
        console.log(moment(newValue).format("DD/MM/yyyy"));
    };

    const handleCheckAvailableTable = () => {
        // Toast
        const dataToast = { message: "Đã tìm được bàn trống!", type: "success" };
        showToastFromOut(dataToast);
        setIsAvailableTable(true);
        setMinutes(4);
        setSeconds(59);
    }

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
    // Toast
    const [dataToast, setDataToast] = useState({ message: "alo alo", type: "success" });
    const toastRef = useRef(null);

    const showToastFromOut = (dataShow) => {
        setDataToast(dataShow);
        toastRef.current.show();
    }
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
                                        <Small className="text-muted">Món ăn sẽ nhanh chóng mang đến cho quý khách!</Small>
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
                                    <Box2>
                                        <div className="col-lg-12">
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
                                                            <FormInput type="text" placeholder="Họ tên của bạn là" />
                                                        </ModalChiTietItem>
                                                        <ModalChiTietItem className="col-lg-6">
                                                            <FormSpan>Số điện thoại:</FormSpan>
                                                            <FormInput type="text" placeholder="Số điện thoại của bạn là" />
                                                        </ModalChiTietItem>
                                                    </div>
                                                    <div className="row">

                                                        <ModalChiTietItem className="col-lg-12">
                                                            <FormSpan>Địa chỉ email:</FormSpan>
                                                            <FormInput type="email" placeholder="Email của bạn là" />
                                                        </ModalChiTietItem>
                                                    </div>
                                                    <div className="row">
                                                        <ModalChiTietItem className="col-lg-12">
                                                            <FormSpan>Ghi chú:</FormSpan>
                                                            <FormTextArea rows="3" placeholder="Ghi chú về vị trí bàn này" />
                                                        </ModalChiTietItem>
                                                    </div>
                                                </InfomationForm>

                                            </div>
                                            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                                <BookButtonContainer>
                                                    <BookButton
                                                        onClick={() => setIsBookSuccess(true)}
                                                    >Đặt bàn</BookButton>
                                                </BookButtonContainer>

                                                <Link to={"/restaurant"}>
                                                    <BookButtonContainer>
                                                        <BookButton
                                                        >Hủy đặt bàn</BookButton>
                                                    </BookButtonContainer>
                                                </Link>
                                            </div>
                                        </div>
                                    </Box2>
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
                                                                <DayDetail>11/09/2022</DayDetail>
                                                            </BookingInfoDetailRowMd5>
                                                            <BookingInfoDetailRowMd2 className="col-md-2">
                                                                <RestaurantMenuOutlined style={{ color: "var(--color-primary)" }} />
                                                            </BookingInfoDetailRowMd2>
                                                            <BookingInfoDetailRowMd5 className="col-md-5">
                                                                <DayTitle>Thời gian đến</DayTitle>
                                                                <DayDetail>18:30 PM</DayDetail>
                                                            </BookingInfoDetailRowMd5>
                                                        </BookingInfoDetailRow>
                                                    </BookingInfoDetail>

                                                    <BookingNumber className="col-md-12">
                                                        <BookingNumberRow className="row">
                                                            <BookingNumberRowMd5 className="col-md-6">Số lượng khách: <b style={{ color: "var(--color-primary)", marginLeft: "5px" }}> 4+</b></BookingNumberRowMd5>
                                                        </BookingNumberRow>
                                                    </BookingNumber>
                                                </BookingInfo>

                                                <TableInformation className="row">
                                                    <TableInformationTitle className="col-md-12">Thông tin bàn</TableInformationTitle>
                                                    <TableInformationDetail className="col-md-12">
                                                        <TableInformationRow className="row">
                                                            <TableDetailTitle className="col-md-6">Số bàn:</TableDetailTitle>
                                                            <TableDetailPrice className="col-md-6">12</TableDetailPrice>
                                                        </TableInformationRow>
                                                        <TableInformationRow className="row">
                                                            <TableDetailTitle className="col-md-6">Vị trí:</TableDetailTitle>
                                                            <TableDetailPrice className="col-md-6">Sân thượng</TableDetailPrice>
                                                        </TableInformationRow>
                                                    </TableInformationDetail>
                                                </TableInformation>

                                                <Button className="row">
                                                    <ButtonContainer style={{ paddingTop: "40px" }}>
                                                        <ButtonClick
                                                            onClick={() => navigate('/hotel')}
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
                                                                                    value={checkInDate}
                                                                                    onChange={(newValue) => handleChangeCheckInDate(newValue)}
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
                                                                <BookingNumberNiceSelect name="adults" className={isSelectAdults ? "nice-select wide open" : "nice-select wide"} onClick={() => setIsSelectAdults(prev => !prev)}>
                                                                    <BookingNumberNiceSelectSpan className='current'>Số lượng khách</BookingNumberNiceSelectSpan>
                                                                    <BookingNumberNiceSelectUl className='list'>
                                                                        <BookingNumberNiceSelectLi data-value="adults" data-display="adults" className='option focus selected'>Số lượng khách</BookingNumberNiceSelectLi>
                                                                        <BookingNumberNiceSelectLi data-value="1" className='option'>1</BookingNumberNiceSelectLi>
                                                                        <BookingNumberNiceSelectLi data-value="2" className='option'>2</BookingNumberNiceSelectLi>
                                                                        <BookingNumberNiceSelectLi data-value="3" className='option'>3</BookingNumberNiceSelectLi>
                                                                        <BookingNumberNiceSelectLi data-value="4" className='option'>4</BookingNumberNiceSelectLi>
                                                                        <BookingNumberNiceSelectLi data-value="4+" className='option'>4+</BookingNumberNiceSelectLi>
                                                                    </BookingNumberNiceSelectUl>
                                                                </BookingNumberNiceSelect>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-md-6 col-lg-12 pt-5">
                                                        <h6 className="color-white mb-3">Bộ lọc:</h6>
                                                        <ul className="list">
                                                            <li className="list__item">
                                                                <label className="label--checkbox">
                                                                    <input type="checkbox" className="checkbox" />
                                                                    View sân thượng
                                                                </label>
                                                            </li>
                                                            <li className="list__item">
                                                                <label className="label--checkbox">
                                                                    <input type="checkbox" className="checkbox" />
                                                                    View hồ bơi
                                                                </label>
                                                            </li>
                                                            <li className="list__item">
                                                                <label className="label--checkbox">
                                                                    <input type="checkbox" className="checkbox" />
                                                                    View sang trọng
                                                                </label>
                                                            </li>
                                                            <li className="list__item">
                                                                <label className="label--checkbox">
                                                                    <input type="checkbox" className="checkbox" />
                                                                    View lãng mạn
                                                                </label>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    <div className="col-12 col-md-6 col-lg-12 pt-5" style={{ padding: "0", margin: "0" }}>
                                                        <Button className="row">
                                                            <ButtonContainer>
                                                                <ButtonClick
                                                                    onClick={() => handleCheckAvailableTable()}
                                                                >
                                                                    {/* <ButtonClick style={{marginLeft: "70%"}} className="button-disable"> */}
                                                                    CHECK AVAILABLE
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