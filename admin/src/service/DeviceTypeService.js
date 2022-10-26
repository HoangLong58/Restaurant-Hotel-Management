import axios from 'axios';
import { AXIOS_API_URL } from "../constants/Axios";
import authToken from "../utils/authToken";

const url_DeviceType = `${AXIOS_API_URL}/api/admin/device-types`;

// Quản lý Loại thiết bị - Khách sạn
export const getDeviceTypes = async () => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_DeviceType}/`);
    return res;
};

// Quản lý Loại thiết bị - Khách sạn
export const findDeviceTypeByIdOrName = async (search) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_DeviceType}/${search}`);
    return res;
};
// Quản lý Loại thiết bị - Khách sạn
export const findDeviceTypeById = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_DeviceType}/find-divice-type-by-id`, data);
    return res;
};
// Quản lý Loại thiết bị - Khách sạn
export const getQuantityDeviceType = async () => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_DeviceType}/quantity`);
    return res;
};
// Quản lý Loại thiết bị - Khách sạn
export const createDeviceType = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_DeviceType}/`, data);
    return res;
};
// Quản lý Loại thiết bị - Khách sạn
export const updateDeviceType = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.put(`${url_DeviceType}/`, data);
    return res;
};
// Quản lý Loại thiết bị - Khách sạn
export const deleteDeviceType = async (deviceTypeId) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.delete(`${url_DeviceType}/${deviceTypeId}`);
    return res;
};
