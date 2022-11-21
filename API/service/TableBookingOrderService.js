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
                and table_booking_order_state != 2`,
                [tableBookingId],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
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
                where table_booking_order_state = 2`,
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
                where table_booking_order_state = 2
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
                and table_booking_order_state = 2
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

    // ADMIN: Quản lý Đặt bàn
    getTableBookingsAndDetail: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                tbo.table_booking_order_id,
                tbo.table_booking_order_book_date,
                tbo.table_booking_order_start_date,
                tbo.table_booking_order_finish_date,
                tbo.table_booking_order_quantity,
                tbo.table_booking_order_total,
                tbo.table_booking_order_state,
                tbo.table_booking_order_note,
                tbo.table_booking_order_checkin_date,
                tbo.table_booking_order_identity_card,
                tbo.table_booking_order_nation,
                tbo.table_booking_order_address,
                tbo.customer_id,
                tbo.table_booking_id,
                tbo.ward_id,
                c.customer_first_name,
                c.customer_last_name,
                c.customer_phone_number,
                c.customer_email,
                w.ward_name,
                di.district_name,
                ci.city_name,
                tb.table_booking_name,
                tb.table_booking_state,
                tb.table_type_id,
                tb.floor_id,
                tt.table_type_name,
                f.floor_name
                from table_booking_order tbo
                join customer c on c.customer_id = tbo.customer_id
                join table_booking tb on tb.table_booking_id = tbo.table_booking_id
                join table_type tt on tt.table_type_id = tb.table_type_id
                join floor f on f.floor_id = tb.floor_id
                left join ward w on w.ward_id = tbo.ward_id
                left join district di on w.district_id = di.district_id
                left join city ci on di.city_id = ci.city_id
                order by tbo.table_booking_order_state asc`,
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
                    count(table_booking_order_id) as quantityTableBooking 
                    from table_booking_order`,
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
    findTableBookingByIdOrCustomerEmailOrCustomerPhoneOrCustomerName: (search) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                tbo.table_booking_order_id,
                tbo.table_booking_order_book_date,
                tbo.table_booking_order_start_date,
                tbo.table_booking_order_finish_date,
                tbo.table_booking_order_quantity,
                tbo.table_booking_order_total,
                tbo.table_booking_order_state,
                tbo.table_booking_order_note,
                tbo.table_booking_order_checkin_date,
                tbo.table_booking_order_identity_card,
                tbo.table_booking_order_nation,
                tbo.table_booking_order_address,
                tbo.customer_id,
                tbo.table_booking_id,
                tbo.ward_id,
                c.customer_first_name,
                c.customer_last_name,
                c.customer_phone_number,
                c.customer_email,
                w.ward_name,
                di.district_name,
                ci.city_name,
                tb.table_booking_name,
                tb.table_booking_state,
                tb.table_type_id,
                tb.floor_id,
                tt.table_type_name,
                f.floor_name
                from table_booking_order tbo
                join customer c on c.customer_id = tbo.customer_id
                join table_booking tb on tb.table_booking_id = tbo.table_booking_id
                join table_type tt on tt.table_type_id = tb.table_type_id
                join floor f on f.floor_id = tb.floor_id
                left join ward w on w.ward_id = tbo.ward_id
                left join district di on w.district_id = di.district_id
                left join city ci on di.city_id = ci.city_id
                where c.customer_first_name like concat('%', ?, '%')
                or tbo.table_booking_order_id = ?
                or c.customer_email = ?
                or c.customer_phone_number = ?
                or c.customer_last_name like concat('%', ?, '%')
                order by tbo.table_booking_order_state asc`,
                [search, search, search, search, search],
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
                tbo.table_booking_order_id,
                tbo.table_booking_order_book_date,
                tbo.table_booking_order_start_date,
                tbo.table_booking_order_finish_date,
                tbo.table_booking_order_quantity,
                tbo.table_booking_order_total,
                tbo.table_booking_order_state,
                tbo.table_booking_order_note,
                tbo.table_booking_order_checkin_date,
                tbo.table_booking_order_identity_card,
                tbo.table_booking_order_nation,
                tbo.table_booking_order_address,
                tbo.customer_id,
                tbo.table_booking_id,
                tbo.ward_id,
                c.customer_first_name,
                c.customer_last_name,
                c.customer_phone_number,
                c.customer_email,
                w.ward_name,
                di.district_name,
                ci.city_name,
                tb.table_booking_name,
                tb.table_booking_state,
                tb.table_type_id,
                tb.floor_id,
                tt.table_type_name,
                f.floor_name
                from table_booking_order tbo
                join customer c on c.customer_id = tbo.customer_id
                join table_booking tb on tb.table_booking_id = tbo.table_booking_id
                join table_type tt on tt.table_type_id = tb.table_type_id
                join floor f on f.floor_id = tb.floor_id
                left join ward w on w.ward_id = tbo.ward_id
                left join district di on w.district_id = di.district_id
                left join city ci on di.city_id = ci.city_id
                where tbo.table_booking_order_id = ?`,
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

    // Checkin
    findTableBookingOrderByIdCheckIn: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                table_booking_order_id,
                table_booking_order_book_date,
                table_booking_order_start_date,
                table_booking_order_finish_date,
                table_booking_order_quantity,
                table_booking_order_total,
                table_booking_order_state,
                table_booking_order_note,
                table_booking_order_checkin_date,
                table_booking_order_identity_card,
                table_booking_order_nation,
                table_booking_order_address,
                customer_id,
                table_booking_id,
                ward_id 
                from table_booking_order
                where table_booking_order_id = ?`,
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
    updateTableBookingOrderInfoWhenCheckInSuccess: (identityCard, nation, address, wardId, date, id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `update
                table_booking_order 
                set table_booking_order_identity_card = ?,
                table_booking_order_nation = ?,
                table_booking_order_address = ?,
                ward_id = ?,
                table_booking_order_start_date = ?
                where table_booking_order_id = ?`,
                [identityCard, nation, address, wardId, date, id],
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
    updateTableBookingOrderState: (state, id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `update
                table_booking_order 
                set table_booking_order_state = ?
                where table_booking_order_id = ?`,
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

    // ADMIN: Check out
    updateTableBookingOrderFinishDateWhenCheckOutSuccess: (date, id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `update
                table_booking_order 
                set table_booking_order_finish_date = ?
                where table_booking_order_id = ?`,
                [date, id],
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
    // ADMIN: Quản lý Đặt bàn - CẬP NHẬT TỔNG PHÍ CỦA ĐƠN ĐẶT BÀN
    updateTableBookingOrderTotalByTableBookingOrderId: (total, id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `update
                table_booking_order 
                set table_booking_order_total = ?
                where table_booking_order_id = ?`,
                [total, id],
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