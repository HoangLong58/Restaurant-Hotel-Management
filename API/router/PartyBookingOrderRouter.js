const { createPartyBookingOrder, getPartyBookingAndDetails, getQuantityPartyBooking, findPartyBookingByIdOrCustomerEmailOrCustomerPhoneOrCustomerName, findPartyBookingById, checkInPartyBookingOrder, checkOutPartyBookingOrder, getLimitPartyBookingTotalOfCityForEachQuarter, getStatisticPartyBookingTotalOfCityByDate, getStatisticPartyBookingTotalOfCityByQuarter, getStatisticPartyBookingTotalByDate, getStatisticPartyBookingTotalByQuarter, getStatisticPartyBookingTotalOfTypeByQuarter, getStatisticPartyBookingTotalOfTypeByDate, getStatisticPartyBookingTotalOfCustomerByQuarter, getStatisticPartyBookingTotalOfCustomerByDate } = require("../controller/PartyBookingOrderController");
const { checkToken } = require("../auth/TokenValidation");

const router = require("express").Router();

router.get("/quantity", checkToken, getQuantityPartyBooking);    //
router.get("/:search", checkToken, findPartyBookingByIdOrCustomerEmailOrCustomerPhoneOrCustomerName);  //
router.get("/", checkToken, getPartyBookingAndDetails);  //

// Thống kê Đặt tiệc
router.post("/get-statistic-party-booking-order-total-of-city-for-each-quarter", checkToken, getLimitPartyBookingTotalOfCityForEachQuarter);   //
router.post("/get-statistic-party-booking-order-total-of-city-by-date", checkToken, getStatisticPartyBookingTotalOfCityByDate);   //
router.post("/get-statistic-party-booking-order-total-of-city-by-quarter", checkToken, getStatisticPartyBookingTotalOfCityByQuarter);   //
router.post("/get-statistic-party-booking-order-total-by-date", checkToken, getStatisticPartyBookingTotalByDate);   //
router.post("/get-statistic-party-booking-order-total-by-quarter", checkToken, getStatisticPartyBookingTotalByQuarter);   //
router.post("/get-statistic-party-booking-order-total-by-quarter-and-type", checkToken, getStatisticPartyBookingTotalOfTypeByQuarter);   //
router.post("/get-statistic-party-booking-order-total-by-date-and-type", checkToken, getStatisticPartyBookingTotalOfTypeByDate);   //
router.post("/get-statistic-party-booking-order-total-by-quarter-and-customer", checkToken, getStatisticPartyBookingTotalOfCustomerByQuarter);   //
router.post("/get-statistic-party-booking-order-total-by-date-and-customer", checkToken, getStatisticPartyBookingTotalOfCustomerByDate);   //

router.post("/check-in-party-booking-order", checkToken, checkInPartyBookingOrder);   //
router.post("/check-out-party-booking-order", checkToken, checkOutPartyBookingOrder);   //
router.post("/find-party-booking-by-id", checkToken, findPartyBookingById);   //
router.post("/", checkToken, createPartyBookingOrder);

module.exports = router;