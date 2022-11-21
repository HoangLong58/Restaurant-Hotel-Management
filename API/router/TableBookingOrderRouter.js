
const { getTableBookingOrders, createTableBookingOrder, getQuantityTableBooking, findTableBookingByIdOrCustomerEmailOrCustomerPhoneOrCustomerName, getTableBookingAndDetails, checkInTableBookingOrder, checkOutTableBookingOrder, findTableBookingById } = require("../controller/TableBookingOrderController");
const router = require("express").Router();

const { checkToken } = require("../auth/TokenValidation");

router.get("/quantity", checkToken, getQuantityTableBooking);    //
router.get("/:search", checkToken, findTableBookingByIdOrCustomerEmailOrCustomerPhoneOrCustomerName);  //
router.get("/", checkToken, getTableBookingAndDetails);  //

router.post("/check-in-table-booking-order", checkToken, checkInTableBookingOrder);   //
router.post("/check-out-table-booking-order", checkToken, checkOutTableBookingOrder);   //
router.post("/find-table-booking-by-id", checkToken, findTableBookingById);   //

router.post("/create-table-booking-order", checkToken, createTableBookingOrder);

module.exports = router;