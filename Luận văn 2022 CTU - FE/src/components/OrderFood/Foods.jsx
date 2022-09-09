import { SearchOutlined, ShoppingCartOutlined } from '@mui/icons-material';
import React, { useState } from 'react';
import styled from 'styled-components';
// Multi carousel
import 'react-multi-carousel/lib/styles.css';

import picture1 from '../../img/food1.jpg';
import picture2 from '../../img/food2.jpg';
import picture3 from '../../img/food3.jpg';
import picture4 from '../../img/food4.jpg';

// Date picker
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';


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
    align-items: flex-end;
    justify-content: flex-end;
    transition: all 0.5s ease;
    cursor: pointer;
`

const Circle = styled.div`
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background-color: white;
    position: absolute;
`

const Icon = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 50%;
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

const MealName = styled.h6`
    position: absolute;
`
const MealDetail = styled.p`
    position: absolute;
`
const MealPrice = styled.h5`
    position: absolute;
`

const MealItem = styled.div`
    -ms-flex: 0 0 48%;
    flex: 0 0 48%;
    max-width: 47%;
    position: relative;
    width: 100%;
    padding-right: 15px;
    padding-left: 15px;
    margin-top: 1.5rem !important;
    margin-left: 20px;
    padding-left: 0;
    &:hover ${Info} {
        opacity: 1;
    };
    &:hover ${MealName} {
        top: 80px;
        transition: top 0.18s;
    };
    &:hover ${MealDetail} {
        top: 80px;
        transition: top 0.18s;
    };
    &:hover ${MealPrice} {
        z-index: 4;
    };
`

// View slider
const ViewImage = styled.img`
    display: block;
    width: 90%;
    max-height: 100%;
    -webkit-transition: all 300ms linear;
	transition: all 300ms linear;
