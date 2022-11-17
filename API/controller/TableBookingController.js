const { findFloorById } = require("../service/FloorService");
const { getTableBookingOrderByTableBookingId } = require("../service/TableBookingOrderService");
const { getTableBookings, getTableBookingWithTypeAndFloor, updateTableBookingState, getAllTableBookings, getQuantityTableBookings, findTableBookingByIdOrName, findTableBookingById, createTableBooking, updateTableBookingById, deleteTableBooking } = require("../service/TableBookingService");
const { findTableTypeById } = require("../service/TableTypeService");
const { createLogAdmin } = require("../utils/utils");

module.exports = {
    getTableBookings: async (req, res) => {
        try {
            const result = await getTableBookings();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found"
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Get all table bookings successfully!",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getTableBookings",
                error: err
            });
        }
    },
    getTableBookingWithTypeAndFloor: async (req, res) => {
        try {
            const result = await getTableBookingWithTypeAndFloor();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found"
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Get all table bookings with type and floor successfully!",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getTableBookingWithTypeAndFloor",
                error: err
            });
        }
    },
    findTableBookings: async (req, res) => {
        const dateBooking = req.body.dateBooking;
        const timeBooking = req.body.timeBooking;
        const quantityBooking = req.body.quantityBooking;
        const tableTypeId = req.body.tableTypeId;

        if (!dateBooking) {
            return res.status(400).json({
                status: "fail",
                message: "Bạn chưa chọn Ngày Đặt bàn!"
            });
        }
        if (!timeBooking) {
            return res.status(400).json({
                status: "fail",
                message: "Bạn chưa chọn Giờ đặt bàn!"
            });
        }
        if (!quantityBooking) {
            return res.status(400).json({
                status: "fail",
                message: "Bạn chưa chọn Số lượng khách!"
            });
        }
        if (!tableTypeId) {
            return res.status(400).json({
                status: "fail",
                message: "Bạn chưa chọn Loại bàn!"
            });
        }
        const finalResultArray = [];
        try {
            const tableBookingResult = await getTableBookingWithTypeAndFloor();
            if (!tableBookingResult) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found"
                });
            }
            var dateBookingReq = new Date(dateBooking);
            for (var i = 0; i < tableBookingResult.length; i++) {
                // Check date here
                try {
                    const tableBookingOrderRes = await getTableBookingOrderByTableBookingId(tableBookingResult[i].table_booking_id);
                    if (!tableBookingOrderRes) {
                        //  Check table type
                        if (tableBookingResult[i].table_type_id !== tableTypeId) {
                            continue;
                        }
                        finalResultArray.push(tableBookingResult[i]);
                    } else {
                        var checkInDateBookingOrder = new Date(tableBookingOrderRes.table_booking_order_checkin_date);
                        if (dateBookingReq.getFullYear() === checkInDateBookingOrder.getFullYear()
                            && dateBookingReq.getMonth() === checkInDateBookingOrder.getMonth()
                            && dateBookingReq.getDate() === checkInDateBookingOrder.getDate()
                        ) {
                            continue;
                        }
                        //  Check table type
                        if (tableBookingResult[i].table_type_id !== tableTypeId) {
                            continue;
                        }
                        finalResultArray.push(tableBookingResult[i]);
                    }
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Lỗi getTableBookingWithTypeAndFloor",
                        error: err
                    });
                }
            }
            // Success
            if (finalResultArray.length > 0) {
                res.status(200).json({
                    status: "success",
                    message: "Đã tìm được bàn phù hợp!",
                    data: finalResultArray
                });
            } else {
                res.status(200).json({
                    status: "success",
                    message: "Không tìm thấy bàn phù hợp!",
                    data: finalResultArray
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getTableBookingWithTypeAndFloor",
                error: err
            });
        }
    },
    updateTableBookingState: async (req, res) => {
        const tableBookingId = req.body.tableBookingId;
        const tableBookingState = req.body.tableBookingState;
        try {
            const result = await updateTableBookingState(tableBookingId, tableBookingState);
            if (result) {
                return res.status(200).json({
                    status: "success",
                    message: "Update table booking state successfully!",
                });
            } else {
                return res.status(200).json({
                    status: "fail",
                    message: "Update table booking state fail!",
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when update table booking state!",
                error: err
            });
        }
    },
    // ADMIN: Quản lý Bàn ăn - Nhà hàng
    getAllTableBookings: async (req, res) => {
        try {
            const result = await getAllTableBookings();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Lấy table bookings thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getAllTableBookings",
                error: err
            });
        }
    },
    getQuantityTableBooking: async (req, res) => {
        try {
            const result = await getQuantityTableBookings();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Lấy quantity table bookings thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getQuantityTableBookings",
                error: err
            });
        }
    },
    findTableBookingByIdOrName: async (req, res) => {
        const search = req.params.search;
        try {
            const result = await findTableBookingByIdOrName(search);
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Tìm table bookings thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findTableBookingByIdOrName",
                error: err
            });
        }
    },
    findTableBookingById: async (req, res) => {
        const tableBookingId = req.body.tableBookingId;
        try {
            const result = await findTableBookingById(tableBookingId);
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Tìm table bookings thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findTableBookingById",
                error: err
            });
        }
    },
    createTableBooking: async (req, res) => {
        const tableBookingName = req.body.tableBookingName;
        const tableBookingState = 0;
        const tableTypeId = req.body.tableTypeId;
        const floorId = req.body.floorId;
        if (!tableBookingName) {
            return res.status(400).json({
                status: "fail",
                message: "Tên Bàn ăn không hợp lệ!"
            });
        }
        if (!tableTypeId || !Number.isInteger(tableTypeId) || tableTypeId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã Loại bàn ăn không hợp lệ!"
            });
        }
        if (!floorId || !Number.isInteger(floorId) || floorId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã Tầng không hợp lệ!"
            });
        }
        // Kiểm tra table type tồn tại
        try {
            const tableTypeRes = await findTableTypeById(tableTypeId);
            if (!tableTypeRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find table type!"
                });
            }
            // Kiểm tra floor tồn tại
            try {
                const floorRes = await findFloorById(floorId);
                if (!floorRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't find floor!"
                    });
                }

                // Tạo bàn ăn mới
                try {
                    const createTableBookingRes = await createTableBooking(tableBookingName, tableBookingState, tableTypeId, floorId);
                    if (!createTableBookingRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't create table booking!"
                        });
                    }

                    createLogAdmin(req, res, " vừa thêm Bàn ăn mới tên: " + tableBookingName, "CREATE").then(() => {
                        // Success
                        return res.status(200).json({
                            status: "success",
                            message: "Thêm Bàn ăn mới thành công!"
                        });
                    });

                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when create table booking!",
                        error: err
                    });
                }
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when find floor!",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when find table type!",
                error: err
            });
        }
    },
    updateTableBooking: async (req, res) => {
        const tableBookingName = req.body.tableBookingName;
        const tableTypeId = req.body.tableTypeId;
        const floorId = req.body.floorId;
        const tableBookingId = req.body.tableBookingId;
        if (!tableBookingName) {
            return res.status(400).json({
                status: "fail",
                message: "Tên Bàn ăn không hợp lệ!"
            });
        }
        if (!tableTypeId || !Number.isInteger(tableTypeId) || tableTypeId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã Loại bàn ăn không hợp lệ!"
            });
        }
        if (!floorId || !Number.isInteger(floorId) || floorId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã Tầng không hợp lệ!"
            });
        }
        if (!tableBookingId || !Number.isInteger(tableBookingId) || tableBookingId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã Bàn ăn không hợp lệ!"
            });
        }
        // Kiểm tra table type tồn tại
        try {
            const tableTypeRes = await findTableTypeById(tableTypeId);
            if (!tableTypeRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find table type!"
                });
            }
            // Kiểm tra floor tồn tại
            try {
                const floorRes = await findFloorById(floorId);
                if (!floorRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't find floor!"
                    });
                }
                // Kiểm tra bàn ăn tồn tại
                try {
                    const tableBookingRes = await findTableBookingById(tableBookingId);
                    if (!tableBookingRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't find table booking!"
                        });
                    }
                    try {
                        const updateTableBookingRes = await updateTableBookingById(tableBookingName, tableTypeId, floorId, tableBookingId);
                        if (!updateTableBookingRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't update table booking!"
                            });
                        }

                        createLogAdmin(req, res, " vừa cập nhật Bàn ăn mã: " + tableBookingId, "UPDATE").then(() => {
                            // Success
                            return res.status(200).json({
                                status: "success",
                                message: "Cập nhật Bàn ăn mới thành công!"
                            });
                        });

                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when update table booking!",
                            error: err
                        });
                    }
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when find table booking!",
                        error: err
                    });
                }
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when find floor!",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when find table type!",
                error: err
            });
        }
    },
    deleteTableBooking: async (req, res) => {
        const tableBookingId = parseInt(req.params.tableBookingId);
        if (!tableBookingId || !Number.isInteger(tableBookingId) || tableBookingId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã Bàn ăn không hợp lệ!"
            });
        }
        // Kiểm tra bàn ăn tồn tại
        try {
            const TableBookingRes = await findTableBookingById(tableBookingId);
            if (!TableBookingRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find table booking!"
                });
            }
            try {
                const deleteTableBookingRes = await deleteTableBooking(tableBookingId);
                if (!deleteTableBookingRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't delete table booking!"
                    });
                }

                createLogAdmin(req, res, " vừa xóa Bàn ăn mã: " + tableBookingId, "DELETE").then(() => {
                    // Success
                    return res.status(200).json({
                        status: "success",
                        message: "Xóa Bàn ăn mới thành công!"
                    });
                });

            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when delete table booking!",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when find table booking!",
                error: err
            });
        }
    }
}