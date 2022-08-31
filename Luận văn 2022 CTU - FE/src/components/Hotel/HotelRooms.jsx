import React, { useState } from 'react'
import styled from 'styled-components';
// Date picker
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import moment from 'moment';
import { Star } from '@mui/icons-material'
import Fade from 'react-reveal/Fade';

import picture3 from '../../img/room3.jpg';
import picture4 from '../../img/room4.jpg';
import picture5 from '../../img/room5.jpg';
import picture6 from '../../img/room6.jpg';
import svg1 from '../../img/1.svg';
import svg2 from '../../img/2.svg';
import svg3 from '../../img/3.svg';
import svg4 from '../../img/4.svg';
import svg5 from '../../img/5.svg';
import svg6 from '../../img/6.svg';

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

const HotelRooms = () => {
    // STATE
    const [isSelectAdults, setIsSelectAdults] = useState(false);
    const [isSelectChildren, setIsSelectChildren] = useState(false);

    const [checkInDate, setCheckInDate] = useState();
    const [checkOutDate, setCheckOutDate] = useState();

    const [maxPrice, setMaxPrice] = useState();

    const handleChangeCheckInDate = (newValue) => {
        setCheckInDate(newValue);
        console.log(moment(newValue).format("DD/MM/yyyy"));
    };
    const handleChangeCheckOutDate = (newValue) => {
        setCheckOutDate(newValue);
        console.log(moment(newValue).format("DD/MM/yyyy"));
    };
    return (
        <div class="section padding-top-bottom z-bigger" style={{ paddingTop: "75px" }}>
            <div class="section z-bigger">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-8 mt-4 mt-lg-0">
                            <div class="row">
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
                                <HotelItem>
                                    <div class="room-box background-grey">
                                        <div class="room-name">suite helen</div>
                                        <div class="room-per">
                                            <Star style={{ color: "yellow" }} />
                                            <Star style={{ color: "yellow" }} />
                                            <Star style={{ color: "yellow" }} />
                                            <Star style={{ color: "yellow" }} />
                                            <i class="fa fa-star-o"></i>
                                        </div>
                                        <Fade bottom>
                                            <img src={[picture4]} alt="" />
                                        </Fade>
                                        <div class="room-box-in">
                                            <h5 class="">small room</h5>
                                            <p class="mt-3">Sed ut perspiciatis unde omnis, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et.</p>
                                            <a class="mt-1 btn btn-primary" href="rooms-gallery.html">book from 80$</a>
                                            <div class="room-icons mt-4 pt-4">
                                                <img src={svg4} alt="" />
                                                <img src={svg2} alt="" />
                                                <img src={svg6} alt="" />
                                                <a href="rooms-gallery.html">full info</a>
                                            </div>
                                        </div>
                                    </div>
                                </HotelItem>
                                <HotelItem>
                                    <div class="room-box background-grey">
                                        <div class="room-name">suite andrea</div>
                                        <div class="room-per">
                                            <Star style={{ color: "yellow" }} />
                                            <Star style={{ color: "yellow" }} />
                                            <Star style={{ color: "yellow" }} />
                                            <Star style={{ color: "yellow" }} />
                                            <Star style={{ color: "yellow" }} />
                                        </div>
                                        <Fade bottom>
                                            <img src={picture5} alt="" />
                                        </Fade>
                                        <div class="room-box-in">
                                            <h5 class="">Apartment</h5>
                                            <p class="mt-3">Sed ut perspiciatis unde omnis, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et.</p>
                                            <a class="mt-1 btn btn-primary" href="rooms-gallery.html">book from 110$</a>
                                            <div class="room-icons mt-4 pt-4">
                                                <img src={svg5} alt="" />
                                                <img src={svg2} alt="" />
                                                <img src={svg3} alt="" />
                                                <a href="rooms-gallery.html">full info</a>
                                            </div>
                                        </div>
                                    </div>
                                </HotelItem>
                                <HotelItem>
                                    <div class="room-box background-grey">
                                        <div class="room-name">suite diana</div>
                                        <div class="room-per">
                                            <Star style={{ color: "yellow" }} />
                                            <Star style={{ color: "yellow" }} />
                                            <Star style={{ color: "yellow" }} />
                                            <Star style={{ color: "yellow" }} />
                                            <Star style={{ color: "yellow" }} />
                                        </div>
                                        <Fade bottom>
                                            <img src={picture6} alt="" />
                                        </Fade>
                                        <div class="room-box-in">
                                            <h5 class="">big Apartment</h5>
                                            <p class="mt-3">Sed ut perspiciatis unde omnis, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et.</p>
                                            <a class="mt-1 btn btn-primary" href="rooms-gallery.html">book from 160$</a>
                                            <div class="room-icons mt-4 pt-4">
                                                <img src={svg5} alt="" />
                                                <img src={svg2} alt="" />
                                                <img src={svg3} alt="" />
                                                <a href="rooms-gallery.html">full info</a>
                                            </div>
                                        </div>
                                    </div>
                                </HotelItem>
                                <HotelItem>
                                    <div class="room-box background-grey">
                                        <div class="room-name">suite andrea</div>
                                        <div class="room-per">
                                            <Star style={{ color: "yellow" }} />
                                            <Star style={{ color: "yellow" }} />
                                            <Star style={{ color: "yellow" }} />
                                            <Star style={{ color: "yellow" }} />
                                            <Star style={{ color: "yellow" }} />
                                        </div>
                                        <Fade bottom>
                                            <img src={picture5} alt="" />
                                        </Fade>
                                        <div class="room-box-in">
                                            <h5 class="">Apartment</h5>
                                            <p class="mt-3">Sed ut perspiciatis unde omnis, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et.</p>
                                            <a class="mt-1 btn btn-primary" href="rooms-gallery.html">book from 110$</a>
                                            <div class="room-icons mt-4 pt-4">
                                                <img src={svg5} alt="" />
                                                <img src={svg2} alt="" />
                                                <img src={svg3} alt="" />
                                                <a href="rooms-gallery.html">full info</a>
                                            </div>
                                        </div>
                                    </div>
                                </HotelItem>
                                <HotelItem>
                                    <div class="room-box background-grey">
                                        <div class="room-name">suite diana</div>
                                        <div class="room-per">
                                            <Star style={{ color: "yellow" }} />
                                            <Star style={{ color: "yellow" }} />
                                            <Star style={{ color: "yellow" }} />
                                            <Star style={{ color: "yellow" }} />
                                            <Star style={{ color: "yellow" }} />
                                        </div>
                                        <Fade bottom>
                                            <img src={picture6} alt="" />
                                        </Fade>
                                        <div class="room-box-in">
                                            <h5 class="">big Apartment</h5>
                                            <p class="mt-3">Sed ut perspiciatis unde omnis, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et.</p>
                                            <a class="mt-1 btn btn-primary" href="rooms-gallery.html">book from 160$</a>
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
                        <div class="col-lg-4 order-first order-lg-last mt-4">
                            <div class="section background-dark p-4">
                                <div class="row">
                                    <div class="col-12">
                                        <div class="input-daterange input-group" id="flight-datepicker">
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
                                    <div class="col-12">
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
                                    <div class="col-12 pt-5">
                                        <h6 class="color-white mb-3">Max night price:</h6>
                                        <div class="selecteurPrix">
                                            <div class="range-slider">
                                                <input class="input-range" type="range" min="1" max="500" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
                                                <div class="valeurPrix">
                                                    <span class="range-value">{maxPrice} $</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-12 col-md-6 col-lg-12 pt-5">
                                        <h6 class="color-white mb-3">Services:</h6>
                                        <ul class="list">
                                            <li class="list__item">
                                                <label class="label--checkbox">
                                                    <input type="checkbox" class="checkbox" />
                                                    welcome drink
                                                </label>
                                            </li>
                                            <li class="list__item">
                                                <label class="label--checkbox">
                                                    <input type="checkbox" class="checkbox" />
                                                    television
                                                </label>
                                            </li>
                                            <li class="list__item">
                                                <label class="label--checkbox">
                                                    <input type="checkbox" class="checkbox" />
                                                    king beds
                                                </label>
                                            </li>
                                            <li class="list__item">
                                                <label class="label--checkbox">
                                                    <input type="checkbox" class="checkbox" />
                                                    bike rental
                                                </label>
                                            </li>
                                            <li class="list__item">
                                                <label class="label--checkbox">
                                                    <input type="checkbox" class="checkbox" />
                                                    no smoking
                                                </label>
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="col-12 col-md-6 col-lg-12 pt-5">
                                        <h6 class="color-white mb-3">Extra services:</h6>
                                        <ul class="list">
                                            <li class="list__item">
                                                <label class="label--checkbox">
                                                    <input type="checkbox" class="checkbox" />
                                                    breakfast
                                                </label>
                                            </li>
                                            <li class="list__item">
                                                <label class="label--checkbox">
                                                    <input type="checkbox" class="checkbox" />
                                                    swimming pool
                                                </label>
                                            </li>
                                            <li class="list__item">
                                                <label class="label--checkbox">
                                                    <input type="checkbox" class="checkbox" />
                                                    car rental
                                                </label>
                                            </li>
                                            <li class="list__item">
                                                <label class="label--checkbox">
                                                    <input type="checkbox" class="checkbox" />
                                                    sea view
                                                </label>
                                            </li>
                                            <li class="list__item">
                                                <label class="label--checkbox">
                                                    <input type="checkbox" class="checkbox" />
                                                    laundry
                                                </label>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HotelRooms