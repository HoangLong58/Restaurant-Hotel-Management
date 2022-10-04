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
};