import { AXIOS_API_URL } from "../constants/Axios";
import axios from 'axios';
import authToken from "../utils/authToken";

const url_Payment = `${AXIOS_API_URL}/api/user/payment`;

export const postPaymentStripe = async (data) => {
    authToken(localStorage.getItem("customer_token"));
    const res = await axios.post(`${url_Payment}/payment-stripe`, data);
    return res;
};