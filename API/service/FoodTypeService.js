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
    }
};