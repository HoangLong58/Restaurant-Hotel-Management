const { getAllDeviceDetailByRoomId, getAllDeviceDetailByDeviceDetailId, deleteDeviceDetailByDeviceDetailId, createDetailDevice } = require("../service/DeviceDetailService");
const { updateDeviceStateByDeviceId, findDeviceById } = require("../service/DeviceService");
const { findAllRoomById } = require("../service/RoomService");
const { createLogAdmin, getAdminObjectFromJwtRequest } = require("../utils/utils");

module.exports = {
    // ADMIN: Quản lý Phòng - Thêm Thiết bị
    getAllDeviceDetailByRoomId: async (req, res) => {
        const roomId = parseInt(req.params.roomId);
        if (!roomId || !Number.isInteger(roomId) || roomId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã Phòng không hợp lệ!"
            });
        }
        // Kiểm tra có Room không?
        try {
            const roomRes = await findAllRoomById(roomId);
            if (!roomRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!"
                });
            }
            // Lấy thiết bị chi tiết cho room
            try {
                const result = await getAllDeviceDetailByRoomId(roomId);
                if (!result) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Record not found!",
                        data: []
                    });
                }
                return res.status(200).json({
                    status: "success",
                    message: "Lấy device detail by room id thành công",
                    data: result
                });
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Lỗi getAllDeviceDetailByRoomId",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findAllRoomById",
                error: err
            });
        }
    },
    deleteDeviceDetail: async (req, res) => {
        const deviceDetailId = parseInt(req.params.deviceDetailId);
        if (!deviceDetailId || !Number.isInteger(deviceDetailId) || deviceDetailId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã Chi tiết thiết bị không hợp lệ!"
            });
        }
        // Kiểm tra có Device detail không?
        try {
            const deviceDetailRes = await getAllDeviceDetailByDeviceDetailId(deviceDetailId);
            if (!deviceDetailRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!"
                });
            }
            // Lấy tên thiết bị và vị trí phòng để ghi log
            const deviceId = deviceDetailRes.device_id;
            const deviceName = deviceDetailRes.device_name;
            const roomFloorName = deviceDetailRes.room_name + ", " + deviceDetailRes.floor_name;
            // Xóa chi tiết thiết bị cho room
            try {
                const deleteRes = await deleteDeviceDetailByDeviceDetailId(deviceDetailId);
                if (!deleteRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't delete device detail!"
                    });
                }

                // Cập nhật lại trạng thái thiết bị về 0
                try {
                    const updateDeviceStateRes = await updateDeviceStateByDeviceId(0, deviceId);
                    if (!updateDeviceStateRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't update device state!"
                        });
                    }

                    createLogAdmin(req, res, " vừa xóa Thiết bị " + deviceName + " khỏi " + roomFloorName + " với mã chi tiết: " + deviceDetailId + " và Lưu Kho", "DELETE").then(() => {
                        // Success
                        return res.status(200).json({
                            status: "success",
                            message: "Xóa Thiết bị thành công!"
                        });
                    });

                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Lỗi updateDeviceStateByDeviceId",
                        error: err
                    });
                }
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Lỗi deleteDeviceDetailByDeviceDetailId",
                    error: err
                });
            }
        } catch (err) {
            console.log(err)
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getAllDeviceDetailByDeviceDetailId",
                error: err
            });
        }
    },
    createDeviceDetailByListDeviceId: async (req, res) => {
        const deviceListId = req.body.deviceListId;
        const roomId = req.body.roomId;
        if (deviceListId.length === 0) {
            return res.status(400).json({
                status: "fail",
                message: "Bạn chưa chọn Thiết bị để thêm vào Phòng này!"
            });
        }
        if (!roomId || !Number.isInteger(roomId) || roomId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã Phòng không hợp lệ!"
            });
        }
        // Kiểm tra tồn tại room
        try {
            const roomRes = await findAllRoomById(roomId);
            if (!roomRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find room!"
                });
            }
            var roomName = roomRes.room_name;
            var floorName = roomRes.floor_name;
            // Lặp từng device id để kiểm tra tồn tại
            var deviceNameStringLog = "";
            for (var i = 0; i < deviceListId.length; i++) {
                const deviceId = parseInt(deviceListId[i]);
                if (!deviceId || !Number.isInteger(deviceId) || deviceId < 0) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Mã Thiết bị không hợp lệ!"
                    });
                }
                // Kiểm tra device tồn tại
                try {
                    const deviceRes = await findDeviceById(deviceId);
                    if (!deviceRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't find device!"
                        });
                    }
                    deviceNameStringLog += deviceRes.device_name + ", ";

                    // Tạo device detail
                    // Lấy ngày hiện tại FORMAT: '2022-05-05 13:48:12' giống CSDL
                    var today = new Date();
                    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                    var checkDate = date + ' ' + time;
                    const admin = getAdminObjectFromJwtRequest(req);
                    const deviceTinhTrang = "Nhân viên mã: " + admin.employee_id + " - " + admin.employee_first_name + " " + admin.employee_last_name + " đã kiểm tra Thiết bị hoạt động tốt!";
                    try {
                        const createDeviceDetailRes = await createDetailDevice(checkDate, deviceTinhTrang, roomId, deviceId, admin.employee_id);
                        if (!createDeviceDetailRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't create device detail!"
                            });
                        }
                        // Cập nhật state cho thiết bị => 1 : Đã sử dụng
                        try {
                            const updateDeviceStateRes = await updateDeviceStateByDeviceId(1, deviceId);
                            if (!updateDeviceStateRes) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Cann't update device state to 1!"
                                });
                            }
                        } catch (err) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Lỗi updateDeviceStateByDeviceId",
                                error: err
                            });
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Lỗi createDetailDevice",
                            error: err
                        });
                    }
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Lỗi findDeviceById",
                        error: err
                    });
                }
            }

            createLogAdmin(req, res, " vừa Thêm Thiết bị: " + deviceNameStringLog + " vào " + roomName + ", " + floorName, "CREATE").then(() => {
                // Success
                return res.status(200).json({
                    status: "success",
                    message: "Thêm Thiết bị thành công!"
                });
            });

        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findAllRoomById",
                error: err
            });
        }
    }
}