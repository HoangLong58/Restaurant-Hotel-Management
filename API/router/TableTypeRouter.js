
const { getTableTypes } = require("../controller/TableTypeController");
const router = require("express").Router();

const { checkToken } = require("../auth/TokenValidation");

router.get("/", checkToken, getTableTypes);

module.exports = router;