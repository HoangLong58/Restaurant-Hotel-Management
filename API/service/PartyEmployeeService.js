const con = require("../config/database.config");

module.exports = {
    // Admin: Quản lý Tiệc - Thêm nhân viên
    getAllPartyEmployees: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                pe.party_employee_id,
                pe.party_employee_name,
                pe.party_employee_add_date,
                pe.employee_id,
                pe.party_hall_id,
                e.employee_first_name,
                e.employee_last_name,
                e.employee_image,
                e.employee_gender,
                e.employee_phone_number,
                e.employee_email,
                ph.party_hall_name,
                f.floor_name
                from party_employee pe
                join employee e on pe.employee_id = e.employee_id
                join party_hall ph on ph.party_hall_id = pe.party_hall_id
                join floor f on f.floor_id = ph.floor_id
                `,
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
    getAllPartyEmployeeByPartyEmployeeId: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                pe.party_employee_id,
                pe.party_employee_name,
                pe.party_employee_add_date,
                pe.employee_id,
                pe.party_hall_id,
                e.employee_first_name,
                e.employee_last_name,
                e.employee_image,
                e.employee_gender,
                e.employee_phone_number,
                e.employee_email,
                ph.party_hall_name,
                f.floor_name
                from party_employee pe
                join employee e on pe.employee_id = e.employee_id
                join party_hall ph on ph.party_hall_id = pe.party_hall_id
                join floor f on f.floor_id = ph.floor_id
                where pe.party_employee_id = ?
                `,
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
    getAllPartyEmployeeByPartyHallId: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                pe.party_employee_id,
                pe.party_employee_name,
                pe.party_employee_add_date,
                pe.employee_id,
                pe.party_hall_id,
                e.employee_first_name,
                e.employee_last_name,
                e.employee_phone_number,
                e.employee_image,
                e.employee_gender,
                e.employee_email,
                ph.party_hall_name,
                f.floor_name
                from party_employee pe
                join employee e on pe.employee_id = e.employee_id
                join party_hall ph on ph.party_hall_id = pe.party_hall_id
                join floor f on f.floor_id = ph.floor_id
                where ph.party_hall_id = ?
                `,
                [id],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    },
    findPartyEmployeeByPartyEmployeeId: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                party_employee_id,
                party_employee_name,
                party_employee_add_date,
                employee_id,
                party_hall_booking_detail_id 
                from party_employee
                where party_employee_id = ?
                `,
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
    deletePartyEmployeeByPartyEmployeeId: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `delete
                from
                party_employee
                where party_employee_id = ?
                `,
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
    createPartyEmployee: (name, date, employeeId, partyHallId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `insert 
                into party_employee
                (
                    party_employee_name,
                    party_employee_add_date,
                    employee_id,
                    party_hall_id 
                )
                values
                (?, ?, ?, ?)`,
                [name, date, employeeId, partyHallId],
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