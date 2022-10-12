const con = require("../config/database.config");

module.exports = {
    getPartyHallsWithImageTypeFloor: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                ph.party_hall_id,
                ph.party_hall_name,
                ph.party_hall_view,
                ph.party_hall_description,
                ph.party_hall_price,
                ph.party_hall_size,
                ph.party_hall_occupancy,
                ph.party_hall_state,
                ph.floor_id,
                ph.party_hall_type_id,
                pht.party_hall_type_name,
                f.floor_name,
                phi.party_hall_image_content
                from party_hall ph 
                join party_hall_type pht on ph.party_hall_type_id = pht.party_hall_type_id
                join floor f on ph.floor_id = f.floor_id 
                join party_hall_image phi on ph.party_hall_id = phi.party_hall_id
                where ph.party_hall_state = 0
                group by ph.party_hall_id`,
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
    getPartyHallWithTypeFloorByPartyHallId: (partyHallId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                ph.party_hall_id,
                ph.party_hall_name,
                ph.party_hall_view,
                ph.party_hall_description,
                ph.party_hall_size,
                ph.party_hall_occupancy,
                ph.party_hall_price,
                ph.party_hall_state,
                ph.floor_id,
                ph.party_hall_type_id,
                pht.party_hall_type_name,
                f.floor_name
                from party_hall ph 
                join party_hall_type pht on ph.party_hall_type_id = pht.party_hall_type_id
                join floor f on ph.floor_id = f.floor_id 
                where ph.party_hall_state = 0
                and ph.party_hall_id = ?`,
                [partyHallId],
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
