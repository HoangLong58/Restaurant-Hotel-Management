import axios from 'axios';
import { AXIOS_API_URL } from "../constants/Axios";
import authToken from "../utils/authToken";

const url_City = `${AXIOS_API_URL}/api/admin/citys`;

// Admin: Quản lý Đặt phòng - Check in
export const getAllCitys = async () => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_City}/get-all-citys`);
    return res;
};

