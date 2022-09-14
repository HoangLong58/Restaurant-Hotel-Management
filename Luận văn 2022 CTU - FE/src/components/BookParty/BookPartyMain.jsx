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

import { AccessAlarmsOutlined, CelebrationOutlined, ReplayOutlined } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../img/logos/logo.png';
import Toast from '../Toast';
import BookPartyProgress from './BookPartyProgress';

// Multi carousel
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

import menu1 from '../../img/menu1.jpg';
import menu2 from '../../img/menu2.jpg';
import menu3 from '../../img/menu3.jpg';
import menu4 from '../../img/menu4.jpg';
import menu5 from '../../img/menu5.jpg';
import menu6 from '../../img/menu6.jpg';
import menu7 from '../../img/menu7.jpg';
import menu8 from '../../img/menu8.jpg';

import view3 from '../../img/hoboi1.jpg';
import view5 from '../../img/lavender1.jpg';
import view2 from '../../img/lobby1.jpg';
import view4 from '../../img/santhuong1.jpg';
import view1 from '../../img/sanvuon1.jpg';
import Modal from './Modal';


const Box2 = styled.div`
width: 100%;
padding: 10px 40px;
background-color: #f8f9fa;
margin-top: 22px;
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

const Info = styled.div`
    opacity: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0,0,0,0.2);
    z-index: 3;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.5s ease;
`

const MealName = styled.h6`
    position: absolute;
`
const MealDetail = styled.p`
    position: absolute;
`
const MealPrice = styled.h5`
    position: absolute;
`
// Menu slider
const MenuItem = styled.div`
    background-color: #fff;
    width: 350px;
    /* margin: 0px 15px; */
    margin-left: auto;
    margin-right: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    cursor: pointer;
`

const MenuImage = styled.img`
    width: 90%;
    max-height: 100%;
`
const MenuInfo = styled.div`
    background-color: #323232;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-direction: column;
    padding: 30px 35px 20px 35px;
`

const MenuTitle = styled.h3`
    width: 100%;
    text-transform: uppercase;
    color: #E4B576;    
    position: relative;
    font-size: 1.6rem;
    margin-bottom: 15px;
    letter-spacing: 2px;
    &::after {
        content: "";
        display: block;
        width: 80%;
        position: absolute;
        top: 120%;
        left: 10%;
        border-bottom: 2px solid #E4B576;
    }
`

const MenuDescription = styled.p`
    color: #fff;
`

// View slider
const ViewImage = styled.img`
    display: block;
    width: 90%;
    max-height: 100%;
    -webkit-transition: all 300ms linear;
	transition: all 300ms linear;
`

const ViewItem = styled.div`
    background-color: #333;
    width: 350px;
    /* margin: 0px 15px; */
    margin-left: auto;
    margin-right: auto;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: column;
    padding-top: 15px;
    height: 100%;
    cursor: pointer;
    overflow: hidden;
    position: relative;
    &:hover ${ViewImage} {
        transform: scale(1.1);
    }
`

const ViewInfo = styled.div`
    background-color: #323232;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-direction: column;
    padding: 30px 35px 20px 35px;
`

const ViewTitle = styled.h3`
    width: 100%;
    text-transform: uppercase;
    color: #E4B576;    
    position: relative;
    font-size: 1.6rem;
    margin-bottom: 15px;
    letter-spacing: 2px;
    &::after {
        content: "";
        display: block;
        width: 80%;
        position: absolute;
        top: 120%;
        left: 10%;
        border-bottom: 2px solid #E4B576;
    }
`

const ViewDescription = styled.p`
    color: #fff;
`

// Detail Service
const CartItem = styled.div`
display: flex;
width: 100%;
font-size: 1.1rem;
background: #ddd;
margin-top: 10px;
padding: 10px 12px;
border-radius: 5px;
cursor: pointer;
border: 1px solid transparent;
`

const CircleService = styled.span`
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
`

const Content = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
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

// Party Info
const PartyInformation = styled.div`
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

