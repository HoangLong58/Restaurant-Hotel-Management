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
    }
};