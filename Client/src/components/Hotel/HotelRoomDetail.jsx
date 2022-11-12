import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import styled from 'styled-components';
import SliderImage from "./SliderImage";
// Date picker
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Fade from 'react-reveal/Fade';

import { useNavigate } from 'react-router-dom';
import HotelProgress from './HotelProgress';

// Service
import { addCustomerBookingRoom, addRoomBookingRoom, addRoomTotal, chooseDayAndQuantity } from '../../redux/roomBookingRedux';
import * as RoomService from "../../service/RoomService";
import { format_money, handleShowStar } from '../../utils/utils';
import Toast from '../Toast';

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

const DetailRoomButton = styled.a`
    cursor: pointer;
    &:hover {
        color: #41f1b6 !important;
    }
`
// Service Item
const ServiceItem = styled.div`
    margin-bottom: 5px;
`;
const ServiceIcon = styled.img`
    width: 40px;
    height: auto;
`;
const ServiceName = styled.div`
    font-size: 1rem;
    font-weight: bold;
`;
const ServiceTime = styled.div`
    font-size: 0.9rem;
    font-weight: 300;
    letter-spacing: 2px;
`;
const ServiceTitle = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
`;
const ServiceInfo = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
`;
const ServiceIconContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

// Device Item
const DeviceIcon = styled.img`
    width: 40px;
    height: auto;
`;
const DeviceName = styled.div`
    font-size: 1rem;
    font-weight: bold;
`;
const DeviceTime = styled.div`
    font-size: 0.9rem;
    font-weight: 300;
    letter-spacing: 2px;
`;
const DeviceTitle = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
`;
const DeviceInfo = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
`;
const DeviceIconContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

// Device detail
const DeviceDetailContainer = styled.div`
    border-radius: 5px;
    padding: 12px;
    position: absolute;
    bottom: calc(100% + 20px);
    right: -100px;
    background-color: #f5f5f5;
    width: 250px;
    border-radius: 2px;
    box-shadow: 0 1px 3.125rem 0 rgb(0 0 0 / 20%);
    -webkit-animation: fadeIn ease-in 0.2s;
    animation: fadeIn ease-in 0.2s;
    transition: all 0.85s ease;
    cursor: default;
    z-index: 10;
    display: block;
    opacity: 0;
    &::after {
        content: "";
        position: absolute;
        cursor: pointer;
        left: 24px;
        bottom: -28px;
        border-width: 16px 20px;
        border-style: solid;
        border-color: #f5f5f5 transparent transparent transparent;
    }
`;
const DeviceDetailImage = styled.img`
    border-radius: 5px;
    width: 100%;
`;

const DeviceItem = styled.div`
    border-radius: 5px;
    margin-bottom: 5px;
    position: relative;
    cursor: pointer;
    transition: all 0.5s ease;
    &:hover {
        background-color: #f5f5f5;
        ${DeviceDetailContainer} {
            opacity: 1;
        }
        &::after {
            opacity: 1;
        }
    }
    &::after {
        content: "";
        position: absolute;
        top: 10px;
        right: 0;
        height: 12px;
        width: 12px;
        background: var(--color-primary);
        border-radius: 50%;
        margin-right: 15px;
        border: 4px solid transparent;
        display: block;
        opacity: 0;
    }
`;

