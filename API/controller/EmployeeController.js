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
const { findPartyHallById } = require("../service/PartyHallService");
const { getAllPartyEmployeeByPartyHallId } = require("../service/PartyEmployeeService");
const { findTableBookingById } = require("../service/TableBookingService");
const { getAllTableEmployeeByTableBookingId } = require("../service/TableEmployeeService");
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
                message: "L???i getEmployeeByEmployeeId",
                err: err
            });
        }
    },
    getEmployees: (req, res) => {
        getEmployees((err, results) => {
            if (err) {
                console.log("L???i getEmployees: ", err);
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
                console.log("L???i login: ", err);
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
                message: "Email kh??ng h???p l???!"
            });
        }
        try {
            const employeeRes = await findEmployeeByEmail(employeeEmail);
            if (!employeeRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Ng?????i d??ng kh??ng t???n t???i",
                });
            }
            try {
                const otp = randomIntFromInterval(1000, 9999);
                const updateEmployeeOtpRes = await updateEmployeeOtpByEmail(otp, employeeEmail);
                if (!updateEmployeeOtpRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "C???p nh???t OTP ng?????i d??ng th???t b???i",
                    });
                }
                // G???i mail
                try {
                    // MAILER
                    var noidung = '';
                    noidung += '<div><font color="#41f1b6"><b>Ho??ng Long Hotel &amp; Restaurant</b></font><br/></div>';
                    noidung += '<p><b>Ch??o nh??n vi??n:</b> ' + employeeEmail + '<br />';

                    // M?? KEY c???a ph??ng
                    noidung += '<p align="justify"><b>M?? x??c th???c c???a b???n l??:</b></p>';
                    noidung += ' <table border="1px" cellpadding="10px" cellspacing="1px"width="100%"><tr><td align="center" bgcolor="#41f1b6"><fontcolor="white"><b>M?? X??C TH???C C???A B???N</b></fontcolor=></td></tr>';
                    noidung += '<tr><td class="prd-total"><b><font color="#41f1b6">' + otp + '</font></b></td></tr></table><br />';

                    noidung += '<p align="justify">??? Vui l??ng nh???p m?? x??c th???c tr??n website c???a Ho??ng Long ????? x??c th???c y??u c???u t??m l???i m???t kh???u c???a b???n.<br/><br />??? B???n c?? th??? b??? qua Email n??y n???u nh?? ch??a t???ng g???i y??u c???u t??m l???i m???t kh???u t???i Ho??ng Long.</p>';

                    // ----- Mailer Option -----
                    var mailOptions = {
                        from: 'Ho??ng Long Hotel &amp; Restaurant',
                        to: employeeEmail,
                        subject: '[Ho??ng Long] M?? x??c nh???n ????? t??m l???i m???t kh???u',
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
                    message: "M?? OTP ???? ???????c g???i v??? email c???a nh??n vi??n!",
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
                message: "Email kh??ng h???p l???!"
            });
        }
        if (!employeeOtp || !Number.isInteger(employeeOtp) || employeeOtp < 1000) {
            return res.status(400).json({
                status: "fail",
                message: "M?? OTP kh??ng h???p l???!"
            });
        }
        if (!employeePassword) {
            return res.status(400).json({
                status: "fail",
                message: "Password kh??ng h???p l???!"
            });
        }
        try {
            const employeeRes = await findEmployeeByEmail(employeeEmail);
            if (!employeeRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Nh??n vi??n kh??ng t???n t???i",
                });
            }
            const employeeIdRes = employeeRes.employee_id;
            const employeeOTPRes = employeeRes.employee_otp;
            if (employeeOtp !== employeeOTPRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "M?? OTP kh??ng ch??nh x??c",
                });
            }
            try {
                // M?? h??a m???t kh???u
                const salt = genSaltSync(10);
                employeePassword = hashSync(employeePassword, salt);
                const updatePasswordRes = await updateEmployeePasswordByEmployeeId(employeePassword, employeeIdRes);
                if (!updatePasswordRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "C???p nh???t m???t kh???u th???t b???i",
                    });
                }
                // Set null m?? otp l???i
                try {
                    const newOtp = null;
                    const updateEmployeeOtpRes = await updateEmployeeOtpByEmail(newOtp, employeeEmail);
                    if (!updateEmployeeOtpRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "C???p nh???t OTP nh??n vi??n th???t b???i",
                        });
                    }
                    // Success
                    return res.status(200).json({
                        status: "success",
                        message: "C???p nh???t l???i m???t kh???u m???i th??nh c??ng!",
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
                message: "Phone number kh??ng h???p l???!"
            });
        }
        try {
            const employeeRes = await findEmployeeByPhoneNumber(employeePhoneNumber);
            if (!employeeRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Nh??n vi??n kh??ng t???n t???i",
                });
            }
            try {
                const otp = randomIntFromInterval(1000, 9999);
                const updateEmployeeOtpRes = await updateEmployeeOtpByPhoneNumber(otp, employeePhoneNumber);
                if (!updateEmployeeOtpRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "C???p nh???t OTP nh??n vi??n th???t b???i",
                    });
                }
                // G???i SMS
                try {
                    client.messages
                        .create({
                            body: '[Ho??ng Long] M?? x??c nh???n ????? t??m l???i m???t kh???u: ' + otp,
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
                    message: "M?? OTP ???? ???????c g???i v??? s??? ??i???n tho???i c???a nh??n vi??n!",
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
                message: "Phone number kh??ng h???p l???!"
            });
        }
        if (!employeeOtp || !Number.isInteger(employeeOtp) || employeeOtp < 1000) {
            return res.status(400).json({
                status: "fail",
                message: "M?? OTP kh??ng h???p l???!"
            });
        }
        if (!employeePassword) {
            return res.status(400).json({
                status: "fail",
                message: "Password kh??ng h???p l???!"
            });
        }
        try {
            const employeeRes = await findEmployeeByPhoneNumber(employeePhoneNumber);
            if (!employeeRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Ng?????i d??ng kh??ng t???n t???i",
                });
            }
            const employeeIdRes = employeeRes.employee_id;
            const employeeOTPRes = employeeRes.employee_otp;
            if (employeeOtp !== employeeOTPRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "M?? OTP kh??ng ch??nh x??c",
                });
            }
            try {
                // M?? h??a m???t kh???u
                const salt = genSaltSync(10);
                employeePassword = hashSync(employeePassword, salt);
                const updatePasswordRes = await updateEmployeePasswordByEmployeeId(employeePassword, employeeIdRes);
                if (!updatePasswordRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "C???p nh???t m???t kh???u th???t b???i",
                    });
                }
                // Set null m?? otp l???i
                try {
                    const newOtp = null;
                    const updateEmployeeOtpRes = await updateEmployeeOtpByPhoneNumber(newOtp, employeePhoneNumber);
                    if (!updateEmployeeOtpRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "C???p nh???t OTP nh??n vi??n th???t b???i",
                        });
                    }
                    // Success
                    return res.status(200).json({
                        status: "success",
                        message: "C???p nh???t l???i m???t kh???u m???i th??nh c??ng!",
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

    // ADMIN: Qu???n l?? Nh??n vi??n
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
                message: "L???y employees th??nh c??ng",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "L???i getAllEmployees",
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
                message: "L???y quantity employees th??nh c??ng",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "L???i getQuantityEmployees",
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
                message: "T??m employees th??nh c??ng",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "L???i findEmployeeByIdOrName",
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
                message: "T??m employees th??nh c??ng",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "L???i findEmployeeById",
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
                message: "H??? c???a Nh??n vi??n kh??ng h???p l???!"
            });
        }
        if (!employeeLastName) {
            return res.status(400).json({
                status: "fail",
                message: "T??n c???a Nh??n vi??n kh??ng h???p l???!"
            });
        }
        if (!employeeBirthday) {
            return res.status(400).json({
                status: "fail",
                message: "Ng??y sinh c???a Nh??n vi??n kh??ng h???p l???!"
            });
        }
        if (!employeeStartJob) {
            return res.status(400).json({
                status: "fail",
                message: "Ng??y l??m vi???c ch??nh th???c c???a Nh??n vi??n kh??ng h???p l???!"
            });
        }
        if (!employeeGender) {
            return res.status(400).json({
                status: "fail",
                message: "Gi???i t??nh c???a Nh??n vi??n kh??ng h???p l???!"
            });
        }
        if (!employeePhoneNumber) {
            return res.status(400).json({
                status: "fail",
                message: "S??? ??i???n tho???i c???a Nh??n vi??n kh??ng h???p l???!"
            });
        }
        if (!employeeEmail) {
            return res.status(400).json({
                status: "fail",
                message: "Email c???a Nh??n vi??n kh??ng h???p l???!"
            });
        }
        if (!employeePassword) {
            return res.status(400).json({
                status: "fail",
                message: "M???t kh???u c???a Nh??n vi??n kh??ng h???p l???!"
            });
        }
        if (!employeeImage) {
            return res.status(400).json({
                status: "fail",
                message: "H??nh ???nh kh??ng h???p l???!"
            });
        }
        if (!positionId || !Number.isInteger(positionId) || positionId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "M?? ch???c v??? kh??ng h???p l???!"
            });
        }

        // Mai l??m ti???p check tr??ng email, sdt c???a customer
        try {
            const isEmailUnit = await checkEmployeeEmailUnit(employeeEmail);
            if (!isEmailUnit) {
                return res.status(400).json({
                    status: "fail",
                    message: "Email Nh??n vi??n ???? t???n t???i!"
                });
            }
            try {
                const isPhoneNumberUnit = await checkEmployeePhoneNumberUnit(employeePhoneNumber);
                if (!isPhoneNumberUnit) {
                    return res.status(400).json({
                        status: "fail",
                        message: "S??? ??i???n tho???i Nh??n vi??n ???? t???n t???i!"
                    });
                }
                // Check c?? position
                try {
                    const positionRes = await findPositionById(positionId);
                    if (!positionRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Ch???c v??? Nh??n vi??n kh??ng t???n t???i!"
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

                        createLogAdmin(req, res, " v???a th??m Nh??n vi??n m???i t??n: " + employeeFirstName + " " + employeeLastName, "CREATE").then(() => {
                            // Success
                            return res.status(200).json({
                                status: "success",
                                message: "Th??m Nh??n vi??n m???i th??nh c??ng!"
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
                message: "H??? c???a Nh??n vi??n kh??ng h???p l???!"
            });
        }
        if (!employeeLastName) {
            return res.status(400).json({
                status: "fail",
                message: "T??n c???a Nh??n vi??n kh??ng h???p l???!"
            });
        }
        if (!employeeBirthday) {
            return res.status(400).json({
                status: "fail",
                message: "Ng??y sinh c???a Nh??n vi??n kh??ng h???p l???!"
            });
        }
        if (!employeeStartJob) {
            return res.status(400).json({
                status: "fail",
                message: "Ng??y l??m vi???c ch??nh th???c c???a Nh??n vi??n kh??ng h???p l???!"
            });
        }
        if (!employeeGender) {
            return res.status(400).json({
                status: "fail",
                message: "Gi???i t??nh c???a Nh??n vi??n kh??ng h???p l???!"
            });
        }
        if (!employeePhoneNumber) {
            return res.status(400).json({
                status: "fail",
                message: "S??? ??i???n tho???i c???a Nh??n vi??n kh??ng h???p l???!"
            });
        }
        if (!employeeEmail) {
            return res.status(400).json({
                status: "fail",
                message: "Email c???a Nh??n vi??n kh??ng h???p l???!"
            });
        }
        if (employeePassword === undefined || employeePassword === NaN) {
            return res.status(400).json({
                status: "fail",
                message: "M???t kh???u c???a Nh??n vi??n kh??ng h???p l???!"
            });
        }
        if (!employeeImage) {
            return res.status(400).json({
                status: "fail",
                message: "H??nh ???nh kh??ng h???p l???!"
            });
        }
        if (!positionId || !Number.isInteger(positionId) || positionId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "M?? ch???c v??? kh??ng h???p l???!"
            });
        }
        if (!employeeId || !Number.isInteger(employeeId) || employeeId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "M?? nh??n vi??n kh??ng h???p l???!"
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
                        message: "Ch???c v??? Nh??n vi??n kh??ng t???n t???i!"
                    });
                }
                // Check new email or new phone number is unit
                try {
                    const isEmailUnit = await checkUpdateEmployeeEmailUnit(employeeEmail, employeeId);
                    if (!isEmailUnit) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Email Nh??n vi??n ???? t???n t???i!"
                        });
                    }
                    try {
                        const isPhoneNumberUnit = await checkUpdateEmployeePhoneNumberUnit(employeePhoneNumber, employeeId);
                        if (!isPhoneNumberUnit) {
                            return res.status(400).json({
                                status: "fail",
                                message: "S??? ??i???n tho???i Nh??n vi??n ???? t???n t???i!"
                            });
                        }

                        // Update employee khi kh??ng c?? Password m???i
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

                                createLogAdmin(req, res, " v???a c???p nh???t Nh??n vi??n m??: " + employeeId, "UPDATE").then(() => {
                                    // Success
                                    return res.status(200).json({
                                        status: "success",
                                        message: "C???p nh???t Nh??n vi??n th??nh c??ng!"
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

                                createLogAdmin(req, res, " v???a c???p nh???t Nh??n vi??n m??: " + employeeId, "UPDATE").then(() => {
                                    // Success
                                    return res.status(200).json({
                                        status: "success",
                                        message: "C???p nh???t Nh??n vi??n th??nh c??ng!"
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
                message: "M?? Nh??n vi??n kh??ng h???p l???!"
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

                createLogAdmin(req, res, " v???a x??a Nh??n vi??n m??: " + employeeId, "DELETE").then(() => {
                    // Success
                    return res.status(200).json({
                        status: "success",
                        message: "X??a Nh??n vi??n th??nh c??ng!"
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
                message: "M?? Nh??n vi??n kh??ng h???p l???!"
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
            if (employeeStateDb === "INACTIVE") {
                return res.status(400).json({
                    status: "fail",
                    message: "Nh??n vi??n ??ang b??? v?? hi???u h??a!"
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

                createLogAdmin(req, res, " v???a v?? hi???u h??a Nh??n vi??n c?? m??: " + employeeId, "UPDATE").then(() => {
                    // Success
                    return res.status(200).json({
                        status: "success",
                        message: "V?? hi???u h??a Nh??n vi??n th??nh c??ng!"
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
                message: "M?? Nh??n vi??n kh??ng h???p l???!"
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
            if (employeeRes.employee_state !== "INACTIVE") {
                return res.status(400).json({
                    status: "fail",
                    message: "Nh??n vi??n ch??a b??? v?? hi???u h??a!"
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

                createLogAdmin(req, res, " v???a M??? kh??a cho Nh??n vi??n c?? m??: " + employeeId, "UPDATE").then(() => {
                    // Success
                    return res.status(200).json({
                        status: "success",
                        message: "M??? kh??a Nh??n vi??n th??nh c??ng!"
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
    // Admin: Qu???n l?? Ph??ng - Th??m Nh??n vi??n
    getAllEmployeeByPositionIdAndRoomId: async (req, res) => {
        const roomId = req.body.roomId;
        const positionId = req.body.positionId;
        if (!roomId || !Number.isInteger(roomId) || roomId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "M?? Ph??ng kh??ng h???p l???!"
            });
        }
        if (!positionId || !Number.isInteger(positionId) || positionId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "M?? Ch???c v??? kh??ng h???p l???!"
            });
        }
        // Ki???m tra t???n t???i room
        try {
            const roomRes = await findAllRoomById(roomId);
            if (!roomRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find room!"
                });
            }
            // Ki???m tra t???n t???i position 
            try {
                const positionRes = await findPositionById(positionId);
                if (!positionRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't find position!"
                    });
                }
                // L???y t???t c??? room employee c???a room
                var employeeOfRoomList = []  // M???ng l??u nh???ng nh??n vi??n id c???a room n??y
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
                    var finalEmployeeListExceptThisRoomEmployee = []; //M???ng ch???a list t???t c??? Nh??n vien m?? Room kh??ng c??
                    // L???y t???t c??? Nh??n vi??n v?? Kh??ng ch???a nh??n vi??n c??a Ph??ng hi???n t???i
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
                            message: "L???y nh???ng Nh??n vi??n m?? Ph??ng ch??a c?? th??nh c??ng!",
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
    // Admin: Qu???n l?? Ti???c - Th??m Nh??n vi??n
    getAllEmployeeByPositionIdAndPartyHallId: async (req, res) => {
        const partyHallId = req.body.partyHallId;
        const positionId = req.body.positionId;
        if (!partyHallId || !Number.isInteger(partyHallId) || partyHallId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "M?? S???nh kh??ng h???p l???!"
            });
        }
        if (!positionId || !Number.isInteger(positionId) || positionId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "M?? Ch???c v??? kh??ng h???p l???!"
            });
        }
        // Ki???m tra t???n t???i party hall
        try {
            const partyHallRes = await findPartyHallById(partyHallId);
            if (!partyHallRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find party hall!"
                });
            }
            // Ki???m tra t???n t???i position 
            try {
                const positionRes = await findPositionById(positionId);
                if (!positionRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't find position!"
                    });
                }
                // L???y t???t c??? party employee c???a party
                var employeeOfPartyHallList = []  // M???ng l??u nh???ng nh??n vi??n id c???a room n??y
                try {
                    const partyEmployeeListRes = await getAllPartyEmployeeByPartyHallId(partyHallId);
                    if (!partyEmployeeListRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't find party employee list of party hall!"
                        });
                    }
                    for (var i = 0; i < partyEmployeeListRes.length; i++) {
                        employeeOfPartyHallList.push(partyEmployeeListRes[i].employee_id);
                    }
                    var finalEmployeeListExceptThisPartyEmployee = []; //M???ng ch???a list t???t c??? Nh??n vien m?? Party hall kh??ng c??
                    // L???y t???t c??? Nh??n vi??n v?? Kh??ng ch???a nh??n vi??n c??a Ph??ng hi???n t???i
                    try {
                        const employeeListRes = await findAllEmployeeWithStateActiveByPositionId(positionId);
                        if (!employeeListRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find employee list of room!"
                            });
                        }

                        for (var i = 0; i < employeeListRes.length; i++) {
                            if (employeeOfPartyHallList.includes(employeeListRes[i].employee_id)) {
                                continue;
                            } else {
                                finalEmployeeListExceptThisPartyEmployee.push(employeeListRes[i]);
                            }
                        }

                        // Success
                        return res.status(200).json({
                            status: "success",
                            message: "L???y nh???ng Nh??n vi??n m?? S???nh ch??a c?? th??nh c??ng!",
                            data: finalEmployeeListExceptThisPartyEmployee
                        });

                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when find employee list of party hall!",
                            error: err
                        });
                    }
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when find paty employee list of paty hall!",
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
                message: "Error when find party hall!",
                error: err
            });
        }
    },
    // Admin: Qu???n l?? B??n - Th??m Nh??n vi??n
    getAllEmployeeByPositionIdAndTableBookingId: async (req, res) => {
        const tableBookingId = req.body.tableBookingId;
        const positionId = req.body.positionId;
        if (!tableBookingId || !Number.isInteger(tableBookingId) || tableBookingId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "M?? B??n kh??ng h???p l???!"
            });
        }
        if (!positionId || !Number.isInteger(positionId) || positionId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "M?? Ch???c v??? kh??ng h???p l???!"
            });
        }
        // Ki???m tra t???n t???i table booking
        try {
            const tableBookingRes = await findTableBookingById(tableBookingId);
            if (!tableBookingRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find table booking!"
                });
            }
            // Ki???m tra t???n t???i position 
            try {
                const positionRes = await findPositionById(positionId);
                if (!positionRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't find position!"
                    });
                }
                // L???y t???t c??? table employee c???a party
                var employeeOfTableBookingList = []  // M???ng l??u nh???ng nh??n vi??n id c???a room n??y
                try {
                    const tableEmployeeListRes = await getAllTableEmployeeByTableBookingId(tableBookingId);
                    if (!tableEmployeeListRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't find table employee list of table booking!"
                        });
                    }
                    for (var i = 0; i < tableEmployeeListRes.length; i++) {
                        employeeOfTableBookingList.push(tableEmployeeListRes[i].employee_id);
                    }
                    var finalEmployeeListExceptThisTableEmployee = []; //M???ng ch???a list t???t c??? Nh??n vien m?? Party hall kh??ng c??
                    // L???y t???t c??? Nh??n vi??n v?? Kh??ng ch???a nh??n vi??n c??a Ph??ng hi???n t???i
                    try {
                        const employeeListRes = await findAllEmployeeWithStateActiveByPositionId(positionId);
                        if (!employeeListRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find employee list of table!"
                            });
                        }

                        for (var i = 0; i < employeeListRes.length; i++) {
                            if (employeeOfTableBookingList.includes(employeeListRes[i].employee_id)) {
                                continue;
                            } else {
                                finalEmployeeListExceptThisTableEmployee.push(employeeListRes[i]);
                            }
                        }

                        // Success
                        return res.status(200).json({
                            status: "success",
                            message: "L???y nh???ng Nh??n vi??n m?? B??n ch??a c?? th??nh c??ng!",
                            data: finalEmployeeListExceptThisTableEmployee
                        });

                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when find employee list of party hall!",
                            error: err
                        });
                    }
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when find table employee list of table!",
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
                message: "Error when find table booking!",
                error: err
            });
        }
    },
}