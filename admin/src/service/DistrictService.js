import axios from 'axios';
import { AXIOS_API_URL } from "../constants/Axios";
import authToken from "../utils/authToken";

const url_District = `${AXIOS_API_URL}/api/admin/districts`;

// Admin: Quản lý Đặt phòng - Check in
export const getAllDistrictsByCityId = async (cityId) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_District}/get-all-districts-by-city-id/${cityId}`);
    return res;
};

