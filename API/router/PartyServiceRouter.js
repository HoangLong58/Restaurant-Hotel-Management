
const { getPartyServices, getPartyServiceByPartyServiceId, getPartyServicesByPartyServiceTypeId } = require("../controller/PartyServiceController");
const router = require("express").Router();

const { checkToken } = require("../auth/TokenValidation");

router.get("/:partyServiceId", checkToken, getPartyServiceByPartyServiceId);
router.get("/", checkToken, getPartyServices);

router.post("/get-party-services-by-type-id", checkToken, getPartyServicesByPartyServiceTypeId);

module.exports = router;