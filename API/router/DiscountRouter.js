const { getDiscounts, getDiscountById, getDiscountByDiscountCode, updateDiscountState } = require("../controller/DiscountController");
const { checkToken } = require("../auth/TokenValidation");

const router = require("express").Router();

router.get("/", checkToken, getDiscounts);
router.get("/:discountId", checkToken, getDiscountById);

router.put("/update-state", checkToken, updateDiscountState);

router.post("/get-discount-by-code", checkToken, getDiscountByDiscountCode);


module.exports = router;