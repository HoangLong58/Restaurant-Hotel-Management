const { getAllDistrictsByCityId } = require("../controller/DistrictController");
const { checkToken } = require("../auth/TokenValidation");

const router = require("express").Router();

router.get("/get-all-districts-by-city-id/:cityId", checkToken, getAllDistrictsByCityId);

module.exports = router;