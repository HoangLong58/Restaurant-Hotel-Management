const { createRoomBookingOrder } = require("../controller/RoomBookingOrderController");
const { checkToken } = require("../auth/TokenValidation");

const router = require("express").Router();

router.post("/", checkToken, createRoomBookingOrder);

module.exports = router;