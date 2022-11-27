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

    // ADMIN: Quản lý Đặt bàn - Thống kê doanh thu theo từng Quý
    getTotalFinishTableBookingOrderForEachQuarterByYear: (year) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                sum(
                    case QUARTER(table_booking_order_finish_date) when 1 
                    then table_booking_order_total 
                    else 0 END
                ) as quy1, 
                sum(
                    case QUARTER(table_booking_order_finish_date) when 2 
                    then table_booking_order_total
                    else 0 END
                ) as quy2, 
                sum(
                    case QUARTER(table_booking_order_finish_date) when 3 
                    then table_booking_order_total
                    else 0 END
                ) as quy3, 
                sum(
                    case QUARTER(table_booking_order_finish_date) when 4 
                    then table_booking_order_total
                    else 0 END
                ) as quy4, 
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

    // Admin: Quản lý đặt bàn - Thống kê doanh thu
    getDistinctDateInTableBookingOrderFromDateToDate: (fromDate, toDate) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select distinct 
                date(tbo.table_booking_order_finish_date) as finishDate
                from table_booking_order tbo 
                join ward w on tbo.ward_id = w.ward_id
                join district d on w.district_id = d.district_id
                join city c on d.city_id = c.city_id
                where date(tbo.table_booking_order_finish_date) >= ?
                and date(tbo.table_booking_order_finish_date) <= ?
                order by date(tbo.table_booking_order_finish_date) asc
                `,
                [fromDate, toDate],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    },
    getTableBookingTotalByDate: (date) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                sum(
                    case date(tbo.table_booking_order_finish_date) when ?
                    then tbo.table_booking_order_total
                    else 0 END
                ) as total
                from table_booking_order tbo 
                join ward w on tbo.ward_id = w.ward_id 
                join district d on w.district_id = d.district_id 
                join city c on d.city_id = c.city_id
                `,
                [date],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        });
    },
    getTableBookingTotalByMonth: (month) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                sum(
                    case month(tbo.table_booking_order_finish_date) when ?
                    then tbo.table_booking_order_total
                    else 0 END
                ) as total
                from table_booking_order tbo 
                join ward w on tbo.ward_id = w.ward_id 
                join district d on w.district_id = d.district_id 
                join city c on d.city_id = c.city_id
                `,
                [month],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        });
    },
    // Admin: Quản lý đặt bàn - Thống kê doanh thu 
    getLimitTableBookingTotalOfCityForEachQuarter: (limit) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                c.city_name, 
                sum(
                    case QUARTER(tbo.table_booking_order_finish_date) when 1 
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as quy1,
                sum(
                    case QUARTER(tbo.table_booking_order_finish_date) when 2 
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as quy2,
                sum(
                    case QUARTER(tbo.table_booking_order_finish_date) when 3
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as quy3,
                sum(
                    case QUARTER(tbo.table_booking_order_finish_date) when 4 
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as quy4,
                c.city_id,
                sum(tbo.table_booking_order_total) as canam 
                from table_booking_order tbo 
                join ward w on tbo.ward_id = w.ward_id 
                join district d on w.district_id = d.district_id 
                join city c on d.city_id = c.city_id
                where tbo.table_booking_order_state = 2
                group by d.city_id
                order by sum(tbo.table_booking_order_total) desc
                limit ?
                `,
                [limit],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    },
    getTableBookingOrderByCityId: (cityId) => {
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
                where ci.city_id = ?
                and tbo.table_booking_order_state = 2
                `,
                [cityId],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    },
    // Date: -limit-desc
    getTableBookingTotalOfCityByDateAndLimitDesc: (date, limit) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                c.city_id,
                c.city_name,
                sum(
                    case DATE(tbo.table_booking_order_finish_date) when ? 
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as total,
                sum(table_booking_order_total) as canam
                from table_booking_order tbo 
                join ward w on tbo.ward_id = w.ward_id 
                join district d on w.district_id = d.district_id 
                join city c on d.city_id = c.city_id
                where tbo.table_booking_order_state = 2
                group by d.city_id
                order by canam desc
                limit ?
                `,
                [date, limit],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    },
    // Date: -desc
    getTableBookingTotalOfCityByDateAndDesc: (date) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                c.city_id,
                c.city_name,
                sum(
                    case DATE(tbo.table_booking_order_finish_date) when ? 
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as total,
                sum(table_booking_order_total) as canam
                from table_booking_order tbo 
                join ward w on tbo.ward_id = w.ward_id 
                join district d on w.district_id = d.district_id 
                join city c on d.city_id = c.city_id
                where tbo.table_booking_order_state = 2
                group by d.city_id
                order by canam desc
                `,
                [date],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    },
    // Date: -limit-asc
    getTableBookingTotalOfCityByDateAndLimitAsc: (date, limit) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                c.city_id,
                c.city_name,
                sum(
                    case DATE(tbo.table_booking_order_finish_date) when ? 
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as total,
                sum(table_booking_order_total) as canam
                from table_booking_order tbo 
                join ward w on tbo.ward_id = w.ward_id 
                join district d on w.district_id = d.district_id 
                join city c on d.city_id = c.city_id
                where tbo.table_booking_order_state = 2
                group by d.city_id
                order by canam asc
                limit ?
                `,
                [date, limit],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    },
    // Date: -asc
    getTableBookingTotalOfCityByDateAndAsc: (date) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                c.city_id,
                c.city_name,
                sum(
                    case DATE(tbo.table_booking_order_finish_date) when ? 
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as total,
                sum(table_booking_order_total) as canam
                from table_booking_order tbo 
                join ward w on tbo.ward_id = w.ward_id 
                join district d on w.district_id = d.district_id 
                join city c on d.city_id = c.city_id
                where tbo.table_booking_order_state = 2
                group by d.city_id
                order by canam asc
                `,
                [date],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    },
    // Month: -limit-desc
    getTableBookingTotalOfCityByMonthAndLimitDesc: (month, limit) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                c.city_id,
                c.city_name,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when ? 
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as total
                from table_booking_order tbo 
                join ward w on tbo.ward_id = w.ward_id 
                join district d on w.district_id = d.district_id 
                join city c on d.city_id = c.city_id
                where tbo.table_booking_order_state = 2
                group by d.city_id
                order by total desc
                limit ?
                `,
                [month, limit],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    },
    // Month: -desc
    getTableBookingTotalOfCityByMonthAndDesc: (month) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                c.city_id,
                c.city_name,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when ? 
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as total
                from table_booking_order tbo 
                join ward w on tbo.ward_id = w.ward_id 
                join district d on w.district_id = d.district_id 
                join city c on d.city_id = c.city_id
                where tbo.table_booking_order_state = 2
                group by d.city_id
                order by total desc
                `,
                [month],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    },
    // Month: -limit-asc
    getTableBookingTotalOfCityByMonthAndLimitAsc: (month, limit) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                c.city_id,
                c.city_name,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when ? 
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as total
                from table_booking_order tbo 
                join ward w on tbo.ward_id = w.ward_id 
                join district d on w.district_id = d.district_id 
                join city c on d.city_id = c.city_id
                where tbo.table_booking_order_state = 2
                group by d.city_id
                order by total asc
                limit ?
                `,
                [month, limit],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    },
    // Month: -asc
    getTableBookingTotalOfCityByMonthAndAsc: (month) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                c.city_id,
                c.city_name,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when ? 
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as total
                from table_booking_order tbo 
                join ward w on tbo.ward_id = w.ward_id 
                join district d on w.district_id = d.district_id 
                join city c on d.city_id = c.city_id
                where tbo.table_booking_order_state = 2
                group by d.city_id
                order by total asc
                `,
                [month],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    },
    getTableBookingTotalOfCityByQuarter1AnCityId: (cityId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                c.city_id,
                c.city_name,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when 1 
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as monthFirst,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when 2 
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as monthSecond,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when 3 
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as monthThird
                from table_booking_order tbo 
                join ward w on tbo.ward_id = w.ward_id 
                join district d on w.district_id = d.district_id 
                join city c on d.city_id = c.city_id
                where tbo.table_booking_order_state = 2 and c.city_id = ?
                group by d.city_id
                `,
                [cityId],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        });
    },
    getTableBookingTotalOfCityByQuarter2AnCityId: (cityId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                c.city_id,
                c.city_name,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when 4 
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as monthFirst,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when 5 
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as monthSecond,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when 6 
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as monthThird
                from table_booking_order tbo 
                join ward w on tbo.ward_id = w.ward_id 
                join district d on w.district_id = d.district_id 
                join city c on d.city_id = c.city_id
                where tbo.table_booking_order_state = 2 and c.city_id = ?
                group by d.city_id
                `,
                [cityId],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        });
    },
    getTableBookingTotalOfCityByQuarter3AnCityId: (cityId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                c.city_id,
                c.city_name,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when 7 
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as monthFirst,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when 8 
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as monthSecond,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when 9 
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as monthThird
                from table_booking_order tbo 
                join ward w on tbo.ward_id = w.ward_id 
                join district d on w.district_id = d.district_id 
                join city c on d.city_id = c.city_id
                where tbo.table_booking_order_state = 2 and c.city_id = ?
                group by d.city_id
                `,
                [cityId],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        });
    },
    getTableBookingTotalOfCityByQuarter4AnCityId: (cityId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                c.city_id,
                c.city_name,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when 10 
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as monthFirst,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when 11 
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as monthSecond,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when 12 
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as monthThird
                from table_booking_order tbo 
                join ward w on tbo.ward_id = w.ward_id 
                join district d on w.district_id = d.district_id 
                join city c on d.city_id = c.city_id
                where tbo.table_booking_order_state = 2 and c.city_id = ?
                group by d.city_id
                `,
                [cityId],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        });
    },


    // ADMIN: THỐNG KÊ DOANH THU CỦA THÀNH PHỐ DỰA VÀO QUÝ
    // Quarter 1: No limit - Desc
    getTableBookingTotalOfCityByQuarterOneOrderByCaNamDesc: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                c.city_id,
                c.city_name,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when 1 
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as monthFirst,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when 2
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as monthSecond,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when 3 
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as monthThird,
                sum(table_booking_order_total) as canam
                from table_booking_order tbo 
                join ward w on tbo.ward_id = w.ward_id 
                join district d on w.district_id = d.district_id 
                join city c on d.city_id = c.city_id
                where tbo.table_booking_order_state = 2
                group by d.city_id
                order by canam desc
                `,
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
    // Quarter 1: Limit - Desc
    getTableBookingTotalOfCityByQuarterOneOrderByCaNamDescAndLimit: (limit) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                c.city_id,
                c.city_name,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when 1 
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as monthFirst,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when 2
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as monthSecond,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when 3 
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as monthThird,
                sum(table_booking_order_total) as canam
                from table_booking_order tbo 
                join ward w on tbo.ward_id = w.ward_id 
                join district d on w.district_id = d.district_id 
                join city c on d.city_id = c.city_id
                where tbo.table_booking_order_state = 2
                group by d.city_id
                order by canam desc
                limit ?
                `,
                [limit],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    },
    // Quarter 1: No limit - Asc
    getTableBookingTotalOfCityByQuarterOneOrderByCaNamAsc: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                c.city_id,
                c.city_name,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when 1 
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as monthFirst,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when 2
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as monthSecond,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when 3 
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as monthThird,
                sum(table_booking_order_total) as canam
                from table_booking_order tbo 
                join ward w on tbo.ward_id = w.ward_id 
                join district d on w.district_id = d.district_id 
                join city c on d.city_id = c.city_id
                where tbo.table_booking_order_state = 2
                group by d.city_id
                order by canam asc
                `,
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
    // Quarter 1: Limit - Asc
    getTableBookingTotalOfCityByQuarterOneOrderByCaNamAscAndLimit: (limit) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                c.city_id,
                c.city_name,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when 1 
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as monthFirst,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when 2
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as monthSecond,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when 3 
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as monthThird,
                sum(table_booking_order_total) as canam
                from table_booking_order tbo 
                join ward w on tbo.ward_id = w.ward_id 
                join district d on w.district_id = d.district_id 
                join city c on d.city_id = c.city_id
                where tbo.table_booking_order_state = 2
                group by d.city_id
                order by canam asc
                limit ?
                `,
                [limit],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    },
    // Quarter 2: No limit - Desc
    getTableBookingTotalOfCityByQuarterTwoOrderByCaNamDesc: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                c.city_id,
                c.city_name,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when 4 
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as monthFirst,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when 5
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as monthSecond,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when 6 
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as monthThird,
                sum(table_booking_order_total) as canam
                from table_booking_order tbo 
                join ward w on tbo.ward_id = w.ward_id 
                join district d on w.district_id = d.district_id 
                join city c on d.city_id = c.city_id
                where tbo.table_booking_order_state = 2
                group by d.city_id
                order by canam desc
                `,
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
    // Quarter 2: Limit - Desc
    getTableBookingTotalOfCityByQuarterTwoOrderByCaNamDescAndLimit: (limit) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                c.city_id,
                c.city_name,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when 4 
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as monthFirst,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when 5
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as monthSecond,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when 6 
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as monthThird,
                sum(table_booking_order_total) as canam
                from table_booking_order tbo 
                join ward w on tbo.ward_id = w.ward_id 
                join district d on w.district_id = d.district_id 
                join city c on d.city_id = c.city_id
                where tbo.table_booking_order_state = 2
                group by d.city_id
                order by canam desc
                limit ?
                `,
                [limit],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    },
    // Quarter 2: No limit - Asc
    getTableBookingTotalOfCityByQuarterTwoOrderByCaNamAsc: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                c.city_id,
                c.city_name,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when 4
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as monthFirst,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when 5
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as monthSecond,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when 6 
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as monthThird,
                sum(table_booking_order_total) as canam
                from table_booking_order tbo 
                join ward w on tbo.ward_id = w.ward_id 
                join district d on w.district_id = d.district_id 
                join city c on d.city_id = c.city_id
                where tbo.table_booking_order_state = 2
                group by d.city_id
                order by canam asc
                `,
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
    // Quarter 2: Limit - Asc
    getTableBookingTotalOfCityByQuarterTwoOrderByCaNamAscAndLimit: (limit) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                c.city_id,
                c.city_name,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when 4 
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as monthFirst,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when 5
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as monthSecond,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when 6 
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as monthThird,
                sum(table_booking_order_total) as canam
                from table_booking_order tbo 
                join ward w on tbo.ward_id = w.ward_id 
                join district d on w.district_id = d.district_id 
                join city c on d.city_id = c.city_id
                where tbo.table_booking_order_state = 2
                group by d.city_id
                order by canam asc
                limit ?
                `,
                [limit],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    },
    // Quarter 3: No limit - Desc
    getTableBookingTotalOfCityByQuarterThreeOrderByCaNamDesc: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                    c.city_id,
                    c.city_name,
                    sum(
                        case MONTH(tbo.table_booking_order_finish_date) when 7 
                        then tbo.table_booking_order_total 
                        else 0 END
                    ) as monthFirst,
                    sum(
                        case MONTH(tbo.table_booking_order_finish_date) when 8
                        then tbo.table_booking_order_total 
                        else 0 END
                    ) as monthSecond,
                    sum(
                        case MONTH(tbo.table_booking_order_finish_date) when 9 
                        then tbo.table_booking_order_total 
                        else 0 END
                    ) as monthThird,
                    sum(table_booking_order_total) as canam
                    from table_booking_order tbo 
                    join ward w on tbo.ward_id = w.ward_id 
                    join district d on w.district_id = d.district_id 
                    join city c on d.city_id = c.city_id
                    where tbo.table_booking_order_state = 2
                    group by d.city_id
                    order by canam desc
                    `,
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
    // Quarter 3: Limit - Desc
    getTableBookingTotalOfCityByQuarterThreeOrderByCaNamDescAndLimit: (limit) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                    c.city_id,
                    c.city_name,
                    sum(
                        case MONTH(tbo.table_booking_order_finish_date) when 7 
                        then tbo.table_booking_order_total 
                        else 0 END
                    ) as monthFirst,
                    sum(
                        case MONTH(tbo.table_booking_order_finish_date) when 8
                        then tbo.table_booking_order_total 
                        else 0 END
                    ) as monthSecond,
                    sum(
                        case MONTH(tbo.table_booking_order_finish_date) when 9 
                        then tbo.table_booking_order_total 
                        else 0 END
                    ) as monthThird,
                    sum(table_booking_order_total) as canam
                    from table_booking_order tbo 
                    join ward w on tbo.ward_id = w.ward_id 
                    join district d on w.district_id = d.district_id 
                    join city c on d.city_id = c.city_id
                    where tbo.table_booking_order_state = 2
                    group by d.city_id
                    order by canam desc
                    limit ?
                    `,
                [limit],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    },
    // Quarter 3: No limit - Asc
    getTableBookingTotalOfCityByQuarterThreeOrderByCaNamAsc: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                    c.city_id,
                    c.city_name,
                    sum(
                        case MONTH(tbo.table_booking_order_finish_date) when 7
                        then tbo.table_booking_order_total 
                        else 0 END
                    ) as monthFirst,
                    sum(
                        case MONTH(tbo.table_booking_order_finish_date) when 8
                        then tbo.table_booking_order_total 
                        else 0 END
                    ) as monthSecond,
                    sum(
                        case MONTH(tbo.table_booking_order_finish_date) when 9 
                        then tbo.table_booking_order_total 
                        else 0 END
                    ) as monthThird,
                    sum(table_booking_order_total) as canam
                    from table_booking_order tbo 
                    join ward w on tbo.ward_id = w.ward_id 
                    join district d on w.district_id = d.district_id 
                    join city c on d.city_id = c.city_id
                    where tbo.table_booking_order_state = 2
                    group by d.city_id
                    order by canam asc
                    `,
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
    // Quarter 3: Limit - Asc
    getTableBookingTotalOfCityByQuarterThreeOrderByCaNamAscAndLimit: (limit) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                    c.city_id,
                    c.city_name,
                    sum(
                        case MONTH(tbo.table_booking_order_finish_date) when 7 
                        then tbo.table_booking_order_total 
                        else 0 END
                    ) as monthFirst,
                    sum(
                        case MONTH(tbo.table_booking_order_finish_date) when 8
                        then tbo.table_booking_order_total 
                        else 0 END
                    ) as monthSecond,
                    sum(
                        case MONTH(tbo.table_booking_order_finish_date) when 9 
                        then tbo.table_booking_order_total 
                        else 0 END
                    ) as monthThird,
                    sum(table_booking_order_total) as canam
                    from table_booking_order tbo 
                    join ward w on tbo.ward_id = w.ward_id 
                    join district d on w.district_id = d.district_id 
                    join city c on d.city_id = c.city_id
                    where tbo.table_booking_order_state = 2
                    group by d.city_id
                    order by canam asc
                    limit ?
                    `,
                [limit],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    },
    // Quarter 4: No limit - Desc
    getTableBookingTotalOfCityByQuarterFourOrderByCaNamDesc: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                    c.city_id,
                    c.city_name,
                    sum(
                        case MONTH(tbo.table_booking_order_finish_date) when 10 
                        then tbo.table_booking_order_total 
                        else 0 END
                    ) as monthFirst,
                    sum(
                        case MONTH(tbo.table_booking_order_finish_date) when 11
                        then tbo.table_booking_order_total 
                        else 0 END
                    ) as monthSecond,
                    sum(
                        case MONTH(tbo.table_booking_order_finish_date) when 12 
                        then tbo.table_booking_order_total 
                        else 0 END
                    ) as monthThird,
                    sum(table_booking_order_total) as canam
                    from table_booking_order tbo 
                    join ward w on tbo.ward_id = w.ward_id 
                    join district d on w.district_id = d.district_id 
                    join city c on d.city_id = c.city_id
                    where tbo.table_booking_order_state = 2
                    group by d.city_id
                    order by canam desc
                    `,
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
    // Quarter 4: Limit - Desc
    getTableBookingTotalOfCityByQuarterFourOrderByCaNamDescAndLimit: (limit) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                    c.city_id,
                    c.city_name,
                    sum(
                        case MONTH(tbo.table_booking_order_finish_date) when 10 
                        then tbo.table_booking_order_total 
                        else 0 END
                    ) as monthFirst,
                    sum(
                        case MONTH(tbo.table_booking_order_finish_date) when 11
                        then tbo.table_booking_order_total 
                        else 0 END
                    ) as monthSecond,
                    sum(
                        case MONTH(tbo.table_booking_order_finish_date) when 12 
                        then tbo.table_booking_order_total 
                        else 0 END
                    ) as monthThird,
                    sum(table_booking_order_total) as canam
                    from table_booking_order tbo 
                    join ward w on tbo.ward_id = w.ward_id 
                    join district d on w.district_id = d.district_id 
                    join city c on d.city_id = c.city_id
                    where tbo.table_booking_order_state = 2
                    group by d.city_id
                    order by canam desc
                    limit ?
                    `,
                [limit],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    },
    // Quarter 4: No limit - Asc
    getTableBookingTotalOfCityByQuarterFourOrderByCaNamAsc: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                    c.city_id,
                    c.city_name,
                    sum(
                        case MONTH(tbo.table_booking_order_finish_date) when 10
                        then tbo.table_booking_order_total 
                        else 0 END
                    ) as monthFirst,
                    sum(
                        case MONTH(tbo.table_booking_order_finish_date) when 11
                        then tbo.table_booking_order_total 
                        else 0 END
                    ) as monthSecond,
                    sum(
                        case MONTH(tbo.table_booking_order_finish_date) when 12 
                        then tbo.table_booking_order_total 
                        else 0 END
                    ) as monthThird,
                    sum(table_booking_order_total) as canam
                    from table_booking_order tbo 
                    join ward w on tbo.ward_id = w.ward_id 
                    join district d on w.district_id = d.district_id 
                    join city c on d.city_id = c.city_id
                    where tbo.table_booking_order_state = 2
                    group by d.city_id
                    order by canam asc
                    `,
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
    // Quarter 4: Limit - Asc
    getTableBookingTotalOfCityByQuarterFourOrderByCaNamAscAndLimit: (limit) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                    c.city_id,
                    c.city_name,
                    sum(
                        case MONTH(tbo.table_booking_order_finish_date) when 10 
                        then tbo.table_booking_order_total 
                        else 0 END
                    ) as monthFirst,
                    sum(
                        case MONTH(tbo.table_booking_order_finish_date) when 11
                        then tbo.table_booking_order_total 
                        else 0 END
                    ) as monthSecond,
                    sum(
                        case MONTH(tbo.table_booking_order_finish_date) when 12 
                        then tbo.table_booking_order_total 
                        else 0 END
                    ) as monthThird,
                    sum(table_booking_order_total) as canam
                    from table_booking_order tbo 
                    join ward w on tbo.ward_id = w.ward_id 
                    join district d on w.district_id = d.district_id 
                    join city c on d.city_id = c.city_id
                    where tbo.table_booking_order_state = 2
                    group by d.city_id
                    order by canam asc
                    limit ?
                    `,
                [limit],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    },

    // DATE: -Limit
    getTableBookingTotalOfCityByDateByListDate: (listDate, sort, limit) => {
        var query = "";
        query += "select c.city_id, c.city_name, "
        for (var i = 0; i < listDate.length; i++) {
            const date = listDate[i].finishDate;
            query += `sum(
                case DATE(tbo.table_booking_order_finish_date) when '` + date + `' 
                then tbo.table_booking_order_total 
                else 0 END
            ) as date` + (i + 1) + `,`;
        }
        query += `sum(table_booking_order_total) as canam
                from table_booking_order tbo 
                join ward w on tbo.ward_id = w.ward_id 
                join district d on w.district_id = d.district_id 
                join city c on d.city_id = c.city_id
                where tbo.table_booking_order_state = 2
                group by d.city_id
                order by canam ` + sort + `
                limit ` + limit + `;`;
        return new Promise((resolve, reject) => {
            con.query(query,
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
    // DATE: - No limit
    getTableBookingTotalOfCityByDateByListDateNoLimit: (listDate, sort) => {
        var query = "";
        query += "select c.city_id, c.city_name, "
        for (var i = 0; i < listDate.length; i++) {
            const date = listDate[i].finishDate;
            query += `sum(
                case DATE(tbo.table_booking_order_finish_date) when '` + date + `' 
                then tbo.table_booking_order_total 
                else 0 END
            ) as date` + (i + 1) + `,`;
        }
        query += `sum(table_booking_order_total) as canam
                from table_booking_order tbo 
                join ward w on tbo.ward_id = w.ward_id 
                join district d on w.district_id = d.district_id 
                join city c on d.city_id = c.city_id
                where tbo.table_booking_order_state = 2
                group by d.city_id
                order by canam ` + sort + `;`;
        return new Promise((resolve, reject) => {
            con.query(query,
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
    getTableBookingOrderByDate: (date) => {
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
                where date(tbo.table_booking_order_finish_date) = ?
                and tbo.table_booking_order_state = 2
                `,
                [date],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    },
    getTableBookingOrderByQuarterAndCityId: (quarter, cityId) => {
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
                where quarter(tbo.table_booking_order_finish_date) = ?
                and ci.city_id = ?
                and tbo.table_booking_order_state = 2
                `,
                [quarter, cityId],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    },
    // ADMIN: Bảng đặt bàn Chi tiết - 4 Quý
    getTableBookingOrderOf4Quarter: () => {
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
                where tbo.table_booking_order_state = 2
                order by date(tbo.table_booking_order_finish_date) asc
                `,
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
    // ADMIN: Bảng đặt bàn Chi tiết - Quý
    getTableBookingOrderOfQuarter: (quarter) => {
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
                where tbo.table_booking_order_state = 2
                and quarter(tbo.table_booking_order_finish_date) = ?
                order by date(tbo.table_booking_order_finish_date) asc
                `,
                [quarter],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    },
    // ADMIN: Bảng đặt bàn Chi tiết - Date
    getTableBookingOrderFromDateToDate: (fromDate, toDate) => {
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
                where tbo.table_booking_order_state = 2
                and date(tbo.table_booking_order_finish_date) >= ?
                and date(tbo.table_booking_order_finish_date) <= ?
                order by date(tbo.table_booking_order_finish_date) asc
                `,
                [fromDate, toDate],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    },


    // -------------------------------------------- THỐNG KÊ LOẠI BÀN --------------------------------------------
    // ADMIN: Quản lý đặt bàn - Thống kê theo loại bàn: Quarter 1
    getTableBookingTotalOfTypeByQuarterOneOrderByCaNam: (type) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                tt.table_type_name,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when 1
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as monthFirst,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when 2
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as monthSecond,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when 3 
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as monthThird,
                sum(table_booking_order_total) as canam
                from table_booking_order tbo 
                join table_booking tb on tb.table_booking_id = tbo.table_booking_id
                join table_type tt on tt.table_type_id = tb.table_type_id
                join ward w on tbo.ward_id = w.ward_id 
                join district d on w.district_id = d.district_id 
                join city c on d.city_id = c.city_id
                where tbo.table_booking_order_state = 2
                and tt.table_type_name = ?
                group by tt.table_type_id
                `,
                [type],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        });
    },
    // ADMIN: Quản lý đặt bàn - Thống kê theo loại bàn: Quarter 2
    getTableBookingTotalOfTypeByQuarterTwoOrderByCaNam: (type) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                tt.table_type_name,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when 4
                    else 0 END
                ) as monthFirst,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when 5
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as monthSecond,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when 6 
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as monthThird,
                sum(table_booking_order_total) as canam
                from table_booking_order tbo 
                join table_booking tb on tb.table_booking_id = tbo.table_booking_id
                join table_type tt on tt.table_type_id = tb.table_type_id
                join ward w on tbo.ward_id = w.ward_id 
                join district d on w.district_id = d.district_id 
                join city c on d.city_id = c.city_id
                where tbo.table_booking_order_state = 2
                and tt.table_type_name = ?
                group by tt.table_type_id
                `,
                [type],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        });
    },
    // ADMIN: Quản lý đặt bàn - Thống kê theo loại bàn: Quarter 3
    getTableBookingTotalOfTypeByQuarterThreeOrderByCaNam: (type) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                tt.table_type_name,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when 7
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as monthFirst,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when 8
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as monthSecond,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when 9
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as monthThird,
                sum(table_booking_order_total) as canam
                from table_booking_order tbo 
                join table_booking tb on tb.table_booking_id = tbo.table_booking_id
                join table_type tt on tt.table_type_id = tb.table_type_id
                join ward w on tbo.ward_id = w.ward_id 
                join district d on w.district_id = d.district_id 
                join city c on d.city_id = c.city_id
                where tbo.table_booking_order_state = 2
                and tt.table_type_name = ?
                group by tt.table_type_id
                `,
                [type],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        });
    },
    // ADMIN: Quản lý đặt bàn - Thống kê theo loại bàn: Quarter 4
    getTableBookingTotalOfTypeByQuarterFourOrderByCaNam: (type) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                tt.table_type_name,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when 10
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as monthFirst,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when 11
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as monthSecond,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when 12 
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as monthThird,
                sum(table_booking_order_total) as canam
                from table_booking_order tbo 
                join table_booking tb on tb.table_booking_id = tbo.table_booking_id
                join table_type tt on tt.table_type_id = tb.table_type_id
                join ward w on tbo.ward_id = w.ward_id 
                join district d on w.district_id = d.district_id 
                join city c on d.city_id = c.city_id
                where tbo.table_booking_order_state = 2
                and tt.table_type_name = ?
                group by tt.table_type_id
                `,
                [type],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        });
    },

    // ADMIN: Quản lý đặt bàn - Thống kê theo loại bàn và Quý: Lấy danh sách đặt bàn chi tiết
    getTableBookingOrderByQuarterAndTableTypeName: (quarter, tableTypeName) => {
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
                where quarter(tbo.table_booking_order_finish_date) = ?
                and tt.table_type_name = ?
                and tbo.table_booking_order_state = 2
                `,
                [quarter, tableTypeName],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    },
    // ADMIN: Quản lý đặt bàn - Thống kê theo loại bàn và Ngày 
    getTableBookingTotalOfTypeByDate: (date, tableTypeName) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                tt.table_type_name,
                sum(
                    case DATE(tbo.table_booking_order_finish_date) when ? 
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as total,
                sum(table_booking_order_total) as canam
                from table_booking_order tbo 
                join table_booking tb on tb.table_booking_id = tbo.table_booking_id
                join table_type tt on tt.table_type_id = tb.table_type_id
                join ward w on tbo.ward_id = w.ward_id 
                join district d on w.district_id = d.district_id 
                join city c on d.city_id = c.city_id
                where tbo.table_booking_order_state = 2
                and tt.table_type_name = ?
                `,
                [date, tableTypeName],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        });
    },
    // ADMIN: Quản lý đặt bàn - Thống kê theo loại bàn và Ngày: Lấy danh sách đặt bàn chi tiết
    getTableBookingOrderByDateAndTableTypeName: (date, tableTypeName) => {
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
                where date(tbo.table_booking_order_finish_date) = ?
                and tt.table_type_name = ?
                and tbo.table_booking_order_state = 2
                    `,
                [date, tableTypeName],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    },
    // ADMIN: Quản lý đặt bàn - Thống kê theo loại bàn và Ngày: Lấy danh sách đặt bàn để làm biểu đồ
    getTableBookingTotalOfTypeByDateByListDate: (listDate, tableTypeName, sort) => {
        var query = "";
        query += "select tt.table_type_name, "
        for (var i = 0; i < listDate.length; i++) {
            const date = listDate[i].finishDate;
            query += `sum(
                case DATE(tbo.table_booking_order_finish_date) when '` + date + `' 
                then tbo.table_booking_order_total 
                else 0 END
            ) as date` + (i + 1) + `,`;
        }
        query += `sum(table_booking_order_total) as canam
                from table_booking_order tbo 
                join table_booking tb on tb.table_booking_id = tbo.table_booking_id
                join table_type tt on tt.table_type_id = tb.table_type_id
                join ward w on tbo.ward_id = w.ward_id 
                join district d on w.district_id = d.district_id 
                join city c on d.city_id = c.city_id
                where tbo.table_booking_order_state = 2
                and tt.table_type_name = "` + tableTypeName + `"
                order by canam ` + sort + `;`;
        return new Promise((resolve, reject) => {
            con.query(query,
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


    // -------------------------------------------- THỐNG KÊ KHÁCH HÀNG --------------------------------------------
    // ADMIN: Quản lý đặt bàn - Thống kê theo Khách hàng: Quarter 1
    getTableBookingTotalOfCustomerByQuarterOneOrderByCaNam: (customerId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                cu.customer_first_name,
                cu.customer_last_name,
                cu.customer_email,
                cu.customer_phone_number,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when 1
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as monthFirst,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when 2
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as monthSecond,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when 3 
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as monthThird,
                sum(table_booking_order_total) as canam
                from table_booking_order tbo 
                join customer cu on cu.customer_id = tbo.customer_id
                join ward w on tbo.ward_id = w.ward_id 
                join district d on w.district_id = d.district_id 
                join city c on d.city_id = c.city_id
                where tbo.table_booking_order_state = 2
                and cu.customer_id = ?
                group by cu.customer_id
                `,
                [customerId],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        });
    },
    // ADMIN: Quản lý đặt bàn - Thống kê theo Khách hàng: Quarter 2
    getTableBookingTotalOfCustomerByQuarterTwoOrderByCaNam: (customerId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                cu.customer_first_name,
                cu.customer_last_name,
                cu.customer_email,
                cu.customer_phone_number,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when 4
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as monthFirst,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when 5
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as monthSecond,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when 6 
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as monthThird,
                sum(table_booking_order_total) as canam
                from table_booking_order tbo 
                join customer cu on cu.customer_id = tbo.customer_id
                join ward w on tbo.ward_id = w.ward_id 
                join district d on w.district_id = d.district_id 
                join city c on d.city_id = c.city_id
                where tbo.table_booking_order_state = 2
                and cu.customer_id = ?
                group by cu.customer_id
                `,
                [customerId],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        });
    },
    // ADMIN: Quản lý đặt bàn - Thống kê theo Khách hàng: Quarter 3
    getTableBookingTotalOfCustomerByQuarterThreeOrderByCaNam: (customerId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                cu.customer_first_name,
                cu.customer_last_name,
                cu.customer_email,
                cu.customer_phone_number,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when 7
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as monthFirst,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when 8
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as monthSecond,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when 9 
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as monthThird,
                sum(table_booking_order_total) as canam
                from table_booking_order tbo 
                join customer cu on cu.customer_id = tbo.customer_id
                join ward w on tbo.ward_id = w.ward_id 
                join district d on w.district_id = d.district_id 
                join city c on d.city_id = c.city_id
                where tbo.table_booking_order_state = 2
                and cu.customer_id = ?
                group by cu.customer_id
                `,
                [customerId],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        });
    },
    // ADMIN: Quản lý đặt bàn - Thống kê theo Khách hàng: Quarter 4
    getTableBookingTotalOfCustomerByQuarterFourOrderByCaNam: (customerId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                cu.customer_first_name,
                cu.customer_last_name,
                cu.customer_email,
                cu.customer_phone_number,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when 10
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as monthFirst,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when 11
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as monthSecond,
                sum(
                    case MONTH(tbo.table_booking_order_finish_date) when 12 
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as monthThird,
                sum(table_booking_order_total) as canam
                from table_booking_order tbo 
                join customer cu on cu.customer_id = tbo.customer_id
                join ward w on tbo.ward_id = w.ward_id 
                join district d on w.district_id = d.district_id 
                join city c on d.city_id = c.city_id
                where tbo.table_booking_order_state = 2
                and cu.customer_id = ?
                group by cu.customer_id
                `,
                [customerId],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        });
    },

    // ADMIN: Quản lý đặt bàn - Thống kê theo Khách hàng và Quý: Lấy danh sách đặt bàn chi tiết
    getTableBookingOrderByQuarterAndCustomerId: (quarter, customerId) => {
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
                where quarter(tbo.table_booking_order_finish_date) = ?
                and c.customer_id = ?
                and tbo.table_booking_order_state = 2
                `,
                [quarter, customerId],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    },
    // ADMIN: Quản lý đặt bàn - Thống kê theo Khách hàng và Ngày 
    getTableBookingTotalOfCustomerByDate: (date, customerId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                cu.customer_first_name,
                cu.customer_last_name,
                cu.customer_email,
                cu.customer_phone_number,
                sum(
                    case DATE(tbo.table_booking_order_finish_date) when ? 
                    then tbo.table_booking_order_total 
                    else 0 END
                ) as total,
                sum(table_booking_order_total) as canam
                from table_booking_order tbo 
                join customer cu on cu.customer_id = tbo.customer_id
                join ward w on tbo.ward_id = w.ward_id 
                join district d on w.district_id = d.district_id 
                join city c on d.city_id = c.city_id
                where tbo.table_booking_order_state = 2
                and cu.customer_id = ?
                `,
                [date, customerId],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        });
    },
    // ADMIN: Quản lý đặt bàn - Thống kê theo Khách hàng và Ngày: Lấy danh sách đặt bàn chi tiết
    getTableBookingOrderByDateAndCustomerId: (date, customerId) => {
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
                where date(tbo.table_booking_order_finish_date) = ?
                and c.customer_id = ?
                and tbo.table_booking_order_state = 2
                `,
                [date, customerId],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    },
    // ADMIN: Quản lý đặt bàn - Thống kê theo Khách hàng và Ngày: Lấy danh sách đặt bàn để làm biểu đồ
    getTableBookingTotalOfCustomerByDateByListDate: (listDate, customerId, sort) => {
        var query = "";
        query += "select cu.customer_first_name, cu.customer_last_name, cu.customer_email, cu.customer_phone_number, "
        for (var i = 0; i < listDate.length; i++) {
            const date = listDate[i].finishDate;
            query += `sum(
                case DATE(tbo.table_booking_order_finish_date) when '` + date + `' 
                then tbo.table_booking_order_total 
                else 0 END
            ) as date` + (i + 1) + `,`;
        }
        query += `sum(table_booking_order_total) as canam
                from table_booking_order tbo 
                join customer cu on cu.customer_id = tbo.customer_id
                join ward w on tbo.ward_id = w.ward_id 
                join district d on w.district_id = d.district_id 
                join city c on d.city_id = c.city_id
                where tbo.table_booking_order_state = 2
                and cu.customer_id = ` + customerId + `
                order by canam ` + sort + `;`;
        return new Promise((resolve, reject) => {
            con.query(query,
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
};