import axios from 'axios';
import { AXIOS_API_URL } from "../constants/Axios";
import authToken from "../utils/authToken";

const url_RoomBookingOrder = `${AXIOS_API_URL}/api/user/room-booking-orders`;

// Quản lý Đặt phòng
export const getRoomBookingAndDetails = async () => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_RoomBookingOrder}/`);
    return res;
};

// Quản lý Đặt phòng
export const findRoomBookingByIdOrCustomerEmailOrCustomerPhoneOrCustomerNameOrRoomName = async (search) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_RoomBookingOrder}/${search}`);
    return res;
};
// Quản lý Đặt phòng
export const findRoomBookingById = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_RoomBookingOrder}/find-room-booking-by-id`, data);
    return res;
};
// Quản lý Đặt phòng
export const getQuantityRoomBooking = async () => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_RoomBookingOrder}/quantity`);
    return res;
};
// Quản lý Đặt phòng - Check in
export const checkIn = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_RoomBookingOrder}/check-in-room-booking-order`, data);
    return res;
};
// Quản lý Đặt phòng - Check Out
export const checkOut = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_RoomBookingOrder}/check-out-room-booking-order`, data);
    return res;
};

// Quản lý Đặt phòng - Thống kê doanh thu theo ngày
export const getStatisticRoomBookingTotalByDate = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_RoomBookingOrder}/get-statistic-room-booking-order-total-by-date`, data);
    return res;
};
// Quản lý Đặt phòng - Thống kê doanh thu theo Tháng trong Quý
export const getStatisticRoomBookingTotalByQuarter = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_RoomBookingOrder}/get-statistic-room-booking-order-total-by-quarter`, data);
    return res;
};

// Quản lý Đặt phòng - Thống kê doanh thu Từng thành phố
export const getLimitRoomBookingTotalOfCityForEachQuarter = async () => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_RoomBookingOrder}/get-statistic-room-booking-order-total-of-city-for-each-quarter`);
    return res;
};
// Quản lý Đặt phòng - Thống kê doanh thu Từng thành phố theo Ngày
export const getStatisticRoomBookingTotalOfCityByDate = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_RoomBookingOrder}/get-statistic-room-booking-order-total-of-city-by-date`, data);
    return res;
};
// Quản lý Đặt phòng - Thống kê doanh thu Từng thành phố theo Tháng trong Quý
export const getStatisticRoomBookingTotalOfCityByQuarter = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_RoomBookingOrder}/get-statistic-room-booking-order-total-of-city-by-quarter`, data);
    return res;
};