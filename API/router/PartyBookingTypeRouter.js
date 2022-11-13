
const { getPartyBookingTypes, getAllPartyBookingTypes, getQuantityPartyBookingType, findPartyBookingTypeByIdOrName, findPartyBookingTypeById, createPartyBookingType, updatePartyBookingType, deletePartyBookingType, updatePartyBookingTypeState, updatePartyBookingTypeStateTo1, updatePartyBookingTypeStateTo0 } = require("../controller/PartyBookingTypeController");
const router = require("express").Router();

const { checkToken } = require("../auth/TokenValidation");

router.get("/quantity", checkToken, getQuantityPartyBookingType); //
router.get("/get-all-party-booking-types", checkToken, getAllPartyBookingTypes);    //
router.get("/:search", checkToken, findPartyBookingTypeByIdOrName);   //
router.get("/", checkToken, getPartyBookingTypes);


router.post("/find-party-booking-type-by-id", checkToken, findPartyBookingTypeById); //
router.post("/", checkToken, createPartyBookingType); //
// STATE: 0: đang hoạt động, 1: Đang bị khóa (Không thể tìm kiếm ở Client)
router.put("/update-party-booking-type-state-to-one", checkToken, updatePartyBookingTypeStateTo1);  //
router.put("/update-party-booking-type-state-to-zero", checkToken, updatePartyBookingTypeStateTo0);  //
router.put("/", checkToken, updatePartyBookingType);  //
router.delete("/:partyBookingTypeId", checkToken, deletePartyBookingType);  //

module.exports = router;