const HotelRoomDetail = (props) => {
    // Truyền data Từ trang chi tiết vào
    console.log("props data: ", props.data);
    const customer = useSelector((state) => state.customer.currentCustomer);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // STATE
    const [roomId, setRoomId] = useState(props.data.room_id);
    const [roomsSuggest, setRoomSuggest] = useState(props.data.roomsSuggest);
    const [roomsSuggestDisplay, setRoomSuggestDisplay] = useState([]);

    const [checkInDate, setCheckInDate] = useState(props.data.checkInDate);
    const [checkOutDate, setCheckOutDate] = useState(props.data.checkOutDate);
    const [adultsQuantity, setAdultsQuantity] = useState(props.data.adultsQuantity);
    const [childrenQuantity, setChildrenQuantity] = useState(props.data.childrenQuantity);

    const [room, setRoom] = useState();
    const [roomImages, setRoomImages] = useState([]);
    const [roomServices, setRoomServices] = useState([]);
    const [roomDevices, setRoomDevices] = useState([]);

    const [roomDescription, setRoomDescription] = useState();
    const [roomSize, setRoomSize] = useState();
    const [roomAdultQuantity, setRoomAdultQuantity] = useState();
    const [roomChildQuantity, setRoomChildQuantity] = useState();
    const [roomView, setRoomView] = useState();
    const [roomPrice, setRoomPrice] = useState();
    const [roomTypeName, setRoomTypeName] = useState();
    const [floorName, setFloorName] = useState();
    const [roomTypeVoteTotal, setRoomTypeVoteTotal] = useState();
    const [roomFeature, setRoomFeature] = useState();


    // HANDLE
    useEffect(() => {
        try {
            const getRoom = async (roomId) => {
                const res = await RoomService.getRoomByRoomId(roomId);
                setRoom(res.data.data);
                setRoomImages(res.data.data.roomImages);
                setRoomServices(res.data.data.roomServices);
                setRoomDevices(res.data.data.roomDevices)

                setRoomDescription(res.data.data.room_description);
                setRoomSize(res.data.data.room_size);
                setRoomAdultQuantity(res.data.data.room_adult_quantity);
                setRoomChildQuantity(res.data.data.room_child_quantity);
                setRoomView(res.data.data.room_view);
                setRoomPrice(res.data.data.room_price);
                setRoomTypeName(res.data.data.room_type_name);
                setFloorName(res.data.data.floor_name);
                setRoomTypeVoteTotal(res.data.data.room_type_vote_total);
                setRoomFeature(res.data.data.room_feature);

                // Bỏ phòng hiện tại khỏi suggest
                let roomsSuggestAnother = roomsSuggest.filter(item => item.room_id !== roomId);
                setRoomSuggestDisplay(roomsSuggestAnother);
            };
            getRoom(roomId);


        } catch (error) {
            console.log("Error: ", error);
        }
    }, [roomId]);
    console.log("room: ", room);

    // Toast
    const [dataToast, setDataToast] = useState({ message: "alo alo", type: "success" });
    const toastRef = useRef(null);

    const showToastFromOut = (dataShow) => {
        setDataToast(dataShow);
        toastRef.current.show();
    }

    // Fake loading when fetch data
    const [isLoading, setIsLoading] = useState(false);
    const handleLoading = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 1200);
    };

    const handleClickFullInfo = (roomId) => {
        console.log(checkInDate, checkOutDate, adultsQuantity, childrenQuantity)
        if (!checkInDate || !checkOutDate || !adultsQuantity || !childrenQuantity) {
            // Toast
            const dataToast = { message: "Vui lòng chọn thời gian Checkin/ Checkout & số lượng khách.", type: "warning" };
            showToastFromOut(dataToast);
            return;
        };

        setRoomId(roomId);

        // Scroll lên kết quả mới
        window.scrollTo({
            top: 300,
            behavior: "smooth"
        });
        handleLoading();
    };

    const handleBookNow = () => {
        dispatch(addCustomerBookingRoom({ customer: customer }));
        dispatch(addRoomBookingRoom({ room: room }));
        dispatch(chooseDayAndQuantity({
            checkInDate: checkInDate,
            checkOutDate: checkOutDate,
            adultsQuantity: adultsQuantity,
            childrenQuantity: childrenQuantity
        }));
        dispatch(addRoomTotal({
            roomTotal: roomPrice
        }));
        try {
            const updateRoomState = async () => {
                const updateRoomStateRes = await RoomService.updateRoomState(roomId, 1);
                if (updateRoomStateRes) {
                    // Toast
                    const dataToast = { message: "Phòng đã được giữ trong 5 phút", type: "success" };
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
        navigate('/hotel-payment', {
            state: {
                room_id: roomId,
                customer: customer
            }
        });
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
                                {/* FETCH DATA */}
                                {isLoading ? (
                                    <div className="row">
                                        <div
                                            class="spinner-border"
                                            style={{ color: '#41F1B6', position: 'absolute', left: '50%', top: "55%", scale: "1.5" }}
                                            role="status"
                                        >
                                            <span class="visually-hidden"></span>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <ImgContainer className="row">
                                            <MoreImage >
                                                <SliderImage image={roomImages} />
                                            </MoreImage>
                                        </ImgContainer>
                                        <div className="section pt-5">
                                            <h5>Mô tả</h5>
                                            <p className="mt-3">{roomDescription}</p>
                                        </div>
                                        <div className="section pt-4">
                                            <div className="row">
                                                <div className="col-12">
                                                    <h5 className="mb-3">Tổng quan</h5>
                                                </div>
                                                <div className="col-lg-6">
                                                    <p><strong className="color-black">Kích thước:</strong> {roomSize} </p>
                                                    <p><strong className="color-black">Sức chứa:</strong> Lên đến {roomAdultQuantity} Người lớn &amp; {roomChildQuantity} Trẻ em</p>
                                                    <p><strong className="color-black">View:</strong> {roomView}</p>
                                                    <p><strong className="color-black">Smoking:</strong> No smoking</p>
                                                </div>
                                                <div className="col-lg-6">
                                                    <p><strong className="color-black">Loại phòng:</strong> {roomTypeName}</p>
                                                    <p><strong className="color-black">Vị trí:</strong> {floorName}</p>
                                                    <p><strong className="color-black">Đánh giá:</strong> {roomTypeVoteTotal}/5.0</p>
                                                    <p><strong className="color-black">Dịch vụ phòng:</strong> Có</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="section pt-4">
                                            <div className="row">
                                                <div className="col-12">
                                                    <h5 className="mb-3">Dịch vụ &amp; Thiết bị</h5>
                                                </div>
                                                <div className="col-lg-6">
                                                    {
                                                        roomServices.map((service, key) => {
                                                            return (
                                                                <ServiceItem className="row">
                                                                    <ServiceIconContainer className="col-lg-3">
                                                                        <ServiceIcon src={service.service_image} />
                                                                    </ServiceIconContainer>
                                                                    <div className="col-lg-9">
                                                                        <ServiceTitle className="row">
                                                                            <ServiceName>{service.service_name}</ServiceName>
                                                                        </ServiceTitle>
                                                                        <ServiceInfo className="row">
                                                                            <ServiceTime>{service.service_time}</ServiceTime>
                                                                        </ServiceInfo>
                                                                    </div>
                                                                </ServiceItem>
                                                            );
                                                        })
                                                    }
                                                </div>
                                                <div className="col-lg-6">
                                                    {
                                                        roomDevices.map((device, key) => {
                                                            return (
                                                                <DeviceItem className="row">
                                                                    <DeviceIconContainer className="col-lg-3">
                                                                        <DeviceIcon src={device.device_type_image} />
                                                                    </DeviceIconContainer>
                                                                    <div className="col-lg-9">
                                                                        <DeviceTitle className="row">
                                                                            <DeviceName>{device.device_type_name} </DeviceName>
                                                                        </DeviceTitle>
                                                                        <DeviceInfo className="row">
                                                                            <DeviceTime>{device.device_name}</DeviceTime>
                                                                        </DeviceInfo>
                                                                    </div>
                                                                    <DeviceDetailContainer>
                                                                        <DeviceDetailImage src={device.device_image} />
                                                                    </DeviceDetailContainer>
                                                                </DeviceItem>
                                                            );
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="section pt-4">
                                            <h5>Đặc trưng</h5>
                                            <p className="mt-3">{roomFeature}</p>
                                        </div>
                                    </>
                                )}
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
                                                                        disableOpenPicker={true}
                                                                        inputFormat="dd/MM/yyyy"
                                                                        value={checkInDate}
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
                                                                    disableOpenPicker={true}
                                                                    inputFormat="dd/MM/yyyy"
                                                                    value={checkOutDate}
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
                                                    <BookingNumberNiceSelect name="adults" className="nice-select wide">
                                                        <BookingNumberNiceSelectSpan className='current'>{adultsQuantity} Người lớn</BookingNumberNiceSelectSpan>
                                                    </BookingNumberNiceSelect>
                                                </div>
                                                <div class="col-12 pt-4">
                                                    <BookingNumberNiceSelect name="children" className="nice-select wide">
                                                        <BookingNumberNiceSelectSpan className='current'>{childrenQuantity} Trẻ em</BookingNumberNiceSelectSpan>
                                                    </BookingNumberNiceSelect>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 pt-4">
                                            <Button className="row">
                                                <ButtonContainer>
                                                    <ButtonClick
                                                        onClick={() => handleBookNow()}
                                                    >
                                                        {/* <ButtonClick style={{marginLeft: "70%"}} className="button-disable"> */}
                                                        ĐẶT NGAY
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
                        {roomsSuggestDisplay.length > 0 ?
                            (
                                roomsSuggestDisplay.map((room, key) => {
                                    if (key > 2) return null;
                                    const service = room.serviceList;
                                    return (
                                        <div className="col-lg-4">
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
                                                        <a className="mt-1 btn btn-primary"
                                                            style={{ color: "var(--color-white)" }}
                                                            onClick={() => handleClickFullInfo(room.room_id)}
                                                        >Đặt với {format_money(room.room_price)}VNĐ</a>
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
                                                            >chi tiết</DetailRoomButton>
                                                        </div>
                                                    </div>
                                                </div>
                                            </HotelItem>
                                        </div>
                                    );
                                })
                            ) : null}
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

export default HotelRoomDetail