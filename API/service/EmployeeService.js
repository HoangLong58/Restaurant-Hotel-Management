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
            and e.employee_state = 'ACTIVE'
            or e.employee_phone_number = ?
            and e.employee_state = 'ACTIVE'`,
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
                and employee_state = 'ACTIVE'
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
                and employee_state = 'ACTIVE'
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

    // ADMIN: Quản lý Nhân viên
    getAllEmployees: () => {
        return new Promise((resolve, reject) => {
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
                p.position_name,
                p.position_salary,
                p.position_bonus_salary
                from employee e
                join position p on e.position_id = p.position_id`,
                [],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    },
    getQuantityEmployees: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                count(employee_id) as quantityEmployee 
                from employee`,
                [],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        });
    },
    findEmployeeByIdOrName: (search) => {
        return new Promise((resolve, reject) => {
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
                p.position_name,
                p.position_salary,
                p.position_bonus_salary
                from employee e
                join position p on e.position_id = p.position_id
                where e.employee_first_name like concat('%', ?, '%')
                or e.employee_last_name like concat('%', ?, '%')
                or e.employee_phone_number = ?
                or e.employee_email = ?
                or e.employee_id = ?`,
                [search, search, search, search, search],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    },
    findEmployeeById: (id) => {
        return new Promise((resolve, reject) => {
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
                p.position_name,
                p.position_salary,
                p.position_bonus_salary
                from employee e
                join position p on e.position_id = p.position_id
                where e.employee_id = ?`,
                [id],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        });
    },
    createEmployee: (firstName, lastName, birthday, gender, phoneNumber, email, password, image, state, otp, positionId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `insert 
                into employee
                (
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
                )
                values
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [firstName, lastName, birthday, gender, phoneNumber, email, password, image, state, otp, positionId],
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
        });
    },
    updateEmployeeNoPasswordById: (firstName, lastName, birthday, gender, phoneNumber, email, image, positionId, employeeId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `update 
                employee 
                set employee_first_name = ?, 
                employee_last_name = ?,
                employee_birthday = ?,
                employee_gender = ?,
                employee_phone_number = ?,
                employee_email = ?,
                employee_image = ?,
                position_id  = ?
                where employee_id  = ?`,
                [firstName, lastName, birthday, gender, phoneNumber, email, image, positionId, employeeId],
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
        });
    },
    updateEmployeeWithPasswordById: (firstName, lastName, birthday, gender, phoneNumber, email, password, image, positionId, employeeId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `update 
                employee 
                set employee_first_name = ?, 
                employee_last_name = ?,
                employee_birthday = ?,
                employee_gender = ?,
                employee_phone_number = ?,
                employee_email = ?,
                employee_password = ?,
                employee_image = ?,
                position_id  = ?
                where employee_id  = ?`,
                [firstName, lastName, birthday, gender, phoneNumber, email, password, image, positionId, employeeId],
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
        });
    },
    updateEmployeeStateById: (state, id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `update 
                employee 
                set employee_state = ?
                where employee_id = ?`,
                [state, id],
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
        });
    },
    deleteEmployee: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `delete 
                from employee
                where employee_id = ?`,
                [id],
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
        });
    },
    checkEmployeeEmailUnit: (email) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select * from employee where employee_email = ?`,
                [email],
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
    checkEmployeePhoneNumberUnit: (phoneNumber) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select * from employee where employee_phone_number = ?`,
                [phoneNumber],
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
    checkUpdateEmployeeEmailUnit: (email, id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                * 
                from employee 
                where employee_email = ? 
                and employee_id != ?`,
                [email, id],
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
    checkUpdateEmployeePhoneNumberUnit: (phoneNumber, id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                * 
                from employee 
                where employee_phone_number = ?
                and employee_id != ?`,
                [phoneNumber, id],
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
    updateEmployeeStateById: (state, id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `update 
                employee 
                set employee_state = ?
                where employee_id = ?`,
                [state, id],
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
        });
    },
};