const { getAllTableEmployeeByTableBookingId, deleteTableEmployee, createTableEmployeeByListEmployeeId } = require("../controller/TableEmployeeController");
const { checkToken } = require("../auth/TokenValidation");

const router = require("express").Router();

router.get("/get-table-employee-by-table-booking-id/:tableBookingId", checkToken, getAllTableEmployeeByTableBookingId); //
router.delete("/:tableEmployeeId", checkToken, deleteTableEmployee); //

router.post("/create-table-employee-by-list-employee-id", checkToken, createTableEmployeeByListEmployeeId); //

module.exports = router;