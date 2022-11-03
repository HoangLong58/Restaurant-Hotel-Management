const { getServices, getQuantityService, getAllServices, findServiceByIdOrName, findServiceById, createService, updateService, deleteService, getAllServiceByRoomTypeId } = require("../controller/ServiceController");
const { checkToken } = require("../auth/TokenValidation");

const router = require("express").Router();

router.get("/quantity", checkToken, getQuantityService); //
router.get("/all", checkToken, getAllServices); //
router.get("/get-all-service-by-room-type-id/:roomTypeId", checkToken, getAllServiceByRoomTypeId);   //
router.get("/:search", checkToken, findServiceByIdOrName); //
router.get("/", checkToken, getServices);

router.post("/find-service-by-id", checkToken, findServiceById); //
router.post("/", checkToken, createService); //
router.put("/", checkToken, updateService); // 
router.delete("/:serviceId", checkToken, deleteService); //

module.exports = router;