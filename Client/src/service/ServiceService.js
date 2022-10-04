import { AXIOS_API_URL } from "../constants/Axios";
import axios from 'axios';
import authToken from "../utils/authToken";

const url_Service = `${AXIOS_API_URL}/api/user/services`;

export const getServices = async () => {
    authToken(localStorage.getItem("customer_token"));
    const res = await axios.get(`${url_Service}`);
    return res;
};