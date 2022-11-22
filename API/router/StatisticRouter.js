
const { getStatisticRoomAndTableAndPartyBooking, getStatisticRoomAndTableAndPartyBookingTotalForEachMonthByYear, getStatisticRoomBookingTotalForEachQuarterByYear, getStatisticPartyBookingTotalForEachQuarterByYear, getStatisticTableBookingTotalForEachQuarterByYear } = require("../controller/StatisticController");
const router = require("express").Router();

const { checkToken } = require("../auth/TokenValidation");

router.post("/get-statistic-room-and-table-and-party-booking", checkToken, getStatisticRoomAndTableAndPartyBooking);
router.post("/get-statistic-room-and-table-and-party-booking-for-each-month-by-year", checkToken, getStatisticRoomAndTableAndPartyBookingTotalForEachMonthByYear);
router.post("/get-statistic-room-booking-for-each-quater-by-year", checkToken, getStatisticRoomBookingTotalForEachQuarterByYear);

// Quản lý Đặt tiệc - Thống kê
router.post("/get-statistic-party-booking-for-each-quater-by-year", checkToken, getStatisticPartyBookingTotalForEachQuarterByYear);
// Quản lý Đặt bàn - Thống kê
router.post("/get-statistic-table-booking-for-each-quater-by-year", checkToken, getStatisticTableBookingTotalForEachQuarterByYear);

module.exports = router;