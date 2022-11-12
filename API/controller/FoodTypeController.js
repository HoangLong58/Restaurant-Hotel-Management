const { getFoodsAndTypeByFoodTypeId } = require("../service/FoodService");
const { getFoodTypes, getAllFoodTypes, getQuantityFoodTypes, findAllFoodTypeByIdOrName, findAllFoodTypeById, createFoodType, updateFoodTypeById, deleteFoodType } = require("../service/FoodTypeService");
const { createLogAdmin } = require("../utils/utils");

module.exports = {
    getFoodTypes: async (req, res) => {
        try {
            const result = await getFoodTypes();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found"
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Get all food types successfully!",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getFoodTypes",
                error: err
            });
        }
    },
    // ADMIN: Quản lý Loại món ăn - Nhà hàng
    getAllFoodTypes: async (req, res) => {
        try {
            const result = await getAllFoodTypes();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Lấy food types thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getAllFoodTypes",
                error: err
            });
        }
    },
    getQuantityFoodType: async (req, res) => {
        try {
            const result = await getQuantityFoodTypes();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Lấy quantity food types thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getQuantityFoodTypes",
                error: err
            });
        }
    },
    findAllFoodTypeByIdOrName: async (req, res) => {
        const search = req.params.search;
        try {
            const result = await findAllFoodTypeByIdOrName(search);
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Tìm food types thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findAllFoodTypeByIdOrName",
                error: err
            });
        }
    },
    findAllFoodTypeById: async (req, res) => {
        const foodTypeId = req.body.foodTypeId;
        try {
            const result = await findAllFoodTypeById(foodTypeId);
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Tìm food types thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findAllFoodTypeById",
                error: err
            });
        }
    },
    createFoodType: async (req, res) => {
        const foodTypeName = req.body.foodTypeName;
        const foodTypeState = 0;
        if (!foodTypeName) {
            return res.status(400).json({
                status: "fail",
                message: "Tên loại món ăn không hợp lệ!"
            });
        }
        try {
            const createFoodTypeRes = await createFoodType(foodTypeName, foodTypeState);
            if (!createFoodTypeRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't create food type!"
                });
            }

            createLogAdmin(req, res, " vừa thêm Loại món ăn mới tên: " + foodTypeName, "CREATE").then(() => {
                // Success
                return res.status(200).json({
                    status: "success",
                    message: "Thêm loại món ăn mới thành công!"
                });
            });

        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when create food type!",
                error: err
            });
        }
    },
    updateFoodType: async (req, res) => {
        const foodTypeName = req.body.foodTypeName;
        const foodTypeId = req.body.foodTypeId;
        if (!foodTypeName) {
            return res.status(400).json({
                status: "fail",
                message: "Tên loại món ăn không hợp lệ!"
            });
        }
        if (!foodTypeId || !Number.isInteger(foodTypeId) || foodTypeId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã loại món ăn không hợp lệ!"
            });
        }
        try {
            const foodTypeRes = await findAllFoodTypeById(foodTypeId);
            if (!foodTypeRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find food type!"
                });
            }
            try {
                const updateFoodTypeRes = await updateFoodTypeById(foodTypeName, foodTypeId);
                if (!updateFoodTypeRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't update food type!"
                    });
                }

                createLogAdmin(req, res, " vừa cập nhật Loại món ăn mã: " + foodTypeId, "UPDATE").then(() => {
                    // Success
                    return res.status(200).json({
                        status: "success",
                        message: "Cập nhật loại món ăn mới thành công!"
                    });
                });

            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when update food type!",
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
    deleteFoodType: async (req, res) => {
        const foodTypeId = parseInt(req.params.foodTypeId);
        if (!foodTypeId || !Number.isInteger(foodTypeId) || foodTypeId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã loại món ăn không hợp lệ!"
            });
        }
        try {
            const foodTypeRes = await findAllFoodTypeById(foodTypeId);
            if (!foodTypeRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find food type!"
                });
            }
            try {
                const deleteFoodTypeRes = await deleteFoodType(foodTypeId);
                if (!deleteFoodTypeRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't delete food type!"
                    });
                }

                createLogAdmin(req, res, " vừa xóa Loại món ăn mã: " + foodTypeId, "DELETE").then(() => {
                    // Success
                    return res.status(200).json({
                        status: "success",
                        message: "Xóa loại món ăn mới thành công!"
                    });
                });

            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when delete food type!",
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
    // Client: Giao diện Restaurant show food type and food.
    getFoodTypeAndEachFoodOfThisType: async (req, res) => {
        try {
            const foodTypeRes = await getAllFoodTypes();
            if (!foodTypeRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't get food type!"
                });
            }
            var finalArray = [];
            for (var i = 0; i < foodTypeRes.length; i++) {
                const foodTypeId = foodTypeRes[i].food_type_id;
                try {
                    const foodListRes = await getFoodsAndTypeByFoodTypeId(foodTypeId);
                    if (!foodListRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't get food list!"
                        });
                    }
                    finalArray.push({
                        foodType: foodTypeRes[i],
                        foodList: foodListRes
                    });
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when get food list!",
                        error: err
                    });
                }
            }
            // Success
            return res.status(200).json({
                status: "success",
                message: "Lấy loại món ăn và những món ăn của loại thành công!",
                data: finalArray
            });

        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when get food type!",
                error: err
            });
        }
    }
}