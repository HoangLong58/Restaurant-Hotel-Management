import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
// Date picker
import { Star, StarBorder, StarHalf } from '@mui/icons-material';
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

// Service
import * as ServiceService from "../../service/ServiceService";
import * as RoomService from "../../service/RoomService";
import Toast from '../Toast';
import { format_money, handleShowStar } from '../../utils/utils';

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

const HotelRooms = () => {
    const navigate = useNavigate();
    // STATE
    const [maxPrice, setMaxPrice] = useState(0);

    // HANDLE - date
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

    // Toast
    const [dataToast, setDataToast] = useState({ message: "alo alo", type: "success" });
    const toastRef = useRef(null);

    const showToastFromOut = (dataShow) => {
        setDataToast(dataShow);
        toastRef.current.show();
    };

    // Children & adults quantity
    const [isSelectAdults, setIsSelectAdults] = useState(false);
    const [isSelectChildren, setIsSelectChildren] = useState(false);
    const [adultsQuantity, setAdultsQuantity] = useState();
    const [childrenQuantity, setChildrenQuantity] = useState();


    const handleClickAdult = (quantity) => {
        setAdultsQuantity(quantity);
        setIsSelectAdults(prev => !prev);
    };
    const handleClickChildren = (quantity) => {
        setChildrenQuantity(quantity);
        setIsSelectChildren(prev => !prev);
    };

    // Service checkbox
    const [servicesList, setServicesList] = useState([]);
    useEffect(() => {
        const getServices = async () => {
            const res = await ServiceService.getServices();
            setServicesList(res.data.data);
            console.log(res);
        };
        getServices();
    }, []);

    // Get rooms and services
    const [isLoading, setIsLoading] = useState(false);
    const [filterList, setFilterList] = useState([]);
    const [roomList, setRoomList] = useState([]);
    const [roomListFiltered, setRoomListFiltered] = useState([]);
    const [minRoomPrice, setMinRoomPrice] = useState();
    const [maxRoomPrice, setMaxRoomPrice] = useState();
    const [noResultFound, setNoResultFound] = useState(false);
    const [sort, setSort] = useState();
    const [isSelectSort, setIsSelectSort] = useState(false);



    useEffect(() => {
        const getRoomsAndServices = async () => {
            const res = await RoomService.getRoomsAndServices();
            setRoomList(res.data.data);
            console.log(res);
            // Loading when fetch data
            handleLoading();
        };
        getRoomsAndServices();
        const getMinMaxRoomPrice = async () => {
            const res = await RoomService.getMinMaxRoomPrice();
            setMinRoomPrice(res.data.data.min_room_price);
            setMaxRoomPrice(res.data.data.max_room_price);
        };
        getMinMaxRoomPrice();
    }, []);


    const handleCheckService = (e) => {
        const value = parseInt(e.target.value);
        if (e.currentTarget.checked) {
            if (!filterList.includes(value)) {
                filterList.push(value);
            }
        } else {
            if (filterList.includes(value)) {
                let index = filterList.indexOf(value);
                filterList.splice(index, 1);
            }
        }
        console.log("filterList: ", filterList);
    };

    useEffect(() => {
        if (sort === "decreasePrice") {
            setRoomList((prev) =>
                [...prev].sort((a, b) => b.room_price - a.room_price)
            );
            setRoomListFiltered((prev) =>
                [...prev].sort((a, b) => b.room_price - a.room_price)
            );
        } else if (sort === "increasePrice") {
            setRoomList((prev) =>
                [...prev].sort((a, b) => a.room_price - b.room_price)
            );
            setRoomListFiltered((prev) =>
                [...prev].sort((a, b) => a.room_price - b.room_price)
            );
        } else if (sort === "decreaseVote") {
            setRoomList((prev) =>
                [...prev].sort((a, b) => b.room_type_vote_total - a.room_type_vote_total)
            );
            setRoomListFiltered((prev) =>
                [...prev].sort((a, b) => b.room_type_vote_total - a.room_type_vote_total)
            );
        } else {
            setRoomList((prev) =>
                [...prev].sort((a, b) => a.room_type_vote_total - b.room_type_vote_total)
            );
            setRoomListFiltered((prev) =>
                [...prev].sort((a, b) => a.room_type_vote_total - b.room_type_vote_total)
            );
        }
    }, [sort]);

    // Fake loading when fetch data
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
    // Search
    const handleClickSearch = () => {
        setSort();
        const findRoomsAndServices = async () => {
            try {
                const res = await RoomService.findRoomsAndServices({
                    checkInDate: moment(checkInDate).format('YYYY-MM-DD'),
                    checkOutDate: moment(checkOutDate).format('YYYY-MM-DD'),
                    adultsQuantity: adultsQuantity,
                    childrenQuantity: childrenQuantity,
                    maxPrice: maxPrice,
                    filterList: filterList
                });
                const roomListFiltered = res.data.data;
                setRoomListFiltered(res.data.data);
                if (roomListFiltered.length > 0) {
                    setNoResultFound(false);
                    // Toast
                    const dataToast = { message: "???? t??m ???????c ph??ng ph?? h???p!", type: "success" };
                    showToastFromOut(dataToast);
                } else {
                    setNoResultFound(true);
                    // Toast
                    const dataToast = { message: "Kh??ng t??m th???y ph??ng ph?? h???p!", type: "warning" };
                    showToastFromOut(dataToast);
                }
                handleLoading();
                console.log(res);
            } catch (err) {
                console.log("err: ", err);
                const errorMessage = err.response.data.message;
                const dataToast = { message: errorMessage, type: "danger" };
                showToastFromOut(dataToast);

                // C?? l???i th?? quay v??? c??c ph??ng ?????u ti??n
                setNoResultFound(false);
                setRoomListFiltered([]);
            }
        };
        findRoomsAndServices();
    };

    const handleClickFullInfo = (roomId) => {
        console.log(checkInDate, checkOutDate, adultsQuantity, childrenQuantity)
        if (!checkInDate || !checkOutDate || !adultsQuantity || !childrenQuantity) {
            // Toast
            const dataToast = { message: "Vui l??ng ch???n th???i gian Checkin/ Checkout & s??? l?????ng kh??ch.", type: "warning" };
            showToastFromOut(dataToast);
            return;
        };
        navigate("/room-detail", {
            state: {
                room_id: roomId,
                checkInDate: checkInDate,
                checkOutDate: checkOutDate,
                adultsQuantity: adultsQuantity,
                childrenQuantity: childrenQuantity,
                roomsSuggest: roomListFiltered.length > 0 ? roomListFiltered : roomList
            }
        });
    };

    console.log("roomList: ", roomList);
    return (
        <>
            {/*-- HOTEL PROGRESS -- */}
            <HotelProgress step="findDayAndRoom" />

            <div className="section padding-top-bottom z-bigger" style={{ paddingTop: "0px" }}>
                <div className="section z-bigger">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8 mt-4 mt-lg-0">
                                {/* FETCH DATA */}
                                {isLoading ? (
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
                                    <div className="row">
                                        {
                                            noResultFound ? (
                                                <PictureNoResultFound id="No_Result_Found_Picture">
                                                    <Img
                                                        src="https://img.freepik.com/premium-vector/file-found-illustration-with-confused-people-holding-big-magnifier-search-no-result_258153-336.jpg?w=2000"
                                                        alt="Not Found Result"
                                                    />
                                                    <H1NoResultFound>Kh??ng t??m ???????c k???t qu???</H1NoResultFound>
                                                </PictureNoResultFound>
                                            )
                                                : (
                                                    roomListFiltered.length > 0 ?
                                                        (
                                                            roomListFiltered.map((room, key) => {
                                                                const service = room.serviceList;
                                                                return (
                                                                    <HotelItem>
                                                                        <div className="room-box background-grey">
                                                                            <div className="room-name">{room.floor_name}</div>
                                                                            {handleShowStar(room.room_type_vote_total)}
                                                                            <Fade bottom>
                                                                                <img src={room.room_image_content} alt="" style={{ height: "234px", objectFit: "cover", objectPosition: "center" }} />
                                                                            </Fade>
                                                                            <div className="room-box-in">
                                                                                <h5 className="">{room.room_type_name}</h5>
                                                                                <p className="mt-3" style={{ overflow: "hidden", display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: "3" }}>{room.room_description}</p>
                                                                                <a className="mt-1 btn btn-primary" style={{ color: "var(--color-white)" }}
                                                                                    onClick={() => handleClickFullInfo(room.room_id)}
                                                                                >?????t gi?? {format_money(room.room_price)} VN??</a>
                                                                                <div className="room-icons mt-4 pt-4">
                                                                                    {
                                                                                        service.map((serviceItem, key) => {
                                                                                            if (key > 3) return null;
                                                                                            return (
                                                                                                <img src={serviceItem.service_image} alt="" />
                                                                                            )
                                                                                        })
                                                                                    }
                                                                                    <DetailRoomButton
                                                                                        onClick={() => handleClickFullInfo(room.room_id)}
                                                                                    >chi ti???t</DetailRoomButton>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </HotelItem>
                                                                );
                                                            })
                                                        )
                                                        : (
                                                            roomList ? (
                                                                roomList.map((room, key) => {
                                                                    const service = room.serviceList;
                                                                    return (
                                                                        <HotelItem>
                                                                            <div className="room-box background-grey">
                                                                                <div className="room-name">{room.floor_name}</div>
                                                                                {handleShowStar(room.room_type_vote_total)}
                                                                                <Fade bottom>
                                                                                    <img src={room.room_image_content} alt="" style={{ height: "234px", objectFit: "cover", objectPosition: "center" }} />
                                                                                </Fade>
                                                                                <div className="room-box-in">
                                                                                    <h5 className="">{room.room_type_name}</h5>
                                                                                    <p className="mt-3" style={{ overflow: "hidden", display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: "3" }}>{room.room_description}</p>

                                                                                    <div className="room-icons mt-4 pt-4">
                                                                                        {
                                                                                            service.map((serviceItem, key) => {
                                                                                                return (
                                                                                                    <img src={serviceItem.service_image} alt="" />
                                                                                                )
                                                                                            })
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </HotelItem>
                                                                    );
                                                                })
                                                            ) : null
                                                        )
                                                )
                                        }
                                    </div>
                                )}

                            </div>
                            <div className="col-lg-4 order-first order-lg-last mt-4">
                                <div className="section background-dark p-4">
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="row">
                                                <div className="col-12">
                                                    <BookingNumberNiceSelect name="adults" className={isSelectSort ? "nice-select wide open" : "nice-select wide"} onClick={() => setIsSelectSort(prev => !prev)}>
                                                        <BookingNumberNiceSelectSpan className='current'>{
                                                            sort ?
                                                                sort === "decreasePrice" ? "Gi?? gi???m d???n"
                                                                    : sort === "increasePrice" ? "Gi?? t??ng d???n"
                                                                        : sort === "decreaseVote" ? "????nh gi?? gi???m d???n"
                                                                            : sort === "increaseVote" ? "????nh gi?? t??ng d???n"
                                                                                : null : "S???p x???p theo"}
                                                        </BookingNumberNiceSelectSpan>
                                                        <BookingNumberNiceSelectUl className='list'>
                                                            <BookingNumberNiceSelectLi className='option focus selected'>S???p x???p theo</BookingNumberNiceSelectLi>
                                                            <BookingNumberNiceSelectLi onClick={() => setSort("decreasePrice")} className='option'>Gi?? gi???m d???n</BookingNumberNiceSelectLi>
                                                            <BookingNumberNiceSelectLi onClick={() => setSort("increasePrice")} className='option'>Gi?? t??ng d???n</BookingNumberNiceSelectLi>
                                                            <BookingNumberNiceSelectLi onClick={() => setSort("decreaseVote")} className='option'>????nh gi?? gi???m d???n</BookingNumberNiceSelectLi>
                                                            <BookingNumberNiceSelectLi onClick={() => setSort("increaseVote")} className='option'>????nh gi?? t??ng d???n</BookingNumberNiceSelectLi>
                                                        </BookingNumberNiceSelectUl>
                                                    </BookingNumberNiceSelect>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="section background-dark p-4 mt-4">
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="input-daterange input-group" id="flight-datepicker">
                                                <div className="row">
                                                    <div className="col-12">
                                                        <InputDateRangeFormItem classNameName="form-item">
                                                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                                <Stack spacing={3}>
                                                                    <DesktopDatePicker
                                                                        label="Ng??y ?????t ph??ng"
                                                                        inputFormat="dd/MM/yyyy"
                                                                        minDate={new Date()}
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
                                                                    label="Ng??y tr??? ph??ng"
                                                                    inputFormat="dd/MM/yyyy"
                                                                    minDate={checkInDate}
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
                                                        <BookingNumberNiceSelectSpan className='current'>{adultsQuantity ? adultsQuantity : "Ng?????i l???n"}</BookingNumberNiceSelectSpan>
                                                        <BookingNumberNiceSelectUl className='list'>
                                                            <BookingNumberNiceSelectLi className='option focus selected'>Ng?????i l???n</BookingNumberNiceSelectLi>
                                                            <BookingNumberNiceSelectLi onClick={() => { handleClickAdult(1); setIsSelectAdults(prev => !prev); }} className='option'>1 ng?????i l???n</BookingNumberNiceSelectLi>
                                                            <BookingNumberNiceSelectLi onClick={() => { handleClickAdult(2); setIsSelectAdults(prev => !prev); }} className='option'>2 ng?????i l???n</BookingNumberNiceSelectLi>
                                                            <BookingNumberNiceSelectLi onClick={() => { handleClickAdult(3); setIsSelectAdults(prev => !prev); }} className='option'>3 ng?????i l???n</BookingNumberNiceSelectLi>
                                                            <BookingNumberNiceSelectLi onClick={() => { handleClickAdult(4); setIsSelectAdults(prev => !prev); }} className='option'>4 ng?????i l???n</BookingNumberNiceSelectLi>
                                                            <BookingNumberNiceSelectLi onClick={() => { handleClickAdult(5); setIsSelectAdults(prev => !prev); }} className='option'>5 ng?????i l???n</BookingNumberNiceSelectLi>
                                                        </BookingNumberNiceSelectUl>
                                                    </BookingNumberNiceSelect>
                                                </div>
                                                <div className="col-12 pt-4">
                                                    <BookingNumberNiceSelect name="children" className={isSelectChildren ? "nice-select wide open" : "nice-select wide"} onClick={() => setIsSelectChildren(prev => !prev)}>
                                                        <BookingNumberNiceSelectSpan className='current'>{childrenQuantity ? childrenQuantity : "Tr??? em"}</BookingNumberNiceSelectSpan>
                                                        <BookingNumberNiceSelectUl className='list'>
                                                            <BookingNumberNiceSelectLi className='option focus selected'>Tr??? em</BookingNumberNiceSelectLi>
                                                            <BookingNumberNiceSelectLi onClick={() => { handleClickChildren(1); setIsSelectChildren(prev => !prev); }} className='option'>1 tr??? em</BookingNumberNiceSelectLi>
                                                            <BookingNumberNiceSelectLi onClick={() => { handleClickChildren(2); setIsSelectChildren(prev => !prev); }} className='option'>2 tr??? em</BookingNumberNiceSelectLi>
                                                            <BookingNumberNiceSelectLi onClick={() => { handleClickChildren(3); setIsSelectChildren(prev => !prev); }} className='option'>3 tr??? em</BookingNumberNiceSelectLi>
                                                            <BookingNumberNiceSelectLi onClick={() => { handleClickChildren(4); setIsSelectChildren(prev => !prev); }} className='option'>4 tr??? em</BookingNumberNiceSelectLi>
                                                            <BookingNumberNiceSelectLi onClick={() => { handleClickChildren(5); setIsSelectChildren(prev => !prev); }} className='option'>5 tr??? em</BookingNumberNiceSelectLi>
                                                        </BookingNumberNiceSelectUl>
                                                    </BookingNumberNiceSelect>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 pt-5">
                                            <h6 className="color-white mb-3">Gi?? t???i ??a /1 ????m:</h6>
                                            <div className="selecteurPrix">
                                                <div className="range-slider">
                                                    <input className="input-range" type="range" min={minRoomPrice} max={maxRoomPrice} value={maxPrice} onChange={(e) => setMaxPrice(parseInt(e.target.value))} />
                                                    <div className="valeurPrix">
                                                        <span className="range-value">{format_money(maxPrice)} ??</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-6 col-lg-12 pt-5">
                                            <h6 className="color-white mb-3">G???m Nh???ng D???ch v???:</h6>
                                            <ul className="list">
                                                {
                                                    servicesList ?
                                                        servicesList.map((service, key) => {
                                                            return (
                                                                <li className="list__item">
                                                                    <label className="label--checkbox">
                                                                        <input type="checkbox" className="checkbox" value={service.service_id} onChange={(e) => handleCheckService(e)} />
                                                                        {service.service_name}
                                                                    </label>
                                                                </li>
                                                            );
                                                        }) : null
                                                }
                                            </ul>
                                        </div>
                                        <div className="col-12 col-md-6 col-lg-12 pt-5" style={{ padding: "0", margin: "0" }}>
                                            <Button className="row">
                                                <ButtonContainer>
                                                    <ButtonClick onClick={() => handleClickSearch()}>
                                                        {/* <ButtonClick style={{marginLeft: "70%"}} className="button-disable"> */}
                                                        T??m ki???m
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
            {/* TOAST */}
            <Toast
                ref={toastRef}
                dataToast={dataToast}
            />
        </>
    )
}

export default HotelRooms