
const { getTableBookings, getTableBookingWithTypeAndFloor, findTableBookings } = require("../controller/TableBookingController");
const router = require("express").Router();

const { checkToken } = require("../auth/TokenValidation");

router.get("/get-table-booking-with-type-and-floor", checkToken, getTableBookingWithTypeAndFloor);
router.get("/", checkToken, getTableBookings);

router.post("/find-table-booking", checkToken, findTableBookings);

module.exports = router;