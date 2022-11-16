import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
// Date picker
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import moment from 'moment';
// Time picker

import { AccessAlarmsOutlined, Add, ArrowRightAltOutlined, CelebrationOutlined, CheckCircleRounded, CheckOutlined, Remove, ReplayOutlined } from '@mui/icons-material';
import { Link, unstable_HistoryRouter, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../img/logos/logo.png';
import Toast from '../Toast';
import BookPartyProgress from './BookPartyProgress';

// Multi carousel
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';



import cash from '../../img/cash-icon.jpg';
import momoImage from '../../img/momo.jpg';
import stripeImage from '../../img/stripe.png';
import cardImage from '../../img/thenganhang.png';

import Modal from './Modal';
import SliderImage from './SliderImage';

// SERVICES
import { REACT_APP_STRIPE } from "../../constants/Var";
import * as DiscountService from "../../service/DiscountService";
import * as PartyBookingOrderService from "../../service/PartyBookingOrderService";
import * as PartyBookingTypeService from "../../service/PartyBookingTypeService";
import * as PartyHallService from "../../service/PartyHallService";
import * as PartyHallTimeService from "../../service/PartyHallTimeService";
import * as PartyHallTypeService from "../../service/PartyHallTypeService";
import * as PaymentService from "../../service/PaymentService";
import * as SetMenuService from "../../service/SetMenuService";

import StripeCheckout from 'react-stripe-checkout';

import { useDispatch, useSelector } from 'react-redux';
import { addCustomerBookingParty, addDiscountBookingParty, addPartyBookingTotal, chooseDayAndQuantityBookingParty, logoutPartyBooking } from '../../redux/partyBookingRedux';
import { format_money, traceCurrency } from '../../utils/utils';

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
const InfoDark = styled.div`
    opacity: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0,0,0,0.65);
    z-index: 3;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.5s ease;
`
const IconDark = styled.div`
    width: auto;
    height: auto;
    border-radius: 10px;
    padding: 10px;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px;
    transition: all 0.5s ease;
    &:hover {
        background-color: #e9f5f5;
        transform: scale(1.1);
    }
`

const SpanDark = styled.span`
    color: var(--color-dark);
    margin-left: 10px;
    font-weight: bold;
    letter-spacing: 2px;
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
    &:hover ${InfoDark} {
        opacity: 1;
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
// Payment
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

const Circle = styled.span`
height: 12px;
width: 12px;
background: #ccc;
border-radius: 50%;
margin-right: 15px;
border: 4px solid transparent;
display: inline-block;
`

const LeftRow = styled.div``
const LeftDiscount = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
  align-items: center;
  margin-top: 10px;
  &::after {
    content: "";
    display: block;
    position: absolute;
    top: -96px;
    left: 15px;
    width: 96%;
    border-top: 2px dashed var(--color-primary);
  }
`

// Way payment
const LeftWayPayment = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
  width: 90% !important;
`

const PaymentWay = styled.div`
  display: flex;
  flex-direction: row;
`
const PaymentDescription = styled.div`
  opacity: 0;
  height: 0;
  overflow: hidden;
  -webkit-transition: all 1500ms linear;
	transition: all 1500ms linear; 
`
const PaymentDescriptionP = styled.p`
  margin: 10px 10px 10px 15px;
  color: var(--color-dark);
`

const InputRadio = styled.input`
  padding: 0px 10px;
  font-size: 2rem;
  cursor: pointer;
  accent-color: var(--color-primary);
  -ms-transform: scale(1.5);
  -webkit-transform: scale(1.5);
  transform: scale(1.3);
  color: var(--color-dark);
  &::before {
      border: 2px solid #333;
  }
`


const PaymentName = styled.div`
  color: var(--color-dark);
  margin-left: 10px;
`

const PaymentUl = styled.ul``
const PaymentLi = styled.li`
    margin-bottom: 10px;
`
const PaymentLabel = styled.label`
  margin-top: 20px;
  position: relative;
  &:hover {
    ${PaymentDescription} {
      opacity: 1;
      height: auto;
    }
  }
  &::after {
    content: "";
    display: block;
    position: absolute;
    bottom: -10px;
    left: 15px;
    width: 70%;
    border-top: 2px solid #202020;
  }
  &:last-child &::after {
    display: none;
  }

`
const PaymentCol9 = styled.div`
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    color: #333;
`
const PaymentImgContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    color: #333;
`
const PaymentImg = styled.img`
    width: 50px;
    height: 50px;
    border-radius: 5px;
    background-color: white;
`
const Input = styled.input`
  width: 100% !important;
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


// More Image
const ImgContainer = styled.div`
`
const MoreImage = styled.div`
    width: 100%;
`

// Số bàn
const BookingButton = styled.div``
const BookingButtonA = styled.div`
    cursor: pointer;
    margin-top: 5px;
    height: 40px;
`

const BookingRestaurantQuantity = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
`
const BookingRestaurantQuantityInput = styled.input`
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
const BookingRestaurantQuantityButton = styled.div`
    background-color: var(--color-primary);
    width: 80px;
    height: 40px;
    line-height: 40px;
    &::before {
        width: 50px;
        height: 50px;
        top: -5px;
        left: -5px;
    }
    &:hover {
        background-color: var(--color-dark);
        &::before {
        top: -30px;
        left: -30px;
        width: 100px;
        height: 100px;
        background-color: rgba(65, 241, 182, 0.1);
    }
}
`

const Title = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    position: relative;
    margin-top: 15px;
    &::after {
    content: "";
    display: block;
    position: absolute;
    top: 0px;
    left: 15px;
    width: 96%;
    border-top: 2px dashed var(--color-primary);
  }
`


const TotalMoneyRow = styled.div`
  margin-bottom: 8px;
  color: white;
`

// Total money
const TotalMoney = styled.div`
  margin-top: 50px;
  border: 2px solid var(--color-dark);
  position: relative;
`
const TotalMoneySpan = styled.span`
  position: absolute;
  background-color: #444444;
  width: 168px;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 10px 5px 10px;
  font-weight: 400;
  top: -20px;
  left: 35%;
  font-weight: 600;
  letter-spacing: 2px;
`

const TotalMoneyBeforeH3 = styled.h3`
  font-weight: bold;
  margin-top: 30px;
  display: flex;
  justify-content: center;
  color: var(--color-primary);
	text-transform: lowercase;
  font-size: 1.8rem;
  position: relative;
`

const TotalMoneyH5 = styled.h5`
  color: var(--color-dark);
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-top: 20px;
  text-transform: none;
  margin-bottom: 20px;
  cursor: pointer;
  &::before {
    content: "";
    display: block;
    position: absolute;
    top: -10px;
    left: 25%;
    width: 50%;
    border-top: 2px solid var(--color-dark);
  }
`

// Finish
const ModalContent = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    line-height: 1.8;
    color: #141414;
    width: 100%;
    background-color: #fafafa;
    margin-top: 30px;
    padding: 20px 20px 40px 20px;
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

const BookPartyMain = () => {
    const customer = useSelector((state) => state.customer.currentCustomer);
    const partyBooking = useSelector((state) => state.partyBooking);
    const customerPartyBooking = useSelector((state) => state.partyBooking.customer);
    const discountPartyBooking = useSelector((state) => state.partyBooking.discount);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // STATE
    const [isSelectType, setIsSelectType] = useState(false);
    const [isSelectTime, setIsSelectTime] = useState(false);
    const [isSelectQuantity, setIsSelectQuantity] = useState(false);
    const [isAvailableTable, setIsAvailableTable] = useState(false);
    const [isBookSuccess, setIsBookSuccess] = useState(false);

    const [partyHallList, setPartyHallList] = useState([]);
    const [partyHallListFiltered, setPartyHallListFiltered] = useState([]);

    const [dateBooking, setDateBooking] = useState();
    const [timeBooking, setTimeBooking] = useState();
    const [typeBooking, setTypeBooking] = useState();
    const [typeBookingName, setTypeBookingName] = useState();
    const [timeBookingName, setTimeBookingName] = useState();
    const [quantityBooking, setQuantityBooking] = useState();
    const [partyHallType, setPartyHallType] = useState();
    const [partyHallTimeList, setPartyHallTimeList] = useState([]);
    const [partyBookingTypeList, setPartyBookingTypeList] = useState([]);
    const [partyHallTypeList, setPartyHallTypeList] = useState([]);
    const [setMenuList, setSetMenuList] = useState([]);

    // State from redux
    const [dateBookingRedux, setDateBookingRedux] = useState(moment(partyBooking.dateBooking, "YYYY-MM-DD").format('DD/MM/YYYY'));
    const [timeBookingRedux, setTimeBookingRedux] = useState(partyBooking.timeBooking);
    const [typeBookingRedux, setTypeBookingRedux] = useState(partyBooking.typeBooking);
    const [quantityBookingRedux, setQuantityBookingRedux] = useState(partyBooking.quantityBooking);
    const [partyHallTypeRedux, setPartyHallTypeRedux] = useState(partyBooking.partyHallType);
    const [partyHallRedux, setPartyHallRedux] = useState(partyBooking.partyHall);
    const [partyServiceRedux, setPartyServiceRedux] = useState(partyBooking.partyService);
    const [setMenuRedux, setSetMenuRedux] = useState(partyBooking.setMenu);
    const [foodListRedux, setFoodListRedux] = useState(partyBooking.foodList);

    const [customerId, setCustomerId] = useState(customer.customer_id);
    const [firstName, setFirstName] = useState(customer.customer_first_name);
    const [lastName, setLastName] = useState(customer.customer_last_name);
    const [email, setEmail] = useState(customer.customer_email);
    const [phoneNumber, setPhoneNumber] = useState(customer.customer_phone_number);
    const [note, setNote] = useState("");
    const [discount, setDiscount] = useState("");

    const [partyServiceTotal, setPartyServiceTotal] = useState(0);
    const [partyHallTotal, setPartyHallTotal] = useState(0);
    const [setMenuTotal, setSetMenuTotal] = useState(0);
    const [partyBookingTotal, setPartyBookingTotal] = useState(0);

    const [tableQuantity, setTableQuantity] = useState(0);

    const [discountId, setDiscountId] = useState();

    useEffect(() => {
        setDateBookingRedux(moment(partyBooking.dateBooking, "YYYY-MM-DD").format('DD/MM/YYYY'));
        setTimeBookingRedux(partyBooking.timeBooking);
        setTypeBookingRedux(partyBooking.typeBooking);
        setQuantityBookingRedux(partyBooking.quantityBooking);
        setPartyHallTypeRedux(partyBooking.partyHallType);
        setPartyHallRedux(partyBooking.partyHall);
        setPartyServiceRedux(partyBooking.partyService);
        setSetMenuRedux(partyBooking.setMenu);
        setFoodListRedux(partyBooking.foodList);

        if (partyBooking.partyService && partyBooking.partyHall && partyBooking.setMenu) {
            // Tính toán tổng tiền
            const partyServiceList = partyBooking.partyService;
            const partyHallPrice = partyBooking.partyHall.party_hall_price;
            const setMenuPrice = partyBooking.setMenu.set_menu_price;
            let partyServiceTotal = 0;
            for (var i = 0; i < partyServiceList.length; i++) {
                partyServiceTotal += partyServiceList[i].party_service_price;
            }
            setPartyServiceTotal(partyServiceTotal);
            setPartyHallTotal(partyHallPrice);
            setSetMenuTotal(setMenuPrice);
        }
    }, [partyBooking,
        partyBooking.partyHall,
        partyBooking.partyService,
        partyBooking.setMenu,
        partyBooking.foodList
    ]);

    // Tổng tiền
    useEffect(() => {
        if (discountPartyBooking) {
            const discountPercent = discountPartyBooking.discount_percent;
            let partyBookingTotal = partyHallTotal + partyServiceTotal + setMenuTotal * tableQuantity;
            partyBookingTotal = partyBookingTotal - (partyBookingTotal * discountPercent / 100)
            setPartyBookingTotal(partyBookingTotal);
        } else {
            let partyBookingTotal = partyHallTotal + partyServiceTotal + setMenuTotal * tableQuantity;
            setPartyBookingTotal(partyBookingTotal);
        }
    }, [tableQuantity,
        partyHallTotal,
        partyServiceTotal,
        setMenuTotal,
        discountPartyBooking
    ]);

    //  --State khi chọn xong place -> Chọn menu
    const [isBookMenu, setIsBookMenu] = useState(false);
    //  --State khi chọn xong menu -> Thanh toán
    const [isPayment, setIsPayment] = useState(false);
    //  --State khi thanh toán thành công -> Finish
    const [isFinish, setIsFinish] = useState(false);

    const [noResultFound, setNoResultFound] = useState(false);

    //---------------------------------------------------------------- 
    // Modal
    const [showModal, setShowModal] = useState(false);
    const [typeModal, setTypeModal] = useState("")

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
    useEffect(() => {
        const getPartyHalls = async () => {
            try {
                const res = await PartyHallService.getPartyHalls();
                setPartyHallList(res.data.data);
            } catch (err) {
                console.log("Error getPartyHalls: ", err);
            }
        }
        getPartyHalls();
        const getPartyHallTime = async () => {
            try {
                const res = await PartyHallTimeService.getPartyHallTime();
                setPartyHallTimeList(res.data.data);
            } catch (err) {
                console.log("Error getPartyHallTime: ", err);
            }
        }
        getPartyHallTime();
        const getPartyBookingTypes = async () => {
            try {
                const res = await PartyBookingTypeService.getPartyBookingTypes();
                setPartyBookingTypeList(res.data.data);
            } catch (err) {
                console.log("Error getPartyBookingTypes: ", err);
            }
        }
        getPartyBookingTypes();
        const getPartyHallTypes = async () => {
            try {
                const res = await PartyHallTypeService.getPartyHallType();
                setPartyHallTypeList(res.data.data);
            } catch (err) {
                console.log("Error getPartyHallTypes: ", err);
            }
        }
        getPartyHallTypes();

        // Set menu
        const getSetMenuWithFoodTypeAndFoods = async () => {
            try {
                const res = await SetMenuService.getSetMenuWithFoodTypeAndFoods();
                setSetMenuList(res.data.data);
            } catch (err) {
                console.log("Error getSetMenuWithFoodTypeAndFoods: ", err.response);
            }
        }
        getSetMenuWithFoodTypeAndFoods();
    }, []);
    // HANDLE
    const handleChangeDate = (newValue) => {
        setDateBooking(newValue);
        console.log(moment(newValue).format("DD/MM/yyyy"));
    };

    const handleCheckAvailableTable = () => {
        const findPartyHall = async () => {
            try {
                const res = await PartyHallService.findPartyHall({
                    dateBooking: moment(dateBooking).format('YYYY-MM-DD'),
                    timeBooking: timeBooking,
                    typeBooking: typeBooking,
                    quantityBooking: quantityBooking,
                    partyHallType: partyHallType
                });
                const partyHallListFiltered = res.data.data;
                setPartyHallListFiltered(res.data.data);
                if (partyHallListFiltered.length > 0) {
                    dispatch(addCustomerBookingParty({ customer: customer }));
                    dispatch(chooseDayAndQuantityBookingParty({
                        dateBooking: moment(dateBooking).format('YYYY-MM-DD'),
                        timeBooking: timeBooking,
                        typeBooking: typeBooking,
                        quantityBooking: quantityBooking,
                        partyHallType: partyHallType
                    }));

                    // Update all party hall in list to state 1
                    try {
                        const updatePartyHallState = async () => {
                            const updatePartyHallStateRes = await PartyHallService.updatePartyHallState(partyHallListFiltered, 1);
                            if (updatePartyHallStateRes) {
                                // Toast
                                const dataToast = { message: "Sảnh đã được giữ trong 5 phút", type: "success" };
                                showToastFromOut(dataToast);
                                return;
                            } else {
                                // Toast
                                const dataToast = { message: updatePartyHallStateRes.data.message, type: "warning" };
                                showToastFromOut(dataToast);
                                return;
                            }
                        }
                        updatePartyHallState();
                    } catch (err) {
                        // Toast
                        const dataToast = { message: err.response.data.message, type: "danger" };
                        showToastFromOut(dataToast);
                        return;
                    }

                    setNoResultFound(false);
                    // Use Toast
                    const dataToast = { message: "Đã tìm được Sảnh phù hợp!", type: "success" };
                    showToastFromOut(dataToast);
                    setIsAvailableTable(true);
                    setMinutes(4);
                    setSeconds(59);
                } else {
                    setNoResultFound(true);
                    // Toast
                    const dataToast = { message: "Không tìm thấy Sảnh phù hợp!", type: "warning" };
                    showToastFromOut(dataToast);
                }
                console.log(res);
            } catch (err) {
                console.log("err: ", err);
                const errorMessage = err.response.data.message;
                const dataToast = { message: errorMessage, type: "danger" };
                showToastFromOut(dataToast);
            }
        }
        findPartyHall();
        handleLoading();
    }

    // Update all party hall in list to state 0 when UNMOUT: BACK TO PREVIOUS PAGE
    useEffect(() => {
        return () => {
            if (partyHallListFiltered.length > 0) {
                // Update all party hall in list to state 0
                try {
                    const updatePartyHallState = async () => {
                        const updatePartyHallStateRes = await PartyHallService.updatePartyHallState(partyHallListFiltered, 0);
                        if (!updatePartyHallStateRes) {
                            // Toast
                            const dataToast = { message: updatePartyHallStateRes.data.message, type: "warning" };
                            showToastFromOut(dataToast);
                            return;
                        }
                    }
                    updatePartyHallState();
                } catch (err) {
                    // Toast
                    const dataToast = { message: err.response.data.message, type: "danger" };
                    showToastFromOut(dataToast);
                    return;
                }
            }
        }
    }, [partyHallListFiltered]);

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
            // Update all party hall in list to state 0
            try {
                const updatePartyHallState = async () => {
                    const updatePartyHallStateRes = await PartyHallService.updatePartyHallState(partyHallListFiltered, 0);
                    if (updatePartyHallStateRes) {
                        // Toast
                        const dataToast = { message: "Thời gian giữ Sảnh đã hết!", type: "success" };
                        showToastFromOut(dataToast);
                        return;
                    } else {
                        // Toast
                        const dataToast = { message: updatePartyHallStateRes.data.message, type: "warning" };
                        showToastFromOut(dataToast);
                        return;
                    }
                }
                updatePartyHallState();
            } catch (err) {
                // Toast
                const dataToast = { message: err.response.data.message, type: "danger" };
                showToastFromOut(dataToast);
                return;
            }
        }
    }, [minutes, seconds]);

    const handleUpdatePartyHallStateTo0 = () => {
        // Update all party hall in list to state 0
        try {
            const updatePartyHallState = async () => {
                const updatePartyHallStateRes = await PartyHallService.updatePartyHallState(partyHallListFiltered, 0);
                if (!updatePartyHallStateRes) {
                    // Toast
                    const dataToast = { message: updatePartyHallStateRes.data.message, type: "warning" };
                    showToastFromOut(dataToast);
                    return;
                }
            }
            updatePartyHallState();
        } catch (err) {
            // Toast
            const dataToast = { message: err.response.data.message, type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
    };

    // Update state to 0 when close tab booking
    useEffect(() => {
        window.addEventListener('beforeunload', handleUpdatePartyHallStateTo0);
        window.addEventListener('unload', handleUpdatePartyHallStateTo0);
        return () => {
            window.removeEventListener('beforeunload', handleUpdatePartyHallStateTo0);
            window.removeEventListener('unload', handleUpdatePartyHallStateTo0);
        }
    });

    //State
    const [setMenuModal, setSetMenuModal] = useState();
    const [partyHallModal, setPartyHallModal] = useState();

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



    //Handle modal
    const handleClickViewMenu = (item) => {
        setSetMenuModal(item);
        openModal({ type: "showImageMenu" })
    };

    const handleClickViewPartyHall = (item) => {
        setPartyHallModal(item);
        openModal({ type: "showImageView" })
    };

    // --Handle Increase/ Decrease quantity
    const handleClickTableQuantity = (type) => {
        if (type === "decrease") {
            if (tableQuantity > 0) {
                setTableQuantity(tableQuantity - 1);
            } else {
                return;
            }
        } else {
            setTableQuantity(tableQuantity + 1);
        }
    };

    const handleChangeTableQuantity = (e) => {
        // Fix lỗi xóa giá trị thì tổng  = NaN
        if (e.target.value === "") {
            setTableQuantity(0);
            return;
        }
        setTableQuantity(parseInt(e.target.value));
    };

    // Change booking party
    const handleChangeBookingParty = () => {
        dispatch(logoutPartyBooking());
        handleUpdatePartyHallStateTo0();
        navigate("/restaurant");
    };

    // ACCEPT/ DECLINE - Book party hall
    const handleAcceptPartyHallAndService = () => {
        if (!partyHallRedux) {
            // Toast
            const dataToast = { message: "Bạn chưa chọn Sảnh cử hành tiệc!", type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
        if (partyServiceRedux.length === 0) {
            // Toast
            const dataToast = { message: "Bạn chưa chọn Dịch vụ cho buổi tiệc!", type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
        // Toast
        const dataToast = { message: " Chọn Sảnh & Dịch vụ thành công!", type: "success" };
        showToastFromOut(dataToast);
        // When success
        handleLoading();
        setIsBookMenu(true);
    };
    const handleDeclinePartyHallAndService = () => {
        dispatch(logoutPartyBooking());
        handleUpdatePartyHallStateTo0();
        navigate("/restaurant");
    };

    // ACCEPT - Book menu & food
    const handleAcceptMenuAndFood = () => {
        if (!setMenuRedux) {
            // Toast
            const dataToast = { message: "Bạn chưa chọn Menu cho tiệc!", type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
        if (foodListRedux.length === 0) {
            // Toast
            const dataToast = { message: "Bạn chưa chọn Món ăn chi tiết!", type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
        // Toast
        const dataToast = { message: " Chọn Menu & Món ăn thành công!", type: "success" };
        showToastFromOut(dataToast);
        // When success
        handleLoading();
        setIsPayment(true);
    };

    // Fake loading when fetch data
    const [isLoading, setIsLoading] = useState(false);
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

    // Get party hall
    const [partyHallImages, setPartyHallImages] = useState([]);
    useEffect(() => {
        const getPartyHallAndImages = async () => {
            try {
                const res = await PartyHallService.getPartyHallAndImages({
                    partyHallId: partyBooking.partyHall.party_hall_id
                });
                const result = res.data.data;
                setPartyHallImages(result.partyHallImages);
            } catch (err) {
                console.log("Error getPartyHallAndImages: ", err);
            }
        };
        getPartyHallAndImages();
    }, [partyBooking,
        partyBooking.partyHall
    ]);

    // Handle discount
    const handleDiscount = () => {
        if (discountPartyBooking) {
            // Toast
            const dataToast = { message: "Thanh toán của bạn đã được giảm giá " + discountPartyBooking.discount_percent + "% trước đó!", type: "success" };
            showToastFromOut(dataToast);
            return;
        }
        if (!discount) {
            // Toast
            const dataToast = { message: "Bạn chưa nhập Mã giảm giá!", type: "warning" };
            showToastFromOut(dataToast);
            return;
        }
        try {
            const getDiscount = async () => {
                const res = await DiscountService.getDiscountByDiscountCode(discount);
                console.log("RES: ", res);
                const discountData = res.data.data;
                if (discountData) {
                    dispatch(addDiscountBookingParty({ discount: discountData }));
                    setDiscountId(discountData.discount_id);
                    // Toast
                    const dataToast = { message: res.data.message, type: "success" };
                    showToastFromOut(dataToast);
                    return;
                } else {
                    // Toast
                    const dataToast = { message: res.data.message, type: "warning" };
                    showToastFromOut(dataToast);
                    return;
                }
            };
            getDiscount();
        } catch (err) {
            // Toast
            const dataToast = { message: err.response.data.message, type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
    };

    // STRIPE
    const [stripeToken, setStripeToken] = useState(null);
    // STRIPE --- Thanh toán
    const partyTotalDescription = "Your total is " + format_money(partyBookingTotal) + "VNĐ ~ " + traceCurrency(partyBookingTotal) + "$";

    const onToken = (token) => {
        setStripeToken(token);
    };

    useEffect(() => {
        const makeRequest = async () => {
            try {
                const res = await PaymentService.postPaymentStripe({
                    tokenId: stripeToken.id,
                    amount: traceCurrency(partyBookingTotal) * 100,
                });
                console.log(res.data);
                try {
                    const createPartyBookingOrder = async () => {
                        const bookingRes = await PartyBookingOrderService.createPartyBookingOrder({
                            partyBookingOrderPrice: partyBookingTotal,
                            partyBookingOrderSurcharge: 0,
                            partyBookingOrderTotal: partyBookingTotal,
                            partyBookingOrderNote: note,
                            discountId: discountPartyBooking ? discountPartyBooking.discount_id : 9,
                            customerId: customerId,
                            setMenuId: setMenuRedux.set_menu_id,
                            partyBookingTypeId: typeBookingRedux,

                            partyHallDetailName: firstName + " " + lastName + ": " + typeBookingName + ", " + timeBookingName + ", vào ngày " + dateBookingRedux,
                            partyHallDetailDate: moment(dateBookingRedux, 'DD/MM/YYYY').format("YYYY-MM-DD"),
                            partyHallId: partyHallRedux.party_hall_id,
                            partyHallTimeId: timeBookingRedux,

                            serviceList: partyServiceRedux,
                            foodList: foodListRedux,
                            tableQuantity: tableQuantity
                            // roomBookingOrderPrice: roomPrice,
                            // roomBookingOrderSurcharge: 0,
                            // roomBookingOrderTotal: roomTotalRoomBooking,
                            // customerId: customerId,
                            // discountId: discountId ? discountId : 9,
                            // checkinDate: moment(checkInDate).format('YYYY-MM-DD'),
                            // checkoutDate: moment(checkOutDate).format('YYYY-MM-DD'),
                            // roomId: roomId,
                            // roomBookingOrderNote: note
                        });
                        if (bookingRes) {
                            // Update all party hall in list to state 0 when finish
                            try {
                                const updatePartyHallState = async () => {
                                    const updatePartyHallStateRes = await PartyHallService.updatePartyHallState(partyHallListFiltered, 0);
                                    if (!updatePartyHallStateRes) {
                                        // Toast
                                        const dataToast = { message: updatePartyHallStateRes.data.message, type: "warning" };
                                        showToastFromOut(dataToast);
                                        return;
                                    }
                                }
                                updatePartyHallState();
                                // Sucess
                                dispatch(logoutPartyBooking());
                                setIsFinish(true);
                                handleLoading();
                                // Toast
                                const dataToast = { message: bookingRes.data.message, type: "success" };
                                showToastFromOut(dataToast);
                                return;
                            } catch (err) {
                                // Toast
                                const dataToast = { message: err.response.data.message, type: "danger" };
                                showToastFromOut(dataToast);
                                return;
                            }
                        } else {
                            // Toast
                            const dataToast = { message: bookingRes.data.message, type: "warning" };
                            showToastFromOut(dataToast);
                            return;
                        }
                    };
                    createPartyBookingOrder();
                } catch (err) {
                    // Toast
                    const dataToast = { message: err.response.data.message, type: "danger" };
                    showToastFromOut(dataToast);
                    return;
                }
            } catch (err) {
                console.log(err);
            }
        }
        stripeToken && makeRequest();
    }, [stripeToken, navigate]);

    // Payment way
    const [paymentWay, setPaymentWay] = useState();
    const handlePaymentWay = (e) => {
        setPaymentWay(e.target.value);
    };

    const showPaymentWay = (way) => {
        switch (true) {
            // TODO: Update later
            // case way === "momo": return null;
            // case way === "card": return null;
            // case way === "onStage": return null;

            case way === "stripe":
                return (
                    <div>
                        {stripeToken ? (<span>Đang xử lý...</span>) : (
                            <StripeCheckout
                                name="Hoàng Long Hotel."
                                image="https://i.ibb.co/DkbxyCK/favicon-logo.png"
                                description={partyTotalDescription}
                                amount={traceCurrency(partyBookingTotal) * 100}
                                token={onToken}
                                stripeKey={REACT_APP_STRIPE}
                            >
                                <ButtonClick
                                    disabled={minutes === 0 && seconds === 0 ? true : false}
                                    onClick={() => {
                                        handlePartyBookingOrder()
                                    }}
                                >
                                    {/* <ButtonClick style={{marginLeft: "70%"}} className="button-disable"> */}
                                    Tiến hành thanh toán
                                </ButtonClick>
                            </StripeCheckout>
                        )}
                    </div>
                );
            default:
                return (
                    <ButtonClick
                        disabled={minutes === 0 && seconds === 0 ? true : false}
                        onClick={() => {
                            handlePartyBookingOrder()
                        }}
                    >
                        {/* <ButtonClick style={{marginLeft: "70%"}} className="button-disable"> */}
                        Tiến hành thanh toán
                    </ButtonClick>
                );
        }
    };
    // Xử lý đặt tiệc
    const handlePartyBookingOrder = () => {
        if (!firstName) {
            // Toast
            const dataToast = { message: "Bạn chưa nhập first name!", type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
        if (!lastName) {
            // Toast
            const dataToast = { message: "Bạn chưa nhập last name!", type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
        if (!email) {
            // Toast
            const dataToast = { message: "Bạn chưa nhập email!", type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
        if (!phoneNumber) {
            // Toast
            const dataToast = { message: "Bạn chưa nhập số điện thoại!", type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
        if (!paymentWay) {
            // Toast
            const dataToast = { message: "Bạn chưa chọn phương thức thanh toán!", type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
        dispatch(addPartyBookingTotal({
            partyBookingTotal: partyBookingTotal
        }));
    };
    console.log("SHOW: ", partyHallListFiltered);
    return (
        <>
            {/*-- BOOK PARTY PROGRESS -- */}
            <BookPartyProgress step={isFinish ? "finish" : isPayment ? "payment" : isBookMenu ? "findMenu" : "findPlace"} />

            <div class="section padding-top-bottom z-bigger" style={{ paddingTop: "0" }}>
                <div class="container">
                    <div className="row">
                        {
                            // Finish
                            isFinish ? (
                                <div className="col-lg-12">
                                    <ModalContent>
                                        <CheckCircleRounded style={{ fontSize: "6rem", color: "var(--color-success)", margin: "auto" }} />
                                        <span style={{ color: "var(--color-success)", fontSize: "1.5rem", fontWeight: "700", letterSpacing: "2px" }}>ĐẶT TIỆC THÀNH CÔNG!</span>
                                        <H2>Cảm ơn bạn đã tin tưởng và lựa chọn <span style={{ color: "var(--color-primary)" }}>Hoàng Long Hotel &amp; Restaurant</span></H2>
                                        <Small className="text-muted">Buổi tiệc sẽ được nhanh chóng chuẩn bị một cách chỉnh chu và hoàn hảo nhất!</Small>
                                        <Link to="/restaurant" style={{ textDecoration: "none" }}>
                                            <SuccessButtonContainer>
                                                <SuccessButton><ArrowRightAltOutlined />   Quay về trang chủ sau 4 giây ...</SuccessButton>
                                            </SuccessButtonContainer>
                                        </Link>
                                    </ModalContent>
                                </div>
                            ) :
                                // When paymemt
                                isPayment ? (
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
                                                        <div className="row">
                                                            <InfomationTitle>
                                                                <p style={{ fontWeight: "bold", margin: "10px 0 0 0" }}>Chi tiết Đặt Tiệc</p>
                                                                <p style={{ fontSize: "1rem" }}>Hoàn tất Đặt tiệc bằng việc cung cấp những thông tin sau</p>
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
                                                                            placeholder="Ghi chú về buổi tiệc này này"
                                                                            value={note} onChange={(e) => setNote(e.target.value)}
                                                                        />
                                                                    </ModalChiTietItem>
                                                                </div>
                                                            </InfomationForm>
                                                        </div>
                                                        <div className="row">
                                                            <InfomationTitle>
                                                                <Title>
                                                                    <p style={{ fontWeight: "bold", margin: "10px 0 0 0" }}>Chi phí Sảnh</p>
                                                                    <p style={{ fontWeight: "bold", margin: "10px 0 0 0", fontSize: "1.3rem", color: "var(--color-primary)" }}>{format_money(partyHallTotal)} VNĐ</p>
                                                                </Title>
                                                                <p style={{ fontSize: "1rem" }}>Bạn đã lựa chọn sảnh sau để cử hành buổi tiệc</p>
                                                            </InfomationTitle>
                                                        </div>
                                                        {
                                                            partyHallRedux ? (
                                                                <>
                                                                    <CartItem>
                                                                        <Circle />
                                                                        <Course>
                                                                            <Content>
                                                                                <span style={{ width: "320px", fontWeight: "bold", color: "var(--color-dark)" }}> {partyHallRedux.party_hall_name} - {partyHallRedux.party_hall_view} </span>
                                                                                <span style={{ fontWeight: "bold", color: "var(--color-primary)", width: "145px", textAlign: "right" }}>{format_money(partyHallRedux.party_hall_price)} VNĐ</span>
                                                                            </Content>
                                                                        </Course>
                                                                    </CartItem>
                                                                    <ImgContainer className="row" style={{ marginTop: "15px" }}>
                                                                        <MoreImage >
                                                                            <SliderImage image={partyHallImages} />
                                                                        </MoreImage>
                                                                    </ImgContainer>
                                                                </>
                                                            ) : null
                                                        }


                                                        {/* List dịch vụ */}
                                                        <div className="row">
                                                            <InfomationTitle>
                                                                <Title>
                                                                    <p style={{ fontWeight: "bold", margin: "10px 0 0 0" }}>Chi phí Dịch vụ</p>
                                                                    <p style={{ fontWeight: "bold", margin: "10px 0 0 0", fontSize: "1.3rem", color: "var(--color-primary)" }}>{format_money(partyServiceTotal)} VNĐ</p>
                                                                </Title>
                                                                <p style={{ fontSize: "1rem" }}>Tổng chi phí cho tất cả dịch vụ sau đây</p>
                                                            </InfomationTitle>
                                                        </div>
                                                        {
                                                            partyServiceRedux ? (
                                                                partyServiceRedux.map((service, key) => {
                                                                    return (
                                                                        <CartItem>
                                                                            <Circle />
                                                                            <Course>
                                                                                <Content>
                                                                                    <span style={{ width: "320px", fontWeight: "bold", color: "var(--color-dark)" }}> {service.party_service_name} </span>
                                                                                    <span style={{ fontWeight: "400", color: "var(--color-primary)", width: "145px", textAlign: "right" }}>{format_money(service.party_service_price)} VNĐ</span>
                                                                                </Content>
                                                                            </Course>
                                                                        </CartItem>
                                                                    )
                                                                })
                                                            ) : null
                                                        }
                                                        {/* <CartItem>
                                                            <Circle />
                                                            <Course>
                                                                <Content>
                                                                    <span style={{ width: "320px", fontWeight: "bold", color: "var(--color-dark)" }}> Hoa tươi </span>
                                                                    <span style={{ fontWeight: "400", color: "var(--color-primary)", width: "145px", textAlign: "right" }}>200.000 VNĐ</span>
                                                                </Content>
                                                            </Course>
                                                        </CartItem>
                                                        <CartItem>
                                                            <Circle />
                                                            <Course>
                                                                <Content>
                                                                    <span style={{ width: "320px", fontWeight: "bold", color: "var(--color-dark)" }}> Bánh cưới + Rượu sampal </span>
                                                                    <span style={{ fontWeight: "400", color: "var(--color-primary)", width: "145px", textAlign: "right" }}>200.000 VNĐ</span>
                                                                </Content>
                                                            </Course>
                                                        </CartItem>
                                                        <CartItem>
                                                            <Circle />
                                                            <Course>
                                                                <Content>
                                                                    <span style={{ width: "320px", fontWeight: "bold", color: "var(--color-dark)" }}> MC ca hót </span>
                                                                    <span style={{ fontWeight: "400", color: "var(--color-primary)", width: "145px", textAlign: "right" }}>200.000 VNĐ</span>
                                                                </Content>
                                                            </Course>
                                                        </CartItem> */}

                                                        {/* List Món ăn */}
                                                        <div className="row">
                                                            <InfomationTitle>
                                                                <p style={{ fontWeight: "bold", margin: "10px 0 0 0" }}>Chi tiết Menu</p>
                                                                <p style={{ fontSize: "1rem" }}>Tất cả những món ăn mà bạn đã chọn như sau</p>
                                                            </InfomationTitle>
                                                        </div>
                                                        {
                                                            foodListRedux.length > 0 ? (
                                                                foodListRedux.map((food, key) => {
                                                                    return (
                                                                        <CartItem>
                                                                            <CircleService />
                                                                            <Course>
                                                                                <Content>
                                                                                    <span style={{ width: "360px", fontWeight: "bold", color: "var(--color-dark)" }}> {food.food_name} </span>
                                                                                    <img src={food.food_image} style={{ width: "52px", height: "52px", objectFit: "cover" }} />
                                                                                </Content>
                                                                                <span style={{ fontWeight: "400" }}>{food.food_type_name}</span>
                                                                            </Course>
                                                                        </CartItem>
                                                                    )
                                                                })
                                                            ) : null
                                                        }
                                                        {/* <CartItem>
                                                            <Circle />
                                                            <Course>
                                                                <Content>
                                                                    <span style={{ width: "320px", fontWeight: "bold", color: "var(--color-dark)" }}>  Món Tráng miệng </span>
                                                                    <span style={{ fontWeight: "400", color: "var(--color-primary)", width: "145px", textAlign: "right" }}>200.000 VNĐ</span>
                                                                </Content>
                                                                <span style={{ fontWeight: "400" }}><span style={{ color: "var(--color-primary)" }}>12</span> x Gè rén</span>
                                                            </Course>
                                                        </CartItem>
                                                        <CartItem>
                                                            <Circle />
                                                            <Course>
                                                                <Content>
                                                                    <span style={{ width: "320px", fontWeight: "bold", color: "var(--color-dark)" }}> Món Cơm-Mì-Lẩu </span>
                                                                    <span style={{ fontWeight: "400", color: "var(--color-primary)", width: "145px", textAlign: "right" }}>200.000 VNĐ</span>
                                                                </Content>
                                                                <span style={{ fontWeight: "400" }}><span style={{ color: "var(--color-primary)" }}>12</span> x Gè rén</span>
                                                            </Course>
                                                        </CartItem>
                                                        <CartItem>
                                                            <Circle />
                                                            <Course>
                                                                <Content>
                                                                    <span style={{ width: "320px", fontWeight: "bold", color: "var(--color-dark)" }}> Món thịt </span>
                                                                    <span style={{ fontWeight: "400", color: "var(--color-primary)", width: "145px", textAlign: "right" }}>200.000 VNĐ</span>
                                                                </Content>
                                                                <span style={{ fontWeight: "400" }}><span style={{ color: "var(--color-primary)" }}>12</span> x Gè rén</span>
                                                            </Course>
                                                        </CartItem> */}

                                                        {/* Tổng chi phí menu */}
                                                        <div className="row">
                                                            <InfomationTitle>
                                                                <Title>
                                                                    <p style={{ fontWeight: "bold", margin: "10px 0 0 0" }}>Chi phí Món ăn</p>
                                                                    <p style={{ fontWeight: "bold", margin: "10px 0 0 0", fontSize: "1.3rem", color: "var(--color-primary)" }}>{format_money(setMenuTotal)} VNĐ</p>
                                                                </Title>
                                                                <p style={{ fontSize: "1rem" }}>Tổng chi phí dựa vào số lượng bàn tiệc</p>
                                                            </InfomationTitle>
                                                        </div>

                                                        <BookingInfoDetailRow className="row">
                                                            <BookingInfoDetailRowMd5 className="col-md-5">
                                                                <DayTitle style={{ fontSize: "1.1rem", color: "var(--color-dark)" }}>Chi phí một mâm</DayTitle>
                                                                <DayDetail style={{ fontSize: "1.3rem", color: "var(--color-primary)" }}>{format_money(setMenuTotal)} VNĐ</DayDetail>
                                                            </BookingInfoDetailRowMd5>
                                                            <BookingInfoDetailRowMd2 className="col-md-2">
                                                                <CelebrationOutlined style={{ color: "var(--color-primary)" }} />
                                                            </BookingInfoDetailRowMd2>
                                                            <BookingInfoDetailRowMd5 className="col-md-5">
                                                                <DayTitle style={{ fontSize: "1.1rem", color: "var(--color-dark)" }}>Số bàn tiệc</DayTitle>
                                                                <DayDetail>
                                                                    <BookingNumberRow className="row">
                                                                        <BookingRestaurantQuantity className="quantity">
                                                                            <BookingRestaurantQuantityButton className="video-button"
                                                                                onClick={() => handleClickTableQuantity("decrease")}
                                                                                style={{ cursor: "pointer", marginRight: "10px" }}
                                                                            >
                                                                                <Remove />
                                                                            </BookingRestaurantQuantityButton>
                                                                            <BookingRestaurantQuantityInput
                                                                                style={{ backgroundColor: "white", color: "var(--color-dark)" }}
                                                                                type="number"
                                                                                min={1}
                                                                                max={200}
                                                                                step={1}
                                                                                value={tableQuantity}
                                                                                onChange={(e) => handleChangeTableQuantity(e)}
                                                                                onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                                                                            />
                                                                            <BookingRestaurantQuantityButton className="video-button"
                                                                                onClick={() => handleClickTableQuantity("increase")}
                                                                                style={{ cursor: "pointer", marginLeft: "10px" }}
                                                                            >
                                                                                <Add />
                                                                            </BookingRestaurantQuantityButton>
                                                                        </BookingRestaurantQuantity>
                                                                    </BookingNumberRow>
                                                                </DayDetail>
                                                            </BookingInfoDetailRowMd5>
                                                        </BookingInfoDetailRow>

                                                        {/* Giảm giá */}
                                                        <LeftRow className="row">
                                                            <div className="col-md-12">
                                                                <InfomationTitle>
                                                                    <p style={{ fontWeight: "bold", margin: "10px 0 0 0" }}>Áp dụng mã giảm giá</p>
                                                                    <p style={{ fontSize: "1rem" }}>Mỗi mã giảm giá chỉ được dùng duy nhất cho một thanh toán.</p>
                                                                </InfomationTitle>
                                                            </div>
                                                            <LeftDiscount className='col-md-12'>
                                                                <Input className='col-md-5' type="text" value={discount} onChange={(e) => setDiscount(e.target.value)} />
                                                                <ButtonClick className='col-md-4' style={{ margin: "0px 0px 0px 20px", height: "40px" }}
                                                                    onClick={() => handleDiscount()}
                                                                >
                                                                    {/* <ButtonClick style={{marginLeft: "70%"}} className="button-disable"> */}
                                                                    Áp dụng mã giảm giá
                                                                </ButtonClick>
                                                            </LeftDiscount>
                                                        </LeftRow>


                                                        {/* Total money */}
                                                        <TotalMoneyRow className="row">
                                                            <TotalMoney>
                                                                <TotalMoneySpan>Tổng cộng: </TotalMoneySpan>
                                                                <TotalMoneyBeforeH3>{format_money(partyBookingTotal)}<b style={{ marginLeft: "5px", marginBottom: "10px" }}><u> VNĐ</u></b></TotalMoneyBeforeH3>
                                                                {
                                                                    discountPartyBooking ? (
                                                                        <TotalMoneyH5>
                                                                            Đã áp dụng mã giảm giá
                                                                        </TotalMoneyH5>
                                                                    ) : (
                                                                        null
                                                                    )
                                                                }
                                                            </TotalMoney>
                                                        </TotalMoneyRow>

                                                        {/* Phương thức thanh toán */}
                                                        <LeftRow className="row" style={{ marginTop: "40px" }}>
                                                            <div className="col-md-12">
                                                                <InfomationTitle>
                                                                    <p style={{ fontWeight: "bold", margin: "10px 0 0 0" }}>Phương thức thanh toán</p>
                                                                    <p style={{ fontSize: "1rem" }}>Quý khách có thể chọn một trong các phương thức sau để hoàn tất đặt phòng.</p>
                                                                </InfomationTitle>
                                                            </div>
                                                            <LeftWayPayment className='col-md-12'>
                                                                <PaymentUl className="list">
                                                                    <PaymentLi className="list__item">
                                                                        <PaymentLabel className="row label--checkbox">
                                                                            <PaymentWay>
                                                                                <PaymentCol9 className="col-md-5">
                                                                                    <InputRadio
                                                                                        type="radio"
                                                                                        name="payment"
                                                                                        value="momo"
                                                                                        className="checkbox"
                                                                                        onClick={(e) => {
                                                                                            handlePaymentWay(e)
                                                                                        }}
                                                                                    />
                                                                                    <PaymentName>
                                                                                        Momo
                                                                                    </PaymentName>
                                                                                </PaymentCol9>
                                                                                <PaymentImgContainer className="col-md-3">
                                                                                    <PaymentImg src={momoImage} alt="" />
                                                                                </PaymentImgContainer>
                                                                            </PaymentWay>
                                                                            <PaymentDescription>
                                                                                <PaymentDescriptionP>
                                                                                    Thanh toán qua ví điện tử Momo.
                                                                                </PaymentDescriptionP>
                                                                            </PaymentDescription>
                                                                        </PaymentLabel>
                                                                    </PaymentLi>
                                                                    <PaymentLi className="list__item">
                                                                        <PaymentLabel className="row label--checkbox">
                                                                            <PaymentWay>
                                                                                <PaymentCol9 className="col-md-5">
                                                                                    <InputRadio
                                                                                        type="radio"
                                                                                        name="payment"
                                                                                        value="stripe"
                                                                                        className="checkbox"
                                                                                        onClick={(e) => {
                                                                                            handlePaymentWay(e)
                                                                                        }}
                                                                                    />
                                                                                    <PaymentName>
                                                                                        Stripe
                                                                                    </PaymentName>
                                                                                </PaymentCol9>
                                                                                <PaymentImgContainer className="col-md-3">
                                                                                    <PaymentImg src={stripeImage} alt="" />
                                                                                </PaymentImgContainer>
                                                                            </PaymentWay>
                                                                            <PaymentDescription>
                                                                                <PaymentDescriptionP>
                                                                                    Thanh toán qua Stripe. Chấp nhận tất cả các thẻ tín dụng và thẻ ghi nợ chính.
                                                                                </PaymentDescriptionP>
                                                                            </PaymentDescription>
                                                                        </PaymentLabel>
                                                                    </PaymentLi>
                                                                    <PaymentLi className="list__item">
                                                                        <PaymentLabel className="row label--checkbox">
                                                                            <PaymentWay>
                                                                                <PaymentCol9 className="col-md-5">
                                                                                    <InputRadio
                                                                                        type="radio"
                                                                                        name="payment"
                                                                                        value="card"
                                                                                        className="checkbox"
                                                                                        onClick={(e) => {
                                                                                            handlePaymentWay(e)
                                                                                        }}
                                                                                    />
                                                                                    <PaymentName>
                                                                                        Chuyển khoản ngân hàng
                                                                                    </PaymentName>
                                                                                </PaymentCol9>
                                                                                <PaymentImgContainer className="col-md-3">
                                                                                    <PaymentImg src={cardImage} alt="" />
                                                                                </PaymentImgContainer>
                                                                            </PaymentWay>
                                                                            <PaymentDescription>
                                                                                <PaymentDescriptionP>
                                                                                    Thanh toán qua chuyển khoản ngân hàng trực tiếp.
                                                                                </PaymentDescriptionP>
                                                                            </PaymentDescription>
                                                                        </PaymentLabel>
                                                                    </PaymentLi>
                                                                    <PaymentLi className="list__item" >
                                                                        <PaymentLabel className="row label--checkbox">
                                                                            <PaymentWay>
                                                                                <PaymentCol9 className="col-md-5">
                                                                                    <InputRadio
                                                                                        type="radio"
                                                                                        name="payment"
                                                                                        value="onStage"
                                                                                        className="checkbox"
                                                                                        onClick={(e) => {
                                                                                            handlePaymentWay(e)
                                                                                        }}
                                                                                    />
                                                                                    <PaymentName>
                                                                                        Thanh toán khi đến nơi
                                                                                    </PaymentName>
                                                                                </PaymentCol9>
                                                                                <PaymentImgContainer className="col-md-3">
                                                                                    <PaymentImg src={cash} alt="" style={{ backgroundColor: "white" }} />
                                                                                </PaymentImgContainer>
                                                                            </PaymentWay>
                                                                            <PaymentDescription>
                                                                                <PaymentDescriptionP>
                                                                                    Thanh toán khi đến nơi. Thanh toán bằng thẻ tín dụng hoặc tiền mặt khi bạn đến nơi.
                                                                                </PaymentDescriptionP>
                                                                            </PaymentDescription>
                                                                        </PaymentLabel>
                                                                    </PaymentLi>
                                                                </PaymentUl>
                                                            </LeftWayPayment>
                                                        </LeftRow>

                                                        {/* Button */}
                                                        <Button className="row" style={{ marginTop: "30px" }}>
                                                            <ButtonContainer>
                                                                {showPaymentWay(paymentWay)}
                                                            </ButtonContainer>
                                                        </Button>
                                                    </div>
                                                </Box2>
                                            )}
                                    </div>
                                )
                                    :
                                    // When book menu
                                    isBookMenu ? (
                                        // Left book menu
                                        < div className="col-lg-8">
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
                                                                {
                                                                    setMenuList.length > 0 ? (
                                                                        setMenuList.map((setMenu, key) => {
                                                                            return (
                                                                                <MenuItem onClick={() => handleClickViewMenu(setMenu)}>
                                                                                    <MenuImage src={setMenu.setMenu.set_menu_image} />
                                                                                    <MenuInfo>
                                                                                        <MenuTitle>{setMenu.setMenu.set_menu_name}</MenuTitle>
                                                                                        <MenuDescription>
                                                                                            {setMenu.setMenu.set_menu_description}
                                                                                        </MenuDescription>
                                                                                    </MenuInfo>
                                                                                </MenuItem>
                                                                            )
                                                                        })
                                                                    ) : null
                                                                }
                                                                {/* <MenuItem onClick={() => handleClickMenu(menu1)}>
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
                                                                </MenuItem> */}
                                                            </Carousel>

                                                            {/* Detail Service */}
                                                            <div className="row">
                                                                <InfomationTitle>
                                                                    <p style={{ fontWeight: "bold", margin: "10px 0 0 0" }}>Những món ăn bạn đã chọn</p>
                                                                    {
                                                                        foodListRedux.length > 0 ? (
                                                                            foodListRedux.map((food, key) => {
                                                                                return (
                                                                                    <CartItem>
                                                                                        <CircleService />
                                                                                        <Course>
                                                                                            <Content>
                                                                                                <span style={{ width: "360px", fontWeight: "bold", color: "var(--color-dark)" }}> {food.food_name} </span>
                                                                                                <img src={food.food_image} style={{ width: "52px", height: "52px", objectFit: "cover" }} />
                                                                                            </Content>
                                                                                            <span style={{ fontWeight: "400" }}>{food.food_type_name}</span>
                                                                                        </Course>
                                                                                    </CartItem>
                                                                                )
                                                                            })
                                                                        ) : (
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
                                                                                <EmptyContent class="EmptyStatestyles__StyledTitle-sc-qsuc29-2 gAMClh">Chưa có dịch vụ nào được chọn</EmptyContent>
                                                                            </EmptyItem>
                                                                        )
                                                                    }
                                                                </InfomationTitle>
                                                            </div>
                                                            {/* Remind service */}
                                                            {
                                                                setMenuRedux ? (
                                                                    <div className="row">
                                                                        <InfomationTitle>
                                                                            <p style={{ fontWeight: "300", margin: "15px 0 0 0", fontSize: "1.1rem" }}>Bạn đồng ý lựa chọn <b style={{ color: "var(--color-primary)" }}>{setMenuRedux.set_menu_name}</b> với những món ăn trên ?</p>
                                                                            {/* <p style={{ fontSize: "1rem" }}>Dưới đây là những sảnh cử hành phù hợp</p> */}
                                                                        </InfomationTitle>
                                                                    </div>
                                                                ) : null
                                                            }

                                                            {/* Button service */}
                                                            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: "20px" }}>
                                                                <BookButtonContainer>
                                                                    <BookButton
                                                                        onClick={() => handleAcceptMenuAndFood()}
                                                                    >Đồng ý</BookButton>
                                                                </BookButtonContainer>

                                                                <BookButtonContainer>
                                                                    <BookButton
                                                                        onClick={() => handleDeclinePartyHallAndService()}
                                                                    >Hủy đặt tiệc</BookButton>
                                                                </BookButtonContainer>
                                                            </div>
                                                        </div>
                                                    </Box2>
                                                )
                                            }
                                        </div>
                                    ) : (
                                        // Left book place
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
                                                ) :
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
                                                            partyHallListFiltered.length > 0 ?
                                                                (
                                                                    <Box2>
                                                                        <div className="col-lg-12">
                                                                            <div className="row">
                                                                                <InfomationTitle>
                                                                                    <p style={{ fontWeight: "bold", margin: "10px 0 0 0" }}>Lựa chọn Sảnh cử hành tiệc &amp; Dịch vụ đi kèm</p>
                                                                                    <p style={{ fontSize: "1rem" }}>Dưới đây là <span style={{ color: "var(--color-primary)", fontWeight: "bold" }}>{partyHallListFiltered.length} Sảnh cử hành</span> phù hợp</p>
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
                                                                            >{
                                                                                    partyHallListFiltered ? (
                                                                                        partyHallListFiltered.map((partyHall, key) => {
                                                                                            return (
                                                                                                <ViewItem onClick={() => handleClickViewPartyHall(partyHall)} style={{ justifyContent: "flex-start", paddingTop: "15px", height: "100%", backgroundColor: "#333" }}>
                                                                                                    <InfoDark>
                                                                                                        <IconDark>
                                                                                                            <CheckOutlined style={{ color: "var(--color-primary)" }} />
                                                                                                            <SpanDark>Chọn sảnh này</SpanDark>
                                                                                                        </IconDark>
                                                                                                    </InfoDark>
                                                                                                    <ViewImage src={partyHall.party_hall_image_content} />
                                                                                                    <ViewInfo>
                                                                                                        <ViewTitle>{partyHall.party_hall_name} &#8211; {partyHall.party_hall_view}</ViewTitle>
                                                                                                        <ViewDescription>
                                                                                                            {partyHall.party_hall_description}
                                                                                                        </ViewDescription>
                                                                                                    </ViewInfo>
                                                                                                </ViewItem>
                                                                                            )
                                                                                        })
                                                                                    ) : null
                                                                                }
                                                                            </Carousel>

                                                                            {/* Detail Service */}
                                                                            <div className="row">
                                                                                <InfomationTitle>
                                                                                    <p style={{ fontWeight: "bold", margin: "10px 0 0 0" }}>Những dịch vụ đã chọn</p>
                                                                                    {
                                                                                        partyServiceRedux.length > 0 ? (
                                                                                            partyServiceRedux.map((service, key) => {
                                                                                                return (
                                                                                                    <CartItem>
                                                                                                        <CircleService />
                                                                                                        <Course>
                                                                                                            <Content>
                                                                                                                <span style={{ width: "320px", fontWeight: "bold", color: "var(--color-dark)" }}> {service.party_service_name} </span>
                                                                                                                <span style={{ fontWeight: "400", color: "var(--color-primary)", width: "145px", textAlign: "right" }}>{format_money(service.party_service_price)} VNĐ</span>
                                                                                                            </Content>
                                                                                                            {/* <span style={{ fontWeight: "400" }}><span style={{ color: "var(--color-primary)" }}>12</span> x Gè rén</span> */}
                                                                                                        </Course>
                                                                                                    </CartItem>
                                                                                                )
                                                                                            })
                                                                                        ) : (
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
                                                                                                <EmptyContent class="EmptyStatestyles__StyledTitle-sc-qsuc29-2 gAMClh">Chưa có dịch vụ nào được chọn</EmptyContent>
                                                                                            </EmptyItem>
                                                                                        )
                                                                                    }
                                                                                </InfomationTitle>
                                                                            </div>

                                                                            {/* Remind service */}
                                                                            {
                                                                                partyHallRedux ? (
                                                                                    <div className="row">
                                                                                        <InfomationTitle>
                                                                                            <p style={{ fontWeight: "300", margin: "15px 0 0 0", fontSize: "1.1rem" }}>Bạn đồng ý lựa chọn <b style={{ color: "var(--color-primary)" }}>{partyHallRedux.party_hall_name} - {partyHallRedux.party_hall_view}</b> và những dịch vụ trên ?</p>
                                                                                            {/* <p style={{ fontSize: "1rem" }}>Dưới đây là những sảnh cử hành phù hợp</p> */}
                                                                                        </InfomationTitle>
                                                                                    </div>
                                                                                ) : null
                                                                            }


                                                                            {/* Button service */}
                                                                            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: "20px" }}>
                                                                                <BookButtonContainer>
                                                                                    <BookButton
                                                                                        onClick={() => handleAcceptPartyHallAndService()}
                                                                                    >Đồng ý</BookButton>
                                                                                </BookButtonContainer>

                                                                                <Link to={"/restaurant"}>
                                                                                    <BookButtonContainer>
                                                                                        <BookButton
                                                                                            onClick={() => handleDeclinePartyHallAndService()}
                                                                                        >Hủy đặt tiệc</BookButton>
                                                                                    </BookButtonContainer>
                                                                                </Link>
                                                                            </div>
                                                                        </div>
                                                                    </Box2>
                                                                )
                                                                : (
                                                                    partyHallList ? (
                                                                        <Box2>
                                                                            <div className="col-lg-12">
                                                                                <div className="row">
                                                                                    <InfomationTitle>
                                                                                        <p style={{ fontWeight: "bold", margin: "10px 0 0 0" }}>Dưới đây là tất cả các Sảnh cưới tại Hoàng Long.</p>
                                                                                        <p style={{ fontSize: "1rem" }}>Hãy <span style={{ color: "var(--color-primary)", fontWeight: "bold" }}>Check Available</span> để tìm cho mình Sảnh phù hợp nhé!</p>
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
                                                                                >{
                                                                                        partyHallList ? (
                                                                                            partyHallList.map((partyHall, key) => {
                                                                                                return (
                                                                                                    <ViewItem style={{ justifyContent: "flex-start", paddingTop: "15px", height: "100%", backgroundColor: "#333" }}>
                                                                                                        <ViewImage src={partyHall.party_hall_image_content} />
                                                                                                        <ViewInfo>
                                                                                                            <ViewTitle>{partyHall.party_hall_name} &#8211; {partyHall.party_hall_view}</ViewTitle>
                                                                                                            <ViewDescription>
                                                                                                                {partyHall.party_hall_description}
                                                                                                            </ViewDescription>
                                                                                                        </ViewInfo>
                                                                                                    </ViewItem>
                                                                                                )
                                                                                            })
                                                                                        ) : null
                                                                                    }
                                                                                </Carousel>
                                                                            </div>
                                                                        </Box2>
                                                                    ) : null
                                                                )
                                                        )
                                            }
                                        </div>
                                    )
                        }

                        {/* Right */}
                        <div className="col-lg-4 order-first order-lg-last mt-4">
                            {
                                isFinish ? null :
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
                                                            <DayDetail>{dateBookingRedux}</DayDetail>
                                                        </BookingInfoDetailRowMd5>
                                                        <BookingInfoDetailRowMd2 className="col-md-2">
                                                            <CelebrationOutlined style={{ color: "var(--color-primary)" }} />
                                                        </BookingInfoDetailRowMd2>
                                                        <BookingInfoDetailRowMd5 className="col-md-5">
                                                            <DayTitle>Thời gian cử hành</DayTitle>
                                                            <DayDetail>
                                                                {
                                                                    partyHallTimeList ? (
                                                                        partyHallTimeList.map((partyHallTime, key) => {
                                                                            if (partyHallTime.party_hall_time_id === timeBookingRedux)
                                                                                return partyHallTime.party_hall_time_name;
                                                                        })
                                                                    ) : null
                                                                }
                                                            </DayDetail>
                                                        </BookingInfoDetailRowMd5>
                                                    </BookingInfoDetailRow>
                                                </BookingInfoDetail>

                                                <BookingNumber className="col-md-12">
                                                    <BookingNumberRow className="row">
                                                        <BookingNumberRowMd5 className="col-md-6">Số lượng khách: <b style={{ color: "var(--color-primary)", marginLeft: "5px" }}> {quantityBookingRedux}</b></BookingNumberRowMd5>
                                                    </BookingNumberRow>
                                                </BookingNumber>
                                            </BookingInfo>

                                            <PartyInformation className="row">
                                                <PartyInformationTitle className="col-md-12">Thông tin Sảnh</PartyInformationTitle>
                                                <PartyInformationDetail className="col-md-12">
                                                    <PartyInformationRow className="row">
                                                        <PartyDetailTitle className="col-md-6">Loại tiệc</PartyDetailTitle>
                                                        <PartyDetailPrice className="col-md-6">
                                                            {
                                                                partyBookingTypeList ? (
                                                                    partyBookingTypeList.map((partyBookingType, key) => {
                                                                        if (partyBookingType.party_booking_type_id === typeBookingRedux)
                                                                            return partyBookingType.party_booking_type_name;
                                                                    })
                                                                ) : null
                                                            }
                                                        </PartyDetailPrice>
                                                    </PartyInformationRow>
                                                    <PartyInformationRow className="row">
                                                        <PartyDetailTitle className="col-md-6">Vị trí</PartyDetailTitle>
                                                        <PartyDetailPrice className="col-md-6">
                                                            {
                                                                partyHallTypeList ? (
                                                                    partyHallTypeList.map((partyHallType, key) => {
                                                                        if (partyHallType.party_hall_type_id === partyHallTypeRedux)
                                                                            return partyHallType.party_hall_type_name;
                                                                    })
                                                                ) : null
                                                            }
                                                        </PartyDetailPrice>
                                                    </PartyInformationRow>
                                                </PartyInformationDetail>
                                            </PartyInformation>

                                            <Button className="row">
                                                <ButtonContainer style={{ paddingTop: "40px" }}>
                                                    <ButtonClick
                                                        onClick={() => handleChangeBookingParty()}
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
                                                                                label="Ngày đãi tiệc"
                                                                                inputFormat="dd/MM/yyyy"
                                                                                minDate={new Date()}
                                                                                value={dateBooking}
                                                                                onChange={(newValue) => handleChangeDate(newValue)}
                                                                                renderInput={(params) => <TextField {...params} />}
                                                                                InputProps={{ sx: { '& .MuiSvgIcon-root': { color: "white" } } }}
                                                                            />
                                                                        </Stack>
                                                                    </LocalizationProvider>
                                                                </InputDateRangeFormItem>
                                                            </div>
                                                            {/* <div className="col-12 pt-4">
                                                                <InputDateRangeFormItem>
                                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                                        <Stack spacing={3}>
                                                                            <TimePicker
                                                                                label="Thời gian cử hành"
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
                                                            </div> */}
                                                            <div className="col-12">
                                                                <div className="row">
                                                                    <div className="col-12 pt-4">
                                                                        <BookingNumberNiceSelect name="time" className={isSelectTime ? "nice-select wide open" : "nice-select wide"} onClick={() => setIsSelectTime(prev => !prev)}>
                                                                            <BookingNumberNiceSelectSpan className='current'>{
                                                                                timeBooking ? (
                                                                                    partyHallTimeList.map((partyHallTime, key) => {
                                                                                        if (partyHallTime.party_hall_time_id === timeBooking)
                                                                                            return (
                                                                                                partyHallTime.party_hall_time_name
                                                                                            )
                                                                                    })
                                                                                ) : "Thời gian cử hành"
                                                                            }</BookingNumberNiceSelectSpan>
                                                                            <BookingNumberNiceSelectUl className='list'>
                                                                                <BookingNumberNiceSelectLi className='option focus selected'>Vui lòng chọn</BookingNumberNiceSelectLi>
                                                                                {
                                                                                    partyHallTimeList ? (
                                                                                        partyHallTimeList.map((partyHallTime, key) => {
                                                                                            return (
                                                                                                <BookingNumberNiceSelectLi
                                                                                                    onClick={() => {
                                                                                                        setTimeBooking(partyHallTime.party_hall_time_id);
                                                                                                        setTimeBookingName(partyHallTime.party_hall_time_name);
                                                                                                    }}
                                                                                                    className='option'
                                                                                                >
                                                                                                    {partyHallTime.party_hall_time_name}
                                                                                                </BookingNumberNiceSelectLi>
                                                                                            )
                                                                                        })
                                                                                    ) : null
                                                                                }
                                                                            </BookingNumberNiceSelectUl>
                                                                        </BookingNumberNiceSelect>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <div className="row">
                                                        <div className="col-12 pt-4">
                                                            <BookingNumberNiceSelect name="type" className={isSelectType ? "nice-select wide open" : "nice-select wide"} onClick={() => setIsSelectType(prev => !prev)}>
                                                                <BookingNumberNiceSelectSpan className='current'>{
                                                                    typeBooking ? (
                                                                        partyBookingTypeList.map((partyBookingType, key) => {
                                                                            if (partyBookingType.party_booking_type_id === typeBooking)
                                                                                return (
                                                                                    partyBookingType.party_booking_type_name
                                                                                )
                                                                        })
                                                                    ) : "Loại tiệc"
                                                                }</BookingNumberNiceSelectSpan>
                                                                <BookingNumberNiceSelectUl className='list'>
                                                                    <BookingNumberNiceSelectLi className='option focus selected'>Vui lòng chọn</BookingNumberNiceSelectLi>
                                                                    {
                                                                        partyBookingTypeList ? (
                                                                            partyBookingTypeList.map((partyBookingType, key) => {
                                                                                return (
                                                                                    <BookingNumberNiceSelectLi
                                                                                        onClick={() => {
                                                                                            setTypeBooking(partyBookingType.party_booking_type_id);
                                                                                            setTypeBookingName(partyBookingType.party_booking_type_name);
                                                                                        }}
                                                                                        className='option'
                                                                                    >
                                                                                        {partyBookingType.party_booking_type_name}
                                                                                    </BookingNumberNiceSelectLi>
                                                                                )
                                                                            })
                                                                        ) : null
                                                                    }
                                                                </BookingNumberNiceSelectUl>
                                                            </BookingNumberNiceSelect>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <div className="row">
                                                        <div className="col-12 pt-4">
                                                            <BookingNumberNiceSelect name="quantity" className={isSelectQuantity ? "nice-select wide open" : "nice-select wide"} onClick={() => setIsSelectQuantity(prev => !prev)}>
                                                                <BookingNumberNiceSelectSpan className='current'>{quantityBooking ? quantityBooking + " khách" : "Số lượng khách"}</BookingNumberNiceSelectSpan>
                                                                <BookingNumberNiceSelectUl className='list'>
                                                                    <BookingNumberNiceSelectLi className='option focus selected'>Vui lòng chọn</BookingNumberNiceSelectLi>
                                                                    <BookingNumberNiceSelectLi onClick={() => setQuantityBooking(prev => 100)} className='option'>100 khách</BookingNumberNiceSelectLi>
                                                                    <BookingNumberNiceSelectLi onClick={() => setQuantityBooking(prev => 200)} className='option'>200 khách</BookingNumberNiceSelectLi>
                                                                    <BookingNumberNiceSelectLi onClick={() => setQuantityBooking(prev => 300)} className='option'>300 khách</BookingNumberNiceSelectLi>
                                                                    <BookingNumberNiceSelectLi onClick={() => setQuantityBooking(prev => 400)} className='option'>400 khách</BookingNumberNiceSelectLi>
                                                                    <BookingNumberNiceSelectLi onClick={() => setQuantityBooking(prev => 500)} className='option'>500 khách</BookingNumberNiceSelectLi>
                                                                    <BookingNumberNiceSelectLi onClick={() => setQuantityBooking(prev => 600)} className='option'>600 khách</BookingNumberNiceSelectLi>
                                                                    <BookingNumberNiceSelectLi onClick={() => setQuantityBooking(prev => 700)} className='option'>700 khách</BookingNumberNiceSelectLi>
                                                                    <BookingNumberNiceSelectLi onClick={() => setQuantityBooking(prev => 800)} className='option'>800 khách</BookingNumberNiceSelectLi>
                                                                    <BookingNumberNiceSelectLi onClick={() => setQuantityBooking(prev => 900)} className='option'>900 khách</BookingNumberNiceSelectLi>
                                                                    <BookingNumberNiceSelectLi onClick={() => setQuantityBooking(prev => 1000)} className='option'>Trên 1000 khách</BookingNumberNiceSelectLi>
                                                                </BookingNumberNiceSelectUl>
                                                            </BookingNumberNiceSelect>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-6 col-lg-12 pt-5">
                                                    <h6 className="color-white mb-3">Bộ lọc:</h6>
                                                    <ul className="list">
                                                        {
                                                            partyHallTypeList ? (
                                                                partyHallTypeList.map((partyHallType, key) => {
                                                                    return (
                                                                        <li className="list__item"
                                                                            onClick={() => setPartyHallType(partyHallType.party_hall_type_id)}
                                                                        >
                                                                            <label className="label--checkbox">
                                                                                <input type="radio" className="checkbox" name="partyHallType" />
                                                                                {partyHallType.party_hall_type_name}
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
                                                                TÌM KIẾM SẢNH
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
            </div >
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
                setMenuModal={setMenuModal}   //Đối tượng menu trong Modal
                partyHallModal={partyHallModal}   //Đối tượng party hall trong Modal
                showToastFromOut={showToastFromOut}
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