const { getAllPositions, getQuantityPositions, findPositionByIdOrName, findPositionById, createPosition, updatePositionById, deletePosition } = require("../service/PositionService");
const { createLogAdmin } = require("../utils/utils");

module.exports = {
    // ADMIN: Quản lý Chức vụ
    getAllPositions: async (req, res) => {
        try {
            const result = await getAllPositions();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Lấy positions thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getAllPositions",
                error: err
            });
        }
    },
    getQuantityPosition: async (req, res) => {
        try {
            const result = await getQuantityPositions();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Lấy quantity positions thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getQuantityPositions",
                error: err
            });
        }
    },
    findPositionByIdOrName: async (req, res) => {
        const search = req.params.search;
        try {
            const result = await findPositionByIdOrName(search);
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Tìm positions thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findPositionByIdOrName",
                error: err
            });
        }
    },
    findPositionById: async (req, res) => {
        const positionId = req.body.positionId;
        try {
            const result = await findPositionById(positionId);
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Tìm positions thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findPositionById",
                error: err
            });
        }
    },
    createPosition: async (req, res) => {
        const positionName = req.body.positionName;
        const positionSalary = req.body.positionSalary;
        const positionBonusSalary = req.body.positionBonusSalary;
        if (!positionName) {
            return res.status(400).json({
                status: "fail",
                message: "Tên chức vụ không hợp lệ!"
            });
        }
        if (!positionSalary || !Number.isInteger(positionSalary) || positionSalary < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mức lương cơ bản cho Chức vụ không hợp lệ!"
            });
        }
        if (positionBonusSalary === "" || positionBonusSalary === null || positionBonusSalary === undefined) {
            return res.status(400).json({
                status: "fail",
                message: "Mức lương thưởng cho Chức vụ không hợp lệ!"
            });
        }
        try {
            const createPositionRes = await createPosition(positionName, positionSalary, positionBonusSalary);
            if (!createPositionRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't create position!"
                });
            }

            createLogAdmin(req, res, " vừa thêm Chức vụ mới tên: " + positionName, "CREATE").then(() => {
                // Success
                return res.status(200).json({
                    status: "success",
                    message: "Thêm Chức vụ mới thành công!"
                });
            });

        } catch (err) {
            console.log("#EE", err)
            return res.status(400).json({
                status: "fail",
                message: "Error when create position!",
                error: err
            });
        }
    },
    updatePosition: async (req, res) => {
        const positionName = req.body.positionName;
        const positionSalary = req.body.positionSalary;
        const positionBonusSalary = req.body.positionBonusSalary;
        const positionId = req.body.positionId;
        if (!positionName) {
            return res.status(400).json({
                status: "fail",
                message: "Tên chức vụ không hợp lệ!"
            });
        }
        if (!positionSalary || !Number.isInteger(positionSalary) || positionSalary < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mức lương cơ bản cho Chức vụ không hợp lệ!"
            });
        }
        if (positionBonusSalary === "" || positionBonusSalary === null || positionBonusSalary === undefined) {
            return res.status(400).json({
                status: "fail",
                message: "Mức lương thưởng cho Chức vụ không hợp lệ!"
            });
        }
        if (!positionId || !Number.isInteger(positionId) || positionId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã Chức vụ không hợp lệ!"
            });
        }
        try {
            const positionRes = await findPositionById(positionId);
            if (!positionRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find position!"
                });
            }
            try {
                const updatePositionRes = await updatePositionById(positionName, positionSalary, positionBonusSalary, positionId);
                if (!updatePositionRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't update position!"
                    });
                }

                createLogAdmin(req, res, " vừa cập nhật Chức vụ mã: " + positionId, "UPDATE").then(() => {
                    // Success
                    return res.status(200).json({
                        status: "success",
                        message: "Cập nhật Chức vụ thành công!"
                    });
                });

            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when update position!",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when find position!",
                error: err
            });
        }
    },
    deletePosition: async (req, res) => {
        const positionId = parseInt(req.params.positionId);
        if (!positionId || !Number.isInteger(positionId) || positionId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã Chức vụ không hợp lệ!"
            });
        }
        try {
            const positionRes = await findPositionById(positionId);
            if (!positionRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find position!"
                });
            }
            try {
                const deletePositionRes = await deletePosition(positionId);
                if (!deletePositionRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't delete position!"
                    });
                }

                createLogAdmin(req, res, " vừa xóa Chức vụ mã: " + positionId, "DELETE").then(() => {
                    // Success
                    return res.status(200).json({
                        status: "success",
                        message: "Xóa Chức vụ thành công!"
                    });
                });

            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when delete position!",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when find position!",
                error: err
            });
        }
    }
}