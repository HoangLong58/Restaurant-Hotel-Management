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
}