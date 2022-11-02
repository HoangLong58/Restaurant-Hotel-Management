import axios from 'axios';
import { AXIOS_API_URL } from "../constants/Axios";
import authToken from "../utils/authToken";

const url_RoomBookingFoodDetail = `${AXIOS_API_URL}/api/admin/room-booking-food-details`;

// Quản lý Đặt phòng
export const getRoomBookingFoodDetailsByRoomBookingOrderId = async (id) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_RoomBookingFoodDetail}/${id}`);
    return res;
};

