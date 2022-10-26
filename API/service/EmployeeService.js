const con = require("../config/database.config");

module.exports = {
    checkEmailUnit: (data) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select * from employee where employee_email = ?`,
                [
                    data.email
                ],
                (error, results, fields) => {
                    if (error) reject(error);
                    if (!results[0]) {
                        return resolve(true);
                    }
                    return resolve(false);
                }
            );
        });
    },
    checkPhoneNumberUnit: (data) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select * from employee where employee_phone_number = ?`,
                [
                    data.phoneNumber
                ],
                (error, results, fields) => {
                    if (error) reject(error);
                    if (!results[0]) {
                        return resolve(true);
                    }
                    return resolve(false);
                }
            );
        });
    },
    createEmployee: (data, callBack) => {
        con.query(
            `insert into employee( employee_first_name, employee_last_name, employee_birthday, employee_gender, employee_phone_number, employee_email, employee_password, employee_image, employee_state, employee_otp, position_id)
                values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.firstName,
                data.lastName,
                "",
                "",
                data.phoneNumber,
                data.email,
                data.password,
                null,
                "INIT",
                null,
                data.positionId
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    getEmployees: callBack => {
        con.query(
            `select employee_id, employee_first_name, employee_last_name, employee_birthday, employee_gender, employee_phone_number, employee_email, employee_password, employee_image, employee_state, employee_otp, position_id from employee`,
            [],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    getEmployeeByEmployeeId: (employeeId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select employee_id, employee_first_name, employee_last_name, employee_birthday, employee_gender, employee_phone_number, employee_email, employee_password, employee_image, employee_state, employee_otp, position_id from employee where employee_id = ?`,
                [employeeId],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        });
    },
    updateEmployee: (data, callBack) => {
        con.query(
            `update employee set employee_first_name = ?, employee_last_name = ?, employee_birthday = ?, employee_gender = ?, employee_phone_number = ?, employee_email = ?, employee_password = ?, employee_state = ? where employee_id = ?`,
            [
                data.firstName,
                data.lastName,
                data.birthday,
                data.gender,
                data.phoneNumber,
                data.email,
                data.password,
                data.state,
                data.employeeId
            ],
            (error, results, fields) => {
                if (error) {
                    callBack(error);
                }
                return callBack(null, results);
            }
        )
    },
    deleteEmployee: (data, callBack) => {
        con.query(
            `delete from employee where employee_id = ?`,
            [data.employeeId],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results[0]);
            }
        );
    },
    getEmployeeByEmail: (email, callBack) => {
        con.query(
            `select * from employee where employee_email = ?`,
            [email],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results[0]);
            }
        );
    },
    getEmployeeByEmailOrPhoneNumber: (email, callBack) => {
        con.query(
            `select 
            e.employee_id, 
            e.employee_first_name,
            e.employee_last_name, 
            e.employee_birthday,
            e.employee_gender, 
            e.employee_phone_number, 
            e.employee_email, 
            e.employee_password, 
            e.employee_image, 
            e.employee_state, 
            e.employee_otp,
            e.position_id,
            p.position_name
            from employee e
            join position p on e.position_id = p.position_id
            where e.employee_email = ? 
            or e.employee_phone_number = ?`,
            [email, email],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results[0]);
            }
        );
    },
    // Func: Quên mật khẩu - EMAIL
    findEmployeeByEmail: (employeeEmail) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                employee_id, 
                employee_first_name,
                employee_last_name, 
                employee_birthday,
                employee_gender, 
                employee_phone_number, 
                employee_email, 
                employee_password, 
                employee_image, 
                employee_state, 
                employee_otp,
                position_id
                from employee
                where employee_email = ?
                `,
                [employeeEmail],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        })
    },
    updateEmployeeOtpByEmail: (employeeOtp, employeeEmail) => {
        return new Promise((resolve, reject) => {
            con.query(
                `update
                employee
                set employee_otp = ?
                where employee_email = ?`,
                [employeeOtp, employeeEmail],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    if (!results) {
                        return resolve(false);
                    }
                    return resolve(true);
                }
            );
        })
    },
    // Func: Quên mật khẩu - SMS
    findEmployeeByPhoneNumber: (employeePhoneNumber) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                employee_id, 
                employee_first_name,
                employee_last_name, 
                employee_birthday,
                employee_gender, 
                employee_phone_number, 
                employee_email, 
                employee_password, 
                employee_image, 
                employee_state, 
                employee_otp,
                position_id 
                from employee
                where employee_phone_number = ?
                `,
                [employeePhoneNumber],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        })
    },
    updateEmployeeOtpByPhoneNumber: (employeeOtp, employeePhoneNumber) => {
        return new Promise((resolve, reject) => {
            con.query(
                `update
                employee
                set employee_otp = ?
                where employee_phone_number = ?`,
                [employeeOtp, employeePhoneNumber],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    if (!results) {
                        return resolve(false);
                    }
                    return resolve(true);
                }
            );
        })
    },
    updateEmployeePasswordByEmployeeId: (employeePassword, employeeId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `update
                employee
                set employee_password = ?
                where employee_id = ?`,
                [employeePassword, employeeId],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    if (!results) {
                        return resolve(false);
                    }
                    return resolve(true);
                }
            );
        })
    },
};