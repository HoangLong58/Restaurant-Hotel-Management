
const { getPartyHallsWithImageTypeFloor, findPartyHalls, getPartyHallWithImagesTypeFloor, updatePartyHallState } = require("../controller/PartyHallController");
const router = require("express").Router();

const { checkToken } = require("../auth/TokenValidation");

router.get("/", checkToken, getPartyHallsWithImageTypeFloor);
router.post("/find-party-hall", checkToken, findPartyHalls);
router.post("/get-party-hall-and-images", checkToken, getPartyHallWithImagesTypeFloor);

router.put("/update-state", checkToken, updatePartyHallState);

module.exports = router;