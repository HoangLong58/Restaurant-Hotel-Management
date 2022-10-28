import { AXIOS_API_URL } from "../constants/Axios";
import axios from 'axios';
import authToken from "../utils/authToken";

const url_PartyHall = `${AXIOS_API_URL}/api/user/party-halls`;

export const getPartyHalls = async () => {
    authToken(localStorage.getItem("customer_token"));
    const res = await axios.get(`${url_PartyHall}`);
    return res;
};

export const findPartyHall = async (body) => {
    authToken(localStorage.getItem("customer_token"));
    const res = await axios.post(`${url_PartyHall}/find-party-hall`, body);
    return res;
};

export const getPartyHallAndImages = async (body) => {
    authToken(localStorage.getItem("customer_token"));
    const res = await axios.post(`${url_PartyHall}/get-party-hall-and-images`, body);
    return res;
};
