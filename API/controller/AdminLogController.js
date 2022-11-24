const { getAdminLogs, getTop5AdminLogs, getAllAdminLogs, getQuantityAdminLogs, findAdminLogByIdOrName, findAdminLogById } = require("../service/AdminLogService");

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
    // ADMIN: Quản lý Nhật ký hoạt động
    getAdminLogs: async (req, res) => {
        try {
            const result = await getAllAdminLogs();
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
                message: "Lỗi getAllAdminLogs",
                error: err
            });
        }
    },
    getQuantityAdminLog: async (req, res) => {
        try {
            const result = await getQuantityAdminLogs();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Lấy quantity Admin logs thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getQuantityAdminLogs",
                error: err
            });
        }
    },
    findAdminLogByIdOrName: async (req, res) => {
        const search = req.params.search;
        try {
            const result = await findAdminLogByIdOrName(search);
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Tìm Admin logs thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findAdminLogByIdOrName",
                error: err
            });
        }
    },
    findAdminLogById: async (req, res) => {
        const adminLogId = req.body.adminLogId;
        try {
            const result = await findAdminLogById(adminLogId);
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Tìm Admin logs thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findAdminLogById",
                error: err
            });
        }
    }
}