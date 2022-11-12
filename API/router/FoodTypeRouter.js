
const { getFoodTypes, getQuantityFoodType, getAllFoodTypes, findAllFoodTypeByIdOrName, findAllFoodTypeById, createFoodType, updateFoodType, deleteFoodType } = require("../controller/FoodTypeController");
const router = require("express").Router();

const { checkToken } = require("../auth/TokenValidation");

router.get("/quantity", checkToken, getQuantityFoodType); //
router.get("/get-all-food-types", checkToken, getAllFoodTypes); //
router.get("/:search", checkToken, findAllFoodTypeByIdOrName); //
router.get("/", checkToken, getFoodTypes);

router.post("/find-food-type-by-id", checkToken, findAllFoodTypeById); //
router.post("/", checkToken, createFoodType); //
router.put("/", checkToken, updateFoodType); //
router.delete("/:foodTypeId", checkToken, deleteFoodType); //

module.exports = router;