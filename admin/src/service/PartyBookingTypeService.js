import axios from 'axios';
import { AXIOS_API_URL } from "../constants/Axios";
import authToken from "../utils/authToken";

const url_PartyBookingType = `${AXIOS_API_URL}/api/user/party-booking-types`;

// Quản lý Loại đặt tiệc - Nhà hàng
export const getAllPartyBookingTypes = async () => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_PartyBookingType}/get-all-party-booking-types`);
    return res;
};

// Quản lý Loại đặt tiệc - Nhà hàng
export const findPartyBookingTypeByIdOrName = async (search) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_PartyBookingType}/${search}`);
    return res;
};
// Quản lý Loại đặt tiệc - Nhà hàng
export const findPartyBookingTypeById = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_PartyBookingType}/find-party-booking-type-by-id`, data);
    return res;
};
// Quản lý Loại đặt tiệc - Nhà hàng
export const getQuantityPartyBookingType = async () => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_PartyBookingType}/quantity`);
    return res;
};
// Quản lý Loại đặt tiệc - Nhà hàng
export const createPartyBookingType = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_PartyBookingType}/`, data);
    return res;
};
// Quản lý Loại đặt tiệc - Nhà hàng
export const updatePartyBookingType = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.put(`${url_PartyBookingType}/`, data);
    return res;
};
// Quản lý Loại đặt tiệc - Nhà hàng: Vô hiệu hóa loại
export const disablePartyBookingTypeById = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.put(`${url_PartyBookingType}/update-party-booking-type-state-to-one`, data);
    return res;
};
// Quản lý Loại đặt tiệc - Nhà hàng: Vô hiệu hóa loại
export const ablePartyBookingTypeById = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.put(`${url_PartyBookingType}/update-party-booking-type-state-to-zero`, data);
    return res;
};
// Quản lý Loại đặt tiệc - Nhà hàng
export const deletePartyBookingType = async (partyBookingTypeId) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.delete(`${url_PartyBookingType}/${partyBookingTypeId}`);
    return res;
};
// Quản lý Đặt tiệc - Nhà hàng: Thống kê theo loại
export const findAllPartyBookingTypeInPartyBookingOrder = async () => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_PartyBookingType}/get-party-booking-type-in-party-booking-order`);
    return res;
};