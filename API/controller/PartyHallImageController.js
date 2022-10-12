const { getPartyHallImages } = require("../service/PartyHallImageService");

module.exports = {
    getPartyHallImages: async (req, res) => {
        try {
            const result = await getPartyHallImages();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found"
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Get all party hall images successfully!",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getPartyHallImages",
                error: err
            });
        }
    }
}