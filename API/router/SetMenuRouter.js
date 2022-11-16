
const { getSetMenus, getSetMenuAndMenuDetailFoodAndFoodAndType, getQuantitySetMenu, getAllSetMenus, findSetMenuByIdOrName, findSetMenuById, createSetMenu, updateSetMenuStateTo1, updateSetMenuStateTo0, updateSetMenu, deleteSetMenu } = require("../controller/SetMenuController");
const router = require("express").Router();

const { checkToken } = require("../auth/TokenValidation");

router.get("/get-set-menu-with-food-and-type", checkToken, getSetMenuAndMenuDetailFoodAndFoodAndType);
router.get("/quantity", checkToken, getQuantitySetMenu); //
router.get("/get-all-set-menus", checkToken, getAllSetMenus);    //
router.get("/:search", checkToken, findSetMenuByIdOrName);   //
router.get("/", checkToken, getSetMenus);

router.post("/find-set-menu-by-id", checkToken, findSetMenuById); //
router.post("/", checkToken, createSetMenu); //
// STATE: 0: đang hoạt động, 1: Đang bị khóa (Không thể tìm kiếm ở Client)
router.put("/update-set-menu-state-to-one", checkToken, updateSetMenuStateTo1);  //
router.put("/update-set-menu-state-to-zero", checkToken, updateSetMenuStateTo0);  //
router.put("/", checkToken, updateSetMenu);  //
router.delete("/:setMenuId", checkToken, deleteSetMenu);  //

module.exports = router;