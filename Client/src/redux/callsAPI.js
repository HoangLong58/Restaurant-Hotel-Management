import axios from "axios";
import { AXIOS_API_URL } from "../constants/Axios";
import { loginFailure, loginStart, loginSuccess, logoutCustomer } from "./customerRedux";
import { logoutCart } from "./foodCartRedux";

// Hàm đăng ký
export const register = async (dispatch, customer) => {
    // Customer gồm { firstName, lastName, email, phoneNumber, password }
    try {
        const res = await axios.post(`${AXIOS_API_URL}/api/user/customers/register`, customer);
        console.log("Thực hiện register, gửi đến api: ", res);
        //Đăng ký thành công thì tự đăng nhập vào
        login(dispatch, { email: customer.email, password: customer.password });
    } catch (err) {
        console.log("Lỗi đăng ký ", err);
        customer.setWrong(err.response.data.message);
    }
}

// Hàm đăng nhập
export const login = async (dispatch, customer) => {
    // customer gồm email/ phoneNumber, password
    dispatch(loginStart());
    try {
        const res = await axios.post(`${AXIOS_API_URL}/api/user/customers/login`, customer, { withCredentials: true });
        console.log("Res login: ", res);
        dispatch(loginSuccess(res.data));
        localStorage.setItem("customer_token", res.data.token);
    } catch (err) {
        dispatch(loginFailure());
        customer.setErrorLogin(err.response.data.message);
    }
}

// Hàm đăng xuất
export const logout = async (dispatch, customer) => {
    // Customer gồm: đối tượng customer ở CustomerRedux
    dispatch(logoutCart()); //Khởi tạo lại giỏ hàng 
    dispatch(logoutCustomer()); //Khởi tạo lại người dùng
    localStorage.removeItem("customer_token");
}