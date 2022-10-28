const { getServices, getAllServices, getQuantityServices, findServiceByIdOrName, findServiceById, createService, updateServiceById, deleteService } = require("../service/ServiceService");
const { createLogAdmin } = require("../utils/utils");

module.exports = {
    getServices: (req, res) => {
        getServices((err, result) => {
            if (err) {
                console.log("Lỗi getServices: ", err);
                return;
            }
            return res.json({
                status: "success",
                data: result
            });
        });
    },

    // ADMIN: Quản lý Dịch vụ - Khách sạn
    getAllServices: async (req, res) => {
        try {
            const result = await getAllServices();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Lấy services thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getAllServices",
                error: err
            });
        }
    },
    getQuantityService: async (req, res) => {
        try {
            const result = await getQuantityServices();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Lấy quantity services thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getQuantityServices",
                error: err
            });
        }
    },
    findServiceByIdOrName: async (req, res) => {
        const search = req.params.search;
        try {
            const result = await findServiceByIdOrName(search);
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Tìm services thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findServiceByIdOrName",
                error: err
            });
        }
    },
    findServiceById: async (req, res) => {
        const serviceId = req.body.serviceId;
        try {
            const result = await findServiceById(serviceId);
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Tìm services thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findServiceById",
                error: err
            });
        }
    },
    createService: async (req, res) => {
        const serviceName = req.body.serviceName;
        const serviceImage = req.body.serviceImage;
        const serviceTime = req.body.serviceTime;
        if (!serviceName) {
            return res.status(400).json({
                status: "fail",
                message: "Tên của Dịch vụ không hợp lệ!"
            });
        }
        if (!serviceImage) {
            return res.status(400).json({
                status: "fail",
                message: "Hình ảnh không hợp lệ!"
            });
        }
        if (!serviceTime) {
            return res.status(400).json({
                status: "fail",
                message: "Thời gian của Dịch vụ không hợp lệ!"
            });
        }
        try {
            const createServiceRes = await createService(serviceName, serviceImage, serviceTime);
            if (!createServiceRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't create service!"
                });
            }

            createLogAdmin(req, res, " vừa thêm Dịch vụ mới tên: " + serviceName, "CREATE").then(() => {
                // Success
                return res.status(200).json({
                    status: "success",
                    message: "Thêm Dịch vụ mới thành công!"
                });
            });

        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when create service!",
                error: err
            });
        }
    },
    updateService: async (req, res) => {
        const serviceName = req.body.serviceName;
        const serviceImage = req.body.serviceImage;
        const serviceTime = req.body.serviceTime;
        const serviceId = req.body.serviceId;
        if (!serviceName) {
            return res.status(400).json({
                status: "fail",
                message: "Tên của Dịch vụ không hợp lệ!"
            });
        }
        if (!serviceImage) {
            return res.status(400).json({
                status: "fail",
                message: "Hình ảnh không hợp lệ!"
            });
        }
        if (!serviceTime) {
            return res.status(400).json({
                status: "fail",
                message: "Thời gian của Dịch vụ không hợp lệ!"
            });
        }
        if (!serviceId || !Number.isInteger(serviceId) || serviceId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã của Dịch vụ không hợp lệ!"
            });
        }
        try {
            const serviceRes = await findServiceById(serviceId);
            if (!serviceRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find service!"
                });
            }
            try {
                const updateServiceRes = await updateServiceById(serviceName, serviceImage, serviceTime, serviceId);
                if (!updateServiceRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't update service!"
                    });
                }

                createLogAdmin(req, res, " vừa cập nhật Dịch vụ mã: " + serviceId, "UPDATE").then(() => {
                    // Success
                    return res.status(200).json({
                        status: "success",
                        message: "Cập nhật Dịch vụ thành công!"
                    });
                });

            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when update service!",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when find service!",
                error: err
            });
        }
    },
    deleteService: async (req, res) => {
        const serviceId = parseInt(req.params.serviceId);
        if (!serviceId || !Number.isInteger(serviceId) || serviceId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã của Dịch vụ không hợp lệ!"
            });
        }
        try {
            const serviceRes = await findServiceById(serviceId);
            if (!serviceRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find service!"
                });
            }
            try {
                const deleteServiceRes = await deleteService(serviceId);
                if (!deleteServiceRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't delete service!"
                    });
                }

                createLogAdmin(req, res, " vừa xóa Dịch vụ mã: " + serviceId, "DELETE").then(() => {
                    // Success
                    return res.status(200).json({
                        status: "success",
                        message: "Xóa Dịch vụ thành công!"
                    });
                });

            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when delete service!",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when find service!",
                error: err
            });
        }
    }
}