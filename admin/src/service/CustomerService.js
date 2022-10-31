import axios from 'axios';
import { AXIOS_API_URL } from "../constants/Axios";
import authToken from "../utils/authToken";

const url_Customer = `${AXIOS_API_URL}/api/user/customers`;

// Quản lý Khách hàng
export const getAllCustomers = async () => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_Customer}/get-all-customer`);
    return res;
};

// Quản lý Khách hàng
export const findCustomerByIdOrName = async (search) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_Customer}/search/${search}`);
    return res;
};
// Quản lý Khách hàng
export const findCustomerById = async (customerId) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_Customer}/${customerId}`);
    return res;
};
// Quản lý Khách hàng
export const getQuantityCustomer = async () => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_Customer}/quantity`);
    return res;
};
// Quản lý Khách hàng
export const updateCustomerStateToDisable = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.put(`${url_Customer}/disable-customer`, data);
    return res;
};
// Quản lý Khách hàng
export const updateCustomerStateToAble = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.put(`${url_Customer}/undisable-customer`, data);
    return res;
};
