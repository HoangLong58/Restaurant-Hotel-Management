import axios from 'axios';
import { AXIOS_API_URL } from "../constants/Axios";
import authToken from "../utils/authToken";

const url_PartyHallImage = `${AXIOS_API_URL}/api/user/party-hall-images`;

// Quản lý Sảnh tiệc - Nhà hàng
export const getPartyHallImagesByPartyHallId = async (partyHallId) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_PartyHallImage}/get-party-hall-image-by-party-hall-id/${partyHallId}`);
    return res;
};