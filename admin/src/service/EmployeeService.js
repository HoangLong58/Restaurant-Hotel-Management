import axios from 'axios';
import { AXIOS_API_URL } from "../constants/Axios";
import authToken from "../utils/authToken";

const url_Employee = `${AXIOS_API_URL}/api/admin/employees`;

// Quên mật khẩu - Email
export const updateEmployeeOtpByEmail = async (data) => {
    const res = await axios.put(`${url_Employee}/update-employee-otp-by-email`, data);
    return res;
};
export const updateEmployeePasswordByEmail = async (data) => {
    const res = await axios.put(`${url_Employee}/update-employee-password-by-otp-and-email`, data);
    return res;
};

// Quên mật khẩu - Phone number
export const updateEmployeeOtpByPhoneNumber = async (data) => {
    const res = await axios.put(`${url_Employee}/update-employee-otp-by-phone-number`, data);
    return res;
};
export const updateEmployeePasswordByPhoneNumber = async (data) => {
    const res = await axios.put(`${url_Employee}/update-employee-password-by-otp-and-phone-number`, data);
    return res;
};

// Quản lý Nhân viên
export const getAllEmployees = async () => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_Employee}/`);
    return res;
};

// Quản lý Nhân viên
export const findEmployeeByIdOrName = async (search) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_Employee}/search/${search}`);
    return res;
};
// Quản lý Nhân viên
export const findEmployeeById = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_Employee}/find-employee-by-id`, data);
    return res;
};
// Quản lý Nhân viên
export const getQuantityEmployee = async () => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_Employee}/quantity`);
    return res;
};
// Quản lý Nhân viên
export const createEmployee = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_Employee}/`, data);
    return res;
};
// Quản lý Nhân viên
export const updateEmployee = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.put(`${url_Employee}/`, data);
    return res;
};
// Quản lý Nhân viên
export const deleteEmployee = async (employeeId) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.delete(`${url_Employee}/${employeeId}`);
    return res;
};
// Quản lý Nhân viên
export const updateEmployeeStateToDisable = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.put(`${url_Employee}/disable-employee`, data);
    return res;
};
// Quản lý Nhân viên
export const updateEmployeeStateToAble = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.put(`${url_Employee}/undisable-employee`, data);
    return res;
};