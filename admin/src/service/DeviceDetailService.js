import axios from 'axios';
import { AXIOS_API_URL } from "../constants/Axios";
import authToken from "../utils/authToken";

const url_DeviceDetail = `${AXIOS_API_URL}/api/admin/device-details`;

// Quản lý Phòng - Thêm Thiết bị
export const getDeviceDetailsByRoomId = async (roomId) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_DeviceDetail}/get-device-detail-by-room-id/${roomId}`);
    return res;
};
// Quản lý Phòng - Thêm Thiết bị
export const deleteDeviceDetailByDeviceDetailId = async (deviceDetailId) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.delete(`${url_DeviceDetail}/${deviceDetailId}`);
    return res;
};
// Quản lý Phòng - Thêm Thiết bị
export const createDeviceDetailByListDeviceId = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_DeviceDetail}/create-device-detail-by-list-device-id`, data);
    return res;
};
