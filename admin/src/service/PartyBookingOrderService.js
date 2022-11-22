import axios from 'axios';
import { AXIOS_API_URL } from "../constants/Axios";
import authToken from "../utils/authToken";

const url_PartyBookingOrder = `${AXIOS_API_URL}/api/user/party-booking-orders`;

// Quản lý Đặt tiệc
export const getPartyBookingAndDetails = async () => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_PartyBookingOrder}/`);
    return res;
};

// Quản lý Đặt tiệc
export const findPartyBookingByIdOrCustomerEmailOrCustomerPhoneOrCustomerNameOrPartyName = async (search) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_PartyBookingOrder}/${search}`);
    return res;
};
// Quản lý Đặt tiệc
export const findPartyBookingById = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_PartyBookingOrder}/find-party-booking-by-id`, data);
    return res;
};
// Quản lý Đặt tiệc
export const getQuantityPartyBooking = async () => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_PartyBookingOrder}/quantity`);
    return res;
};
// Quản lý Đặt tiệc - Check in
export const checkIn = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_PartyBookingOrder}/check-in-party-booking-order`, data);
    return res;
};
// Quản lý Đặt tiệc - Check Out
export const checkOut = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_PartyBookingOrder}/check-out-party-booking-order`, data);
    return res;
};

// Quản lý Đặt tiệc - Thống kê doanh thu theo ngày
export const getStatisticPartyBookingTotalByDate = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_PartyBookingOrder}/get-statistic-party-booking-order-total-by-date`, data);
    return res;
};
// Quản lý Đặt tiệc - Thống kê doanh thu theo Tháng trong Quý
export const getStatisticPartyBookingTotalByQuarter = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_PartyBookingOrder}/get-statistic-party-booking-order-total-by-quarter`, data);
    return res;
};

// Quản lý Đặt tiệc - Thống kê doanh thu Từng thành phố
export const getLimitPartyBookingTotalOfCityForEachQuarter = async () => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_PartyBookingOrder}/get-statistic-party-booking-order-total-of-city-for-each-quarter`);
    return res;
};
// Quản lý Đặt tiệc - Thống kê doanh thu Từng thành phố theo Ngày
export const getStatisticPartyBookingTotalOfCityByDate = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_PartyBookingOrder}/get-statistic-party-booking-order-total-of-city-by-date`, data);
    return res;
};
// Quản lý Đặt tiệc - Thống kê doanh thu Từng thành phố theo Tháng trong Quý
export const getStatisticPartyBookingTotalOfCityByQuarter = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_PartyBookingOrder}/get-statistic-party-booking-order-total-of-city-by-quarter`, data);
    return res;
};