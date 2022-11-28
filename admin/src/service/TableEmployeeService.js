import axios from 'axios';
import { AXIOS_API_URL } from "../constants/Axios";
import authToken from "../utils/authToken";

const url_TableEmployee = `${AXIOS_API_URL}/api/admin/table-employees`;

// Quản lý Bàn - Thêm Nhân viên
export const getAllTableEmployeeByTableBookingId = async (tableBookingId) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_TableEmployee}/get-table-employee-by-table-booking-id/${tableBookingId}`);
    return res;
};
// Quản lý Bàn - Thêm Nhân viên
export const deleteTableEmployeeByTableEmployeeId = async (tableEmployeeId) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.delete(`${url_TableEmployee}/${tableEmployeeId}`);
    return res;
};
// Quản lý Bàn - Thêm Nhân viên
export const createTableEmployeeByListEmployeeId = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_TableEmployee}/create-table-employee-by-list-employee-id`, data);
    return res;
};
