const { findEmployeeById } = require("../service/EmployeeService");
const { getAllRoomEmployeeByRoomId, findRoomEmployeeByRoomEmployeeId, getAllRoomEmployeeByRoomEmployeeId, deleteRoomEmployeeByRoomEmployeeId, createRoomEmployee } = require("../service/RoomEmployeeService");
const { findAllRoomById } = require("../service/RoomService");
const { createLogAdmin } = require("../utils/utils");

module.exports = {
    // ADMIN: Quản lý Phòng - Thêm nhân viên
    getAllRoomEmployeeByRoomId: async (req, res) => {
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
            // Lấy room_employee cho room
            try {
                const result = await getAllRoomEmployeeByRoomId(roomId);
                if (!result) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Record not found!",
                        data: []
                    });
                }
                return res.status(200).json({
                    status: "success",
                    message: "Lấy room employee by room id thành công",
                    data: result
                });
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Lỗi getAllRoomEmployeeByRoomId",
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
    deleteRoomEmployee: async (req, res) => {
        const roomEmployeeId = parseInt(req.params.roomEmployeeId);
        if (!roomEmployeeId || !Number.isInteger(roomEmployeeId) || roomEmployeeId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã Room Employee không hợp lệ!"
            });
        }
        // Kiểm tra có Room employee không?
        try {
            const roomEmployeeRes = await getAllRoomEmployeeByRoomEmployeeId(roomEmployeeId);
            if (!roomEmployeeRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!"
                });
            }
            // Lấy tên nhân viên và tên phòng để ghi log
            const roomName = roomEmployeeRes.room_name;
            const employeeName = roomEmployeeRes.employee_first_name + " " + roomEmployeeRes.employee_last_name;
            // Xóa room employee cho room
            try {
                const result = await deleteRoomEmployeeByRoomEmployeeId(roomEmployeeId);
                if (!result) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't delete room employee!"
                    });
                }

                createLogAdmin(req, res, " vừa xóa Nhân viên " + employeeName + " khỏi " + roomName + " với mã chi tiết: " + roomEmployeeId, "DELETE").then(() => {
                    // Success
                    return res.status(200).json({
                        status: "success",
                        message: "Xóa Nhân viên thành công!"
                    });
                });

            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Lỗi deleteRoomEmployeeByRoomEmployeeId",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getAllRoomEmployeeByRoomEmployeeId",
                error: err
            });
        }
    },
    createRoomEmployeeByListEmployeeId: async (req, res) => {
        const employeeListId = req.body.employeeListId;
        const roomId = req.body.roomId;
        if (employeeListId.length === 0) {
            return res.status(400).json({
                status: "fail",
                message: "Bạn chưa chọn Nhân viên để thêm vào Phòng này!"
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
            // Lặp từng employee id để kiểm tra tồn tại
            var employeeNameStringLog = "";
            for (var i = 0; i < employeeListId.length; i++) {
                const employeeId = parseInt(employeeListId[i]);
                if (!employeeId || !Number.isInteger(employeeId) || employeeId < 0) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Mã Nhân viên không hợp lệ!"
                    });
                }
                // Kiểm tra employee tồn tại
                try {
                    const employeeRes = await findEmployeeById(employeeId);
                    if (!employeeRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't find employee!"
                        });
                    }
                    employeeNameStringLog += employeeRes.employee_first_name + " " + employeeRes.employee_last_name + ", ";

                    // Tạo room employee
                    // Lấy ngày hiện tại FORMAT: '2022-05-05 13:48:12' giống CSDL
                    var today = new Date();
                    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                    var roomEmployeeDate = date + ' ' + time;
                    const roomEmployeeName = employeeRes.employee_first_name + " " + employeeRes.employee_last_name + " phụ trách " + roomName + " từ: " + roomEmployeeDate;
                    try {
                        const createRoomEmployeeRes = await createRoomEmployee(roomEmployeeName, roomEmployeeDate, employeeId, roomId);
                        if (!createRoomEmployeeRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't create room employee!"
                            });
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Lỗi createRoomEmployee",
                            error: err
                        });
                    }
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Lỗi findEmployeeById",
                        error: err
                    });
                }
            }

            createLogAdmin(req, res, " vừa Thêm Nhân viên: " + employeeNameStringLog + " vào " + roomName, "CREATE").then(() => {
                // Success
                return res.status(200).json({
                    status: "success",
                    message: "Thêm Nhân viên thành công!"
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