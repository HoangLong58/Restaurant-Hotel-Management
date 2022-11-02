const con = require("../config/database.config");

module.exports = {
    createRoomBookingFoodOrder: (bookDate, note, total, roomBookingDetailId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `insert 
                into room_booking_food_order
                (
                    room_booking_food_order_state,
                    room_booking_food_order_book_date, 
                    room_booking_food_order_note,
                    room_booking_food_order_total,
                    room_booking_detail_id
                )
                values
                (?, ?, ?, ?, ?)
                `,
                [0, bookDate, note, total, roomBookingDetailId],
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
    findRoomBookingFoodOrder: (bookDate, note, total, roomBookingDetailId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                room_booking_food_order_id,
                room_booking_food_order_state,
                room_booking_food_order_book_date, 
                room_booking_food_order_note,
                room_booking_food_order_total,
                room_booking_detail_id
                from room_booking_food_order
                where room_booking_food_order_state = 0
                and room_booking_food_order_book_date = ?
                and room_booking_food_order_note = ?
                and room_booking_food_order_total = ?
                and room_booking_detail_id = ?`,
                [bookDate, note, total, roomBookingDetailId],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        });
    },
    findRoomBookingFoodOrdersByRoomBookingDetailId: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                room_booking_food_order_id,
                room_booking_food_order_state,
                room_booking_food_order_book_date,
                room_booking_food_order_note,
                room_booking_food_order_total,
                room_booking_detail_id
                from room_booking_food_order
                where room_booking_detail_id = ?`,
                [id],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    }
};