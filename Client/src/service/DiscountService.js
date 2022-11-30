import axios from 'axios';
import { AXIOS_API_URL } from "../constants/Axios";
import authToken from "../utils/authToken";

const url_Discount = `${AXIOS_API_URL}/api/user/discounts`;

export const getDiscountByDiscountCode = async (discountCode) => {
    authToken(localStorage.getItem("customer_token"));
    const res = await axios.post(`${url_Discount}/get-discount-by-code`, {
        discountCode: discountCode
    });
    return res;
};

export const updateDiscountState = async (id, state) => {
    authToken(localStorage.getItem("customer_token"));
    const res = await axios.put(`${url_Discount}/update-state`, {
        discountId: id,
        discountState: state
    });
    return res;
};