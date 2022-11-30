import axios from 'axios';
import { AXIOS_API_URL } from "../constants/Axios";
import authToken from "../utils/authToken";

const url_FoodType = `${AXIOS_API_URL}/api/user/food-types`;

export const getFoodType = async () => {
    authToken(localStorage.getItem("customer_token"));
    const res = await axios.get(`${url_FoodType}`);
    return res;
};

export const getFoodTypeAndEachFoodOfThisType = async () => {
    authToken(localStorage.getItem("customer_token"));
    const res = await axios.get(`${url_FoodType}/get-all-food-type-and-each-food-list`);
    return res;
};