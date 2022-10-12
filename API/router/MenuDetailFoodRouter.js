
const { getMenuDetailFoods } = require("../controller/MenuDetailFoodController");
const router = require("express").Router();

const { checkToken } = require("../auth/TokenValidation");

router.get("/", checkToken, getMenuDetailFoods);

module.exports = router;