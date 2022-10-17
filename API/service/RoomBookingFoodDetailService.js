const con = require("../config/database.config");

module.exports = {
    createRoomBookingFoodDetail: (quantity, price, total, foodId, roomBookingFoodOrderId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `insert 
                into room_booking_food_detail
                (
                    room_booking_food_detail_quantity,
                    room_booking_food_detail_price, 
                    room_booking_food_detail_total,
                    food_id,
                    room_booking_food_order_id 
                )
                values
                (?, ?, ?, ?, ?)
                `,
                [quantity, price, total, foodId, roomBookingFoodOrderId],
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
    findRoomBookingFoodDetailByRoomBookingFoodDetailId: (roomBookingFoodDetailId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                room_booking_food_detail_id,
                room_booking_food_detail_quantity,
                room_booking_food_detail_price, 
                room_booking_food_detail_total,
                food_id,
                room_booking_food_order_id
                from room_booking_food_detail
                where room_booking_food_detail_id = ?`,
                [roomBookingFoodDetailId],
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