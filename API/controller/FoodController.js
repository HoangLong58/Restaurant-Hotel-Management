const { getFoodsAndType, getFoodsAndTypeByFoodTypeId, getMinMaxFoodPriceByFoodTypeId } = require("../service/FoodService");

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
}