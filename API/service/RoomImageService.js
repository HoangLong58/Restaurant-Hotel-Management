const con = require("../config/database.config");

module.exports = {
    getRoomImages: callBack => {
        con.query(
            `select
            room_image_id,
            room_image_content,
            room_id 
            from room_image`,
            [],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    getRoomImagesByRoomId: (roomId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                room_image_id,
                room_image_content,
                room_id
                from room_image
                where room_id = ?`,
                [roomId],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    },

    // Admin: Quản lý Phòng
    createRoomImage: (content, roomId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `insert 
                into room_image
                (
                    room_image_content,
                    room_id
                )
                values
                (?, ?)`,
                [content, roomId],
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
    DeleteRoomImagesByRoomId: (roomId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `delete 
                from room_image 
                where room_id = ?`,
                [roomId],
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