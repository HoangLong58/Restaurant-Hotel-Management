
const { getTableBookings, getTableBookingWithTypeAndFloor, findTableBookings, updateTableBookingState, getQuantityTableBooking, getAllTableBookings, findTableBookingByIdOrName, findTableBookingById, createTableBooking, updateTableBooking, deleteTableBooking } = require("../controller/TableBookingController");
const router = require("express").Router();

const { checkToken } = require("../auth/TokenValidation");

router.get("/get-table-booking-with-type-and-floor", checkToken, getTableBookingWithTypeAndFloor);
router.get("/quantity", checkToken, getQuantityTableBooking); //
router.get("/get-all-table-bookings", checkToken, getAllTableBookings);    //
router.get("/search/:search", checkToken, findTableBookingByIdOrName);   //
router.get("/", checkToken, getTableBookings);

router.post("/find-table-booking-by-id", checkToken, findTableBookingById); //
router.post("/find-table-booking", checkToken, findTableBookings);
router.post("/", checkToken, createTableBooking); //

router.put("/update-state", checkToken, updateTableBookingState);
router.put("/", checkToken, updateTableBooking);  //

router.delete("/:tableBookingId", checkToken, deleteTableBooking);  //

module.exports = router;