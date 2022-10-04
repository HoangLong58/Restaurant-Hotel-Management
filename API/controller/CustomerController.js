const { createCustomer, getCustomerByCustomerId, getCustomers, updateCustomer, deleteCustomer, getCustomerByEmail, checkEmailUnit, checkPhoneNumberUnit, getCustomerByEmailOrPhoneNumber } = require("../service/CustomerService");

const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");

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
                    expiresIn: "1h"
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
    }
}