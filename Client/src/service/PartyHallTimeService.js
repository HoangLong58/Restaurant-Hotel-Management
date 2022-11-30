import axios from 'axios';
import { AXIOS_API_URL } from "../constants/Axios";
import authToken from "../utils/authToken";

const url_PartyHallTime = `${AXIOS_API_URL}/api/user/party-hall-times`;

export const getPartyHallTime = async () => {
    authToken(localStorage.getItem("customer_token"));
    const res = await axios.get(`${url_PartyHallTime}`);
    return res;
};