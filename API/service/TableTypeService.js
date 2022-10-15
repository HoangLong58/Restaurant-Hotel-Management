const con = require("../config/database.config");

module.exports = {
    getTableTypes: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                table_type_id,
                table_type_name
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
    getTableTypeByTableTypeId: (tableTypeId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                table_type_id,
                table_type_name
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
    }
};