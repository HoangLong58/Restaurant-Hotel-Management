const { getPartyBookingTypes, getAllPartyBookingTypes, getQuantityPartyBookingTypes, findPartyBookingTypeByIdOrName, findPartyBookingTypeById, createPartyBookingType, updatePartyBookingTypeById, updatePartyBookingTypeState, deletePartyBookingType, findPartyBookingTypeInPartyBookingOrder } = require("../service/PartyBookingTypeService");
const { createLogAdmin } = require("../utils/utils");

module.exports = {
    getPartyBookingTypes: async (req, res) => {
        try {
            const result = await getPartyBookingTypes();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found"
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Get all party booking types successfully!",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getPartyBookingTypes",
                error: err
            });
        }
    },

    // ADMIN: Quản lý Loại Đặt tiệc - Nhà hàng
    getAllPartyBookingTypes: async (req, res) => {
        try {
            const result = await getAllPartyBookingTypes();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Lấy party booking types thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getAllPartyBookingTypes",
                error: err
            });
        }
    },
    getQuantityPartyBookingType: async (req, res) => {
        try {
            const result = await getQuantityPartyBookingTypes();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Lấy quantity party booking types thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getQuantityPartyBookingTypes",
                error: err
            });
        }
    },
    findPartyBookingTypeByIdOrName: async (req, res) => {
        const search = req.params.search;
        try {
            const result = await findPartyBookingTypeByIdOrName(search);
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Tìm party booking types thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findPartyBookingTypeByIdOrName",
                error: err
            });
        }
    },
    findPartyBookingTypeById: async (req, res) => {
        const partyBookingTypeId = req.body.partyBookingTypeId;
        try {
            const result = await findPartyBookingTypeById(partyBookingTypeId);
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Tìm party booking types thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findPartyBookingTypeById",
                error: err
            });
        }
    },
    createPartyBookingType: async (req, res) => {
        const partyBookingTypeName = req.body.partyBookingTypeName;
        const partyBookingTypeState = 0;
        if (!partyBookingTypeName) {
            return res.status(400).json({
                status: "fail",
                message: "Tên loại đặt tiệc không hợp lệ!"
            });
        }
        try {
            const createPartyBookingTypeRes = await createPartyBookingType(partyBookingTypeName, partyBookingTypeState);
            if (!createPartyBookingTypeRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't create party booking type!"
                });
            }

            createLogAdmin(req, res, " vừa thêm Loại đặt tiệc mới tên: " + partyBookingTypeName, "CREATE").then(() => {
                // Success
                return res.status(200).json({
                    status: "success",
                    message: "Thêm loại đặt tiệc mới thành công!"
                });
            });

        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when create party booking type!",
                error: err
            });
        }
    },
    updatePartyBookingType: async (req, res) => {
        const partyBookingTypeName = req.body.partyBookingTypeName;
        const partyBookingTypeId = req.body.partyBookingTypeId;
        if (!partyBookingTypeName) {
            return res.status(400).json({
                status: "fail",
                message: "Tên loại đặt tiệc không hợp lệ!"
            });
        }
        if (!partyBookingTypeId || !Number.isInteger(partyBookingTypeId) || partyBookingTypeId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã loại đặt tiệc không hợp lệ!"
            });
        }
        // Tìm và kiểm tra tồn tại
        try {
            const partyBookingTypeRes = await findPartyBookingTypeById(partyBookingTypeId);
            if (!partyBookingTypeRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find device booking type!"
                });
            }
            // Cập nhật
            try {
                const updatePartyBookingTypeRes = await updatePartyBookingTypeById(partyBookingTypeName, partyBookingTypeId);
                if (!updatePartyBookingTypeRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't update party booking type!"
                    });
                }

                createLogAdmin(req, res, " vừa cập nhật Loại đặt tiệc mã: " + partyBookingTypeId, "UPDATE").then(() => {
                    // Success
                    return res.status(200).json({
                        status: "success",
                        message: "Cập nhật loại đặt tiệc thành công!"
                    });
                });

            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when update party booking type!",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when find party booking type!",
                error: err
            });
        }
    },
    // Disable loại đặt tiệc
    updatePartyBookingTypeStateTo1: async (req, res) => {
        const partyBookingTypeId = req.body.partyBookingTypeId;
        if (!partyBookingTypeId || !Number.isInteger(partyBookingTypeId) || partyBookingTypeId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã loại đặt tiệc không hợp lệ!"
            });
        }
        // Tìm và kiểm tra tồn tại
        try {
            const partyBookingTypeRes = await findPartyBookingTypeById(partyBookingTypeId);
            if (!partyBookingTypeRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find device booking type!"
                });
            }
            // Kiểm tra state hiện tại
            const stateRes = partyBookingTypeRes.party_booking_type_state;
            if (stateRes === 1) {
                return res.status(400).json({
                    status: "fail",
                    message: "Loại thiết bị này đã bị vô hiệu trước đó!"
                });
            }
            // Cập nhật state 0 - 1: Vô hiệu
            const partyBookingTypeState = 1;
            try {
                const updatePartyBookingTypeRes = await updatePartyBookingTypeState(partyBookingTypeState, partyBookingTypeId);
                if (!updatePartyBookingTypeRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't update party booking type!"
                    });
                }

                createLogAdmin(req, res, " vừa Vô hiệu hóa Loại đặt tiệc mã: " + partyBookingTypeId, "UPDATE").then(() => {
                    // Success
                    return res.status(200).json({
                        status: "success",
                        message: "Vô hiệu hóa loại đặt tiệc thành công!"
                    });
                });

            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when update party booking type!",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when find party booking type!",
                error: err
            });
        }
    },
    // Mở khóa loại đặt tiệc
    updatePartyBookingTypeStateTo0: async (req, res) => {
        const partyBookingTypeId = req.body.partyBookingTypeId;
        if (!partyBookingTypeId || !Number.isInteger(partyBookingTypeId) || partyBookingTypeId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã loại đặt tiệc không hợp lệ!"
            });
        }
        // Tìm và kiểm tra tồn tại
        try {
            const partyBookingTypeRes = await findPartyBookingTypeById(partyBookingTypeId);
            if (!partyBookingTypeRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find device booking type!"
                });
            }
            // Kiểm tra state hiện tại
            const stateRes = partyBookingTypeRes.party_booking_type_state;
            if (stateRes === 0) {
                return res.status(400).json({
                    status: "fail",
                    message: "Loại thiết bị này vẫn đang hoạt động!"
                });
            }
            // Cập nhật state 1 - 0: Mở khóa
            const partyBookingTypeState = 0;
            try {
                const updatePartyBookingTypeRes = await updatePartyBookingTypeState(partyBookingTypeState, partyBookingTypeId);
                if (!updatePartyBookingTypeRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't update party booking type!"
                    });
                }

                createLogAdmin(req, res, " vừa Mở khóa Loại đặt tiệc mã: " + partyBookingTypeId, "UPDATE").then(() => {
                    // Success
                    return res.status(200).json({
                        status: "success",
                        message: "Mở khóa loại đặt tiệc thành công!"
                    });
                });

            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when update party booking type!",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when find party booking type!",
                error: err
            });
        }
    },
    deletePartyBookingType: async (req, res) => {
        const partyBookingTypeId = parseInt(req.params.partyBookingTypeId);
        if (!partyBookingTypeId || !Number.isInteger(partyBookingTypeId) || partyBookingTypeId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã loại đặt tiệc không hợp lệ!"
            });
        }
        // Tìm và kiểm tra hợp lệ
        try {
            const partyBookingTypeRes = await findPartyBookingTypeById(partyBookingTypeId);
            if (!partyBookingTypeRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find party booking type!"
                });
            }
            // Tiến hành xóa loại đặt tiệc
            try {
                const deletePartyBookingTypeRes = await deletePartyBookingType(partyBookingTypeId);
                if (!deletePartyBookingTypeRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't delete party booking type!"
                    });
                }

                createLogAdmin(req, res, " vừa xóa Loại đặt tiệc mã: " + partyBookingTypeId, "DELETE").then(() => {
                    // Success
                    return res.status(200).json({
                        status: "success",
                        message: "Xóa loại đặt tiệc thành công!"
                    });
                });

            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when delete party booking type!",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when find party booking type!",
                error: err
            });
        }
    },
    // ADMIN: QUẢN LÝ ĐẶT PHÒNG - THỐNG KÊ THEO LOẠI
    findAllPartyBookingTypeInPartyBookingOrder: async (req, res) => {
        try {
            const result = await findPartyBookingTypeInPartyBookingOrder();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Tìm party booking types trong party booking order thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findPartyBookingTypeInPartyBookingOrder",
                error: err
            });
        }
    },
}