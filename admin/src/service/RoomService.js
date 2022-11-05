import axios from 'axios';
import { AXIOS_API_URL } from "../constants/Axios";
import authToken from "../utils/authToken";

const url_Room = `${AXIOS_API_URL}/api/user/rooms`;

// Quản lý Phòng - Khách sạn
export const getAllRooms = async () => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_Room}/get-all-rooms`);
    return res;
};

// Quản lý Phòng - Khách sạn
export const findRoomsByIdOrName = async (search) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_Room}/search/${search}`);
    return res;
};
// Quản lý Phòng - Khách sạn
export const findRoomById = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_Room}/find-room-by-id`, data);
    return res;
};
// Quản lý Phòng - Khách sạn
export const getQuantityRooms = async () => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_Room}/quantity`);
    return res;
};
// Quản lý Phòng - Khách sạn
export const createRoom = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_Room}/`, data);
    return res;
};
// Quản lý Phòng - Khách sạn
export const updateRoom = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.put(`${url_Room}/`, data);
    return res;
};
// Quản lý Phòng - Khách sạn
export const deleteRoom = async (roomId) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.delete(`${url_Room}/${roomId}`);
    return res;
};
// Quản lý Phòng - Khách sạn - Thêm dịch vụ
export const findRoomAndImageWhenAddDeviceByRoomId = async (roomId) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_Room}/find-room-when-add-device-by-room-id/${roomId}`);
    return res;
};
