const { getPartyHallTypes } = require("../service/PartyHallTypeService");

module.exports = {
    getPartyHallTypes: async (req, res) => {
        try {
            const result = await getPartyHallTypes();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found"
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Get all party hall types successfully!",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getPartyHallTypes",
                error: err
            });
        }
    }
}