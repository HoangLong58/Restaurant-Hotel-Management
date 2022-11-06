const con = require("../config/database.config");

module.exports = {
    // ADMIN: Quản lý Đặt phòng - Checkin
    getAllDistricts: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                d.district_id,
                d.district_name,
                d.district_type,
                d.city_id,
                c.city_name,
                c.city_type
                from district d
                join city c on d.city_id = c.city_id`,
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
    getDistrictByDistrictId: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                d.district_id,
                d.district_name,
                d.district_type,
                d.city_id,
                c.city_name,
                c.city_type
                from district d
                join city c on d.city_id = c.city_id
                where d.district_id = ?`,
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
    getDistrictByCityId: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                d.district_id,
                d.district_name,
                d.district_type,
                d.city_id,
                c.city_name,
                c.city_type
                from district d
                join city c on d.city_id = c.city_id
                where d.city_id = ?`,
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
}