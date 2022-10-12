
const { getSetMenus, getSetMenuAndMenuDetailFoodAndFoodAndType } = require("../controller/SetMenuController");
const router = require("express").Router();

const { checkToken } = require("../auth/TokenValidation");

router.get("/get-set-menu-with-food-and-type", checkToken, getSetMenuAndMenuDetailFoodAndFoodAndType);
router.get("/", checkToken, getSetMenus);

module.exports = router;