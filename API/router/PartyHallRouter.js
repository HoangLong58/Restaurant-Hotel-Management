
const { getPartyHallsWithImageTypeFloor, findPartyHalls, getPartyHallWithImagesTypeFloor } = require("../controller/PartyHallController");
const router = require("express").Router();

const { checkToken } = require("../auth/TokenValidation");

router.get("/", checkToken, getPartyHallsWithImageTypeFloor);
router.post("/find-party-hall", checkToken, findPartyHalls);
router.post("/get-party-hall-and-images", checkToken, getPartyHallWithImagesTypeFloor);

module.exports = router;