const { getAllCitys } = require("../service/CityService");

module.exports = {
    // ADMIN: Quản lý Đặt phòng - Checkin
    getAllCitys: async (req, res) => {
        try {
            const result = await getAllCitys();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Lấy Thành phố thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getAllCitys",
                error: err
            });
        }
    }
}