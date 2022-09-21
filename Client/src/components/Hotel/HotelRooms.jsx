import React, { useState } from 'react';
import styled from 'styled-components';
// Date picker
import { Star } from '@mui/icons-material';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import moment from 'moment';
import Fade from 'react-reveal/Fade';

import { useNavigate } from 'react-router-dom';
import svg2 from '../../img/2.svg';
import svg3 from '../../img/3.svg';
import svg4 from '../../img/4.svg';
import svg5 from '../../img/5.svg';
import svg6 from '../../img/6.svg';
import picture3 from '../../img/room3.jpg';
import picture4 from '../../img/room4.jpg';
import picture5 from '../../img/room5.jpg';
import picture6 from '../../img/room6.jpg';
import HotelProgress from './HotelProgress';

const InputDateRangeFormItem = styled.div``
const BookingNumberNiceSelect = styled.div``
const BookingNumberNiceSelectSpan = styled.span``
const BookingNumberNiceSelectUl = styled.ul``
const BookingNumberNiceSelectLi = styled.li``

const HotelItem = styled.div`
    -ms-flex: 0 0 50%;
    flex: 0 0 50%;
    max-width: 50%;
    position: relative;
    width: 100%;
    padding-right: 15px;
    padding-left: 15px;
    margin-top: 1.5rem !important;
`

// Button
const Button = styled.div``

const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
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
`

const DetailRoomButton = styled.a`
    cursor: pointer;
    &:hover {
        color: #41f1b6 !important;
    }

