const { getRoomImages, getRoomImageByRoomId } = require("../controller/RoomImageController");
const { checkToken } = require("../auth/TokenValidation");

const router = require("express").Router();

router.get("/", checkToken, getRoomImages);
router.get("/get-room-image-by-room-id/:roomId", checkToken, getRoomImageByRoomId);

module.exports = router;