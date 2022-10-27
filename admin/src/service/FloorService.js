import axios from 'axios';
import { AXIOS_API_URL } from "../constants/Axios";
import authToken from "../utils/authToken";

const url_Floor = `${AXIOS_API_URL}/api/admin/floors`;

// Quản lý Tầng
export const getFloors = async () => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_Floor}/`);
    return res;
};

// Quản lý Tầng
export const findFloorByIdOrName = async (search) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_Floor}/${search}`);
    return res;
};
// Quản lý Tầng
export const findFloorById = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_Floor}/find-floor-by-id`, data);
    return res;
};
// Quản lý Tầng
export const getQuantityFloor = async () => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_Floor}/quantity`);
    return res;
};
// Quản lý Tầng
export const createFloor = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_Floor}/`, data);
    return res;
};
// Quản lý Tầng
export const updateFloor = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.put(`${url_Floor}/`, data);
    return res;
};
// Quản lý Tầng
export const deleteFloor = async (FloorId) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.delete(`${url_Floor}/${FloorId}`);
    return res;
};
