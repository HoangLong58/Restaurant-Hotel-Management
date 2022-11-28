const con = require("../config/database.config");

module.exports = {
    // Admin: Quản lý Bàn - Thêm nhân viên
    getAllTableEmployees: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                te.table_employee_id,
                te.table_employee_name,
                te.table_employee_add_date,
                te.employee_id,
                te.table_booking_id,
                e.employee_first_name,
                e.employee_last_name,
                e.employee_image,
                e.employee_gender,
                e.employee_phone_number,
                e.employee_email,
                tb.table_booking_name,
                f.floor_name
                from table_employee te
                join employee e on te.employee_id = e.employee_id
                join table_booking tb on tb.table_booking_id = te.table_booking_id
                join floor f on f.floor_id = tb.floor_id
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
    getAllTableEmployeeByTableEmployeeId: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                te.table_employee_id,
                te.table_employee_name,
                te.table_employee_add_date,
                te.employee_id,
                te.table_booking_id,
                e.employee_first_name,
                e.employee_last_name,
                e.employee_image,
                e.employee_gender,
                e.employee_phone_number,
                e.employee_email,
                tb.table_booking_name,
                f.floor_name
                from table_employee te
                join employee e on te.employee_id = e.employee_id
                join table_booking tb on tb.table_booking_id = te.table_booking_id
                join floor f on f.floor_id = tb.floor_id
                where te.table_employee_id = ?
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
    getAllTableEmployeeByTableBookingId: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                te.table_employee_id,
                te.table_employee_name,
                te.table_employee_add_date,
                te.employee_id,
                te.table_booking_id,
                e.employee_first_name,
                e.employee_last_name,
                e.employee_phone_number,
                e.employee_image,
                e.employee_gender,
                e.employee_email,
                tb.table_booking_name,
                f.floor_name
                from table_employee te
                join employee e on te.employee_id = e.employee_id
                join table_booking tb on tb.table_booking_id = te.table_booking_id
                join floor f on f.floor_id = tb.floor_id
                where tb.table_booking_id = ?
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
    findTableEmployeeByTableEmployeeId: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                table_employee_id,
                table_employee_name,
                table_employee_add_date,
                employee_id,
                table_booking_booking_detail_id 
                from table_employee
                where table_employee_id = ?
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
    deleteTableEmployeeByTableEmployeeId: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `delete
                from
                table_employee
                where table_employee_id = ?
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
    createTableEmployee: (name, date, employeeId, tableBookingId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `insert 
                into table_employee
                (
                    table_employee_name,
                    table_employee_add_date,
                    employee_id,
                    table_booking_id 
                )
                values
                (?, ?, ?, ?)`,
                [name, date, employeeId, tableBookingId],
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