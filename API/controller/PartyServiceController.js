const { getPartyServices, getPartyServicesByPartyServiceTypeId, getPartyServiceByPartyServiceId, getAllPartyServices, getQuantityPartyServices, findPartyServiceByIdOrName, findPartyServiceById, createPartyService, updatePartyServiceById, deletePartyService } = require("../service/PartyServiceService");
const { findPartyServiceTypeById } = require("../service/PartyServiceTypeService");
const { createLogAdmin } = require("../utils/utils");

module.exports = {
    getPartyServices: async (req, res) => {
        try {
            const result = await getPartyServices();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found"
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Get all party services successfully!",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getPartyServices",
                error: err
            });
        }
    },
    getPartyServiceByPartyServiceId: async (req, res) => {
        const partyServiceId = req.params.partyServiceId;
        try {
            const result = await getPartyServiceByPartyServiceId(partyServiceId);
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found"
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Get all party services by party_service_id successfully!",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getPartyServiceByPartyServiceId",
                error: err
            });
        }
    },
    getPartyServicesByPartyServiceTypeId: async (req, res) => {
        const partyServiceTypeId = req.body.partyServiceTypeId;
        try {
            const result = await getPartyServicesByPartyServiceTypeId(partyServiceTypeId);
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found"
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Get all party services by party_service_type_id successfully!",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getPartyServicesByPartyServiceTypeId",
                error: err
            });
        }
    },

    // ADMIN: Quản lý Dịch vụ Tiệc - Nhà hàng
    getAllPartyServices: async (req, res) => {
        try {
            const result = await getAllPartyServices();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Lấy party services thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getAllPartyServices",
                error: err
            });
        }
    },
    getQuantityPartyService: async (req, res) => {
        try {
            const result = await getQuantityPartyServices();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Lấy quantity party services thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getQuantityPartyServices",
                error: err
            });
        }
    },
    findPartyServiceByIdOrName: async (req, res) => {
        const search = req.params.search;
        try {
            const result = await findPartyServiceByIdOrName(search);
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Tìm party services thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findPartyServiceByIdOrName",
                error: err
            });
        }
    },
    findPartyServiceById: async (req, res) => {
        const partyServiceId = req.body.partyServiceId;
        try {
            const result = await findPartyServiceById(partyServiceId);
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Tìm party services thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findPartyServiceById",
                error: err
            });
        }
    },
    createPartyService: async (req, res) => {
        const partyServiceName = req.body.partyServiceName;
        const partyServicePrice = req.body.partyServicePrice;
        const partyServiceTypeId = req.body.partyServiceTypeId;
        if (!partyServiceName) {
            return res.status(400).json({
                status: "fail",
                message: "Tên Dịch vụ Tiệc không hợp lệ!"
            });
        }
        if (!partyServicePrice) {
            return res.status(400).json({
                status: "fail",
                message: "Giá tiền Dịch vụ Tiệc không hợp lệ!"
            });
        }
        if (!partyServiceTypeId || !Number.isInteger(partyServiceTypeId) || partyServiceTypeId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã Loại Dịch vụ Tiệc không hợp lệ!"
            });
        }
        // Kiểm tra tồn tại party service type
        try {
            const partyServiceTypeRes = await findPartyServiceTypeById(partyServiceTypeId);
            if (!partyServiceTypeRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find party service type!"
                });
            }
            try {
                const createPartyServiceRes = await createPartyService(partyServiceName, partyServicePrice, partyServiceTypeId);
                if (!createPartyServiceRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't create party service!"
                    });
                }

                createLogAdmin(req, res, " vừa thêm Dịch vụ Tiệc mới tên: " + partyServiceName, "CREATE").then(() => {
                    // Success
                    return res.status(200).json({
                        status: "success",
                        message: "Thêm Dịch vụ Tiệc mới thành công!"
                    });
                });

            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when create party service!",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when find party service type!",
                error: err
            });
        }
    },
    updatePartyService: async (req, res) => {
        const partyServiceName = req.body.partyServiceName;
        const partyServicePrice = req.body.partyServicePrice;
        const partyServiceTypeId = req.body.partyServiceTypeId;
        const partyServiceId = req.body.partyServiceId;
        if (!partyServiceName) {
            return res.status(400).json({
                status: "fail",
                message: "Tên Dịch vụ Tiệc không hợp lệ!"
            });
        }
        if (!partyServicePrice) {
            return res.status(400).json({
                status: "fail",
                message: "Giá Dịch vụ Tiệc không hợp lệ!"
            });
        }
        if (!partyServiceTypeId || !Number.isInteger(partyServiceTypeId) || partyServiceTypeId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã Loại Dịch vụ Tiệc không hợp lệ!"
            });
        }
        if (!partyServiceId || !Number.isInteger(partyServiceId) || partyServiceId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã Dịch vụ Tiệc không hợp lệ!"
            });
        }
        // Kiểm tra tồn tại party service type
        try {
            const partyServiceTypeRes = await findPartyServiceTypeById(partyServiceTypeId);
            if (!partyServiceTypeRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find party service type!"
                });
            }
            // Tìm và kiểm tra tồn tại party service
            try {
                const partyServiceRes = await findPartyServiceById(partyServiceId);
                if (!partyServiceRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't find party service!"
                    });
                }
                // Cập nhật
                try {
                    const updatePartyServiceRes = await updatePartyServiceById(partyServiceName, partyServicePrice, partyServiceTypeId, partyServiceId);
                    if (!updatePartyServiceRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't update party service!"
                        });
                    }

                    createLogAdmin(req, res, " vừa cập nhật Dịch vụ Tiệc mã: " + partyServiceId, "UPDATE").then(() => {
                        // Success
                        return res.status(200).json({
                            status: "success",
                            message: "Cập nhật Dịch vụ Tiệc thành công!"
                        });
                    });

                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when update party service!",
                        error: err
                    });
                }
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when find party service!",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when find party service type!",
                error: err
            });
        }
    },
    deletePartyService: async (req, res) => {
        const partyServiceId = parseInt(req.params.partyServiceId);
        if (!partyServiceId || !Number.isInteger(partyServiceId) || partyServiceId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã Dịch vụ Tiệc không hợp lệ!"
            });
        }
        // Tìm và kiểm tra hợp lệ
        try {
            const partyServiceRes = await findPartyServiceById(partyServiceId);
            if (!partyServiceRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find party service!"
                });
            }
            // Tiến hành xóa Dịch vụ Tiệc
            try {
                const deletePartyServiceRes = await deletePartyService(partyServiceId);
                if (!deletePartyServiceRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't delete party service!"
                    });
                }

                createLogAdmin(req, res, " vừa xóa Dịch vụ Tiệc mã: " + partyServiceId, "DELETE").then(() => {
                    // Success
                    return res.status(200).json({
                        status: "success",
                        message: "Xóa Dịch vụ Tiệc thành công!"
                    });
                });

            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when delete party service!",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when find party service!",
                error: err
            });
        }
    }
}