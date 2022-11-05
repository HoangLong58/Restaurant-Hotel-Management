const { getAllRoomEmployeeByRoomId, deleteRoomEmployee, createRoomEmployeeByListEmployeeId } = require("../controller/RoomEmployeeController");
const { checkToken } = require("../auth/TokenValidation");

const router = require("express").Router();

router.get("/get-room-employee-by-room-id/:roomId", checkToken, getAllRoomEmployeeByRoomId); //
router.delete("/:roomEmployeeId", checkToken, deleteRoomEmployee); //

router.post("/create-room-employee-by-list-employee-id", checkToken, createRoomEmployeeByListEmployeeId); //

module.exports = router;