import axios from 'axios';
import { AXIOS_API_URL } from "../constants/Axios";
import authToken from "../utils/authToken";

const url_Statistic = `${AXIOS_API_URL}/api/admin/statistics`;

// Thống kê doanh thu của từng Room, Party, và Table booking đã finish/ Theo ngày hoặc tất cả
export const getStatisticRoomAndTableAndPartyBooking = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_Statistic}/get-statistic-room-and-table-and-party-booking`, data);
    return res;
};

// Thống kê doanh thu của từng Room, Party, và Table booking đã finish/ Theo Từng Tháng dựa vào Năm
export const getStatisticRoomAndTableAndPartyBookingForEachMonthByYear = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_Statistic}/get-statistic-room-and-table-and-party-booking-for-each-month-by-year`, data);
    return res;
};
// Thống kê doanh thu của từng Room booking đã finish/ Theo Từng Quý dựa vào Năm
export const getStatisticRoomBookingForEachQuarterByYear = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_Statistic}/get-statistic-room-booking-for-each-quater-by-year`, data);
    return res;
};
