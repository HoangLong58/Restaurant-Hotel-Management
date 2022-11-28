const { findEmployeeById } = require("../service/EmployeeService");
const { getAllPartyEmployeeByPartyHallId, getAllPartyEmployeeByPartyEmployeeId, deletePartyEmployeeByPartyEmployeeId, createPartyEmployee } = require("../service/PartyEmployeeService");
const { findPartyHallById } = require("../service/PartyHallService");
const { createLogAdmin } = require("../utils/utils");

module.exports = {
    // ADMIN: Quản lý Tiệc - Thêm nhân viên
    getAllPartyEmployeeByPartyHallId: async (req, res) => {
        const partyHallId = parseInt(req.params.partyHallId);
        if (!partyHallId || !Number.isInteger(partyHallId) || partyHallId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã Sảnh không hợp lệ!"
            });
        }
        // Kiểm tra có PartyHall không?
        try {
            const partyHallRes = await findPartyHallById(partyHallId);
            if (!partyHallRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!"
                });
            }
            // Lấy party_employee cho party
            try {
                const result = await getAllPartyEmployeeByPartyHallId(partyHallId);
                if (!result) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Record not found!",
                        data: []
                    });
                }
                return res.status(200).json({
                    status: "success",
                    message: "Lấy party employee by party hall id thành công",
                    data: result
                });
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Lỗi getAllPartyEmployeeByPartyHallId",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findPartyHallById",
                error: err
            });
        }
    },
    deletePartyEmployee: async (req, res) => {
        const partyEmployeeId = parseInt(req.params.partyEmployeeId);
        if (!partyEmployeeId || !Number.isInteger(partyEmployeeId) || partyEmployeeId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã party employee không hợp lệ!"
            });
        }
        // Kiểm tra có PartyHall employee không?
        try {
            const partyEmployeeRes = await getAllPartyEmployeeByPartyEmployeeId(partyEmployeeId);
            if (!partyEmployeeRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!"
                });
            }
            // Lấy tên nhân viên và tên phòng để ghi log
            const partyHallName = partyEmployeeRes.party_hall_name;
            const employeeName = partyEmployeeRes.employee_first_name + " " + partyEmployeeRes.employee_last_name;
            // Xóa party employee cho party hall
            try {
                const result = await deletePartyEmployeeByPartyEmployeeId(partyEmployeeId);
                if (!result) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't delete party employee!"
                    });
                }

                createLogAdmin(req, res, " vừa xóa Nhân viên " + employeeName + " khỏi " + partyHallName + " với mã chi tiết: " + partyEmployeeId, "DELETE").then(() => {
                    // Success
                    return res.status(200).json({
                        status: "success",
                        message: "Xóa Nhân viên thành công!"
                    });
                });

            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Lỗi deletePartyEmployeeByPartyEmployeeId",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getAllPartyEmployeeByPartyEmployeeId",
                error: err
            });
        }
    },
    createPartyEmployeeByListEmployeeId: async (req, res) => {
        const employeeListId = req.body.employeeListId;
        const partyHallId = req.body.partyHallId;
        if (employeeListId.length === 0) {
            return res.status(400).json({
                status: "fail",
                message: "Bạn chưa chọn Nhân viên để thêm vào Sảnh này!"
            });
        }
        if (!partyHallId || !Number.isInteger(partyHallId) || partyHallId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã Sảnh không hợp lệ!"
            });
        }
        // Kiểm tra tồn tại party hall
        try {
            const partyHallRes = await findPartyHallById(partyHallId);
            if (!partyHallRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find party hall!"
                });
            }
            var partyHallName = partyHallRes.party_hall_name;
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

                    // Tạo party employee
                    // Lấy ngày hiện tại FORMAT: '2022-05-05 13:48:12' giống CSDL
                    var today = new Date();
                    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                    var partyEmployeeDate = date + ' ' + time;
                    const partyEmployeeName = employeeRes.employee_first_name + " " + employeeRes.employee_last_name + " phụ trách " + partyHallName + " từ: " + partyEmployeeDate;
                    try {
                        const createPartyEmployeeRes = await createPartyEmployee(partyEmployeeName, partyEmployeeDate, employeeId, partyHallId);
                        if (!createPartyEmployeeRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't create party employee!"
                            });
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Lỗi createPartyEmployee",
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

            createLogAdmin(req, res, " vừa Thêm Nhân viên: " + employeeNameStringLog + " vào " + partyHallName, "CREATE").then(() => {
                // Success
                return res.status(200).json({
                    status: "success",
                    message: "Thêm Nhân viên thành công!"
                });
            });

        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findAllPartyHallById",
                error: err
            });
        }
    }
}