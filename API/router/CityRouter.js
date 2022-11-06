const { getAllCitys } = require("../controller/CityController");
const { checkToken } = require("../auth/TokenValidation");

const router = require("express").Router();

router.get("/get-all-citys", checkToken, getAllCitys);

module.exports = router;