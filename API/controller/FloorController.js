const { getFloors, getQuantityFloors, findFloorByIdOrName, findFloorById, createFloor, updateFloorById, deleteFloor } = require("../service/FloorService");
const { createLogAdmin } = require("../utils/utils");

module.exports = {
    // ADMIN: Quản lý Tầng
    getFloors: async (req, res) => {
        try {
            const result = await getFloors();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Lấy floors thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getFloors",
                error: err
            });
        }
    },
    getQuantityFloor: async (req, res) => {
        try {
            const result = await getQuantityFloors();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Lấy quantity floors thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getQuantityFloors",
                error: err
            });
        }
    },
    findFloorByIdOrName: async (req, res) => {
        const search = req.params.search;
        try {
            const result = await findFloorByIdOrName(search);
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Tìm floors thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findFloorByIdOrName",
                error: err
            });
        }
    },
    findFloorById: async (req, res) => {
        const floorId = req.body.floorId;
        try {
            const result = await findFloorById(floorId);
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Tìm floors thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findFloorById",
                error: err
            });
        }
    },
    createFloor: async (req, res) => {
        const floorName = req.body.floorName;
        if (!floorName) {
            return res.status(400).json({
                status: "fail",
                message: "Tên Tầng không hợp lệ!"
            });
        }
        try {
            const createFloorRes = await createFloor(floorName);
            if (!createFloorRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't create floor!"
                });
            }

            createLogAdmin(req, res, " vừa tạo Floor mới tên: " + floorId, "CREATE").then(() => {
                // Success
                return res.status(200).json({
                    status: "success",
                    message: "Thêm Tầng mới thành công!"
                });
            });

        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when create floor!",
                error: err
            });
        }
    },
    updateFloor: async (req, res) => {
        const floorName = req.body.floorName;
        const floorId = req.body.floorId;
        if (!floorName) {
            return res.status(400).json({
                status: "fail",
                message: "Tên Tầng không hợp lệ!"
            });
        }
        if (!floorId || !Number.isInteger(floorId) || floorId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã tầng không hợp lệ!"
            });
        }
        try {
            const floorRes = await findFloorById(floorId);
            if (!floorRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find floor!"
                });
            }
            try {
                const updateFloorRes = await updateFloorById(floorName, floorId);
                if (!updateFloorRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't update floor!"
                    });
                }

                createLogAdmin(req, res, " vừa cập nhật Floor mã: " + floorId, "UPDATE").then(() => {
                    // Success
                    return res.status(200).json({
                        status: "success",
                        message: "Cập nhật Tầng mới thành công!"
                    });
                });

            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when update floor!",
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
    },
    deleteFloor: async (req, res) => {
        const floorId = parseInt(req.params.floorId);
        if (!floorId || !Number.isInteger(floorId) || floorId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã Tầng không hợp lệ!"
            });
        }
        try {
            const FloorRes = await findFloorById(floorId);
            if (!FloorRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find floor!"
                });
            }
            try {
                const deleteFloorRes = await deleteFloor(floorId);
                if (!deleteFloorRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't delete floor!"
                    });
                }

                createLogAdmin(req, res, " vừa xóa Floor mã: " + floorId, "DELETE").then(() => {
                    // Success
                    return res.status(200).json({
                        status: "success",
                        message: "Xóa Tầng thành công!"
                    });
                });

            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when delete floor!",
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
    }
}