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

