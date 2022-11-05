const { getAllDeviceDetailByRoomId, deleteDeviceDetail, createDeviceDetailByListDeviceId } = require("../controller/DeviceDetailController");
const { checkToken } = require("../auth/TokenValidation");

const router = require("express").Router();

router.get("/get-device-detail-by-room-id/:roomId", checkToken, getAllDeviceDetailByRoomId); //
router.delete("/:deviceDetailId", checkToken, deleteDeviceDetail); //

router.post("/create-device-detail-by-list-device-id", checkToken, createDeviceDetailByListDeviceId); //

module.exports = router;