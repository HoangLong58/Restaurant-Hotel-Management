const { verify } = require("jsonwebtoken");
const { createAdminLog } = require("../service/AdminLogService");
const { getEmployeeByEmployeeId } = require("../service/EmployeeService");

module.exports = {
    // Định dạng tiền kiểu: xxx.xxx.xxx
    format_money: (str) => {
        str = str.toString();
        return str.split('').reverse().reduce((prev, next, index) => {
            return ((index % 3) ? next : (next + '.')) + prev
        });
    },
    // Random OTP - Quên mật khẩu
    randomIntFromInterval: (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min);
    },
    //  Create logs - Tạo log khi admin thực hiện Thêm - Sửa - Xóa!
    createLogAdmin: async (req, res, adminLogContent, adminLogType) => {
        const userToken = req.headers.authorization;
        const token = userToken.split(' ');
        // const decoded = jwt.verify(token[1], 'secret-key');

        verify(token[1], process.env.JWT_SEC, async (err, decoded) => {
            if (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Invalid token"
                });
            } else {
                // Lấy ngày hiện tại FORMAT: '2022-05-05 13:48:12' giống CSDL
                var today = new Date();
                var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                var adminLogDate = date + ' ' + time;

                const employeeId = decoded.result.employee_id;
                try {
                    const employeeRes = await getEmployeeByEmployeeId(employeeId);
                    if (!employeeRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't find admin"
                        });
                    }
                    try {
                        const createAdminLogRes = await createAdminLog(adminLogContent, adminLogDate, adminLogType, employeeId);
                        if (!createAdminLogRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't create admin log"
                            });
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when create admin log",
                            error: err
                        });
                    }
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when find admin",
                        error: err
                    });
                }
            }
        });
    },
    //  Lấy thông tin Admin từ Jwt req
    getAdminObjectFromJwtRequest: (req) => {
        const userToken = req.headers.authorization;
        const token = userToken.split(' ');

        var adminFromJwtReq;
        try {
            adminFromJwtReq = verify(token[1], process.env.JWT_SEC);
        } catch (e) {
            console.log("Lỗi khi lấy adminFromJwtReq: ", e);
        }
        return adminFromJwtReq.result;
    }
}


