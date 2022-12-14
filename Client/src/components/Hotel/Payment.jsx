import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
// Date picker
import { AccessAlarmsOutlined, CorporateFareOutlined, ReplayOutlined } from '@mui/icons-material';
import moment from 'moment';

import cash from '../../img/cash-icon.jpg';
import momoImage from '../../img/momo.jpg';
import stripeImage from '../../img/stripe.png';
import cardImage from '../../img/thenganhang.png';

import { Link, useNavigate } from 'react-router-dom';
import HotelProgress from './HotelProgress';
import { useDispatch, useSelector } from 'react-redux';
import { format_money, getQuantityFromDayToDay, traceCurrency } from '../../utils/utils';

import axios from 'axios';
import StripeCheckout from 'react-stripe-checkout';

import logo from '../../img/logos/logo.png';

// Service
import { REACT_APP_STRIPE } from "../../constants/Var";
import * as PaymentService from "../../service/PaymentService";
import * as DiscountService from "../../service/DiscountService";
import * as RoomService from "../../service/RoomService";
import * as RoomBookingOrderService from "../../service/RoomBookingOrderService";
import Toast from '../Toast';
import { addDiscount, addRoomTotal, logoutRoomBooking } from '../../redux/roomBookingRedux';

// Button
const Button = styled.div``

const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 0px 15px 0px 15px;
`

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
    &:last-child {
        margin-top: 15px;
    }
`
// LEFT
const Left = styled.div`
  padding: 30px;
  background-color: #f5f5f5;
`
const LeftRow = styled.div``
const LeftColMd6 = styled.div``
const LeftColMd12 = styled.div``
const LeftTitle = styled.div`
  color: var(--color-dark);
  font-weight: 400;
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
  };
`

const TextArea = styled.textarea`
  width: 100% !important;
  resize: none;
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

const InfoDetail = styled.div`
  position: relative;
  &::after {
    content: "";
    display: block;
    position: absolute;
    bottom: 0px;
    right: 0px;
    width: 100%;
    border-top: 2px solid var(--color-primary);
  }
`

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
    bottom: -10px;
    left: 15px;
    width: 96%;
    border-top: 2px solid var(--color-primary);
  }
`

// Way payment
const LeftWayPayment = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
  width: 90% !important;
  &::after {
    content: "";
    display: block;
    position: absolute;
    bottom: -10px;
    left: 15px;
    width: 96%;
    border-top: 2px solid var(--color-primary);
  }
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

// Right
const Right = styled.div``

const RightBackground = styled.div`
  padding: 30px;
`
const RightColMd6 = styled.div``

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

const DayNumber = styled.div``
const DayNumberRow = styled.div``
const DayNumberTitle = styled.div`
font-size: 0.9rem;
font-weight: 400;
`
const DayNumberDetail = styled.div`
display: flex;
justify-content: flex-end;
align-items: center;
color: var(--color-primary);
font-weight: bold;

`

// Room Info
const RoomInformation = styled.div`
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

const RoomInformationTitle = styled.div`
font-weight: bold;
padding-bottom: 8px;
`
const RoomInformationDetail = styled.div``
const RoomInformationRow = styled.div``
const RoomDetailTitle = styled.div`
font-size: 0.9rem;
`
const RoomDetailPrice = styled.div`
font-size: 1.1rem;
font-weight: bold;
color: var(--color-primary);
display: flex;
justify-content: flex-end;
align-items: center;
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
  left: 25%;
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

