
const { getPartyBookingTypes } = require("../controller/PartyBookingTypeController");
const router = require("express").Router();

const { checkToken } = require("../auth/TokenValidation");

router.get("/", checkToken, getPartyBookingTypes);

module.exports = router;