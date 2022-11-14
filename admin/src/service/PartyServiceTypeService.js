import axios from 'axios';
import { AXIOS_API_URL } from "../constants/Axios";
import authToken from "../utils/authToken";

const url_PartyServiceType = `${AXIOS_API_URL}/api/user/party-service-types`;

// Quản lý Loại Dịch vụ tiệc - Nhà hàng
export const getAllPartyServiceTypes = async () => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_PartyServiceType}/get-all-party-service-types`);
    return res;
};

// Quản lý Loại Dịch vụ tiệc - Nhà hàng
export const findPartyServiceTypeByIdOrName = async (search) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_PartyServiceType}/search/${search}`);
    return res;
};
// Quản lý Loại Dịch vụ tiệc - Nhà hàng
export const findPartyServiceTypeById = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_PartyServiceType}/find-party-service-type-by-id`, data);
    return res;
};
// Quản lý Loại Dịch vụ tiệc - Nhà hàng
export const getQuantityPartyServiceType = async () => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_PartyServiceType}/quantity`);
    return res;
};
// Quản lý Loại Dịch vụ tiệc - Nhà hàng
export const createPartyServiceType = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_PartyServiceType}/`, data);
    return res;
};
// Quản lý Loại Dịch vụ tiệc - Nhà hàng
export const updatePartyServiceType = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.put(`${url_PartyServiceType}/`, data);
    return res;
};
// Quản lý Loại Dịch vụ tiệc - Nhà hàng: Vô hiệu hóa loại
export const disablePartyServiceTypeById = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.put(`${url_PartyServiceType}/update-party-service-type-state-to-one`, data);
    return res;
};
// Quản lý Loại Dịch vụ tiệc - Nhà hàng: Vô hiệu hóa loại
export const ablePartyServiceTypeById = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.put(`${url_PartyServiceType}/update-party-service-type-state-to-zero`, data);
    return res;
};
// Quản lý Loại Dịch vụ tiệc - Nhà hàng
export const deletePartyServiceType = async (partyServiceTypeId) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.delete(`${url_PartyServiceType}/${partyServiceTypeId}`);
    return res;
};
