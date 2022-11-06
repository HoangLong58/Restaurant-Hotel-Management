import axios from 'axios';
import { AXIOS_API_URL } from "../constants/Axios";
import authToken from "../utils/authToken";

const url_Ward = `${AXIOS_API_URL}/api/admin/wards`;

// Admin: Quản lý Đặt phòng - Check in
export const getAllWardByDistrictId = async (districtId) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_Ward}/get-all-wards-by-district-id/${districtId}`);
    return res;
};

