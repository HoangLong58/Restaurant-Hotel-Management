import axios from 'axios';
import { AXIOS_API_URL } from "../constants/Axios";
import authToken from "../utils/authToken";

const url_RoomBookingOrder = `${AXIOS_API_URL}/api/user/room-booking-orders`;

export const createRoomBookingOrder = async (data) => {
    authToken(localStorage.getItem("customer_token"));
    const res = await axios.post(`${url_RoomBookingOrder}/`, data);
    return res;
};