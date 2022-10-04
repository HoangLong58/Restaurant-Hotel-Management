const con = require("../config/database.config");

module.exports = {
    getDiscounts: callBack => {
        con.query(
            `select
            discount_id,
            discount_percent,
            discount_code,
            discount_state
            from discount`,
            [],
            (error, results, fields) => {
                if (error) {
                    return callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    getDiscountById: (discountId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                discount_id,
                discount_percent,
                discount_code,
                discount_state
                from discount
                where discount_id = ?
                and discount_state = 0`,
                [discountId],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        })
    },
    getDiscountByDiscountCode: (discountCode) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                discount_id,
                discount_percent,
                discount_code,
                discount_state
                from discount
                where discount_code = ?
                and discount_state = 0`,
                [discountCode],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        })
    },
    updateDiscountState: (discountId, state) => {
        return new Promise((resolve, reject) => {
            con.query(
                `update
                discount
                set discount_state = ? 
                where discount_id = ?`,
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
    }
};