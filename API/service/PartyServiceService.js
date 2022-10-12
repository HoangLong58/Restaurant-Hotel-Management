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
};