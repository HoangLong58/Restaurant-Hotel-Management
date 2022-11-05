import axios from 'axios';
import { AXIOS_API_URL } from "../constants/Axios";
import authToken from "../utils/authToken";

const url_RoomEmployee = `${AXIOS_API_URL}/api/admin/room-employees`;

// Quản lý Phòng - Thêm Nhân viên
export const getAllRoomEmployeeByRoomId = async (roomId) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_RoomEmployee}/get-room-employee-by-room-id/${roomId}`);
    return res;
};
// Quản lý Phòng - Thêm Nhân viên
export const deleteRoomEmployeeByRoomEmployeeId = async (roomEmployeeId) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.delete(`${url_RoomEmployee}/${roomEmployeeId}`);
    return res;
};
// Quản lý Phòng - Thêm Nhân viên
export const createRoomEmployeeByListEmployeeId = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_RoomEmployee}/create-room-employee-by-list-employee-id`, data);
    return res;
};
