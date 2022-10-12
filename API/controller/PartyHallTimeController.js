const { getPartyHallTimes } = require("../service/PartyHallTimeService");

module.exports = {
    getPartyHallTimes: async (req, res) => {
        try {
            const result = await getPartyHallTimes();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found"
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Get all party hall times successfully!",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getPartyHallTimes",
                error: err
            });
        }
    }
}