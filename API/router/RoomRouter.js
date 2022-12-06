
const { getRooms, getRoomByRoomId, getRoomsWithImageTypeFloor, getRoomsAndServices, getMinMaxRoomPrice, findRoomsAndServices, updateRoomState, getQuantityRooms, findAllRoomByIdOrName, findAllRoomById, createRoom, updateRoom, deleteRoom, getAllRooms, findRoomAndImageWhenAddDeviceByRoomId } = require("../controller/RoomController");
const router = require("express").Router();

const { checkToken } = require("../auth/TokenValidation");


router.get("/quantity", checkToken, getQuantityRooms); //
router.get("/search/:search", checkToken, findAllRoomByIdOrName); //
router.get("/get-all-rooms", checkToken, getAllRooms); //
router.get("/find-room-when-add-device-by-room-id/:roomId", checkToken, findRoomAndImageWhenAddDeviceByRoomId); //
router.get("/get-rooms-and-services", checkToken, getRoomsAndServices);
router.get("/get-min-max-room-price", checkToken, getMinMaxRoomPrice);
router.get("/:roomId", checkToken, getRoomByRoomId);
router.get("/", getRoomsWithImageTypeFloor);

router.put("/update-state", checkToken, updateRoomState);
router.put("/", checkToken, updateRoom); //

router.post("/find-rooms-and-services", checkToken, findRoomsAndServices);
router.post("/find-room-by-id", checkToken, findAllRoomById); //
router.post("/", checkToken, createRoom); //

router.delete("/:roomId", checkToken, deleteRoom); //

module.exports = router;