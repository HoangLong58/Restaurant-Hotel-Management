const { getPartyHallImages, getPartyHallImagesByPartyHallId } = require("../service/PartyHallImageService");

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
    },
    // Admin: Quản lý Sảnh tiệc - Nhà hàng
    getPartyHallImageByPartyHallId: async (req, res) => {
        const partyHallId = req.params.partyHallId;
        try {
            const result = await getPartyHallImagesByPartyHallId(partyHallId);
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Tìm party hall image thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getPartyHallImagesByPartyHallId",
                error: err
            });
        }
    },
}