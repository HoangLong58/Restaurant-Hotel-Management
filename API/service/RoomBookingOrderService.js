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
                room_booking_order_finish_date, 
                room_booking_order_price,
                room_booking_order_surcharge,
                room_booking_order_total,
                room_booking_order_state,
                customer_id,
                discount_id,
                room_booking_order_note
                from room_booking_order
                where room_booking_order_state = 0
                and room_booking_order_id = ?`,
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
                rbo.room_booking_order_finish_date,
                rbo.room_booking_order_price,
                rbo.room_booking_order_surcharge,
                rbo.room_booking_order_note,
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
                where rbo.room_booking_order_state = 0
                and rbo.customer_id = ?
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
    }
};