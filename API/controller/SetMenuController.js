const { getFoodTypeByFoodTypeId } = require("../service/FoodTypeService");
const { getDistinctFoodTypeIdBySetMenuId, getFoodBySetMenuIdAndFoodTypeId } = require("../service/MenuDetailFoodService");
const { getSetMenus } = require("../service/SetMenuService");

module.exports = {
    getSetMenus: async (req, res) => {
        try {
            const result = await getSetMenus();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found"
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Get all set menus successfully!",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getSetMenus",
                error: err
            });
        }
    },
    getSetMenuAndMenuDetailFoodAndFoodAndType: async (req, res) => {
        // Lấy thông tin tất cả set menu
        try {
            const finalResult = [];
            const setMenuRes = await getSetMenus();
            if (!setMenuRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Set menu record not found"
                });
            }
            for (var i = 0; i < setMenuRes.length; i++) {
                const setMenuId = setMenuRes[i].set_menu_id;
                let finalResultItem = {};
                let setMenu = { ...setMenuRes[i] };
                let foodTypeWithFoods = [];
                // Lấy các food_type từ set_menu_id
                try {
                    const foodTypeInMenuDetailRes = await getDistinctFoodTypeIdBySetMenuId(setMenuId);
                    if (!foodTypeInMenuDetailRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Food type distinct record not found"
                        });
                    }
                    for (var j = 0; j < foodTypeInMenuDetailRes.length; j++) {
                        const foodTypeId = foodTypeInMenuDetailRes[j].food_type_id;
                        let foodTypeWithFoodsItem = {};
                        // Lấy thông tin food type
                        try {
                            const foodTypeRes = await getFoodTypeByFoodTypeId(foodTypeId);
                            if (!foodTypeRes) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Food type record not found"
                                });
                            }
                            // Lấy foods từ food_type
                            try {
                                const foodRes = await getFoodBySetMenuIdAndFoodTypeId(setMenuId, foodTypeId);
                                if (!foodRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Food record not found"
                                    });
                                }
                                foodTypeWithFoodsItem = {
                                    foodType: foodTypeRes,
                                    food: foodRes
                                };
                                foodTypeWithFoods.push(foodTypeWithFoodsItem);
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Lỗi getFoodBySetMenuIdAndFoodTypeId",
                                    error: err
                                });
                            }
                        } catch (err) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Lỗi getFoodTypeByFoodTypeId",
                                error: err
                            });
                        }
                    }
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Lỗi getDistinctFoodTypeIdBySetMenuId",
                        error: err
                    });
                }
                finalResultItem = {
                    setMenu: setMenu,
                    foodTypeAndFoods: foodTypeWithFoods
                };
                finalResult.push(finalResultItem);
            }
            return res.status(200).json({
                status: "success",
                message: "Get set menu with food and type",
                data: finalResult
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getSetMenus",
                error: err
            });
        }
    },
}