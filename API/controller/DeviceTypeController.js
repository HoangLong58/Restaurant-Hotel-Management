const { getDeviceTypes, findDeviceTypeByIdOrName, getQuantityDeviceTypes, createDeviceType, findDeviceTypeById, updateDeviceTypeById, deleteDeviceType } = require("../service/DeviceTypeService");

module.exports = {
    // ADMIN: Quản lý Loại thiết bị - Khách sạn
    getDeviceTypes: async (req, res) => {
        try {
            const result = await getDeviceTypes();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Lấy device types thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getDeviceTypes",
                error: err
            });
        }
    },
    getQuantityDeviceType: async (req, res) => {
        try {
            const result = await getQuantityDeviceTypes();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Lấy quantity device types thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getQuantityDeviceTypes",
                error: err
            });
        }
    },
    findDeviceTypeByIdOrName: async (req, res) => {
        const search = req.params.search;
        try {
            const result = await findDeviceTypeByIdOrName(search);
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Tìm device types thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findDeviceTypeByIdOrName",
                error: err
            });
        }
    },
    findDeviceTypeById: async (req, res) => {
        const deviceTypeId = req.body.deviceTypeId;
        try {
            const result = await findDeviceTypeById(deviceTypeId);
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Tìm device types thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findDeviceTypeById",
                error: err
            });
        }
    },
    createDeviceType: async (req, res) => {
        const deviceTypeName = req.body.deviceTypeName;
        const deviceTypeImage = req.body.deviceTypeImage;
        if (!deviceTypeName) {
            return res.status(400).json({
                status: "fail",
                message: "Tên loại thiết bị không hợp lệ!"
            });
        }
        if (!deviceTypeImage) {
            return res.status(400).json({
                status: "fail",
                message: "Hình ảnh không hợp lệ!"
            });
        }
        try {
            const createDeviceTypeRes = await createDeviceType(deviceTypeName, deviceTypeImage);
            if (!createDeviceTypeRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't create device type!"
                });
            }
            // Success
            return res.status(200).json({
                status: "success",
                message: "Thêm loại thiết bị mới thành công!"
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when create device type!",
                error: err
            });
        }
    },
    updateDeviceType: async (req, res) => {
        const deviceTypeName = req.body.deviceTypeName;
        const deviceTypeImage = req.body.deviceTypeImage;
        const deviceTypeId = req.body.deviceTypeId;
        if (!deviceTypeName) {
            return res.status(400).json({
                status: "fail",
                message: "Tên loại thiết bị không hợp lệ!"
            });
        }
        if (!deviceTypeImage) {
            return res.status(400).json({
                status: "fail",
                message: "Hình ảnh không hợp lệ!"
            });
        }
        if (!deviceTypeId || !Number.isInteger(deviceTypeId) || deviceTypeId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã loại thiết bị không hợp lệ!"
            });
        }
        try {
            const deviceTypeRes = await findDeviceTypeById(deviceTypeId);
            if (!deviceTypeRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find device type!"
                });
            }
            try {
                const updateDeviceTypeRes = await updateDeviceTypeById(deviceTypeName, deviceTypeImage, deviceTypeId);
                if (!updateDeviceTypeRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't update device type!"
                    });
                }
                // Success
                return res.status(200).json({
                    status: "success",
                    message: "Cập nhật loại thiết bị mới thành công!"
                });
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when update device type!",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when find device type!",
                error: err
            });
        }
    },
    deleteDeviceType: async (req, res) => {
        const deviceTypeId = parseInt(req.params.deviceTypeId);
        if (!deviceTypeId || !Number.isInteger(deviceTypeId) || deviceTypeId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã loại thiết bị không hợp lệ!"
            });
        }
        try {
            const deviceTypeRes = await findDeviceTypeById(deviceTypeId);
            if (!deviceTypeRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find device type!"
                });
            }
            try {
                const deleteDeviceTypeRes = await deleteDeviceType(deviceTypeId);
                if (!deleteDeviceTypeRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't delete device type!"
                    });
                }
                // Success
                return res.status(200).json({
                    status: "success",
                    message: "Xóa loại thiết bị mới thành công!"
                });
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when delete device type!",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when find device type!",
                error: err
            });
        }
    }
}