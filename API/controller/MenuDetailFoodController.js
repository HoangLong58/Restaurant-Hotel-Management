const { findAllFoodById } = require("../service/FoodService");
const { getMenuDetailFoods, getAllMenuDetailFoodBySetMenuId, getAllMenuDetailFoodByMenuDetailFoodId, deleteMenuDetailFoodByMenuDetailFoodId, createMenuDetailFood } = require("../service/MenuDetailFoodService");
const { findSetMenuById } = require("../service/SetMenuService");
const { createLogAdmin } = require("../utils/utils");

module.exports = {
    getMenuDetailFoods: async (req, res) => {
        try {
            const result = await getMenuDetailFoods();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found"
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Get all menu detail foods successfully!",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getMenuDetailFoods",
                error: err
            });
        }
    },
    // ADMIN: Quản lý Set Menu - Thêm món ăn
    getAllMenuDetailFoodBySetMenuId: async (req, res) => {
        const setMenuId = parseInt(req.params.setMenuId);
        if (!setMenuId || !Number.isInteger(setMenuId) || setMenuId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã Set Menu không hợp lệ!"
            });
        }
        // Kiểm tra có set menu không?
        try {
            const setMenuRes = await findSetMenuById(setMenuId);
            if (!setMenuRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!"
                });
            }
            // Lấy menu detail food cho set menu
            try {
                const result = await getAllMenuDetailFoodBySetMenuId(setMenuId);
                if (!result) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Record not found!",
                        data: []
                    });
                }
                return res.status(200).json({
                    status: "success",
                    message: "Lấy menu detail food by set menu id thành công",
                    data: result
                });
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Lỗi getAllMenuDetailFoodBySetMenuId",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findSetMenuById",
                error: err
            });
        }
    },
    deleteMenuDetailFood: async (req, res) => {
        const menuDetailFoodId = parseInt(req.params.menuDetailFoodId);
        if (!menuDetailFoodId || !Number.isInteger(menuDetailFoodId) || menuDetailFoodId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã Menu detail food không hợp lệ!"
            });
        }
        // Kiểm tra có Menu detail food không?
        try {
            const menuDetailFoodRes = await getAllMenuDetailFoodByMenuDetailFoodId(menuDetailFoodId);
            if (!menuDetailFoodRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!"
                });
            }
            // Lấy tên món ăn và tên menu để ghi log
            const setMenuName = menuDetailFoodRes.set_menu_name;
            const foodName = menuDetailFoodRes.food_name;
            // Xóa menu food detail cho set menu
            try {
                const result = await deleteMenuDetailFoodByMenuDetailFoodId(menuDetailFoodId);
                if (!result) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't delete menu detail food!"
                    });
                }

                createLogAdmin(req, res, " vừa xóa Món ăn " + foodName + " khỏi " + setMenuName + " với mã chi tiết: " + menuDetailFoodId, "DELETE").then(() => {
                    // Success
                    return res.status(200).json({
                        status: "success",
                        message: "Xóa Món ăn thành công!"
                    });
                });

            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Lỗi deleteMenuDetailFoodByMenuDetailFoodId",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getAllMenuDetailFoodByMenuDetailFoodId",
                error: err
            });
        }
    },
    createMenuDetailFoodByListFoodId: async (req, res) => {
        const foodListId = req.body.foodListId;
        const setMenuId = req.body.setMenuId;
        if (foodListId.length === 0) {
            return res.status(400).json({
                status: "fail",
                message: "Bạn chưa chọn Món ăn để thêm vào Set Menu này!"
            });
        }
        if (!setMenuId || !Number.isInteger(setMenuId) || setMenuId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã Set Menu không hợp lệ!"
            });
        }
        // Kiểm tra tồn tại Set Menu
        try {
            const setMenuRes = await findSetMenuById(setMenuId);
            if (!setMenuRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find room!"
                });
            }
            var setMenuName = setMenuRes.set_menu_name;
            // Lặp từng food id để kiểm tra tồn tại
            var foodNameStringLog = "";
            for (var i = 0; i < foodListId.length; i++) {
                const foodId = parseInt(foodListId[i]);
                if (!foodId || !Number.isInteger(foodId) || foodId < 0) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Mã Món ăn không hợp lệ!"
                    });
                }
                // Kiểm tra món ăn tồn tại
                try {
                    const foodRes = await findAllFoodById(foodId);
                    if (!foodRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't find food!"
                        });
                    }
                    foodNameStringLog += foodRes.food_name + ", ";
                    const foodQuantity = 1;
                    const foodPrice = foodRes.food_price;
                    // Tạo menu detail food
                    try {
                        const createMenuDetailFoodRes = await createMenuDetailFood(foodQuantity, foodPrice, setMenuId, foodId);
                        if (!createMenuDetailFoodRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't create menu detail food!"
                            });
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Lỗi createMenuDetailFood",
                            error: err
                        });
                    }
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Lỗi findAllFoodById",
                        error: err
                    });
                }
            }

            createLogAdmin(req, res, " vừa Thêm Món ăn: " + foodNameStringLog + " vào " + setMenuName, "CREATE").then(() => {
                // Success
                return res.status(200).json({
                    status: "success",
                    message: "Thêm Món ăn thành công!"
                });
            });

        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findAllFoodById",
                error: err
            });
        }
    }
}