const con = require("../config/database.config");

module.exports = {
    createPartyHallDetail: (partyHallDetailName, partyHallDetailDate, partyHallId, partyHallTimeId, partyBookingOrderId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `insert 
                into party_hall_detail
                (
                    party_hall_detail_name, 
                    party_hall_detail_date,
                    party_hall_id,
                    party_hall_time_id,
                    party_booking_order_id
                )
                values
                (?, ?, ?, ?, ?)
                `,
                [partyHallDetailName, partyHallDetailDate, partyHallId, partyHallTimeId, partyBookingOrderId],
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
    getPartyHallDetailByPartyHallIdAndDateAndTimeId: (partyHallId, partyHallDetailDate, partyHallTimeId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                phd.party_hall_detail_id,
                phd.party_hall_detail_date,
                phd.party_hall_id,
                phd.party_hall_time_id,
                phd.party_booking_order_id,
                pbo.party_booking_order_state
                from party_hall_detail phd
                join party_booking_order pbo on phd.party_booking_order_id = pbo.party_booking_order_id
                where phd.party_hall_id = ?
                and phd.party_hall_detail_date = ?
                and phd.party_hall_time_id = ?
                and pbo.party_booking_order_state = 0`,
                [partyHallId, partyHallDetailDate, partyHallTimeId],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    },
    getPartyHallDetailByPartyHallId: (partyHallId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                phd.party_hall_detail_id,
                phd.party_hall_detail_date,
                phd.party_hall_id,
                phd.party_hall_time_id,
                phd.party_booking_order_id,
                pbo.party_booking_order_state
                from party_hall_detail phd
                join party_booking_order pbo on phd.party_booking_order_id = pbo.party_booking_order_id
                where phd.party_hall_id = ?
                and pbo.party_booking_order_state = 0`,
                [partyHallId],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        });
    },
    // ADMIN: Check in
    getPartyHallDetailByPartyBookingOrderId: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                    party_hall_detail_id,
                    party_hall_detail_name,
                    party_hall_detail_date,
                    party_hall_id,
                    party_hall_time_id,
                    party_booking_order_id 
                    from party_hall_detail
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
};