`
const HotelRooms = () => {
    const navigate = useNavigate();
    // STATE
    const [isSelectAdults, setIsSelectAdults] = useState(false);
    const [isSelectChildren, setIsSelectChildren] = useState(false);

    const [checkInDate, setCheckInDate] = useState();
    const [checkOutDate, setCheckOutDate] = useState();

    const [maxPrice, setMaxPrice] = useState();

    // HANDLE
    const handleChangeCheckInDate = (newValue) => {
        setCheckInDate(newValue);
        console.log(moment(newValue).format("DD/MM/yyyy"));
    };
    const handleChangeCheckOutDate = (newValue) => {
        setCheckOutDate(newValue);
        console.log(moment(newValue).format("DD/MM/yyyy"));
    };
    // Sort
    const handleClickSearch = () => {

    }
    return (
        <>
            {/*-- HOTEL PROGRESS -- */}
            <HotelProgress step="findDayAndRoom" />

            <div className="section padding-top-bottom z-bigger" style={{ paddingTop: "0px" }}>
                <div className="section z-bigger">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8 mt-4 mt-lg-0">
                                <div className="row">
                                    <HotelItem>
                                        <div className="room-box background-grey">
                                            <div className="room-name">suite tanya</div>
                                            <div className="room-per">
                                                <Star style={{ color: "yellow" }} />
                                                <Star style={{ color: "yellow" }} />
                                                <Star style={{ color: "yellow" }} />
                                                <Star style={{ color: "yellow" }} />
                                                <Star style={{ color: "yellow" }} />
                                            </div>
                                            <Fade bottom>
                                                <img src={picture3} alt="" />
                                            </Fade>
                                            <div className="room-box-in">
                                                <h5 className="">pool suite</h5>
                                                <p className="mt-3">Sed ut perspiciatis unde omnis, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et.</p>
                                                <a className="mt-1 btn btn-primary" href="rooms-gallery.html">book from 130$</a>
                                                <div className="room-icons mt-4 pt-4">
                                                    <img src={svg5} alt="" />
                                                    <img src={svg2} alt="" />
                                                    <img src={svg3} alt="" />
                                                    <DetailRoomButton
                                                        onClick={() => navigate('/room-detail', {
                                                            state: {
                                                                id: 123,
                                                                roomName: "Bungalow"
                                                            }
                                                        })}
                                                    >full info</DetailRoomButton>
                                                </div>
                                            </div>
                                        </div>
                                    </HotelItem>
                                    <HotelItem>
                                        <div className="room-box background-grey">
                                            <div className="room-name">suite helen</div>
                                            <div className="room-per">
                                                <Star style={{ color: "yellow" }} />
                                                <Star style={{ color: "yellow" }} />
                                                <Star style={{ color: "yellow" }} />
                                                <Star style={{ color: "yellow" }} />
                                                <i className="fa fa-star-o"></i>
                                            </div>
                                            <Fade bottom>
                                                <img src={[picture4]} alt="" />
                                            </Fade>
                                            <div className="room-box-in">
                                                <h5 className="">small room</h5>
                                                <p className="mt-3">Sed ut perspiciatis unde omnis, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et.</p>
                                                <a className="mt-1 btn btn-primary" href="rooms-gallery.html">book from 80$</a>
                                                <div className="room-icons mt-4 pt-4">
                                                    <img src={svg4} alt="" />
                                                    <img src={svg2} alt="" />
                                                    <img src={svg6} alt="" />
                                                    <DetailRoomButton
                                                        onClick={() => navigate('/room-detail', {
                                                            state: {
                                                                id: 123,
                                                                roomName: "Bungalow"
                                                            }
                                                        })}
                                                    >full info</DetailRoomButton>
                                                </div>
                                            </div>
                                        </div>
                                    </HotelItem>
                                    <HotelItem>
                                        <div className="room-box background-grey">
                                            <div className="room-name">suite andrea</div>
                                            <div className="room-per">
                                                <Star style={{ color: "yellow" }} />
                                                <Star style={{ color: "yellow" }} />
                                                <Star style={{ color: "yellow" }} />
                                                <Star style={{ color: "yellow" }} />
                                                <Star style={{ color: "yellow" }} />
                                            </div>
                                            <Fade bottom>
                                                <img src={picture5} alt="" />
                                            </Fade>
                                            <div className="room-box-in">
                                                <h5 className="">Apartment</h5>
                                                <p className="mt-3">Sed ut perspiciatis unde omnis, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et.</p>
                                                <a className="mt-1 btn btn-primary" href="rooms-gallery.html">book from 110$</a>
                                                <div className="room-icons mt-4 pt-4">
                                                    <img src={svg5} alt="" />
                                                    <img src={svg2} alt="" />
                                                    <img src={svg3} alt="" />
                                                    <DetailRoomButton
                                                        onClick={() => navigate('/room-detail', {
                                                            state: {
                                                                id: 123,
                                                                roomName: "Bungalow"
                                                            }
                                                        })}
                                                    >full info</DetailRoomButton>
                                                </div>
                                            </div>
                                        </div>
                                    </HotelItem>
                                    <HotelItem>
                                        <div className="room-box background-grey">
                                            <div className="room-name">suite diana</div>
                                            <div className="room-per">
                                                <Star style={{ color: "yellow" }} />
                                                <Star style={{ color: "yellow" }} />
                                                <Star style={{ color: "yellow" }} />
                                                <Star style={{ color: "yellow" }} />
                                                <Star style={{ color: "yellow" }} />
                                            </div>
                                            <Fade bottom>
                                                <img src={picture6} alt="" />
                                            </Fade>
                                            <div className="room-box-in">
                                                <h5 className="">big Apartment</h5>
                                                <p className="mt-3">Sed ut perspiciatis unde omnis, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et.</p>
                                                <a className="mt-1 btn btn-primary" href="rooms-gallery.html">book from 160$</a>
                                                <div className="room-icons mt-4 pt-4">
                                                    <img src={svg5} alt="" />
                                                    <img src={svg2} alt="" />
                                                    <img src={svg3} alt="" />
                                                    <DetailRoomButton
                                                        onClick={() => navigate('/room-detail', {
                                                            state: {
                                                                id: 123,
                                                                roomName: "Bungalow"
                                                            }
                                                        })}
                                                    >full info</DetailRoomButton>
                                                </div>
                                            </div>
                                        </div>
                                    </HotelItem>
                                    <HotelItem>
                                        <div className="room-box background-grey">
                                            <div className="room-name">suite andrea</div>
                                            <div className="room-per">
                                                <Star style={{ color: "yellow" }} />
                                                <Star style={{ color: "yellow" }} />
                                                <Star style={{ color: "yellow" }} />
                                                <Star style={{ color: "yellow" }} />
                                                <Star style={{ color: "yellow" }} />
                                            </div>
                                            <Fade bottom>
                                                <img src={picture5} alt="" />
                                            </Fade>
                                            <div className="room-box-in">
                                                <h5 className="">Apartment</h5>
                                                <p className="mt-3">Sed ut perspiciatis unde omnis, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et.</p>
                                                <a className="mt-1 btn btn-primary" href="rooms-gallery.html">book from 110$</a>
                                                <div className="room-icons mt-4 pt-4">
                                                    <img src={svg5} alt="" />
                                                    <img src={svg2} alt="" />
                                                    <img src={svg3} alt="" />
                                                    <DetailRoomButton
                                                        onClick={() => navigate('/room-detail', {
                                                            state: {
                                                                id: 123,
                                                                roomName: "Bungalow"
                                                            }
                                                        })}
                                                    >full info</DetailRoomButton>
                                                </div>
                                            </div>
                                        </div>
                                    </HotelItem>
                                    <HotelItem>
                                        <div className="room-box background-grey">
                                            <div className="room-name">suite diana</div>
                                            <div className="room-per">
                                                <Star style={{ color: "yellow" }} />
                                                <Star style={{ color: "yellow" }} />
                                                <Star style={{ color: "yellow" }} />
                                                <Star style={{ color: "yellow" }} />
                                                <Star style={{ color: "yellow" }} />
                                            </div>
                                            <Fade bottom>
                                                <img src={picture6} alt="" />
                                            </Fade>
                                            <div className="room-box-in">
                                                <h5 className="">big Apartment</h5>
                                                <p className="mt-3">Sed ut perspiciatis unde omnis, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et.</p>
                                                <a className="mt-1 btn btn-primary" href="rooms-gallery.html">book from 160$</a>
                                                <div className="room-icons mt-4 pt-4">
                                                    <img src={svg5} alt="" />
                                                    <img src={svg2} alt="" />
                                                    <img src={svg3} alt="" />
                                                    <DetailRoomButton
                                                        onClick={() => navigate('/room-detail', {
                                                            state: {
                                                                id: 123,
                                                                roomName: "Bungalow"
                                                            }
                                                        })}
                                                    >full info</DetailRoomButton>
                                                </div>
                                            </div>
                                        </div>
                                    </HotelItem>
                                </div>
                            </div>
                            <div className="col-lg-4 order-first order-lg-last mt-4">
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
                                                    <div className="col-12 pt-4">
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
                                            <div className="row">
                                                <div className="col-12 pt-4">
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
                                                <div className="col-12 pt-4">
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
                                        <div className="col-12 pt-5">
                                            <h6 className="color-white mb-3">Max night price:</h6>
                                            <div className="selecteurPrix">
                                                <div className="range-slider">
                                                    <input className="input-range" type="range" min="1" max="500" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
                                                    <div className="valeurPrix">
                                                        <span className="range-value">{maxPrice} $</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-6 col-lg-12 pt-5">
                                            <h6 className="color-white mb-3">Services:</h6>
                                            <ul className="list">
                                                <li className="list__item">
                                                    <label className="label--checkbox">
                                                        <input type="checkbox" className="checkbox" />
                                                        welcome drink
                                                    </label>
                                                </li>
                                                <li className="list__item">
                                                    <label className="label--checkbox">
                                                        <input type="checkbox" className="checkbox" />
                                                        television
                                                    </label>
                                                </li>
                                                <li className="list__item">
                                                    <label className="label--checkbox">
                                                        <input type="checkbox" className="checkbox" />
                                                        king beds
                                                    </label>
                                                </li>
                                                <li className="list__item">
                                                    <label className="label--checkbox">
                                                        <input type="checkbox" className="checkbox" />
                                                        bike rental
                                                    </label>
                                                </li>
                                                <li className="list__item">
                                                    <label className="label--checkbox">
                                                        <input type="checkbox" className="checkbox" />
                                                        no smoking
                                                    </label>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="col-12 col-md-6 col-lg-12 pt-5">
                                            <h6 className="color-white mb-3">Extra services:</h6>
                                            <ul className="list">
                                                <li className="list__item">
                                                    <label className="label--checkbox">
                                                        <input type="checkbox" className="checkbox" />
                                                        breakfast
                                                    </label>
                                                </li>
                                                <li className="list__item">
                                                    <label className="label--checkbox">
                                                        <input type="checkbox" className="checkbox" />
                                                        swimming pool
                                                    </label>
                                                </li>
                                                <li className="list__item">
                                                    <label className="label--checkbox">
                                                        <input type="checkbox" className="checkbox" />
                                                        car rental
                                                    </label>
                                                </li>
                                                <li className="list__item">
                                                    <label className="label--checkbox">
                                                        <input type="checkbox" className="checkbox" />
                                                        sea view
                                                    </label>
                                                </li>
                                                <li className="list__item">
                                                    <label className="label--checkbox">
                                                        <input type="checkbox" className="checkbox" />
                                                        laundry
                                                    </label>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="col-12 col-md-6 col-lg-12 pt-5" style={{ padding: "0", margin: "0" }}>
                                            <Button className="row">
                                                <ButtonContainer>
                                                    <ButtonClick onClick={() => handleClickSearch()}>
                                                        {/* <ButtonClick style={{marginLeft: "70%"}} className="button-disable"> */}
                                                        Tìm kiếm
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
        </>
    )
}

export default HotelRooms