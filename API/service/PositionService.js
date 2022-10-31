const con = require("../config/database.config");

module.exports = {
    // ADMIN: Quản lý Chức vụ
    getAllPositions: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                position_id,
                position_name,
                position_salary,
                position_bonus_salary
                from position`,
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
    getQuantityPositions: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                count(position_id) as quantityPosition
                from position`,
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
    findPositionByIdOrName: (search) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                position_id,
                position_name,
                position_salary,
                position_bonus_salary
                from position 
                where position_name like concat('%', ?, '%')
                or position_id = ?`,
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
    findPositionById: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                position_id,
                position_name,
                position_salary,
                position_bonus_salary
                from position 
                where position_id = ?`,
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
    createPosition: (name, salary, bonus) => {
        return new Promise((resolve, reject) => {
            con.query(
                `insert 
                into position
                (
                    position_name,
                    position_salary,
                    position_bonus_salary
                )
                values
                (?, ?, ?)`,
                [name, salary, bonus],
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
    updatePositionById: (name, salary, bonus, id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `update 
                position 
                set position_name = ?, 
                position_salary = ?,
                position_bonus_salary = ?
                where position_id = ?`,
                [name, salary, bonus, id],
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
    deletePosition: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `delete 
                from position
                where position_id = ?`,
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