import axios from 'axios';
import { AXIOS_API_URL } from "../constants/Axios";
import authToken from "../utils/authToken";

const url_TableType = `${AXIOS_API_URL}/api/user/table-types`;

// Quản lý Loại bàn tiệc - Nhà hàng
export const getAllTableTypes = async () => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_TableType}/get-all-table-types`);
    return res;
};

// Quản lý Loại bàn tiệc - Nhà hàng
export const findTableTypeByIdOrName = async (search) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_TableType}/${search}`);
    return res;
};
// Quản lý Loại bàn tiệc - Nhà hàng
export const findTableTypeById = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_TableType}/find-table-type-by-id`, data);
    return res;
};
// Quản lý Loại bàn tiệc - Nhà hàng
export const getQuantityTableType = async () => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_TableType}/quantity`);
    return res;
};
// Quản lý Loại bàn tiệc - Nhà hàng
export const createTableType = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_TableType}/`, data);
    return res;
};
// Quản lý Loại bàn tiệc - Nhà hàng
export const updateTableType = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.put(`${url_TableType}/`, data);
    return res;
};
// Quản lý Loại bàn tiệc - Nhà hàng: Vô hiệu hóa loại
export const disableTableTypeById = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.put(`${url_TableType}/update-table-type-state-to-one`, data);
    return res;
};
// Quản lý Loại bàn tiệc - Nhà hàng: Vô hiệu hóa loại
export const ableTableTypeById = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.put(`${url_TableType}/update-table-type-state-to-zero`, data);
    return res;
};
// Quản lý Loại bàn tiệc - Nhà hàng
export const deleteTableType = async (tableTypeId) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.delete(`${url_TableType}/${tableTypeId}`);
    return res;
};
