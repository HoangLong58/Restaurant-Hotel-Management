const { getRoomTypes, getQuantityRoomTypes, findRoomTypeByIdOrName, findRoomTypeById, createRoomType, deleteRoomType, updateRoomTypeById, findRoomTypeInRoomBookingOrder } = require("../service/RoomTypeService");
const { createLogAdmin } = require("../utils/utils");

module.exports = {
    // ADMIN: Quản lý Loại phòng - Khách sạn
    getRoomTypes: async (req, res) => {
        try {
            const result = await getRoomTypes();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Lấy room types thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getRoomTypes",
                error: err
            });
        }
    },
    getQuantityRoomType: async (req, res) => {
        try {
            const result = await getQuantityRoomTypes();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Lấy quantity room types thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getQuantityRoomTypes",
                error: err
            });
        }
    },
    findRoomTypeByIdOrName: async (req, res) => {
        const search = req.params.search;
        try {
            const result = await findRoomTypeByIdOrName(search);
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Tìm room types thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findRoomTypeByIdOrName",
                error: err
            });
        }
    },
    findRoomTypeById: async (req, res) => {
        const roomTypeId = req.body.roomTypeId;
        try {
            const result = await findRoomTypeById(roomTypeId);
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Tìm room types thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findRoomTypeById",
                error: err
            });
        }
    },
    createRoomType: async (req, res) => {
        const roomTypeName = req.body.roomTypeName;
        const roomTypeVoteTotal = 0;
        if (!roomTypeName) {
            return res.status(400).json({
                status: "fail",
                message: "Tên Loại phòng không hợp lệ!"
            });
        }
        try {
            const createRoomTypeRes = await createRoomType(roomTypeName, roomTypeVoteTotal);
            if (!createRoomTypeRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't create room type!"
                });
            }

            createLogAdmin(req, res, " vừa tạo Room type mới tên: " + roomTypeName, "CREATE").then(() => {
                // Success
                return res.status(200).json({
                    status: "success",
                    message: "Thêm Loại phòng mới thành công!"
                });
            });

        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when create room type!",
                error: err
            });
        }
    },
    updateRoomType: async (req, res) => {
        const roomTypeName = req.body.roomTypeName;
        const roomTypeId = req.body.roomTypeId;
        if (!roomTypeName) {
            return res.status(400).json({
                status: "fail",
                message: "Tên Loại phòng không hợp lệ!"
            });
        }
        if (!roomTypeId || !Number.isInteger(roomTypeId) || roomTypeId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã Loại phòng không hợp lệ!"
            });
        }
        try {
            const roomTypeRes = await findRoomTypeById(roomTypeId);
            if (!roomTypeRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find room type!"
                });
            }
            try {
                const updateRoomTypeRes = await updateRoomTypeById(roomTypeName, roomTypeId);
                if (!updateRoomTypeRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't update room type!"
                    });
                }

                createLogAdmin(req, res, " vừa cập nhật Room type mã: " + roomTypeId, "UPDATE").then(() => {
                    // Success
                    return res.status(200).json({
                        status: "success",
                        message: "Cập nhật Loại phòng mới thành công!"
                    });
                });

            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when update room type!",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when find room type!",
                error: err
            });
        }
    },
    deleteRoomType: async (req, res) => {
        const roomTypeId = parseInt(req.params.roomTypeId);
        if (!roomTypeId || !Number.isInteger(roomTypeId) || roomTypeId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã Loại phòng không hợp lệ!"
            });
        }
        try {
            const roomTypeRes = await findRoomTypeById(roomTypeId);
            if (!roomTypeRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find room type!"
                });
            }
            try {
                const deleteRoomTypeRes = await deleteRoomType(roomTypeId);
                if (!deleteRoomTypeRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't delete room type!"
                    });
                }

                createLogAdmin(req, res, " vừa xóa Room type mã: " + roomTypeId, "DELETE").then(() => {
                    // Success
                    return res.status(200).json({
                        status: "success",
                        message: "Xóa Loại phòng thành công!"
                    });
                });

            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when delete room type!",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when find room type!",
                error: err
            });
        }
    },

    // ADMIN: QUẢN LÝ ĐẶT PHÒNG - THỐNG KÊ THEO LOẠI
    findAllRoomTypeInRoomBookingOrder: async (req, res) => {
        try {
            const result = await findRoomTypeInRoomBookingOrder();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Tìm room types trong room booking order thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findRoomTypeInRoomBookingOrder",
                error: err
            });
        }
    },
}