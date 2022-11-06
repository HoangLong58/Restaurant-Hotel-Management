const con = require("../config/database.config");

module.exports = {
    // ADMIN: Quản lý Đặt phòng - Checkin
    getAllCitys: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                city_id ,
                city_name,
                city_type
                from city`,
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
    getCityByCityId: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                city_id ,
                city_name,
                city_type
                from city
                where city_id = ?`,
                [id],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        });
    }
}