import axios from 'axios';
import { AXIOS_API_URL } from "../constants/Axios";
import authToken from "../utils/authToken";

const url_MenuDetailFood = `${AXIOS_API_URL}/api/user/menu-detail-foods`;

// Quản lý Set Menu - Thêm Món ăn
export const getAllMenuDetailFoodBySetMenuId = async (setMenuId) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_MenuDetailFood}/get-menu-detail-food-by-set-menu-id/${setMenuId}`);
    return res;
};
// Quản lý Set Menu - Thêm Món ăn
export const deleteMenuDetailFoodByMenuDetailFoodId = async (menuDetailFoodId) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.delete(`${url_MenuDetailFood}/${menuDetailFoodId}`);
    return res;
};
// Quản lý Set Menu - Thêm Món ăn
export const createMenuDetailFoodByListFoodId = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_MenuDetailFood}/create-menu-detail-food-by-list-food-id`, data);
    return res;
};
