const { createRoomBookingFoodOrder } = require("../controller/RoomBookingFoodOrderController");
const { checkToken } = require("../auth/TokenValidation");

const router = require("express").Router();

router.post("/", checkToken, createRoomBookingFoodOrder);

module.exports = router;