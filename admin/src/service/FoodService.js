import axios from 'axios';
import { AXIOS_API_URL } from "../constants/Axios";
import authToken from "../utils/authToken";

const url_Food = `${AXIOS_API_URL}/api/user/foods`;

// Quản lý Món ăn - Nhà hàng
export const getAllFoods = async () => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_Food}/get-all-foods`);
    return res;
};

// Quản lý Món ăn - Nhà hàng
export const findFoodByIdOrName = async (search) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_Food}/search/${search}`);
    return res;
};
// Quản lý Món ăn - Nhà hàng
export const findFoodById = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_Food}/find-food-by-id`, data);
    return res;
};
// Quản lý Món ăn - Nhà hàng
export const getQuantityFood = async () => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_Food}/quantity`);
    return res;
};
// Quản lý Món ăn - Nhà hàng
export const createFood = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_Food}/`, data);
    return res;
};
// Quản lý Món ăn - Nhà hàng
export const updateFood = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.put(`${url_Food}/`, data);
    return res;
};
// Quản lý Món ăn - Nhà hàng
export const deleteFood = async (foodId) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.delete(`${url_Food}/${foodId}`);
    return res;
};
// Quản lý Set Menu - Thêm Món ăn
export const getAllFoodByFoodTypeIdAndSetMenuId = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_Food}/get-all-food-by-food-type-id-and-set-menu-id`, data);
    return res;
};
// Quản lý Đặt món - Thêm Món ăn
export const getFoodByFoodTypeId = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_Food}/get-food-and-type-by-food-type-id`, data);
    return res;
};