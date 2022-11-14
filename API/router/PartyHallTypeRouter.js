
const { getPartyHallTypes, getQuantityPartyHallType, getAllPartyHallTypes, findPartyHallTypeByIdOrName, findPartyHallTypeById, createPartyHallType, updatePartyHallTypeStateTo1, updatePartyHallTypeStateTo0, updatePartyHallType, deletePartyHallType } = require("../controller/PartyHallTypeController");
const router = require("express").Router();

const { checkToken } = require("../auth/TokenValidation");

router.get("/quantity", checkToken, getQuantityPartyHallType); //
router.get("/get-all-party-hall-types", checkToken, getAllPartyHallTypes);    //
router.get("/:search", checkToken, findPartyHallTypeByIdOrName);   //
router.get("/", checkToken, getPartyHallTypes);

router.post("/find-party-hall-type-by-id", checkToken, findPartyHallTypeById); //
router.post("/", checkToken, createPartyHallType); //
// STATE: 0: đang hoạt động, 1: Đang bị khóa (Không thể tìm kiếm ở Client)
router.put("/update-party-hall-type-state-to-one", checkToken, updatePartyHallTypeStateTo1);  //
router.put("/update-party-hall-type-state-to-zero", checkToken, updatePartyHallTypeStateTo0);  //
router.put("/", checkToken, updatePartyHallType);  //
router.delete("/:partyHallTypeId", checkToken, deletePartyHallType);  //



module.exports = router;