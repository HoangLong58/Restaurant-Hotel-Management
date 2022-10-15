import { AXIOS_API_URL } from "../constants/Axios";
import axios from 'axios';
import authToken from "../utils/authToken";

const url_TableBooking = `${AXIOS_API_URL}/api/user/table-bookings`;

export const findTableBookings = async (data) => {
    authToken(localStorage.getItem("customer_token"));
    const res = await axios.post(`${url_TableBooking}/find-table-booking`, data);
    return res;
};