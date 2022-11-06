const { getCityByCityId } = require("../service/CityService");
const { getDistrictByCityId } = require("../service/DistrictService");

module.exports = {
    // ADMIN: Quản lý Đặt phòng - Checkin
    getAllDistrictsByCityId: async (req, res) => {
        const cityId = req.params.cityId;
        if (!cityId) {
            return res.status(400).json({
                status: "fail",
                message: "Mã Thành phố không hợp lệ!"
            });
        }
        // Tìm thành phố xem có tồn tại không?
        try {
            const cityRes = await getCityByCityId(cityId);
            if (!cityRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!"
                });
            }
            // Lấy tất cả Quận từ thành phố
            try {
                const districtRes = await getDistrictByCityId(cityId);
                if (!districtRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Record not found!",
                        data: []
                    });
                }
                return res.status(200).json({
                    status: "success",
                    message: "Lấy Quận huyện thành công",
                    data: districtRes
                });
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Lỗi getDistrictByCityId",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getCityByCityId",
                error: err
            });
        }
    }
}