import axios from 'axios';
import { AXIOS_API_URL } from "../constants/Axios";
import authToken from "../utils/authToken";

const url_RoomBookingFoodOrder = `${AXIOS_API_URL}/api/user/room-booking-food-orders`;

export const createRoomBookingFoodOrder = async (data) => {
    authToken(localStorage.getItem("customer_token"));
    const res = await axios.post(`${url_RoomBookingFoodOrder}/`, data);
    return res;
};