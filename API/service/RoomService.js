const con = require("../config/database.config");

module.exports = {
    getRooms: callBack => {
        con.query(
            `select 
            room_id, 
            room_name, 
            room_description, 
            room_feature, 
            room_size, 
            r.room_adult_quantity, 
            r.room_child_quantity,
            room_view, 
            room_price, 
            room_state, 
            floor_id, 
            room_type_id 
            from room`,
            [],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    getRoomByRoomId: (roomId, callBack) => {
        con.query(
            `select 
            room_id, 
            room_name, 
            room_description, 
            room_feature, 
            room_size, 
            r.room_adult_quantity, 
            r.room_child_quantity,
            room_view, 
            room_price, 
            room_state, 
            floor_id, 
            room_type_id 
            from room 
            where room_id = ?`,
            [roomId],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results[0]);
            }
        );
    },
    getRoomsWithTypeAndFloor: callBack => {
        con.query(
            `select r.room_id, 
            r.room_name, 
            r.room_description, 
            r.room_feature, 
            r.room_size, 
            r.room_adult_quantity, 
            r.room_child_quantity, 
            r.room_view, 
            r.room_price, 
            r.room_state,
            r.floor_id, 
            f.floor_name,
            r.room_type_id, 
            rt.room_type_name,
            rt.room_type_vote_total
            from room r 
            join room_type rt on r.room_type_id = rt.room_type_id 
            join floor f on r.floor_id = f.floor_id`,
            [],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    getRoomsWithImageTypeFloor: callBack => {
        con.query(
            `select 
            r.room_id, 
            r.room_name,
            r.room_description, 
            r.room_feature, 
            r.room_size, 
            r.room_adult_quantity, 
            r.room_child_quantity,
            r.room_view, 
            r.room_price, 
            r.room_state, 
            r.floor_id, 
            f.floor_name, 
            r.room_type_id, 
            rt.room_type_name,
            rt.room_type_vote_total,
            ri.room_image_content
            from room r 
            join room_type rt on r.room_type_id = rt.room_type_id 
            join floor f on r.floor_id = f.floor_id 
            join room_image ri on r.room_id = ri.room_id
            where r.room_state = 0
            group by rt.room_type_id`,
            [],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    findRoomsWithImageTypeFloor: callBack => {
        con.query(
            `select 
            r.room_id, 
            r.room_name,
            r.room_description, 
            r.room_feature, 
            r.room_size, 
            r.room_adult_quantity, 
            r.room_child_quantity,
            r.room_view, 
            r.room_price, 
            r.room_state, 
            r.floor_id, 
            f.floor_name, 
            r.room_type_id, 
            rt.room_type_name,
            rt.room_type_vote_total,
            ri.room_image_content
            from room r 
            join room_type rt on r.room_type_id = rt.room_type_id 
            join floor f on r.floor_id = f.floor_id 
            join room_image ri on r.room_id = ri.room_id
            where r.room_state = 0
            group by rt.room_type_id, r.room_id`,
            [],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    getMinMaxRoomPrice: callBack => {
        con.query(
            `select 
            min(room_price) as min_room_price, 
            max(room_price) as max_room_price 
            from room;`,
            [],
            (error, results, fields) => {
                if (error) {
                    callBack(error);
                }
                return callBack(null, results[0]);
            }
        )
    },
    getRoomWithTypeAndFloorByRoomId: (roomId, callBack) => {
        con.query(
            `select r.room_id, 
            r.room_name, 
            r.room_description, 
            r.room_feature, 
            r.room_size, 
            r.room_adult_quantity, 
            r.room_child_quantity, 
            r.room_view, 
            r.room_price, 
            r.room_state,
            r.floor_id, 
            f.floor_name,
            r.room_type_id, 
            rt.room_type_name,
            rt.room_type_vote_total
            from room r 
            join room_type rt on r.room_type_id = rt.room_type_id 
            join floor f on r.floor_id = f.floor_id
            where r.room_id = ?`,
            [roomId],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results[0]);
            }
        );
    },
    findRoomByRoomId: (roomId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select r.room_id, 
                r.room_name, 
                r.room_description, 
                r.room_feature, 
                r.room_size, 
                r.room_adult_quantity, 
                r.room_child_quantity, 
                r.room_view, 
                r.room_price, 
                r.room_state,
                r.floor_id, 
                f.floor_name,
                r.room_type_id, 
                rt.room_type_name,
                rt.room_type_vote_total
                from room r 
                join room_type rt on r.room_type_id = rt.room_type_id 
                join floor f on r.floor_id = f.floor_id
                where r.room_id = ?`,
                [roomId],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        });
    },
    updateRoomState: (discountId, state) => {
        return new Promise((resolve, reject) => {
            con.query(
                `update
                room
                set room_state = ? 
                where room_id = ?`,
                [state, discountId],
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

    // ADMIN: Quản lý Phòng - Khách sạn
    getAllRooms: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                r.room_id, 
                r.room_name,
                r.room_description, 
                r.room_feature, 
                r.room_size, 
                r.room_adult_quantity, 
                r.room_child_quantity,
                r.room_view, 
                r.room_price, 
                r.room_state, 
                r.floor_id, 
                f.floor_name, 
                r.room_type_id, 
                rt.room_type_name,
                rt.room_type_vote_total,
                ri.room_image_content
                from room r 
                join room_type rt on r.room_type_id = rt.room_type_id 
                join floor f on r.floor_id = f.floor_id 
                join room_image ri on r.room_id = ri.room_id
                group by r.room_id
                order by r.room_type_id`,
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
    getQuantityRooms: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                count(room_id) as quantityRoom 
                from room`,
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
    findAllRoomByIdOrName: (search) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                r.room_id, 
                r.room_name,
                r.room_description, 
                r.room_feature, 
                r.room_size, 
                r.room_adult_quantity, 
                r.room_child_quantity,
                r.room_view, 
                r.room_price, 
                r.room_state, 
                r.floor_id, 
                f.floor_name, 
                r.room_type_id, 
                rt.room_type_name,
                rt.room_type_vote_total,
                ri.room_image_content
                from room r 
                join room_type rt on r.room_type_id = rt.room_type_id 
                join floor f on r.floor_id = f.floor_id 
                join room_image ri on r.room_id = ri.room_id
                where r.room_name like concat('%', ?, '%')
                or r.room_id = ?
                group by r.room_id`,
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
    findAllRoomById: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                r.room_id,
                r.room_name,
                r.room_description,
                r.room_feature,
                r.room_size,
                r.room_adult_quantity,
                r.room_child_quantity,
                r.room_view,
                r.room_price,
                r.room_state,
                r.floor_id,
                r.room_type_id, 
                f.floor_name,
                rt.room_type_name,
                rt.room_type_vote_total
                from room r 
                join floor f on f.floor_id = r.floor_id
                join room_type rt on rt.room_type_id = r.room_type_id
                where r.room_id = ?`,
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
    findNewestRoomByInfo: (name, description, feature, size, adultQuantity, childQuantity, view, price, state, date, floorId, roomTypeId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                room_id,
                room_name,
                room_description,
                room_feature,
                room_size,
                room_adult_quantity,
                room_child_quantity,
                room_view,
                room_price,
                room_state,
                room_date,
                floor_id,
                room_type_id
                from room
                where room_name = ?
                and room_description = ?
                and room_feature = ?
                and room_size = ?
                and room_adult_quantity = ?
                and room_child_quantity = ?
                and room_view = ?
                and room_price = ?
                and room_state = ?
                and room_date = ?
                and floor_id = ? 
                and room_type_id = ?`,
                [name, description, feature, size, adultQuantity, childQuantity, view, price, state, date, floorId, roomTypeId],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        });
    },
    createRoom: (name, description, feature, size, adultQuantity, childQuantity, view, price, state, date, floorId, roomTypeId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `insert 
                into room
                (
                    room_name,
                    room_description,
                    room_feature,
                    room_size,
                    room_adult_quantity,
                    room_child_quantity,
                    room_view,
                    room_price,
                    room_state,
                    room_date,
                    floor_id,
                    room_type_id
                )
                values
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [name, description, feature, size, adultQuantity, childQuantity, view, price, state, date, floorId, roomTypeId],
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
    updateRoomById: (name, description, feature, size, adultQuantity, childQuantity, view, price, state, floorId, roomTypeId, roomId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `update 
                room 
                set room_name = ?, 
                room_description = ?,
                room_feature = ?,
                room_size = ?,
                room_adult_quantity = ?,
                room_child_quantity = ?,
                room_view = ?,
                room_price = ?,
                room_state = ?,
                floor_id = ?,
                room_type_id = ?
                where room_id = ?`,
                [name, description, feature, size, adultQuantity, childQuantity, view, price, state, floorId, roomTypeId, roomId],
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
    deleteRoom: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `delete 
                from room
                where room_id = ?`,
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
};