import axios from 'axios';
import { AXIOS_API_URL } from "../constants/Axios";
import authToken from "../utils/authToken";

const url_RoomType = `${AXIOS_API_URL}/api/admin/room-types`;

// Quản lý Loại phòng - Khách sạn
export const getRoomTypes = async () => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_RoomType}/`);
    return res;
};

// Quản lý Loại phòng - Khách sạn
export const findRoomTypeByIdOrName = async (search) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_RoomType}/${search}`);
    return res;
};
// Quản lý Loại phòng - Khách sạn
export const findRoomTypeById = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_RoomType}/find-room-type-by-id`, data);
    return res;
};
// Quản lý Loại phòng - Khách sạn
export const getQuantityRoomType = async () => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_RoomType}/quantity`);
    return res;
};
// Quản lý Loại phòng - Khách sạn
export const createRoomType = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_RoomType}/`, data);
    return res;
};
// Quản lý Loại phòng - Khách sạn
export const updateRoomType = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.put(`${url_RoomType}/`, data);
    return res;
};
// Quản lý Loại phòng - Khách sạn
export const deleteRoomType = async (roomTypeId) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.delete(`${url_RoomType}/${roomTypeId}`);
    return res;
};
