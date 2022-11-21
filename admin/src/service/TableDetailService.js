import axios from 'axios';
import { AXIOS_API_URL } from "../constants/Axios";
import authToken from "../utils/authToken";

const url_TableDetail = `${AXIOS_API_URL}/api/admin/table-details`;

// Quản lý Đặt Bàn
export const findAllTableDetailByTableBookingOrderId = async (tableBookingOrderId) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_TableDetail}/get-all-table-detail-by-table-booking-order-id/${tableBookingOrderId}`);
    return res;
};
// Quản lý Đặt Bàn
export const createTableDetailByFoodListAndTableBookingOrderId = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_TableDetail}/create-table-detail-by-list-food`, data);
    return res;
};
// Quản lý Đặt Bàn
export const updateTableDetailQuantityByTableDetailId = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.put(`${url_TableDetail}/update-table-detail-quantity-by-table-detail-id`, data);
    return res;
};

