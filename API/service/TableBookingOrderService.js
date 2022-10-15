const con = require("../config/database.config");

module.exports = {
    getTableBookingOrders: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                table_booking_order_id,
                table_booking_order_book_date,
                table_booking_order_finish_date, 
                table_booking_order_quantity,
                table_booking_order_total,
                table_booking_order_state,
                table_booking_order_note,
                table_booking_order_checkin_date,
                customer_id,
                table_booking_id
                from table_booking_order
                where table_booking_order_state = 0`,
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
    getTableBookingOrderByTableBookingOrderId: (tableBookingOrderId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                table_booking_order_id,
                table_booking_order_book_date,
                table_booking_order_finish_date, 
                table_booking_order_quantity,
                table_booking_order_total,
                table_booking_order_state,
                table_booking_order_note,
                table_booking_order_checkin_date,
                customer_id,
                table_booking_id
                from table_booking_order
                where table_booking_order_id = ?
                and table_booking_order_state = 0`,
                [tableBookingOrderId],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        });
    },
    getTableBookingOrderByTableBookingId: (tableBookingId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                table_booking_order_id,
                table_booking_order_book_date,
                table_booking_order_finish_date, 
                table_booking_order_quantity,
                table_booking_order_total,
                table_booking_order_state,
                table_booking_order_note,
                table_booking_order_checkin_date,
                customer_id,
                table_booking_id
                from table_booking_order
                where table_booking_id = ?
                and table_booking_order_state = 0`,
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
    createTableBookingOrder: (bookdate, quantity, state, note, checkinDate, customerId, tableBookingId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `insert 
                into table_booking_order
                (
                    table_booking_order_book_date,
                    table_booking_order_quantity,
                    table_booking_order_total,
                    table_booking_order_state,
                    table_booking_order_note,
                    table_booking_order_checkin_date,
                    customer_id,
                    table_booking_id
                )
                values
                (?, ?, ?, ?, ?, ?, ?, ?)`,
                [bookdate, quantity, 0, state, note, checkinDate, customerId, tableBookingId],
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
    findTableBookingOrder: (bookdate, quantity, state, note, checkinDate, customerId, tableBookingId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                table_booking_order_id,
                table_booking_order_book_date,
                table_booking_order_finish_date, 
                table_booking_order_quantity,
                table_booking_order_total,
                table_booking_order_state,
                table_booking_order_note,
                table_booking_order_checkin_date,
                customer_id,
                table_booking_id
                from table_booking_order
                where table_booking_order_book_date = ?
                and table_booking_order_finish_date is null
                and table_booking_order_quantity = ?
                and table_booking_order_total = ?
                and table_booking_order_state = ?
                and table_booking_order_note = ?
                and table_booking_order_checkin_date = ?
                and customer_id = ?
                and table_booking_id = ?
                `,
                [bookdate, quantity, 0, state, note, checkinDate, customerId, tableBookingId],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        });
    },
};