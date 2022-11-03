import axios from 'axios';
import { AXIOS_API_URL } from "../constants/Axios";
import authToken from "../utils/authToken";

const url_ServiceDetail = `${AXIOS_API_URL}/api/admin/service-details`;

// Quản lý Loại phòng - Thêm Dịch vụ
export const getServiceDetailsByRoomTypeId = async (roomTypeId) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_ServiceDetail}/get-service-detail-by-room-type-id/${roomTypeId}`);
    return res;
};
// Quản lý Loại phòng - Xóa Dịch vụ
export const deleteServiceDetailByServiceDetailId = async (serviceDetailId) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.delete(`${url_ServiceDetail}/${serviceDetailId}`);
    return res;
};
// Quản lý Loại phòng - Thêm Dịch vụ
export const createServiceDetailByListServiceId = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_ServiceDetail}/create-service-detail-by-list-service-id`, data);
    return res;
};
