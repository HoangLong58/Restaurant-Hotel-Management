const { getAllWardsByDistrictId } = require("../controller/WardController");
const { checkToken } = require("../auth/TokenValidation");

const router = require("express").Router();

router.get("/get-all-wards-by-district-id/:districtId", checkToken, getAllWardsByDistrictId);

module.exports = router;