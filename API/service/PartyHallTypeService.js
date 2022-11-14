const con = require("../config/database.config");

module.exports = {
    getPartyHallTypes: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                party_hall_type_id,
                party_hall_type_name,
                party_hall_type_state
                from party_hall_type
                where party_hall_type_state = 0`,
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
                party_hall_type_name,
                party_hall_type_state
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
    },

    // ADMIN: Quản lý Loại Sảnh tiệc - Nhà hàng
    getAllPartyHallTypes: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                    party_hall_type_id,
                    party_hall_type_name,
                    party_hall_type_state
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
    getQuantityPartyHallTypes: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                        count(party_hall_type_id) as quantityPartyHallType 
                        from party_hall_type`,
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
    findPartyHallTypeByIdOrName: (search) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                        party_hall_type_id,
                        party_hall_type_name,
                        party_hall_type_state
                        from party_hall_type 
                        where party_hall_type_name like concat('%', ?, '%')
                        or party_hall_type_id = ?`,
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
    findPartyHallTypeById: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                        party_hall_type_id,
                        party_hall_type_name,
                        party_hall_type_state
                        from party_hall_type
                        where party_hall_type_id = ?`,
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
    createPartyHallType: (name, state) => {
        return new Promise((resolve, reject) => {
            con.query(
                `insert 
                        into party_hall_type
                        (
                            party_hall_type_name,
                            party_hall_type_state
                        )
                        values
                        (?, ?)`,
                [name, state],
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
    updatePartyHallTypeById: (name, id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `update 
                        party_hall_type
                        set party_hall_type_name = ?
                        where party_hall_type_id = ?`,
                [name, id],
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
    deletePartyHallType: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `delete 
                        from party_hall_type
                        where party_hall_type_id = ?`,
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
    },
    updatePartyHallTypeState: (state, id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `update 
                        party_hall_type
                        set party_hall_type_state = ?
                        where party_hall_type_id = ?`,
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
};