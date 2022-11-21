const { createPartyBookingOrder, getPartyBookingAndDetails, getQuantityPartyBooking, findPartyBookingByIdOrCustomerEmailOrCustomerPhoneOrCustomerName, findPartyBookingById, checkInPartyBookingOrder, checkOutPartyBookingOrder } = require("../controller/PartyBookingOrderController");
const { checkToken } = require("../auth/TokenValidation");

const router = require("express").Router();

router.get("/quantity", checkToken, getQuantityPartyBooking);    //
router.get("/:search", checkToken, findPartyBookingByIdOrCustomerEmailOrCustomerPhoneOrCustomerName);  //
router.get("/", checkToken, getPartyBookingAndDetails);  //

router.post("/check-in-party-booking-order", checkToken, checkInPartyBookingOrder);   //
router.post("/check-out-party-booking-order", checkToken, checkOutPartyBookingOrder);   //
router.post("/find-party-booking-by-id", checkToken, findPartyBookingById);   //
router.post("/", checkToken, createPartyBookingOrder);

module.exports = router;