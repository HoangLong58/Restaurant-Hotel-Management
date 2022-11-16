import axios from 'axios';
import { AXIOS_API_URL } from "../constants/Axios";
import authToken from "../utils/authToken";

const url_PartyHall = `${AXIOS_API_URL}/api/user/party-halls`;

// Quản lý Sảnh tiệc - Nhà hàng
export const getAllPartyHalls = async () => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_PartyHall}/get-all-party-halls`);
    return res;
};

// Quản lý Sảnh tiệc - Nhà hàng
export const findPartyHallByIdOrName = async (search) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_PartyHall}/search/${search}`);
    return res;
};
// Quản lý Sảnh tiệc - Nhà hàng
export const findPartyHallById = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_PartyHall}/find-party-hall-by-id`, data);
    return res;
};
// Quản lý Sảnh tiệc - Nhà hàng
export const getQuantityPartyHall = async () => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_PartyHall}/quantity`);
    return res;
};
// Quản lý Sảnh tiệc - Nhà hàng
export const createPartyHall = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_PartyHall}/`, data);
    return res;
};
// Quản lý Sảnh tiệc - Nhà hàng
export const updatePartyHall = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.put(`${url_PartyHall}/`, data);
    return res;
};
// Quản lý Sảnh tiệc - Nhà hàng
export const deletePartyHall = async (partyHallId) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.delete(`${url_PartyHall}/${partyHallId}`);
    return res;
};
