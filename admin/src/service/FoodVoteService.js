import axios from 'axios';
import { AXIOS_API_URL } from "../constants/Axios";
import authToken from "../utils/authToken";

const url_FoodVote = `${AXIOS_API_URL}/api/user/food-votes`;

// Quản lý Bình luận - Đánh giá món ăn Nhà hàng
export const getAllFoodVotes = async () => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_FoodVote}/`);
    return res;
};

// Quản lý Bình luận - Đánh giá món ăn Nhà hàng
export const findFoodVoteByIdOrName = async (search) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_FoodVote}/${search}`);
    return res;
};
// Quản lý Bình luận - Đánh giá món ăn Nhà hàng
export const findFoodVoteById = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.post(`${url_FoodVote}/find-food-vote-by-id`, data);
    return res;
};
// Quản lý Bình luận - Đánh giá món ăn Nhà hàng
export const getQuantityFoodVote = async () => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.get(`${url_FoodVote}/quantity`);
    return res;
};
// Quản lý Bình luận - Đánh giá món ăn Nhà hàng - Phản hồi
export const replyCustomerComment = async (data) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.put(`${url_FoodVote}/reply-comment-food-vote`, data);
    return res;
};
// Quản lý Bình luận - Đánh giá món ăn Nhà hàng - Xóa
export const deleteFoodVoteAdminById = async (id) => {
    authToken(localStorage.getItem("admin_token"));
    const res = await axios.delete(`${url_FoodVote}/delete-comment-food-vote/${id}`);
    return res;
};