
const con = require("../config/database.config");

module.exports = {
    getPartyServiceTypes: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                party_service_type_id,
                party_service_type_name,
                party_service_type_state
                from party_service_type
                where party_service_type_state = 0
                `,
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
    getPartyServiceTypeByPartyServiceTypeId: (partyServiceTypeId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                party_service_type_id,
                party_service_type_name,
                party_service_type_state
                from party_service_type
                where party_service_type_id = ?`,
                [partyServiceTypeId],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        });
    },
    // ADMIN: Quản lý Loại Dịch vụ tiệc - Nhà hàng
    getAllPartyServiceTypes: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                    party_service_type_id,
                    party_service_type_name,
                    party_service_type_state
                    from party_service_type`,
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
    getQuantityPartyServiceTypes: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                        count(party_service_type_id) as quantityPartyServiceType 
                        from party_service_type`,
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
    findPartyServiceTypeByIdOrName: (search) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                        party_service_type_id,
                        party_service_type_name,
                        party_service_type_state
                        from party_service_type 
                        where party_service_type_name like concat('%', ?, '%')
                        or party_service_type_id = ?`,
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
    findPartyServiceTypeById: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                        party_service_type_id,
                        party_service_type_name,
                        party_service_type_state
                        from party_service_type
                        where party_service_type_id = ?`,
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
    createPartyServiceType: (name, state) => {
        return new Promise((resolve, reject) => {
            con.query(
                `insert 
                        into party_service_type
                        (
                            party_service_type_name,
                            party_service_type_state
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
    updatePartyServiceTypeById: (name, id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `update 
                        party_service_type
                        set party_service_type_name = ?
                        where party_service_type_id = ?`,
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
    deletePartyServiceType: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `delete 
                        from party_service_type
                        where party_service_type_id = ?`,
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
    updatePartyServiceTypeState: (state, id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `update 
                        party_service_type
                        set party_service_type_state = ?
                        where party_service_type_id = ?`,
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