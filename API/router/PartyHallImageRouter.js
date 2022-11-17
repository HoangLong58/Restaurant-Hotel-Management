const { getPartyHallImages, getPartyHallImageByPartyHallId } = require("../controller/PartyHallImageController");
const { checkToken } = require("../auth/TokenValidation");

const router = require("express").Router();

router.get("/", checkToken, getPartyHallImages);
router.get("/get-party-hall-image-by-party-hall-id/:partyHallId", checkToken, getPartyHallImageByPartyHallId);

module.exports = router;