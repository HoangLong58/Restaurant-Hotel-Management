const { findRoomTypeById } = require("../service/RoomTypeService");
const { getAllServiceDetailByRoomTypeId, findServiceDetailByServiceDetailId, getAllServiceDetailByServiceDetailId, deleteServiceDetailByServiceDetailId, createDetailService } = require("../service/ServiceDetailService");
const { findServiceById } = require("../service/ServiceService");
const { createLogAdmin } = require("../utils/utils");

module.exports = {
    // ADMIN: Quản lý Loại phòng - Thêm dịch vụ
    getAllServiceDetailByRoomTypeId: async (req, res) => {
        const roomTypeId = parseInt(req.params.roomTypeId);
        if (!roomTypeId || !Number.isInteger(roomTypeId) || roomTypeId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã loại phòng không hợp lệ!"
            });
        }
        // Kiểm tra có Room Type không?
        try {
            const roomTypeRes = await findRoomTypeById(roomTypeId);
            if (!roomTypeRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!"
                });
            }
            // Lấy dịch vụ chi tiết cho room type
            try {
                const result = await getAllServiceDetailByRoomTypeId(roomTypeId);
                if (!result) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Record not found!",
                        data: []
                    });
                }
                return res.status(200).json({
                    status: "success",
                    message: "Lấy service detail by room type id thành công",
                    data: result
                });
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Lỗi getAllServiceDetailByRoomTypeId",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findRoomTypeById",
                error: err
            });
        }
    },
    deleteServiceDetail: async (req, res) => {
        const serviceDetailId = parseInt(req.params.serviceDetailId);
        if (!serviceDetailId || !Number.isInteger(serviceDetailId) || serviceDetailId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã Chi tiết Dịch vụ không hợp lệ!"
            });
        }
        // Kiểm tra có Service detail không?
        try {
            const serviceDetailRes = await getAllServiceDetailByServiceDetailId(serviceDetailId);
            if (!serviceDetailRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!"
                });
            }
            // Lấy tên dịch vụ và loại phòng để ghi log
            const serviceName = serviceDetailRes.service_name;
            const roomTypeName = serviceDetailRes.room_type_name;
            // Lấy dịch vụ chi tiết cho room type
            try {
                const result = await deleteServiceDetailByServiceDetailId(serviceDetailId);
                if (!result) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't delete service detail!"
                    });
                }

                createLogAdmin(req, res, " vừa xóa Dịch vụ " + serviceName + " khỏi " + roomTypeName + " với mã chi tiết: " + serviceDetailId, "DELETE").then(() => {
                    // Success
                    return res.status(200).json({
                        status: "success",
                        message: "Xóa Dịch vụ thành công!"
                    });
                });

            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Lỗi deleteServiceDetailByServiceDetailId",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getAllServiceDetailByServiceDetailId",
                error: err
            });
        }
    },
    createServiceDetailByListServiceId: async (req, res) => {
        const serviceListId = req.body.serviceListId;
        const roomTypeId = req.body.roomTypeId;
        if (serviceListId.length === 0) {
            return res.status(400).json({
                status: "fail",
                message: "Bạn chưa chọn Dịch vụ để thêm vào Loại phòng này!"
            });
        }
        if (!roomTypeId || !Number.isInteger(roomTypeId) || roomTypeId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã Loại phòng không hợp lệ!"
            });
        }
        // Kiểm tra tồn tại room type
        try {
            const roomTypeRes = await findRoomTypeById(roomTypeId);
            if (!roomTypeRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find room type!"
                });
            }
            var roomTypeName = roomTypeRes.room_type_name;
            // Lặp từng service id để kiểm tra tồn tại
            var serviceNameStringLog = "";
            for (var i = 0; i < serviceListId.length; i++) {
                const serviceId = parseInt(serviceListId[i]);
                if (!serviceId || !Number.isInteger(serviceId) || serviceId < 0) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Mã Dịch vụ không hợp lệ!"
                    });
                }
                // Kiểm tra service tồn tại
                try {
                    const serviceRes = await findServiceById(serviceId);
                    if (!serviceRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't find service!"
                        });
                    }
                    serviceNameStringLog += serviceRes.service_name + ", ";

                    // Tạo service detail
                    const serviceDetailName = "All trip"
                    try {
                        const createServiceDetailRes = await createDetailService(serviceDetailName, roomTypeId, serviceId);
                        if (!createServiceDetailRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't create service detail!"
                            });
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Lỗi createDetailService",
                            error: err
                        });
                    }
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Lỗi findServiceById",
                        error: err
                    });
                }
            }

            createLogAdmin(req, res, " vừa Thêm Dịch vụ: " + serviceNameStringLog + " vào " + roomTypeName, "CREATE").then(() => {
                // Success
                return res.status(200).json({
                    status: "success",
                    message: "Thêm Dịch vụ thành công!"
                });
            });

        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findRoomTypeById",
                error: err
            });
        }
    }
}