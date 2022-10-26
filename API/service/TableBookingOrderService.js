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
    // Func: Thống kê doanh thu của đặt bàn
    getTotalFinishTableBookingOrder: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                sum(table_booking_order_total) as sum_table_booking_order_total
                from table_booking_order
                where table_booking_order_state = 1`,
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
    // Func: Thống kê doanh thu của đặt bàn theo ngày kết thúc
    getTotalFinishTableBookingOrderByFinishDate: (date, month, year) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                sum(table_booking_order_total) as sum_table_booking_order_total
                from table_booking_order
                where table_booking_order_state = 1
                and DAY(table_booking_order_finish_date) = ?
                and MONTH(table_booking_order_finish_date) = ?
                and YEAR(table_booking_order_finish_date) = ?
                `,
                [date, month, year],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        });
    },
    // Func: Thống kê doanh thu của đặt bàn theo từng tháng dựa vào ngày kết thúc theo năm
    getTotalFinishTableBookingOrderForEachMonthByYear: (year) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                sum(
                    case month(table_booking_order_finish_date) when 1 
                    then table_booking_order_total 
                    else 0 END
                ) as thang1, 
                sum(
                    case month(table_booking_order_finish_date) when 2 
                    then table_booking_order_total
                    else 0 END
                ) as thang2, 
                sum(
                    case month(table_booking_order_finish_date) when 3 
                    then table_booking_order_total
                    else 0 END
                ) as thang3, 
                sum(
                    case month(table_booking_order_finish_date) when 4 
                    then table_booking_order_total
                    else 0 END
                ) as thang4, 
                sum(
                    case month(table_booking_order_finish_date) when 5 
                    then table_booking_order_total
                    else 0 END
                ) as thang5, 
                sum(
                    case month(table_booking_order_finish_date) when 6
                    then table_booking_order_total
                    else 0 END
                ) as thang6, 
                sum(
                    case month(table_booking_order_finish_date) when 7 
                    then table_booking_order_total
                    else 0 END
                ) as thang7, 
                sum(
                    case month(table_booking_order_finish_date) when 8 
                    then table_booking_order_total
                    else 0 END
                ) as thang8, 
                sum(
                    case month(table_booking_order_finish_date) when 9
                    then table_booking_order_total
                    else 0 END
                ) as thang9, 
                sum(
                    case month(table_booking_order_finish_date) when 10 
                    then table_booking_order_total
                    else 0 END
                ) as thang10, 
                sum(
                    case month(table_booking_order_finish_date) when 11 
                    then table_booking_order_total
                    else 0 END
                ) as thang11, 
                sum(
                    case month(table_booking_order_finish_date) when 12
                    then table_booking_order_total
                    else 0 END
                ) as thang12, 
                sum(table_booking_order_total) as canam 
                from table_booking_order
                WHERE year(table_booking_order_finish_date) = ? 
                and table_booking_order_state = 1
                `,
                [year],
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