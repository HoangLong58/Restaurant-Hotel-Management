const con = require("../config/database.config");

module.exports = {
    getFoodTypes: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                food_type_id,
                food_type_name,
                food_type_state
                from food_type
                where food_type_state = 0`,
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
    getFoodTypeByFoodTypeId: (foodTypeId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                food_type_id,
                food_type_name,
                food_type_state
                from food_type
                where food_type_id = ?
                and food_type_state = 0`,
                [foodTypeId],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        });
    },
    // ADMIN: Quản lý Loại món ăn - Nhà hàng
    getAllFoodTypes: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                    food_type_id,
                    food_type_name,
                    food_type_state
                    from food_type`,
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
    getQuantityFoodTypes: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                    count(food_type_id) as quantityFoodType 
                    from food_type`,
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
    findAllFoodTypeByIdOrName: (search) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                    food_type_id,
                    food_type_name,
                    food_type_state
                    from food_type 
                    where food_type_name like concat('%', ?, '%')
                    or food_type_id = ?`,
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
    findAllFoodTypeById: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                    food_type_id,
                    food_type_name,
                    food_type_state
                    from food_type 
                    where food_type_id = ?`,
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
    createFoodType: (name, state) => {
        return new Promise((resolve, reject) => {
            con.query(
                `insert 
                    into food_type
                    (
                        food_type_name,
                        food_type_state
                    )
                    values
                    (?, ?)`,
                [name, state],
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
    updateFoodTypeById: (name, id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `update 
                    food_type 
                    set food_type_name = ?
                    where food_type_id = ?`,
                [name, id],
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
    deleteFoodType: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `delete 
                    from food_type
                    where food_type_id = ?`,
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