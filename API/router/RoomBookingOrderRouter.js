const { createRoomBookingOrder, getRoomBookingAndDetails, findRoomBookingByIdOrCustomerEmailOrCustomerPhoneOrCustomerNameOrRoomName, getQuantityRoomBooking, findRoomBookingById, checkInRoomBookingOrder, checkOutRoomBookingOrder } = require("../controller/RoomBookingOrderController");
const { checkToken } = require("../auth/TokenValidation");

const router = require("express").Router();

router.get("/quantity", checkToken, getQuantityRoomBooking);    //
router.get("/:search", checkToken, findRoomBookingByIdOrCustomerEmailOrCustomerPhoneOrCustomerNameOrRoomName);  //
router.get("/", checkToken, getRoomBookingAndDetails);  //

router.post("/find-room-booking-by-id", checkToken, findRoomBookingById);   //
router.post("/check-in-room-booking-order", checkToken, checkInRoomBookingOrder);   //
router.post("/check-out-room-booking-order", checkToken, checkOutRoomBookingOrder);   //
router.post("/", checkToken, createRoomBookingOrder);

module.exports = router;