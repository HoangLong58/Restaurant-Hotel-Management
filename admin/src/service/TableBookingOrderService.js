import axios from 'axios';
import { AXIOS_API_URL } from "../constants/Axios";
import authToken from "../utils/authToken";

const url_TableBookingOrder = `${AXIOS_API_URL}/api/user/table-booking-orders`;

// Quản lý Đặt Bàn
export const getTableBookingAndDetails = async () => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_TableBookingOrder}/`);
    return res;
};

// Quản lý Đặt Bàn
export const findTableBookingByIdOrCustomerEmailOrCustomerPhoneOrCustomerName = async (search) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_TableBookingOrder}/${search}`);
    return res;
};
// Quản lý Đặt Bàn
export const findTableBookingById = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_TableBookingOrder}/find-table-booking-by-id`, data);
    return res;
};
// Quản lý Đặt Bàn
export const getQuantityTableBooking = async () => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_TableBookingOrder}/quantity`);
    return res;
};
// Quản lý Đặt Bàn - Check in
export const checkIn = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_TableBookingOrder}/check-in-table-booking-order`, data);
    return res;
};
// Quản lý Đặt Bàn - Check Out
export const checkOut = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_TableBookingOrder}/check-out-table-booking-order`, data);
    return res;
};