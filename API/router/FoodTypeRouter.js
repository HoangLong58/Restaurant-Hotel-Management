
const { getFoodTypes } = require("../controller/FoodTypeController");
const router = require("express").Router();

const { checkToken } = require("../auth/TokenValidation");

router.get("/", checkToken, getFoodTypes);

module.exports = router;