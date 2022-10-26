const { createEmployee, getEmployeeByEmployeeId, getEmployees, updateEmployee, deleteEmployee, getEmployeeByEmail, checkEmailUnit, checkPhoneNumberUnit, getEmployeeByEmailOrPhoneNumber, findEmployeeByEmail, updateEmployeeOtpByEmail, updateEmployeePasswordByEmployeeId, findEmployeeByPhoneNumber, updateEmployeeOtpByPhoneNumber } = require("../service/EmployeeService");

const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { randomIntFromInterval } = require("../utils/utils");

// Twilio sent SMS
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

// NODE Mailer
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'truonghoanglong588@gmail.com',
        pass: 'grkaaxhoeradbtop'
    }
});

module.exports = {
    createEmployee: async (req, res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);

        // Check email & phone number
        let isEmailUnit = await checkEmailUnit(body);
        let isPhoneNumberUnit = await checkPhoneNumberUnit(body);

        if (isEmailUnit && isPhoneNumberUnit) {
            createEmployee(body, (err, results) => {
                if (err) {
                    console.log("Lỗi create: ", err);
                    return res.status(500).json({
                        status: "fail",
                        message: "Database connection error"
                    });
                }
                return res.status(200).json({
                    status: "success",
                    data: results
                });
            });
        }
        if (!isEmailUnit) {
            return res.status(400).json({
                status: "fail",
                message: "Email are used"
            });
        }
        if (!isPhoneNumberUnit) {
            return res.status(400).json({
                status: "fail",
                message: "Phone number are used"
            });
        }
    },
    getEmployeeByEmployeeId: async (req, res) => {
        const employeeId = req.params.employeeId;
        try {
            const result = await getEmployeeByEmployeeId(employeeId);
            if (!result) {
                return res.status(200).json({
                    status: "fail",
                    message: "Record not found"
                });
            }
            return res.status(200).json({
                status: "success",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getEmployeeByEmployeeId",
                err: err
            });
        }
    },
    getEmployees: (req, res) => {
        getEmployees((err, results) => {
            if (err) {
                console.log("Lỗi getEmployees: ", err);
                return;
            }
            return res.json({
                status: "success",
                data: results
            });
        })
    },
    updateEmployee: (req, res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);
        updateEmployee(body, (err, results) => {
            if (err) {
                console.log("Lỗi updateEmployee: ", err);
                return;
            }
            if (!results) {
                return res.json({
                    status: "fail",
                    message: "Failed to update employee"
                });
            }
            return res.json({
                status: "success",
                message: "Employee updated successfully"
            })
        })
    },
    deleteEmployee: (req, res) => {
        const data = req.body;
        deleteEmployee(data, (err, results) => {
            if (err) {
                console.log("Lỗi deleteEmployee: ", err);
                return;
            }
            if (!results) {
                return res.json({
                    status: "fail",
                    message: "Record not found"
                });
            }
            return res.json({
                status: "success",
                message: "Employee deleted successfully"
            });
        });
    },
    login: (req, res) => {
        const body = req.body;
        getEmployeeByEmailOrPhoneNumber(body.email, (err, results) => {
            if (err) {
                console.log("Lỗi login: ", err);
            }
            if (!results) {
                return res.status(400).json({
                    status: "fail",
                    message: "Account does not exist"
                });
            }
            const result = compareSync(body.password, results.employee_password);
            if (result) {
                results.employee_password = undefined;
                const jsontoken = sign({ result: results }, process.env.JWT_SEC, {
                    // expiresIn: "1h"
                    expiresIn: "365d"
                });
                return res.status(200).json({
                    status: "success",
                    message: "Login successfully",
                    admin: results,
                    token: jsontoken
                });
            } else {
                return res.status(400).json({
                    status: "fail",
                    message: "Your password is not correct"
                });
            }
        });
    },
    // Func: Forgot password - Email
    updateEmployeeOtpByEmail: async (req, res) => {
        const employeeEmail = req.body.employeeEmail;
        if (!employeeEmail) {
            return res.status(400).json({
                status: "fail",
                message: "Email không hợp lệ!"
            });
        }
        try {
            const employeeRes = await findEmployeeByEmail(employeeEmail);
            if (!employeeRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Người dùng không tồn tại",
                });
            }
            try {
                const otp = randomIntFromInterval(1000, 9999);
                const updateEmployeeOtpRes = await updateEmployeeOtpByEmail(otp, employeeEmail);
                if (!updateEmployeeOtpRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cập nhật OTP người dùng thất bại",
                    });
                }
                // Gửi mail
                try {
                    // MAILER
                    var noidung = '';
                    noidung += '<div><font color="#41f1b6"><b>Hoàng Long Hotel &amp; Restaurant</b></font><br/></div>';
                    noidung += '<p><b>Chào nhân viên:</b> ' + employeeEmail + '<br />';

                    // Mã KEY của phòng
                    noidung += '<p align="justify"><b>Mã xác thực của bạn là:</b></p>';
                    noidung += ' <table border="1px" cellpadding="10px" cellspacing="1px"width="100%"><tr><td align="center" bgcolor="#41f1b6"><fontcolor="white"><b>MÃ XÁC THỰC CỦA BẠN</b></fontcolor=></td></tr>';
                    noidung += '<tr><td class="prd-total"><b><font color="#41f1b6">' + otp + '</font></b></td></tr></table><br />';

                    noidung += '<p align="justify">• Vui lòng nhập mã xác thực trên website của Hoàng Long để xác thực yêu cầu tìm lại mật khẩu của bạn.<br/><br />• Bạn có thể bỏ qua Email này nếu như chưa từng gửi yêu cầu tìm lại mật khẩu tại Hoàng Long.</p>';

                    // ----- Mailer Option -----
                    var mailOptions = {
                        from: 'Hoàng Long Hotel &amp; Restaurant',
                        to: employeeEmail,
                        subject: '[Hoàng Long] Mã xác nhận để tìm lại mật khẩu',
                        html: noidung,
                    };

                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });
                    // ---------------------------------------------------------------------------
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when send mail!",
                        error: err
                    });
                }
                // Success
                return res.status(200).json({
                    status: "success",
                    message: "Mã OTP đã được gửi về email của nhân viên!",
                });
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when update otp by email!",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when find employee by email!",
                error: err
            });
        }
    },
    updateEmployeePasswordWhenForgotPassword: async (req, res) => {
        const employeeEmail = req.body.employeeEmail;
        const employeeOtp = req.body.employeeOtp;
        let employeePassword = req.body.employeePassword;

        if (!employeeEmail) {
            return res.status(400).json({
                status: "fail",
                message: "Email không hợp lệ!"
            });
        }
        if (!employeeOtp || !Number.isInteger(employeeOtp) || employeeOtp < 1000) {
            return res.status(400).json({
                status: "fail",
                message: "Mã OTP không hợp lệ!"
            });
        }
        if (!employeePassword) {
            return res.status(400).json({
                status: "fail",
                message: "Password không hợp lệ!"
            });
        }
        try {
            const employeeRes = await findEmployeeByEmail(employeeEmail);
            if (!employeeRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Nhân viên không tồn tại",
                });
            }
            const employeeIdRes = employeeRes.employee_id;
            const employeeOTPRes = employeeRes.employee_otp;
            if (employeeOtp !== employeeOTPRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Mã OTP không chính xác",
                });
            }
            try {
                // Mã hóa mật khẩu
                const salt = genSaltSync(10);
                employeePassword = hashSync(employeePassword, salt);
                const updatePasswordRes = await updateEmployeePasswordByEmployeeId(employeePassword, employeeIdRes);
                if (!updatePasswordRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cập nhật mật khẩu thất bại",
                    });
                }
                // Set null mã otp lại
                try {
                    const newOtp = null;
                    const updateEmployeeOtpRes = await updateEmployeeOtpByEmail(newOtp, employeeEmail);
                    if (!updateEmployeeOtpRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cập nhật OTP nhân viên thất bại",
                        });
                    }
                    // Success
                    return res.status(200).json({
                        status: "success",
                        message: "Cập nhật lại mật khẩu mới thành công!",
                    });
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when update otp by email!",
                        error: err
                    });
                }
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when update password by email!",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when find employee by email!",
                error: err
            });
        }
    },
    // Func: Forgot password - Phone number
    updateEmployeeOtpByPhoneNumber: async (req, res) => {
        const employeePhoneNumber = req.body.employeePhoneNumber;
        if (!employeePhoneNumber) {
            return res.status(400).json({
                status: "fail",
                message: "Phone number không hợp lệ!"
            });
        }
        try {
            const employeeRes = await findEmployeeByPhoneNumber(employeePhoneNumber);
            if (!employeeRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Nhân viên không tồn tại",
                });
            }
            try {
                const otp = randomIntFromInterval(1000, 9999);
                const updateEmployeeOtpRes = await updateEmployeeOtpByPhoneNumber(otp, employeePhoneNumber);
                if (!updateEmployeeOtpRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cập nhật OTP nhân viên thất bại",
                    });
                }
                // Gửi SMS
                try {
                    client.messages
                        .create({
                            body: '[Hoàng Long] Mã xác nhận để tìm lại mật khẩu: ' + otp,
                            from: '+17866928411',
                            to: '+84' + employeePhoneNumber
                        })
                        .then(message => console.log(message.sid));
                    // ---------------------------------------------------------------------------
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when send SMS!",
                        error: err
                    });
                }
                // Success
                return res.status(200).json({
                    status: "success",
                    message: "Mã OTP đã được gửi về số điện thoại của nhân viên!",
                });
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when update otp by phone number!",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when find employee by phone number!",
                error: err
            });
        }
    },
    updateEmployeePasswordWhenForgotPasswordPhoneNumber: async (req, res) => {
        const employeePhoneNumber = req.body.employeePhoneNumber;
        const employeeOtp = req.body.employeeOtp;
        let employeePassword = req.body.employeePassword;

        if (!employeePhoneNumber) {
            return res.status(400).json({
                status: "fail",
                message: "Phone number không hợp lệ!"
            });
        }
        if (!employeeOtp || !Number.isInteger(employeeOtp) || employeeOtp < 1000) {
            return res.status(400).json({
                status: "fail",
                message: "Mã OTP không hợp lệ!"
            });
        }
        if (!employeePassword) {
            return res.status(400).json({
                status: "fail",
                message: "Password không hợp lệ!"
            });
        }
        try {
            const employeeRes = await findEmployeeByPhoneNumber(employeePhoneNumber);
            if (!employeeRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Người dùng không tồn tại",
                });
            }
            const employeeIdRes = employeeRes.employee_id;
            const employeeOTPRes = employeeRes.employee_otp;
            if (employeeOtp !== employeeOTPRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Mã OTP không chính xác",
                });
            }
            try {
                // Mã hóa mật khẩu
                const salt = genSaltSync(10);
                employeePassword = hashSync(employeePassword, salt);
                const updatePasswordRes = await updateEmployeePasswordByEmployeeId(employeePassword, employeeIdRes);
                if (!updatePasswordRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cập nhật mật khẩu thất bại",
                    });
                }
                // Set null mã otp lại
                try {
                    const newOtp = null;
                    const updateEmployeeOtpRes = await updateEmployeeOtpByPhoneNumber(newOtp, employeePhoneNumber);
                    if (!updateEmployeeOtpRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cập nhật OTP nhân viên thất bại",
                        });
                    }
                    // Success
                    return res.status(200).json({
                        status: "success",
                        message: "Cập nhật lại mật khẩu mới thành công!",
                    });
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when update otp by phone number!",
                        error: err
                    });
                }
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when update password by phone number!",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when find employee by phone number!",
                error: err
            });
        }
    }
}