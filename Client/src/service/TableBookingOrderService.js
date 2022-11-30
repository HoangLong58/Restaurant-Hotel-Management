import axios from 'axios';
import { AXIOS_API_URL } from "../constants/Axios";
import authToken from "../utils/authToken";

const url_TableBookingOrder = `${AXIOS_API_URL}/api/user/table-booking-orders`;

export const createTableBookingOrder = async (data) => {
    authToken(localStorage.getItem("customer_token"));
    const res = await axios.post(`${url_TableBookingOrder}/create-table-booking-order`, data);
    return res;
};