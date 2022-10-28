const { getRoomImages, getRoomImagesByRoomId } = require("../service/RoomImageService");

module.exports = {
    getRoomImages: (req, res) => {
        getRoomImages((err, result) => {
            if (err) {
                console.log("Lỗi getRoomImages: ", err);
                return;
            }
            return res.json({
                status: "success",
                data: result
            });
        });
    },
    // Admin: Quản lý Phòng - Khách sạn
    getRoomImageByRoomId: async (req, res) => {
        const roomId = req.params.roomId;
        try {
            const result = await getRoomImagesByRoomId(roomId);
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Tìm room image thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getRoomImagesByRoomId",
                error: err
            });
        }
    },
}