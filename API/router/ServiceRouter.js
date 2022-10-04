const { getServices } = require("../controller/ServiceController");
const { checkToken } = require("../auth/TokenValidation");

const router = require("express").Router();

router.get("/", checkToken, getServices);

module.exports = router;