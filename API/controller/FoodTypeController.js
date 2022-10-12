const { getFoodTypes } = require("../service/FoodTypeService");

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
    }
}