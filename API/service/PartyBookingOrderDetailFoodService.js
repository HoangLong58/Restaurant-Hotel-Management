const con = require("../config/database.config");

module.exports = {
    // FUNC: Đặt tiệc
    getAllPartyBookingOrderDetailFoods: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                party_booking_order_detail_food_id,
                party_booking_order_id,
                food_id
                from party_booking_order_detail_food`,
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
    findPartyBookingOrderDetailFoodById: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                party_booking_order_detail_food_id,
                party_booking_order_id,
                food_id
                from party_booking_order_detail_food 
                where party_booking_order_detail_food_id = ?`,
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
    createPartyBookingOrderDetailFood: (partyBookingOrderId, foodId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `insert into party_booking_order_detail_food (party_booking_order_id, food_id) values (?, ?)`,
                [partyBookingOrderId, foodId],
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
    // ADMIN: Quản lý Đặt tiệc
    findAllPartyBookingOrderDetailFoodByPartyBookingOrderId: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                pbod.party_booking_order_detail_food_id,
                pbod.party_booking_order_id,
                pbod.food_id,
                f.food_name,
                f.food_price,
                f.food_image,
                f.food_ingredient,
                f.food_vote,
                f.food_type_id,
                ft.food_type_name
                from party_booking_order_detail_food pbod
                join food f on f.food_id = pbod.food_id
                join food_type ft on ft.food_type_id = f.food_type_id
                where pbod.party_booking_order_id = ?`,
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
};