const con = require("../config/database.config");

module.exports = {
    getFoods: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                food_id,
                food_name,
                food_price,
                food_image,
                food_ingredient,
                food_vote,
                food_type_id
                from food`,
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
    getFoodByFoodId: (foodId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                food_id,
                food_name,
                food_price,
                food_image,
                food_ingredient,
                food_vote,
                food_type_id
                from food
                where food_id = ?`,
                [foodId],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        });
    },
    getFoodsAndType: () => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                f.food_id,
                f.food_name,
                f.food_price,
                f.food_image,
                f.food_ingredient,
                f.food_vote,
                f.food_type_id,
                ft.food_type_name,
                ft.food_type_state
                from food f
                join food_type ft on f.food_type_id = ft.food_type_id
                where ft.food_type_state = 0`,
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
    getFoodsAndTypeByFoodId: (foodId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                f.food_id,
                f.food_name,
                f.food_price,
                f.food_image,
                f.food_ingredient,
                f.food_vote,
                f.food_type_id,
                ft.food_type_name,
                ft.food_type_state
                from food f
                join food_type ft on f.food_type_id = ft.food_type_id
                where ft.food_type_state = 0
                and f.food_id = ?`,
                [foodId],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        });
    },
    getFoodsAndTypeByFoodTypeId: (foodTypeId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                f.food_id,
                f.food_name,
                f.food_price,
                f.food_image,
                f.food_ingredient,
                f.food_vote,
                f.food_type_id,
                ft.food_type_name,
                ft.food_type_state
                from food f
                join food_type ft on f.food_type_id = ft.food_type_id
                where f.food_type_id = ?
                and ft.food_type_state = 0`,
                [foodTypeId],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    },
    getMinMaxFoodPriceByFoodTypeId: (foodTypeId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                min(food_price) as min_food_price, 
                max(food_price) as max_food_price 
                from food
                where food_type_id = ?`,
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
    updateFoodVoteByFoodId: (foodId, vote) => {
        return new Promise((resolve, reject) => {
            con.query(
                `update
                food
                set food_vote = ? 
                where food_id = ?`,
                [vote, foodId],
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