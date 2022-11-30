import axios from 'axios';
import { AXIOS_API_URL } from "../constants/Axios";
import authToken from "../utils/authToken";

const url_PartyBookingType = `${AXIOS_API_URL}/api/user/party-booking-types`;

export const getPartyBookingTypes = async () => {
    authToken(localStorage.getItem("customer_token"));
    const res = await axios.get(`${url_PartyBookingType}`);
    return res;
};