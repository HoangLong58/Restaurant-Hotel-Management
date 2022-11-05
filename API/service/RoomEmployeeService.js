const con = require("../config/database.config");

module.exports = {
    // Admin: Quản lý Phòng - Thêm nhân viên
    getAllRoomEmployees: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                re.room_employee_id,
                re.room_employee_name,
                re.room_employee_add_date,
                re.employee_id,
                re.room_id,
                e.employee_first_name,
                e.employee_last_name,
                e.employee_image,
                e.employee_gender,
                e.employee_phone_number,
                e.employee_email,
                r.room_name,
                f.floor_name
                from room_employee re
                join employee e on re.employee_id = e.employee_id
                join room r on r.room_id = re.room_id
                join floor f on f.floor_id = r.floor_id
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
    getAllRoomEmployeeByRoomEmployeeId: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                re.room_employee_id,
                re.room_employee_name,
                re.room_employee_add_date,
                re.employee_id,
                re.room_id,
                e.employee_first_name,
                e.employee_last_name,
                e.employee_image,
                e.employee_gender,
                e.employee_phone_number,
                e.employee_email,
                r.room_name,
                f.floor_name
                from room_employee re
                join employee e on re.employee_id = e.employee_id
                join room r on r.room_id = re.room_id
                join floor f on f.floor_id = r.floor_id
                where re.room_employee_id = ?
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
    getAllRoomEmployeeByRoomId: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                re.room_employee_id,
                re.room_employee_name,
                re.room_employee_add_date,
                re.employee_id,
                re.room_id,
                e.employee_first_name,
                e.employee_last_name,
                e.employee_phone_number,
                e.employee_image,
                e.employee_gender,
                e.employee_email,
                r.room_name,
                f.floor_name
                from room_employee re
                join employee e on re.employee_id = e.employee_id
                join room r on r.room_id = re.room_id
                join floor f on f.floor_id = r.floor_id
                where r.room_id = ?
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
    findRoomEmployeeByRoomEmployeeId: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                room_employee_id,
                room_employee_name,
                room_employee_add_date,
                employee_id,
                room_booking_detail_id 
                from room_employee
                where room_employee_id = ?
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
    deleteRoomEmployeeByRoomEmployeeId: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `delete
                from
                room_employee
                where room_employee_id = ?
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
    createRoomEmployee: (name, date, employeeId, roomId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `insert 
                into room_employee
                (
                    room_employee_name,
                    room_employee_add_date,
                    employee_id,
                    room_id 
                )
                values
                (?, ?, ?, ?)`,
                [name, date, employeeId, roomId],
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