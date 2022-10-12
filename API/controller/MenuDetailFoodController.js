const { getMenuDetailFoods } = require("../service/MenuDetailFoodService");

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
    }
}