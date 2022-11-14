const con = require("../config/database.config");

module.exports = {
    getTableTypes: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                table_type_id,
                table_type_name,
                table_type_state
                from table_type
                where table_type_state = 0`,
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
    getTableTypeByTableTypeId: (tableTypeId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                table_type_id,
                table_type_name,
                table_type_state
                from table_type
                where table_type_id = ?`,
                [tableTypeId],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        });
    },
    // ADMIN: Quản lý Loại bàn - Nhà hàng
    getAllTableTypes: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                    table_type_id,
                    table_type_name,
                    table_type_state
                    from table_type`,
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
    getQuantityTableTypes: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                        count(table_type_id) as quantityTableType 
                        from table_type`,
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
    findTableTypeByIdOrName: (search) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                        table_type_id,
                        table_type_name,
                        table_type_state
                        from table_type 
                        where table_type_name like concat('%', ?, '%')
                        or table_type_id = ?`,
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
    findTableTypeById: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                        table_type_id,
                        table_type_name,
                        table_type_state
                        from table_type
                        where table_type_id = ?`,
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
    createTableType: (name, state) => {
        return new Promise((resolve, reject) => {
            con.query(
                `insert 
                        into table_type
                        (
                            table_type_name,
                            table_type_state
                        )
                        values
                        (?, ?)`,
                [name, state],
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
    updateTableTypeById: (name, id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `update 
                        table_type
                        set table_type_name = ?
                        where table_type_id = ?`,
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
    deleteTableType: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `delete 
                        from table_type
                        where table_type_id = ?`,
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
    updateTableTypeState: (state, id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `update 
                        table_type
                        set table_type_state = ?
                        where table_type_id = ?`,
                [state, id],
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