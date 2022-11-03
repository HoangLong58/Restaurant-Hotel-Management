import axios from 'axios';
import { AXIOS_API_URL } from "../constants/Axios";
import authToken from "../utils/authToken";

const url_Service = `${AXIOS_API_URL}/api/user/services`;

// Quản lý Dịch vụ - Khách sạn
export const getServices = async () => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_Service}/all`);
    return res;
};

// Quản lý Dịch vụ - Khách sạn
export const findServiceByIdOrName = async (search) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_Service}/${search}`);
    return res;
};
// Quản lý Dịch vụ - Khách sạn
export const findServiceById = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_Service}/find-service-by-id`, data);
    return res;
};
// Quản lý Dịch vụ - Khách sạn
export const getQuantityService = async () => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_Service}/quantity`);
    return res;
};
// Quản lý Dịch vụ - Khách sạn
export const createService = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_Service}/`, data);
    return res;
};
// Quản lý Dịch vụ - Khách sạn
export const updateService = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.put(`${url_Service}/`, data);
    return res;
};
// Quản lý Dịch vụ - Khách sạn
export const deleteService = async (serviceId) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.delete(`${url_Service}/${serviceId}`);
    return res;
};
// Quản lý Loại phòng - Thêm Dịch vụ
export const getAllServiceByRoomTypeId = async (roomTypeId) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_Service}/get-all-service-by-room-type-id/${roomTypeId}`);
    return res;
};
