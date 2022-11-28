const { createEmployee, getEmployeeByEmployeeId, getEmployees, updateEmployee, deleteEmployee, getEmployeeByEmail, checkEmailUnit, checkPhoneNumberUnit, getEmployeeByEmailOrPhoneNumber, findEmployeeByEmail, updateEmployeeOtpByEmail, updateEmployeePasswordByEmployeeId, findEmployeeByPhoneNumber, updateEmployeeOtpByPhoneNumber, getAllEmployees, getQuantityEmployees, findEmployeeByIdOrName, findEmployeeById, checkEmployeeEmailUnit, checkEmployeePhoneNumberUnit, updateEmployeeById, checkUpdateEmployeeEmailUnit, checkUpdateEmployeePhoneNumberUnit, updateEmployeeNoPasswordById, updateEmployeeWithPasswordById, updateEmployeeStateById, findAllEmployeeWithStateActiveByPositionId } = require("../service/EmployeeService");
const { findPositionById } = require("../service/PositionService");

const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { randomIntFromInterval, createLogAdmin } = require("../utils/utils");

// Twilio sent SMS
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

// NODE Mailer
var nodemailer = require('nodemailer');
const { findAllRoomById } = require("../service/RoomService");
const { getAllRoomEmployeeByRoomId } = require("../service/RoomEmployeeService");
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'truonghoanglong588@gmail.com',
        pass: 'grkaaxhoeradbtop'
    }
});

