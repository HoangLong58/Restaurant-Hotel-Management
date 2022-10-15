const { getTableTypes } = require("../service/TableTypeService");

module.exports = {
    getTableTypes: async (req, res) => {
        try {
            const result = await getTableTypes();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found"
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Get all table types successfully!",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getTableTypes",
                error: err
            });
        }
    }
}