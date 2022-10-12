const con = require("../config/database.config");

module.exports = {
    getPartyHallImages: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                party_hall_image_id,
                party_hall_image_content,
                party_hall_id 
                from party_hall_image`,
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
    getPartyHallImagesByPartyHallId: (partyHallId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                party_hall_image_id,
                party_hall_image_content,
                party_hall_id
                from party_hall_image
                where party_hall_id = ?`,
                [partyHallId],
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