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
    }
};