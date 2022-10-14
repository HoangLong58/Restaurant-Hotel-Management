const { createPartyBookingOrder } = require("../controller/PartyBookingOrderController");
const { checkToken } = require("../auth/TokenValidation");

const router = require("express").Router();

router.post("/", checkToken, createPartyBookingOrder);

module.exports = router;