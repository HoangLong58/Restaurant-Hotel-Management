const con = require("../config/database.config");

module.exports = {
    createPartyBookingOrder: (date, price, surcharge, total, note, discountId, customerId, setMenuId, partyBookingTypeId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `insert 
                into party_booking_order
                (
                    party_booking_order_book_date,
                    party_booking_order_price,
                    party_booking_order_surcharge,
                    party_booking_order_total,
                    party_booking_order_state,
                    party_booking_order_note,
                    discount_id,
                    customer_id,
                    set_menu_id,
                    party_booking_type_id
                )
                values
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `,
                [date, price, surcharge, total, 0, note, discountId, customerId, setMenuId, partyBookingTypeId],
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
    findPartyBookingOrder: (date, price, surcharge, total, note, discountId, customerId, setMenuId, partyBookingTypeId) => {
        console.log("date, price, surcharge, total, note, discountId, customerId, setMenuId, partyBookingTypeId: ", date, price, surcharge, total, note, discountId, customerId, setMenuId, partyBookingTypeId)
        return new Promise((resolve, reject) => {
            con.query(
                `select
                party_booking_order_id,
                party_booking_order_book_date, 
                party_booking_order_finish_date, 
                party_booking_order_price,
                party_booking_order_surcharge,
                party_booking_order_total,
                party_booking_order_state,
                party_booking_order_note,
                discount_id,
                customer_id,
                set_menu_id,
                party_booking_type_id
                from party_booking_order
                where party_booking_order_book_date = ?
                and party_booking_order_finish_date is null
                and party_booking_order_price = ?
                and party_booking_order_surcharge = ?
                and party_booking_order_total = ?
                and party_booking_order_state = ?
                and party_booking_order_note = ?
                and discount_id = ?
                and customer_id = ?
                and set_menu_id = ?
                and party_booking_type_id = ?`,
                [date, price, surcharge, total, 0, note, discountId, customerId, setMenuId, partyBookingTypeId],
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
    getTotalFinishPartyBookingOrder: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                    sum(party_booking_order_total) as sum_party_booking_order_total
                    from party_booking_order
                    where party_booking_order_state = 1`,
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
    // Func: Thống kê doanh thu của đặt tiệc theo ngày kết thúc
    getTotalFinishPartyBookingOrderByFinishDate: (date, month, year) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                sum(party_booking_order_total) as sum_party_booking_order_total
                from party_booking_order
                where party_booking_order_state = 1
                and DAY(party_booking_order_finish_date) = ?
                and MONTH(party_booking_order_finish_date) = ?
                and YEAR(party_booking_order_finish_date) = ?
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
    // Func: Thống kê doanh thu của đặt tiệc theo từng tháng dựa vào ngày kết thúc theo năm
    getTotalFinishPartyBookingOrderForEachMonthByYear: (year) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                sum(
                    case month(party_booking_order_finish_date) when 1 
                    then party_booking_order_total 
                    else 0 END
                ) as thang1, 
                sum(
                    case month(party_booking_order_finish_date) when 2 
                    then party_booking_order_total
                    else 0 END
                ) as thang2, 
                sum(
                    case month(party_booking_order_finish_date) when 3 
                    then party_booking_order_total
                    else 0 END
                ) as thang3, 
                sum(
                    case month(party_booking_order_finish_date) when 4 
                    then party_booking_order_total
                    else 0 END
                ) as thang4, 
                sum(
                    case month(party_booking_order_finish_date) when 5 
                    then party_booking_order_total
                    else 0 END
                ) as thang5, 
                sum(
                    case month(party_booking_order_finish_date) when 6
                    then party_booking_order_total
                    else 0 END
                ) as thang6, 
                sum(
                    case month(party_booking_order_finish_date) when 7 
                    then party_booking_order_total
                    else 0 END
                ) as thang7, 
                sum(
                    case month(party_booking_order_finish_date) when 8 
                    then party_booking_order_total
                    else 0 END
                ) as thang8, 
                sum(
                    case month(party_booking_order_finish_date) when 9
                    then party_booking_order_total
                    else 0 END
                ) as thang9, 
                sum(
                    case month(party_booking_order_finish_date) when 10 
                    then party_booking_order_total
                    else 0 END
                ) as thang10, 
                sum(
                    case month(party_booking_order_finish_date) when 11 
                    then party_booking_order_total
                    else 0 END
                ) as thang11, 
                sum(
                    case month(party_booking_order_finish_date) when 12
                    then party_booking_order_total
                    else 0 END
                ) as thang12, 
                sum(party_booking_order_total) as canam 
                from party_booking_order
                WHERE year(party_booking_order_finish_date) = ? 
                and party_booking_order_state = 1
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