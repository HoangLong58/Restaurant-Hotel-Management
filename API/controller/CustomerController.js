const { createCustomer, getCustomerByCustomerId, getCustomers, updateCustomer, deleteCustomer, getCustomerByEmail } = require("../service/CustomerService");

const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");

module.exports = {
    createCustomer: (req, res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);
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
    },
    getCustomerByCustomerId: (req, res) => {
        const customerId = req.params.customerId;
        getCustomerByCustomerId(customerId, (err, results) => {
            if (err) {
                console.log("Lỗi getCustomerByCustomerId: ", err);
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
                data: results
            });
        });
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
            if(!results) {
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
            if(err) {
                console.log("Lỗi deleteCustomer: ", err);
                return;
            }
            if(!results) {
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
        getCustomerByEmail(body.email, (err, results) => {
            if(err) {
                console.log("Lỗi login: ", err);
            }
            if(!results) {
                return res.json({
                    status: "fail",
                    message: "Invalid email or password"
                });
            }
            const result = compareSync(body.password, results.password);
            if(result) {
                result.password = undefined;
                const jsontoken = sign({ result: results }, process.env.JWT_SEC, {
                    expiresIn: "1h"
                });
                return res.json({
                    status: "success",
                    message: "Login successfully",
                    token: jsontoken
                });
            } else {
                return res.json({
                    status: "fail",
                    message: "Invalid email or password"
                });
            }
        });
    }
}