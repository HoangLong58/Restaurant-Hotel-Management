
const { getFoodsAndType, getFoodsAndTypeByFoodTypeId, getMinMaxFoodPrice, getFoodsAndTypeByFoodId, getQuantityFood, getAllFoods, findAllFoodByIdOrName, findAllFoodById, createFood, updateFood, deleteFood } = require("../controller/FoodController");
const router = require("express").Router();

const { checkToken } = require("../auth/TokenValidation");

router.get("/quantity", checkToken, getQuantityFood); //
router.get("/get-all-foods", checkToken, getAllFoods); //
router.get("/search/:search", checkToken, findAllFoodByIdOrName); //
router.get("/:foodId", checkToken, getFoodsAndTypeByFoodId);
router.get("/", checkToken, getFoodsAndType);

router.put("/", checkToken, updateFood); //

router.post("/find-food-by-id", checkToken, findAllFoodById); //
router.post("/get-food-and-type-by-food-type-id", checkToken, getFoodsAndTypeByFoodTypeId);
router.post("/get-min-max-food-price", checkToken, getMinMaxFoodPrice);
router.post("/", checkToken, createFood); //

router.delete("/:foodId", checkToken, deleteFood); //

module.exports = router;