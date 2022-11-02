const { getRoomBookingFoodDetailByRoomBookingDetailId } = require("../controller/RoomBookingFoodDetailController");
const { checkToken } = require("../auth/TokenValidation");

const router = require("express").Router();

router.get("/:roomBookingDetailId", checkToken, getRoomBookingFoodDetailByRoomBookingDetailId);

module.exports = router;