`

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

const Foods = () => {
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
        <div class="section padding-top-bottom z-bigger" style={{ paddingTop: "15px" }}>
            <div class="container">
                <div className="row">
                    <div className="col-lg-8">
                        <div className="row">
                            <div className="col-md-12">
                                <div class="row justify-content-center" style={{ marginTop: "25px" }}>
                                    <div class="col-md-8 align-self-center">
                                        <div class="subtitle with-line text-center mb-4">Hoàng Long Restaurant</div>
                                        <h3 class="text-center padding-bottom-small" style={{ paddingBottom: "20px" }}>Cơm-Mì-Lẩu</h3>
                                    </div>
                                    <div class="section clearfix"></div>
                                    <MealItem>
                                        <Circle />
                                        <Info>
                                            <Icon>
                                                <ShoppingCartOutlined />
                                            </Icon>
                                            <Icon>
                                                <SearchOutlined />
                                            </Icon>
                                        </Info>
                                        <div class="restaurant-box">
                                            <img src={picture1} alt="" />
                                            <MealName><span>imported salmon steak</span></MealName>
                                            <MealDetail><span>salmon / veggies / oil</span></MealDetail>
                                            <MealPrice><span>$32</span></MealPrice>
                                        </div>
                                    </MealItem>
                                    <MealItem>
                                        <Circle />
                                        <Info>
                                            <Icon>
                                                <ShoppingCartOutlined />
                                            </Icon>
                                            <Icon>
                                                <SearchOutlined />
                                            </Icon>
                                        </Info>
                                        <div class="restaurant-box">
                                            <img src={picture1} alt="" />
                                            <MealName><span>imported salmon steak</span></MealName>
                                            <MealDetail><span>salmon / veggies / oil</span></MealDetail>
                                            <MealPrice><span>$32</span></MealPrice>
                                        </div>
                                    </MealItem>
                                    <MealItem>
                                        <Circle />
                                        <Info>
                                            <Icon>
                                                <ShoppingCartOutlined />
                                            </Icon>
                                            <Icon>
                                                <SearchOutlined />
                                            </Icon>
                                        </Info>
                                        <div class="restaurant-box">
                                            <img src={picture1} alt="" />
                                            <MealName><span>imported salmon steak</span></MealName>
                                            <MealDetail><span>salmon / veggies / oil</span></MealDetail>
                                            <MealPrice><span>$32</span></MealPrice>
                                        </div>
                                    </MealItem>
                                    <MealItem>
                                        <Circle />
                                        <Info>
                                            <Icon>
                                                <ShoppingCartOutlined />
                                            </Icon>
                                            <Icon>
                                                <SearchOutlined />
                                            </Icon>
                                        </Info>
                                        <div class="restaurant-box">
                                            <img src={picture1} alt="" />
                                            <MealName><span>imported salmon steak</span></MealName>
                                            <MealDetail><span>salmon / veggies / oil</span></MealDetail>
                                            <MealPrice><span>$32</span></MealPrice>
                                        </div>
                                    </MealItem>
                                    <MealItem>
                                        <Circle />
                                        <Info>
                                            <Icon>
                                                <ShoppingCartOutlined />
                                            </Icon>
                                            <Icon>
                                                <SearchOutlined />
                                            </Icon>
                                        </Info>
                                        <div class="restaurant-box">
                                            <img src={picture1} alt="" />
                                            <MealName><span>imported salmon steak</span></MealName>
                                            <MealDetail><span>salmon / veggies / oil</span></MealDetail>
                                            <MealPrice><span>$32</span></MealPrice>
                                        </div>
                                    </MealItem>
                                    <MealItem>
                                        <Circle />
                                        <Info>
                                            <Icon>
                                                <ShoppingCartOutlined />
                                            </Icon>
                                            <Icon>
                                                <SearchOutlined />
                                            </Icon>
                                        </Info>
                                        <div class="restaurant-box">
                                            <img src={picture1} alt="" />
                                            <MealName><span>imported salmon steak</span></MealName>
                                            <MealDetail><span>salmon / veggies / oil</span></MealDetail>
                                            <MealPrice><span>$32</span></MealPrice>
                                        </div>
                                    </MealItem>
                                    <MealItem>
                                        <Circle />
                                        <Info>
                                            <Icon>
                                                <ShoppingCartOutlined />
                                            </Icon>
                                            <Icon>
                                                <SearchOutlined />
                                            </Icon>
                                        </Info>
                                        <div class="restaurant-box">
                                            <img src={picture1} alt="" />
                                            <MealName><span>imported salmon steak</span></MealName>
                                            <MealDetail><span>salmon / veggies / oil</span></MealDetail>
                                            <MealPrice><span>$32</span></MealPrice>
                                        </div>
                                    </MealItem>
                                    <MealItem>
                                        <Circle />
                                        <Info>
                                            <Icon>
                                                <ShoppingCartOutlined />
                                            </Icon>
                                            <Icon>
                                                <SearchOutlined />
                                            </Icon>
                                        </Info>
                                        <div class="restaurant-box">
                                            <img src={picture1} alt="" />
                                            <MealName><span>imported salmon steak</span></MealName>
                                            <MealDetail><span>salmon / veggies / oil</span></MealDetail>
                                            <MealPrice><span>$32</span></MealPrice>
                                        </div>
                                    </MealItem>
                                    <MealItem>
                                        <Circle />
                                        <Info>
                                            <Icon>
                                                <ShoppingCartOutlined />
                                            </Icon>
                                            <Icon>
                                                <SearchOutlined />
                                            </Icon>
                                        </Info>
                                        <div class="restaurant-box">
                                            <img src={picture2} alt="" />
                                            <MealName><span>tuna roast source</span></MealName>
                                            <MealDetail><span>tuna / potatoes / rice</span></MealDetail>
                                            <MealPrice><span>$47</span></MealPrice>
                                        </div>
                                    </MealItem>
                                    <MealItem>
                                        <Circle />
                                        <Info>
                                            <Icon>
                                                <ShoppingCartOutlined />
                                            </Icon>
                                            <Icon>
                                                <SearchOutlined />
                                            </Icon>
                                        </Info>
                                        <div class="restaurant-box">
                                            <img src={picture3} alt="" />
                                            <MealName><span>salted fried chicken</span></MealName>
                                            <MealDetail><span>chicken / olive oil / salt</span></MealDetail>
                                            <MealPrice><span>$26</span></MealPrice>
                                        </div>
                                    </MealItem>
                                    <MealItem>
                                        <Circle />
                                        <Info>
                                            <Icon>
                                                <ShoppingCartOutlined />
                                            </Icon>
                                            <Icon>
                                                <SearchOutlined />
                                            </Icon>
                                        </Info>
                                        <div class="restaurant-box">
                                            <img src={picture4} alt="" />
                                            <MealName><span>crab with curry sources</span></MealName>
                                            <MealDetail><span>crab / potatoes / rice</span></MealDetail>
                                            <MealPrice><span>$64</span></MealPrice>
                                        </div>
                                    </MealItem>
                                </div>
                            </div>
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
    )
}

export default Foods