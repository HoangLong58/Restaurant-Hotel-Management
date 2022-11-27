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

// Quản lý Đặt bàn - Thống kê doanh thu theo ngày
export const getStatisticTableBookingTotalByDate = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_TableBookingOrder}/get-statistic-table-booking-order-total-by-date`, data);
    return res;
};
// Quản lý Đặt bàn - Thống kê doanh thu theo Tháng trong Quý
export const getStatisticTableBookingTotalByQuarter = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_TableBookingOrder}/get-statistic-table-booking-order-total-by-quarter`, data);
    return res;
};

// Quản lý Đặt bàn - Thống kê doanh thu Từng thành phố
export const getLimitTableBookingTotalOfCityForEachQuarter = async () => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_TableBookingOrder}/get-statistic-table-booking-order-total-of-city-for-each-quarter`);
    return res;
};
// Quản lý Đặt bàn - Thống kê doanh thu Từng thành phố theo Ngày
export const getStatisticTableBookingTotalOfCityByDate = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_TableBookingOrder}/get-statistic-table-booking-order-total-of-city-by-date`, data);
    return res;
};
// Quản lý Đặt bàn - Thống kê doanh thu Từng thành phố theo Tháng trong Quý
export const getStatisticTableBookingTotalOfCityByQuarter = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_TableBookingOrder}/get-statistic-table-booking-order-total-of-city-by-quarter`, data);
    return res;
};

// Quản lý Đặt bàn - Thống kê doanh thu Từng Loại bàn theo Tháng trong Quý
export const getStatisticTableBookingTotalOfTypeByQuarter = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_TableBookingOrder}/get-statistic-table-booking-order-total-by-quarter-and-type`, data);
    return res;
};
// Quản lý Đặt bàn - Thống kê doanh thu Từng Loại bàn theo Ngày trong Quý
export const getStatisticTableBookingTotalOfTypeByDate = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_TableBookingOrder}/get-statistic-table-booking-order-total-by-date-and-type`, data);
    return res;
};

// Quản lý Đặt bàn - Thống kê doanh thu của Khách hàng cụ thể theo Tháng trong Quý
export const getStatisticTableBookingTotalOfCustomerByQuarter = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_TableBookingOrder}/get-statistic-table-booking-order-total-by-quarter-and-customer`, data);
    return res;
};
// Quản lý Đặt bàn - Thống kê doanh thu của Khách hàng cụ thể theo Ngày trong Quý
export const getStatisticTableBookingTotalOfCustomerByDate = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_TableBookingOrder}/get-statistic-table-booking-order-total-by-date-and-customer`, data);
    return res;
};