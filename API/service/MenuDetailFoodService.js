const con = require("../config/database.config");

module.exports = {
    getMenuDetailFoods: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                menu_detail_food_id,
                menu_detail_food_quantity,
                menu_detail_food_price,
                set_menu_id,
                food_id
                from menu_detail_food`,
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
    getMenuDetailFoodByMenuDetailFoodId: (menuDetailFoodId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                menu_detail_food_id,
                menu_detail_food_quantity,
                menu_detail_food_price,
                set_menu_id,
                food_id
                from menu_detail_food
                where menu_detail_food_id = ?`,
                [menuDetailFoodId],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        });
    },
    getMenuDetailFoodBySetMenuId: (setMenuId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                menu_detail_food_id,
                menu_detail_food_quantity,
                menu_detail_food_price,
                set_menu_id,
                food_id
                from menu_detail_food
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
    getDistinctFoodTypeIdBySetMenuId: (setMenuId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select DISTINCT
                f.food_type_id
                from menu_detail_food mdf 
                join food f on mdf.food_id = f.food_id
                join food_type ft on f.food_type_id = ft.food_type_id
                where mdf.set_menu_id = ?`,
                [setMenuId],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    },
    getFoodBySetMenuIdAndFoodTypeId: (setMenuId, foodTypeId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                mdf.menu_detail_food_id,
                mdf.menu_detail_food_quantity,
                mdf.menu_detail_food_price,
                mdf.set_menu_id,
                mdf.food_id,
                f.food_name,
                f.food_price,
                f.food_image,
                f.food_ingredient,
                f.food_type_id,
                ft.food_type_name,
                ft.food_type_state
                from menu_detail_food mdf 
                join food f on mdf.food_id = f.food_id
                join food_type ft on f.food_type_id = ft.food_type_id
                where mdf.set_menu_id = ? and f.food_type_id = ?`,
                [setMenuId, foodTypeId],
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