
const { getTableBookingOrders, createTableBookingOrder } = require("../controller/TableBookingOrderController");
const router = require("express").Router();

const { checkToken } = require("../auth/TokenValidation");

router.get("/", checkToken, getTableBookingOrders);

router.post("/create-table-booking-order", checkToken, createTableBookingOrder);

module.exports = router;