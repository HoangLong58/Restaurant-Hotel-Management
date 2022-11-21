import axios from 'axios';
import { AXIOS_API_URL } from "../constants/Axios";
import authToken from "../utils/authToken";

const url_PartyService = `${AXIOS_API_URL}/api/user/party-services`;

// Quản lý Dịch vụ Tiệc - Nhà hàng
export const getAllPartyServices = async () => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_PartyService}/get-all-party-services`);
    return res;
};

// Quản lý Dịch vụ Tiệc - Nhà hàng
export const findPartyServiceByIdOrName = async (search) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_PartyService}/search/${search}`);
    return res;
};
// Quản lý Dịch vụ Tiệc - Nhà hàng
export const findPartyServiceById = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_PartyService}/find-party-service-by-id`, data);
    return res;
};
// Quản lý Dịch vụ Tiệc - Nhà hàng
export const getQuantityPartyService = async () => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_PartyService}/quantity`);
    return res;
};
// Quản lý Dịch vụ Tiệc - Nhà hàng
export const createPartyService = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_PartyService}/`, data);
    return res;
};
// Quản lý Dịch vụ Tiệc - Nhà hàng
export const updatePartyService = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.put(`${url_PartyService}/`, data);
    return res;
};
// Quản lý Dịch vụ Tiệc - Nhà hàng
export const deletePartyService = async (partyServiceId) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.delete(`${url_PartyService}/${partyServiceId}`);
    return res;
};

// Quản lý Đặt tiệc - Nhà hàng: Thêm Dịch vụ cho Tiệc
export const getPartyServiceByPartyServiceTypeId = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_PartyService}/get-party-services-by-type-id`, data);
    return res;
};
