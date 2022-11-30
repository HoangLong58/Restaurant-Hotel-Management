import axios from 'axios';
import { AXIOS_API_URL } from "../constants/Axios";
import authToken from "../utils/authToken";

const url_Room = `${AXIOS_API_URL}/api/user/rooms`;

export const getRooms = async () => {
    authToken(localStorage.getItem("customer_token"));
    const res = await axios.get(`${url_Room}`);
    return res;
};
export const getRoomByRoomId = async (roomId) => {
    authToken(localStorage.getItem("customer_token"));
    const res = await axios.get(`${url_Room}/${roomId}`);
    return res;
};
export const getMinMaxRoomPrice = async () => {
    authToken(localStorage.getItem("customer_token"));
    const res = await axios.get(`${url_Room}/get-min-max-room-price`);
    return res;
};
export const getRoomsAndServices = async () => {
    authToken(localStorage.getItem("customer_token"));
    const res = await axios.get(`${url_Room}/get-rooms-and-services`);
    return res;
};
export const findRoomsAndServices = async (body) => {
    console.log("body: ", body);
    authToken(localStorage.getItem("customer_token"));
    const res = await axios.post(`${url_Room}/find-rooms-and-services`, body);
    return res;
};
export const updateRoomState = async (id, state) => {
    authToken(localStorage.getItem("customer_token"));
    const res = await axios.put(`${url_Room}/update-state`, {
        roomId: id,
        roomState: state
    });
    return res;
};