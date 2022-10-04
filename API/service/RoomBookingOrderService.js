const con = require("../config/database.config");

module.exports = {
    createRoomBookingOrder: (date, price, surcharge, total, customerId, discountId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `insert 
                into room_booking_order
                (
                    room_booking_order_book_date, 
                    room_booking_order_price,
                    room_booking_order_surcharge,
                    room_booking_order_total,
                    customer_id,
                    discount_id
                )
                values
                (?, ?, ?, ?, ?, ?)
                `,
                [date, price, surcharge, total, customerId, discountId],
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
    findRoomBookingOrder: (date, price, surcharge, total, customerId, discountId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                room_booking_order_id,
                room_booking_order_book_date, 
                room_booking_order_price,
                room_booking_order_surcharge,
                room_booking_order_total,
                customer_id,
                discount_id
                from room_booking_order
                where room_booking_order_book_date = ?
                and room_booking_order_price = ?
                and room_booking_order_surcharge = ?
                and room_booking_order_total = ?
                and customer_id = ?
                and discount_id = ?`,
                [date, price, surcharge, total, customerId, discountId],
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