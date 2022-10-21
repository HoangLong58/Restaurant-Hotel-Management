const con = require("../config/database.config");

module.exports = {
    createFoodVote: (date, number, comment, customerId, foodId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `insert 
                into food_vote
                (
                    food_vote_date,
                    food_vote_number, 
                    food_vote_comment,
                    food_vote_reply,
                    food_vote_reply_date,
                    customer_id,
                    employee_id,
                    food_id
                )
                values
                (?, ?, ?, ?, ?, ?, ?, ?)
                `,
                [date, number, comment, null, null, customerId, null, foodId],
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
    getFoodVoteByFoodId: (foodId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                food_vote_id,
                food_vote_date, 
                food_vote_number, 
                food_vote_comment, 
                food_vote_reply,
                food_vote_reply_date,
                customer_id,
                employee_id,
                food_id
                from food_vote
                where food_id = ?`,
                [foodId],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    },
    getFoodVoteByFoodVoteId: (foodVoteId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                food_vote_id,
                food_vote_date, 
                food_vote_number, 
                food_vote_comment, 
                food_vote_reply,
                food_vote_reply_date,
                customer_id,
                employee_id,
                food_id
                from food_vote
                where food_vote_id = ?`,
                [foodVoteId],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        });
    },
    getFoodVoteQuantityForEachStarByFoodId: (foodId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                count(food_vote_id) as vote_quantity,
                food_vote_number
                from food_vote
                where food_id = ?
                group by food_vote_number`,
                [foodId],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    },
    getFoodVoteTotalByFoodId: (foodId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select
                count(food_vote_id) as vote_total
                from food_vote
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
    getFoodVoteWithCustomerAndEmployeeByFoodId: (foodId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                fv.food_vote_id,
                fv.food_vote_date, 
                fv.food_vote_number, 
                fv.food_vote_comment, 
                fv.food_vote_reply,
                fv.food_vote_reply_date,
                fv.customer_id,
                fv.employee_id,
                fv.food_id,
                c.customer_first_name,
                c.customer_last_name,
                c.customer_image,
                e.employee_first_name,
                e.employee_last_name,
                e.employee_image
                from food_vote fv 
                join customer c on fv.customer_id = c.customer_id
                left join employee e on fv.employee_id = e.employee_id
                where fv.food_id = ?
                order by fv.food_vote_date desc`,
                [foodId],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    },
    updateFoodVoteCommentByFoodVoteId: (number, comment, date, foodVoteId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `update
                food_vote
                set food_vote_number = ?,
                food_vote_comment = ?,
                food_vote_date = ?
                where food_vote_id = ?`,
                [number, comment, date, foodVoteId],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    if (!results) {
                        return resolve(false);
                    };
                    return resolve(true);
                }
            );
        });
    },
    deleteFoodVoteByFoodVoteId: (foodVoteId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `delete
                from food_vote
                where food_vote_id = ?`,
                [foodVoteId],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    if (!results) {
                        return resolve(false);
                    };
                    return resolve(true);
                }
            );
        });
    },
}