const con = require("../config/database.config");

module.exports = {
    // ADMIN: Quản lý Loại phòng - Khách sạn
    getRoomTypes: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                room_type_id,
                room_type_name,
                room_type_vote_total
                from room_type`,
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
    getQuantityRoomTypes: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                count(room_type_id) as quantityRoomType
                from room_type`,
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
    findRoomTypeByIdOrName: (search) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                room_type_id,
                room_type_name,
                room_type_vote_total
                from room_type 
                where room_type_name like concat('%', ?, '%')
                or room_type_id = ?`,
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
    findRoomTypeById: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                room_type_id,
                room_type_name,
                room_type_vote_total
                from room_type 
                where room_type_id = ?`,
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
    createRoomType: (name, voteTotal) => {
        return new Promise((resolve, reject) => {
            con.query(
                `insert 
                into room_type
                (
                    room_type_name,
                    room_type_vote_total
                )
                values
                (?, ?)`,
                [name, voteTotal],
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
    updateRoomTypeById: (name, id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `update 
                room_type 
                set room_type_name = ?
                where room_type_id = ?`,
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
    deleteRoomType: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `delete 
                from room_type
                where room_type_id = ?`,
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
    // ADMIN: THỐNG KÊ ĐẶT PHÒNG - THEO LOẠI
    findRoomTypeInRoomBookingOrder: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                rt.room_type_id,
                rt.room_type_name,
                rt.room_type_vote_total
                from room_type rt
                join room r on r.room_type_id = rt.room_type_id
                join room_booking_detail rbd on rbd.room_id = r.room_id
                join room_booking_order rbo on rbo.room_booking_order_id = rbd.room_booking_order_id
                where rbo.room_booking_order_state = 2
                group by rt.room_type_id`,
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
};