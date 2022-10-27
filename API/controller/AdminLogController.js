const { getAdminLogs, getTop5AdminLogs } = require("../service/AdminLogService");

module.exports = {
    // ADMIN: Quản lý Admin log
    getAllAdminLogs: async (req, res) => {
        try {
            const result = await getAdminLogs();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Lấy Admin logs thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getAdminLogs",
                error: err
            });
        }
    },
    getTop5AdminLogs: async (req, res) => {
        try {
            const result = await getTop5AdminLogs();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Lấy Admin logs thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getAdminLogs",
                error: err
            });
        }
    },
}