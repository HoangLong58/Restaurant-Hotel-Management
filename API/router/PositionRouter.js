const { getQuantityPosition, findPositionByIdOrName, getAllPositions, findPositionById, createPosition, updatePosition, deletePosition } = require("../controller/PositionController");
const { checkToken } = require("../auth/TokenValidation");

const router = require("express").Router();

router.get("/quantity", checkToken, getQuantityPosition);
router.get("/:search", checkToken, findPositionByIdOrName);
router.get("/", checkToken, getAllPositions);

router.post("/find-position-by-id", checkToken, findPositionById);
router.post("/", checkToken, createPosition);
router.put("/", checkToken, updatePosition);
router.delete("/:positionId", checkToken, deletePosition);

module.exports = router;