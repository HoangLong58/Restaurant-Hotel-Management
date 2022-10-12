const { getFoodsAndType } = require("../service/FoodService");

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
    }
}