const { createRoomBookingOrder, getRoomBookingAndDetails, findRoomBookingByIdOrCustomerEmailOrCustomerPhoneOrCustomerNameOrRoomName, getQuantityRoomBooking, findRoomBookingById, checkInRoomBookingOrder, checkOutRoomBookingOrder, getStatisticRoomBookingTotalByDate, getStatisticRoomBookingTotalByQuarter, getLimitRoomBookingTotalOfCityForEachQuarter, getStatisticRoomBookingTotalOfCityByDate, getStatisticRoomBookingTotalOfCityByQuarter, getStatisticRoomBookingTotalOfTypeByQuarter, getStatisticRoomBookingTotalOfTypeByDate, getStatisticRoomBookingTotalOfCustomerByQuarter, getStatisticRoomBookingTotalOfCustomerByDate } = require("../controller/RoomBookingOrderController");
const { checkToken } = require("../auth/TokenValidation");

const router = require("express").Router();

router.get("/quantity", checkToken, getQuantityRoomBooking);    //
router.get("/:search", checkToken, findRoomBookingByIdOrCustomerEmailOrCustomerPhoneOrCustomerNameOrRoomName);  //
router.get("/", checkToken, getRoomBookingAndDetails);  //

router.post("/get-statistic-room-booking-order-total-of-city-for-each-quarter", checkToken, getLimitRoomBookingTotalOfCityForEachQuarter);   //
router.post("/get-statistic-room-booking-order-total-of-city-by-date", checkToken, getStatisticRoomBookingTotalOfCityByDate);   //
router.post("/get-statistic-room-booking-order-total-of-city-by-quarter", checkToken, getStatisticRoomBookingTotalOfCityByQuarter);   //
router.post("/get-statistic-room-booking-order-total-by-date", checkToken, getStatisticRoomBookingTotalByDate);   //
router.post("/get-statistic-room-booking-order-total-by-quarter", checkToken, getStatisticRoomBookingTotalByQuarter);   //
router.post("/get-statistic-room-booking-order-total-by-quarter-and-type", checkToken, getStatisticRoomBookingTotalOfTypeByQuarter);   //
router.post("/get-statistic-room-booking-order-total-by-date-and-type", checkToken, getStatisticRoomBookingTotalOfTypeByDate);   //
router.post("/get-statistic-room-booking-order-total-by-quarter-and-customer", checkToken, getStatisticRoomBookingTotalOfCustomerByQuarter);   //
router.post("/get-statistic-room-booking-order-total-by-date-and-customer", checkToken, getStatisticRoomBookingTotalOfCustomerByDate);   //
router.post("/find-room-booking-by-id", checkToken, findRoomBookingById);   //
router.post("/check-in-room-booking-order", checkToken, checkInRoomBookingOrder);   //
router.post("/check-out-room-booking-order", checkToken, checkOutRoomBookingOrder);   //
router.post("/", checkToken, createRoomBookingOrder);

module.exports = router;