
const { getFoodsAndType } = require("../controller/FoodController");
const router = require("express").Router();

const { checkToken } = require("../auth/TokenValidation");

router.get("/", checkToken, getFoodsAndType);

module.exports = router;