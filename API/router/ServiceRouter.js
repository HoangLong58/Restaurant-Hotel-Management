const { getServices, getQuantityService, getAllServices, findServiceByIdOrName, findServiceById, createService, updateService, deleteService } = require("../controller/ServiceController");
const { checkToken } = require("../auth/TokenValidation");

const router = require("express").Router();

router.get("/quantity", checkToken, getQuantityService); //
router.get("/all", checkToken, getAllServices); //
router.get("/:search", checkToken, findServiceByIdOrName); //
router.get("/", checkToken, getServices);

router.post("/find-service-by-id", checkToken, findServiceById); //
router.post("/", checkToken, createService); //
router.put("/", checkToken, updateService); // 
router.delete("/:serviceId", checkToken, deleteService); //

module.exports = router;