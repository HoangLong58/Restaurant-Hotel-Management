const con = require("../config/database.config");

module.exports = {
    createPartyBookingOrder: (date, price, surcharge, total, note, discountId, customerId, setMenuId, partyBookingTypeId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `insert 
                into party_booking_order
                (
                    party_booking_order_book_date,
                    party_booking_order_price,
                    party_booking_order_surcharge,
                    party_booking_order_total,
                    party_booking_order_state,
                    party_booking_order_note,
                    discount_id,
                    customer_id,
                    set_menu_id,
                    party_booking_type_id
                )
                values
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `,
                [date, price, surcharge, total, 0, note, discountId, customerId, setMenuId, partyBookingTypeId],
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
    findPartyBookingOrder: (date, price, surcharge, total, note, discountId, customerId, setMenuId, partyBookingTypeId) => {
        console.log("date, price, surcharge, total, note, discountId, customerId, setMenuId, partyBookingTypeId: ", date, price, surcharge, total, note, discountId, customerId, setMenuId, partyBookingTypeId)
        return new Promise((resolve, reject) => {
            con.query(
                `select
                party_booking_order_id,
                party_booking_order_book_date, 
                party_booking_order_finish_date, 
                party_booking_order_price,
                party_booking_order_surcharge,
                party_booking_order_total,
                party_booking_order_state,
                party_booking_order_note,
                discount_id,
                customer_id,
                set_menu_id,
                party_booking_type_id
                from party_booking_order
                where party_booking_order_book_date = ?
                and party_booking_order_finish_date is null
                and party_booking_order_price = ?
                and party_booking_order_surcharge = ?
                and party_booking_order_total = ?
                and party_booking_order_state = ?
                and party_booking_order_note = ?
                and discount_id = ?
                and customer_id = ?
                and set_menu_id = ?
                and party_booking_type_id = ?`,
                [date, price, surcharge, total, 0, note, discountId, customerId, setMenuId, partyBookingTypeId],
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