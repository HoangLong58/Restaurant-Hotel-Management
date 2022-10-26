const { getDevicesName, getQuantityDevices, findDeviceByIdOrName, getDevicesAndTypeAndDetailAndRoomAndFloor, findDeviceById, createDevice, updateDevice, deleteDevice } = require("../controller/DeviceController");
const { checkToken } = require("../auth/TokenValidation");

const router = require("express").Router();

router.get("/get-name", checkToken, getDevicesName);
router.get("/quantity", checkToken, getQuantityDevices);
router.get("/:search", checkToken, findDeviceByIdOrName);
router.get("/", checkToken, getDevicesAndTypeAndDetailAndRoomAndFloor);

router.post("/find-device-by-id", checkToken, findDeviceById);
router.post("/", checkToken, createDevice);
router.put("/", checkToken, updateDevice);
router.delete("/:deviceId", checkToken, deleteDevice);

module.exports = router;