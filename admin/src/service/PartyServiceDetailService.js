import axios from 'axios';
import { AXIOS_API_URL } from "../constants/Axios";
import authToken from "../utils/authToken";

const url_PartyServiceDetail = `${AXIOS_API_URL}/api/admin/party-service-details`;

// Quản lý Đặt tiệc
export const findAllPartyServiceDetailByPartyBookingOrderIdAndState0NoPayment = async (partyBookingOrderId) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_PartyServiceDetail}/get-all-party-service-detail-by-party-booking-order-id-and-state-0-no-payment/${partyBookingOrderId}`);
    return res;
};
// Quản lý Đặt tiệc
export const findAllPartyServiceDetailByPartyBookingOrderIdAndState1NeedPayment = async (partyBookingOrderId) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_PartyServiceDetail}/get-all-party-service-detail-by-party-booking-order-id-and-state-1-need-payment/${partyBookingOrderId}`);
    return res;
};
// Quản lý Đặt tiệc
export const createPartyServiceDetailByListPartyServiceDetailAndPartyBookingOrderId = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_PartyServiceDetail}/create-party-service-detail-by-list-party-service`, data);
    return res;
};
// Quản lý Đặt tiệc
export const updatePartyServiceDetailQuantityByPartyServiceDetailId = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.put(`${url_PartyServiceDetail}/update-party-service-detail-quantity-by-party-service-detail-id`, data);
    return res;
};

