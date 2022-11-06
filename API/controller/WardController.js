const { getWardByDistrictId } = require("../service/WardService");
const { getDistrictByDistrictId } = require("../service/DistrictService");

module.exports = {
    // ADMIN: Quản lý Đặt phòng - Checkin
    getAllWardsByDistrictId: async (req, res) => {
        const districtId = req.params.districtId;
        if (!districtId) {
            return res.status(400).json({
                status: "fail",
                message: "Mã Quận huyện không hợp lệ!"
            });
        }
        // Tìm quận huyện xem có tồn tại không?
        try {
            const districtRes = await getDistrictByDistrictId(districtId);
            if (!districtRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!"
                });
            }
            // Lấy tất cả Xã phường từ Quận
            try {
                const wardRes = await getWardByDistrictId(districtId);
                if (!wardRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Record not found!"
                    });
                }
                return res.status(200).json({
                    status: "success",
                    message: "Lấy Xã phường thành công",
                    data: wardRes
                });
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Lỗi getWardByDistrictId",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getDistrictByDistrictId",
                error: err
            });
        }
    }
}