import React, { useState } from 'react';
import styled from 'styled-components';
import SliderImage from "../SliderImage";
// Date picker
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import moment from 'moment';
import { Star } from '@mui/icons-material'
import Fade from 'react-reveal/Fade';

import svg2 from '../../img/2.svg';
import svg3 from '../../img/3.svg';
import svg5 from '../../img/5.svg';
import picture3 from '../../img/room3.jpg';
import HotelProgress from './HotelProgress';
import { useNavigate } from 'react-router-dom';

const HotelItem = styled.div``

// More Image
const ImgContainer = styled.div`
`
const MoreImage = styled.div`
    width: 100%;
`
// Propdown
const InputDateRangeFormItem = styled.div``
const BookingNumberNiceSelect = styled.div``
const BookingNumberNiceSelectSpan = styled.span``
const BookingNumberNiceSelectUl = styled.ul``
const BookingNumberNiceSelectLi = styled.li``

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


const HotelRoomDetail = (props) => {
    // Truyền data Từ trang chi tiết vào
    console.log("props data: ", props.data);

    const navigate = useNavigate();
    // STATE
    const [isSelectAdults, setIsSelectAdults] = useState(false);
    const [isSelectChildren, setIsSelectChildren] = useState(false);

    const [checkInDate, setCheckInDate] = useState();
    const [checkOutDate, setCheckOutDate] = useState();

    // HANDLE
    const handleChangeCheckInDate = (newValue) => {
        setCheckInDate(newValue);
        console.log(moment(newValue).format("DD/MM/yyyy"));
    };
    const handleChangeCheckOutDate = (newValue) => {
        setCheckOutDate(newValue);
        console.log(moment(newValue).format("DD/MM/yyyy"));
    };
    return (
        <>
            {/*-- HOTEL PROGRESS -- */}
            <HotelProgress step="findDayAndRoom" />

            <div className="section padding-top-bottom z-bigger" style={{ paddingTop: "25px" }}>
                <div className="section z-bigger">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8 mt-4 mt-lg-0">
                                <ImgContainer className="row">
                                    <MoreImage >
                                        <SliderImage image={['https://picsum.photos/id/1018/1000/600/', 'https://picsum.photos/id/1018/1000/600/', 'https://picsum.photos/id/1018/1000/600/']} />
                                    </MoreImage>
                                </ImgContainer>
                                <div className="section pt-5">
                                    <h5>discription</h5>
                                    <p className="mt-3">Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.</p>
                                </div>
                                <div className="section pt-4">
                                    <div className="row">
                                        <div className="col-12">
                                            <h5 className="mb-3">Overview</h5>
                                        </div>
                                        <div className="col-lg-6">
                                            <p><strong className="color-black">Room size:</strong> 47 - 54 sq m</p>
                                            <p><strong className="color-black">Occupancy:</strong> Up to 4 adulds</p>
                                            <p><strong className="color-black">View:</strong> Sea view</p>
                                            <p><strong className="color-black">Smoking:</strong> No smoking</p>
                                        </div>
                                        <div className="col-lg-6">
                                            <p><strong className="color-black">Bed size:</strong> King and regular</p>
                                            <p><strong className="color-black">Location:</strong> Big room 2nd floor</p>
                                            <p><strong className="color-black">Room service:</strong> Yes</p>
                                            <p><strong className="color-black">Swimming pool:</strong> Yes</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="section pt-4">
                                    <h5>Features</h5>
                                    <p className="mt-3">Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.</p>
                                </div>
                            </div>
                            <div className="col-lg-4 order-first order-lg-last">
                                <div className="section background-dark p-4">
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="input-daterange input-group" id="flight-datepicker">
                                                <div class="row">
                                                    <div class="col-12">
                                                        <InputDateRangeFormItem className="form-item">
                                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                                <Stack spacing={3}>
                                                                    <DesktopDatePicker
                                                                        label="Ngày đặt phòng"
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
                                                    <div class="col-12 pt-4">
                                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                            <Stack spacing={3}>
                                                                <DesktopDatePicker
                                                                    label="Ngày trả phòng"
                                                                    inputFormat="dd/MM/yyyy"
                                                                    value={checkOutDate}
                                                                    onChange={(newValue) => handleChangeCheckOutDate(newValue)}
                                                                    renderInput={(params) => <TextField {...params} />}
                                                                    InputProps={{ sx: { '& .MuiSvgIcon-root': { color: "white" } } }}
                                                                />
                                                            </Stack>
                                                        </LocalizationProvider>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div class="row">
                                                <div class="col-12 pt-4">
                                                    <BookingNumberNiceSelect name="adults" className={isSelectAdults ? "nice-select wide open" : "nice-select wide"} onClick={() => setIsSelectAdults(prev => !prev)}>
                                                        <BookingNumberNiceSelectSpan className='current'>Người lớn</BookingNumberNiceSelectSpan>
                                                        <BookingNumberNiceSelectUl className='list'>
                                                            <BookingNumberNiceSelectLi data-value="adults" data-display="adults" className='option focus selected'>Người lớn</BookingNumberNiceSelectLi>
                                                            <BookingNumberNiceSelectLi data-value="1" className='option'>1</BookingNumberNiceSelectLi>
                                                            <BookingNumberNiceSelectLi data-value="2" className='option'>2</BookingNumberNiceSelectLi>
                                                            <BookingNumberNiceSelectLi data-value="3" className='option'>3</BookingNumberNiceSelectLi>
                                                            <BookingNumberNiceSelectLi data-value="4" className='option'>4</BookingNumberNiceSelectLi>
                                                            <BookingNumberNiceSelectLi data-value="5" className='option'>5</BookingNumberNiceSelectLi>
                                                        </BookingNumberNiceSelectUl>
                                                    </BookingNumberNiceSelect>
                                                </div>
                                                <div class="col-12 pt-4">
                                                    <BookingNumberNiceSelect name="children" className={isSelectChildren ? "nice-select wide open" : "nice-select wide"} onClick={() => setIsSelectChildren(prev => !prev)}>
                                                        <BookingNumberNiceSelectSpan className='current'>Trẻ em</BookingNumberNiceSelectSpan>
                                                        <BookingNumberNiceSelectUl className='list'>
                                                            <BookingNumberNiceSelectLi data-value="children" data-display="children" className='option focus selected'>Trẻ em</BookingNumberNiceSelectLi>
                                                            <BookingNumberNiceSelectLi data-value="1" className='option'>1</BookingNumberNiceSelectLi>
                                                            <BookingNumberNiceSelectLi data-value="2" className='option'>2</BookingNumberNiceSelectLi>
                                                            <BookingNumberNiceSelectLi data-value="3" className='option'>3</BookingNumberNiceSelectLi>
                                                            <BookingNumberNiceSelectLi data-value="4" className='option'>4</BookingNumberNiceSelectLi>
                                                            <BookingNumberNiceSelectLi data-value="5" className='option'>5</BookingNumberNiceSelectLi>
                                                        </BookingNumberNiceSelectUl>
                                                    </BookingNumberNiceSelect>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 pt-4">
                                            <Button className="row">
                                                <ButtonContainer>
                                                    <ButtonClick 
                                                        onClick={() => navigate('/hotel-payment', {
                                                            state: {
                                                                id: 123,
                                                                roomName: "Bungalow"
                                                            }
                                                        })}
                                                    >
                                                        {/* <ButtonClick style={{marginLeft: "70%"}} className="button-disable"> */}
                                                        BOOK NOW
                                                    </ButtonClick>
                                                    <ButtonClick
                                                        onClick={() => navigate('/hotel')}
                                                    >
                                                        {/* <ButtonClick style={{marginLeft: "70%"}} className="button-disable"> */}
                                                        Chọn phòng khác
                                                    </ButtonClick>
                                                </ButtonContainer>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="section padding-bottom over-hide">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-4" data-scroll-reveal="enter bottom move 50px over 0.7s after 0.2s">
                            <HotelItem>
                                <div class="room-box background-grey">
                                    <div class="room-name">suite tanya</div>
                                    <div class="room-per">
                                        <Star style={{ color: "yellow" }} />
                                        <Star style={{ color: "yellow" }} />
                                        <Star style={{ color: "yellow" }} />
                                        <Star style={{ color: "yellow" }} />
                                        <Star style={{ color: "yellow" }} />
                                    </div>
                                    <Fade bottom>
                                        <img src={picture3} alt="" />
                                    </Fade>
                                    <div class="room-box-in">
                                        <h5 class="">pool suite</h5>
                                        <p class="mt-3">Sed ut perspiciatis unde omnis, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et.</p>
                                        <a class="mt-1 btn btn-primary" href="rooms-gallery.html">book from 130$</a>
                                        <div class="room-icons mt-4 pt-4">
                                            <img src={svg5} alt="" />
                                            <img src={svg2} alt="" />
                                            <img src={svg3} alt="" />
                                            <a href="rooms-gallery.html">full info</a>
                                        </div>
                                    </div>
                                </div>
                            </HotelItem>
                        </div>
                        <div className="col-lg-4 mt-4 mt-lg-0" data-scroll-reveal="enter bottom move 50px over 0.7s after 0.4s">
                            <HotelItem>
                                <div class="room-box background-grey">
                                    <div class="room-name">suite tanya</div>
                                    <div class="room-per">
                                        <Star style={{ color: "yellow" }} />
                                        <Star style={{ color: "yellow" }} />
                                        <Star style={{ color: "yellow" }} />
                                        <Star style={{ color: "yellow" }} />
                                        <Star style={{ color: "yellow" }} />
                                    </div>
                                    <Fade bottom>
                                        <img src={picture3} alt="" />
                                    </Fade>
                                    <div class="room-box-in">
                                        <h5 class="">pool suite</h5>
                                        <p class="mt-3">Sed ut perspiciatis unde omnis, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et.</p>
                                        <a class="mt-1 btn btn-primary" href="rooms-gallery.html">book from 130$</a>
                                        <div class="room-icons mt-4 pt-4">
                                            <img src={svg5} alt="" />
                                            <img src={svg2} alt="" />
                                            <img src={svg3} alt="" />
                                            <a href="rooms-gallery.html">full info</a>
                                        </div>
                                    </div>
                                </div>
                            </HotelItem>
                        </div>
                        <div className="col-lg-4 mt-4 mt-lg-0" data-scroll-reveal="enter bottom move 50px over 0.7s after 0.6s">
                            <HotelItem>
                                <div class="room-box background-grey">
                                    <div class="room-name">suite tanya</div>
                                    <div class="room-per">
                                        <Star style={{ color: "yellow" }} />
                                        <Star style={{ color: "yellow" }} />
                                        <Star style={{ color: "yellow" }} />
                                        <Star style={{ color: "yellow" }} />
                                        <Star style={{ color: "yellow" }} />
                                    </div>
                                    <Fade bottom>
                                        <img src={picture3} alt="" />
                                    </Fade>
                                    <div class="room-box-in">
                                        <h5 class="">pool suite</h5>
                                        <p class="mt-3">Sed ut perspiciatis unde omnis, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et.</p>
                                        <a class="mt-1 btn btn-primary" href="rooms-gallery.html">book from 130$</a>
                                        <div class="room-icons mt-4 pt-4">
                                            <img src={svg5} alt="" />
                                            <img src={svg2} alt="" />
                                            <img src={svg3} alt="" />
                                            <a href="rooms-gallery.html">full info</a>
                                        </div>
                                    </div>
                                </div>
                            </HotelItem>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default HotelRoomDetail