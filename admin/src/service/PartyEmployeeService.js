import axios from 'axios';
import { AXIOS_API_URL } from "../constants/Axios";
import authToken from "../utils/authToken";

const url_PartyEmployee = `${AXIOS_API_URL}/api/admin/party-employees`;

// Quản lý Sảnh - Thêm Nhân viên
export const getAllPartyEmployeeByPartyHallId = async (partyHallId) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_PartyEmployee}/get-party-employee-by-party-hall-id/${partyHallId}`);
    return res;
};
// Quản lý Sảnh - Thêm Nhân viên
export const deletePartyEmployeeByPartyEmployeeId = async (partyEmployeeId) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.delete(`${url_PartyEmployee}/${partyEmployeeId}`);
    return res;
};
// Quản lý Sảnh - Thêm Nhân viên
export const createPartyEmployeeByListEmployeeId = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_PartyEmployee}/create-party-employee-by-list-employee-id`, data);
    return res;
};
