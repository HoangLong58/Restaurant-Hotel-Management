const con = require("../config/database.config");

module.exports = {
    getSetMenus: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                set_menu_id,
                set_menu_name,
                set_menu_description,
                set_menu_price,
                set_menu_image,
                set_menu_state
                from set_menu
                where set_menu_state = 0`,
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
    getSetMenuBySetMenuId: (setMenuId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                set_menu_id,
                set_menu_name,
                set_menu_description,
                set_menu_price,
                set_menu_image,
                set_menu_state
                from set_menu
                where set_menu_id = ?`,
                [setMenuId],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        });
    },
    // ADMIN: Quản lý Set Menu - Nhà hàng
    getAllSetMenus: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                set_menu_id,
                set_menu_name,
                set_menu_description,
                set_menu_price,
                set_menu_image,
                set_menu_state
                from set_menu`,
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
    getQuantitySetMenus: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                    count(set_menu_id) as quantitySetMenu 
                    from set_menu`,
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
    findSetMenuByIdOrName: (search) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                set_menu_id,
                set_menu_name,
                set_menu_description,
                set_menu_price,
                set_menu_image,
                set_menu_state
                from set_menu
                where set_menu_name like concat('%', ?, '%')
                or set_menu_id = ?`,
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
    findSetMenuById: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                    set_menu_id,
                    set_menu_name,
                    set_menu_description,
                    set_menu_price,
                    set_menu_image,
                    set_menu_state
                    from set_menu
                    where set_menu_id = ?`,
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
    createSetMenu: (name, description, price, image, state) => {
        return new Promise((resolve, reject) => {
            con.query(
                `insert 
                    into set_menu
                    (
                        set_menu_name,
                        set_menu_description,
                        set_menu_price,
                        set_menu_image,
                        set_menu_state
                    )
                    values
                    (?, ?, ?, ?, ?)`,
                [name, description, price, image, state],
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
    updateSetMenuById: (name, description, price, image, id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `update 
                    set_menu
                    set set_menu_name = ?,
                    set_menu_description = ?,
                    set_menu_price = ?,
                    set_menu_image = ?
                    where set_menu_id = ?`,
                [name, description, price, image, id],
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
    deleteSetMenu: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `delete 
                    from set_menu
                    where set_menu_id = ?`,
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
    updateSetMenuState: (state, id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `update 
                    set_menu
                    set set_menu_state = ?
                    where set_menu_id = ?`,
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