const con = require("../config/database.config");

module.exports = {
    createRoomBookingDetail: (checkinDate, checkoutDate, roomId, roomBookingOrderId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `insert 
                into room_booking_detail
                (
                    room_booking_detail_checkin_date, 
                    room_booking_detail_checkout_date,
                    room_id,
                    room_booking_order_id
                )
                values
                (?, ?, ?, ?)
                `,
                [checkinDate, checkoutDate, roomId, roomBookingOrderId],
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
    getRoomBookingDetailByRoomId: (roomId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                rbd.room_booking_detail_id,
                rbd.room_booking_detail_checkin_date, 
                rbd.room_booking_detail_checkout_date,
                rbd.room_id,
                rbd.room_booking_order_id,
                rbo.room_booking_order_state
                from room_booking_detail rbd 
                join room_booking_order rbo on rbd.room_booking_order_id = rbo.room_booking_order_id
                where rbd.room_id = ?
                and rbo.room_booking_order_state = 0`,
                [roomId],
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