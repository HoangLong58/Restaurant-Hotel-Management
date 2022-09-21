const con = require("../config/database.config");

module.exports = {
    create: (data, callBack) => {
        con.query(
            `insert into customer( first_name, last_name, birthday, gender, phone_number, email, password, state)
                values(?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.firstName,
                data.lastName,
                data.birthday,
                data.gender,
                data.phoneNumber,
                data.email,
                data.password,
                data.state
            ],
            (error, results, fields) => {
                if(error) {
                   return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    getUsers: callBack => {
        con.query(
            `select customer_id, first_name, last_name, birthday, gender, phone_number, email, password, state from customer`,
            [],
            (error, results, fields) => {
                if(error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    getUserByCustomerId: (customerId, callBack) => {
        con.query(
            `select customer_id, first_name, last_name, birthday, gender, phone_number, email, password, state from customer where customer_id = ?`,
            [customerId],
            (error, results, fields) => {
                if(error) {
                    return callBack(error);
                }
                return callBack(null, results[0]);
            }
        );
    },
    updateUser: (data, callBack) => {
        con.query(
            `update customer set first_name = ?, last_name = ?, birthday = ?, gender = ?, phone_number = ?, email = ?, password = ?, state = ? where customer_id = ?`,
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
    deleteUser: (data, callBack) => {
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
    }
};