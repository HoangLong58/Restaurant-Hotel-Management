import axios from 'axios';
import { AXIOS_API_URL } from "../constants/Axios";
import authToken from "../utils/authToken";

const url_PartyHallType = `${AXIOS_API_URL}/api/user/party-hall-types`;

export const getPartyHallType = async () => {
    authToken(localStorage.getItem("customer_token"));
    const res = await axios.get(`${url_PartyHallType}`);
    return res;
};