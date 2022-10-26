const { getDiscounts, getDiscountById, getDiscountByDiscountCode, updateDiscountState, getAllDiscounts, getQuantityDiscount, findDiscountByIdOrName, findDiscountById, createDiscount, updateDiscountById, deleteDiscount } = require("../controller/DiscountController");
const { checkToken } = require("../auth/TokenValidation");

const router = require("express").Router();

// Quản lý Mã giảm giá
router.get("/quantity", checkToken, getQuantityDiscount);
router.get("/search/:search", checkToken, findDiscountByIdOrName);
router.get("/all-discount", checkToken, getAllDiscounts);

// User
router.get("/", checkToken, getDiscounts);
router.get("/:discountId", checkToken, getDiscountById);

router.put("/update-state", checkToken, updateDiscountState);

router.post("/get-discount-by-code", checkToken, getDiscountByDiscountCode);

// Quản lý Mã giảm giá
router.post("/find-discount-by-id", checkToken, findDiscountById);
router.post("/", checkToken, createDiscount);
router.put("/", checkToken, updateDiscountById);
router.delete("/:deviceTypeId", checkToken, deleteDiscount);

module.exports = router;