import { ArrowBackOutlined, ArrowForwardOutlined, StarBorderOutlined } from '@mui/icons-material';
import React, { useState } from 'react';
import styled from 'styled-components';
// Date picker
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import moment from 'moment';
// Image slider
import background1 from "../../img/1.jpg";
import background2 from "../../img/2.jpg";
import background3 from "../../img/3.jpg";
import { Link } from 'react-router-dom';

const Section = styled.div``
const CenterSection = styled.div``
const CenterContainer = styled.div``
const CenterRow = styled.div``
const CenterCol10 = styled.div``
const CenterText = styled.div``
const CenterCol12 = styled.div``
const CenterIcons = styled.div``
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
const BookingNumberCol = styled.div``

const BookingNumberNiceSelect = styled.div``
const BookingNumberNiceSelectSpan = styled.span``
const BookingNumberNiceSelectUl = styled.ul``
const BookingNumberNiceSelectLi = styled.li``

const BookingButton = styled.div``
const BookingButtonA = styled.div``

const ArrowNav = styled.nav``
const ArrowNavButton = styled.button``
const ArrowNavSvg = styled.svg``

const SlideContainer = styled.div`
    width: 100%;
    height: 100vh;
    display: flex;
    position: relative;
    overflow: hidden;
`

const Wrapper = styled.div`
    height: 100%;
    display: flex;
    transition: all 1.5s ease;
    transform: translateX(${props => props.slideIndex * -100}vw);
`

const Slide = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    background-color: #${props => props.bg};

    position: relative;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    background-size: cover;
    opacity: 1;
    will-change: transform;
`

const HomeLanding = () => {
    // STATE
    const [isSelectAdults, setIsSelectAdults] = useState(false);
    const [isSelectChildren, setIsSelectChildren] = useState(false);

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

    // Slider home
    const [slideIndex, setSlideIndex] = useState(0);
    const handleClick = (direction) => {


        if (direction === "left") {
            setSlideIndex(slideIndex > 0 ? slideIndex - 1 : 2);
        } else {
            setSlideIndex(slideIndex < 2 ? slideIndex + 1 : 0);
        }
    };
    const sliderItems = [
        {
            id: 1,
            img: background1,
        },
        {
            id: 2,
            img: background2,
        },
        {
            id: 3,
            img: background3,
        },
    ]

    return (
        <Section className="section background-dark over-hide">
            <CenterSection className="hero-center-section">
                <CenterContainer className="container">
                    <CenterRow className="row justify-content-center">
                        <CenterCol10 className="col-10 col-sm-8 parallax-fade-top">
                            <CenterText className="hero-text">Thương hiệu nhà hàng khách sạn hàng đầu Việt Nam</CenterText>
                        </CenterCol10>
                        <CenterCol12 className="col-12 mt-3 mb-5 parallax-fade-top">
                            <CenterIcons className="hero-stars">
                                <StarBorderOutlined className='fa' />
                                <StarBorderOutlined className='fa' />
                                <StarBorderOutlined className='fa' />
                                <StarBorderOutlined className='fa' />
                                <StarBorderOutlined className='fa' />
                            </CenterIcons>
                        </CenterCol12>

                        <CenterBooking className="col-12 mt-3 parallax-fade-top">
                            <CenterBookingWrapper className="booking-hero-wrap">
                                <BookingRow className="row justify-content-center">
                                    <BookingCol5 className="col-5 no-mob">
                                        <InputDateRange className="input-daterange input-group" id="flight-datepicker">
                                            <InputDateRangeRow className="row">
                                                <InputDateRangeCol6 className="col-6">
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
                                                </InputDateRangeCol6>
                                                <InputDateRangeCol6 className="col-6">
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
                                                </InputDateRangeCol6>
                                            </InputDateRangeRow>
                                        </InputDateRange>
                                    </BookingCol5>

                                    <BookingNumber className="col-5 no-mob">
                                        <BookingNumberRow className="row">
                                            <BookingNumberCol className="col-6">
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
                                            </BookingNumberCol>
                                            <BookingNumberCol className="col-6">
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
                                            </BookingNumberCol>
                                        </BookingNumberRow>
                                    </BookingNumber>
                                    <BookingButton className="col-6  col-sm-4 col-lg-2">
                                        <Link to="/hotel">
                                            <BookingButtonA className="booking-button">Đặt phòng ngay</BookingButtonA>
                                        </Link>
                                    </BookingButton>
                                </BookingRow>
                            </CenterBookingWrapper>
                        </CenterBooking>
                    </CenterRow>
                </CenterContainer>
            </CenterSection>

            {/* SLIDER */}
            <SlideContainer>
                <Wrapper slideIndex={slideIndex}>
                    {sliderItems.map((item) => (
                        <Slide style={{ backgroundImage: `url(${item.img})` }} />
                    ))}
                </Wrapper>
            </SlideContainer>

            {/* ARROW BUTTON */}
            <ArrowNav className="arrow-nav fade-top" style={{ backgroundColor: "#181818" }}>
                <ArrowNavButton className="arrow-nav__item"
                    direction="left" onClick={() => handleClick("left")}
                >
                    <ArrowNavSvg className="icon icon--nav"><ArrowBackOutlined /></ArrowNavSvg>
                </ArrowNavButton>
                <ArrowNavButton className="arrow-nav__item"
                    direction="right" onClick={() => handleClick("right")}
                >
                    <ArrowNavSvg className="icon icon--nav"><ArrowForwardOutlined /></ArrowNavSvg>
                </ArrowNavButton>
            </ArrowNav>
        </Section>
    )
}

export default HomeLanding