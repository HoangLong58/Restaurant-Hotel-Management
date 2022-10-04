
const { getRooms, getRoomByRoomId, getRoomsWithImageTypeFloor, getRoomsAndServices, getMinMaxRoomPrice, findRoomsAndServices } = require("../controller/RoomController");
const router = require("express").Router();

const { checkToken } = require("../auth/TokenValidation");

router.get("/", checkToken, getRoomsWithImageTypeFloor);
router.get("/get-rooms-and-services", checkToken, getRoomsAndServices);
router.get("/get-min-max-room-price", checkToken, getMinMaxRoomPrice);

router.get("/:roomId", checkToken, getRoomByRoomId);
router.post("/find-rooms-and-services", checkToken, findRoomsAndServices);



module.exports = router;