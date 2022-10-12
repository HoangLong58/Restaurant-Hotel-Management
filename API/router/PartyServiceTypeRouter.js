
const { getPartyServiceTypeByPartyServiceTypeId, getPartyServiceTypes, getPartyServiceTypesAndPartyServices } = require("../controller/PartyServiceTypeController");
const router = require("express").Router();

const { checkToken } = require("../auth/TokenValidation");

router.get("/get-party-service-types-and-party-services", checkToken, getPartyServiceTypesAndPartyServices);
router.get("/:partyServiceTypeId", checkToken, getPartyServiceTypeByPartyServiceTypeId);
router.get("/", checkToken, getPartyServiceTypes);

module.exports = router;