const con = require("../config/database.config");

module.exports = {
    getAllServiceDetails: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                sd.service_detail_id,
                sd.service_detail_name,
                sd.room_type_id,
                sd.service_id,
                rt.room_type_name,
                rt.room_type_vote_total,
                s.service_name,
                s.service_image,
                s.service_time
                from service_detail sd
                join room_type rt 
                on rt.room_type_id = sd.room_type_id
                join service s
                on s.service_id = sd.service_id
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
    getAllServiceDetailByServiceDetailId: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                sd.service_detail_id,
                sd.service_detail_name,
                sd.room_type_id,
                sd.service_id,
                rt.room_type_name,
                rt.room_type_vote_total,
                s.service_name,
                s.service_image,
                s.service_time
                from service_detail sd
                join room_type rt 
                on rt.room_type_id = sd.room_type_id
                join service s
                on s.service_id = sd.service_id
                where sd.service_detail_id = ?
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
    getAllServiceDetailByRoomTypeId: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                sd.service_detail_id,
                sd.service_detail_name,
                sd.room_type_id,
                sd.service_id,
                rt.room_type_name,
                rt.room_type_vote_total,
                s.service_name,
                s.service_image,
                s.service_time
                from service_detail sd
                join room_type rt 
                on rt.room_type_id = sd.room_type_id
                join service s
                on s.service_id = sd.service_id
                where sd.room_type_id = ?
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
    findServiceDetailByServiceDetailId: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                service_detail_id,
                service_detail_name,
                room_type_id,
                service_id
                from service_detail
                where service_detail_id = ?
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
    deleteServiceDetailByServiceDetailId: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `delete
                from
                service_detail
                where service_detail_id = ?
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
    createDetailService: (name, roomTypeId, serviceId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `insert 
                into service_detail
                (
                    service_detail_name,
                    room_type_id,
                    service_id
                )
                values
                (?, ?, ?)`,
                [name, roomTypeId, serviceId],
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