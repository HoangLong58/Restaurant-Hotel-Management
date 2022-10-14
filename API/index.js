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
const partyHallRouter = require("./router/PartyHallRouter");
const partyHallImageRouter = require("./router/PartyHallImageRouter");
const partyHallTimeRouter = require("./router/PartyHallTimeRouter");
const partyBookingTypeRouter = require("./router/PartyBookingTypeRouter");
const partyHallTypeRouter = require("./router/PartyHallTypeRouter");
const partyServiceRouter = require("./router/PartyServiceRouter");
const partyServiceTypeRouter = require("./router/PartyServiceTypeRouter");
const foodTypeRouter = require("./router/FoodTypeRouter");
const foodRouter = require("./router/FoodRouter");
const setMenuRouter = require("./router/SetMenuRouter");
const menuDetailFoodRouter = require("./router/MenuDetailFoodRouter");
const partyBookingOrderRouter = require("./router/PartyBookingOrderController");

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
app.use("/api/user/party-halls", partyHallRouter);
app.use("/api/user/party-hall-images", partyHallImageRouter);
app.use("/api/user/party-hall-times", partyHallTimeRouter);
app.use("/api/user/party-booking-types", partyBookingTypeRouter);
app.use("/api/user/party-hall-types", partyHallTypeRouter);
app.use("/api/user/party-services", partyServiceRouter);
app.use("/api/user/party-service-types", partyServiceTypeRouter);
app.use("/api/user/food-types", foodTypeRouter);
app.use("/api/user/foods", foodRouter);
app.use("/api/user/set-menus", setMenuRouter);
app.use("/api/user/menu-detail-foods", menuDetailFoodRouter);
app.use("/api/user/party-booking-orders", partyBookingOrderRouter);

app.use("/api/user/payment", stripeRouter);

app.listen(process.env.PORT || 5000, () => {
    console.log("BACKEND server is running at:", process.env.PORT);
})