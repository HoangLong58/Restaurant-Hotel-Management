const con = require("../config/database.config");

module.exports = {
    getTableBookings: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                table_booking_id,
                table_booking_name,
                table_booking_state,
                table_type_id,
                floor_id
                from table_booking
                where table_booking_state = 0`,
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
    getTableBookingByTableBookingId: (tableBookingId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                table_booking_id,
                table_booking_name,
                table_booking_state,
                table_type_id,
                floor_id
                from table_booking
                where table_booking_id = ?
                and table_booking_state = 0`,
                [tableBookingId],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        });
    },
    getTableBookingWithTypeAndFloor: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                tb.table_booking_id,
                tb.table_booking_name,
                tb.table_type_id,
                tb.floor_id,
                tt.table_type_name,
                f.floor_name
                from table_booking tb 
                join table_type tt on tb.table_type_id = tt.table_type_id
                join floor f on tb.floor_id = f.floor_id
                where tb.table_booking_state = 0`,
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
    getTableBookingWithTypeAndFloorByTableBookingId: (tableBookingId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                tb.table_booking_id,
                tb.table_booking_name,
                tb.table_type_id,
                tb.floor_id,
                tt.table_type_name,
                f.floor_name
                from table_booking tb 
                join table_type tt on tb.table_type_id = tt.table_type_id
                join floor f on tb.floor_id = f.floor_id
                where tb.table_booking_id = ?`,
                [tableBookingId],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        });
    },
    updateTableBookingState: (tableBookingId, state) => {
        return new Promise((resolve, reject) => {
            con.query(
                `update
                table_booking
                set table_booking_state = ? 
                where table_booking_id = ?`,
                [state, tableBookingId],
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

    // ADMIN: Quản lý Bàn ăn - Nhà hàng
    getAllTableBookings: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                tb.table_booking_id,
                tb.table_booking_name,
                tb.table_booking_state,
                tb.table_type_id,
                tb.floor_id,
                tt.table_type_name,
                tt.table_type_state,
                f.floor_name
                from table_booking tb 
                join table_type tt on tt.table_type_id = tb.table_type_id
                join floor f on f.floor_id = tb.floor_id`,
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
    getQuantityTableBookings: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                count(table_booking_id) as quantityTableBooking 
                from table_booking`,
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
    findTableBookingByIdOrName: (search) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                tb.table_booking_id,
                tb.table_booking_name,
                tb.table_booking_state,
                tb.table_type_id,
                tb.floor_id,
                tt.table_type_name,
                tt.table_type_state,
                f.floor_name
                from table_booking tb 
                join table_type tt on tt.table_type_id = tb.table_type_id
                join floor f on f.floor_id = tb.floor_id 
                where tb.table_booking_name like concat('%', ?, '%')
                or tb.table_booking_id = ?`,
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
    findTableBookingById: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                tb.table_booking_id,
                tb.table_booking_name,
                tb.table_booking_state,
                tb.table_type_id,
                tb.floor_id,
                tt.table_type_name,
                tt.table_type_state,
                f.floor_name
                from table_booking tb 
                join table_type tt on tt.table_type_id = tb.table_type_id
                join floor f on f.floor_id = tb.floor_id 
                where tb.table_booking_id = ?`,
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
    createTableBooking: (name, state, tableTypeId, floorId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `insert 
                into table_booking
                (
                    table_booking_name,
                    table_booking_state,
                    table_type_id,
                    floor_id
                )
                values
                (?, ?, ?, ?)`,
                [name, state, tableTypeId, floorId],
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
    updateTableBookingById: (name, tableTypeId, floorId, tableBookingId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `update 
                table_booking 
                set table_booking_name = ?, 
                table_type_id = ?,
                floor_id = ? 
                where table_booking_id = ?`,
                [name, tableTypeId, floorId, tableBookingId],
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
    deleteTableBooking: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `delete 
                from table_booking
                where table_booking_id = ?`,
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