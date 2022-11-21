const { getMenuDetailFoods, getAllMenuDetailFoodBySetMenuId, createMenuDetailFoodByListFoodId, deleteMenuDetailFood } = require("../controller/MenuDetailFoodController");
const router = require("express").Router();

const { checkToken } = require("../auth/TokenValidation");

router.get("/get-menu-detail-food-by-set-menu-id/:setMenuId", checkToken, getAllMenuDetailFoodBySetMenuId); //
router.get("/", checkToken, getMenuDetailFoods);

router.post("/create-menu-detail-food-by-list-food-id", checkToken, createMenuDetailFoodByListFoodId); //

router.delete("/:menuDetailFoodId", checkToken, deleteMenuDetailFood); //


module.exports = router;