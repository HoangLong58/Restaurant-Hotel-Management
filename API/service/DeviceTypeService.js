const con = require("../config/database.config");

module.exports = {
    // ADMIN: Quản lý Loại thiết bị - Khách sạn
    getDeviceTypes: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                device_type_id,
                device_type_name,
                device_type_image
                from device_type`,
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
    getQuantityDeviceTypes: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                count(device_type_id) as quantityDeviceType 
                from device_type`,
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
    findDeviceTypeByIdOrName: (search) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                device_type_id,
                device_type_name,
                device_type_image
                from device_type 
                where device_type_name like concat('%', ?, '%')
                or device_type_id = ?`,
                [search, search],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    },
    findDeviceTypeById: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                device_type_id,
                device_type_name,
                device_type_image
                from device_type 
                where device_type_id = ?`,
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
    createDeviceType: (name, image) => {
        return new Promise((resolve, reject) => {
            con.query(
                `insert 
                into device_type
                (
                    device_type_name,
                    device_type_image
                )
                values
                (?, ?)`,
                [name, image],
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
    updateDeviceTypeById: (name, image, id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `update 
                device_type 
                set device_type_name = ?, 
                device_type_image = ?
                where device_type_id = ?`,
                [name, image, id],
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
    deleteDeviceType: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `delete 
                from device_type
                where device_type_id = ?`,
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
};