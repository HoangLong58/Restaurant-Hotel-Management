import axios from "axios";
import { AXIOS_API_URL } from "../constants/Axios";
import { loginFailure, loginStart, loginSuccess, logoutAdmin } from "./adminRedux";

// Hàm đăng ký
export const register = async (dispatch, admin) => {
    // Admin gồm { firstName, lastName, email, phoneNumber, password }
    try {
        const res = await axios.post(`${AXIOS_API_URL}/api/admin/employees/register`, admin);
        console.log("Thực hiện register, gửi đến api: ", res);
        //Đăng ký thành công thì tự đăng nhập vào
        login(dispatch, { email: admin.email, password: admin.password });
    } catch (err) {
        console.log("Lỗi đăng ký ", err);
        admin.setWrong(err.response.data.message);
    }
}

// Hàm đăng nhập
export const login = async (dispatch, admin) => {
    // Admin gồm email/ phoneNumber, password
    dispatch(loginStart());
    try {
        const res = await axios.post(`${AXIOS_API_URL}/api/admin/employees/login`, admin, { withCredentials: true });
        console.log("Res login: ", res);
        dispatch(loginSuccess(res.data));
        localStorage.setItem("admin_token", res.data.token);
    } catch (err) {
        dispatch(loginFailure());
        admin.setErrorLogin(err.response.data.message);
    }
}

// Hàm đăng xuất
export const logout = async (dispatch, admin) => {
    // Admin gồm: đối tượng admin ở AdminRedux
    dispatch(logoutAdmin()); //Khởi tạo lại người dùng
    localStorage.removeItem("admin_token");
}