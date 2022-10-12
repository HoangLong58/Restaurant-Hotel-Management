
const { getPartyHallTypes } = require("../controller/PartyHallTypeController");
const router = require("express").Router();

const { checkToken } = require("../auth/TokenValidation");

router.get("/", checkToken, getPartyHallTypes);

module.exports = router;