const PartyInformationTitle = styled.div`
font-weight: bold;
padding-bottom: 8px;
`
const PartyInformationDetail = styled.div``
const PartyInformationRow = styled.div``
const PartyDetailTitle = styled.div`
font-size: 0.9rem;
`
const PartyDetailPrice = styled.div`
font-size: 1.1rem;
font-weight: bold;
color: var(--color-primary);
display: flex;
justify-content: flex-end;
align-items: center;
`

const BookPartyMain = () => {
    const navigate = useNavigate();
    // STATE
    const [isSelectAdults, setIsSelectAdults] = useState(false);
    const [isAvailableTable, setIsAvailableTable] = useState(false);
    const [isBookSuccess, setIsBookSuccess] = useState(false);

    const [checkInDate, setCheckInDate] = useState();
    const [timeBooking, setTimeBooking] = useState();

    //  --State khi chọn xong place -> Chọn menu
    const [isBookMenu, setIsBookMenu] = useState(true);

    //---------------------------------------------------------------- 
    // Modal
    const [showModal, setShowModal] = useState(false);
    const [typeModal, setTypeModal] = useState("")
    const [danhMucModal, setDanhMucModal] = useState(null);

    const openModal = (modal) => {
        setShowModal(prev => !prev);
        setTypeModal(modal.type);
    }
    // Toast
    const [dataToast, setDataToast] = useState({ message: "alo alo", type: "success" });
    const toastRef = useRef(null);

    const showToastFromOut = (dataShow) => {
        setDataToast(dataShow);
        toastRef.current.show();
    }
    //---------------------------------------------------------------- 
    // HANDLE
    const handleChangeCheckInDate = (newValue) => {
        setCheckInDate(newValue);
        console.log(moment(newValue).format("DD/MM/yyyy"));
    };

    const handleCheckAvailableTable = () => {
        // Use Toast
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


    //State
    const [imageMenu, setImageMenu] = useState();
    const [imageView, setImageView] = useState();

    // Responsive Multi Carousel
    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 1,
            slidesToSlide: 1 // optional, default to 1.
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2,
            slidesToSlide: 2 // optional, default to 1.
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
            slidesToSlide: 1 // optional, default to 1.
        }
    };



    //Handle
    const handleClickMenu = (image) => {
        setImageMenu(image);
        openModal({ type: "showImageMenu" })
    }

    const handleClickView = (image) => {
        setImageView(image);
        openModal({ type: "showImageView" })
    }

    return (
        <>
            {/*-- BOOK PARTY PROGRESS -- */}
            <BookPartyProgress step={isBookMenu ? "findMenu" : "findPlace"} />

            <div class="section padding-top-bottom z-bigger" style={{ paddingTop: "0" }}>
                <div class="container">
                    <div className="row">
                        {
                            isBookMenu ? (
                                // Left
                                < div className="col-lg-8">
                                    <Box2>
                                        <div className="col-lg-12">
                                            <div className="row">
                                                <InfomationTitle>
                                                    <p style={{ fontWeight: "bold", margin: "10px 0 0 0" }}>Lựa chọn Menu &amp; Món ăn cụ thể</p>
                                                    <p style={{ fontSize: "1rem" }}>Dưới đây là những Menu phù hợp</p>
                                                </InfomationTitle>
                                            </div>
                                            <Carousel
                                                swipeable={false}
                                                draggable={false}
                                                showDots={false}
                                                responsive={responsive}
                                                ssr={true} // means to render carousel on server-side.
                                                infinite={true}
                                                autoPlay={false}
                                                autoPlaySpeed={1000}
                                                keyBoardControl={true}
                                                customTransition="transform 500ms ease 0s"
                                                transitionDuration={1500}
                                                containerClass="carousel-container"
                                                removeArrowOnDeviceType={["tablet", "mobile"]}
                                                deviceType="desktop"
                                                dotListClass="custom-dot-list-style"
                                                itemClass="carousel-item-padding-40-px"
                                                arrows={true}
                                                rewindWithAnimation={true}
                                            >
                                                <MenuItem onClick={() => handleClickMenu(menu1)}>
                                                    <MenuImage src={menu1} />
                                                    <MenuInfo>
                                                        <MenuTitle>MENU 4.950.000</MenuTitle>
                                                        <MenuDescription>
                                                            Bàn tiệc tiêu chuẩn với đầy đủ các món ngon, đảm bảo đầy đủ khẩu phần và sự sang trọng.
                                                        </MenuDescription>
                                                    </MenuInfo>
                                                </MenuItem>
                                                <MenuItem onClick={() => handleClickMenu(menu2)}>
                                                    <MenuImage src={menu2} />
                                                    <MenuInfo>
                                                        <MenuTitle>MENU 5.950.000</MenuTitle>
                                                        <MenuDescription>
                                                            Bàn tiệc nâng cấp cho bữa tiệc sang trọng với các món ngon đa dạng và thịnh soạn hơn.
                                                        </MenuDescription>
                                                    </MenuInfo>
                                                </MenuItem>
                                                <MenuItem onClick={() => handleClickMenu(menu3)}>
                                                    <MenuImage src={menu3} />
                                                    <MenuInfo>
                                                        <MenuTitle>MENU 6.250.000</MenuTitle>
                                                        <MenuDescription>
                                                            Bàn tiệc với những món ăn phong phú và sang trọng đem đến cho quý khách.
                                                        </MenuDescription>
                                                    </MenuInfo>
                                                </MenuItem>
                                                <MenuItem onClick={() => handleClickMenu(menu4)}>
                                                    <MenuImage src={menu4} />
                                                    <MenuInfo>
                                                        <MenuTitle>Menu 6.950.000</MenuTitle>
                                                        <MenuDescription>
                                                            Bàn tiệc thịnh soạn, đầy đủ món ngon, hợp khẩu vị người châu Á sẽ là chọn lựa hoàn hảo...
                                                        </MenuDescription>
                                                    </MenuInfo>
                                                </MenuItem>
                                                <MenuItem onClick={() => handleClickMenu(menu5)}>
                                                    <MenuImage src={menu5} />
                                                    <MenuInfo>
                                                        <MenuTitle>Menu 7.550.000</MenuTitle>
                                                        <MenuDescription>
                                                            Bàn tiệc sang trọng, giá trị nhất với những món ngon phong phú và giá trị dinh dưỡng cao nhất.
                                                        </MenuDescription>
                                                    </MenuInfo>
                                                </MenuItem>
                                                <MenuItem onClick={() => handleClickMenu(menu6)}>
                                                    <MenuImage src={menu6} />
                                                    <MenuInfo>
                                                        <MenuTitle>Menu thức uống</MenuTitle>
                                                        <MenuDescription>
                                                            Những thức uống đa dạng, mức giá hợp lý tạo thêm điểm nhấn quan trọng cho bữa tiệc.
                                                        </MenuDescription>
                                                    </MenuInfo>
                                                </MenuItem>
                                                <MenuItem onClick={() => handleClickMenu(menu7)}>
                                                    <MenuImage src={menu7} />
                                                    <MenuInfo>
                                                        <MenuTitle>Bảng giá dịch vụ</MenuTitle>
                                                        <MenuDescription>
                                                            Những dịch vụ trang trí, nghi thức lễ với phiên bản nâng cấp làm tăng giá trị của bữa tiệc.
                                                        </MenuDescription>
                                                    </MenuInfo>
                                                </MenuItem>
                                                <MenuItem onClick={() => handleClickMenu(menu8)}>
                                                    <MenuImage src={menu8} />
                                                    <MenuInfo>
                                                        <MenuTitle>BẢNG GIÁ DỊCH VỤ</MenuTitle>
                                                        <MenuDescription>
                                                            Những hạng mục chương trình giải trí và dịch vụ phụ trợ giúp bữa tiệc hoàn hảo hơn.
                                                        </MenuDescription>
                                                    </MenuInfo>
                                                </MenuItem>
                                            </Carousel>

                                            {/* Detail Service */}
                                            <div className="row">
                                                <InfomationTitle>
                                                    <p style={{ fontWeight: "bold", margin: "10px 0 0 0" }}>Những món ăn bạn đã chọn</p>
                                                    <CartItem>
                                                        <CircleService />
                                                        <Course>
                                                            <Content>
                                                                <span style={{ width: "320px", fontWeight: "bold" }}> Gè rén </span>
                                                                <span style={{ fontWeight: "400", color: "var(--color-primary)", width: "145px", textAlign: "right" }}>200.000 VNĐ</span>
                                                            </Content>
                                                            <span style={{ fontWeight: "400" }}><span style={{ color: "var(--color-primary)" }}>12</span> x Gè rén</span>
                                                        </Course>
                                                    </CartItem>
                                                    <CartItem>
                                                        <CircleService />
                                                        <Course>
                                                            <Content>
                                                                <span style={{ width: "320px", fontWeight: "bold" }}> Gè rén </span>
                                                                <span style={{ fontWeight: "400", color: "var(--color-primary)", width: "145px", textAlign: "right" }}>200.000 VNĐ</span>
                                                            </Content>
                                                            <span style={{ fontWeight: "400" }}><span style={{ color: "var(--color-primary)" }}>12</span> x Gè rén</span>
                                                        </Course>
                                                    </CartItem>
                                                    <CartItem>
                                                        <CircleService />
                                                        <Course>
                                                            <Content>
                                                                <span style={{ width: "320px", fontWeight: "bold" }}> Gè rén </span>
                                                                <span style={{ fontWeight: "400", color: "var(--color-primary)", width: "145px", textAlign: "right" }}>200.000 VNĐ</span>
                                                            </Content>
                                                            <span style={{ fontWeight: "400" }}><span style={{ color: "var(--color-primary)" }}>12</span> x Gè rén</span>
                                                        </Course>
                                                    </CartItem>
                                                </InfomationTitle>
                                            </div>

                                            {/* Remind service */}
                                            <div className="row">
                                                <InfomationTitle>
                                                    <p style={{ fontWeight: "300", margin: "15px 0 0 0", fontSize: "1.1rem" }}>Bạn đồng ý lựa chọn <b style={{ color: "var(--color-primary)" }}>MENU 6.250.000</b> với những món ăn trên ?</p>
                                                    {/* <p style={{ fontSize: "1rem" }}>Dưới đây là những sảnh cử hành phù hợp</p> */}
                                                </InfomationTitle>
                                            </div>

                                            {/* Button service */}
                                            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: "20px" }}>
                                                <BookButtonContainer>
                                                    <BookButton
                                                        onClick={() => setIsBookSuccess(true)}
                                                    >Đồng ý</BookButton>
                                                </BookButtonContainer>

                                                <Link to={"/restaurant"}>
                                                    <BookButtonContainer>
                                                        <BookButton
                                                        >Hủy đặt tiệc</BookButton>
                                                    </BookButtonContainer>
                                                </Link>
                                            </div>
                                        </div>
                                    </Box2>
                                </div>
                            ) : (
                                // Left
                                <div className="col-lg-8">
                                    <Box2>
                                        <div className="col-lg-12">
                                            <div className="row">
                                                <InfomationTitle>
                                                    <p style={{ fontWeight: "bold", margin: "10px 0 0 0" }}>Lựa chọn Sảnh cử hành tiệc &amp; Dịch vụ đi kèm</p>
                                                    <p style={{ fontSize: "1rem" }}>Dưới đây là những sảnh cử hành phù hợp</p>
                                                </InfomationTitle>
                                            </div>
                                            <Carousel
                                                swipeable={false}
                                                draggable={false}
                                                showDots={false}
                                                responsive={responsive}
                                                ssr={true} // means to render carousel on server-side.
                                                infinite={true}
                                                autoPlay={false}
                                                autoPlaySpeed={1000}
                                                keyBoardControl={true}
                                                customTransition="transform 500ms ease 0s"
                                                transitionDuration={1500}
                                                containerClass="carousel-container"
                                                removeArrowOnDeviceType={["tablet", "mobile"]}
                                                deviceType="desktop"
                                                dotListClass="custom-dot-list-style"
                                                itemClass="carousel-item-padding-40-px"
                                                arrows={true}
                                                rewindWithAnimation={true}
                                            >
                                                <ViewItem onClick={() => handleClickView(view1)} style={{ justifyContent: "flex-start", paddingTop: "15px", height: "100%", backgroundColor: "#333" }}>
                                                    <ViewImage src={view1} />
                                                    <ViewInfo>
                                                        <ViewTitle>SẢNH IRIS &#8211; SÂN VƯỜN</ViewTitle>
                                                        <ViewDescription>
                                                            Không gian tiệc ngoài trời thoáng đãng, tươi mát, rộng rãi, sức chứa khoảng 130-280 khách.
                                                        </ViewDescription>
                                                    </ViewInfo>
                                                </ViewItem>
                                                <ViewItem onClick={() => handleClickView(view2)} style={{ justifyContent: "flex-start", paddingTop: "15px", height: "100%", backgroundColor: "#333" }}>
                                                    <ViewImage src={view2} />
                                                    <ViewInfo>
                                                        <ViewTitle>SẢNH DAISY &#8211; LOBBY</ViewTitle>
                                                        <ViewDescription>
                                                            Không gian tiệc trong nhà phong cách Rustic lãng mạn, duyên dáng, ấm cúng, sức chứa khoảng 120 khách.
                                                        </ViewDescription>
                                                    </ViewInfo>
                                                </ViewItem>
                                                <ViewItem onClick={() => handleClickView(view3)} style={{ justifyContent: "flex-start", paddingTop: "15px", height: "100%", backgroundColor: "#333" }}>
                                                    <ViewImage src={view3} />
                                                    <ViewInfo>
                                                        <ViewTitle>SẢNH PEONY &#8211; HỒ BƠI</ViewTitle>
                                                        <ViewDescription>
                                                            Không gian tiệc ngoài trời độc đáo, ấn tượng, xanh mát, sức chứa đẹp nhất khoảng 120 khách.
                                                        </ViewDescription>
                                                    </ViewInfo>
                                                </ViewItem>
                                                <ViewItem onClick={() => handleClickView(view4)} style={{ justifyContent: "flex-start", paddingTop: "15px", height: "100%", backgroundColor: "#333" }}>
                                                    <ViewImage src={view4} />
                                                    <ViewInfo>
                                                        <ViewTitle>SẢNH PANSEE &#8211; SÂN THƯỢNG</ViewTitle>
                                                        <ViewDescription>
                                                            Không gian tiệc ngoài trời trên tầng cao, thoáng mát, mới lạ, sức chứa tối đa khoảng 70 khách.
                                                        </ViewDescription>
                                                    </ViewInfo>
                                                </ViewItem>
                                                <ViewItem onClick={() => handleClickView(view5)} style={{ justifyContent: "flex-start", paddingTop: "15px", height: "100%", backgroundColor: "#333" }}>
                                                    <ViewImage src={view5} />
                                                    <ViewInfo>
                                                        <ViewTitle>SẢNH LAVENDER &#8211; ÁP MÁI</ViewTitle>
                                                        <ViewDescription>
                                                            Không gian tiệc trong nhà nhỏ xinh, ấm áp, thanh lịch, sức chứa khoảng 50 khách.
                                                        </ViewDescription>
                                                    </ViewInfo>
                                                </ViewItem>
                                            </Carousel>

                                            {/* Detail Service */}
                                            <div className="row">
                                                <InfomationTitle>
                                                    <p style={{ fontWeight: "bold", margin: "10px 0 0 0" }}>Những dịch vụ đã chọn</p>
                                                    <CartItem>
                                                        <CircleService />
                                                        <Course>
                                                            <Content>
                                                                <span style={{ width: "320px", fontWeight: "bold" }}> Gè rén </span>
                                                                <span style={{ fontWeight: "400", color: "var(--color-primary)", width: "145px", textAlign: "right" }}>200.000 VNĐ</span>
                                                            </Content>
                                                            <span style={{ fontWeight: "400" }}><span style={{ color: "var(--color-primary)" }}>12</span> x Gè rén</span>
                                                        </Course>
                                                    </CartItem>
                                                    <CartItem>
                                                        <CircleService />
                                                        <Course>
                                                            <Content>
                                                                <span style={{ width: "320px", fontWeight: "bold" }}> Gè rén </span>
                                                                <span style={{ fontWeight: "400", color: "var(--color-primary)", width: "145px", textAlign: "right" }}>200.000 VNĐ</span>
                                                            </Content>
                                                            <span style={{ fontWeight: "400" }}><span style={{ color: "var(--color-primary)" }}>12</span> x Gè rén</span>
                                                        </Course>
                                                    </CartItem>
                                                    <CartItem>
                                                        <CircleService />
                                                        <Course>
                                                            <Content>
                                                                <span style={{ width: "320px", fontWeight: "bold" }}> Gè rén </span>
                                                                <span style={{ fontWeight: "400", color: "var(--color-primary)", width: "145px", textAlign: "right" }}>200.000 VNĐ</span>
                                                            </Content>
                                                            <span style={{ fontWeight: "400" }}><span style={{ color: "var(--color-primary)" }}>12</span> x Gè rén</span>
                                                        </Course>
                                                    </CartItem>
                                                </InfomationTitle>
                                            </div>

                                            {/* Remind service */}
                                            <div className="row">
                                                <InfomationTitle>
                                                    <p style={{ fontWeight: "300", margin: "15px 0 0 0", fontSize: "1.1rem" }}>Bạn đồng ý lựa chọn <b style={{ color: "var(--color-primary)" }}>Sảnh LAVENDER - ÁP MÁI</b> và những dịch vụ trên ?</p>
                                                    {/* <p style={{ fontSize: "1rem" }}>Dưới đây là những sảnh cử hành phù hợp</p> */}
                                                </InfomationTitle>
                                            </div>

                                            {/* Button service */}
                                            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: "20px" }}>
                                                <BookButtonContainer>
                                                    <BookButton
                                                        onClick={() => setIsBookSuccess(true)}
                                                    >Đồng ý</BookButton>
                                                </BookButtonContainer>

                                                <Link to={"/restaurant"}>
                                                    <BookButtonContainer>
                                                        <BookButton
                                                        >Hủy đặt tiệc</BookButton>
                                                    </BookButtonContainer>
                                                </Link>
                                            </div>
                                        </div>
                                    </Box2>
                                </div>
                            )
                        }

                        {/* Right */}
                        <div className="col-lg-4 order-first order-lg-last mt-4">
                            {
                                isAvailableTable ? (
                                    <div className="section background-dark p-4" style={{ backgroundColor: "#f5f5f5" }}>
                                        <TitleSolid className="row">
                                            <RightColMd6 className='col-md-8' style={{ fontWeight: "600", padding: "0" }}>Thông tin đặt tiệc</RightColMd6>
                                        </TitleSolid>
                                        <TitleDashed className="row">
                                            <RightColMd6 className='col-md-8' style={{ fontWeight: "600", padding: "0" }}>Thời gian giữ sảnh:</RightColMd6>
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
                                                        <DayTitle>Ngày đặt sảnh</DayTitle>
                                                        <DayDetail>11/09/2022</DayDetail>
                                                    </BookingInfoDetailRowMd5>
                                                    <BookingInfoDetailRowMd2 className="col-md-2">
                                                        <CelebrationOutlined style={{ color: "var(--color-primary)" }} />
                                                    </BookingInfoDetailRowMd2>
                                                    <BookingInfoDetailRowMd5 className="col-md-5">
                                                        <DayTitle>Thời gian cử hành</DayTitle>
                                                        <DayDetail>06:00 AM</DayDetail>
                                                    </BookingInfoDetailRowMd5>
                                                </BookingInfoDetailRow>
                                            </BookingInfoDetail>

                                            <BookingNumber className="col-md-12">
                                                <BookingNumberRow className="row">
                                                    <BookingNumberRowMd5 className="col-md-6">Số lượng khách: <b style={{ color: "var(--color-primary)", marginLeft: "5px" }}> 200</b></BookingNumberRowMd5>
                                                </BookingNumberRow>
                                            </BookingNumber>
                                        </BookingInfo>

                                        <PartyInformation className="row">
                                            <PartyInformationTitle className="col-md-12">Thông tin Sảnh</PartyInformationTitle>
                                            <PartyInformationDetail className="col-md-12">
                                                <PartyInformationRow className="row">
                                                    <PartyDetailTitle className="col-md-6">Loại tiệc</PartyDetailTitle>
                                                    <PartyDetailPrice className="col-md-6">Lễ cưới</PartyDetailPrice>
                                                </PartyInformationRow>
                                                <PartyInformationRow className="row">
                                                    <PartyDetailTitle className="col-md-6">Vị trí</PartyDetailTitle>
                                                    <PartyDetailPrice className="col-md-6">Ngoài trời</PartyDetailPrice>
                                                </PartyInformationRow>
                                            </PartyInformationDetail>
                                        </PartyInformation>

                                        <Button className="row">
                                            <ButtonContainer style={{ paddingTop: "40px" }}>
                                                <ButtonClick
                                                    onClick={() => navigate('/hotel')}
                                                >
                                                    {/* <ButtonClick style={{marginLeft: "70%"}} className="button-disable"> */}
                                                    Chỉnh sửa đặt tiệc
                                                </ButtonClick>
                                            </ButtonContainer>
                                        </Button>
                                    </div>
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
                                                            <BookingNumberNiceSelectSpan className='current'>Loại tiệc</BookingNumberNiceSelectSpan>
                                                            <BookingNumberNiceSelectUl className='list'>
                                                                <BookingNumberNiceSelectLi data-value="adults" data-display="adults" className='option focus selected'>Loại tiệc</BookingNumberNiceSelectLi>
                                                                <BookingNumberNiceSelectLi data-value="1" className='option'>Lễ cưới</BookingNumberNiceSelectLi>
                                                                <BookingNumberNiceSelectLi data-value="2" className='option'>Tiệc cá nhân</BookingNumberNiceSelectLi>
                                                                <BookingNumberNiceSelectLi data-value="3" className='option'>Hội nghị &amp; Tiệc công ty</BookingNumberNiceSelectLi>
                                                            </BookingNumberNiceSelectUl>
                                                        </BookingNumberNiceSelect>
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
                                                            Trong nhà
                                                        </label>
                                                    </li>
                                                    <li className="list__item">
                                                        <label className="label--checkbox">
                                                            <input type="checkbox" className="checkbox" />
                                                            Ngoài trời
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
                </div>
            </div>
            {/* Modal Mess */}
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

            {/* Modal */}
            <Modal
                showModal={showModal}   //state Đóng mở modal
                setShowModal={setShowModal} //Hàm Đóng mở modal
                type={typeModal}    //Loại modal
                imageMenu={imageMenu}   //Hình ảnh menu trong Modal
                imageView={imageView}   //Hình ảnh view trong Modal
            />
            {/* TOAST */}
            <Toast
                ref={toastRef}
                dataToast={dataToast}
            />
        </>
    )
}

export default BookPartyMain