const { getDeviceTypes, findDeviceTypeByIdOrName, getQuantityDeviceType, createDeviceType, updateDeviceType, deleteDeviceType, findDeviceTypeById } = require("../controller/DeviceTypeController");
const { checkToken } = require("../auth/TokenValidation");

const router = require("express").Router();

router.get("/quantity", checkToken, getQuantityDeviceType);
router.get("/:search", checkToken, findDeviceTypeByIdOrName);
router.get("/", checkToken, getDeviceTypes);

router.post("/find-divice-type-by-id", checkToken, findDeviceTypeById);
router.post("/", checkToken, createDeviceType);
router.put("/", checkToken, updateDeviceType);
router.delete("/:deviceTypeId", checkToken, deleteDeviceType);

module.exports = router;