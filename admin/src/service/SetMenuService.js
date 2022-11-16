import axios from 'axios';
import { AXIOS_API_URL } from "../constants/Axios";
import authToken from "../utils/authToken";

const url_SetMenu = `${AXIOS_API_URL}/api/user/set-menus`;

// Quản lý Set Menu - Nhà hàng
export const getAllSetMenus = async () => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_SetMenu}/get-all-set-menus`);
    return res;
};

// Quản lý Set Menu - Nhà hàng
export const findSetMenuByIdOrName = async (search) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_SetMenu}/${search}`);
    return res;
};
// Quản lý Set Menu - Nhà hàng
export const findSetMenuById = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_SetMenu}/find-set-menu-by-id`, data);
    return res;
};
// Quản lý Set Menu - Nhà hàng
export const getQuantitySetMenu = async () => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_SetMenu}/quantity`);
    return res;
};
// Quản lý Set Menu - Nhà hàng
export const createSetMenu = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_SetMenu}/`, data);
    return res;
};
// Quản lý Set Menu - Nhà hàng
export const updateSetMenu = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.put(`${url_SetMenu}/`, data);
    return res;
};
// Quản lý Set Menu - Nhà hàng: Vô hiệu hóa loại
export const disableSetMenuById = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.put(`${url_SetMenu}/update-set-menu-state-to-one`, data);
    return res;
};
// Quản lý Set Menu - Nhà hàng: Vô hiệu hóa loại
export const ableSetMenuById = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.put(`${url_SetMenu}/update-set-menu-state-to-zero`, data);
    return res;
};
// Quản lý Set Menu - Nhà hàng
export const deleteSetMenu = async (setMenuId) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.delete(`${url_SetMenu}/${setMenuId}`);
    return res;
};
