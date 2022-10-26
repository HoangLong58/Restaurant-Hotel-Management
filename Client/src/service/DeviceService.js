import { AXIOS_API_URL } from "../constants/Axios";
import axios from 'axios';
import authToken from "../utils/authToken";

const url_Device = `${AXIOS_API_URL}/api/user/devices`;

export const getDevicesName = async () => {
    authToken(localStorage.getItem("customer_token"));
    const res = await axios.get(`${url_Device}/get-name`);
    return res;
};