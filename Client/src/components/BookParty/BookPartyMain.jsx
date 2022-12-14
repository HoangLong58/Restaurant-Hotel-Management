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
import { addCustomerBookingParty, addDiscountBookingParty, addPartyBookingTotal, chooseDayAndQuantityBookingParty, logoutPartyBooking, updatePartyServiceBookingParty } from '../../redux/partyBookingRedux';
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

// S??? b??n
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
const PriceDetail = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

`
// Th??ng tin - Th??ng tin gi??
const ProductAmountContainer = styled.div`
    display: flex;
    align-items: center;
`

const ProductAmount = styled.div`
    font-size: 24px;
    margin: 5px;
`

const ProductPrice = styled.div`
    font-size: 30px;
    font-weight: 200;
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
            // T??nh to??n t???ng ti???n
            const partyServiceList = partyBooking.partyService;
            const partyHallPrice = partyBooking.partyHall.party_hall_price;
            const setMenuPrice = partyBooking.setMenu.set_menu_price;
            let partyServiceTotal = 0;
            for (var i = 0; i < partyServiceList.length; i++) {
                partyServiceTotal += partyServiceList[i].party_service_price * partyServiceList[i].partyServiceQuantity;
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

    // T???ng ti???n
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

    //  --State khi ch???n xong place -> Ch???n menu
    const [isBookMenu, setIsBookMenu] = useState(false);
    //  --State khi ch???n xong menu -> Thanh to??n
    const [isPayment, setIsPayment] = useState(false);
    //  --State khi thanh to??n th??nh c??ng -> Finish
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
                                const dataToast = { message: "S???nh ???? ???????c gi??? trong 5 ph??t", type: "success" };
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
                    const dataToast = { message: "???? t??m ???????c S???nh ph?? h???p!", type: "success" };
                    showToastFromOut(dataToast);
                    setIsAvailableTable(true);
                    setMinutes(4);
                    setSeconds(59);
                } else {
                    setNoResultFound(true);
                    // Toast
                    const dataToast = { message: "Kh??ng t??m th???y S???nh ph?? h???p!", type: "warning" };
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
            dispatch(logoutPartyBooking());
            // Update all party hall in list to state 0
            try {
                const updatePartyHallState = async () => {
                    const updatePartyHallStateRes = await PartyHallService.updatePartyHallState(partyHallListFiltered, 0);
                    if (updatePartyHallStateRes) {
                        // Toast
                        const dataToast = { message: "Th???i gian gi??? S???nh ???? h???t!", type: "success" };
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
        // Log out booking
        dispatch(logoutPartyBooking());
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
        // Fix l???i x??a gi?? tr??? th?? t???ng  = NaN
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
            const dataToast = { message: "B???n ch??a ch???n S???nh c??? h??nh ti???c!", type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
        if (partyServiceRedux.length === 0) {
            // Toast
            const dataToast = { message: "B???n ch??a ch???n D???ch v??? cho bu???i ti???c!", type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
        // Toast
        const dataToast = { message: " Ch???n S???nh & D???ch v??? th??nh c??ng!", type: "success" };
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
            const dataToast = { message: "B???n ch??a ch???n Menu cho ti???c!", type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
        if (foodListRedux.length === 0) {
            // Toast
            const dataToast = { message: "B???n ch??a ch???n M??n ??n chi ti???t!", type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
        // Toast
        const dataToast = { message: " Ch???n Menu & M??n ??n th??nh c??ng!", type: "success" };
        showToastFromOut(dataToast);
        // When success
        handleLoading();
        setIsPayment(true);
    };

    // Fake loading when fetch data
    const [isLoading, setIsLoading] = useState(false);
    const handleLoading = () => {
        // Scroll l??n k???t qu??? m???i
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
            const dataToast = { message: "Thanh to??n c???a b???n ???? ???????c gi???m gi?? " + discountPartyBooking.discount_percent + "% tr?????c ????!", type: "success" };
            showToastFromOut(dataToast);
            return;
        }
        if (!discount) {
            // Toast
            const dataToast = { message: "B???n ch??a nh???p M?? gi???m gi??!", type: "warning" };
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
    // STRIPE --- Thanh to??n
    const partyTotalDescription = "Your total is " + format_money(partyBookingTotal) + "VN?? ~ " + traceCurrency(partyBookingTotal) + "$";

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

                            partyHallDetailName: firstName + " " + lastName + ": " + typeBookingName + ", " + timeBookingName + ", v??o ng??y " + dateBookingRedux,
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
                        {stripeToken ? (<span>??ang x??? l??...</span>) : (
                            <StripeCheckout
                                name="Ho??ng Long Hotel."
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
                                    Ti???n h??nh thanh to??n
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
                        Ti???n h??nh thanh to??n
                    </ButtonClick>
                );
        }
    };
    // X??? l?? ?????t ti???c
    const handlePartyBookingOrder = () => {
        if (!firstName) {
            // Toast
            const dataToast = { message: "B???n ch??a nh???p first name!", type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
        if (!lastName) {
            // Toast
            const dataToast = { message: "B???n ch??a nh???p last name!", type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
        if (!email) {
            // Toast
            const dataToast = { message: "B???n ch??a nh???p email!", type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
        if (!phoneNumber) {
            // Toast
            const dataToast = { message: "B???n ch??a nh???p s??? ??i???n tho???i!", type: "danger" };
            showToastFromOut(dataToast);
            return;
        }
        if (!paymentWay) {
            // Toast
            const dataToast = { message: "B???n ch??a ch???n ph????ng th???c thanh to??n!", type: "danger" };
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
                                        <span style={{ color: "var(--color-success)", fontSize: "1.5rem", fontWeight: "700", letterSpacing: "2px" }}>?????T TI???C TH??NH C??NG!</span>
                                        <H2>C???m ??n b???n ???? tin t?????ng v?? l???a ch???n <span style={{ color: "var(--color-primary)" }}>Ho??ng Long Hotel &amp; Restaurant</span></H2>
                                        <Small className="text-muted">Bu???i ti???c s??? ???????c nhanh ch??ng chu???n b??? m???t c??ch ch???nh chu v?? ho??n h???o nh???t!</Small>
                                        <Link to="/restaurant" style={{ textDecoration: "none" }}>
                                            <SuccessButtonContainer>
                                                <SuccessButton><ArrowRightAltOutlined />   Quay v??? trang ch??? sau 4 gi??y ...</SuccessButton>
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
                                                                <p style={{ fontWeight: "bold", margin: "10px 0 0 0" }}>Chi ti???t ?????t Ti???c</p>
                                                                <p style={{ fontSize: "1rem" }}>Ho??n t???t ?????t ti???c b???ng vi???c cung c???p nh???ng th??ng tin sau</p>
                                                            </InfomationTitle>
                                                        </div>
                                                        <div className="row">
                                                            <InfomationForm className="col-lg-12">
                                                                <div className="row">
                                                                    <ModalChiTietItem className="col-lg-6">
                                                                        <FormSpan>H??? t??n:</FormSpan>
                                                                        <FormInput type="text" value={firstName + " " + lastName} disabled />
                                                                    </ModalChiTietItem>
                                                                    <ModalChiTietItem className="col-lg-6">
                                                                        <FormSpan>S??? ??i???n tho???i:</FormSpan>
                                                                        <FormInput type="text" value={phoneNumber} disabled />
                                                                    </ModalChiTietItem>
                                                                </div>
                                                                <div className="row">

                                                                    <ModalChiTietItem className="col-lg-12">
                                                                        <FormSpan>?????a ch??? email:</FormSpan>
                                                                        <FormInput type="email" value={email} disabled />
                                                                    </ModalChiTietItem>
                                                                </div>
                                                                <div className="row">
                                                                    <ModalChiTietItem className="col-lg-12">
                                                                        <FormSpan>Ghi ch??:</FormSpan>
                                                                        <FormTextArea
                                                                            rows="3"
                                                                            placeholder="Ghi ch?? v??? bu???i ti???c n??y n??y"
                                                                            value={note} onChange={(e) => setNote(e.target.value)}
                                                                        />
                                                                    </ModalChiTietItem>
                                                                </div>
                                                            </InfomationForm>
                                                        </div>
                                                        <div className="row">
                                                            <InfomationTitle>
                                                                <Title>
                                                                    <p style={{ fontWeight: "bold", margin: "10px 0 0 0" }}>Chi ph?? S???nh</p>
                                                                    <p style={{ fontWeight: "bold", margin: "10px 0 0 0", fontSize: "1.3rem", color: "var(--color-primary)" }}>{format_money(partyHallTotal)} VN??</p>
                                                                </Title>
                                                                <p style={{ fontSize: "1rem" }}>B???n ???? l???a ch???n s???nh sau ????? c??? h??nh bu???i ti???c</p>
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
                                                                                <span style={{ fontWeight: "bold", color: "var(--color-primary)", width: "145px", textAlign: "right" }}>{format_money(partyHallRedux.party_hall_price)} VN??</span>
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


                                                        {/* List d???ch v??? */}
                                                        <div className="row">
                                                            <InfomationTitle>
                                                                <Title>
                                                                    <p style={{ fontWeight: "bold", margin: "10px 0 0 0" }}>Chi ph?? D???ch v???</p>
                                                                    <p style={{ fontWeight: "bold", margin: "10px 0 0 0", fontSize: "1.3rem", color: "var(--color-primary)" }}>{format_money(partyServiceTotal)} VN??</p>
                                                                </Title>
                                                                <p style={{ fontSize: "1rem" }}>T???ng chi ph?? cho t???t c??? d???ch v??? sau ????y</p>
                                                            </InfomationTitle>
                                                        </div>
                                                        {
                                                            partyServiceRedux ? (
                                                                partyServiceRedux.map((service, key) => {
                                                                    const handleRemove = (partyServiceQuantityUpdate) => {
                                                                        dispatch(updatePartyServiceBookingParty({ ...service, partyServiceQuantityUpdate }));
                                                                        if (partyServiceQuantityUpdate === 0) {
                                                                            // Toast
                                                                            const dataToast = { message: "???? x??a D???ch v??? kh???i b???a ti???c!", type: "success" };
                                                                            showToastFromOut(dataToast);
                                                                        }
                                                                    }
                                                                    return (
                                                                        <CartItem>
                                                                            <Circle />
                                                                            <Course>
                                                                                <Content>
                                                                                    <span style={{ width: "320px", fontWeight: "bold", color: "var(--color-dark)" }}> {service.party_service_name} </span>
                                                                                    <PriceDetail>
                                                                                        <ProductAmountContainer>
                                                                                            {/* <div onClick={() => product.soluongmua < product.data[0].soluong && handleRemove(1)}> */}
                                                                                            <div onClick={() => handleRemove(1)}>
                                                                                                <Add />
                                                                                            </div>
                                                                                            <ProductAmount>{service.partyServiceQuantity}</ProductAmount>
                                                                                            <div onClick={() => handleRemove(-1)}>
                                                                                                <Remove />
                                                                                            </div>
                                                                                        </ProductAmountContainer>
                                                                                    </PriceDetail>
                                                                                    <span style={{ fontWeight: "400", color: "var(--color-primary)", width: "145px", textAlign: "right" }}>{format_money(service.partyServiceQuantity * service.party_service_price)} VN??</span>
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
                                                                    <span style={{ width: "320px", fontWeight: "bold", color: "var(--color-dark)" }}> Hoa t????i </span>
                                                                    <span style={{ fontWeight: "400", color: "var(--color-primary)", width: "145px", textAlign: "right" }}>200.000 VN??</span>
                                                                </Content>
                                                            </Course>
                                                        </CartItem>
                                                        <CartItem>
                                                            <Circle />
                                                            <Course>
                                                                <Content>
                                                                    <span style={{ width: "320px", fontWeight: "bold", color: "var(--color-dark)" }}> B??nh c?????i + R?????u sampal </span>
                                                                    <span style={{ fontWeight: "400", color: "var(--color-primary)", width: "145px", textAlign: "right" }}>200.000 VN??</span>
                                                                </Content>
                                                            </Course>
                                                        </CartItem>
                                                        <CartItem>
                                                            <Circle />
                                                            <Course>
                                                                <Content>
                                                                    <span style={{ width: "320px", fontWeight: "bold", color: "var(--color-dark)" }}> MC ca h??t </span>
                                                                    <span style={{ fontWeight: "400", color: "var(--color-primary)", width: "145px", textAlign: "right" }}>200.000 VN??</span>
                                                                </Content>
                                                            </Course>
                                                        </CartItem> */}

                                                        {/* List M??n ??n */}
                                                        <div className="row">
                                                            <InfomationTitle>
                                                                <p style={{ fontWeight: "bold", margin: "10px 0 0 0" }}>Chi ti???t Menu</p>
                                                                <p style={{ fontSize: "1rem" }}>T???t c??? nh???ng m??n ??n m?? b???n ???? ch???n nh?? sau</p>
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
                                                                    <span style={{ width: "320px", fontWeight: "bold", color: "var(--color-dark)" }}>  M??n Tr??ng mi???ng </span>
                                                                    <span style={{ fontWeight: "400", color: "var(--color-primary)", width: "145px", textAlign: "right" }}>200.000 VN??</span>
                                                                </Content>
                                                                <span style={{ fontWeight: "400" }}><span style={{ color: "var(--color-primary)" }}>12</span> x G?? r??n</span>
                                                            </Course>
                                                        </CartItem>
                                                        <CartItem>
                                                            <Circle />
                                                            <Course>
                                                                <Content>
                                                                    <span style={{ width: "320px", fontWeight: "bold", color: "var(--color-dark)" }}> M??n C??m-M??-L???u </span>
                                                                    <span style={{ fontWeight: "400", color: "var(--color-primary)", width: "145px", textAlign: "right" }}>200.000 VN??</span>
                                                                </Content>
                                                                <span style={{ fontWeight: "400" }}><span style={{ color: "var(--color-primary)" }}>12</span> x G?? r??n</span>
                                                            </Course>
                                                        </CartItem>
                                                        <CartItem>
                                                            <Circle />
                                                            <Course>
                                                                <Content>
                                                                    <span style={{ width: "320px", fontWeight: "bold", color: "var(--color-dark)" }}> M??n th???t </span>
                                                                    <span style={{ fontWeight: "400", color: "var(--color-primary)", width: "145px", textAlign: "right" }}>200.000 VN??</span>
                                                                </Content>
                                                                <span style={{ fontWeight: "400" }}><span style={{ color: "var(--color-primary)" }}>12</span> x G?? r??n</span>
                                                            </Course>
                                                        </CartItem> */}

                                                        {/* T???ng chi ph?? menu */}
                                                        <div className="row">
                                                            <InfomationTitle>
                                                                <Title>
                                                                    <p style={{ fontWeight: "bold", margin: "10px 0 0 0" }}>Chi ph?? M??n ??n</p>
                                                                    <p style={{ fontWeight: "bold", margin: "10px 0 0 0", fontSize: "1.3rem", color: "var(--color-primary)" }}>{format_money(setMenuTotal)} VN??</p>
                                                                </Title>
                                                                <p style={{ fontSize: "1rem" }}>T???ng chi ph?? d???a v??o s??? l?????ng b??n ti???c</p>
                                                            </InfomationTitle>
                                                        </div>

                                                        <BookingInfoDetailRow className="row">
                                                            <BookingInfoDetailRowMd5 className="col-md-5">
                                                                <DayTitle style={{ fontSize: "1.1rem", color: "var(--color-dark)" }}>Chi ph?? m???t m??m</DayTitle>
                                                                <DayDetail style={{ fontSize: "1.3rem", color: "var(--color-primary)" }}>{format_money(setMenuTotal)} VN??</DayDetail>
                                                            </BookingInfoDetailRowMd5>
                                                            <BookingInfoDetailRowMd2 className="col-md-2">
                                                                <CelebrationOutlined style={{ color: "var(--color-primary)" }} />
                                                            </BookingInfoDetailRowMd2>
                                                            <BookingInfoDetailRowMd5 className="col-md-5">
                                                                <DayTitle style={{ fontSize: "1.1rem", color: "var(--color-dark)" }}>S??? b??n ti???c</DayTitle>
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

                                                        {/* Gi???m gi?? */}
                                                        <LeftRow className="row">
                                                            <div className="col-md-12">
                                                                <InfomationTitle>
                                                                    <p style={{ fontWeight: "bold", margin: "10px 0 0 0" }}>??p d???ng m?? gi???m gi??</p>
                                                                    <p style={{ fontSize: "1rem" }}>M???i m?? gi???m gi?? ch??? ???????c d??ng duy nh???t cho m???t thanh to??n.</p>
                                                                </InfomationTitle>
                                                            </div>
                                                            <LeftDiscount className='col-md-12'>
                                                                <Input className='col-md-5' type="text" value={discount} onChange={(e) => setDiscount(e.target.value)} />
                                                                <ButtonClick className='col-md-4' style={{ margin: "0px 0px 0px 20px", height: "40px" }}
                                                                    onClick={() => handleDiscount()}
                                                                >
                                                                    {/* <ButtonClick style={{marginLeft: "70%"}} className="button-disable"> */}
                                                                    ??p d???ng m?? gi???m gi??
                                                                </ButtonClick>
                                                            </LeftDiscount>
                                                        </LeftRow>


                                                        {/* Total money */}
                                                        <TotalMoneyRow className="row">
                                                            <TotalMoney>
                                                                <TotalMoneySpan>T???ng c???ng: </TotalMoneySpan>
                                                                <TotalMoneyBeforeH3>{format_money(partyBookingTotal)}<b style={{ marginLeft: "5px", marginBottom: "10px" }}><u> VN??</u></b></TotalMoneyBeforeH3>
                                                                {
                                                                    discountPartyBooking ? (
                                                                        <TotalMoneyH5>
                                                                            ???? ??p d???ng m?? gi???m gi??
                                                                        </TotalMoneyH5>
                                                                    ) : (
                                                                        null
                                                                    )
                                                                }
                                                            </TotalMoney>
                                                        </TotalMoneyRow>

                                                        {/* Ph????ng th???c thanh to??n */}
                                                        <LeftRow className="row" style={{ marginTop: "40px" }}>
                                                            <div className="col-md-12">
                                                                <InfomationTitle>
                                                                    <p style={{ fontWeight: "bold", margin: "10px 0 0 0" }}>Ph????ng th???c thanh to??n</p>
                                                                    <p style={{ fontSize: "1rem" }}>Qu?? kh??ch c?? th??? ch???n m???t trong c??c ph????ng th???c sau ????? ho??n t???t ?????t ph??ng.</p>
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
                                                                                    Thanh to??n qua v?? ??i???n t??? Momo.
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
                                                                                    Thanh to??n qua Stripe. Ch???p nh???n t???t c??? c??c th??? t??n d???ng v?? th??? ghi n??? ch??nh.
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
                                                                                        Chuy???n kho???n ng??n h??ng
                                                                                    </PaymentName>
                                                                                </PaymentCol9>
                                                                                <PaymentImgContainer className="col-md-3">
                                                                                    <PaymentImg src={cardImage} alt="" />
                                                                                </PaymentImgContainer>
                                                                            </PaymentWay>
                                                                            <PaymentDescription>
                                                                                <PaymentDescriptionP>
                                                                                    Thanh to??n qua chuy???n kho???n ng??n h??ng tr???c ti???p.
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
                                                                                        Thanh to??n khi ?????n n??i
                                                                                    </PaymentName>
                                                                                </PaymentCol9>
                                                                                <PaymentImgContainer className="col-md-3">
                                                                                    <PaymentImg src={cash} alt="" style={{ backgroundColor: "white" }} />
                                                                                </PaymentImgContainer>
                                                                            </PaymentWay>
                                                                            <PaymentDescription>
                                                                                <PaymentDescriptionP>
                                                                                    Thanh to??n khi ?????n n??i. Thanh to??n b???ng th??? t??n d???ng ho???c ti???n m???t khi b???n ?????n n??i.
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
                                                                    <p style={{ fontWeight: "bold", margin: "10px 0 0 0" }}>L???a ch???n Menu &amp; M??n ??n c??? th???</p>
                                                                    <p style={{ fontSize: "1rem" }}>D?????i ????y l?? nh???ng Menu ph?? h???p</p>
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
                                                                            B??n ti???c ti??u chu???n v???i ?????y ????? c??c m??n ngon, ?????m b???o ?????y ????? kh???u ph???n v?? s??? sang tr???ng.
                                                                        </MenuDescription>
                                                                    </MenuInfo>
                                                                </MenuItem>
                                                                <MenuItem onClick={() => handleClickMenu(menu2)}>
                                                                    <MenuImage src={menu2} />
                                                                    <MenuInfo>
                                                                        <MenuTitle>MENU 5.950.000</MenuTitle>
                                                                        <MenuDescription>
                                                                            B??n ti???c n??ng c???p cho b???a ti???c sang tr???ng v???i c??c m??n ngon ??a d???ng v?? th???nh so???n h??n.
                                                                        </MenuDescription>
                                                                    </MenuInfo>
                                                                </MenuItem>
                                                                <MenuItem onClick={() => handleClickMenu(menu3)}>
                                                                    <MenuImage src={menu3} />
                                                                    <MenuInfo>
                                                                        <MenuTitle>MENU 6.250.000</MenuTitle>
                                                                        <MenuDescription>
                                                                            B??n ti???c v???i nh???ng m??n ??n phong ph?? v?? sang tr???ng ??em ?????n cho qu?? kh??ch.
                                                                        </MenuDescription>
                                                                    </MenuInfo>
                                                                </MenuItem>
                                                                <MenuItem onClick={() => handleClickMenu(menu4)}>
                                                                    <MenuImage src={menu4} />
                                                                    <MenuInfo>
                                                                        <MenuTitle>Menu 6.950.000</MenuTitle>
                                                                        <MenuDescription>
                                                                            B??n ti???c th???nh so???n, ?????y ????? m??n ngon, h???p kh???u v??? ng?????i ch??u ?? s??? l?? ch???n l???a ho??n h???o...
                                                                        </MenuDescription>
                                                                    </MenuInfo>
                                                                </MenuItem>
                                                                <MenuItem onClick={() => handleClickMenu(menu5)}>
                                                                    <MenuImage src={menu5} />
                                                                    <MenuInfo>
                                                                        <MenuTitle>Menu 7.550.000</MenuTitle>
                                                                        <MenuDescription>
                                                                            B??n ti???c sang tr???ng, gi?? tr??? nh???t v???i nh???ng m??n ngon phong ph?? v?? gi?? tr??? dinh d?????ng cao nh???t.
                                                                        </MenuDescription>
                                                                    </MenuInfo>
                                                                </MenuItem>
                                                                <MenuItem onClick={() => handleClickMenu(menu6)}>
                                                                    <MenuImage src={menu6} />
                                                                    <MenuInfo>
                                                                        <MenuTitle>Menu th???c u???ng</MenuTitle>
                                                                        <MenuDescription>
                                                                            Nh???ng th???c u???ng ??a d???ng, m???c gi?? h???p l?? t???o th??m ??i???m nh???n quan tr???ng cho b???a ti???c.
                                                                        </MenuDescription>
                                                                    </MenuInfo>
                                                                </MenuItem>
                                                                <MenuItem onClick={() => handleClickMenu(menu7)}>
                                                                    <MenuImage src={menu7} />
                                                                    <MenuInfo>
                                                                        <MenuTitle>B???ng gi?? d???ch v???</MenuTitle>
                                                                        <MenuDescription>
                                                                            Nh???ng d???ch v??? trang tr??, nghi th???c l??? v???i phi??n b???n n??ng c???p l??m t??ng gi?? tr??? c???a b???a ti???c.
                                                                        </MenuDescription>
                                                                    </MenuInfo>
                                                                </MenuItem>
                                                                <MenuItem onClick={() => handleClickMenu(menu8)}>
                                                                    <MenuImage src={menu8} />
                                                                    <MenuInfo>
                                                                        <MenuTitle>B???NG GI?? D???CH V???</MenuTitle>
                                                                        <MenuDescription>
                                                                            Nh???ng h???ng m???c ch????ng tr??nh gi???i tr?? v?? d???ch v??? ph??? tr??? gi??p b???a ti???c ho??n h???o h??n.
                                                                        </MenuDescription>
                                                                    </MenuInfo>
                                                                </MenuItem> */}
                                                            </Carousel>

                                                            {/* Detail Service */}
                                                            <div className="row">
                                                                <InfomationTitle>
                                                                    <p style={{ fontWeight: "bold", margin: "10px 0 0 0" }}>Nh???ng m??n ??n b???n ???? ch???n</p>
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
                                                                                <EmptyContent class="EmptyStatestyles__StyledTitle-sc-qsuc29-2 gAMClh">Ch??a c?? d???ch v??? n??o ???????c ch???n</EmptyContent>
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
                                                                            <p style={{ fontWeight: "300", margin: "15px 0 0 0", fontSize: "1.1rem" }}>B???n ?????ng ?? l???a ch???n <b style={{ color: "var(--color-primary)" }}>{setMenuRedux.set_menu_name}</b> v???i nh???ng m??n ??n tr??n ?</p>
                                                                            {/* <p style={{ fontSize: "1rem" }}>D?????i ????y l?? nh???ng s???nh c??? h??nh ph?? h???p</p> */}
                                                                        </InfomationTitle>
                                                                    </div>
                                                                ) : null
                                                            }

                                                            {/* Button service */}
                                                            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: "20px" }}>
                                                                <BookButtonContainer>
                                                                    <BookButton
                                                                        onClick={() => handleAcceptMenuAndFood()}
                                                                    >?????ng ??</BookButton>
                                                                </BookButtonContainer>

                                                                <BookButtonContainer>
                                                                    <BookButton
                                                                        onClick={() => handleDeclinePartyHallAndService()}
                                                                    >H???y ?????t ti???c</BookButton>
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
                                                                                    <p style={{ fontWeight: "bold", margin: "10px 0 0 0" }}>L???a ch???n S???nh c??? h??nh ti???c &amp; D???ch v??? ??i k??m</p>
                                                                                    <p style={{ fontSize: "1rem" }}>D?????i ????y l?? <span style={{ color: "var(--color-primary)", fontWeight: "bold" }}>{partyHallListFiltered.length} S???nh c??? h??nh</span> ph?? h???p</p>
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
                                                                                                            <SpanDark>Ch???n s???nh n??y</SpanDark>
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
                                                                                    <p style={{ fontWeight: "bold", margin: "10px 0 0 0" }}>Nh???ng d???ch v??? ???? ch???n</p>
                                                                                    {
                                                                                        partyServiceRedux.length > 0 ? (
                                                                                            partyServiceRedux.map((service, key) => {
                                                                                                return (
                                                                                                    <CartItem>
                                                                                                        <CircleService />
                                                                                                        <Course>
                                                                                                            <Content>
                                                                                                                <span style={{ width: "320px", fontWeight: "bold", color: "var(--color-dark)" }}> {service.party_service_name} </span>
                                                                                                                <span style={{ fontWeight: "400", color: "var(--color-primary)", width: "145px", textAlign: "right" }}>{format_money(service.party_service_price)} VN??</span>
                                                                                                            </Content>
                                                                                                            {/* <span style={{ fontWeight: "400" }}><span style={{ color: "var(--color-primary)" }}>12</span> x G?? r??n</span> */}
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
                                                                                                <EmptyContent class="EmptyStatestyles__StyledTitle-sc-qsuc29-2 gAMClh">Ch??a c?? d???ch v??? n??o ???????c ch???n</EmptyContent>
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
                                                                                            <p style={{ fontWeight: "300", margin: "15px 0 0 0", fontSize: "1.1rem" }}>B???n ?????ng ?? l???a ch???n <b style={{ color: "var(--color-primary)" }}>{partyHallRedux.party_hall_name} - {partyHallRedux.party_hall_view}</b> v?? nh???ng d???ch v??? tr??n ?</p>
                                                                                            {/* <p style={{ fontSize: "1rem" }}>D?????i ????y l?? nh???ng s???nh c??? h??nh ph?? h???p</p> */}
                                                                                        </InfomationTitle>
                                                                                    </div>
                                                                                ) : null
                                                                            }


                                                                            {/* Button service */}
                                                                            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: "20px" }}>
                                                                                <BookButtonContainer>
                                                                                    <BookButton
                                                                                        onClick={() => handleAcceptPartyHallAndService()}
                                                                                    >?????ng ??</BookButton>
                                                                                </BookButtonContainer>

                                                                                <Link to={"/restaurant"}>
                                                                                    <BookButtonContainer>
                                                                                        <BookButton
                                                                                            onClick={() => handleDeclinePartyHallAndService()}
                                                                                        >H???y ?????t ti???c</BookButton>
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
                                                                                        <p style={{ fontWeight: "bold", margin: "10px 0 0 0" }}>D?????i ????y l?? t???t c??? c??c S???nh c?????i t???i Ho??ng Long.</p>
                                                                                        <p style={{ fontSize: "1rem" }}>H??y <span style={{ color: "var(--color-primary)", fontWeight: "bold" }}>Check Available</span> ????? t??m cho m??nh S???nh ph?? h???p nh??!</p>
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
                                                <RightColMd6 className='col-md-8' style={{ fontWeight: "600", padding: "0" }}>Th??ng tin ?????t ti???c</RightColMd6>
                                            </TitleSolid>
                                            <TitleDashed className="row">
                                                <RightColMd6 className='col-md-8' style={{ fontWeight: "600", padding: "0" }}>Th???i gian gi??? s???nh:</RightColMd6>
                                                <RightColMd6 className='col-md-4' style={{ fontWeight: "600", fontSize: "1.3rem", display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                    <AccessAlarmsOutlined style={{ marginRight: "3px" }} />
                                                    {minutes}:{seconds < 10 ? '0' + seconds : seconds}
                                                </RightColMd6>
                                            </TitleDashed>

                                            <BookingInfo className="row">
                                                <BookingInfoTitle className="col-md-12">Ho??ng Long Hotel &amp; Restaurant</BookingInfoTitle>
                                                <BookingInfoDetail className="col-md-12">
                                                    <BookingInfoDetailRow className="row">
                                                        <BookingInfoDetailRowMd5 className="col-md-5">
                                                            <DayTitle>Ng??y ?????t s???nh</DayTitle>
                                                            <DayDetail>{dateBookingRedux}</DayDetail>
                                                        </BookingInfoDetailRowMd5>
                                                        <BookingInfoDetailRowMd2 className="col-md-2">
                                                            <CelebrationOutlined style={{ color: "var(--color-primary)" }} />
                                                        </BookingInfoDetailRowMd2>
                                                        <BookingInfoDetailRowMd5 className="col-md-5">
                                                            <DayTitle>Th???i gian c??? h??nh</DayTitle>
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
                                                        <BookingNumberRowMd5 className="col-md-6">S??? l?????ng kh??ch: <b style={{ color: "var(--color-primary)", marginLeft: "5px" }}> {quantityBookingRedux}</b></BookingNumberRowMd5>
                                                    </BookingNumberRow>
                                                </BookingNumber>
                                            </BookingInfo>

                                            <PartyInformation className="row">
                                                <PartyInformationTitle className="col-md-12">Th??ng tin S???nh</PartyInformationTitle>
                                                <PartyInformationDetail className="col-md-12">
                                                    <PartyInformationRow className="row">
                                                        <PartyDetailTitle className="col-md-6">Lo???i ti???c</PartyDetailTitle>
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
                                                        <PartyDetailTitle className="col-md-6">V??? tr??</PartyDetailTitle>
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
                                                        Ch???nh s???a ?????t ti???c
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
                                                                                label="Ng??y ????i ti???c"
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
                                                                                label="Th???i gian c??? h??nh"
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
                                                                                ) : "Th???i gian c??? h??nh"
                                                                            }</BookingNumberNiceSelectSpan>
                                                                            <BookingNumberNiceSelectUl className='list'>
                                                                                <BookingNumberNiceSelectLi className='option focus selected'>Vui l??ng ch???n</BookingNumberNiceSelectLi>
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
                                                                    ) : "Lo???i ti???c"
                                                                }</BookingNumberNiceSelectSpan>
                                                                <BookingNumberNiceSelectUl className='list'>
                                                                    <BookingNumberNiceSelectLi className='option focus selected'>Vui l??ng ch???n</BookingNumberNiceSelectLi>
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
                                                                <BookingNumberNiceSelectSpan className='current'>{quantityBooking ? quantityBooking + " kh??ch" : "S??? l?????ng kh??ch"}</BookingNumberNiceSelectSpan>
                                                                <BookingNumberNiceSelectUl className='list'>
                                                                    <BookingNumberNiceSelectLi className='option focus selected'>Vui l??ng ch???n</BookingNumberNiceSelectLi>
                                                                    <BookingNumberNiceSelectLi onClick={() => setQuantityBooking(prev => 100)} className='option'>100 kh??ch</BookingNumberNiceSelectLi>
                                                                    <BookingNumberNiceSelectLi onClick={() => setQuantityBooking(prev => 200)} className='option'>200 kh??ch</BookingNumberNiceSelectLi>
                                                                    <BookingNumberNiceSelectLi onClick={() => setQuantityBooking(prev => 300)} className='option'>300 kh??ch</BookingNumberNiceSelectLi>
                                                                    <BookingNumberNiceSelectLi onClick={() => setQuantityBooking(prev => 400)} className='option'>400 kh??ch</BookingNumberNiceSelectLi>
                                                                    <BookingNumberNiceSelectLi onClick={() => setQuantityBooking(prev => 500)} className='option'>500 kh??ch</BookingNumberNiceSelectLi>
                                                                    <BookingNumberNiceSelectLi onClick={() => setQuantityBooking(prev => 600)} className='option'>600 kh??ch</BookingNumberNiceSelectLi>
                                                                    <BookingNumberNiceSelectLi onClick={() => setQuantityBooking(prev => 700)} className='option'>700 kh??ch</BookingNumberNiceSelectLi>
                                                                    <BookingNumberNiceSelectLi onClick={() => setQuantityBooking(prev => 800)} className='option'>800 kh??ch</BookingNumberNiceSelectLi>
                                                                    <BookingNumberNiceSelectLi onClick={() => setQuantityBooking(prev => 900)} className='option'>900 kh??ch</BookingNumberNiceSelectLi>
                                                                    <BookingNumberNiceSelectLi onClick={() => setQuantityBooking(prev => 1000)} className='option'>Tr??n 1000 kh??ch</BookingNumberNiceSelectLi>
                                                                </BookingNumberNiceSelectUl>
                                                            </BookingNumberNiceSelect>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-6 col-lg-12 pt-5">
                                                    <h6 className="color-white mb-3">B??? l???c:</h6>
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
                                                                T??M KI???M S???NH
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
                            <ModalH2>Ch??c m???ng b???n ???? quay l???i!</ModalH2>
                            <ModalSmall className="text-muted">S??? l?????ng b??n tr???ng c?? th??? ???? thay ?????i, vui l??ng t???i l???i trang ????? c???p nh???t gi?? m???i nh???t</ModalSmall>
                            <Link to="/restaurant" style={{ textDecoration: "none" }}>
                                <ModalButtonContainer>
                                    <ModalButton><ReplayOutlined />   T???i l???i trang</ModalButton>
                                </ModalButtonContainer>
                            </Link>
                        </ModalWrapperMessage>
                    </ModalBackground>
                    : null
            }

            {/* Modal */}
            <Modal
                showModal={showModal}   //state ????ng m??? modal
                setShowModal={setShowModal} //H??m ????ng m??? modal
                type={typeModal}    //Lo???i modal
                setMenuModal={setMenuModal}   //?????i t?????ng menu trong Modal
                partyHallModal={partyHallModal}   //?????i t?????ng party hall trong Modal
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