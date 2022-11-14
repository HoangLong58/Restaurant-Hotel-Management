
const { getPartyServiceTypeByPartyServiceTypeId, getPartyServiceTypes, getPartyServiceTypesAndPartyServices, getQuantityPartyServiceType, getAllPartyServiceTypes, findPartyServiceTypeByIdOrName, findPartyServiceTypeById, createPartyServiceType, updatePartyServiceTypeStateTo1, updatePartyServiceTypeStateTo0, updatePartyServiceType, deletePartyServiceType } = require("../controller/PartyServiceTypeController");
const router = require("express").Router();

const { checkToken } = require("../auth/TokenValidation");

router.get("/get-party-service-types-and-party-services", checkToken, getPartyServiceTypesAndPartyServices);
router.get("/quantity", checkToken, getQuantityPartyServiceType); //
router.get("/get-all-party-service-types", checkToken, getAllPartyServiceTypes);    //
router.get("/search/:search", checkToken, findPartyServiceTypeByIdOrName);   //
router.get("/:partyServiceTypeId", checkToken, getPartyServiceTypeByPartyServiceTypeId);
router.get("/", checkToken, getPartyServiceTypes);


router.post("/find-party-service-type-by-id", checkToken, findPartyServiceTypeById); //
router.post("/", checkToken, createPartyServiceType); //
// STATE: 0: đang hoạt động, 1: Đang bị khóa (Không thể tìm kiếm ở Client)
router.put("/update-party-service-type-state-to-one", checkToken, updatePartyServiceTypeStateTo1);  //
router.put("/update-party-service-type-state-to-zero", checkToken, updatePartyServiceTypeStateTo0);  //
router.put("/", checkToken, updatePartyServiceType);  //
router.delete("/:partyServiceTypeId", checkToken, deletePartyServiceType);  //
module.exports = router;