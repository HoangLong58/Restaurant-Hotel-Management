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
    }
};