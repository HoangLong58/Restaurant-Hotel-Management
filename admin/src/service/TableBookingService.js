import axios from 'axios';
import { AXIOS_API_URL } from "../constants/Axios";
import authToken from "../utils/authToken";

const url_TableBooking = `${AXIOS_API_URL}/api/user/table-bookings`;

// Quản lý Bàn ăn - Nhà hàng
export const getAllTableBookings = async () => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_TableBooking}/get-all-table-bookings`);
    return res;
};

// Quản lý Bàn ăn - Nhà hàng
export const findTableBookingByIdOrName = async (search) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_TableBooking}/search/${search}`);
    return res;
};
// Quản lý Bàn ăn - Nhà hàng
export const findTableBookingById = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_TableBooking}/find-table-booking-by-id`, data);
    return res;
};
// Quản lý Bàn ăn - Nhà hàng
export const getQuantityTableBooking = async () => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_TableBooking}/quantity`);
    return res;
};
// Quản lý Bàn ăn - Nhà hàng
export const createTableBooking = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_TableBooking}/`, data);
    return res;
};
// Quản lý Bàn ăn - Nhà hàng
export const updateTableBooking = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.put(`${url_TableBooking}/`, data);
    return res;
};
// Quản lý Bàn ăn - Nhà hàng
export const deleteTableBooking = async (tableBookingId) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.delete(`${url_TableBooking}/${tableBookingId}`);
    return res;
};
