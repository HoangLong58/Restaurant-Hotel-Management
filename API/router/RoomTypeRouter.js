const { getQuantityRoomType, findRoomTypeByIdOrName, getRoomTypes, findRoomTypeById, createRoomType, updateRoomType, deleteRoomType } = require("../controller/RoomTypeController");
const { checkToken } = require("../auth/TokenValidation");

const router = require("express").Router();

router.get("/quantity", checkToken, getQuantityRoomType);
router.get("/:search", checkToken, findRoomTypeByIdOrName);
router.get("/", checkToken, getRoomTypes);

router.post("/find-room-type-by-id", checkToken, findRoomTypeById);
router.post("/", checkToken, createRoomType);
router.put("/", checkToken, updateRoomType);
router.delete("/:roomTypeId", checkToken, deleteRoomType);

module.exports = router;