const Payment = (props) => {
  // Truy???n data T??? trang chi ti???t v??o
  console.log("props data payment: ", props.data);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const customerRoomBooking = useSelector((state) => state.roomBooking.customer);
  const roomRoomBooking = useSelector((state) => state.roomBooking.room);
  const discountRoomBooking = useSelector((state) => state.roomBooking.discount);
  const roomTotalRoomBooking = useSelector((state) => state.roomBooking.roomTotal);
  const roomBooking = useSelector((state) => state.roomBooking);
  const checkinDateRoomBooking = useSelector((state) => state.roomBooking.checkInDate);
  const checkoutDateRoomBooking = useSelector((state) => state.roomBooking.checkOutDate);
  // STATE
  const [customer, setCustomer] = useState(customerRoomBooking);
  const [room, setRoom] = useState(roomRoomBooking);

  const [customerId, setCustomerId] = useState(customerRoomBooking.customer_id);
  const [firstName, setFirstName] = useState(customerRoomBooking.customer_first_name);
  const [lastName, setLastName] = useState(customerRoomBooking.customer_last_name);
  const [email, setEmail] = useState(customerRoomBooking.customer_email);
  const [phoneNumber, setPhoneNumber] = useState(customerRoomBooking.customer_phone_number);
  const [note, setNote] = useState("");
  const [discount, setDiscount] = useState("");

  const [checkInDate, setCheckInDate] = useState(moment(roomBooking.checkInDate).format('DD/MM/YYYY'));
  const [checkOutDate, setCheckOutDate] = useState(moment(roomBooking.checkOutDate).format('DD/MM/YYYY'));
  const [adultsQuantity, setAdultsQuantity] = useState(roomBooking.adultsQuantity);
  const [childrenQuantity, setChildrenQuantity] = useState(roomBooking.childrenQuantity);

  const [roomId, setRoomId] = useState(roomRoomBooking.room_id);
  const [roomName, setRoomName] = useState(roomRoomBooking.room_name);
  const [floorName, setFloorName] = useState(roomRoomBooking.floor_name);
  const [roomTypeName, setRoomTypeName] = useState(roomRoomBooking.room_type_name);
  const [roomView, setRoomView] = useState(roomRoomBooking.room_view);
  const [roomPrice, setRoomPrice] = useState(roomRoomBooking.room_price);

  const [discountId, setDiscountId] = useState();

  // Toast
  const [dataToast, setDataToast] = useState({ message: "alo alo", type: "success" });
  const toastRef = useRef(null);

  const showToastFromOut = (dataShow) => {
    setDataToast(dataShow);
    toastRef.current.show();
  }

  // Update room state 0 when UNMOUT: BACK TO PREVIOUS PAGE
  useEffect(() => {
    return () => {
      if (roomId) {
        // Update room to state 0
        try {
          const updateRoomState = async () => {
            const updateRoomStateRes = await RoomService.updateRoomState(roomId, 0);
            if (!updateRoomStateRes) {
              // Toast
              const dataToast = { message: updateRoomStateRes.data.message, type: "warning" };
              showToastFromOut(dataToast);
              return;
            }
          }
          updateRoomState();
        } catch (err) {
          // Toast
          const dataToast = { message: err.response.data.message, type: "danger" };
          showToastFromOut(dataToast);
          return;
        }
      }
    }
  }, [roomId]);

  // Handle time
  const [minutes, setMinutes] = useState(4);
  const [seconds, setSeconds] = useState(59);
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
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  });

  useEffect(() => {
    if (minutes === 0 && seconds === 0) {
      try {
        const updateRoomState = async () => {
          const updateRoomStateRes = await RoomService.updateRoomState(roomId, 0);
          if (updateRoomStateRes) {
            // Toast
            const dataToast = { message: "Th???i gian gi??? Ph??ng ???? h???t!", type: "success" };
            showToastFromOut(dataToast);
            return;
          } else {
            // Toast
            const dataToast = { message: updateRoomStateRes.data.message, type: "warning" };
            showToastFromOut(dataToast);
            return;
          }
        }
        updateRoomState();
      } catch (err) {
        // Toast
        const dataToast = { message: err.response.data.message, type: "danger" };
        showToastFromOut(dataToast);
        return;
      }
    }
  }, [minutes, seconds]);

  const handleUpdateRoomStateTo0 = () => {
    try {
      const updateRoomState = async () => {
        const updateRoomStateRes = await RoomService.updateRoomState(roomId, 0);
        if (!updateRoomStateRes) {
          // Toast
          const dataToast = { message: updateRoomStateRes.data.message, type: "warning" };
          showToastFromOut(dataToast);
          return;
        }
      }
      updateRoomState();
      navigate("/hotel");
    } catch (err) {
      // Toast
      const dataToast = { message: err.response.data.message, type: "danger" };
      showToastFromOut(dataToast);
      return;
    }
  };

  // Update state to 0 when close tab booking
  useEffect(() => {
    window.addEventListener('beforeunload', handleUpdateRoomStateTo0);
    window.addEventListener('unload', handleUpdateRoomStateTo0);
    return () => {
      window.removeEventListener('beforeunload', handleUpdateRoomStateTo0);
      window.removeEventListener('unload', handleUpdateRoomStateTo0);
    }
  });

  // Handle payment way
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
                description={roomTotalDescription}
                amount={traceCurrency(roomTotalRoomBooking) * 100}
                token={onToken}
                stripeKey={REACT_APP_STRIPE}
              >
                <ButtonClick
                  disabled={minutes === 0 && seconds === 0 ? true : false}
                  onClick={() => {
                    handleRoomBookingOrder()
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
              handleRoomBookingOrder()
            }}
          >
            {/* <ButtonClick style={{marginLeft: "70%"}} className="button-disable"> */}
            Ti???n h??nh thanh to??n
          </ButtonClick>
        );
    }
  };

  // Handle discount
  const handleDiscount = () => {
    if (discountRoomBooking) {
      // Toast
      const dataToast = { message: "Thanh to??n c???a b???n ???? ???????c gi???m gi?? " + discountRoomBooking.discount_percent + "% tr?????c ????!", type: "success" };
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
          dispatch(addDiscount({ discount: discountData }));
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

  useEffect(() => {
    if (discountRoomBooking) {
      const discountPercent = discountRoomBooking.discount_percent;
      dispatch(addRoomTotal({
        roomTotal: roomPrice * (checkoutDateRoomBooking - checkinDateRoomBooking) / (24 * 60 * 60 * 1000) - (roomPrice * (checkoutDateRoomBooking - checkinDateRoomBooking) / (24 * 60 * 60 * 1000) * discountPercent / 100)
      }));
    } else {
      dispatch(addRoomTotal({
        roomTotal: roomPrice * (checkoutDateRoomBooking - checkinDateRoomBooking) / (24 * 60 * 60 * 1000)
      }));
    }
  }, [roomPrice, discountRoomBooking]);

  // STRIPE
  const [stripeToken, setStripeToken] = useState(null);
  // STRIPE --- Thanh to??n
  const roomTotalDescription = "Your total is " + format_money(roomTotalRoomBooking) + "VN?? ~ " + traceCurrency(roomTotalRoomBooking) + "$";

  const onToken = (token) => {
    setStripeToken(token);
  };

  useEffect(() => {
    const makeRequest = async () => {
      try {
        const res = await PaymentService.postPaymentStripe({
          tokenId: stripeToken.id,
          amount: traceCurrency(roomTotalRoomBooking) * 100,
        });
        console.log(res.data);
        try {
          const createRoomBookingOrder = async () => {
            const bookingRes = await RoomBookingOrderService.createRoomBookingOrder({
              roomBookingOrderPrice: roomTotalRoomBooking,
              roomBookingOrderSurcharge: 0,
              roomBookingOrderTotal: roomTotalRoomBooking,
              customerId: customerId,
              discountId: discountId ? discountId : 9,
              checkinDate: moment(checkInDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
              checkoutDate: moment(checkOutDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
              roomId: roomId,
              roomBookingOrderNote: note
            });
            if (bookingRes) {
              // Update room state to 0 when booking success
              try {
                const updateRoomState = async () => {
                  const updateRoomStateRes = await RoomService.updateRoomState(roomId, 0);
                  if (!updateRoomStateRes) {
                    // Toast
                    const dataToast = { message: updateRoomStateRes.data.message, type: "warning" };
                    showToastFromOut(dataToast);
                    return;
                  }
                }
                updateRoomState();
              } catch (err) {
                // Toast
                const dataToast = { message: err.response.data.message, type: "danger" };
                showToastFromOut(dataToast);
                return;
              }

              // Success
              dispatch(logoutRoomBooking());
              navigate("/hotel-success", {
                state: {
                  bookingState: "success"
                }
              });
              // Toast
              const dataToast = { message: bookingRes.data.message, type: "success" };
              showToastFromOut(dataToast);
              return;
            } else {
              // Toast
              const dataToast = { message: bookingRes.data.message, type: "warning" };
              showToastFromOut(dataToast);
              return;
            }
          };
          createRoomBookingOrder();
        } catch (err) {
          // Toast
          const dataToast = { message: err.response.data.message, type: "danger" };
          showToastFromOut(dataToast);
          return;
        }
        // navigate("/hotel-success", {
        //   state: {
        //     bookingState: "success"
        //   }
        // });
      } catch (err) {
        console.log(err);
      }
    }
    stripeToken && makeRequest();
  }, [stripeToken, navigate]);

  // X??? l?? ?????t ph??ng
  const handleRoomBookingOrder = () => {
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
    // const makeRequest = async () => {
    //   try {
    //     const res = await PaymentService.postPaymentStripe({
    //       tokenId: stripeToken.id,
    //       amount: traceCurrency(roomTotalRoomBooking) * 100,
    //     });
    //     console.log(res.data);


    //   } catch (err) {
    //     console.log(err);
    //   }
    // }
    // makeRequest();
  };

  // Reload after 5 minute 
  const handleReloadPage = () => {
    navigate("/hotel");
    dispatch(logoutRoomBooking());
  };

  // Change room
  const handleCancelBookRoom = () => {
    handleUpdateRoomStateTo0();
  };

  console.log("paymentWay: ", paymentWay);
  return (
    <>
      {/*-- HOTEL PROGRESS -- */}
      <HotelProgress step="payment" />

      <div className="section padding-top-bottom z-bigger" style={{ paddingTop: "25px" }}>
        <div className="section z-bigger">
          <div className="container">
            <div className="col-lg-12">
              <div className="row">
                <Left className="col-lg-8 mt-4 mt-lg-0">
                  <InfoDetail>
                    <div className="row">
                      <InfomationTitle>
                        <p style={{ fontWeight: "bold", margin: "10px 0 0 0" }}>Th??ng tin thanh to??n</p>
                        <p style={{ fontSize: "1rem" }}>????? ho??n t???t qu?? tr??nh thanh to??n, Qu?? kh??ch vui l??ng ??i???n ?????y ????? th??ng tin b??n d?????i.</p>
                      </InfomationTitle>
                    </div>
                    <LeftRow className="row">
                      <LeftColMd6 className="col-md-6">
                        <LeftTitle >H??? c???a b???n <span style={{ color: "red", marginLeft: "2px" }}>*</span></LeftTitle>
                        <Input type="text" value={firstName} disabled />
                      </LeftColMd6>
                      <LeftColMd6 className="col-md-6">
                        <LeftTitle >T??n c???a b???n <span style={{ color: "red", marginLeft: "2px" }}>*</span></LeftTitle>
                        <Input type="text" value={lastName} disabled />
                      </LeftColMd6>
                    </LeftRow>
                    <LeftRow className="row" style={{ marginTop: "10px" }}>
                      <LeftColMd6 className="col-md-6">
                        <LeftTitle >Email c???a b???n <span style={{ color: "red", marginLeft: "2px" }}>*</span></LeftTitle>
                        <Input type="text" value={email} disabled />
                      </LeftColMd6>
                      <LeftColMd6 className="col-md-6">
                        <LeftTitle >S??? ??i???n tho???i c???a b???n <span style={{ color: "red", marginLeft: "2px" }}>*</span></LeftTitle>
                        <Input type="text" value={phoneNumber} disabled />
                      </LeftColMd6>
                    </LeftRow>
                    <LeftRow className="row" style={{ marginTop: "10px" }}>
                      <LeftColMd12 className="col-md-12">
                        <LeftTitle >Y??u c???u th??m c???a b???n</LeftTitle>
                        <TextArea rows="3" value={note} onChange={(e) => setNote(e.target.value)} />
                      </LeftColMd12>
                    </LeftRow>
                  </InfoDetail>
                  <LeftRow className="row" style={{ marginTop: "40px" }}>
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
                  <Button className="row" style={{ marginTop: "30px" }}>
                    <ButtonContainer>
                      {showPaymentWay(paymentWay)}
                    </ButtonContainer>
                  </Button>
                </Left>

                <Right className="col-lg-4 order-first order-lg-last" style={{ paddingRight: "0" }}>
                  <RightBackground className="section background-dark p-4" style={{ backgroundColor: "#f5f5f5" }}>

                    <TitleSolid className="row">
                      <RightColMd6 className='col-md-8' style={{ fontWeight: "600", padding: "0" }}>Th??ng tin ?????t ph??ng</RightColMd6>
                    </TitleSolid>
                    <TitleDashed className="row">
                      <RightColMd6 className='col-md-8' style={{ fontWeight: "600", padding: "0" }}>Th???i gian gi??? ph??ng:</RightColMd6>
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
                            <DayTitle>Nh???n ph??ng</DayTitle>
                            <DayDetail>{checkInDate}</DayDetail>
                          </BookingInfoDetailRowMd5>
                          <BookingInfoDetailRowMd2 className="col-md-2">
                            <CorporateFareOutlined style={{ color: "var(--color-primary)" }} />
                          </BookingInfoDetailRowMd2>
                          <BookingInfoDetailRowMd5 className="col-md-5">
                            <DayTitle>Tr??? ph??ng</DayTitle>
                            <DayDetail>{checkOutDate}</DayDetail>
                          </BookingInfoDetailRowMd5>
                        </BookingInfoDetailRow>
                      </BookingInfoDetail>

                      <BookingNumber className="col-md-12">
                        <BookingNumberRow className="row">
                          <BookingNumberRowMd5 className="col-md-5">Ng?????i l???n: <b style={{ color: "var(--color-primary)", marginLeft: "5px" }}> {adultsQuantity}</b></BookingNumberRowMd5>
                          <div className="col-md-2"></div>
                          <BookingNumberRowMd5 className="col-md-5">Tr??? em: <b style={{ color: "var(--color-primary)", marginLeft: "5px" }}> {childrenQuantity}</b></BookingNumberRowMd5>
                        </BookingNumberRow>
                      </BookingNumber>

                      <DayNumber className="col-md-12">
                        <DayNumberRow className="row">
                          <DayNumberTitle className="col-md-6">S??? ????m</DayNumberTitle>
                          <DayNumberDetail className="col-md-6"> {getQuantityFromDayToDay(checkInDate, checkOutDate)}</DayNumberDetail>
                        </DayNumberRow>
                      </DayNumber>
                      <DayNumber className="col-md-12">
                        <DayNumberRow className="row">
                          <DayNumberTitle className="col-md-6">S??? ph??ng</DayNumberTitle>
                          <DayNumberDetail className="col-md-6"> 1</DayNumberDetail>
                        </DayNumberRow>
                      </DayNumber>
                    </BookingInfo>

                    <RoomInformation className="row">
                      <RoomInformationTitle className="col-md-12">Th??ng tin ph??ng</RoomInformationTitle>
                      <RoomInformationDetail className="col-md-12">
                        <RoomInformationRow className="row">
                          <RoomDetailTitle className="col-md-6"><b style={{ color: "var(--color-primary)", marginRight: "5px" }}>{roomName}:</b> {roomTypeName}, {roomView}, {floorName}</RoomDetailTitle>
                          <RoomDetailPrice className="col-md-6">{format_money(roomPrice)} ??</RoomDetailPrice>
                        </RoomInformationRow>
                      </RoomInformationDetail>
                    </RoomInformation>

                    {/* Total money */}
                    <TotalMoneyRow className="row">
                      <TotalMoney>
                        <TotalMoneySpan>T???ng c???ng: </TotalMoneySpan>
                        <TotalMoneyBeforeH3>{format_money(roomTotalRoomBooking)}<b style={{ marginLeft: "5px" }}><u> ??</u></b></TotalMoneyBeforeH3>
                        {
                          discountRoomBooking ? (
                            <TotalMoneyH5>
                              ???? ??p d???ng m?? gi???m gi??
                            </TotalMoneyH5>
                          ) : (
                            null
                          )
                        }
                      </TotalMoney>
                    </TotalMoneyRow>

                    <Button className="row">
                      <ButtonContainer style={{ paddingTop: "0" }}>
                        <ButtonClick
                          onClick={() => handleCancelBookRoom()}
                        >
                          {/* <ButtonClick style={{marginLeft: "70%"}} className="button-disable"> */}
                          Ch???nh s???a ?????t ph??ng
                        </ButtonClick>
                      </ButtonContainer>
                    </Button>
                  </RightBackground>
                </Right>
              </div>
            </div>
          </div>
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
              <ModalH2>Ch??c m???ng b???n ???? quay l???i!</ModalH2>
              <ModalSmall className="text-muted">Gi?? ph??ng c?? th??? ???? thay ?????i, vui l??ng t???i l???i trang ????? c???p nh???t gi?? m???i nh???t</ModalSmall>
              {/* <Link to="/hotel" style={{ textDecoration: "none" }}>// */}
              <ModalButtonContainer>
                <ModalButton onClick={() => handleReloadPage()}><ReplayOutlined />   T???i l???i trang</ModalButton>
              </ModalButtonContainer>
              {/* </Link> */}
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

export default Payment