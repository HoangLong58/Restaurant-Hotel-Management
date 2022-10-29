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
};