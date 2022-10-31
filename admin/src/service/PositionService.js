import axios from 'axios';
import { AXIOS_API_URL } from "../constants/Axios";
import authToken from "../utils/authToken";

const url_Position = `${AXIOS_API_URL}/api/admin/positions`;

// Quản lý Chức vụ
export const getPositions = async () => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_Position}/`);
    return res;
};

// Quản lý Chức vụ
export const findPositionByIdOrName = async (search) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_Position}/${search}`);
    return res;
};
// Quản lý Chức vụ
export const findPositionById = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_Position}/find-position-by-id`, data);
    return res;
};
// Quản lý Chức vụ
export const getQuantityPosition = async () => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_Position}/quantity`);
    return res;
};
// Quản lý Chức vụ
export const createPosition = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_Position}/`, data);
    return res;
};
// Quản lý Chức vụ
export const updatePosition = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.put(`${url_Position}/`, data);
    return res;
};
// Quản lý Chức vụ
export const deletePosition = async (positionId) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.delete(`${url_Position}/${positionId}`);
    return res;
};
