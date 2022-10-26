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
    },

    // ADMIN: Quản lý Mã giảm giá
    getAllDiscounts: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                discount_id,
                discount_percent,
                discount_code,
                discount_state
                from discount
                order by discount_state asc, discount_percent desc`,
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
    getQuantityDiscounts: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                count(discount_id) as quantityDiscount
                from discount`,
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
    findAllDiscountByIdOrName: (search) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                discount_id,
                discount_percent,
                discount_code,
                discount_state
                from discount
                where discount_code like concat('%', ?, '%')
                or discount_id = ?`,
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
    findAllDiscountById: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                discount_id,
                discount_percent,
                discount_code,
                discount_state
                from discount 
                where discount_id = ?`,
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
    createDiscount: (percent, code, state) => {
        return new Promise((resolve, reject) => {
            con.query(
                `insert 
                into discount
                (
                    discount_percent,
                    discount_code,
                    discount_state
                )
                values
                (?, ?, ?)`,
                [percent, code, state],
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
    updateDiscountById: (percent, code, id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `update 
                discount 
                set discount_percent = ?, 
                discount_code = ?
                where discount_id = ?`,
                [percent, code, id],
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
    deleteDiscount: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `delete 
                from discount
                where discount_id = ?`,
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
    getAllDiscountByDiscountCode: (discountCode) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                discount_id,
                discount_percent,
                discount_code,
                discount_state
                from discount
                where discount_code = ?`,
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
};