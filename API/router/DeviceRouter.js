const { getDevicesName } = require("../controller/DeviceController");
const { checkToken } = require("../auth/TokenValidation");

const router = require("express").Router();

router.get("/", checkToken, getDevicesName);

module.exports = router;