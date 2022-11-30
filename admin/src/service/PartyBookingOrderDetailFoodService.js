import axios from 'axios';
import { AXIOS_API_URL } from "../constants/Axios";
import authToken from "../utils/authToken";

const url_PartyBookingOrderDetailFood = `${AXIOS_API_URL}/api/admin/party-booking-order-detail-foods`;

// Quản lý Đặt tiệc
export const findAllPartyBookingOrderDetailFoodByPartyBookingOrderId = async (partyBookingOrderId) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_PartyBookingOrderDetailFood}/get-all-party-booking-order-detail-food-by-party-booking-order-id/${partyBookingOrderId}`);
    return res;
};