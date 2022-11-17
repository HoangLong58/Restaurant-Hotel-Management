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
                where ph.party_hall_id = ?`,
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
    updatePartyHallState: (id, state) => {
        return new Promise((resolve, reject) => {
            con.query(
                `update
                party_hall
                set party_hall_state = ? 
                where party_hall_id = ?`,
                [state, id],
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
    // ADMIN: Quản lý Sảnh tiệc - Nhà hàng
    getAllPartyHalls: () => {
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
                f.floor_name,
                pht.party_hall_type_name,
                pht.party_hall_type_state,
                phi.party_hall_image_content
                from party_hall ph 
                join floor f on f.floor_id = ph.floor_id
                join party_hall_type pht on pht.party_hall_type_id = ph.party_hall_type_id
                join party_hall_image phi on phi.party_hall_id  = ph.party_hall_id
                group by ph.party_hall_id
                order by ph.party_hall_type_id`,
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
    getQuantityPartyHalls: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                        count(party_hall_id) as quantityPartyHall 
                        from party_hall`,
                [],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        });
    },
    findPartyHallByIdOrName: (search) => {
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
                f.floor_name,
                pht.party_hall_type_name,
                pht.party_hall_type_state,
                phi.party_hall_image_content
                from party_hall ph 
                join floor f on f.floor_id = ph.floor_id
                join party_hall_type pht on pht.party_hall_type_id = ph.party_hall_type_id
                join party_hall_image phi on phi.party_hall_id  = ph.party_hall_id
                where ph.party_hall_name like concat('%', ?, '%')
                or ph.party_hall_id = ?
                group by ph.party_hall_id
                order by ph.party_hall_type_id
                `,
                [search, search],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    },
    findPartyHallById: (id) => {
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
                f.floor_name,
                pht.party_hall_type_name,
                pht.party_hall_type_state,
                phi.party_hall_image_content
                from party_hall ph 
                join floor f on f.floor_id = ph.floor_id
                join party_hall_type pht on pht.party_hall_type_id = ph.party_hall_type_id
                join party_hall_image phi on phi.party_hall_id  = ph.party_hall_id
                where ph.party_hall_id = ?
                group by ph.party_hall_id
                order by ph.party_hall_type_id`,
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
    findNewestPartyHallByInfo: (name, view, description, size, occupancy, price, state, date, floorId, partyHallTypeId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                party_hall_id,
                party_hall_name,
                party_hall_view,
                party_hall_description,
                party_hall_size,
                party_hall_occupancy,
                party_hall_price,
                party_hall_state,
                party_hall_date,
                floor_id,
                party_hall_type_id 
                from party_hall
                where party_hall_name = ?
                and party_hall_view = ?
                and party_hall_description = ?
                and party_hall_size = ?
                and party_hall_occupancy = ?
                and party_hall_price = ?
                and party_hall_state = ?
                and party_hall_date = ?
                and floor_id = ?
                and party_hall_type_id = ?`,
                [name, view, description, size, occupancy, price, state, date, floorId, partyHallTypeId],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        });
    },
    createPartyHall: (name, view, description, size, occupancy, price, state, date, floorId, partyHallTypeId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `insert 
                        into party_hall
                        (
                            party_hall_name,
                            party_hall_view,
                            party_hall_description,
                            party_hall_size,
                            party_hall_occupancy,
                            party_hall_price,
                            party_hall_state,
                            party_hall_date,
                            floor_id,
                            party_hall_type_id 
                        )
                        values
                        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [name, view, description, size, occupancy, price, state, date, floorId, partyHallTypeId],
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
    updatePartyHallById: (name, view, description, size, occupancy, price, floorId, partyHallTypeId, partyHallId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `update 
                    party_hall
                    set party_hall_name = ?,
                    party_hall_view = ?,
                    party_hall_description = ?,
                    party_hall_size = ?,
                    party_hall_occupancy = ?,
                    party_hall_price = ?,
                    floor_id = ?,
                    party_hall_type_id = ?
                    where party_hall_id = ?`,
                [name, view, description, size, occupancy, price, floorId, partyHallTypeId, partyHallId],
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
    deletePartyHall: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `delete 
                    from party_hall
                    where party_hall_id = ?`,
                [id],
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
