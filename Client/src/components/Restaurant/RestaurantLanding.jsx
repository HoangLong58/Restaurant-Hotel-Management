import React, { useState } from 'react';
import styled from 'styled-components';
import videoRestaurant from '../../video/restaurant.mp4';
// Date picker
import { Add, Remove } from '@mui/icons-material';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import moment from 'moment';

const CenterBooking = styled.div``
const CenterBookingWrapper = styled.div``
const BookingRow = styled.div``
const BookingCol5 = styled.div``
const InputDateRange = styled.div``
const InputDateRangeRow = styled.div``
const InputDateRangeCol6 = styled.div``
const InputDateRangeFormItem = styled.div``

const BookingNumber = styled.div``
const BookingNumberRow = styled.div``
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
const BookingRestaurantQuantityInput = styled.input``
const BookingRestaurantQuantityButton = styled.div`
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
        &::before {
        top: -30px;
        left: -30px;
        width: 100px;
        height: 100px;
        background-color: rgba(255, 255, 255, 0);
    }
}
`

const RestaurantLanding = (props) => {
    // STATE
    const [quantityBooking, setQuantityBooking] = useState(0);

    const [checkInDate, setCheckInDate] = useState();
    const [checkOutDate, setCheckOutDate] = useState();

    const handleChangeCheckInDate = (newValue) => {
        setCheckInDate(newValue);
        console.log(moment(newValue).format("DD/MM/yyyy"));
    };
    const handleChangeCheckOutDate = (newValue) => {
        setCheckOutDate(newValue);
        console.log(moment(newValue).format("DD/MM/yyyy"));
    };
    // Handle Increase/ Decrease quantity
    const handleClickIncreaseQuantity = () => {
        setQuantityBooking(prev => prev + 1);
    }
    const handleClickDecreaseQuantity = () => {
        setQuantityBooking(prev => prev - 1);
    }
    return (
        <div class="section big-55-height over-hide z-bigger">

            <div id="poster_background-res"></div>
            <div id="video-wrap" class="parallax-top">
                <video id="video_background" preload="auto" autoPlay loop="loop" muted="muted">
                    <source src={videoRestaurant} type="video/mp4" />
                </video>
            </div>
            <div class="dark-over-pages"></div>

            <div class="hero-center-section pages">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-12 parallax-fade-top">
                            <div class="hero-text">{props.name ? props.name : "Nhà hàng"}</div>
                        </div>
                        <CenterBooking className="col-12 mt-3 parallax-fade-top" style={{ display: props.type === "noneBooking" ? "none" : "block" }}>
                            <CenterBookingWrapper className="booking-hero-wrap">
                                <BookingRow className="row justify-content-center">
                                    <BookingCol5 className="col-8 no-mob">
                                        <InputDateRange className="input-daterange input-group" id="flight-datepicker">
                                            <InputDateRangeRow className="row">
                                                <InputDateRangeCol6 className="col-6">
                                                    <InputDateRangeFormItem className="form-item">
                                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                            <Stack spacing={3}>
                                                                <DesktopDatePicker
                                                                    label="Ngày đãi tiệc"
                                                                    inputFormat="dd/MM/yyyy"
                                                                    value={checkInDate}
                                                                    onChange={(newValue) => handleChangeCheckInDate(newValue)}
                                                                    renderInput={(params) => <TextField {...params} />}
                                                                    InputProps={{ sx: { '& .MuiSvgIcon-root': { color: "white" } } }}
                                                                />
                                                            </Stack>
                                                        </LocalizationProvider>
                                                    </InputDateRangeFormItem>
                                                </InputDateRangeCol6>
                                                <InputDateRangeCol6 className="col-6">
                                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                        <Stack spacing={3}>
                                                            <DesktopDatePicker
                                                                label="Ngày kết thúc"
                                                                inputFormat="dd/MM/yyyy"
                                                                value={checkOutDate}
                                                                onChange={(newValue) => handleChangeCheckOutDate(newValue)}
                                                                renderInput={(params) => <TextField {...params} />}
                                                                InputProps={{ sx: { '& .MuiSvgIcon-root': { color: "white" } } }}
                                                            />
                                                        </Stack>
                                                    </LocalizationProvider>
                                                </InputDateRangeCol6>
                                            </InputDateRangeRow>
                                        </InputDateRange>
                                    </BookingCol5>

                                    <BookingNumber className="col-2 no-mob">
                                        <BookingNumberRow className="row">
                                            <BookingRestaurantQuantity className="quantity">
                                                <BookingRestaurantQuantityButton className="video-button"
                                                    onClick={() => handleClickDecreaseQuantity()}
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    <Remove />
                                                </BookingRestaurantQuantityButton>
                                                <BookingRestaurantQuantityInput
                                                    type="number"
                                                    min="1"
                                                    max="200"
                                                    step="1"
                                                    value={quantityBooking}
                                                    onChange={(e) => setQuantityBooking(e.target.value)}
                                                />
                                                <BookingRestaurantQuantityButton className="video-button"
                                                    onClick={() => handleClickIncreaseQuantity()}
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    <Add />
                                                </BookingRestaurantQuantityButton>
                                            </BookingRestaurantQuantity>
                                        </BookingNumberRow>
                                    </BookingNumber>

                                    <BookingButton className="col-6  col-sm-4 col-lg-2">
                                        <BookingButtonA className="booking-button" href="search.html">Đặt phòng ngay</BookingButtonA>
                                    </BookingButton>
                                </BookingRow>
                            </CenterBookingWrapper>
                        </CenterBooking>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RestaurantLanding