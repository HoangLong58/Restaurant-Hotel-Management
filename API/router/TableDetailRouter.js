
const { findAllTableDetailByTableBookingOrderId, createTableDetailByFoodListAndTableBookingOrderId, updateTableDetailQuantityByTableDetailId } = require("../controller/TableDetailController");
const router = require("express").Router();

const { checkToken } = require("../auth/TokenValidation");

router.get("/get-all-table-detail-by-table-booking-order-id/:tableBookingOrderId", checkToken, findAllTableDetailByTableBookingOrderId); //

router.post("/create-table-detail-by-list-food", checkToken, createTableDetailByFoodListAndTableBookingOrderId); //

router.put("/update-table-detail-quantity-by-table-detail-id", checkToken, updateTableDetailQuantityByTableDetailId); //

module.exports = router;