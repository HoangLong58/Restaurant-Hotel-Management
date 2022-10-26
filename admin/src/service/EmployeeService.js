import axios from 'axios';
import { AXIOS_API_URL } from "../constants/Axios";

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