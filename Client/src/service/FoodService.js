import { AXIOS_API_URL } from "../constants/Axios";
import axios from 'axios';
import authToken from "../utils/authToken";

const url_Food = `${AXIOS_API_URL}/api/user/foods`;

export const getFood = async () => {
    authToken(localStorage.getItem("customer_token"));
    const res = await axios.get(`${url_Food}`);
    return res;
};

export const getFoodByFoodTypeId = async (data) => {
    authToken(localStorage.getItem("customer_token"));
    const res = await axios.post(`${url_Food}/get-food-and-type-by-food-type-id`, data);
    return res;
};

export const getMinMaxFoodPrice = async (data) => {
    authToken(localStorage.getItem("customer_token"));
    const res = await axios.post(`${url_Food}/get-min-max-food-price`, data);
    return res;
};