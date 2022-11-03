const { getAllServiceDetailByRoomTypeId, deleteServiceDetail, createServiceDetailByListServiceId } = require("../controller/ServiceDetailController");
const { checkToken } = require("../auth/TokenValidation");

const router = require("express").Router();

router.get("/get-service-detail-by-room-type-id/:roomTypeId", checkToken, getAllServiceDetailByRoomTypeId); //
router.delete("/:serviceDetailId", checkToken, deleteServiceDetail); //

router.post("/create-service-detail-by-list-service-id", checkToken, createServiceDetailByListServiceId); //

module.exports = router;