import axios from 'axios';
import { AXIOS_API_URL } from "../constants/Axios";
import authToken from "../utils/authToken";

const url_PartyBookingOrder = `${AXIOS_API_URL}/api/user/party-booking-orders`;

export const createPartyBookingOrder = async (data) => {
    authToken(localStorage.getItem("customer_token"));
    const res = await axios.post(`${url_PartyBookingOrder}/`, data);
    return res;
};