const { getAllAdminLogs, getTop5AdminLogs, getQuantityAdminLog, findAdminLogByIdOrName, getAdminLogs, findAdminLogById } = require("../controller/AdminLogController");
const { checkToken } = require("../auth/TokenValidation");

const router = require("express").Router();

router.get("/get-all-admin-logs", checkToken, getAllAdminLogs);
router.get("/get-top-5-admin-logs", checkToken, getTop5AdminLogs);

router.get("/quantity", checkToken, getQuantityAdminLog);
router.get("/:search", checkToken, findAdminLogByIdOrName);
router.get("/", checkToken, getAdminLogs);

router.post("/find-admin-log-by-id", checkToken, findAdminLogById);

module.exports = router;