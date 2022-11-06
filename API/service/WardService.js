const con = require("../config/database.config");

module.exports = {
    // ADMIN: Quản lý Đặt phòng - Checkin
    getAllWards: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                w.ward_id,
                w.ward_name,
                w.ward_type,
                w.district_id,
                d.district_name,
                d.district_type,
                d.city_id,
                c.city_name,
                c.city_type
                from ward w
                join district d on w.district_id = d.district_id
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
    getWardByWardId: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                w.ward_id,
                w.ward_name,
                w.ward_type,
                w.district_id,
                d.district_name,
                d.district_type,
                d.city_id,
                c.city_name,
                c.city_type
                from ward w
                join district d on w.district_id = d.district_id
                join city c on d.city_id = c.city_id
                where w.ward_id = ?`,
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
    getWardByDistrictId: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                w.ward_id,
                w.ward_name,
                w.ward_type,
                w.district_id,
                d.district_name,
                d.district_type,
                d.city_id,
                c.city_name,
                c.city_type
                from ward w
                join district d on w.district_id = d.district_id
                join city c on d.city_id = c.city_id
                where w.district_id = ?`,
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