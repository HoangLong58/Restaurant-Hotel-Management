
const { findAllPartyBookingOrderDetailFoodByPartyBookingOrderId } = require("../controller/PartyBookingOrderDetailFoodController");
const router = require("express").Router();

const { checkToken } = require("../auth/TokenValidation");

router.get("/get-all-party-booking-order-detail-food-by-party-booking-order-id/:partyBookingOrderId", checkToken, findAllPartyBookingOrderDetailFoodByPartyBookingOrderId); //

module.exports = router;