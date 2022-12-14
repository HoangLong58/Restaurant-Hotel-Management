import { AXIOS_API_URL } from "../constants/Axios";
import axios from 'axios';
import authToken from "../utils/authToken";

const url_SetMenu = `${AXIOS_API_URL}/api/user/set-menus`;

export const getSetMenuWithFoodTypeAndFoods = async () => {
    authToken(localStorage.getItem("customer_token"));
    const res = await axios.get(`${url_SetMenu}/get-set-menu-with-food-and-type`);
    return res;
};