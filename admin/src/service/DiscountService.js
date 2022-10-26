import axios from 'axios';
import { AXIOS_API_URL } from "../constants/Axios";
import authToken from "../utils/authToken";

const url_Discount = `${AXIOS_API_URL}/api/user/discounts`;

// Quản lý Mã giảm giá
export const getDiscounts = async () => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_Discount}/all-discount`);
    return res;
};

// Quản lý Mã giảm giá
export const findDiscountByIdOrName = async (search) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_Discount}/search/${search}`);
    return res;
};
// Quản lý Mã giảm giá
export const findDiscountById = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_Discount}/find-discount-by-id`, data);
    return res;
};
// Quản lý Mã giảm giá
export const getQuantityDiscount = async () => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_Discount}/quantity`);
    return res;
};
// Quản lý Mã giảm giá
export const createDiscount = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_Discount}/`, data);
    return res;
};
// Quản lý Mã giảm giá
export const updateDiscount = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.put(`${url_Discount}/`, data);
    return res;
};
// Quản lý Mã giảm giá
export const deleteDiscount = async (deviceTypeId) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.delete(`${url_Discount}/${deviceTypeId}`);
    return res;
};
