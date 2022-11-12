const { getFoodsAndType, getFoodsAndTypeByFoodTypeId, getMinMaxFoodPriceByFoodTypeId, getFoodsAndTypeByFoodId, getAllFoods, getQuantityFoods, findAllFoodByIdOrName, findAllFoodById, createFood, updateFoodById, deleteFood } = require("../service/FoodService");
const { findAllFoodTypeById } = require("../service/FoodTypeService");
const { createLogAdmin } = require("../utils/utils");

module.exports = {
    getFoodsAndType: async (req, res) => {
        try {
            const result = await getFoodsAndType();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found"
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Get all foods and type successfully!",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getFoodsAndType",
                error: err
            });
        }
    },
    getFoodsAndTypeByFoodTypeId: async (req, res) => {
        const foodTypeId = req.body.foodTypeId;
        try {
            const result = await getFoodsAndTypeByFoodTypeId(foodTypeId);
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found"
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Get all foods and type by food type id successfully!",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getFoodsAndTypeByFoodTypeId",
                error: err
            });
        }
    },
    getFoodsAndTypeByFoodId: async (req, res) => {
        const foodId = req.params.foodId;
        try {
            const result = await getFoodsAndTypeByFoodId(foodId);
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found"
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Get foods and type by food id successfully!",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getFoodsAndTypeByFoodId",
                error: err
            });
        }
    },
    getMinMaxFoodPrice: async (req, res) => {
        const foodTypeId = req.body.foodTypeId;
        try {
            const result = await getMinMaxFoodPriceByFoodTypeId(foodTypeId);
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found"
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Get min max food price successfully!",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getMinMaxFoodPriceByFoodTypeId",
                error: err
            });
        }
    },

    // ADMIN: Quản lý Món ăn - Nhà hàng
    getAllFoods: async (req, res) => {
        try {
            const result = await getAllFoods();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Lấy food thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getAllFoods",
                error: err
            });
        }
    },
    getQuantityFood: async (req, res) => {
        try {
            const result = await getQuantityFoods();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Lấy quantity food thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getQuantityFoods",
                error: err
            });
        }
    },
    findAllFoodByIdOrName: async (req, res) => {
        const search = req.params.search;
        try {
            const result = await findAllFoodByIdOrName(search);
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Tìm food thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findAllFoodByIdOrName",
                error: err
            });
        }
    },
    findAllFoodById: async (req, res) => {
        const foodId = req.body.foodId;
        try {
            const result = await findAllFoodById(foodId);
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Tìm food thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findAllFoodById",
                error: err
            });
        }
    },
    createFood: async (req, res) => {
        const foodName = req.body.foodName;
        const foodPrice = req.body.foodPrice;
        const foodImage = req.body.foodImage;
        const foodIngredient = req.body.foodIngredient;
        const foodVote = 0;
        const foodTypeId = req.body.foodTypeId;
        if (!foodName) {
            return res.status(400).json({
                status: "fail",
                message: "Tên Món ăn không hợp lệ!"
            });
        }
        if (!foodPrice || !Number.isInteger(foodPrice) || foodPrice < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Giá món ăn không hợp lệ!"
            });
        }
        if (!foodImage) {
            return res.status(400).json({
                status: "fail",
                message: "Hình ảnh món ăn không hợp lệ!"
            });
        }
        if (!foodIngredient) {
            return res.status(400).json({
                status: "fail",
                message: "Thành phần món ăn không hợp lệ!"
            });
        }
        if (!foodTypeId || !Number.isInteger(foodTypeId) || foodTypeId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã loại món ăn không hợp lệ!"
            });
        }
        // Tìm food type
        try {
            const foodTypeRes = await findAllFoodTypeById(foodTypeId);
            if (!foodTypeRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find food type!"
                });
            }
            // Thêm food
            try {
                const createFoodRes = await createFood(foodName, foodPrice, foodImage, foodIngredient, foodVote, foodTypeId);
                if (!createFoodRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't create food!"
                    });
                }

                createLogAdmin(req, res, " vừa thêm Món ăn mới tên: " + foodName, "CREATE").then(() => {
                    // Success
                    return res.status(200).json({
                        status: "success",
                        message: "Thêm Món ăn mới thành công!"
                    });
                });

            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when create food!",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when find food type!",
                error: err
            });
        }
    },
    updateFood: async (req, res) => {
        const foodName = req.body.foodName;
        const foodPrice = req.body.foodPrice;
        const foodImage = req.body.foodImage;
        const foodIngredient = req.body.foodIngredient;
        const foodTypeId = req.body.foodTypeId;
        const foodId = req.body.foodId;
        if (!foodName) {
            return res.status(400).json({
                status: "fail",
                message: "Tên Món ăn không hợp lệ!"
            });
        }
        if (!foodPrice || !Number.isInteger(foodPrice) || foodPrice < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Giá món ăn không hợp lệ!"
            });
        }
        if (!foodImage) {
            return res.status(400).json({
                status: "fail",
                message: "Hình ảnh món ăn không hợp lệ!"
            });
        }
        if (!foodIngredient) {
            return res.status(400).json({
                status: "fail",
                message: "Thành phần món ăn không hợp lệ!"
            });
        }
        if (!foodTypeId || !Number.isInteger(foodTypeId) || foodTypeId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã loại món ăn không hợp lệ!"
            });
        }
        if (!foodId || !Number.isInteger(foodId) || foodId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã Món ăn không hợp lệ!"
            });
        }
        // Tìm food type
        try {
            const foodTypeRes = await findAllFoodTypeById(foodTypeId);
            if (!foodTypeRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find food type!"
                });
            }
            // Tìm food
            try {
                const foodRes = await findAllFoodById(foodId);
                if (!foodRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't find food!"
                    });
                }
                // Update
                try {
                    const updateFoodRes = await updateFoodById(foodName, foodPrice, foodImage, foodIngredient, foodTypeId, foodId);
                    if (!updateFoodRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't update food!"
                        });
                    }

                    createLogAdmin(req, res, " vừa cập nhật Món ăn mã: " + foodId, "UPDATE").then(() => {
                        // Success
                        return res.status(200).json({
                            status: "success",
                            message: "Cập nhật Món ăn mới thành công!"
                        });
                    });

                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when update food!",
                        error: err
                    });
                }
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when find food!",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when find food type!",
                error: err
            });
        }
    },
    deleteFood: async (req, res) => {
        const foodId = parseInt(req.params.foodId);
        if (!foodId || !Number.isInteger(foodId) || foodId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã Món ăn không hợp lệ!"
            });
        }
        try {
            const foodRes = await findAllFoodById(foodId);
            if (!foodRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find food!"
                });
            }
            try {
                const deleteFoodRes = await deleteFood(foodId);
                if (!deleteFoodRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't delete food!"
                    });
                }

                createLogAdmin(req, res, " vừa xóa Món ăn mã: " + foodId, "DELETE").then(() => {
                    // Success
                    return res.status(200).json({
                        status: "success",
                        message: "Xóa Món ăn mới thành công!"
                    });
                });

            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when delete food!",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when find food!",
                error: err
            });
        }
    }
}