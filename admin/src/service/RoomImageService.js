import axios from 'axios';
import { AXIOS_API_URL } from "../constants/Axios";
import authToken from "../utils/authToken";

const url_RoomImage = `${AXIOS_API_URL}/api/user/room-images`;

// Quản lý Phòng - Khách sạn
export const getRoomImagesByRoomId = async (roomId) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_RoomImage}/get-room-image-by-room-id/${roomId}`);
    return res;
};