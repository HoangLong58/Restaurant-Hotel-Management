const { getRoomImages } = require("../controller/RoomImageController");
const { checkToken } = require("../auth/TokenValidation");

const router = require("express").Router();

router.get("/", checkToken, getRoomImages);

module.exports = router;