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

    // Admin: Quản lý Set Menu - Thêm món ăn
    getAllMenuDetailFoods: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                mdf.menu_detail_food_id,
                mdf.menu_detail_food_quantity,
                mdf.menu_detail_food_price,
                mdf.set_menu_id,
                mdf.food_id,
                sm.set_menu_name,
                sm.set_menu_description,
                sm.set_menu_price,
                sm.set_menu_image,
                sm.set_menu_state,
                f.food_name,
                f.food_price,
                f.food_image,
                f.food_ingredient,
                f.food_vote,
                f.food_type_id,
                ft.food_type_name,
                ft.food_type_state
                from menu_detail_food mdf
                join set_menu sm on sm.set_menu_id = mdf.set_menu_id
                join food f on f.food_id = mdf.food_id
                join food_type ft on ft.food_type_id = f.food_type_id`,
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
    getAllMenuDetailFoodByMenuDetailFoodId: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                mdf.menu_detail_food_id,
                mdf.menu_detail_food_quantity,
                mdf.menu_detail_food_price,
                mdf.set_menu_id,
                mdf.food_id,
                sm.set_menu_name,
                sm.set_menu_description,
                sm.set_menu_price,
                sm.set_menu_image,
                sm.set_menu_state,
                f.food_name,
                f.food_price,
                f.food_image,
                f.food_ingredient,
                f.food_vote,
                f.food_type_id,
                ft.food_type_name,
                ft.food_type_state
                from menu_detail_food mdf
                join set_menu sm on sm.set_menu_id = mdf.set_menu_id
                join food f on f.food_id = mdf.food_id
                join food_type ft on ft.food_type_id = f.food_type_id
                where mdf.menu_detail_food_id = ?
                `,
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
    getAllMenuDetailFoodBySetMenuId: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                mdf.menu_detail_food_id,
                mdf.menu_detail_food_quantity,
                mdf.menu_detail_food_price,
                mdf.set_menu_id,
                mdf.food_id,
                sm.set_menu_name,
                sm.set_menu_description,
                sm.set_menu_price,
                sm.set_menu_image,
                sm.set_menu_state,
                f.food_name,
                f.food_price,
                f.food_image,
                f.food_ingredient,
                f.food_vote,
                f.food_type_id,
                ft.food_type_name,
                ft.food_type_state
                from menu_detail_food mdf
                join set_menu sm on sm.set_menu_id = mdf.set_menu_id
                join food f on f.food_id = mdf.food_id
                join food_type ft on ft.food_type_id = f.food_type_id
                where mdf.set_menu_id = ?
                `,
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
    findMenuDetailFoodByMenuDetailFoodId: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                menu_detail_food_id,
                menu_detail_food_quantity,
                menu_detail_food_price,
                set_menu_id,
                food_id
                from menu_detail_food
                where menu_detail_food_id = ?
                `,
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
    deleteMenuDetailFoodByMenuDetailFoodId: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `delete
                from
                menu_detail_food
                where menu_detail_food_id = ?
                `,
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
    createMenuDetailFood: (foodQuantity, foodPrice, setMenuId, foodId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `insert 
                into menu_detail_food
                (
                    menu_detail_food_quantity,
                    menu_detail_food_price,
                    set_menu_id,
                    food_id
                )
                values
                (?, ?, ?, ?)`,
                [foodQuantity, foodPrice, setMenuId, foodId],
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