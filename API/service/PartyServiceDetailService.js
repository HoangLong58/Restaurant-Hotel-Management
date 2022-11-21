const con = require("../config/database.config");

module.exports = {
    // FUNC: Đặt tiệc
    getAllPartyServiceDetails: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                party_service_detail_id,
                party_service_detail_state,
                party_service_detail_quantity,
                party_service_detail_price,
                party_service_detail_total,
                party_service_id,
                party_booking_order_id
                from party_service_detail`,
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
    findPartyServiceDetailById: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                party_service_detail_id,
                party_service_detail_state,
                party_service_detail_quantity,
                party_service_detail_price,
                party_service_detail_total,
                party_service_id,
                party_booking_order_id
                from party_service_detail
                where party_service_detail_id = ?`,
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
    createPartyServiceDetail: (state, quantity, price, total, partyServiceId, partyBookingOrderId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `insert into party_service_detail (party_service_detail_state, party_service_detail_quantity, party_service_detail_price, party_service_detail_total, party_service_id, party_booking_order_id) values (?, ?, ?, ?, ?, ?)`,
                [state, quantity, price, total, partyServiceId, partyBookingOrderId],
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
    // ADMIN: Quản lý Đặt tiệc - Lấy Dịch vụ của tiệc mà state = 0 => Đã thanh toán lúc đặt
    findAllPartyServiceDetailByPartyBookingOrderIdAndState0: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                psd.party_service_detail_id,
                psd.party_service_detail_state,
                psd.party_service_detail_quantity,
                psd.party_service_detail_price,
                psd.party_service_detail_total,
                psd.party_service_id,
                psd.party_booking_order_id,
                ps.party_service_name,
                ps.party_service_price,
                ps.party_service_type_id,
                pst.party_service_type_name,
                pst.party_service_type_state
                from party_service_detail psd 
                join party_service ps on ps.party_service_id = psd.party_service_id
                join party_service_type pst on pst.party_service_type_id = ps.party_service_type_id
                where psd.party_booking_order_id = ?
                and psd.party_service_detail_state = 0`,
                [id],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    },
    // ADMIN: Quản lý Đặt tiệc - Lấy Dịch vụ của tiệc mà state = 1 => Chưa thanh toán lúc đặt
    findAllPartyServiceDetailByPartyBookingOrderIdAndState1: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                    psd.party_service_detail_id,
                    psd.party_service_detail_state,
                    psd.party_service_detail_quantity,
                    psd.party_service_detail_price,
                    psd.party_service_detail_total,
                    psd.party_service_id,
                    psd.party_booking_order_id,
                    ps.party_service_name,
                    ps.party_service_price,
                    ps.party_service_type_id,
                    pst.party_service_type_name,
                    pst.party_service_type_state
                    from party_service_detail psd 
                    join party_service ps on ps.party_service_id = psd.party_service_id
                    join party_service_type pst on pst.party_service_type_id = ps.party_service_type_id
                    where psd.party_booking_order_id = ?
                    and psd.party_service_detail_state = 1`,
                [id],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    },
    // ADMIN: Quản lý Đặt tiệc - Lấy Dịch vụ của tiệc mà state = 1 => Chưa thanh toán lúc đặt, partyBookingOrderId, partyServiceId 
    // Để tìm party service detail đã có trước đó để cập nhật lại số lượng thay vì tạo thêm row mới
    findAllPartyServiceDetailByPartyBookingOrderIdAndPartyServiceIdAndState1NeedPayment: (partyBookingOrderId, partyServiceId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                psd.party_service_detail_id,
                psd.party_service_detail_state,
                psd.party_service_detail_quantity,
                psd.party_service_detail_price,
                psd.party_service_detail_total,
                psd.party_service_id,
                psd.party_booking_order_id,
                ps.party_service_name,
                ps.party_service_price,
                ps.party_service_type_id,
                pst.party_service_type_name,
                pst.party_service_type_state
                from party_service_detail psd 
                join party_service ps on ps.party_service_id = psd.party_service_id
                join party_service_type pst on pst.party_service_type_id = ps.party_service_type_id
                where psd.party_booking_order_id = ?
                and psd.party_service_detail_state = 1
                and psd.party_service_id = ?`,
                [partyBookingOrderId, partyServiceId],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        });
    },
    // ADMIN: Quản lý Đặt tiệc - Cập nhật số lượng và giá sau khi thêm trùng dịch vụ
    updatePartyServiceDetailQuantityAndPartyServiceDetailTotalById: (quantity, total, id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `update
                    party_service_detail 
                    set party_service_detail_quantity = ?,
                    party_service_detail_total = ?
                    where party_service_detail_id = ?`,
                [quantity, total, id],
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
    deletePartyServiceDetailById: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `delete 
                        from party_service_detail
                        where party_service_detail_id = ?`,
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