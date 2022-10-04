const { getRoomImages } = require("../service/RoomImageService");

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
    }
}