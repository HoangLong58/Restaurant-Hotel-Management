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
                set_menu_image
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
    getSetMenuBySetMenuId: (setMenuId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                set_menu_id,
                set_menu_name,
                set_menu_description,
                set_menu_price,
                set_menu_image
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
    }
};