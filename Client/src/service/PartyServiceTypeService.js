import { AXIOS_API_URL } from "../constants/Axios";
import axios from 'axios';
import authToken from "../utils/authToken";

const url_PartyServiceType = `${AXIOS_API_URL}/api/user/party-service-types`;

export const getPartyServiceTypesAndPartyServices = async () => {
    authToken(localStorage.getItem("customer_token"));
    const res = await axios.get(`${url_PartyServiceType}/get-party-service-types-and-party-services`);
    return res;
};