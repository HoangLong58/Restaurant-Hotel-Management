
const { getPartyServices, getPartyServiceByPartyServiceId, getPartyServicesByPartyServiceTypeId, getQuantityPartyService, getAllPartyServices, findPartyServiceByIdOrName, findPartyServiceById, createPartyService, updatePartyService, deletePartyService } = require("../controller/PartyServiceController");
const router = require("express").Router();

const { checkToken } = require("../auth/TokenValidation");

router.get("/quantity", checkToken, getQuantityPartyService); //
router.get("/get-all-party-services", checkToken, getAllPartyServices);    //
router.get("/search/:search", checkToken, findPartyServiceByIdOrName);   //
router.get("/:partyServiceId", checkToken, getPartyServiceByPartyServiceId);
router.get("/", checkToken, getPartyServices);

router.post("/get-party-services-by-type-id", checkToken, getPartyServicesByPartyServiceTypeId);
router.post("/find-party-service-by-id", checkToken, findPartyServiceById); //
router.post("/", checkToken, createPartyService); //

router.put("/", checkToken, updatePartyService);  //

router.delete("/:partyServiceId", checkToken, deletePartyService);  //

module.exports = router;