import axios from 'axios';
import { AXIOS_API_URL } from "../constants/Axios";
import authToken from "../utils/authToken";

const url_Device = `${AXIOS_API_URL}/api/user/devices`;

// Quản lý Thiết bị - Khách sạn
export const getDevices = async () => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_Device}/`);
    return res;
};

// Quản lý Thiết bị - Khách sạn
export const findDeviceByIdOrName = async (search) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_Device}/${search}`);
    return res;
};
// Quản lý Thiết bị - Khách sạn
export const findDeviceById = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_Device}/find-device-by-id`, data);
    return res;
};
// Quản lý Thiết bị - Khách sạn
export const getQuantityDevice = async () => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_Device}/quantity`);
    return res;
};
// Quản lý Thiết bị - Khách sạn
export const createDevice = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_Device}/`, data);
    return res;
};
// Quản lý Thiết bị - Khách sạn
export const updateDevice = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.put(`${url_Device}/`, data);
    return res;
};
// Quản lý Thiết bị - Khách sạn
export const deleteDevice = async (deviceTypeId) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.delete(`${url_Device}/${deviceTypeId}`);
    return res;
};
// Quản lý Phòng - Thêm Thiết bị
export const getAllDeviceByDeviceTypeIdAndRoomId = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_Device}/get-all-device-by-device-type-id-and-room-id`, data);
    return res;
};
