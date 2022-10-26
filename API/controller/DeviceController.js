const { getDevicesName, getDevicesAndTypeAndDetailAndRoomAndFloor, getQuantityDevices, findDeviceByIdOrName, findDeviceById, createDevice, updateDeviceById, deleteDeviceById } = require("../service/DeviceService");
const { findDeviceTypeById } = require("../service/DeviceTypeService");
const { deleteDeviceDetailById } = require("../service/DeviceDetailService");

module.exports = {
    getDevicesName: (req, res) => {
        getDevicesName((err, result) => {
            if (err) {
                console.log("Lỗi getDevicesName: ", err);
                return;
            }
            return res.json({
                status: "success",
                data: result
            });
        });
    },

    // ADMIN: Quản lý Thiết bị - Khách sạn
    getDevicesAndTypeAndDetailAndRoomAndFloor: async (req, res) => {
        try {
            const result = await getDevicesAndTypeAndDetailAndRoomAndFloor();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Lấy devices thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getDevicesAndTypeAndDetailAndRoomAndFloor",
                error: err
            });
        }
    },
    getQuantityDevices: async (req, res) => {
        try {
            const result = await getQuantityDevices();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Lấy quantity devices thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getQuantityDevices",
                error: err
            });
        }
    },
    findDeviceByIdOrName: async (req, res) => {
        const search = req.params.search;
        try {
            const result = await findDeviceByIdOrName(search);
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Tìm device thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findDeviceByIdOrName",
                error: err
            });
        }
    },
    findDeviceById: async (req, res) => {
        const deviceId = req.body.deviceId;
        try {
            const result = await findDeviceById(deviceId);
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Tìm device thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findDeviceById",
                error: err
            });
        }
    },
    createDevice: async (req, res) => {
        const deviceName = req.body.deviceName;
        const deviceDescription = req.body.deviceDescription;
        const deviceImage = req.body.deviceImage;
        const deviceState = 0;
        const deviceTypeId = req.body.deviceTypeId;

        // Lấy ngày hiện tại FORMAT: '2022-05-05 13:48:12' giống CSDL
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var deviceDate = date + ' ' + time;

        if (!deviceName) {
            return res.status(400).json({
                status: "fail",
                message: "Tên thiết bị không hợp lệ!"
            });
        }
        if (!deviceDescription) {
            return res.status(400).json({
                status: "fail",
                message: "Tên thiết bị không hợp lệ!"
            });
        }
        if (!deviceImage) {
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
                const createDeviceRes = await createDevice(deviceName, deviceDate, deviceDescription, deviceImage, deviceTypeId);
                if (!createDeviceRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't create device!"
                    });
                }
                // Success
                return res.status(200).json({
                    status: "success",
                    message: "Thêm thiết bị mới thành công!"
                });
            } catch (err) {
                console.log("ERR: ", err);
                return res.status(400).json({
                    status: "fail",
                    message: "Error when create device!",
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
    updateDevice: async (req, res) => {
        const deviceName = req.body.deviceName;
        const deviceDate = req.body.deviceDate;
        const deviceDescription = req.body.deviceDescription;
        const deviceImage = req.body.deviceImage;
        const deviceState = req.body.deviceState;
        const deviceTypeId = req.body.deviceTypeId;
        const deviceId = req.body.deviceId;

        if (!deviceName) {
            return res.status(400).json({
                status: "fail",
                message: "Tên thiết bị không hợp lệ!"
            });
        }
        if (!deviceDate) {
            return res.status(400).json({
                status: "fail",
                message: "Thời gian mua không hợp lệ!"
            });
        }
        if (!deviceDescription) {
            return res.status(400).json({
                status: "fail",
                message: "Mô tả thiết bị không hợp lệ!"
            });
        }
        if (!deviceImage) {
            return res.status(400).json({
                status: "fail",
                message: "Hình ảnh không hợp lệ!"
            });
        }
        if (deviceState !== 0 && deviceState !== 1) {
            return res.status(400).json({
                status: "fail",
                message: "Trạng thái thiết bị không hợp lệ!"
            });
        }
        if (!deviceTypeId || !Number.isInteger(deviceTypeId) || deviceTypeId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã loại thiết bị không hợp lệ!"
            });
        }
        if (!deviceId || !Number.isInteger(deviceId) || deviceId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã thiết bị không hợp lệ!"
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
                const deviceRes = await findDeviceById(deviceId);
                if (!deviceRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't find device!"
                    });
                }
                // Kiểm tra nếu state = 1 đang sử dụng -> 0 về kho thì xóa device khỏi detail.
                if (deviceRes.device_state === 1 && deviceState === 0) {
                    try{
                        const deleteDetailRes = await deleteDeviceDetailById(deviceRes.device_detail_id);
                        if (!deleteDetailRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't delete device detail!"
                            });
                        }
                    }catch(err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when delete device detail!",
                            error: err
                        });
                    }
                }else if(deviceRes.device_state === 0 && deviceState === 1) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Không thể chuyển sang 'Đang sử dụng' khi chưa thêm thiết bị vào Phòng cụ thể!"
                    });
                }
                // Cập nhật device
                try {
                    const updateDeviceRes = await updateDeviceById(
                        deviceName,
                        deviceDate,
                        deviceDescription,
                        deviceImage,
                        deviceState,
                        deviceTypeId,
                        deviceId
                    );
                    if (!updateDeviceRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't update device!"
                        });
                    }
                    // Success
                    return res.status(200).json({
                        status: "success",
                        message: "Cập nhật thiết bị mới thành công!"
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
                    message: "Error when find device!",
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
    deleteDevice: async (req, res) => {
        const deviceId = parseInt(req.params.deviceId);
        if (!deviceId || !Number.isInteger(deviceId) || deviceId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã thiết bị không hợp lệ!"
            });
        }
        try {
            const deviceRes = await findDeviceById(deviceId);
            if (!deviceRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find device!"
                });
            }
            try {
                const deleteDeviceRes = await deleteDeviceById(deviceId);
                if (!deleteDeviceRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't delete device!"
                    });
                }
                // Success
                return res.status(200).json({
                    status: "success",
                    message: "Xóa thiết bị mới thành công!"
                });
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when delete device!",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when find device!",
                error: err
            });
        }
    }
}