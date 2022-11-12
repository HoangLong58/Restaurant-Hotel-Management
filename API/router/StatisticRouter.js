
const { getStatisticRoomAndTableAndPartyBooking, getStatisticRoomAndTableAndPartyBookingTotalForEachMonthByYear, getStatisticRoomBookingTotalForEachQuarterByYear } = require("../controller/StatisticController");
const router = require("express").Router();

const { checkToken } = require("../auth/TokenValidation");

router.post("/get-statistic-room-and-table-and-party-booking", checkToken, getStatisticRoomAndTableAndPartyBooking);
router.post("/get-statistic-room-and-table-and-party-booking-for-each-month-by-year", checkToken, getStatisticRoomAndTableAndPartyBookingTotalForEachMonthByYear);
router.post("/get-statistic-room-booking-for-each-quater-by-year", checkToken, getStatisticRoomBookingTotalForEachQuarterByYear);

module.exports = router;