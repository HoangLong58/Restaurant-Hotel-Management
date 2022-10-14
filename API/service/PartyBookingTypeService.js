const con = require("../config/database.config");

module.exports = {
    getPartyBookingTypes: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                party_booking_type_id,
                party_booking_type_name,
                party_booking_type_state
                from party_booking_type
                where party_booking_type_state = 0`,
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
    getPartyBookingTypeByPartyBookingTypeId: (partyBookingTypeId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                party_booking_type_id,
                party_booking_type_name,
                party_booking_type_state
                from party_booking_type
                where party_booking_type_id = ?
                and party_booking_type_state = 0`,
                [partyBookingTypeId],
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