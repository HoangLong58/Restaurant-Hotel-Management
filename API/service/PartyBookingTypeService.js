const con = require("../config/database.config");

module.exports = {
    getPartyBookingTypes: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                party_booking_type_id,
                party_booking_type_name,
                party_booking_type_state
                from party_booking_type
                where party_booking_type_state = 0`,
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
    getPartyBookingTypeByPartyBookingTypeId: (partyBookingTypeId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                party_booking_type_id,
                party_booking_type_name,
                party_booking_type_state
                from party_booking_type
                where party_booking_type_id = ?
                and party_booking_type_state = 0`,
                [partyBookingTypeId],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        });
    },
    // ADMIN: Quản lý Loại đặt tiệc - Nhà hàng
    getAllPartyBookingTypes: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                party_booking_type_id,
                party_booking_type_name,
                party_booking_type_state
                from party_booking_type`,
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
    getQuantityPartyBookingTypes: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                    count(party_booking_type_id) as quantityPartyBookingType 
                    from party_booking_type`,
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
    findPartyBookingTypeByIdOrName: (search) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                    party_booking_type_id,
                    party_booking_type_name,
                    party_booking_type_state
                    from party_booking_type 
                    where party_booking_type_name like concat('%', ?, '%')
                    or party_booking_type_id = ?`,
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
    findPartyBookingTypeById: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                    party_booking_type_id,
                    party_booking_type_name,
                    party_booking_type_state
                    from party_booking_type
                    where party_booking_type_id = ?`,
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
    createPartyBookingType: (name, state) => {
        return new Promise((resolve, reject) => {
            con.query(
                `insert 
                    into party_booking_type
                    (
                        party_booking_type_name,
                        party_booking_type_state
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
    updatePartyBookingTypeById: (name, id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `update 
                    party_booking_type
                    set party_booking_type_name = ?
                    where party_booking_type_id = ?`,
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
    deletePartyBookingType: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `delete 
                    from party_booking_type
                    where party_booking_type_id = ?`,
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
    updatePartyBookingTypeState: (state, id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `update 
                    party_booking_type
                    set party_booking_type_state = ?
                    where party_booking_type_id = ?`,
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