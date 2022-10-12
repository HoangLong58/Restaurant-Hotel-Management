const con = require("../config/database.config");

module.exports = {
    getPartyHallTypes: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                party_hall_type_id,
                party_hall_type_name
                from party_hall_type`,
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
    getPartyHallTypeByPartyHallTypeId: (partyHallTypeId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                party_hall_type_id,
                party_hall_type_name
                from party_hall_type
                where party_hall_type_id = ?`,
                [partyHallTypeId],
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