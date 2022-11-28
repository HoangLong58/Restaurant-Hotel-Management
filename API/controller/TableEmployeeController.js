const { findEmployeeById } = require("../service/EmployeeService");
const { getAllTableEmployeeByTableBookingId, getAllTableEmployeeByTableEmployeeId, deleteTableEmployeeByTableEmployeeId, createTableEmployee } = require("../service/TableEmployeeService");
const { findTableBookingById } = require("../service/TableBookingService");
const { createLogAdmin } = require("../utils/utils");

module.exports = {
    // ADMIN: Quản lý Bàn - Thêm nhân viên
    getAllTableEmployeeByTableBookingId: async (req, res) => {
        const tableBookingId = parseInt(req.params.tableBookingId);
        if (!tableBookingId || !Number.isInteger(tableBookingId) || tableBookingId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã Bàn không hợp lệ!"
            });
        }
        // Kiểm tra có Table không?
        try {
            const tableBookingRes = await findTableBookingById(tableBookingId);
            if (!tableBookingRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!"
                });
            }
            // Lấy table_booking_employee cho table
            try {
                const result = await getAllTableEmployeeByTableBookingId(tableBookingId);
                if (!result) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Record not found!",
                        data: []
                    });
                }
                return res.status(200).json({
                    status: "success",
                    message: "Lấy table employee by table booking id thành công",
                    data: result
                });
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Lỗi getAllTableEmployeeByTableBookingId",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findTableBookingById",
                error: err
            });
        }
    },
    deleteTableEmployee: async (req, res) => {
        const tableEmployeeId = parseInt(req.params.tableEmployeeId);
        if (!tableEmployeeId || !Number.isInteger(tableEmployeeId) || tableEmployeeId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã Table Employee không hợp lệ!"
            });
        }
        // Kiểm tra có Table employee không?
        try {
            const tableEmployeeRes = await getAllTableEmployeeByTableEmployeeId(tableEmployeeId);
            if (!tableEmployeeRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!"
                });
            }
            // Lấy tên nhân viên và tên phòng để ghi log
            const tableBookingName = tableEmployeeRes.table_booking_name;
            const employeeName = tableEmployeeRes.employee_first_name + " " + tableEmployeeRes.employee_last_name;
            // Xóa table employee cho table
            try {
                const result = await deleteTableEmployeeByTableEmployeeId(tableEmployeeId);
                if (!result) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't delete table employee!"
                    });
                }

                createLogAdmin(req, res, " vừa xóa Nhân viên " + employeeName + " khỏi " + tableBookingName + " với mã chi tiết: " + tableEmployeeId, "DELETE").then(() => {
                    // Success
                    return res.status(200).json({
                        status: "success",
                        message: "Xóa Nhân viên thành công!"
                    });
                });

            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Lỗi deleteTableEmployeeByTableEmployeeId",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getAllTableEmployeeByTableEmployeeId",
                error: err
            });
        }
    },
    createTableEmployeeByListEmployeeId: async (req, res) => {
        const employeeListId = req.body.employeeListId;
        const tableBookingId = req.body.tableBookingId;
        if (employeeListId.length === 0) {
            return res.status(400).json({
                status: "fail",
                message: "Bạn chưa chọn Nhân viên để thêm vào Bàn này!"
            });
        }
        if (!tableBookingId || !Number.isInteger(tableBookingId) || tableBookingId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã Bàn không hợp lệ!"
            });
        }
        // Kiểm tra tồn tại table
        try {
            const tableBookingRes = await findTableBookingById(tableBookingId);
            if (!tableBookingRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find table!"
                });
            }
            var tableBookingName = tableBookingRes.table_booking_name;
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

                    // Tạo table employee
                    // Lấy ngày hiện tại FORMAT: '2022-05-05 13:48:12' giống CSDL
                    var today = new Date();
                    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                    var tableEmployeeDate = date + ' ' + time;
                    const tableEmployeeName = employeeRes.employee_first_name + " " + employeeRes.employee_last_name + " phụ trách " + tableBookingName + " từ: " + tableEmployeeDate;
                    try {
                        const createTableEmployeeRes = await createTableEmployee(tableEmployeeName, tableEmployeeDate, employeeId, tableBookingId);
                        if (!createTableEmployeeRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't create table employee!"
                            });
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Lỗi createTableEmployee",
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

            createLogAdmin(req, res, " vừa Thêm Nhân viên: " + employeeNameStringLog + " vào " + tableBookingName, "CREATE").then(() => {
                // Success
                return res.status(200).json({
                    status: "success",
                    message: "Thêm Nhân viên thành công!"
                });
            });

        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findTableBookingById",
                error: err
            });
        }
    }
}