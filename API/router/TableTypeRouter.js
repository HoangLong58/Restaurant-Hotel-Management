
const { getTableTypes, getQuantityTableType, getAllTableTypes, findTableTypeByIdOrName, findTableTypeById, createTableType, updateTableTypeStateTo1, updateTableTypeStateTo0, updateTableType, deleteTableType, findAllTableTypeInTableBookingOrder } = require("../controller/TableTypeController");
const router = require("express").Router();

const { checkToken } = require("../auth/TokenValidation");

router.get("/get-table-type-in-table-booking-order", checkToken, findAllTableTypeInTableBookingOrder);
router.get("/quantity", checkToken, getQuantityTableType); //
router.get("/get-all-table-types", checkToken, getAllTableTypes);    //
router.get("/:search", checkToken, findTableTypeByIdOrName);   //
router.get("/", checkToken, getTableTypes);

router.post("/find-table-type-by-id", checkToken, findTableTypeById); //
router.post("/", checkToken, createTableType); //
// STATE: 0: đang hoạt động, 1: Đang bị khóa (Không thể tìm kiếm ở Client)
router.put("/update-table-type-state-to-one", checkToken, updateTableTypeStateTo1);  //
router.put("/update-table-type-state-to-zero", checkToken, updateTableTypeStateTo0);  //
router.put("/", checkToken, updateTableType);  //
router.delete("/:tableTypeId", checkToken, deleteTableType);  //

module.exports = router;