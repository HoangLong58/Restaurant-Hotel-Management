
const { findAllPartyServiceDetailByPartyBookingOrderIdAndState0, findAllPartyServiceDetailByPartyBookingOrderIdAndState1, createPartyServiceDetailByListPartyServiceDetailAndPartyBookingOrderId, updatePartyServiceDetailQuantityByPartyServiceDetailId } = require("../controller/PartyServiceDetailController");
const router = require("express").Router();

const { checkToken } = require("../auth/TokenValidation");

router.get("/get-all-party-service-detail-by-party-booking-order-id-and-state-0-no-payment/:partyBookingOrderId", checkToken, findAllPartyServiceDetailByPartyBookingOrderIdAndState0); //
router.get("/get-all-party-service-detail-by-party-booking-order-id-and-state-1-need-payment/:partyBookingOrderId", checkToken, findAllPartyServiceDetailByPartyBookingOrderIdAndState1); //

router.post("/create-party-service-detail-by-list-party-service", checkToken, createPartyServiceDetailByListPartyServiceDetailAndPartyBookingOrderId); //

router.put("/update-party-service-detail-quantity-by-party-service-detail-id", checkToken, updatePartyServiceDetailQuantityByPartyServiceDetailId); //

module.exports = router;