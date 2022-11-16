
const { getPartyHallsWithImageTypeFloor, findPartyHalls, getPartyHallWithImagesTypeFloor, updatePartyHallState, getQuantityPartyHall, getAllPartyHalls, findPartyHallByIdOrName, findPartyHallById, createPartyHall, updatePartyHall, deletePartyHall } = require("../controller/PartyHallController");
const router = require("express").Router();

const { checkToken } = require("../auth/TokenValidation");

router.get("/quantity", checkToken, getQuantityPartyHall); //
router.get("/get-all-party-halls", checkToken, getAllPartyHalls);    //
router.get("/search/:search", checkToken, findPartyHallByIdOrName);   //
router.get("/", checkToken, getPartyHallsWithImageTypeFloor);

router.post("/find-party-hall-by-id", checkToken, findPartyHallById); //
router.post("/find-party-hall", checkToken, findPartyHalls);
router.post("/get-party-hall-and-images", checkToken, getPartyHallWithImagesTypeFloor);
router.post("/", checkToken, createPartyHall); //

router.put("/update-state", checkToken, updatePartyHallState);
router.put("/", checkToken, updatePartyHall);  //

router.delete("/:partyHallId", checkToken, deletePartyHall);  //

module.exports = router;