import axios from 'axios';
import { AXIOS_API_URL } from "../constants/Axios";
import authToken from "../utils/authToken";

const url_FoodType = `${AXIOS_API_URL}/api/user/food-types`;

// Quản lý Loại món ăn - Nhà hàng
export const getAllFoodTypes = async () => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_FoodType}/get-all-food-types`);
    return res;
};

// Quản lý Loại món ăn - Nhà hàng
export const findFoodTypeByIdOrName = async (search) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_FoodType}/${search}`);
    return res;
};
// Quản lý Loại món ăn - Nhà hàng
export const findFoodTypeById = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_FoodType}/find-food-type-by-id`, data);
    return res;
};
// Quản lý Loại món ăn - Nhà hàng
export const getQuantityFoodType = async () => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_FoodType}/quantity`);
    return res;
};
// Quản lý Loại món ăn - Nhà hàng
export const createFoodType = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_FoodType}/`, data);
    return res;
};
// Quản lý Loại món ăn - Nhà hàng
export const updateFoodType = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.put(`${url_FoodType}/`, data);
    return res;
};
// Quản lý Loại món ăn - Nhà hàng
export const deleteFoodType = async (foodId) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.delete(`${url_FoodType}/${foodId}`);
    return res;
};
