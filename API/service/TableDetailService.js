const con = require("../config/database.config");

module.exports = {
    // ADMIN: ĐẶT BÀN
    findTableDetailById: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                table_detail_id,
                table_detail_quantity,
                table_detail_price,
                table_detail_total,
                table_booking_order_id,
                food_id
                from table_detail
                where table_detail_id = ?`,
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
    createTableDetail: (quantity, price, total, foodId, tableBookingOrderId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `insert into table_detail (table_detail_quantity, table_detail_price, table_detail_total, food_id, table_booking_order_id) values (?, ?, ?, ?, ?)`,
                [quantity, price, total, foodId, tableBookingOrderId],
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
    // ADMIN: Quản lý Đặt Bàn - Lấy Tất cả món ăn của Bàn
    findAllTableDetailByTableBookingOrderId: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                td.table_detail_id,
                td.table_detail_quantity,
                td.table_detail_price,
                td.table_detail_total,
                td.food_id,
                td.table_booking_order_id,
                f.food_name,
                f.food_price,
                f.food_image,
                f.food_ingredient,
                f.food_vote,
                f.food_type_id,
                ft.food_type_name,
                ft.food_type_state
                from table_detail td
                join food f on f.food_id = td.food_id
                join food_type ft on ft.food_type_id = f.food_type_id
                where td.table_booking_order_id = ?`,
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
    // ADMIN: Quản lý Đặt Bàn - Lấy Món ăn của bàn mà dựa vào tableBookingOrderId, foodId 
    // Để tìm table detail đã có trước đó để cập nhật lại số lượng thay vì tạo thêm row mới
    findAllTableDetailByTableBookingOrderIdAndFoodId: (tableBookingOrderId, foodId) => {
        return new Promise((resolve, reject) => {
            con.query(
                `select 
                td.table_detail_id,
                td.table_detail_quantity,
                td.table_detail_price,
                td.table_detail_total,
                td.food_id,
                td.table_booking_order_id,
                f.food_name,
                f.food_price,
                f.food_image,
                f.food_ingredient,
                f.food_vote,
                f.food_type_id,
                ft.food_type_name,
                ft.food_type_state
                from table_detail td
                join food f on f.food_id = td.food_id
                join food_type ft on ft.food_type_id = f.food_type_id
                where td.table_booking_order_id = ?
                and td.food_id = ?`,
                [tableBookingOrderId, foodId],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        });
    },
    // ADMIN: Quản lý Đặt Bàn - Cập nhật số lượng và tổng giá sau khi thêm trùng Món ăn
    updateTableDetailQuantityAndTableDetailTotalById: (quantity, total, id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `update
                    table_detail 
                    set table_detail_quantity = ?,
                    table_detail_total = ?
                    where table_detail_id = ?`,
                [quantity, total, id],
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
    deleteTableDetailById: (id) => {
        return new Promise((resolve, reject) => {
            con.query(
                `delete 
                    from table_detail
                    where table_detail_id = ?`,
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