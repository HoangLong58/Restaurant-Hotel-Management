const { getQuantityFloor, findFloorByIdOrName, getFloors, findFloorById, createFloor, updateFloor, deleteFloor } = require("../controller/FloorController");
const { checkToken } = require("../auth/TokenValidation");

const router = require("express").Router();

router.get("/quantity", checkToken, getQuantityFloor);
router.get("/:search", checkToken, findFloorByIdOrName);
router.get("/", checkToken, getFloors);

router.post("/find-floor-by-id", checkToken, findFloorById);
router.post("/", checkToken, createFloor);
router.put("/", checkToken, updateFloor);
router.delete("/:floorId", checkToken, deleteFloor);

module.exports = router;