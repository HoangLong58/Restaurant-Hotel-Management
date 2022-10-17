
const { getFoodsAndType, getFoodsAndTypeByFoodTypeId, getMinMaxFoodPrice } = require("../controller/FoodController");
const router = require("express").Router();

const { checkToken } = require("../auth/TokenValidation");

router.get("/", checkToken, getFoodsAndType);

router.post("/get-food-and-type-by-food-type-id", checkToken, getFoodsAndTypeByFoodTypeId);
router.post("/get-min-max-food-price", checkToken, getMinMaxFoodPrice);

module.exports = router;