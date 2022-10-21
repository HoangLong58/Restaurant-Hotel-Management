import { AXIOS_API_URL } from "../constants/Axios";
import axios from 'axios';
import authToken from "../utils/authToken";

const url_FoodVote = `${AXIOS_API_URL}/api/user/food-votes`;

export const getFoodVoteList = async (data) => {
    authToken(localStorage.getItem("customer_token"));
    const res = await axios.post(`${url_FoodVote}/get-food-vote-list`, data);
    return res;
};
export const createFoodVote = async (data) => {
    authToken(localStorage.getItem("customer_token"));
    const res = await axios.post(`${url_FoodVote}`, data);
    return res;
};
export const updateFoodVote = async (data) => {
    authToken(localStorage.getItem("customer_token"));
    const res = await axios.put(`${url_FoodVote}`, data);
    return res;
};
export const deleteFoodVote = async (data) => {
    authToken(localStorage.getItem("customer_token"));
    const res = await axios.delete(`${url_FoodVote}`, { data: data });
    return res;
};