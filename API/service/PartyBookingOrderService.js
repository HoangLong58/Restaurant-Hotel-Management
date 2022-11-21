const con = require("../config/database.config");

module.exports = {
    createPartyBookingOrder: (date, price, tableQuantity, surcharge, total, note, discountId, customerId, setMenuId, partyBookingTypeId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `insert 
                into party_booking_order
                (
                    party_booking_order_book_date,
                    party_booking_order_price,
                    party_booking_order_table_quantity,
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
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `,
                [date, price, tableQuantity, surcharge, total, 0, note, discountId, customerId, setMenuId, partyBookingTypeId],
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
    findPartyBookingOrder: (date, price, tableQuantity, surcharge, total, note, discountId, customerId, setMenuId, partyBookingTypeId) => {
        console.log("date, price, surcharge, total, note, discountId, customerId, setMenuId, partyBookingTypeId: ", date, price, surcharge, total, note, discountId, customerId, setMenuId, partyBookingTypeId)
        return new Promise((resolve, reject) => {
            con.query(
                `select
                party_booking_order_id,
                party_booking_order_book_date, 
                party_booking_order_finish_date, 
                party_booking_order_price,
                party_booking_order_table_quantity,
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
                and party_booking_order_table_quantity = ?
                and party_booking_order_surcharge = ?
                and party_booking_order_total = ?
                and party_booking_order_state = ?
                and party_booking_order_note = ?
                and discount_id = ?
                and customer_id = ?
                and set_menu_id = ?
                and party_booking_type_id = ?`,
                [date, price, tableQuantity, surcharge, total, 0, note, discountId, customerId, setMenuId, partyBookingTypeId],
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
                    where party_booking_order_state = 2`,
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
                where party_booking_order_state = 2
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
                and party_booking_order_state = 2
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
    // ADMIN: Quản lý Đặt tiệc
    getPartyBookingsAndDetail: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                    pbo.party_booking_order_id,
                    pbo.party_booking_order_book_date,
                    pbo.party_booking_order_start_date,
                    pbo.party_booking_order_finish_date,
                    pbo.party_booking_order_price,
                    pbo.party_booking_order_surcharge,
                    pbo.party_booking_order_total,
                    pbo.party_booking_order_state,
                    pbo.party_booking_order_note,
                    pbo.party_booking_order_identity_card,
                    pbo.party_booking_order_nation,
                    pbo.party_booking_order_address,
                    pbo.discount_id,
                    pbo.customer_id,
                    pbo.set_menu_id,
                    pbo.party_booking_type_id,
                    pbo.ward_id,
                    d.discount_percent,
                    c.customer_first_name,
                    c.customer_last_name,
                    c.customer_phone_number,
                    c.customer_email,
                    sm.set_menu_name,
                    sm.set_menu_price,
                    sm.set_menu_image,
                    sm.set_menu_state,
                    pbt.party_booking_type_name,
                    w.ward_name,
                    di.district_name,
                    ci.city_name,
                    pht.party_hall_time_name,
                    phd.party_hall_detail_name,
                    phd.party_hall_detail_date,
                    phd.party_hall_id,
                    phd.party_hall_time_id,
                    ph.party_hall_name,
                    ph.party_hall_view,
                    ph.floor_id,
                    f.floor_name,
                    phi.party_hall_image_content
                    from party_booking_order pbo
                    join discount d on d.discount_id = pbo.discount_id
                    join customer c on c.customer_id = pbo.customer_id
                    join set_menu sm on sm.set_menu_id = pbo.set_menu_id
                    join party_booking_type pbt on pbt.party_booking_type_id = pbo.party_booking_type_id
                    join party_hall_detail phd on phd.party_booking_order_id = pbo.party_booking_order_id
                    join party_hall ph on ph.party_hall_id = phd.party_hall_id
                    join party_hall_time pht on pht.party_hall_time_id = phd.party_hall_time_id
                    join floor f on f.floor_id = ph.floor_id
                    join party_hall_image phi on phi.party_hall_id = ph.party_hall_id
                    left join ward w on w.ward_id = pbo.ward_id
                    left join district di on w.district_id = di.district_id
                    left join city ci on di.city_id = ci.city_id
                    group by pbo.party_booking_order_id
                    order by pbo.party_booking_order_state asc`,
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
    getQuantityPartyBookings: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                    count(party_booking_order_id) as quantityPartyBooking 
                    from party_booking_order`,
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
    findPartyBookingByIdOrCustomerEmailOrCustomerPhoneOrCustomerName: (search) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                    pbo.party_booking_order_id,
                    pbo.party_booking_order_book_date,
                    pbo.party_booking_order_start_date,
                    pbo.party_booking_order_finish_date,
                    pbo.party_booking_order_price,
                    pbo.party_booking_order_surcharge,
                    pbo.party_booking_order_total,
                    pbo.party_booking_order_state,
                    pbo.party_booking_order_note,
                    pbo.party_booking_order_identity_card,
                    pbo.party_booking_order_nation,
                    pbo.party_booking_order_address,
                    pbo.discount_id,
                    pbo.customer_id,
                    pbo.set_menu_id,
                    pbo.party_booking_type_id,
                    pbo.ward_id,
                    d.discount_percent,
                    c.customer_first_name,
                    c.customer_last_name,
                    c.customer_phone_number,
                    c.customer_email,
                    sm.set_menu_name,
                    sm.set_menu_price,
                    sm.set_menu_image,
                    sm.set_menu_state,
                    pbt.party_booking_type_name,
                    w.ward_name,
                    di.district_name,
                    ci.city_name,
                    pht.party_hall_time_name,
                    phd.party_hall_detail_name,
                    phd.party_hall_detail_date,
                    phd.party_hall_id,
                    phd.party_hall_time_id,
                    ph.party_hall_name,
                    ph.party_hall_view,
                    ph.floor_id,
                    f.floor_name,
                    phi.party_hall_image_content
                    from party_booking_order pbo
                    join discount d on d.discount_id = pbo.discount_id
                    join customer c on c.customer_id = pbo.customer_id
                    join set_menu sm on sm.set_menu_id = pbo.set_menu_id
                    join party_booking_type pbt on pbt.party_booking_type_id = pbo.party_booking_type_id
                    join party_hall_detail phd on phd.party_booking_order_id = pbo.party_booking_order_id
                    join party_hall ph on ph.party_hall_id = phd.party_hall_id
                    join party_hall_time pht on pht.party_hall_time_id = phd.party_hall_time_id
                    join floor f on f.floor_id = ph.floor_id
                    join party_hall_image phi on phi.party_hall_id = ph.party_hall_id
                    left join ward w on w.ward_id = pbo.ward_id
                    left join district di on w.district_id = di.district_id
                    left join city ci on di.city_id = ci.city_id
                    where c.customer_first_name like concat('%', ?, '%')
                    or pbo.party_booking_order_id = ?
                    or c.customer_email = ?
                    or c.customer_phone_number = ?
                    or c.customer_last_name like concat('%', ?, '%')
                    group by pbo.party_booking_order_id
                    order by pbo.party_booking_order_state asc`,
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
    findPartyBookingById: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                    pbo.party_booking_order_id,
                    pbo.party_booking_order_book_date,
                    pbo.party_booking_order_start_date,
                    pbo.party_booking_order_finish_date,
                    pbo.party_booking_order_price,
                    pbo.party_booking_order_table_quantity,
                    pbo.party_booking_order_surcharge,
                    pbo.party_booking_order_total,
                    pbo.party_booking_order_state,
                    pbo.party_booking_order_note,
                    pbo.party_booking_order_identity_card,
                    pbo.party_booking_order_nation,
                    pbo.party_booking_order_address,
                    pbo.discount_id,
                    pbo.customer_id,
                    pbo.set_menu_id,
                    pbo.party_booking_type_id,
                    pbo.ward_id,
                    d.discount_percent,
                    c.customer_first_name,
                    c.customer_last_name,
                    c.customer_phone_number,
                    c.customer_email,
                    sm.set_menu_name,
                    sm.set_menu_price,
                    sm.set_menu_image,
                    sm.set_menu_state,
                    pbt.party_booking_type_name,
                    w.ward_name,
                    di.district_name,
                    ci.city_name,
                    pht.party_hall_time_name,
                    phd.party_hall_detail_name,
                    phd.party_hall_detail_date,
                    phd.party_hall_id,
                    phd.party_hall_time_id,
                    ph.party_hall_name,
                    ph.party_hall_view,
                    ph.floor_id,
                    f.floor_name,
                    phi.party_hall_image_content
                    from party_booking_order pbo
                    join discount d on d.discount_id = pbo.discount_id
                    join customer c on c.customer_id = pbo.customer_id
                    join set_menu sm on sm.set_menu_id = pbo.set_menu_id
                    join party_booking_type pbt on pbt.party_booking_type_id = pbo.party_booking_type_id
                    join party_hall_detail phd on phd.party_booking_order_id = pbo.party_booking_order_id
                    join party_hall ph on ph.party_hall_id = phd.party_hall_id
                    join party_hall_time pht on pht.party_hall_time_id = phd.party_hall_time_id
                    join floor f on f.floor_id = ph.floor_id
                    join party_hall_image phi on phi.party_hall_id = ph.party_hall_id
                    left join ward w on w.ward_id = pbo.ward_id
                    left join district di on w.district_id = di.district_id
                    left join city ci on di.city_id = ci.city_id
                    where pbo.party_booking_order_id = ?
                    group by pbo.party_booking_order_id`,
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
    findPartyBookingOrderByIdCheckIn: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                party_booking_order_id,
                party_booking_order_book_date,
                party_booking_order_start_date,
                party_booking_order_finish_date,
                party_booking_order_price,
                party_booking_order_table_quantity,
                party_booking_order_surcharge,
                party_booking_order_total,
                party_booking_order_state,
                party_booking_order_note,
                party_booking_order_identity_card,
                party_booking_order_nation,
                party_booking_order_address,
                discount_id,
                customer_id,
                set_menu_id,
                party_booking_type_id,
                ward_id
                from party_booking_order
                where party_booking_order_id = ?`,
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
    updatePartyBookingOrderInfoWhenCheckInSuccess: (identityCard, nation, address, wardId, date, id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `update
                party_booking_order 
                set party_booking_order_identity_card = ?,
                party_booking_order_nation = ?,
                party_booking_order_address = ?,
                ward_id = ?,
                party_booking_order_start_date = ?
                where party_booking_order_id = ?`,
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
    updatePartyBookingOrderState: (state, id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `update
                party_booking_order 
                set party_booking_order_state = ?
                where party_booking_order_id = ?`,
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
    updatePartyBookingOrderFinishDateWhenCheckOutSuccess: (date, id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `update
                party_booking_order 
                set party_booking_order_finish_date = ?
                where party_booking_order_id = ?`,
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
    // ADMIN: Quản lý Đặt tiệc - CẬP NHẬT PHỤ PHÍ VÀ TỔNG PHÍ CỦA ĐƠN ĐẶT TIỆC
    updatePartyBookingOrderSurchargeAndPartyBookingOrderTotalByPartyBookingOrderId: (surcharge, id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `update
                party_booking_order 
                set party_booking_order_surcharge = ?,
                party_booking_order_total = party_booking_order_price + ?
                where party_booking_order_id = ?`,
                [surcharge, surcharge, id],
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