module.exports = {
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
    },

    // ADMIN: Quản lý Nhân viên
    getAllEmployees: async (req, res) => {
        try {
            const result = await getAllEmployees();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Lấy employees thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getAllEmployees",
                error: err
            });
        }
    },
    getQuantityEmployee: async (req, res) => {
        try {
            const result = await getQuantityEmployees();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Lấy quantity employees thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getQuantityEmployees",
                error: err
            });
        }
    },
    findEmployeeByIdOrName: async (req, res) => {
        const search = req.params.search;
        try {
            const result = await findEmployeeByIdOrName(search);
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Tìm employees thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findEmployeeByIdOrName",
                error: err
            });
        }
    },
    findEmployeeById: async (req, res) => {
        const employeeId = req.body.employeeId;
        try {
            const result = await findEmployeeById(employeeId);
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Tìm employees thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findEmployeeById",
                error: err
            });
        }
    },
    createEmployee: async (req, res) => {
        // firstName, lastName, birthday, gender, phoneNumber, email, password, image, state, otp, positionId
        const employeeFirstName = req.body.employeeFirstName;
        const employeeLastName = req.body.employeeLastName;
        const employeeBirthday = req.body.employeeBirthday;
        const employeeStartJob = req.body.employeeStartJob;
        const employeeGender = req.body.employeeGender;
        const employeePhoneNumber = req.body.employeePhoneNumber;
        const employeeEmail = req.body.employeeEmail;
        let employeePassword = req.body.employeePassword;
        const employeeImage = req.body.employeeImage;
        const employeeState = 'ACTIVE';
        const employeeOtp = null;
        const positionId = req.body.positionId;

        if (!employeeFirstName) {
            return res.status(400).json({
                status: "fail",
                message: "Họ của Nhân viên không hợp lệ!"
            });
        }
        if (!employeeLastName) {
            return res.status(400).json({
                status: "fail",
                message: "Tên của Nhân viên không hợp lệ!"
            });
        }
        if (!employeeBirthday) {
            return res.status(400).json({
                status: "fail",
                message: "Ngày sinh của Nhân viên không hợp lệ!"
            });
        }
        if (!employeeStartJob) {
            return res.status(400).json({
                status: "fail",
                message: "Ngày làm việc chính thức của Nhân viên không hợp lệ!"
            });
        }
        if (!employeeGender) {
            return res.status(400).json({
                status: "fail",
                message: "Giới tính của Nhân viên không hợp lệ!"
            });
        }
        if (!employeePhoneNumber) {
            return res.status(400).json({
                status: "fail",
                message: "Số điện thoại của Nhân viên không hợp lệ!"
            });
        }
        if (!employeeEmail) {
            return res.status(400).json({
                status: "fail",
                message: "Email của Nhân viên không hợp lệ!"
            });
        }
        if (!employeePassword) {
            return res.status(400).json({
                status: "fail",
                message: "Mật khẩu của Nhân viên không hợp lệ!"
            });
        }
        if (!employeeImage) {
            return res.status(400).json({
                status: "fail",
                message: "Hình ảnh không hợp lệ!"
            });
        }
        if (!positionId || !Number.isInteger(positionId) || positionId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã chức vụ không hợp lệ!"
            });
        }

        // Mai làm tiếp check trùng email, sdt của customer
        try {
            const isEmailUnit = await checkEmployeeEmailUnit(employeeEmail);
            if (!isEmailUnit) {
                return res.status(400).json({
                    status: "fail",
                    message: "Email Nhân viên đã tồn tại!"
                });
            }
            try {
                const isPhoneNumberUnit = await checkEmployeePhoneNumberUnit(employeePhoneNumber);
                if (!isPhoneNumberUnit) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Số điện thoại Nhân viên đã tồn tại!"
                    });
                }
                // Check có position
                try {
                    const positionRes = await findPositionById(positionId);
                    if (!positionRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Chức vụ Nhân viên không tồn tại!"
                        });
                    }
                    // Create employee
                    const salt = genSaltSync(10);
                    employeePassword = hashSync(employeePassword, salt);
                    try {
                        const createEmployeeRes = await createEmployee(
                            employeeFirstName,
                            employeeLastName,
                            employeeBirthday,
                            employeeStartJob,
                            employeeGender,
                            employeePhoneNumber,
                            employeeEmail,
                            employeePassword,
                            employeeImage,
                            employeeState,
                            employeeOtp,
                            positionId
                        );
                        if (!createEmployeeRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't create employee!"
                            });
                        }

                        createLogAdmin(req, res, " vừa thêm Nhân viên mới tên: " + employeeFirstName + " " + employeeLastName, "CREATE").then(() => {
                            // Success
                            return res.status(200).json({
                                status: "success",
                                message: "Thêm Nhân viên mới thành công!"
                            });
                        });

                    } catch (err) {
                        
                    console.log("ERR: ", err)
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when create employee!",
                            error: err
                        });
                    }
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't find position!"
                    });
                }
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't check employee phone number!"
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Cann't check employee email!"
            });
        }
    },
    updateEmployee: async (req, res) => {
        const employeeFirstName = req.body.employeeFirstName;
        const employeeLastName = req.body.employeeLastName;
        const employeeBirthday = req.body.employeeBirthday;
        const employeeStartJob = req.body.employeeStartJob;
        const employeeGender = req.body.employeeGender;
        const employeePhoneNumber = req.body.employeePhoneNumber;
        const employeeEmail = req.body.employeeEmail;
        let employeePassword = req.body.employeePassword;
        const employeeImage = req.body.employeeImage;
        const positionId = req.body.positionId;
        const employeeId = req.body.employeeId;
        if (!employeeFirstName) {
            return res.status(400).json({
                status: "fail",
                message: "Họ của Nhân viên không hợp lệ!"
            });
        }
        if (!employeeLastName) {
            return res.status(400).json({
                status: "fail",
                message: "Tên của Nhân viên không hợp lệ!"
            });
        }
        if (!employeeBirthday) {
            return res.status(400).json({
                status: "fail",
                message: "Ngày sinh của Nhân viên không hợp lệ!"
            });
        }
        if (!employeeStartJob) {
            return res.status(400).json({
                status: "fail",
                message: "Ngày làm việc chính thức của Nhân viên không hợp lệ!"
            });
        }
        if (!employeeGender) {
            return res.status(400).json({
                status: "fail",
                message: "Giới tính của Nhân viên không hợp lệ!"
            });
        }
        if (!employeePhoneNumber) {
            return res.status(400).json({
                status: "fail",
                message: "Số điện thoại của Nhân viên không hợp lệ!"
            });
        }
        if (!employeeEmail) {
            return res.status(400).json({
                status: "fail",
                message: "Email của Nhân viên không hợp lệ!"
            });
        }
        if (employeePassword === undefined || employeePassword === NaN) {
            return res.status(400).json({
                status: "fail",
                message: "Mật khẩu của Nhân viên không hợp lệ!"
            });
        }
        if (!employeeImage) {
            return res.status(400).json({
                status: "fail",
                message: "Hình ảnh không hợp lệ!"
            });
        }
        if (!positionId || !Number.isInteger(positionId) || positionId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã chức vụ không hợp lệ!"
            });
        }
        if (!employeeId || !Number.isInteger(employeeId) || employeeId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã nhân viên không hợp lệ!"
            });
        }
        // Find employee
        try {
            const employeeRes = await findEmployeeById(employeeId);
            if (!employeeRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find employee!"
                });
            }
            //  Find position
            try {
                const positionRes = await findPositionById(positionId);
                if (!positionRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Chức vụ Nhân viên không tồn tại!"
                    });
                }
                // Check new email or new phone number is unit
                try {
                    const isEmailUnit = await checkUpdateEmployeeEmailUnit(employeeEmail, employeeId);
                    if (!isEmailUnit) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Email Nhân viên đã tồn tại!"
                        });
                    }
                    try {
                        const isPhoneNumberUnit = await checkUpdateEmployeePhoneNumberUnit(employeePhoneNumber, employeeId);
                        if (!isPhoneNumberUnit) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Số điện thoại Nhân viên đã tồn tại!"
                            });
                        }

                        // Update employee khi không có Password mới
                        if (employeePassword === null) {
                            try {
                                const updateEmployeeRes = await updateEmployeeNoPasswordById(
                                    employeeFirstName,
                                    employeeLastName,
                                    employeeBirthday,
                                    employeeStartJob,
                                    employeeGender,
                                    employeePhoneNumber,
                                    employeeEmail,
                                    employeeImage,
                                    positionId,
                                    employeeId
                                );
                                if (!updateEmployeeRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't update employee!"
                                    });
                                }

                                createLogAdmin(req, res, " vừa cập nhật Nhân viên mã: " + employeeId, "UPDATE").then(() => {
                                    // Success
                                    return res.status(200).json({
                                        status: "success",
                                        message: "Cập nhật Nhân viên thành công!"
                                    });
                                });

                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when update employee!",
                                    error: err
                                });
                            }
                        } else {
                            try {
                                const salt = genSaltSync(10);
                                employeePassword = hashSync(employeePassword, salt);
                                const updateEmployeeRes = await updateEmployeeWithPasswordById(
                                    employeeFirstName,
                                    employeeLastName,
                                    employeeBirthday,
                                    employeeStartJob,
                                    employeeGender,
                                    employeePhoneNumber,
                                    employeeEmail,
                                    employeePassword,
                                    employeeImage,
                                    positionId,
                                    employeeId
                                );
                                if (!updateEmployeeRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't update employee!"
                                    });
                                }

                                createLogAdmin(req, res, " vừa cập nhật Nhân viên mã: " + employeeId, "UPDATE").then(() => {
                                    // Success
                                    return res.status(200).json({
                                        status: "success",
                                        message: "Cập nhật Nhân viên thành công!"
                                    });
                                });

                            } catch (err) {
                                console.log("ERR:", err);
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when update employee!",
                                    error: err
                                });
                            }
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't check employee phone number!"
                        });
                    }
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't check employee email!"
                    });
                }
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when find position!",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when find employee!",
                error: err
            });
        }
    },
    deleteEmployee: async (req, res) => {
        const employeeId = parseInt(req.params.employeeId);
        if (!employeeId || !Number.isInteger(employeeId) || employeeId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã Nhân viên không hợp lệ!"
            });
        }
        try {
            const employeeRes = await findEmployeeById(employeeId);
            if (!employeeRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find employee!"
                });
            }
            try {
                const deleteEmployeeRes = await deleteEmployee(employeeId);
                if (!deleteEmployeeRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't delete employee!"
                    });
                }

                createLogAdmin(req, res, " vừa xóa Nhân viên mã: " + employeeId, "DELETE").then(() => {
                    // Success
                    return res.status(200).json({
                        status: "success",
                        message: "Xóa Nhân viên thành công!"
                    });
                });

            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when delete employee!",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when find employee!",
                error: err
            });
        }
    },
    updateEmployeeStateToDisable: async (req, res) => {
        const employeeState = "INACTIVE";
        const employeeId = req.body.employeeId;
        if (!employeeId || !Number.isInteger(employeeId) || employeeId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã Nhân viên không hợp lệ!"
            });
        }
        try {
            const employeeRes = await getEmployeeByEmployeeId(employeeId);
            if (!employeeRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find employee!"
                });
            }
            // Check employee state now
            let employeeStateDb = employeeRes.employee_state;
            if(employeeStateDb === "INACTIVE") {
                return res.status(400).json({
                    status: "fail",
                    message: "Nhân viên đang bị vô hiệu hóa!"
                });
            }
            try {
                const updateEmployeeStateDisableRes = await updateEmployeeStateById(employeeState, employeeId);
                if (!updateEmployeeStateDisableRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't update employee state!"
                    });
                }

                createLogAdmin(req, res, " vừa vô hiệu hóa Nhân viên có mã: " + employeeId, "UPDATE").then(() => {
                    // Success
                    return res.status(200).json({
                        status: "success",
                        message: "Vô hiệu hóa Nhân viên thành công!"
                    });
                });

            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when update employee state!",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when find employee!",
                error: err
            });
        }
    },
    updateEmployeeStateToAble: async (req, res) => {
        const employeeId = req.body.employeeId;
        const employeeState = "ACTIVE";
        if (!employeeId || !Number.isInteger(employeeId) || employeeId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã Nhân viên không hợp lệ!"
            });
        }
        try {
            const employeeRes = await getEmployeeByEmployeeId(employeeId);
            if (!employeeRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find employee!"
                });
            }
            if(employeeRes.employee_state !== "INACTIVE") {
                return res.status(400).json({
                    status: "fail",
                    message: "Nhân viên chưa bị vô hiệu hóa!"
                });
            }
            try {
                const updateEmployeeStateUnDisableRes = await updateEmployeeStateById(employeeState, employeeId);
                if (!updateEmployeeStateUnDisableRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't update employee state!"
                    });
                }

                createLogAdmin(req, res, " vừa Mở khóa cho Nhân viên có mã: " + employeeId, "UPDATE").then(() => {
                    // Success
                    return res.status(200).json({
                        status: "success",
                        message: "Mở khóa Nhân viên thành công!"
                    });
                });

            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when update employee state!",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when find employee!",
                error: err
            });
        }
    },
    // Admin: Quản lý Phòng - Thêm Nhân viên
    getAllEmployeeByPositionIdAndRoomId: async (req, res) => {
        const roomId = req.body.roomId;
        const positionId = req.body.positionId;
        if (!roomId || !Number.isInteger(roomId) || roomId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã Phòng không hợp lệ!"
            });
        }
        if (!positionId || !Number.isInteger(positionId) || positionId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã Chức vụ không hợp lệ!"
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
            // Kiểm tra tồn tại position 
            try {
                const positionRes = await findPositionById(positionId);
                if (!positionRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't find position!"
                    });
                }
                // Lấy tất cả room employee của room
                var employeeOfRoomList = []  // Mảng lưu những nhân viên id của room này
                try {
                    const roomEmployeeListRes = await getAllRoomEmployeeByRoomId(roomId);
                    if (!roomEmployeeListRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't find room employee list of room!"
                        });
                    }
                    for (var i = 0; i < roomEmployeeListRes.length; i++) {
                        employeeOfRoomList.push(roomEmployeeListRes[i].employee_id);
                    }
                    var finalEmployeeListExceptThisRoomEmployee = []; //Mảng chứa list tất cả Nhân vien mà Room không có
                    // Lấy tất cả Nhân viên và Không chứa nhân viên cùa Phòng hiện tại
                    try {
                        const employeeListRes = await findAllEmployeeWithStateActiveByPositionId(positionId);
                        if (!employeeListRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find employee list of room!"
                            });
                        }

                        for (var i = 0; i < employeeListRes.length; i++) {
                            if (employeeOfRoomList.includes(employeeListRes[i].employee_id)) {
                                continue;
                            } else {
                                finalEmployeeListExceptThisRoomEmployee.push(employeeListRes[i]);
                            }
                        }

                        // Success
                        return res.status(200).json({
                            status: "success",
                            message: "Lấy những Nhân viên mà Phòng chưa có thành công!",
                            data: finalEmployeeListExceptThisRoomEmployee
                        });

                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when find employee list of room!",
                            error: err
                        });
                    }
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when find room employee list of room!",
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
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when find room!",
                error: err
            });
        }
    },
}