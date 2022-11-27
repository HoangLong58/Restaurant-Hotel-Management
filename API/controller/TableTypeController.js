const { getTableTypes, getAllTableTypes, getQuantityTableTypes, findTableTypeByIdOrName, findTableTypeById, createTableType, updateTableTypeById, updateTableTypeState, deleteTableType, findTableTypeInTableBookingOrder } = require("../service/TableTypeService");
const { createLogAdmin } = require("../utils/utils");

module.exports = {
    getTableTypes: async (req, res) => {
        try {
            const result = await getTableTypes();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found"
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Get all table types successfully!",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getTableTypes",
                error: err
            });
        }
    },

    // ADMIN: Quản lý Loại bàn - Nhà hàng
    getAllTableTypes: async (req, res) => {
        try {
            const result = await getAllTableTypes();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Lấy table types thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getAllTableTypes",
                error: err
            });
        }
    },
    getQuantityTableType: async (req, res) => {
        try {
            const result = await getQuantityTableTypes();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Lấy quantity table types thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getQuantityTableTypes",
                error: err
            });
        }
    },
    findTableTypeByIdOrName: async (req, res) => {
        const search = req.params.search;
        try {
            const result = await findTableTypeByIdOrName(search);
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Tìm table types thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findTableTypeByIdOrName",
                error: err
            });
        }
    },
    findTableTypeById: async (req, res) => {
        const tableTypeId = req.body.tableTypeId;
        try {
            const result = await findTableTypeById(tableTypeId);
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Tìm table types thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findTableTypeById",
                error: err
            });
        }
    },
    createTableType: async (req, res) => {
        const tableTypeName = req.body.tableTypeName;
        const TableTypeState = 0;
        if (!tableTypeName) {
            return res.status(400).json({
                status: "fail",
                message: "Tên loại bàn không hợp lệ!"
            });
        }
        try {
            const createTableTypeRes = await createTableType(tableTypeName, TableTypeState);
            if (!createTableTypeRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't create table type!"
                });
            }

            createLogAdmin(req, res, " vừa thêm Loại bàn mới tên: " + tableTypeName, "CREATE").then(() => {
                // Success
                return res.status(200).json({
                    status: "success",
                    message: "Thêm loại bàn mới thành công!"
                });
            });

        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when create table type!",
                error: err
            });
        }
    },
    updateTableType: async (req, res) => {
        const tableTypeName = req.body.tableTypeName;
        const tableTypeId = req.body.tableTypeId;
        if (!tableTypeName) {
            return res.status(400).json({
                status: "fail",
                message: "Tên loại bàn không hợp lệ!"
            });
        }
        if (!tableTypeId || !Number.isInteger(tableTypeId) || tableTypeId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã loại bàn không hợp lệ!"
            });
        }
        // Tìm và kiểm tra tồn tại
        try {
            const TableTypeRes = await findTableTypeById(tableTypeId);
            if (!TableTypeRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find device booking type!"
                });
            }
            // Cập nhật
            try {
                const updateTableTypeRes = await updateTableTypeById(tableTypeName, tableTypeId);
                if (!updateTableTypeRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't update table type!"
                    });
                }

                createLogAdmin(req, res, " vừa cập nhật Loại bàn mã: " + tableTypeId, "UPDATE").then(() => {
                    // Success
                    return res.status(200).json({
                        status: "success",
                        message: "Cập nhật loại bàn thành công!"
                    });
                });

            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when update table type!",
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
    // Disable loại bàn
    updateTableTypeStateTo1: async (req, res) => {
        const tableTypeId = req.body.tableTypeId;
        if (!tableTypeId || !Number.isInteger(tableTypeId) || tableTypeId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã loại bàn không hợp lệ!"
            });
        }
        // Tìm và kiểm tra tồn tại
        try {
            const TableTypeRes = await findTableTypeById(tableTypeId);
            if (!TableTypeRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find device booking type!"
                });
            }
            // Kiểm tra state hiện tại
            const stateRes = TableTypeRes.party_booking_type_state;
            if (stateRes === 1) {
                return res.status(400).json({
                    status: "fail",
                    message: "Loại thiết bị này đã bị vô hiệu trước đó!"
                });
            }
            // Cập nhật state 0 - 1: Vô hiệu
            const TableTypeState = 1;
            try {
                const updateTableTypeRes = await updateTableTypeState(TableTypeState, tableTypeId);
                if (!updateTableTypeRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't update table type!"
                    });
                }

                createLogAdmin(req, res, " vừa Vô hiệu hóa Loại bàn mã: " + tableTypeId, "UPDATE").then(() => {
                    // Success
                    return res.status(200).json({
                        status: "success",
                        message: "Vô hiệu hóa loại bàn thành công!"
                    });
                });

            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when update table type!",
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
    // Mở khóa loại bàn
    updateTableTypeStateTo0: async (req, res) => {
        const tableTypeId = req.body.tableTypeId;
        if (!tableTypeId || !Number.isInteger(tableTypeId) || tableTypeId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã loại bàn không hợp lệ!"
            });
        }
        // Tìm và kiểm tra tồn tại
        try {
            const TableTypeRes = await findTableTypeById(tableTypeId);
            if (!TableTypeRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find device booking type!"
                });
            }
            // Kiểm tra state hiện tại
            const stateRes = TableTypeRes.party_booking_type_state;
            if (stateRes === 0) {
                return res.status(400).json({
                    status: "fail",
                    message: "Loại thiết bị này vẫn đang hoạt động!"
                });
            }
            // Cập nhật state 1 - 0: Mở khóa
            const TableTypeState = 0;
            try {
                const updateTableTypeRes = await updateTableTypeState(TableTypeState, tableTypeId);
                if (!updateTableTypeRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't update table type!"
                    });
                }

                createLogAdmin(req, res, " vừa Mở khóa Loại bàn mã: " + tableTypeId, "UPDATE").then(() => {
                    // Success
                    return res.status(200).json({
                        status: "success",
                        message: "Mở khóa loại bàn thành công!"
                    });
                });

            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when update table type!",
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
    deleteTableType: async (req, res) => {
        const tableTypeId = parseInt(req.params.tableTypeId);
        if (!tableTypeId || !Number.isInteger(tableTypeId) || tableTypeId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã loại bàn không hợp lệ!"
            });
        }
        // Tìm và kiểm tra hợp lệ
        try {
            const TableTypeRes = await findTableTypeById(tableTypeId);
            if (!TableTypeRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find table type!"
                });
            }
            // Tiến hành xóa loại bàn
            try {
                const deleteTableTypeRes = await deleteTableType(tableTypeId);
                if (!deleteTableTypeRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't delete table type!"
                    });
                }

                createLogAdmin(req, res, " vừa xóa Loại bàn mã: " + tableTypeId, "DELETE").then(() => {
                    // Success
                    return res.status(200).json({
                        status: "success",
                        message: "Xóa loại bàn thành công!"
                    });
                });

            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when delete table type!",
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
    // ADMIN: QUẢN LÝ ĐẶT BÀN - THỐNG KÊ THEO LOẠI
    findAllTableTypeInTableBookingOrder: async (req, res) => {
        try {
            const result = await findTableTypeInTableBookingOrder();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Tìm table types trong table booking order thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findTableTypeInTableBookingOrder",
                error: err
            });
        }
    },
}