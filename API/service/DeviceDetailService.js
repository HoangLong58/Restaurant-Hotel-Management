const con = require("../config/database.config");

module.exports = {
    deleteDeviceDetailById: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `delete 
                from device_detail
                where device_detail_id = ?`,
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
    // Admin: Quản lý Phòng - Thêm thiết bị
    getAllDeviceDetails: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                dd.device_detail_id,
                dd.device_detail_check_date,
                dd.device_detail_tinh_trang,
                dd.room_id,
                dd.device_id,
                dd.employee_id,
                r.room_name,
                f.floor_name,
                d.device_name,
                d.device_date,
                d.device_date,
                d.device_image,
                d.device_state,
                d.device_type_id,
                dt.device_type_name,
                dt.device_type_image,
                e.employee_first_name,
                e.employee_last_name,
                e.employee_phone_number,
                e.employee_email
                from device_detail dd
                join room r on r.room_id = dd.room_id
                join floor f on f.floor_id = r.floor_id
                join device d on d.device_id = dd.device_id
                join device_type dt on dt.device_type_id = d.device_type_id
                join employee e on e.employee_id = dd.employee_id
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
    getAllDeviceDetailByDeviceDetailId: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                dd.device_detail_id,
                dd.device_detail_check_date,
                dd.device_detail_tinh_trang,
                dd.room_id,
                dd.device_id,
                dd.employee_id,
                r.room_name,
                f.floor_name,
                d.device_name,
                d.device_date,
                d.device_date,
                d.device_image,
                d.device_state,
                d.device_type_id,
                dt.device_type_name,
                dt.device_type_image,
                e.employee_first_name,
                e.employee_last_name,
                e.employee_phone_number,
                e.employee_email
                from device_detail dd
                join room r on r.room_id = dd.room_id
                join floor f on f.floor_id = r.floor_id
                join device d on d.device_id = dd.device_id
                join device_type dt on dt.device_type_id = d.device_type_id
                join employee e on e.employee_id = dd.employee_id
                where dd.device_detail_id = ?
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
    getAllDeviceDetailByRoomId: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                dd.device_detail_id,
                dd.device_detail_check_date,
                dd.device_detail_tinh_trang,
                dd.room_id,
                dd.device_id,
                dd.employee_id,
                r.room_name,
                f.floor_name,
                d.device_name,
                d.device_date,
                d.device_date,
                d.device_image,
                d.device_state,
                d.device_type_id,
                dt.device_type_name,
                dt.device_type_image,
                e.employee_first_name,
                e.employee_last_name,
                e.employee_phone_number,
                e.employee_email
                from device_detail dd
                join room r on r.room_id = dd.room_id
                join floor f on f.floor_id = r.floor_id
                join device d on d.device_id = dd.device_id
                join device_type dt on dt.device_type_id = d.device_type_id
                join employee e on e.employee_id = dd.employee_id
                where dd.room_id = ?
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
    findDeviceDetailByDeviceDetailId: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                device_detail_id,
                device_detail_check_date,
                device_detail_tinh_trang,
                room_id,
                device_id,
                employee_id
                from device_detail
                where device_detail_id = ?
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
    deleteDeviceDetailByDeviceDetailId: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `delete
                from
                device_detail
                where device_detail_id = ?
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
    createDetailDevice: (checkDate, tinhTrang, roomId, deviceId, employeeId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `insert 
                into device_detail
                (
                    device_detail_check_date,
                    device_detail_tinh_trang,
                    room_id,
                    device_id,
                    employee_id 
                )
                values
                (?, ?, ?, ?, ?)`,
                [checkDate, tinhTrang, roomId, deviceId, employeeId],
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
}