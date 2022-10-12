const { getPartyHallImages } = require("../controller/PartyHallImageController");
const { checkToken } = require("../auth/TokenValidation");

const router = require("express").Router();

router.get("/", checkToken, getPartyHallImages);

module.exports = router;