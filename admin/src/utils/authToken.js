import axios from "axios";

const authToken = (token) => {
  // Nếu có token thì đính vào header khi call api, k có token thì xóa header Authorization
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

export default authToken;