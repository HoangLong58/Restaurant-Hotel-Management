
const con = require("../config/database.config");

module.exports = {
    getPartyServiceTypes: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                party_service_type_id,
                party_service_type_name
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
    getPartyServiceTypeByPartyServiceTypeId: (partyServiceTypeId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                party_service_type_id,
                party_service_type_name
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
    }
};