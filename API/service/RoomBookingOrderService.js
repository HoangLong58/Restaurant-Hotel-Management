const con = require("../config/database.config");

module.exports = {
    createRoomBookingOrder: (date, price, surcharge, total, customerId, discountId, roomBookingOrderNote) => {
        return new Promise((resolve, reject) => {
            con.query(
                `insert 
                into room_booking_order
                (
                    room_booking_order_book_date, 
                    room_booking_order_price,
                    room_booking_order_surcharge,
                    room_booking_order_total,
                    room_booking_order_state,
                    customer_id,
                    discount_id,
                    room_booking_order_note
                )
                values
                (?, ?, ?, ?, ?, ?, ?, ?)
                `,
                [date, price, surcharge, total, 0, customerId, discountId, roomBookingOrderNote],
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
    findRoomBookingOrderByRoomBookingOrderId: (roomBookingOrderId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                room_booking_order_id,
                room_booking_order_book_date, 
                room_booking_order_start_date,
                room_booking_order_finish_date, 
                room_booking_order_price,
                room_booking_order_surcharge,
                room_booking_order_total,
                room_booking_order_state,
                customer_id,
                discount_id,
                room_booking_order_note,
                room_booking_order_identity_card,
                room_booking_order_nation
                from room_booking_order
                where room_booking_order_id = ?`,
                [roomBookingOrderId],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        });
    },
    findRoomBookingOrder: (date, price, surcharge, total, customerId, discountId, roomBookingOrderNote) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                room_booking_order_id,
                room_booking_order_book_date, 
                room_booking_order_start_date,
                room_booking_order_finish_date, 
                room_booking_order_price,
                room_booking_order_surcharge,
                room_booking_order_total,
                room_booking_order_state,
                customer_id,
                discount_id,
                room_booking_order_note
                from room_booking_order
                where room_booking_order_book_date = ?
                and room_booking_order_start_date is null
                and room_booking_order_finish_date is null
                and room_booking_order_price = ?
                and room_booking_order_surcharge = ?
                and room_booking_order_total = ?
                and room_booking_order_state = ?
                and customer_id = ?
                and discount_id = ?
                and room_booking_order_note = ?`,
                [date, price, surcharge, total, 0, customerId, discountId, roomBookingOrderNote],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        });
    },
    findRoomBookingOrderByCustomerIdAndRoomIdAndKey: (customerId, roomId, key) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                rbo.room_booking_order_id,
                rbo.room_booking_order_book_date,
                rbo.room_booking_order_start_date,
                rbo.room_booking_order_finish_date,
                rbo.room_booking_order_price,
                rbo.room_booking_order_surcharge,
                rbo.room_booking_order_note,
                rbo.room_booking_order_identity_card,
                rbo.room_booking_order_nation,
                rbo.room_booking_order_total,
                rbo.room_booking_order_state,
                rbo.customer_id,
                rbo.discount_id,
                rbd.room_booking_detail_id ,
                rbd.room_booking_detail_checkin_date,
                rbd.room_booking_detail_checkout_date,
                rbd.room_booking_detail_key,
                rbd.room_id 
                from room_booking_order rbo
                join room_booking_detail rbd on rbo.room_booking_order_id = rbd.room_booking_order_id
                where rbo.customer_id = ?
                and rbd.room_id = ?
                and rbd.room_booking_detail_key = ?`,
                [customerId, roomId, key],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        });
    },
    updateRoomBookingOrderSurchargeAndTotalByRoomBookingOrderId: (surcharge, roomBookingOrderId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `update
                room_booking_order 
                set room_booking_order_surcharge = room_booking_order_surcharge + ?,
                room_booking_order_total = room_booking_order_price + room_booking_order_surcharge
                where room_booking_order_id = ?`,
                [surcharge, roomBookingOrderId],
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
    // Func: Thống kê doanh thu của đặt phòng
    getTotalFinishRoomBookingOrder: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                sum(room_booking_order_total) as sum_room_booking_order_total
                from room_booking_order
                where room_booking_order_state = 2`,
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
    // Func: Thống kê doanh thu của đặt phòng theo ngày kết thúc
    getTotalFinishRoomBookingOrderByFinishDate: (date, month, year) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                sum(room_booking_order_total) as sum_room_booking_order_total
                from room_booking_order
                where room_booking_order_state = 2
                and DAY(room_booking_order_finish_date) = ?
                and MONTH(room_booking_order_finish_date) = ?
                and YEAR(room_booking_order_finish_date) = ?
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
    // Func: Thống kê doanh thu của đặt phòng theo từng tháng dựa vào ngày kết thúc theo năm
    getTotalFinishRoomBookingOrderForEachMonthByYear: (year) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                sum(
                    case month(room_booking_order_finish_date) when 1 
                    then room_booking_order_total 
                    else 0 END
                ) as thang1, 
                sum(
                    case month(room_booking_order_finish_date) when 2 
                    then room_booking_order_total
                    else 0 END
                ) as thang2, 
                sum(
                    case month(room_booking_order_finish_date) when 3 
                    then room_booking_order_total
                    else 0 END
                ) as thang3, 
                sum(
                    case month(room_booking_order_finish_date) when 4 
                    then room_booking_order_total
                    else 0 END
                ) as thang4, 
                sum(
                    case month(room_booking_order_finish_date) when 5 
                    then room_booking_order_total
                    else 0 END
                ) as thang5, 
                sum(
                    case month(room_booking_order_finish_date) when 6
                    then room_booking_order_total
                    else 0 END
                ) as thang6, 
                sum(
                    case month(room_booking_order_finish_date) when 7 
                    then room_booking_order_total
                    else 0 END
                ) as thang7, 
                sum(
                    case month(room_booking_order_finish_date) when 8 
                    then room_booking_order_total
                    else 0 END
                ) as thang8, 
                sum(
                    case month(room_booking_order_finish_date) when 9
                    then room_booking_order_total
                    else 0 END
                ) as thang9, 
                sum(
                    case month(room_booking_order_finish_date) when 10 
                    then room_booking_order_total
                    else 0 END
                ) as thang10, 
                sum(
                    case month(room_booking_order_finish_date) when 11 
                    then room_booking_order_total
                    else 0 END
                ) as thang11, 
                sum(
                    case month(room_booking_order_finish_date) when 12
                    then room_booking_order_total
                    else 0 END
                ) as thang12, 
                sum(room_booking_order_total) as canam 
                from room_booking_order
                WHERE year(room_booking_order_finish_date) = ? 
                and room_booking_order_state = 2
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

    // ADMIN: Quản lý Đặt phòng
    getRoomBookingsAndDetail: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                rbo.room_booking_order_id,
                rbo.room_booking_order_book_date,
                rbo.room_booking_order_start_date,
                rbo.room_booking_order_finish_date,
                rbo.room_booking_order_price,
                rbo.room_booking_order_surcharge,
                rbo.room_booking_order_note,
                rbo.room_booking_order_identity_card,
                rbo.room_booking_order_nation,
                rbo.room_booking_order_total,
                rbo.room_booking_order_state,
                rbo.customer_id,
                c.customer_first_name,
                c.customer_last_name,
                c.customer_phone_number,
                c.customer_email,
                c.customer_image,
                rbo.discount_id,
                d.discount_percent,
                rbd.room_booking_detail_id ,
                rbd.room_booking_detail_checkin_date,
                rbd.room_booking_detail_checkout_date,
                rbd.room_booking_detail_key,
                rbd.room_id,
                r.room_name,
                rt.room_type_name,
                f.floor_name
                from room_booking_order rbo
                join room_booking_detail rbd on rbo.room_booking_order_id = rbd.room_booking_order_id
                join customer c on rbo.customer_id = c.customer_id
                join discount d on rbo.discount_id = d.discount_id
                join room r on rbd.room_id = r.room_id
                join room_type rt on r.room_type_id = rt.room_type_id
                join floor f on r.floor_id = f.floor_id
                order by rbo.room_booking_order_state asc`,
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
    getQuantityRoomBookings: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                count(room_booking_order_id) as quantityRoomBooking 
                from room_booking_order`,
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
    findRoomBookingByIdOrCustomerEmailOrCustomerPhoneOrCustomerNameOrRoomName: (search) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                rbo.room_booking_order_id,
                rbo.room_booking_order_book_date,
                rbo.room_booking_order_start_date,
                rbo.room_booking_order_finish_date,
                rbo.room_booking_order_price,
                rbo.room_booking_order_surcharge,
                rbo.room_booking_order_note,
                rbo.room_booking_order_identity_card,
                rbo.room_booking_order_nation,
                rbo.room_booking_order_total,
                rbo.room_booking_order_state,
                rbo.customer_id,
                c.customer_first_name,
                c.customer_last_name,
                c.customer_phone_number,
                c.customer_email,
                c.customer_image,
                rbo.discount_id,
                d.discount_percent,
                rbd.room_booking_detail_id ,
                rbd.room_booking_detail_checkin_date,
                rbd.room_booking_detail_checkout_date,
                rbd.room_booking_detail_key,
                rbd.room_id,
                r.room_name,
                rt.room_type_name,
                f.floor_name
                from room_booking_order rbo
                join room_booking_detail rbd on rbo.room_booking_order_id = rbd.room_booking_order_id
                join customer c on rbo.customer_id = c.customer_id
                join discount d on rbo.discount_id = d.discount_id
                join room r on rbd.room_id = r.room_id
                join room_type rt on r.room_type_id = rt.room_type_id
                join floor f on r.floor_id = f.floor_id 
                where c.customer_first_name like concat('%', ?, '%')
                or rbo.room_booking_order_id = ?
                or c.customer_email = ?
                or c.customer_phone_number = ?
                or c.customer_last_name like concat('%', ?, '%')
                or r.room_name like concat('%', ?, '%')
                order by rbo.room_booking_order_state asc`,
                [search, search, search, search, search, search],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    },
    findRoomBookingById: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                rbo.room_booking_order_id,
                rbo.room_booking_order_book_date,
                rbo.room_booking_order_start_date,
                rbo.room_booking_order_finish_date,
                rbo.room_booking_order_price,
                rbo.room_booking_order_surcharge,
                rbo.room_booking_order_note,
                rbo.room_booking_order_identity_card,
                rbo.room_booking_order_nation,
                rbo.room_booking_order_address,
                rbo.ward_id,
                rbo.room_booking_order_total,
                rbo.room_booking_order_state,
                rbo.customer_id,
                c.customer_first_name,
                c.customer_last_name,
                c.customer_phone_number,
                c.customer_email,
                c.customer_image,
                rbo.discount_id,
                d.discount_percent,
                rbd.room_booking_detail_id ,
                rbd.room_booking_detail_checkin_date,
                rbd.room_booking_detail_checkout_date,
                rbd.room_booking_detail_key,
                rbd.room_id,
                r.room_name,
                rt.room_type_name,
                ri.room_image_content,
                f.floor_name,
                w.ward_name,
                di.district_name,
                ci.city_name
                from room_booking_order rbo
                join room_booking_detail rbd on rbo.room_booking_order_id = rbd.room_booking_order_id
                join customer c on rbo.customer_id = c.customer_id
                join discount d on rbo.discount_id = d.discount_id
                join room r on rbd.room_id = r.room_id
                join room_type rt on r.room_type_id = rt.room_type_id
                join floor f on r.floor_id = f.floor_id 
                join room_image ri on ri.room_id = r.room_id
                left join ward w on rbo.ward_id = w.ward_id
                left join district di on w.district_id = di.district_id
                left join city ci on di.city_id = ci.city_id
                where rbo.room_booking_order_id = ?
                group by rbd.room_id`,
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
    findRoomBookingOrderByIdCheckIn: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                room_booking_order_id,
                room_booking_order_book_date, 
                room_booking_order_start_date,
                room_booking_order_finish_date, 
                room_booking_order_price,
                room_booking_order_surcharge,
                room_booking_order_total,
                room_booking_order_state,
                customer_id,
                discount_id,
                room_booking_order_note
                from room_booking_order
                where room_booking_order_id = ?`,
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
    updateRoomBookingOrderInfoWhenCheckInSuccess: (identityCard, nation, address, wardId, date, id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `update
                room_booking_order 
                set room_booking_order_identity_card = ?,
                room_booking_order_nation = ?,
                room_booking_order_address = ?,
                ward_id = ?,
                room_booking_order_start_date = ?
                where room_booking_order_id = ?`,
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
    updateRoomBookingOrderState: (state, id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `update
                room_booking_order 
                set room_booking_order_state = ?
                where room_booking_order_id = ?`,
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
    updateRoomBookingOrderFinishDateWhenCheckOutSuccess: (date, id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `update
                room_booking_order 
                set room_booking_order_finish_date = ?
                where room_booking_order_id = ?`,
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

    // ADMIN: Quản lý Đặt phòng - Thống kê doanh thu theo từng Quý
    getTotalFinishRoomBookingOrderForEachQuarterByYear: (year) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                sum(
                    case QUARTER(room_booking_order_finish_date) when 1 
                    then room_booking_order_total 
                    else 0 END
                ) as quy1, 
                sum(
                    case QUARTER(room_booking_order_finish_date) when 2 
                    then room_booking_order_total
                    else 0 END
                ) as quy2, 
                sum(
                    case QUARTER(room_booking_order_finish_date) when 3 
                    then room_booking_order_total
                    else 0 END
                ) as quy3, 
                sum(
                    case QUARTER(room_booking_order_finish_date) when 4 
                    then room_booking_order_total
                    else 0 END
                ) as quy4, 
                sum(room_booking_order_total) as canam 
                from room_booking_order
                WHERE year(room_booking_order_finish_date) = ? 
                and room_booking_order_state = 2
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

    // Admin: Quản lý đặt phòng - Thống kê doanh thu
    getDistinctDateInRoomBookingOrderFromDateToDate: (fromDate, toDate) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select distinct 
                date(rbo.room_booking_order_finish_date) as finishDate
                from room_booking_order rbo 
                join ward w on rbo.ward_id = w.ward_id
                join district d on w.district_id = d.district_id
                join city c on d.city_id = c.city_id
                where date(rbo.room_booking_order_finish_date) >= ?
                and date(rbo.room_booking_order_finish_date) <= ?
                order by date(rbo.room_booking_order_finish_date) asc
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
    getRoomBookingTotalByDate: (date) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                sum(
                    case date(rbo.room_booking_order_finish_date) when ?
                    then rbo.room_booking_order_total
                    else 0 END
                ) as total
                from room_booking_order rbo 
                join ward w on rbo.ward_id = w.ward_id 
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
    getRoomBookingTotalByMonth: (month) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                sum(
                    case month(rbo.room_booking_order_finish_date) when ?
                    then rbo.room_booking_order_total
                    else 0 END
                ) as total
                from room_booking_order rbo 
                join ward w on rbo.ward_id = w.ward_id 
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
    // Admin: Quản lý đặt phòng - Thống kê doanh thu 
    getLimitRoomBookingTotalOfCityForEachQuarter: (limit) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                c.city_name, 
                sum(
                    case QUARTER(rbo.room_booking_order_finish_date) when 1 
                    then rbo.room_booking_order_total 
                    else 0 END
                ) as quy1,
                sum(
                    case QUARTER(rbo.room_booking_order_finish_date) when 2 
                    then rbo.room_booking_order_total 
                    else 0 END
                ) as quy2,
                sum(
                    case QUARTER(rbo.room_booking_order_finish_date) when 3
                    then rbo.room_booking_order_total 
                    else 0 END
                ) as quy3,
                sum(
                    case QUARTER(rbo.room_booking_order_finish_date) when 4 
                    then rbo.room_booking_order_total 
                    else 0 END
                ) as quy4,
                c.city_id,
                sum(rbo.room_booking_order_total) as canam 
                from room_booking_order rbo 
                join ward w on rbo.ward_id = w.ward_id 
                join district d on w.district_id = d.district_id 
                join city c on d.city_id = c.city_id
                where rbo.room_booking_order_state = 2
                group by d.city_id
                order by sum(rbo.room_booking_order_total) desc
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
    getRoomBookingOrderByCityId: (cityId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                rbo.room_booking_order_id,
                rbo.room_booking_order_book_date,
                rbo.room_booking_order_start_date,
                rbo.room_booking_order_finish_date,
                rbo.room_booking_order_price,
                rbo.room_booking_order_surcharge,
                rbo.room_booking_order_note,
                rbo.room_booking_order_identity_card,
                rbo.room_booking_order_nation,                
                rbo.room_booking_order_address,
                rbo.room_booking_order_total,
                rbo.room_booking_order_state,
                rbo.customer_id,
                c.customer_first_name,
                c.customer_last_name,
                c.customer_phone_number,
                c.customer_email,
                c.customer_image,
                rbo.discount_id,
                rbd.room_booking_detail_id ,
                rbd.room_booking_detail_checkin_date,
                rbd.room_booking_detail_checkout_date,
                rbd.room_booking_detail_key,
                rbd.room_id,
                r.room_name,
                rt.room_type_name,
                f.floor_name,
                ci.city_id,
                ci.city_name,
                di.district_name,
                w.ward_name
                from room_booking_order rbo
                join room_booking_detail rbd on rbo.room_booking_order_id = rbd.room_booking_order_id
                join customer c on rbo.customer_id = c.customer_id
                join room r on rbd.room_id = r.room_id
                join room_type rt on r.room_type_id = rt.room_type_id
                join floor f on r.floor_id = f.floor_id 
                join ward w on rbo.ward_id = w.ward_id
                join district di on w.district_id = di.district_id
                join city ci on di.city_id = ci.city_id
                where ci.city_id = ?
                and rbo.room_booking_order_state = 2
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
    getRoomBookingTotalOfCityByDateAndLimitDesc: (date, limit) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                c.city_id,
                c.city_name,
                sum(
                    case DATE(rbo.room_booking_order_finish_date) when ? 
                    then rbo.room_booking_order_total 
                    else 0 END
                ) as total,
                sum(room_booking_order_total) as canam
                from room_booking_order rbo 
                join ward w on rbo.ward_id = w.ward_id 
                join district d on w.district_id = d.district_id 
                join city c on d.city_id = c.city_id
                where rbo.room_booking_order_state = 2
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
    getRoomBookingTotalOfCityByDateAndDesc: (date) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                c.city_id,
                c.city_name,
                sum(
                    case DATE(rbo.room_booking_order_finish_date) when ? 
                    then rbo.room_booking_order_total 
                    else 0 END
                ) as total,
                sum(room_booking_order_total) as canam
                from room_booking_order rbo 
                join ward w on rbo.ward_id = w.ward_id 
                join district d on w.district_id = d.district_id 
                join city c on d.city_id = c.city_id
                where rbo.room_booking_order_state = 2
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
    getRoomBookingTotalOfCityByDateAndLimitAsc: (date, limit) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                c.city_id,
                c.city_name,
                sum(
                    case DATE(rbo.room_booking_order_finish_date) when ? 
                    then rbo.room_booking_order_total 
                    else 0 END
                ) as total,
                sum(room_booking_order_total) as canam
                from room_booking_order rbo 
                join ward w on rbo.ward_id = w.ward_id 
                join district d on w.district_id = d.district_id 
                join city c on d.city_id = c.city_id
                where rbo.room_booking_order_state = 2
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
    getRoomBookingTotalOfCityByDateAndAsc: (date) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                c.city_id,
                c.city_name,
                sum(
                    case DATE(rbo.room_booking_order_finish_date) when ? 
                    then rbo.room_booking_order_total 
                    else 0 END
                ) as total,
                sum(room_booking_order_total) as canam
                from room_booking_order rbo 
                join ward w on rbo.ward_id = w.ward_id 
                join district d on w.district_id = d.district_id 
                join city c on d.city_id = c.city_id
                where rbo.room_booking_order_state = 2
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
    getRoomBookingTotalOfCityByMonthAndLimitDesc: (month, limit) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                c.city_id,
                c.city_name,
                sum(
                    case MONTH(rbo.room_booking_order_finish_date) when ? 
                    then rbo.room_booking_order_total 
                    else 0 END
                ) as total
                from room_booking_order rbo 
                join ward w on rbo.ward_id = w.ward_id 
                join district d on w.district_id = d.district_id 
                join city c on d.city_id = c.city_id
                where rbo.room_booking_order_state = 2
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
    getRoomBookingTotalOfCityByMonthAndDesc: (month) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                c.city_id,
                c.city_name,
                sum(
                    case MONTH(rbo.room_booking_order_finish_date) when ? 
                    then rbo.room_booking_order_total 
                    else 0 END
                ) as total
                from room_booking_order rbo 
                join ward w on rbo.ward_id = w.ward_id 
                join district d on w.district_id = d.district_id 
                join city c on d.city_id = c.city_id
                where rbo.room_booking_order_state = 2
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
    getRoomBookingTotalOfCityByMonthAndLimitAsc: (month, limit) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                c.city_id,
                c.city_name,
                sum(
                    case MONTH(rbo.room_booking_order_finish_date) when ? 
                    then rbo.room_booking_order_total 
                    else 0 END
                ) as total
                from room_booking_order rbo 
                join ward w on rbo.ward_id = w.ward_id 
                join district d on w.district_id = d.district_id 
                join city c on d.city_id = c.city_id
                where rbo.room_booking_order_state = 2
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
    getRoomBookingTotalOfCityByMonthAndAsc: (month) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                c.city_id,
                c.city_name,
                sum(
                    case MONTH(rbo.room_booking_order_finish_date) when ? 
                    then rbo.room_booking_order_total 
                    else 0 END
                ) as total
                from room_booking_order rbo 
                join ward w on rbo.ward_id = w.ward_id 
                join district d on w.district_id = d.district_id 
                join city c on d.city_id = c.city_id
                where rbo.room_booking_order_state = 2
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
    getRoomBookingTotalOfCityByQuarter1AnCityId: (cityId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                c.city_id,
                c.city_name,
                sum(
                    case MONTH(rbo.room_booking_order_finish_date) when 1 
                    then rbo.room_booking_order_total 
                    else 0 END
                ) as monthFirst,
                sum(
                    case MONTH(rbo.room_booking_order_finish_date) when 2 
                    then rbo.room_booking_order_total 
                    else 0 END
                ) as monthSecond,
                sum(
                    case MONTH(rbo.room_booking_order_finish_date) when 3 
                    then rbo.room_booking_order_total 
                    else 0 END
                ) as monthThird
                from room_booking_order rbo 
                join ward w on rbo.ward_id = w.ward_id 
                join district d on w.district_id = d.district_id 
                join city c on d.city_id = c.city_id
                where rbo.room_booking_order_state = 2 and c.city_id = ?
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
    getRoomBookingTotalOfCityByQuarter2AnCityId: (cityId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                c.city_id,
                c.city_name,
                sum(
                    case MONTH(rbo.room_booking_order_finish_date) when 4 
                    then rbo.room_booking_order_total 
                    else 0 END
                ) as monthFirst,
                sum(
                    case MONTH(rbo.room_booking_order_finish_date) when 5 
                    then rbo.room_booking_order_total 
                    else 0 END
                ) as monthSecond,
                sum(
                    case MONTH(rbo.room_booking_order_finish_date) when 6 
                    then rbo.room_booking_order_total 
                    else 0 END
                ) as monthThird
                from room_booking_order rbo 
                join ward w on rbo.ward_id = w.ward_id 
                join district d on w.district_id = d.district_id 
                join city c on d.city_id = c.city_id
                where rbo.room_booking_order_state = 2 and c.city_id = ?
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
    getRoomBookingTotalOfCityByQuarter3AnCityId: (cityId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                c.city_id,
                c.city_name,
                sum(
                    case MONTH(rbo.room_booking_order_finish_date) when 7 
                    then rbo.room_booking_order_total 
                    else 0 END
                ) as monthFirst,
                sum(
                    case MONTH(rbo.room_booking_order_finish_date) when 8 
                    then rbo.room_booking_order_total 
                    else 0 END
                ) as monthSecond,
                sum(
                    case MONTH(rbo.room_booking_order_finish_date) when 9 
                    then rbo.room_booking_order_total 
                    else 0 END
                ) as monthThird
                from room_booking_order rbo 
                join ward w on rbo.ward_id = w.ward_id 
                join district d on w.district_id = d.district_id 
                join city c on d.city_id = c.city_id
                where rbo.room_booking_order_state = 2 and c.city_id = ?
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
    getRoomBookingTotalOfCityByQuarter4AnCityId: (cityId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                c.city_id,
                c.city_name,
                sum(
                    case MONTH(rbo.room_booking_order_finish_date) when 10 
                    then rbo.room_booking_order_total 
                    else 0 END
                ) as monthFirst,
                sum(
                    case MONTH(rbo.room_booking_order_finish_date) when 11 
                    then rbo.room_booking_order_total 
                    else 0 END
                ) as monthSecond,
                sum(
                    case MONTH(rbo.room_booking_order_finish_date) when 12 
                    then rbo.room_booking_order_total 
                    else 0 END
                ) as monthThird
                from room_booking_order rbo 
                join ward w on rbo.ward_id = w.ward_id 
                join district d on w.district_id = d.district_id 
                join city c on d.city_id = c.city_id
                where rbo.room_booking_order_state = 2 and c.city_id = ?
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
    getRoomBookingTotalOfCityByQuarterOneOrderByCaNamDesc: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                c.city_id,
                c.city_name,
                sum(
                    case MONTH(rbo.room_booking_order_finish_date) when 1 
                    then rbo.room_booking_order_total 
                    else 0 END
                ) as monthFirst,
                sum(
                    case MONTH(rbo.room_booking_order_finish_date) when 2
                    then rbo.room_booking_order_total 
                    else 0 END
                ) as monthSecond,
                sum(
                    case MONTH(rbo.room_booking_order_finish_date) when 3 
                    then rbo.room_booking_order_total 
                    else 0 END
                ) as monthThird,
                sum(room_booking_order_total) as canam
                from room_booking_order rbo 
                join ward w on rbo.ward_id = w.ward_id 
                join district d on w.district_id = d.district_id 
                join city c on d.city_id = c.city_id
                where rbo.room_booking_order_state = 2
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
    getRoomBookingTotalOfCityByQuarterOneOrderByCaNamDescAndLimit: (limit) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                c.city_id,
                c.city_name,
                sum(
                    case MONTH(rbo.room_booking_order_finish_date) when 1 
                    then rbo.room_booking_order_total 
                    else 0 END
                ) as monthFirst,
                sum(
                    case MONTH(rbo.room_booking_order_finish_date) when 2
                    then rbo.room_booking_order_total 
                    else 0 END
                ) as monthSecond,
                sum(
                    case MONTH(rbo.room_booking_order_finish_date) when 3 
                    then rbo.room_booking_order_total 
                    else 0 END
                ) as monthThird,
                sum(room_booking_order_total) as canam
                from room_booking_order rbo 
                join ward w on rbo.ward_id = w.ward_id 
                join district d on w.district_id = d.district_id 
                join city c on d.city_id = c.city_id
                where rbo.room_booking_order_state = 2
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
    getRoomBookingTotalOfCityByQuarterOneOrderByCaNamAsc: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                c.city_id,
                c.city_name,
                sum(
                    case MONTH(rbo.room_booking_order_finish_date) when 1 
                    then rbo.room_booking_order_total 
                    else 0 END
                ) as monthFirst,
                sum(
                    case MONTH(rbo.room_booking_order_finish_date) when 2
                    then rbo.room_booking_order_total 
                    else 0 END
                ) as monthSecond,
                sum(
                    case MONTH(rbo.room_booking_order_finish_date) when 3 
                    then rbo.room_booking_order_total 
                    else 0 END
                ) as monthThird,
                sum(room_booking_order_total) as canam
                from room_booking_order rbo 
                join ward w on rbo.ward_id = w.ward_id 
                join district d on w.district_id = d.district_id 
                join city c on d.city_id = c.city_id
                where rbo.room_booking_order_state = 2
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
    getRoomBookingTotalOfCityByQuarterOneOrderByCaNamAscAndLimit: (limit) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                c.city_id,
                c.city_name,
                sum(
                    case MONTH(rbo.room_booking_order_finish_date) when 1 
                    then rbo.room_booking_order_total 
                    else 0 END
                ) as monthFirst,
                sum(
                    case MONTH(rbo.room_booking_order_finish_date) when 2
                    then rbo.room_booking_order_total 
                    else 0 END
                ) as monthSecond,
                sum(
                    case MONTH(rbo.room_booking_order_finish_date) when 3 
                    then rbo.room_booking_order_total 
                    else 0 END
                ) as monthThird,
                sum(room_booking_order_total) as canam
                from room_booking_order rbo 
                join ward w on rbo.ward_id = w.ward_id 
                join district d on w.district_id = d.district_id 
                join city c on d.city_id = c.city_id
                where rbo.room_booking_order_state = 2
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
    getRoomBookingTotalOfCityByQuarterTwoOrderByCaNamDesc: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                c.city_id,
                c.city_name,
                sum(
                    case MONTH(rbo.room_booking_order_finish_date) when 4 
                    then rbo.room_booking_order_total 
                    else 0 END
                ) as monthFirst,
                sum(
                    case MONTH(rbo.room_booking_order_finish_date) when 5
                    then rbo.room_booking_order_total 
                    else 0 END
                ) as monthSecond,
                sum(
                    case MONTH(rbo.room_booking_order_finish_date) when 6 
                    then rbo.room_booking_order_total 
                    else 0 END
                ) as monthThird,
                sum(room_booking_order_total) as canam
                from room_booking_order rbo 
                join ward w on rbo.ward_id = w.ward_id 
                join district d on w.district_id = d.district_id 
                join city c on d.city_id = c.city_id
                where rbo.room_booking_order_state = 2
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
    getRoomBookingTotalOfCityByQuarterTwoOrderByCaNamDescAndLimit: (limit) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                c.city_id,
                c.city_name,
                sum(
                    case MONTH(rbo.room_booking_order_finish_date) when 4 
                    then rbo.room_booking_order_total 
                    else 0 END
                ) as monthFirst,
                sum(
                    case MONTH(rbo.room_booking_order_finish_date) when 5
                    then rbo.room_booking_order_total 
                    else 0 END
                ) as monthSecond,
                sum(
                    case MONTH(rbo.room_booking_order_finish_date) when 6 
                    then rbo.room_booking_order_total 
                    else 0 END
                ) as monthThird,
                sum(room_booking_order_total) as canam
                from room_booking_order rbo 
                join ward w on rbo.ward_id = w.ward_id 
                join district d on w.district_id = d.district_id 
                join city c on d.city_id = c.city_id
                where rbo.room_booking_order_state = 2
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
    getRoomBookingTotalOfCityByQuarterTwoOrderByCaNamAsc: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                c.city_id,
                c.city_name,
                sum(
                    case MONTH(rbo.room_booking_order_finish_date) when 4
                    then rbo.room_booking_order_total 
                    else 0 END
                ) as monthFirst,
                sum(
                    case MONTH(rbo.room_booking_order_finish_date) when 5
                    then rbo.room_booking_order_total 
                    else 0 END
                ) as monthSecond,
                sum(
                    case MONTH(rbo.room_booking_order_finish_date) when 6 
                    then rbo.room_booking_order_total 
                    else 0 END
                ) as monthThird,
                sum(room_booking_order_total) as canam
                from room_booking_order rbo 
                join ward w on rbo.ward_id = w.ward_id 
                join district d on w.district_id = d.district_id 
                join city c on d.city_id = c.city_id
                where rbo.room_booking_order_state = 2
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
    getRoomBookingTotalOfCityByQuarterTwoOrderByCaNamAscAndLimit: (limit) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                c.city_id,
                c.city_name,
                sum(
                    case MONTH(rbo.room_booking_order_finish_date) when 4 
                    then rbo.room_booking_order_total 
                    else 0 END
                ) as monthFirst,
                sum(
                    case MONTH(rbo.room_booking_order_finish_date) when 5
                    then rbo.room_booking_order_total 
                    else 0 END
                ) as monthSecond,
                sum(
                    case MONTH(rbo.room_booking_order_finish_date) when 6 
                    then rbo.room_booking_order_total 
                    else 0 END
                ) as monthThird,
                sum(room_booking_order_total) as canam
                from room_booking_order rbo 
                join ward w on rbo.ward_id = w.ward_id 
                join district d on w.district_id = d.district_id 
                join city c on d.city_id = c.city_id
                where rbo.room_booking_order_state = 2
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
    getRoomBookingTotalOfCityByQuarterThreeOrderByCaNamDesc: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                    c.city_id,
                    c.city_name,
                    sum(
                        case MONTH(rbo.room_booking_order_finish_date) when 7 
                        then rbo.room_booking_order_total 
                        else 0 END
                    ) as monthFirst,
                    sum(
                        case MONTH(rbo.room_booking_order_finish_date) when 8
                        then rbo.room_booking_order_total 
                        else 0 END
                    ) as monthSecond,
                    sum(
                        case MONTH(rbo.room_booking_order_finish_date) when 9 
                        then rbo.room_booking_order_total 
                        else 0 END
                    ) as monthThird,
                    sum(room_booking_order_total) as canam
                    from room_booking_order rbo 
                    join ward w on rbo.ward_id = w.ward_id 
                    join district d on w.district_id = d.district_id 
                    join city c on d.city_id = c.city_id
                    where rbo.room_booking_order_state = 2
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
    getRoomBookingTotalOfCityByQuarterThreeOrderByCaNamDescAndLimit: (limit) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                    c.city_id,
                    c.city_name,
                    sum(
                        case MONTH(rbo.room_booking_order_finish_date) when 7 
                        then rbo.room_booking_order_total 
                        else 0 END
                    ) as monthFirst,
                    sum(
                        case MONTH(rbo.room_booking_order_finish_date) when 8
                        then rbo.room_booking_order_total 
                        else 0 END
                    ) as monthSecond,
                    sum(
                        case MONTH(rbo.room_booking_order_finish_date) when 9 
                        then rbo.room_booking_order_total 
                        else 0 END
                    ) as monthThird,
                    sum(room_booking_order_total) as canam
                    from room_booking_order rbo 
                    join ward w on rbo.ward_id = w.ward_id 
                    join district d on w.district_id = d.district_id 
                    join city c on d.city_id = c.city_id
                    where rbo.room_booking_order_state = 2
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
    getRoomBookingTotalOfCityByQuarterThreeOrderByCaNamAsc: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                    c.city_id,
                    c.city_name,
                    sum(
                        case MONTH(rbo.room_booking_order_finish_date) when 7
                        then rbo.room_booking_order_total 
                        else 0 END
                    ) as monthFirst,
                    sum(
                        case MONTH(rbo.room_booking_order_finish_date) when 8
                        then rbo.room_booking_order_total 
                        else 0 END
                    ) as monthSecond,
                    sum(
                        case MONTH(rbo.room_booking_order_finish_date) when 9 
                        then rbo.room_booking_order_total 
                        else 0 END
                    ) as monthThird,
                    sum(room_booking_order_total) as canam
                    from room_booking_order rbo 
                    join ward w on rbo.ward_id = w.ward_id 
                    join district d on w.district_id = d.district_id 
                    join city c on d.city_id = c.city_id
                    where rbo.room_booking_order_state = 2
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
    getRoomBookingTotalOfCityByQuarterThreeOrderByCaNamAscAndLimit: (limit) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                    c.city_id,
                    c.city_name,
                    sum(
                        case MONTH(rbo.room_booking_order_finish_date) when 7 
                        then rbo.room_booking_order_total 
                        else 0 END
                    ) as monthFirst,
                    sum(
                        case MONTH(rbo.room_booking_order_finish_date) when 8
                        then rbo.room_booking_order_total 
                        else 0 END
                    ) as monthSecond,
                    sum(
                        case MONTH(rbo.room_booking_order_finish_date) when 9 
                        then rbo.room_booking_order_total 
                        else 0 END
                    ) as monthThird,
                    sum(room_booking_order_total) as canam
                    from room_booking_order rbo 
                    join ward w on rbo.ward_id = w.ward_id 
                    join district d on w.district_id = d.district_id 
                    join city c on d.city_id = c.city_id
                    where rbo.room_booking_order_state = 2
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
    getRoomBookingTotalOfCityByQuarterFourOrderByCaNamDesc: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                    c.city_id,
                    c.city_name,
                    sum(
                        case MONTH(rbo.room_booking_order_finish_date) when 10 
                        then rbo.room_booking_order_total 
                        else 0 END
                    ) as monthFirst,
                    sum(
                        case MONTH(rbo.room_booking_order_finish_date) when 11
                        then rbo.room_booking_order_total 
                        else 0 END
                    ) as monthSecond,
                    sum(
                        case MONTH(rbo.room_booking_order_finish_date) when 12 
                        then rbo.room_booking_order_total 
                        else 0 END
                    ) as monthThird,
                    sum(room_booking_order_total) as canam
                    from room_booking_order rbo 
                    join ward w on rbo.ward_id = w.ward_id 
                    join district d on w.district_id = d.district_id 
                    join city c on d.city_id = c.city_id
                    where rbo.room_booking_order_state = 2
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
    getRoomBookingTotalOfCityByQuarterFourOrderByCaNamDescAndLimit: (limit) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                    c.city_id,
                    c.city_name,
                    sum(
                        case MONTH(rbo.room_booking_order_finish_date) when 10 
                        then rbo.room_booking_order_total 
                        else 0 END
                    ) as monthFirst,
                    sum(
                        case MONTH(rbo.room_booking_order_finish_date) when 11
                        then rbo.room_booking_order_total 
                        else 0 END
                    ) as monthSecond,
                    sum(
                        case MONTH(rbo.room_booking_order_finish_date) when 12 
                        then rbo.room_booking_order_total 
                        else 0 END
                    ) as monthThird,
                    sum(room_booking_order_total) as canam
                    from room_booking_order rbo 
                    join ward w on rbo.ward_id = w.ward_id 
                    join district d on w.district_id = d.district_id 
                    join city c on d.city_id = c.city_id
                    where rbo.room_booking_order_state = 2
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
    getRoomBookingTotalOfCityByQuarterFourOrderByCaNamAsc: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                    c.city_id,
                    c.city_name,
                    sum(
                        case MONTH(rbo.room_booking_order_finish_date) when 10
                        then rbo.room_booking_order_total 
                        else 0 END
                    ) as monthFirst,
                    sum(
                        case MONTH(rbo.room_booking_order_finish_date) when 11
                        then rbo.room_booking_order_total 
                        else 0 END
                    ) as monthSecond,
                    sum(
                        case MONTH(rbo.room_booking_order_finish_date) when 12 
                        then rbo.room_booking_order_total 
                        else 0 END
                    ) as monthThird,
                    sum(room_booking_order_total) as canam
                    from room_booking_order rbo 
                    join ward w on rbo.ward_id = w.ward_id 
                    join district d on w.district_id = d.district_id 
                    join city c on d.city_id = c.city_id
                    where rbo.room_booking_order_state = 2
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
    getRoomBookingTotalOfCityByQuarterFourOrderByCaNamAscAndLimit: (limit) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                    c.city_id,
                    c.city_name,
                    sum(
                        case MONTH(rbo.room_booking_order_finish_date) when 10 
                        then rbo.room_booking_order_total 
                        else 0 END
                    ) as monthFirst,
                    sum(
                        case MONTH(rbo.room_booking_order_finish_date) when 11
                        then rbo.room_booking_order_total 
                        else 0 END
                    ) as monthSecond,
                    sum(
                        case MONTH(rbo.room_booking_order_finish_date) when 12 
                        then rbo.room_booking_order_total 
                        else 0 END
                    ) as monthThird,
                    sum(room_booking_order_total) as canam
                    from room_booking_order rbo 
                    join ward w on rbo.ward_id = w.ward_id 
                    join district d on w.district_id = d.district_id 
                    join city c on d.city_id = c.city_id
                    where rbo.room_booking_order_state = 2
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
    getRoomBookingTotalOfCityByDateByListDate: (listDate, sort, limit) => {
        var query = "";
        query += "select c.city_id, c.city_name, "
        for (var i = 0; i < listDate.length; i++) {
            const date = listDate[i].finishDate;
            query += `sum(
                case DATE(rbo.room_booking_order_finish_date) when '` + date + `' 
                then rbo.room_booking_order_total 
                else 0 END
            ) as date` + (i + 1) + `,`;
        }
        query += `sum(room_booking_order_total) as canam
                from room_booking_order rbo 
                join ward w on rbo.ward_id = w.ward_id 
                join district d on w.district_id = d.district_id 
                join city c on d.city_id = c.city_id
                where rbo.room_booking_order_state = 2
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
    getRoomBookingTotalOfCityByDateByListDateNoLimit: (listDate, sort) => {
        var query = "";
        query += "select c.city_id, c.city_name, "
        for (var i = 0; i < listDate.length; i++) {
            const date = listDate[i].finishDate;
            query += `sum(
                case DATE(rbo.room_booking_order_finish_date) when '` + date + `' 
                then rbo.room_booking_order_total 
                else 0 END
            ) as date` + (i + 1) + `,`;
        }
        query += `sum(room_booking_order_total) as canam
                from room_booking_order rbo 
                join ward w on rbo.ward_id = w.ward_id 
                join district d on w.district_id = d.district_id 
                join city c on d.city_id = c.city_id
                where rbo.room_booking_order_state = 2
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
};