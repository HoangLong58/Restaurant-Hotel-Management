const { getPartyBookingTypes } = require("../service/PartyBookingTypeService");

module.exports = {
    getPartyBookingTypes: async (req, res) => {
        try {
            const result = await getPartyBookingTypes();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found"
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Get all party booking types successfully!",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getPartyBookingTypes",
                error: err
            });
        }
    }
}