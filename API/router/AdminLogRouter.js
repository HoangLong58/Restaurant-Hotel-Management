const { getAllAdminLogs, getTop5AdminLogs } = require("../controller/AdminLogController");
const { checkToken } = require("../auth/TokenValidation");

const router = require("express").Router();

router.get("/get-all-admin-logs", checkToken, getAllAdminLogs);
router.get("/get-top-5-admin-logs", checkToken, getTop5AdminLogs);

module.exports = router;