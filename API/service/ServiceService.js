const con = require("../config/database.config");

module.exports = {
    getServices: callBack => {
        con.query(
            `select
            service_id,
            service_name,
            service_image
            from service`,
            [],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    getServicesByRoomTypeId: (roomTypeId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                s.service_id,
                s.service_name,
                s.service_image,
                s.service_time
                from service s join service_detail sd on s.service_id = sd.service_id
                join room_type rt on rt.room_type_id = sd.room_type_id
                where rt.room_type_id = ?`,
                [roomTypeId],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    },
    // ADMIN: Quản lý Dịch vụ - Khách sạn
    getAllServices: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                service_id,
                service_name,
                service_image,
                service_time
                from service`,
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
    getQuantityServices: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                count(service_id) as quantityService 
                from service`,
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
    findServiceByIdOrName: (search) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                service_id,
                service_name,
                service_image,
                service_time
                from service 
                where service_name like concat('%', ?, '%')
                or service_id = ?`,
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
    findServiceById: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                service_id,
                service_name,
                service_image,
                service_time
                from service 
                where service_id = ?`,
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
    createService: (name, image, time) => {
        return new Promise((resolve, reject) => {
            con.query(
                `insert 
                into service
                (
                    service_name,
                    service_image,
                    service_time
                )
                values
                (?, ?, ?)`,
                [name, image, time],
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
    updateServiceById: (name, image, time, id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `update 
                service 
                set service_name = ?, 
                service_image = ?,
                service_time = ?
                where service_id = ?`,
                [name, image, time, id],
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
    deleteService: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `delete 
                from service
                where service_id = ?`,
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