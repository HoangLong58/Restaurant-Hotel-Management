const con = require("../config/database.config");

module.exports = {
    checkEmailUnit: (data) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select * from customer where customer_email = ?`,
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
                `select * from customer where customer_phone_number = ?`,
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
    createCustomer: (data, callBack) => {
        con.query(
            `insert 
            into customer
            ( 
                customer_first_name, 
                customer_last_name, 
                customer_birthday, 
                customer_gender, 
                customer_phone_number, 
                customer_email, 
                customer_password, 
                customer_image, 
                customer_state, 
                customer_otp
            )
            values
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
                null
            ],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    getCustomers: callBack => {
        con.query(
            `select customer_id, customer_first_name, customer_last_name, customer_birthday, customer_gender, customer_phone_number, customer_email, customer_password, customer_image, customer_state, customer_otp from customer`,
            [],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    getCustomerByCustomerId: (customerId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select customer_id, customer_first_name, customer_last_name, customer_birthday, customer_gender, customer_phone_number, customer_email, customer_password, customer_image, customer_state, customer_otp from customer where customer_id = ?`,
                [customerId],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        });
    },
    getCustomerByCustomerIdExceptDisableState: (customerId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select customer_id, customer_first_name, customer_last_name, customer_birthday, customer_gender, customer_phone_number, customer_email, customer_password, customer_image, customer_state, customer_otp from customer where customer_id = ? and customer_state != 'DISABLE'`,
                [customerId],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        });
    },
    updateCustomer: (data, callBack) => {
        con.query(
            `update customer set customer_first_name = ?, customer_last_name = ?, customer_birthday = ?, customer_gender = ?, customer_phone_number = ?, customer_email = ?, customer_password = ?, customer_state = ? where customer_id = ?`,
            [
                data.firstName,
                data.lastName,
                data.birthday,
                data.gender,
                data.phoneNumber,
                data.email,
                data.password,
                data.state,
                data.customerId
            ],
            (error, results, fields) => {
                if (error) {
                    callBack(error);
                }
                return callBack(null, results);
            }
        )
    },
    deleteCustomer: (data, callBack) => {
        con.query(
            `delete from customer where customer_id = ?`,
            [data.customerId],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results[0]);
            }
        );
    },
    getCustomerByEmail: (email, callBack) => {
        con.query(
            `select * from customer where customer_email = ? and customer_state != 'DISABLE'`,
            [email],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results[0]);
            }
        );
    },
    getCustomerByEmailOrPhoneNumber: (email, callBack) => {
        con.query(
            `select * from customer where customer_email = ? and customer_state != 'DISABLE' or customer_phone_number = ? and customer_state != 'DISABLE'`,
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
    findCustomerByEmail: (customerEmail) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                customer_id, 
                customer_first_name,
                customer_last_name, 
                customer_birthday,
                customer_gender, 
                customer_phone_number, 
                customer_email, 
                customer_password, 
                customer_image, 
                customer_state, 
                customer_otp 
                from customer
                where customer_email = ?
                and customer_state != 'DISABLE'
                `,
                [customerEmail],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        })
    },
    updateCustomerOtpByEmail: (customerOtp, customerEmail) => {
        return new Promise((resolve, reject) => {
            con.query(
                `update
                customer
                set customer_otp = ?
                where customer_email = ?`,
                [customerOtp, customerEmail],
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
    findCustomerByPhoneNumber: (customerPhoneNumber) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                customer_id, 
                customer_first_name,
                customer_last_name, 
                customer_birthday,
                customer_gender, 
                customer_phone_number, 
                customer_email, 
                customer_password, 
                customer_image, 
                customer_state, 
                customer_otp 
                from customer
                where customer_phone_number = ?
                and customer_state != 'DISABLE'
                `,
                [customerPhoneNumber],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        })
    },
    updateCustomerOtpByPhoneNumber: (customerOtp, customerPhoneNumber) => {
        return new Promise((resolve, reject) => {
            con.query(
                `update
                customer
                set customer_otp = ?
                where customer_phone_number = ?`,
                [customerOtp, customerPhoneNumber],
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
    updateCustomerPasswordByCustomerId: (customerPassword, customerId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `update
                customer
                set customer_password = ?
                where customer_id = ?`,
                [customerPassword, customerId],
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

    // Admin: Quản lý khách hàng
    findCustomerByIdOrName: (search) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                customer_id, 
                customer_first_name,
                customer_last_name, 
                customer_birthday,
                customer_gender, 
                customer_phone_number, 
                customer_email, 
                customer_password, 
                customer_image, 
                customer_state, 
                customer_otp 
                from customer
                where customer_first_name like concat('%', ?, '%')
                or customer_last_name like concat('%', ?, '%')
                or customer_email = ?
                or customer_phone_number = ?
                or customer_id = ?`,
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
    getAllCustomers: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                customer_id, 
                customer_first_name,
                customer_last_name, 
                customer_birthday,
                customer_gender, 
                customer_phone_number, 
                customer_email, 
                customer_password, 
                customer_image, 
                customer_state, 
                customer_otp 
                from customer`,
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
    getQuantityCustomers: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                count(customer_id) as quantityCustomer
                from customer`,
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
    updateCustomerStateById: (state, id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `update 
                customer 
                set customer_state = ?
                where customer_id = ?`,
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