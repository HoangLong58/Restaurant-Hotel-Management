
const { getStatisticRoomAndTableAndPartyBooking, getStatisticRoomAndTableAndPartyBookingTotalForEachMonthByYear } = require("../controller/StatisticController");
const router = require("express").Router();

const { checkToken } = require("../auth/TokenValidation");

router.post("/get-statistic-room-and-table-and-party-booking", checkToken, getStatisticRoomAndTableAndPartyBooking);
router.post("/get-statistic-room-and-table-and-party-booking-for-each-month-by-year", checkToken, getStatisticRoomAndTableAndPartyBookingTotalForEachMonthByYear);

module.exports = router;