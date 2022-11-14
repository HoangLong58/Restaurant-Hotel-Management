const { getPartyServicesByPartyServiceTypeId } = require("../service/PartyServiceService");
const { getPartyServiceTypes, getPartyServiceTypeByPartyServiceTypeId, getAllPartyServiceTypes, getQuantityPartyServiceTypes, findPartyServiceTypeByIdOrName, findPartyServiceTypeById, createPartyServiceType, updatePartyServiceTypeById, updatePartyServiceTypeState, deletePartyServiceType } = require("../service/PartyServiceTypeService");
const { createLogAdmin } = require("../utils/utils");

module.exports = {
    getPartyServiceTypes: async (req, res) => {
        try {
            const result = await getPartyServiceTypes();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found"
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Get all party service types successfully!",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getPartyServiceTypes",
                error: err
            });
        }
    },
    getPartyServiceTypeByPartyServiceTypeId: async (req, res) => {
        const partyServiceTypeId = req.params.partyServiceTypeId;
        try {
            const result = await getPartyServiceTypeByPartyServiceTypeId(partyServiceTypeId);
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
                message: "Lỗi getPartyServiceTypeByPartyServiceTypeId",
                error: err
            });
        }
    },
    getPartyServiceTypesAndPartyServices: async (req, res) => {
        try {
            let finalResultArray = [];
            const partyServiceTypesRes = await getPartyServiceTypes();
            if (!partyServiceTypesRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found"
                });
            }
            try {
                for (var i = 0; i < partyServiceTypesRes.length; i++) {
                    let typeServiceId = partyServiceTypesRes[i].party_service_type_id;
                    let typeServiceName = partyServiceTypesRes[i].party_service_type_name;
                    const servicesRes = await getPartyServicesByPartyServiceTypeId(typeServiceId);
                    if (!servicesRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Record not found"
                        });
                    }
                    finalResultArray.push({
                        partyServiceType: typeServiceName,
                        partyServices: servicesRes
                    });
                }
                return res.status(200).json({
                    status: "success",
                    message: "Get all party services of all party service types successfully!",
                    data: finalResultArray
                });
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Lỗi getPartyServicesByPartyServiceTypeId",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getPartyServiceTypes",
                error: err
            });
        }
    },

    // ADMIN: Quản lý Loại Dịch vụ tiệc - Nhà hàng
    getAllPartyServiceTypes: async (req, res) => {
        try {
            const result = await getAllPartyServiceTypes();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Lấy party service types thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getAllPartyServiceTypes",
                error: err
            });
        }
    },
    getQuantityPartyServiceType: async (req, res) => {
        try {
            const result = await getQuantityPartyServiceTypes();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Lấy quantity party service types thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getQuantityPartyServiceTypes",
                error: err
            });
        }
    },
    findPartyServiceTypeByIdOrName: async (req, res) => {
        const search = req.params.search;
        try {
            const result = await findPartyServiceTypeByIdOrName(search);
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Tìm party service types thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findPartyServiceTypeByIdOrName",
                error: err
            });
        }
    },
    findPartyServiceTypeById: async (req, res) => {
        const partyServiceTypeId = req.body.partyServiceTypeId;
        try {
            const result = await findPartyServiceTypeById(partyServiceTypeId);
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Tìm party service types thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findPartyServiceTypeById",
                error: err
            });
        }
    },
    createPartyServiceType: async (req, res) => {
        const partyServiceTypeName = req.body.partyServiceTypeName;
        const partyServiceTypeState = 0;
        if (!partyServiceTypeName) {
            return res.status(400).json({
                status: "fail",
                message: "Tên loại Dịch vụ tiệc không hợp lệ!"
            });
        }
        try {
            const createPartyServiceTypeRes = await createPartyServiceType(partyServiceTypeName, partyServiceTypeState);
            if (!createPartyServiceTypeRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't create party service type!"
                });
            }

            createLogAdmin(req, res, " vừa thêm Loại Dịch vụ tiệc mới tên: " + partyServiceTypeName, "CREATE").then(() => {
                // Success
                return res.status(200).json({
                    status: "success",
                    message: "Thêm loại Dịch vụ tiệc mới thành công!"
                });
            });

        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when create party service type!",
                error: err
            });
        }
    },
    updatePartyServiceType: async (req, res) => {
        const partyServiceTypeName = req.body.partyServiceTypeName;
        const partyServiceTypeId = req.body.partyServiceTypeId;
        if (!partyServiceTypeName) {
            return res.status(400).json({
                status: "fail",
                message: "Tên loại Dịch vụ tiệc không hợp lệ!"
            });
        }
        if (!partyServiceTypeId || !Number.isInteger(partyServiceTypeId) || partyServiceTypeId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã loại Dịch vụ tiệc không hợp lệ!"
            });
        }
        // Tìm và kiểm tra tồn tại
        try {
            const partyServiceTypeRes = await findPartyServiceTypeById(partyServiceTypeId);
            if (!partyServiceTypeRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find device booking type!"
                });
            }
            // Cập nhật
            try {
                const updatePartyServiceTypeRes = await updatePartyServiceTypeById(partyServiceTypeName, partyServiceTypeId);
                if (!updatePartyServiceTypeRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't update party service type!"
                    });
                }

                createLogAdmin(req, res, " vừa cập nhật Loại Dịch vụ tiệc mã: " + partyServiceTypeId, "UPDATE").then(() => {
                    // Success
                    return res.status(200).json({
                        status: "success",
                        message: "Cập nhật loại Dịch vụ tiệc thành công!"
                    });
                });

            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when update party service type!",
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
    // Disable loại Dịch vụ tiệc
    updatePartyServiceTypeStateTo1: async (req, res) => {
        const partyServiceTypeId = req.body.partyServiceTypeId;
        if (!partyServiceTypeId || !Number.isInteger(partyServiceTypeId) || partyServiceTypeId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã loại Dịch vụ tiệc không hợp lệ!"
            });
        }
        // Tìm và kiểm tra tồn tại
        try {
            const partyServiceTypeRes = await findPartyServiceTypeById(partyServiceTypeId);
            if (!partyServiceTypeRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find device booking type!"
                });
            }
            // Kiểm tra state hiện tại
            const stateRes = partyServiceTypeRes.party_booking_type_state;
            if (stateRes === 1) {
                return res.status(400).json({
                    status: "fail",
                    message: "Loại thiết bị này đã bị vô hiệu trước đó!"
                });
            }
            // Cập nhật state 0 - 1: Vô hiệu
            const partyServiceTypeState = 1;
            try {
                const updatePartyServiceTypeRes = await updatePartyServiceTypeState(partyServiceTypeState, partyServiceTypeId);
                if (!updatePartyServiceTypeRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't update party service type!"
                    });
                }

                createLogAdmin(req, res, " vừa Vô hiệu hóa Loại Dịch vụ tiệc mã: " + partyServiceTypeId, "UPDATE").then(() => {
                    // Success
                    return res.status(200).json({
                        status: "success",
                        message: "Vô hiệu hóa loại Dịch vụ tiệc thành công!"
                    });
                });

            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when update party service type!",
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
    // Mở khóa loại Dịch vụ tiệc
    updatePartyServiceTypeStateTo0: async (req, res) => {
        const partyServiceTypeId = req.body.partyServiceTypeId;
        if (!partyServiceTypeId || !Number.isInteger(partyServiceTypeId) || partyServiceTypeId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã loại Dịch vụ tiệc không hợp lệ!"
            });
        }
        // Tìm và kiểm tra tồn tại
        try {
            const partyServiceTypeRes = await findPartyServiceTypeById(partyServiceTypeId);
            if (!partyServiceTypeRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find device booking type!"
                });
            }
            // Kiểm tra state hiện tại
            const stateRes = partyServiceTypeRes.party_booking_type_state;
            if (stateRes === 0) {
                return res.status(400).json({
                    status: "fail",
                    message: "Loại thiết bị này vẫn đang hoạt động!"
                });
            }
            // Cập nhật state 1 - 0: Mở khóa
            const partyServiceTypeState = 0;
            try {
                const updatePartyServiceTypeRes = await updatePartyServiceTypeState(partyServiceTypeState, partyServiceTypeId);
                if (!updatePartyServiceTypeRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't update party service type!"
                    });
                }

                createLogAdmin(req, res, " vừa Mở khóa Loại Dịch vụ tiệc mã: " + partyServiceTypeId, "UPDATE").then(() => {
                    // Success
                    return res.status(200).json({
                        status: "success",
                        message: "Mở khóa loại Dịch vụ tiệc thành công!"
                    });
                });

            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when update party service type!",
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
    deletePartyServiceType: async (req, res) => {
        const partyServiceTypeId = parseInt(req.params.partyServiceTypeId);
        if (!partyServiceTypeId || !Number.isInteger(partyServiceTypeId) || partyServiceTypeId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã loại Dịch vụ tiệc không hợp lệ!"
            });
        }
        // Tìm và kiểm tra hợp lệ
        try {
            const partyServiceTypeRes = await findPartyServiceTypeById(partyServiceTypeId);
            if (!partyServiceTypeRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find party service type!"
                });
            }
            // Tiến hành xóa loại Dịch vụ tiệc
            try {
                const deletePartyServiceTypeRes = await deletePartyServiceType(partyServiceTypeId);
                if (!deletePartyServiceTypeRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't delete party service type!"
                    });
                }

                createLogAdmin(req, res, " vừa xóa Loại Dịch vụ tiệc mã: " + partyServiceTypeId, "DELETE").then(() => {
                    // Success
                    return res.status(200).json({
                        status: "success",
                        message: "Xóa loại Dịch vụ tiệc thành công!"
                    });
                });

            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when delete party service type!",
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
    }
}