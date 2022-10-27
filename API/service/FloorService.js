const con = require("../config/database.config");

module.exports = {
    // ADMIN: Quản lý Tầng
    getFloors: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                floor_id,
                floor_name
                from floor`,
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
    getQuantityFloors: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                count(floor_id) as quantityFloor
                from floor`,
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
    findFloorByIdOrName: (search) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                floor_id,
                floor_name
                from floor 
                where floor_name like concat('%', ?, '%')
                or floor_id = ?`,
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
    findFloorById: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                floor_id,
                floor_name
                from floor 
                where floor_id = ?`,
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
    createFloor: (name) => {
        return new Promise((resolve, reject) => {
            con.query(
                `insert 
                into floor
                (
                    floor_name
                )
                values
                (?)`,
                [name],
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
    updateFloorById: (name, id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `update 
                floor 
                set floor_name = ?
                where floor_id = ?`,
                [name, id],
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
    deleteFloor: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `delete 
                from floor
                where floor_id = ?`,
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