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
    },
    // Admin: Quản lý Sảnh tiệc
    createPartyHallImage: (content, partyHallId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `insert 
                into party_hall_image
                (
                    party_hall_image_content,
                    party_hall_id
                )
                values
                (?, ?)`,
                [content, partyHallId],
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
    DeletePartyHallImagesByPartyHallId: (partyHallId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `delete 
                from party_hall_image 
                where party_hall_id = ?`,
                [partyHallId],
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