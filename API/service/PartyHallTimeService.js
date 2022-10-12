const con = require("../config/database.config");

module.exports = {
    getPartyHallTimes: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                party_hall_time_id,
                party_hall_time_name
                from party_hall_time`,
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
    getPartyHallTimeByPartyHallTimeId: (partyHallTimeId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                party_hall_time_id,
                party_hall_time_name
                from party_hall_time
                where party_hall_time_id = ?`,
                [partyHallTimeId],
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