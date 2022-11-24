const con = require("../config/database.config");

module.exports = {
    // ADMIN: Quản lý Admin log
    getAdminLogs: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                    al.admin_log_id,
                    al.admin_log_content,
                    al.admin_log_date,
                    al.admin_log_type,
                    al.employee_id,
                    e.employee_first_name,
                    e.employee_last_name,
                    e.employee_email,
                    e.employee_phone_number,
                    e.employee_image
                    from admin_log al
                    join employee e on al.employee = e.employee
                    order by al.admin_log_date desc`,
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
    getTop5AdminLogs: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                    al.admin_log_id,
                    al.admin_log_content,
                    al.admin_log_date,
                    al.admin_log_type,
                    al.employee_id,
                    e.employee_first_name,
                    e.employee_last_name,
                    e.employee_email,
                    e.employee_phone_number,
                    e.employee_image
                    from admin_log al
                    join employee e on al.employee_id = e.employee_id
                    order by al.admin_log_date desc
                    LIMIT 5`,
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
    createAdminLog: (content, date, type, employeeId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `insert 
                into admin_log
                (
                    admin_log_content,
                    admin_log_date,
                    admin_log_type,
                    employee_id
                )
                values
                (?, ?, ?, ?)`,
                [content, date, type, employeeId],
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
    // ADMIN: Quản lý Nhật ký hoạt động
    getAllAdminLogs: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                al.admin_log_id,
                al.admin_log_content,
                al.admin_log_date,
                al.admin_log_type,
                al.employee_id,
                e.employee_first_name,
                e.employee_last_name,
                e.employee_email,
                e.employee_phone_number,
                e.employee_image
                from admin_log al
                join employee e on al.employee_id = e.employee_id
                order by al.admin_log_date desc`,
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
    getQuantityAdminLogs: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                count(admin_log_id) as quantityAdminLog 
                from admin_log`,
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
    findAdminLogByIdOrName: (search) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                al.admin_log_id,
                al.admin_log_content,
                al.admin_log_date,
                al.admin_log_type,
                al.employee_id,
                e.employee_first_name,
                e.employee_last_name,
                e.employee_email,
                e.employee_phone_number,
                e.employee_image
                from admin_log al
                join employee e on al.employee_id = e.employee_id
                where e.employee_last_name like concat('%', ?, '%')
                or e.employee_email = ?
                or e.employee_phone_number = ?
                order by al.admin_log_date desc
                `,
                [search, search, search],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    },
    findAdminLogById: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                al.admin_log_id,
                al.admin_log_content,
                al.admin_log_date,
                al.admin_log_type,
                al.employee_id,
                e.employee_first_name,
                e.employee_last_name,
                e.employee_email,
                e.employee_phone_number,
                e.employee_image
                from admin_log al
                join employee e on al.employee_id = e.employee_id
                where al.admin_log_id = ?
                order by al.admin_log_date desc`,
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