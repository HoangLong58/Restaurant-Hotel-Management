import axios from 'axios';
import { AXIOS_API_URL } from "../constants/Axios";
import authToken from "../utils/authToken";

const url_AdminLog = `${AXIOS_API_URL}/api/admin/admin-logs`;

// Quản lý Admin log
export const getTop5AdminLogs = async () => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_AdminLog}/get-top-5-admin-logs`);
    return res;
};

// Quản lý Nhật ký hoạt động
export const getAdminLogs = async () => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_AdminLog}/`);
    return res;
};

// Quản lý Nhật ký hoạt động
export const findAdminLogByIdOrName = async (search) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_AdminLog}/${search}`);
    return res;
};
// Quản lý Nhật ký hoạt động
export const findAdminLogById = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_AdminLog}/find-admin-log-by-id`, data);
    return res;
};
// Quản lý Nhật ký hoạt động
export const getQuantityAdminLog = async () => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_AdminLog}/quantity`);
    return res;
};

