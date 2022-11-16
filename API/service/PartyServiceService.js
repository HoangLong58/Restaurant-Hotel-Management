const con = require("../config/database.config");

module.exports = {
    getPartyServices: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                party_service_id,
                party_service_name,
                party_service_price,
                party_service_type_id 
                from party_service`,
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
    getPartyServiceByPartyServiceId: (partyServiceId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                party_service_id,
                party_service_name,
                party_service_price,
                party_service_type_id 
                from party_service
                where party_service_id = ?`,
                [partyServiceId],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        });
    },
    getPartyServicesByPartyServiceTypeId: (partyServiceTypeId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                party_service_id,
                party_service_name,
                party_service_price,
                party_service_type_id 
                from party_service
                where party_service_type_id = ?`,
                [partyServiceTypeId],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    },
    // ADMIN: Quản lý Dịch vụ Tiệc - Nhà hàng
    getAllPartyServices: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                ps.party_service_id,
                ps.party_service_name,
                ps.party_service_price,
                ps.party_service_type_id,
                pst.party_service_type_name,
                pst.party_service_type_state
                from party_service ps
                join party_service_type pst on pst.party_service_type_id = ps.party_service_type_id`,
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
    getQuantityPartyServices: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                        count(party_service_id) as quantityPartyService 
                        from party_service`,
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
    findPartyServiceByIdOrName: (search) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                ps.party_service_id,
                ps.party_service_name,
                ps.party_service_price,
                ps.party_service_type_id,
                pst.party_service_type_name,
                pst.party_service_type_state
                from party_service ps
                join party_service_type pst on pst.party_service_type_id = ps.party_service_type_id
                where party_service_name like concat('%', ?, '%')
                or party_service_id = ?`,
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
    findPartyServiceById: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                ps.party_service_id,
                ps.party_service_name,
                ps.party_service_price,
                ps.party_service_type_id,
                pst.party_service_type_name,
                pst.party_service_type_state
                from party_service ps
                join party_service_type pst on pst.party_service_type_id = ps.party_service_type_id
                where party_service_id = ?`,
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
    createPartyService: (name, price, partyServiceTypeId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `insert 
                        into party_service
                        (
                            party_service_name,
                            party_service_price,
                            party_service_type_id 
                        )
                        values
                        (?, ?, ?)`,
                [name, price, partyServiceTypeId],
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
    updatePartyServiceById: (name, price, partyServiceTypeId, partyServiceId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `update 
                party_service
                set party_service_name = ?,
                party_service_price = ?,
                party_service_type_id = ?
                where party_service_id  = ?`,
                [name, price, partyServiceTypeId, partyServiceId],
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
    deletePartyService: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `delete 
                        from party_service
                        where party_service_id = ?`,
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