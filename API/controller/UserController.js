const { create, getUserByCustomerId, getUsers, updateUser, deleteUser } = require("../service/UserService");

const { genSaltSync, hashSync } = require("bcrypt");

module.exports = {
    createUser: (req, res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);
        create(body, (err, results) => {
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
    getUserByCustomerId: (req, res) => {
        const customerId = req.params.customerId;
        getUserByCustomerId(customerId, (err, results) => {
            if (err) {
                console.log("Lỗi getUserByCustomerId: ", err);
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
    getUsers: (req, res) => {
        getUsers((err, results) => {
            if (err) {
                console.log("Lỗi getUsers: ", err);
                return;
            }
            return res.json({
                status: "success",
                data: results
            });
        })
    },
    updateUser: (req, res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);
        updateUser(body, (err, results) => {
            if (err) {
                console.log("Lỗi updateUser: ", err);
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
    deleteUser: (req, res) => {
        const data = req.body;
        deleteUser(data, (err, results) => {
            if(err) {
                console.log("Lỗi deleteUser: ", err);
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
                message: "User deleted successfully"
            });
        });
    }
}