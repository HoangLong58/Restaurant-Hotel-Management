import { AXIOS_API_URL } from "../constants/Axios";
import axios from 'axios';
import authToken from "../utils/authToken";

const url_TableType = `${AXIOS_API_URL}/api/user/table-types`;

export const getTableTypes = async () => {
    authToken(localStorage.getItem("customer_token"));
    const res = await axios.get(`${url_TableType}`);
    return res;
};