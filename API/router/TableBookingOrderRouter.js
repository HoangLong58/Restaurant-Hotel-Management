
const { getTableBookingOrders, createTableBookingOrder, getQuantityTableBooking, findTableBookingByIdOrCustomerEmailOrCustomerPhoneOrCustomerName, getTableBookingAndDetails, checkInTableBookingOrder, checkOutTableBookingOrder, findTableBookingById, getLimitTableBookingTotalOfCityForEachQuarter, getStatisticTableBookingTotalOfCityByDate, getStatisticTableBookingTotalOfCityByQuarter, getStatisticTableBookingTotalByDate, getStatisticTableBookingTotalByQuarter, getStatisticTableBookingTotalOfTypeByQuarter, getStatisticTableBookingTotalOfTypeByDate, getStatisticTableBookingTotalOfCustomerByQuarter, getStatisticTableBookingTotalOfCustomerByDate } = require("../controller/TableBookingOrderController");
const router = require("express").Router();

const { checkToken } = require("../auth/TokenValidation");

router.get("/quantity", checkToken, getQuantityTableBooking);    //
router.get("/:search", checkToken, findTableBookingByIdOrCustomerEmailOrCustomerPhoneOrCustomerName);  //
router.get("/", checkToken, getTableBookingAndDetails);  //

// Thống kê
router.post("/get-statistic-table-booking-order-total-of-city-for-each-quarter", checkToken, getLimitTableBookingTotalOfCityForEachQuarter);   //
router.post("/get-statistic-table-booking-order-total-of-city-by-date", checkToken, getStatisticTableBookingTotalOfCityByDate);   //
router.post("/get-statistic-table-booking-order-total-of-city-by-quarter", checkToken, getStatisticTableBookingTotalOfCityByQuarter);   //
router.post("/get-statistic-table-booking-order-total-by-date", checkToken, getStatisticTableBookingTotalByDate);   //
router.post("/get-statistic-table-booking-order-total-by-quarter", checkToken, getStatisticTableBookingTotalByQuarter);   //
router.post("/get-statistic-table-booking-order-total-by-quarter-and-type", checkToken, getStatisticTableBookingTotalOfTypeByQuarter);   //
router.post("/get-statistic-table-booking-order-total-by-date-and-type", checkToken, getStatisticTableBookingTotalOfTypeByDate);   //
router.post("/get-statistic-table-booking-order-total-by-quarter-and-customer", checkToken, getStatisticTableBookingTotalOfCustomerByQuarter);   //
router.post("/get-statistic-table-booking-order-total-by-date-and-customer", checkToken, getStatisticTableBookingTotalOfCustomerByDate);   //

router.post("/check-in-table-booking-order", checkToken, checkInTableBookingOrder);   //
router.post("/check-out-table-booking-order", checkToken, checkOutTableBookingOrder);   //
router.post("/find-table-booking-by-id", checkToken, findTableBookingById);   //

router.post("/create-table-booking-order", checkToken, createTableBookingOrder);

module.exports = router;