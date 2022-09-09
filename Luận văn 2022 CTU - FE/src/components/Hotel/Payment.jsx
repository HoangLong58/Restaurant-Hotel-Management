import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
// Date picker
import { AccessAlarmsOutlined, ReplayOutlined } from '@mui/icons-material';

import cash from '../../img/cash-icon.jpg';
import momoImage from '../../img/momo.jpg';
import paypalImage from '../../img/paypal.png';
import cardImage from '../../img/thenganhang.png';

import logo from '../../img/logos/logo.png';

import { Link, useNavigate } from 'react-router-dom';
import HotelProgress from './HotelProgress';


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
  background-color: #181818;
`
const LeftRow = styled.div``
const LeftColMd6 = styled.div``
const LeftColMd12 = styled.div``
const LeftTitle = styled.div`
  color: white;
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
  }
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

const LeftRowH5 = styled.h5`
  margin-left: 5px;
  font-size: 20px;
  font-weight: 400;
  color: white;
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
`

const InputRadio = styled.input`
  padding: 0px 10px;
  font-size: 2rem;
  cursor: pointer;
  accent-color: var(--color-primary);
  -ms-transform: scale(1.5);
  -webkit-transform: scale(1.5);
  transform: scale(1.3);
  color: black;
  &::before {
      border: 2px solid #333;
  }
`


const PaymentName = styled.div`
  color: white;
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
const RightRow = styled.div`
  margin-bottom: 8px;
  color: white;
`
const RightCol12 = styled.div``
const RightColMd6 = styled.div``

const RightRowH5 = styled.h5`
  margin: 10px 0px 20px 5px;
  font-size: 20px;
  font-weight: 600;
  color: white;
`

const BookingRoom = styled.div`
  position: relative;
  &::after {
    content: "";
    display: block;
    position: absolute;
    bottom: -20px;
    left: 25%;
    width: 50%;
    border-top: 2px solid var(--color-primary);
  }
`
const RoomInfo = styled.div`
  position: relative;
  &::after {
    content: "";
    display: block;
    position: absolute;
    bottom: -20px;
    left: 25%;
    width: 50%;
    border-top: 2px solid var(--color-primary);
  }
`

// Total money
const TotalMoney = styled.div`
  margin-top: 40px;
  border: 2px solid var(--color-primary);
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
  margin-top: 40px;
  display: flex;
  justify-content: center;
  color: var(--color-primary);
	text-transform: lowercase;
  font-size: 1.8rem;
  position: relative;
`

const TotalMoneyH5 = styled.h5`
  color: white;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-top: 30px;
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
    border-top: 2px solid var(--color-primary);
  }
`

// Time
const Time = styled.div`
  position: relative;
  color: white;
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
    border-top: 2px solid var(--color-primary);
  }
`

// Modal
const Background = styled.div`
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

const ModalWrapper = styled.div`
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

const H2 = styled.h2`
  font-size: 1.8rem;
  margin-top: 20px;
  color: var(--color-primary);
  font-weight: 700;
  letter-spacing: 2px;
