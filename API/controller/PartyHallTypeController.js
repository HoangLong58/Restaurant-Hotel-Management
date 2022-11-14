const { getPartyHallTypes, getAllPartyHallTypes, getQuantityPartyHallTypes, findPartyHallTypeByIdOrName, findPartyHallTypeById, createPartyHallType, updatePartyHallTypeById, updatePartyHallTypeState, deletePartyHallType } = require("../service/PartyHallTypeService");
const { createLogAdmin } = require("../utils/utils");

module.exports = {
    getPartyHallTypes: async (req, res) => {
        try {
            const result = await getPartyHallTypes();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found"
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Get all party hall types successfully!",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getPartyHallTypes",
                error: err
            });
        }
    },

    // ADMIN: Quản lý Loại Sảnh tiệc - Nhà hàng
    getAllPartyHallTypes: async (req, res) => {
        try {
            const result = await getAllPartyHallTypes();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Lấy party hall types thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getAllPartyHallTypes",
                error: err
            });
        }
    },
    getQuantityPartyHallType: async (req, res) => {
        try {
            const result = await getQuantityPartyHallTypes();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Lấy quantity party hall types thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getQuantityPartyHallTypes",
                error: err
            });
        }
    },
    findPartyHallTypeByIdOrName: async (req, res) => {
        const search = req.params.search;
        try {
            const result = await findPartyHallTypeByIdOrName(search);
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Tìm party hall types thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findPartyHallTypeByIdOrName",
                error: err
            });
        }
    },
    findPartyHallTypeById: async (req, res) => {
        const partyHallTypeId = req.body.partyHallTypeId;
        try {
            const result = await findPartyHallTypeById(partyHallTypeId);
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Tìm party hall types thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findPartyHallTypeById",
                error: err
            });
        }
    },
    createPartyHallType: async (req, res) => {
        const partyHallTypeName = req.body.partyHallTypeName;
        const partyHallTypeState = 0;
        if (!partyHallTypeName) {
            return res.status(400).json({
                status: "fail",
                message: "Tên loại Sảnh tiệc không hợp lệ!"
            });
        }
        try {
            const createPartyHallTypeRes = await createPartyHallType(partyHallTypeName, partyHallTypeState);
            if (!createPartyHallTypeRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't create party hall type!"
                });
            }

            createLogAdmin(req, res, " vừa thêm Loại Sảnh tiệc mới tên: " + partyHallTypeName, "CREATE").then(() => {
                // Success
                return res.status(200).json({
                    status: "success",
                    message: "Thêm loại Sảnh tiệc mới thành công!"
                });
            });

        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when create party hall type!",
                error: err
            });
        }
    },
    updatePartyHallType: async (req, res) => {
        const partyHallTypeName = req.body.partyHallTypeName;
        const partyHallTypeId = req.body.partyHallTypeId;
        if (!partyHallTypeName) {
            return res.status(400).json({
                status: "fail",
                message: "Tên loại Sảnh tiệc không hợp lệ!"
            });
        }
        if (!partyHallTypeId || !Number.isInteger(partyHallTypeId) || partyHallTypeId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã loại Sảnh tiệc không hợp lệ!"
            });
        }
        // Tìm và kiểm tra tồn tại
        try {
            const partyHallTypeRes = await findPartyHallTypeById(partyHallTypeId);
            if (!partyHallTypeRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find device booking type!"
                });
            }
            // Cập nhật
            try {
                const updatePartyHallTypeRes = await updatePartyHallTypeById(partyHallTypeName, partyHallTypeId);
                if (!updatePartyHallTypeRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't update party hall type!"
                    });
                }

                createLogAdmin(req, res, " vừa cập nhật Loại Sảnh tiệc mã: " + partyHallTypeId, "UPDATE").then(() => {
                    // Success
                    return res.status(200).json({
                        status: "success",
                        message: "Cập nhật loại Sảnh tiệc thành công!"
                    });
                });

            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when update party hall type!",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when find party hall type!",
                error: err
            });
        }
    },
    // Disable loại Sảnh tiệc
    updatePartyHallTypeStateTo1: async (req, res) => {
        const partyHallTypeId = req.body.partyHallTypeId;
        if (!partyHallTypeId || !Number.isInteger(partyHallTypeId) || partyHallTypeId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã loại Sảnh tiệc không hợp lệ!"
            });
        }
        // Tìm và kiểm tra tồn tại
        try {
            const partyHallTypeRes = await findPartyHallTypeById(partyHallTypeId);
            if (!partyHallTypeRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find device booking type!"
                });
            }
            // Kiểm tra state hiện tại
            const stateRes = partyHallTypeRes.party_booking_type_state;
            if (stateRes === 1) {
                return res.status(400).json({
                    status: "fail",
                    message: "Loại Sảnh tiệc này đã bị vô hiệu trước đó!"
                });
            }
            // Cập nhật state 0 - 1: Vô hiệu
            const partyHallTypeState = 1;
            try {
                const updatePartyHallTypeRes = await updatePartyHallTypeState(partyHallTypeState, partyHallTypeId);
                if (!updatePartyHallTypeRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't update party hall type!"
                    });
                }

                createLogAdmin(req, res, " vừa Vô hiệu hóa Loại Sảnh tiệc mã: " + partyHallTypeId, "UPDATE").then(() => {
                    // Success
                    return res.status(200).json({
                        status: "success",
                        message: "Vô hiệu hóa loại Sảnh tiệc thành công!"
                    });
                });

            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when update party hall type!",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when find party hall type!",
                error: err
            });
        }
    },
    // Mở khóa loại Sảnh tiệc
    updatePartyHallTypeStateTo0: async (req, res) => {
        const partyHallTypeId = req.body.partyHallTypeId;
        if (!partyHallTypeId || !Number.isInteger(partyHallTypeId) || partyHallTypeId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã loại Sảnh tiệc không hợp lệ!"
            });
        }
        // Tìm và kiểm tra tồn tại
        try {
            const partyHallTypeRes = await findPartyHallTypeById(partyHallTypeId);
            if (!partyHallTypeRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find device booking type!"
                });
            }
            // Kiểm tra state hiện tại
            const stateRes = partyHallTypeRes.party_booking_type_state;
            if (stateRes === 0) {
                return res.status(400).json({
                    status: "fail",
                    message: "Loại Sảnh tiệc này vẫn đang hoạt động!"
                });
            }
            // Cập nhật state 1 - 0: Mở khóa
            const partyHallTypeState = 0;
            try {
                const updatePartyHallTypeRes = await updatePartyHallTypeState(partyHallTypeState, partyHallTypeId);
                if (!updatePartyHallTypeRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't update party hall type!"
                    });
                }

                createLogAdmin(req, res, " vừa Mở khóa Loại Sảnh tiệc mã: " + partyHallTypeId, "UPDATE").then(() => {
                    // Success
                    return res.status(200).json({
                        status: "success",
                        message: "Mở khóa loại Sảnh tiệc thành công!"
                    });
                });

            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when update party hall type!",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when find party hall type!",
                error: err
            });
        }
    },
    deletePartyHallType: async (req, res) => {
        const partyHallTypeId = parseInt(req.params.partyHallTypeId);
        if (!partyHallTypeId || !Number.isInteger(partyHallTypeId) || partyHallTypeId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã loại Sảnh tiệc không hợp lệ!"
            });
        }
        // Tìm và kiểm tra hợp lệ
        try {
            const partyHallTypeRes = await findPartyHallTypeById(partyHallTypeId);
            if (!partyHallTypeRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find party hall type!"
                });
            }
            // Tiến hành xóa loại Sảnh tiệc
            try {
                const deletePartyHallTypeRes = await deletePartyHallType(partyHallTypeId);
                if (!deletePartyHallTypeRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't delete party hall type!"
                    });
                }

                createLogAdmin(req, res, " vừa xóa Loại Sảnh tiệc mã: " + partyHallTypeId, "DELETE").then(() => {
                    // Success
                    return res.status(200).json({
                        status: "success",
                        message: "Xóa loại Sảnh tiệc thành công!"
                    });
                });

            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when delete party hall type!",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when find party hall type!",
                error: err
            });
        }
    }
}