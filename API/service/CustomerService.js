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
                    if(error) reject(error);
                    if(!results[0]) {
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
                    if(error) reject(error);
                    if(!results[0]) {
                        return resolve(true);
                    }
                    return resolve(false);
                }
            );
        });
    },
    createCustomer: (data, callBack) => {
        con.query(
            `insert into customer( customer_first_name, customer_last_name, customer_birthday, customer_gender, customer_phone_number, customer_email, customer_password, customer_state)
                values(?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.firstName,
                data.lastName,
                "",
                "",
                data.phoneNumber,
                data.email,
                data.password,
                "INIT"
            ],
            (error, results, fields) => {
                if(error) {
                   return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    getCustomers: callBack => {
        con.query(
            `select customer_id, customer_first_name, customer_last_name, customer_birthday, customer_gender, customer_phone_number, customer_email, customer_password, customer_state from customer`,
            [],
            (error, results, fields) => {
                if(error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    getCustomerByCustomerId: (customerId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select customer_id, customer_first_name, customer_last_name, customer_birthday, customer_gender, customer_phone_number, customer_email, customer_password, customer_state from customer where customer_id = ?`,
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
                if(error) {
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
                if(error) {
                    return callBack(error);
                }
                return callBack(null, results[0]);
            }
        );
    },
    getCustomerByEmail: (email, callBack) => {
        con.query(
            `select * from customer where customer_email = ?`,
            [email],
            (error, results, fields) => {
                if(error) {
                    return callBack(error);
                }
                return callBack(null, results[0]);
            }
        );
    },
    getCustomerByEmailOrPhoneNumber: (email, callBack) => {
        con.query(
            `select * from customer where customer_email = ? or customer_phone_number = ?`,
            [email, email],
            (error, results, fields) => {
                if(error) {
                    return callBack(error);
                }
                return callBack(null, results[0]);
            }
        );
    }
};