`
const Small = styled.small`
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
  // Truyền data Từ trang chi tiết vào
  console.log("props data: ", props.data);

  const navigate = useNavigate();
  // STATE

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
    }, 1000)
    return () => {
      clearInterval(myInterval);
    };
  });
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
                    <LeftRow className="row">
                      <LeftColMd6 className="col-md-6">
                        <LeftTitle >Họ của bạn <span style={{ color: "red", marginLeft: "2px" }}>*</span></LeftTitle>
                        <Input type="text" />
                      </LeftColMd6>
                      <LeftColMd6 className="col-md-6">
                        <LeftTitle >Tên của bạn <span style={{ color: "red", marginLeft: "2px" }}>*</span></LeftTitle>
                        <Input type="text" />
                      </LeftColMd6>
                    </LeftRow>
                    <LeftRow className="row" style={{ marginTop: "10px" }}>
                      <LeftColMd6 className="col-md-6">
                        <LeftTitle >Email của bạn <span style={{ color: "red", marginLeft: "2px" }}>*</span></LeftTitle>
                        <Input type="text" />
                      </LeftColMd6>
                      <LeftColMd6 className="col-md-6">
                        <LeftTitle >Số điện thoại của bạn <span style={{ color: "red", marginLeft: "2px" }}>*</span></LeftTitle>
                        <Input type="text" />
                      </LeftColMd6>
                    </LeftRow>
                    <LeftRow className="row" style={{ marginTop: "10px" }}>
                      <LeftColMd12 className="col-md-12">
                        <LeftTitle >Yêu cầu thêm của bạn</LeftTitle>
                        <TextArea rows="3" />
                      </LeftColMd12>
                    </LeftRow>
                  </InfoDetail>
                  <LeftRow className="row" style={{ marginTop: "40px" }}>
                    <LeftRowH5>Áp dụng phiếu giảm giá</LeftRowH5>
                    <LeftDiscount className='col-md-12'>
                      <Input className='col-md-5' type="text" />
                      <ButtonClick className='col-md-4' style={{ margin: "0px 0px 0px 20px", height: "40px" }}>
                        {/* <ButtonClick style={{marginLeft: "70%"}} className="button-disable"> */}
                        Áp dụng mã giảm giá
                      </ButtonClick>
                    </LeftDiscount>
                  </LeftRow>
                  <LeftRow className="row" style={{ marginTop: "40px" }}>
                    <LeftRowH5>Chọn phương thức thanh toán</LeftRowH5>
                    <LeftWayPayment className='col-md-12'>
                      <PaymentUl className="list">
                        <PaymentLi className="list__item">
                          <PaymentLabel className="row label--checkbox">
                            <PaymentWay>
                              <PaymentCol9 className="col-md-5">
                                <InputRadio type="checkbox" className="checkbox" />
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
                                <InputRadio type="checkbox" className="checkbox" />
                                <PaymentName>
                                  Paypal
                                </PaymentName>
                              </PaymentCol9>
                              <PaymentImgContainer className="col-md-3">
                                <PaymentImg src={paypalImage} alt="" />
                              </PaymentImgContainer>
                            </PaymentWay>
                            <PaymentDescription>
                              <PaymentDescriptionP>
                                Thanh toán qua Paypal. Chấp nhận tất cả các thẻ tín dụng và thẻ ghi nợ chính.
                              </PaymentDescriptionP>
                            </PaymentDescription>
                          </PaymentLabel>
                        </PaymentLi>
                        <PaymentLi className="list__item">
                          <PaymentLabel className="row label--checkbox">
                            <PaymentWay>
                              <PaymentCol9 className="col-md-5">
                                <InputRadio type="checkbox" className="checkbox" />
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
                                <InputRadio type="checkbox" className="checkbox" />
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
                  <Button className="row" style={{ marginTop: "30px" }}>
                    <ButtonContainer>
                      <ButtonClick
                        onClick={() => navigate("/hotel-success", {
                          state: {
                            bookingState: "success"
                          }
                        })}
                      >
                        {/* <ButtonClick style={{marginLeft: "70%"}} className="button-disable"> */}
                        Tiến hành thanh toán
                      </ButtonClick>
                    </ButtonContainer>
                  </Button>
                </Left>
                <Right className="col-lg-4 order-first order-lg-last" style={{ paddingRight: "0" }}>
                  <RightBackground className="section background-dark p-4">
                    {/* time */}
                    <Time className="row">
                      <RightColMd6 className='col-md-8' style={{ fontWeight: "600", padding: "0" }}>Thời gian giữ phòng:</RightColMd6>
                      <RightColMd6 className='col-md-4' style={{ fontWeight: "600", fontSize: "1.3rem", display: "flex", flexDirection: "row", alignItems: "center" }}>
                        <AccessAlarmsOutlined style={{ marginRight: "3px" }} />
                        {minutes}:{seconds < 10 ? '0' + seconds : seconds}
                      </RightColMd6>
                    </Time>

                    {/* Booking room */}
                    <BookingRoom className="row">
                      <RightRowH5>Đặt phòng của bạn</RightRowH5>
                      <RightCol12 className="col-12">
                        <RightRow className="row">
                          <RightColMd6 className='col-md-6' style={{ fontWeight: "600" }}>Ngày nhận phòng:</RightColMd6>
                          <RightColMd6 className='col-md-6'>08/09/2022</RightColMd6>
                        </RightRow>
                        <RightRow className="row">
                          <RightColMd6 className='col-md-6' style={{ fontWeight: "600" }}>Ngày trả phòng:</RightColMd6>
                          <RightColMd6 className='col-md-6'>12/09/2022</RightColMd6>
                        </RightRow>
                      </RightCol12>
                    </BookingRoom>

                    {/* Room info */}
                    <RoomInfo className="row" style={{ marginTop: "30px" }}>
                      <RightRowH5>Phòng 1 của tầng 1</RightRowH5>
                      <RightCol12 className="col-12">
                        <RightRow className="row">
                          <RightColMd6 className='col-md-6' style={{ fontWeight: "600" }}>Loại phòng:</RightColMd6>
                          <RightColMd6 className='col-md-6'>Deluxe Room</RightColMd6>
                        </RightRow>
                        <RightRow className="row">
                          <RightColMd6 className='col-md-6' style={{ fontWeight: "600" }}>Số khách:</RightColMd6>
                          <RightColMd6 className='col-md-6'><b>2</b> Người lớn và <b>4</b> Trẻ em</RightColMd6>
                        </RightRow>
                      </RightCol12>
                    </RoomInfo>

                    {/* Total money */}
                    <RightRow className="row">
                      <TotalMoney>
                        <TotalMoneySpan>Tổng cộng: </TotalMoneySpan>
                        <TotalMoneyBeforeH3>4.578.000<b><u> đ</u></b></TotalMoneyBeforeH3>
                        <TotalMoneyH5>
                          Đã áp dụng mã giảm giá
                        </TotalMoneyH5>
                      </TotalMoney>
                    </RightRow>
                    <Button className="row">
                      <ButtonContainer style={{ paddingTop: "0" }}>
                        <ButtonClick
                          onClick={() => navigate('/hotel')}
                        >
                          {/* <ButtonClick style={{marginLeft: "70%"}} className="button-disable"> */}
                          Chỉnh sửa đặt phòng
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
          <Background>
            <ModalWrapper>
              <MessageImageContainer>
                <MessageImage src={logo} />
              </MessageImageContainer>
              <H2>Chúc mừng bạn đã quay lại!</H2>
              <Small className="text-muted">Giá phòng có thể đã thay đổi, vui lòng tải lại trang để cập nhật giá mới nhất</Small>
              <Link to="/hotel" style={{ textDecoration: "none" }}>
                <ModalButtonContainer>
                  <ModalButton><ReplayOutlined />   Tải lại trang</ModalButton>
                </ModalButtonContainer>
              </Link>
            </ModalWrapper>
          </Background>
          : null
      }
    </>
  )
}

export default Payment