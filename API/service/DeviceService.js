const con = require("../config/database.config");

module.exports = {
    getDevicesName: callBack => {
        con.query(
            `select
            device_id,
            device_name,
            device_date,
            device_description,
            device_image,
            device_state,
            device_type_id
            from device`,
            [],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    getDevicesByRoomId: (roomId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `SELECT
                d.device_id,
                d.device_name,
                d.device_date,
                d.device_description,
                d.device_image,
                d.device_state,
                d.device_type_id,
                dt.device_type_name,
                dt.device_type_image,
                dd.device_detail_id,
                dd.device_detail_check_date,
                dd.device_detail_tinh_trang,
                dd.room_id,
                dd.employee_id
                from device d
                join device_type dt on d.device_type_id = dt.device_type_id
                join device_detail dd on d.device_id = dd.device_id
                where dd.room_id = ?`,
                [roomId],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        })
    },

    // ADMIN: Quản lý Thiết bị - Khách sạn
    getDevicesAndTypeAndDetailAndRoomAndFloor: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select *
                from (
                    SELECT
                    d.device_id,
                    d.device_name,
                    d.device_date,
                    d.device_description,
                    d.device_image,
                    d.device_state,
                    d.device_type_id,
                    dt.device_type_name,
                    dt.device_type_image,
                    dd.device_detail_id,
                    dd.device_detail_check_date,
                    dd.device_detail_tinh_trang,
                    dd.room_id,
                    dd.employee_id,
                    r.room_name,
                    r.floor_id,
                    f.floor_name
                    from device d
                    join device_type dt on d.device_type_id = dt.device_type_id
                    left join device_detail dd on d.device_id = dd.device_id
                    left join room r on dd.room_id = r.room_id
                    left join floor f on r.floor_id = f.floor_id
                    UNION
                    SELECT
                    d.device_id,
                    d.device_name,
                    d.device_date,
                    d.device_description,
                    d.device_image,
                    d.device_state,
                    d.device_type_id,
                    dt.device_type_name,
                    dt.device_type_image,
                    dd.device_detail_id,
                    dd.device_detail_check_date,
                    dd.device_detail_tinh_trang,
                    dd.room_id,
                    dd.employee_id,
                    r.room_name,
                    r.floor_id,
                    f.floor_name
                    from device d
                    join device_type dt on d.device_type_id = dt.device_type_id
                    left join device_detail dd on d.device_id = dd.device_id
                    left join room r on dd.room_id = r.room_id
                    left join floor f on r.floor_id = f.floor_id
                ) a
                order by device_type_id desc
                `,
                [],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        })
    },
    getQuantityDevices: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                count(device_id) as quantityDevice
                from device`,
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
    findDeviceByIdOrName: (search) => {
        return new Promise((resolve, reject) => {
            con.query(
                `SELECT
                d.device_id,
                d.device_name,
                d.device_date,
                d.device_description,
                d.device_image,
                d.device_state,
                d.device_type_id,
                dt.device_type_name,
                dt.device_type_image,
                dd.device_detail_id,
                dd.device_detail_check_date,
                dd.device_detail_tinh_trang,
                dd.room_id,
                dd.employee_id,
                r.room_name,
                r.floor_id,
                f.floor_name
                from device d
                join device_type dt on d.device_type_id = dt.device_type_id
                left join device_detail dd on d.device_id = dd.device_id
                left join room r on dd.room_id = r.room_id
                left join floor f on r.floor_id = f.floor_id
                where d.device_name like concat('%', ?, '%')
                or d.device_id = ?
                UNION
                SELECT
                d.device_id,
                d.device_name,
                d.device_date,
                d.device_description,
                d.device_image,
                d.device_state,
                d.device_type_id,
                dt.device_type_name,
                dt.device_type_image,
                dd.device_detail_id,
                dd.device_detail_check_date,
                dd.device_detail_tinh_trang,
                dd.room_id,
                dd.employee_id,
                r.room_name,
                r.floor_id,
                f.floor_name
                from device d
                join device_type dt on d.device_type_id = dt.device_type_id
                left join device_detail dd on d.device_id = dd.device_id
                left join room r on dd.room_id = r.room_id
                left join floor f on r.floor_id = f.floor_id
                where d.device_name like concat('%', ?, '%')
                or d.device_id = ?`,
                [search, search, search, search],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    },
    findDeviceById: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `SELECT
                d.device_id,
                d.device_name,
                d.device_date,
                d.device_description,
                d.device_image,
                d.device_state,
                d.device_type_id,
                dt.device_type_name,
                dt.device_type_image,
                dd.device_detail_id,
                dd.device_detail_check_date,
                dd.device_detail_tinh_trang,
                dd.room_id,
                dd.employee_id,
                r.room_name,
                r.floor_id,
                f.floor_name
                from device d
                join device_type dt on d.device_type_id = dt.device_type_id
                left join device_detail dd on d.device_id = dd.device_id
                left join room r on dd.room_id = r.room_id
                left join floor f on r.floor_id = f.floor_id
                where d.device_id = ?
                UNION
                SELECT
                d.device_id,
                d.device_name,
                d.device_date,
                d.device_description,
                d.device_image,
                d.device_state,
                d.device_type_id,
                dt.device_type_name,
                dt.device_type_image,
                dd.device_detail_id,
                dd.device_detail_check_date,
                dd.device_detail_tinh_trang,
                dd.room_id,
                dd.employee_id,
                r.room_name,
                r.floor_id,
                f.floor_name
                from device d
                join device_type dt on d.device_type_id = dt.device_type_id
                left join device_detail dd on d.device_id = dd.device_id
                left join room r on dd.room_id = r.room_id
                left join floor f on r.floor_id = f.floor_id
                where d.device_id = ?`,
                [id, id],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        });
    },
    createDevice: (name, date, description, image, deviceTypeId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `insert 
                into device
                (
                    device_name,
                    device_date,
                    device_description,
                    device_image,
                    device_state,
                    device_type_id
                )
                values
                (?, ?, ?, ?, ?, ?)`,
                [name, date, description, image, 0, deviceTypeId],
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
    updateDeviceById: (name, date, description, image, state, deviceTypeId, id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `update 
                device 
                set device_name = ?, 
                device_date = ?,
                device_description = ?,
                device_image = ?,
                device_state = ?,
                device_type_id = ?
                where device_id = ?`,
                [name, date, description, image, state, deviceTypeId, id],
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
    deleteDeviceById: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `delete 
                from device
                where device_id = ?`,
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
    updateDeviceStateByDeviceId: (state, id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `update 
                device 
                set device_state = ?
                where device_id = ?`,
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
    getDevicesByDeviceTypeIdAndState0: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                d.device_id,
                d.device_name,
                d.device_date,
                d.device_description,
                d.device_image,
                d.device_state,
                d.device_type_id,
                dt.device_type_name,
                dt.device_type_image
                from device d
                join device_type dt on dt.device_type_id = d.device_type_id
                where d.device_state = 0
                and d.device_type_id = ?
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
    }
};