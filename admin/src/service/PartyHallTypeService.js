import axios from 'axios';
import { AXIOS_API_URL } from "../constants/Axios";
import authToken from "../utils/authToken";

const url_PartyHallType = `${AXIOS_API_URL}/api/user/party-hall-types`;

// Quản lý Loại Sảnh tiệc - Nhà hàng
export const getAllPartyHallTypes = async () => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_PartyHallType}/get-all-party-hall-types`);
    return res;
};

// Quản lý Loại Sảnh tiệc - Nhà hàng
export const findPartyHallTypeByIdOrName = async (search) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_PartyHallType}/${search}`);
    return res;
};
// Quản lý Loại Sảnh tiệc - Nhà hàng
export const findPartyHallTypeById = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_PartyHallType}/find-party-hall-type-by-id`, data);
    return res;
};
// Quản lý Loại Sảnh tiệc - Nhà hàng
export const getQuantityPartyHallType = async () => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_PartyHallType}/quantity`);
    return res;
};
// Quản lý Loại Sảnh tiệc - Nhà hàng
export const createPartyHallType = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_PartyHallType}/`, data);
    return res;
};
// Quản lý Loại Sảnh tiệc - Nhà hàng
export const updatePartyHallType = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.put(`${url_PartyHallType}/`, data);
    return res;
};
// Quản lý Loại Sảnh tiệc - Nhà hàng: Vô hiệu hóa loại
export const disablePartyHallTypeById = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.put(`${url_PartyHallType}/update-party-hall-type-state-to-one`, data);
    return res;
};
// Quản lý Loại Sảnh tiệc - Nhà hàng: Vô hiệu hóa loại
export const ablePartyHallTypeById = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.put(`${url_PartyHallType}/update-party-hall-type-state-to-zero`, data);
    return res;
};
// Quản lý Loại Sảnh tiệc - Nhà hàng
export const deletePartyHallType = async (partyHallTypeId) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.delete(`${url_PartyHallType}/${partyHallTypeId}`);
    return res;
};
