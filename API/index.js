const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser');  //Sử dụng module cookie-parser
const cors = require("cors");

const customerRouter = require("./router/CustomerRouter");

dotenv.config();
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/users", customerRouter);

app.listen(process.env.PORT || 5000, () => {
    console.log("BACKEND server is running at:", process.env.PORT);
})