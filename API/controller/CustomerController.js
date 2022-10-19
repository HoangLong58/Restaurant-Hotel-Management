const { createCustomer, getCustomerByCustomerId, getCustomers, updateCustomer, deleteCustomer, getCustomerByEmail, checkEmailUnit, checkPhoneNumberUnit, getCustomerByEmailOrPhoneNumber, findCustomerByEmail, updateCustomerOtpByEmail, updateCustomerPasswordByCustomerId, findCustomerByPhoneNumber, updateCustomerOtpByPhoneNumber } = require("../service/CustomerService");

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
    createCustomer: async (req, res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);

        // Check email & phone number
        let isEmailUnit = await checkEmailUnit(body);
        let isPhoneNumberUnit = await checkPhoneNumberUnit(body);

        if (isEmailUnit && isPhoneNumberUnit) {
            createCustomer(body, (err, results) => {
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
    getCustomerByCustomerId: async (req, res) => {
        const customerId = req.params.customerId;
        try {
            const result = await getCustomerByCustomerId(customerId);
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
                message: "Lỗi getCustomerByCustomerId",
                err: err
            });
        }
    },
    getCustomers: (req, res) => {
        getCustomers((err, results) => {
            if (err) {
                console.log("Lỗi getCustomers: ", err);
                return;
            }
            return res.json({
                status: "success",
                data: results
            });
        })
    },
    updateCustomer: (req, res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);
        updateCustomer(body, (err, results) => {
            if (err) {
                console.log("Lỗi updateCustomer: ", err);
                return;
            }
            if (!results) {
                return res.json({
                    status: "fail",
                    message: "Failed to update user"
                });
            }
            return res.json({
                status: "success",
                message: "User updated successfully"
            })
        })
    },
    deleteCustomer: (req, res) => {
        const data = req.body;
        deleteCustomer(data, (err, results) => {
            if (err) {
                console.log("Lỗi deleteCustomer: ", err);
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
                message: "Customer deleted successfully"
            });
        });
    },
    login: (req, res) => {
        const body = req.body;
        getCustomerByEmailOrPhoneNumber(body.email, (err, results) => {
            if (err) {
                console.log("Lỗi login: ", err);
            }
            if (!results) {
                return res.status(400).json({
                    status: "fail",
                    message: "Account does not exist"
                });
            }
            const result = compareSync(body.password, results.customer_password);
            if (result) {
                results.customer_password = undefined;
                const jsontoken = sign({ result: results }, process.env.JWT_SEC, {
                    // expiresIn: "1h"
                    expiresIn: "365d"
                });
                return res.status(200).json({
                    status: "success",
                    message: "Login successfully",
                    customer: results,
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
    updateCustomerOtpByEmail: async (req, res) => {
        const customerEmail = req.body.customerEmail;
        if (!customerEmail) {
            return res.status(400).json({
                status: "fail",
                message: "Email không hợp lệ!"
            });
        }
        try {
            const customerRes = await findCustomerByEmail(customerEmail);
            if (!customerRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Người dùng không tồn tại",
                });
            }
            try {
                const otp = randomIntFromInterval(1000, 9999);
                const updateCustomerOtpRes = await updateCustomerOtpByEmail(otp, customerEmail);
                if (!updateCustomerOtpRes) {
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
                    noidung += '<p><b>Chào khách hàng:</b> ' + customerEmail + '<br />';

                    // Mã KEY của phòng
                    noidung += '<p align="justify"><b>Mã xác thực của bạn là:</b></p>';
                    noidung += ' <table border="1px" cellpadding="10px" cellspacing="1px"width="100%"><tr><td align="center" bgcolor="#41f1b6"><fontcolor="white"><b>MÃ XÁC THỰC CỦA BẠN</b></fontcolor=></td></tr>';
                    noidung += '<tr><td class="prd-total"><b><font color="#41f1b6">' + otp + '</font></b></td></tr></table><br />';

                    noidung += '<p align="justify">• Vui lòng nhập mã xác thực trên website của Hoàng Long để xác thực yêu cầu tìm lại mật khẩu của bạn.<br/><br />• Bạn có thể bỏ qua Email này nếu như chưa từng gửi yêu cầu tìm lại mật khẩu tại Hoàng Long.</p>';

                    // ----- Mailer Option -----
                    var mailOptions = {
                        from: 'Hoàng Long Hotel &amp; Restaurant',
                        to: customerEmail,
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
                    message: "Mã OTP đã được gửi về email của quý khách!",
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
                message: "Error when find customer by email!",
                error: err
            });
        }
    },
    updateCustomerPasswordWhenForgotPassword: async (req, res) => {
        const customerEmail = req.body.customerEmail;
        const customerOtp = req.body.customerOtp;
        let customerPassword = req.body.customerPassword;

        if (!customerEmail) {
            return res.status(400).json({
                status: "fail",
                message: "Email không hợp lệ!"
            });
        }
        if (!customerOtp || !Number.isInteger(customerOtp) || customerOtp < 1000) {
            return res.status(400).json({
                status: "fail",
                message: "Mã OTP không hợp lệ!"
            });
        }
        if (!customerPassword) {
            return res.status(400).json({
                status: "fail",
                message: "Password không hợp lệ!"
            });
        }
        try {
            const customerRes = await findCustomerByEmail(customerEmail);
            if (!customerRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Người dùng không tồn tại",
                });
            }
            const customerIdRes = customerRes.customer_id;
            const customerOTPRes = customerRes.customer_otp;
            if (customerOtp !== customerOTPRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Mã OTP không chính xác",
                });
            }
            try {
                // Mã hóa mật khẩu
                const salt = genSaltSync(10);
                customerPassword = hashSync(customerPassword, salt);
                const updatePasswordRes = await updateCustomerPasswordByCustomerId(customerPassword, customerIdRes);
                if (!updatePasswordRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cập nhật mật khẩu thất bại",
                    });
                }
                // Set null mã otp lại
                try {
                    const newOtp = null;
                    const updateCustomerOtpRes = await updateCustomerOtpByEmail(newOtp, customerEmail);
                    if (!updateCustomerOtpRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cập nhật OTP người dùng thất bại",
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
                message: "Error when find customer by email!",
                error: err
            });
        }
    },
    // Func: Forgot password - Phone number
    updateCustomerOtpByPhoneNumber: async (req, res) => {
        const customerPhoneNumber = req.body.customerPhoneNumber;
        if (!customerPhoneNumber) {
            return res.status(400).json({
                status: "fail",
                message: "Phone number không hợp lệ!"
            });
        }
        try {
            const customerRes = await findCustomerByPhoneNumber(customerPhoneNumber);
            if (!customerRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Người dùng không tồn tại",
                });
            }
            try {
                const otp = randomIntFromInterval(1000, 9999);
                const updateCustomerOtpRes = await updateCustomerOtpByPhoneNumber(otp, customerPhoneNumber);
                if (!updateCustomerOtpRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cập nhật OTP người dùng thất bại",
                    });
                }
                // Gửi SMS
                try {
                    client.messages
                        .create({
                            body: '[Hoàng Long] Mã xác nhận để tìm lại mật khẩu: ' + otp,
                            from: '+17866928411',
                            to: '+84' + customerPhoneNumber
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
                    message: "Mã OTP đã được gửi về số điện thoại của quý khách!",
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
                message: "Error when find customer by phone number!",
                error: err
            });
        }
    },
    updateCustomerPasswordWhenForgotPasswordPhoneNumber: async (req, res) => {
        const customerPhoneNumber = req.body.customerPhoneNumber;
        const customerOtp = req.body.customerOtp;
        let customerPassword = req.body.customerPassword;

        if (!customerPhoneNumber) {
            return res.status(400).json({
                status: "fail",
                message: "Phone number không hợp lệ!"
            });
        }
        if (!customerOtp || !Number.isInteger(customerOtp) || customerOtp < 1000) {
            return res.status(400).json({
                status: "fail",
                message: "Mã OTP không hợp lệ!"
            });
        }
        if (!customerPassword) {
            return res.status(400).json({
                status: "fail",
                message: "Password không hợp lệ!"
            });
        }
        try {
            const customerRes = await findCustomerByPhoneNumber(customerPhoneNumber);
            if (!customerRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Người dùng không tồn tại",
                });
            }
            const customerIdRes = customerRes.customer_id;
            const customerOTPRes = customerRes.customer_otp;
            if (customerOtp !== customerOTPRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Mã OTP không chính xác",
                });
            }
            try {
                // Mã hóa mật khẩu
                const salt = genSaltSync(10);
                customerPassword = hashSync(customerPassword, salt);
                const updatePasswordRes = await updateCustomerPasswordByCustomerId(customerPassword, customerIdRes);
                if (!updatePasswordRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cập nhật mật khẩu thất bại",
                    });
                }
                // Set null mã otp lại
                try {
                    const newOtp = null;
                    const updateCustomerOtpRes = await updateCustomerOtpByPhoneNumber(newOtp, customerPhoneNumber);
                    if (!updateCustomerOtpRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cập nhật OTP người dùng thất bại",
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
                message: "Error when find customer by phone number!",
                error: err
            });
        }
    }
}