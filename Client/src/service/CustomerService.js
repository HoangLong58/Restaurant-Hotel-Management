import axios from 'axios';
import { AXIOS_API_URL } from "../constants/Axios";

const url_Customer = `${AXIOS_API_URL}/api/user/customers`;

// Quên mật khẩu - Email
export const updateCustomerOtpByEmail = async (data) => {
    const res = await axios.put(`${url_Customer}/update-customer-otp-by-email`, data);
    return res;
};
export const updateCustomerPasswordByEmail = async (data) => {
    const res = await axios.put(`${url_Customer}/update-customer-password-by-otp-and-email`, data);
    return res;
};

// Quên mật khẩu - Phone number
export const updateCustomerOtpByPhoneNumber = async (data) => {
    const res = await axios.put(`${url_Customer}/update-customer-otp-by-phone-number`, data);
    return res;
};
export const updateCustomerPasswordByPhoneNumber = async (data) => {
    const res = await axios.put(`${url_Customer}/update-customer-password-by-otp-and-phone-number`, data);
    return res;
};