const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser');  //Sử dụng module cookie-parser
const cors = require("cors");

const customerRouter = require("./router/CustomerRouter");
const roomRouter = require("./router/RoomRouter");
const serviceRouter = require("./router/ServiceRouter");
const deviceRouter = require("./router/DeviceRouter");
const roomImageRouter = require("./router/RoomImageRouter");
const discountRouter = require("./router/DiscountRouter");
const roomBookingOrderRouter = require("./router/RoomBookingOrderRouter");

const stripeRouter = require("./router/StripeRouter");

dotenv.config();
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/user/customers", customerRouter);
app.use("/api/user/rooms", roomRouter);
app.use("/api/user/services", serviceRouter);
app.use("/api/user/devices", deviceRouter);
app.use("/api/user/room-images", roomImageRouter);
app.use("/api/user/discounts", discountRouter);
app.use("/api/user/room-booking-orders", roomBookingOrderRouter);

app.use("/api/user/payment", stripeRouter);

app.listen(process.env.PORT || 5000, () => {
    console.log("BACKEND server is running at:", process.env.PORT);
})