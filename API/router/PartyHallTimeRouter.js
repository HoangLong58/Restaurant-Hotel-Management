
const { getPartyHallTimes } = require("../controller/PartyHallTimeController");
const router = require("express").Router();

const { checkToken } = require("../auth/TokenValidation");

router.get("/", checkToken, getPartyHallTimes);

module.exports = router;