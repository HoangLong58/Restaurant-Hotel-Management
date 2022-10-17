import { AXIOS_API_URL } from "../constants/Axios";
import axios from 'axios';
import authToken from "../utils/authToken";

const url_FoodType = `${AXIOS_API_URL}/api/user/food-types`;

export const getFoodType = async () => {
    authToken(localStorage.getItem("customer_token"));
    const res = await axios.get(`${url_FoodType}`);
    return res;
};