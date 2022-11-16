const { findFloorById } = require("../service/FloorService");
const { getPartyHallDetailByPartyHallIdAndDateAndTimeId } = require("../service/PartyHallDetailService");
const { getPartyHallImagesByPartyHallId, createPartyHallImage, DeletePartyHallImagesByPartyHallId } = require("../service/PartyHallImageService");
const { getPartyHallsWithImageTypeFloor, getPartyHallWithTypeFloorByPartyHallId, updatePartyHallState, getAllPartyHalls, getQuantityPartyHalls, findPartyHallByIdOrName, findPartyHallById, createPartyHall, updatePartyHallById, deletePartyHall, findNewestPartyHallByInfo } = require("../service/PartyHallService");
const { findPartyHallTypeById } = require("../service/PartyHallTypeService");
const { createLogAdmin } = require("../utils/utils");

module.exports = {
    getPartyHallsWithImageTypeFloor: async (req, res) => {
        try {
            const result = await getPartyHallsWithImageTypeFloor();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found"
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Đã tìm được sảnh phù hợp!",
                data: result
            });
        } catch (err) {
            console.log("Lỗi getPartyHallsWithImageTypeFloor: ", err);
            return res.status(400).json({
                status: "fail",
                message: "Có lỗi khi lấy getPartyHallsWithImageTypeFloor",
                error: err
            });
        }
    },
    findPartyHalls: async (req, res) => {
        const dateBooking = req.body.dateBooking;
        const timeBooking = req.body.timeBooking;
        const typeBooking = req.body.typeBooking;
        const quantityBooking = req.body.quantityBooking;
        const partyHallType = req.body.partyHallType;

        if (!dateBooking) {
            return res.status(400).json({
                status: "fail",
                message: "Bạn chưa chọn Ngày đãi tiệc!"
            });
        }
        if (!timeBooking && timeBooking !== 0) {
            return res.status(400).json({
                status: "fail",
                message: "Bạn chưa chọn Giờ đãi tiệc!"
            });
        }
        if (!typeBooking && typeBooking !== 0) {
            return res.status(400).json({
                status: "fail",
                message: "Bạn chưa chọn Loại tiệc!"
            });
        }
        if (!quantityBooking) {
            return res.status(400).json({
                status: "fail",
                message: "Bạn chưa chọn Số lượng khách mời!"
            });
        }
        if (!partyHallType && partyHallType !== 0) {
            return res.status(400).json({
                status: "fail",
                message: "Bạn chưa chọn Loại sảnh!"
            });
        }

        try {
            const result = await getPartyHallsWithImageTypeFloor();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found"
                });
            }
            let filteredResult = [];
            for (var i = 0; i < result.length; i++) {
                if (
                    result[i].party_hall_type_id === partyHallType
                    && result[i].party_hall_occupancy >= quantityBooking
                ) {
                    try {
                        const partyHallDetailRes = await getPartyHallDetailByPartyHallIdAndDateAndTimeId(result[i].party_hall_id, dateBooking, timeBooking);
                        console.log(partyHallDetailRes)
                        if (!partyHallDetailRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Party hall detail not found"
                            });
                        }
                        // Không tìm dc detail nào state = 0 đang còn hoạt động
                        // có ngày book và time id như trên => Có thể cho chọn sảnh này
                        if (partyHallDetailRes.length === 0) {
                            // Check date and time in detail here!
                            filteredResult.push({ ...result[i] });
                        } else {
                            continue;
                        }
                    } catch (err) {
                        console.log(err);
                        return res.status(400).json({
                            status: "fail",
                            message: "Có lỗi khi lấy getPartyHallDetailByPartyHallIdAndDateAndTimeId",
                            error: err
                        });
                    }
                }
            }
            // Sort lại để hiện Sảnh có sức chứa vừa đủ nhất (Những phòng đủ yêu cầu, sort từ bé -> lớn).
            filteredResult = filteredResult.sort((a, b) => a.party_hall_occupancy - b.party_hall_occupancy);
            return res.status(200).json({
                status: "success",
                message: "Đã tìm được sảnh phù hợp!",
                data: filteredResult
            });
        } catch (err) {
            console.log("Lỗi getPartyHallsWithImageTypeFloor: ", err);
            return res.status(400).json({
                status: "fail",
                message: "Có lỗi khi lấy getPartyHallsWithImageTypeFloor",
                error: err
            });
        }
    },
    getPartyHallWithImagesTypeFloor: async (req, res) => {
        const partyHallId = req.body.partyHallId;
        let finalResult = {};
        try {
            const PartyHallRes = await getPartyHallWithTypeFloorByPartyHallId(partyHallId);
            if (!PartyHallRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found"
                });
            }
            try {
                const images = await getPartyHallImagesByPartyHallId(partyHallId);
                if (!images) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Images record not found"
                    });
                }
                finalResult = {
                    ...PartyHallRes,
                    partyHallImages: images
                };
                return res.status(200).json({
                    status: "success",
                    message: "Lấy party hall và images từ party hall id thành công!",
                    data: finalResult
                });
            } catch (err) {
                console.log("Lỗi getPartyHallImagesByPartyHallId: ", err);
                return res.status(400).json({
                    status: "fail",
                    message: "Có lỗi khi lấy getPartyHallImagesByPartyHallId",
                    error: err
                });
            }
        } catch (err) {
            console.log("Lỗi getPartyHallWithTypeFloorByPartyHallId: ", err);
            return res.status(400).json({
                status: "fail",
                message: "Có lỗi khi lấy getPartyHallWithTypeFloorByPartyHallId",
                error: err
            });
        }
    },
    updatePartyHallState: async (req, res) => {
        const partyHallList = req.body.partyHallList;
        const partyHallState = req.body.partyHallState;
        for (var i = 0; i < partyHallList.length; i++) {
            const partyHall = partyHallList[i];
            try {
                const result = await updatePartyHallState(partyHall.party_hall_id, partyHallState);
                if (!result) {
                    return res.status(200).json({
                        status: "fail",
                        message: "Update party hall state fail!",
                    });
                }
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when update party hall state!",
                    error: err
                });
            }
        }
        // Success
        return res.status(200).json({
            status: "success",
            message: "Update party hall state successfully!",
        });
    },


    // ADMIN: Quản lý Sảnh tiệc - Nhà hàng
    getAllPartyHalls: async (req, res) => {
        try {
            const result = await getAllPartyHalls();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Lấy party halls thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getAllPartyHalls",
                error: err
            });
        }
    },
    getQuantityPartyHall: async (req, res) => {
        try {
            const result = await getQuantityPartyHalls();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Lấy quantity party halls thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getQuantityPartyHalls",
                error: err
            });
        }
    },
    findPartyHallByIdOrName: async (req, res) => {
        const search = req.params.search;
        try {
            const result = await findPartyHallByIdOrName(search);
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Tìm party halls thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findPartyHallByIdOrName",
                error: err
            });
        }
    },
    findPartyHallById: async (req, res) => {
        const partyHallId = req.body.partyHallId;
        try {
            const result = await findPartyHallById(partyHallId);
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Tìm party halls thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findPartyHallById",
                error: err
            });
        }
    },
    createPartyHall: async (req, res) => {
        const partyHallName = req.body.partyHallName;
        const partyHallView = req.body.partyHallView;
        const partyHallDescription = req.body.partyHallDescription;
        const partyHallSize = req.body.partyHallSize;
        const partyHallOccupancy = req.body.partyHallOccupancy;
        const partyHallPrice = req.body.partyHallPrice;
        const partyHallState = 0;
        const floorId = req.body.floorId;
        const partyHallTypeId = req.body.partyHallTypeId;
        const partyHallImageList = req.body.partyHallImageList;

        if (!partyHallName) {
            return res.status(400).json({
                status: "fail",
                message: "Tên Sảnh tiệc không hợp lệ!"
            });
        }
        if (!partyHallView) {
            return res.status(400).json({
                status: "fail",
                message: "View Sảnh tiệc không hợp lệ!"
            });
        }
        if (!partyHallDescription) {
            return res.status(400).json({
                status: "fail",
                message: "Mô tả Sảnh tiệc không hợp lệ!"
            });
        }
        if (!partyHallSize) {
            return res.status(400).json({
                status: "fail",
                message: "Kích thước Sảnh tiệc không hợp lệ!"
            });
        }
        if (!partyHallOccupancy || !Number.isInteger(partyHallOccupancy) || partyHallOccupancy < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Sức chứa Sảnh tiệc không hợp lệ!"
            });
        }
        if (!partyHallPrice || !Number.isInteger(partyHallPrice) || partyHallPrice < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Giá tiền Sảnh tiệc không hợp lệ!"
            });
        }
        if (!floorId || !Number.isInteger(floorId) || floorId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã Tầng không hợp lệ!"
            });
        }
        if (!partyHallTypeId || !Number.isInteger(partyHallTypeId) || partyHallTypeId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã Loại Sảnh tiệc không hợp lệ!"
            });
        }
        if (!partyHallImageList || partyHallImageList.length === 0) {
            return res.status(400).json({
                status: "fail",
                message: "Hình ảnh của Sảnh không hợp lệ!"
            });
        }

        // Lấy ngày hiện tại FORMAT: '2022-05-05 13:48:12' giống CSDL
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var partyHallDate = date + ' ' + time;

        // Kiểm tra floor tồn tại
        try {
            const floorRes = await findFloorById(floorId);
            if (!floorRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find floor!"
                });
            }
            // Kiểm tra party hall type tồn tại
            try {
                const partyHallTypeRes = await findPartyHallTypeById(partyHallTypeId);
                if (!partyHallTypeRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't find party hall type!"
                    });
                }
                // Tạo party hall
                try {
                    const createPartyHallRes = await createPartyHall(partyHallName, partyHallView, partyHallDescription, partyHallSize, partyHallOccupancy, partyHallPrice, partyHallState, partyHallDate, floorId, partyHallTypeId);
                    if (!createPartyHallRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't create party hall!"
                        });
                    }
                    // Tìm kiếm sảnh vừa thêm
                    try {
                        const partyHallRes = await findNewestPartyHallByInfo(partyHallName, partyHallView, partyHallDescription, partyHallSize, partyHallOccupancy, partyHallPrice, partyHallState, partyHallDate, floorId, partyHallTypeId);
                        if (!partyHallRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find newest party hall!"
                            });
                        }

                        // Thêm mảng hình của sảnh vào party hall image
                        const partyHallId = partyHallRes.party_hall_id;
                        for (var i = 0; i < partyHallImageList.length; i++) {
                            var partyHallImageContent = partyHallImageList[i];
                            try {
                                const createPartyHallImageRes = await createPartyHallImage(partyHallImageContent, partyHallId);
                                if (!createPartyHallImageRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't create party hall image!"
                                    });
                                }
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when create party hall image!",
                                    error: err
                                });
                            }
                        }

                        createLogAdmin(req, res, " vừa thêm Sảnh tiệc mới tên: " + partyHallName, "CREATE").then(() => {
                            // Success
                            return res.status(200).json({
                                status: "success",
                                message: "Thêm Sảnh tiệc mới thành công!"
                            });
                        });

                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when find party hall newest!",
                            error: err
                        });
                    }
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when create party hall!",
                        error: err
                    });
                }
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when find party hall type!",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when find floor!",
                error: err
            });
        }
    },
    updatePartyHall: async (req, res) => {
        const partyHallName = req.body.partyHallName;
        const partyHallView = req.body.partyHallView;
        const partyHallDescription = req.body.partyHallDescription;
        const partyHallSize = req.body.partyHallSize;
        const partyHallOccupancy = req.body.partyHallOccupancy;
        const partyHallPrice = req.body.partyHallPrice;
        const floorId = req.body.floorId;
        const partyHallTypeId = req.body.partyHallTypeId;
        const partyHallId = req.body.partyHallId;
        const partyHallImageList = req.body.partyHallImageList;
        if (!partyHallName) {
            return res.status(400).json({
                status: "fail",
                message: "Tên Sảnh tiệc không hợp lệ!"
            });
        }
        if (!partyHallView) {
            return res.status(400).json({
                status: "fail",
                message: "View Sảnh tiệc không hợp lệ!"
            });
        }
        if (!partyHallDescription) {
            return res.status(400).json({
                status: "fail",
                message: "Mô tả Sảnh tiệc không hợp lệ!"
            });
        }
        if (!partyHallSize) {
            return res.status(400).json({
                status: "fail",
                message: "Kích thước Sảnh tiệc không hợp lệ!"
            });
        }
        if (!partyHallOccupancy || !Number.isInteger(partyHallOccupancy) || partyHallOccupancy < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Sức chứa Sảnh tiệc không hợp lệ!"
            });
        }
        if (!partyHallPrice || !Number.isInteger(partyHallPrice) || partyHallPrice < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Giá tiền Sảnh tiệc không hợp lệ!"
            });
        }
        if (!floorId || !Number.isInteger(floorId) || floorId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã Tầng không hợp lệ!"
            });
        }
        if (!partyHallTypeId || !Number.isInteger(partyHallTypeId) || partyHallTypeId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã Loại Sảnh tiệc không hợp lệ!"
            });
        }
        if (!partyHallId || !Number.isInteger(partyHallId) || partyHallId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã Sảnh tiệc không hợp lệ!"
            });
        }
        if (!partyHallImageList || partyHallImageList.length === 0) {
            return res.status(400).json({
                status: "fail",
                message: "Hình ảnh của Sảnh không hợp lệ!"
            });
        }
        // Kiểm tra floor tồn tại
        try {
            const floorRes = await findFloorById(floorId);
            if (!floorRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find floor!"
                });
            }
            // Kiểm tra party hall type tồn tại
            try {
                const partyHallTypeRes = await findPartyHallTypeById(partyHallTypeId);
                if (!partyHallTypeRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't find party hall type!"
                    });
                }
                // Tìm và kiểm tra tồn tại party hall
                try {
                    const partyHallRes = await findPartyHallById(partyHallId);
                    if (!partyHallRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't find party hall!"
                        });
                    }
                    // Cập nhật
                    try {
                        const updatePartyHallRes = await updatePartyHallById(partyHallName, partyHallView, partyHallDescription, partyHallSize, partyHallOccupancy, partyHallPrice, floorId, partyHallTypeId, partyHallId);
                        if (!updatePartyHallRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't update party hall!"
                            });
                        }
                        //  Xóa hình ảnh Sảnh cũ
                        try {
                            const deletePartyHallImageRes = await DeletePartyHallImagesByPartyHallId(partyHallId);
                            if (!deletePartyHallImageRes) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Cann't delete party hall image!"
                                });
                            }

                            // Thêm mảng hình ảnh mới của Sảnh vào party hall image
                            for (var i = 0; i < partyHallImageList.length; i++) {
                                var partyHallImageContent = partyHallImageList[i];
                                try {
                                    const createPartyHallImageRes = await createPartyHallImage(partyHallImageContent, partyHallId);
                                    if (!createPartyHallImageRes) {
                                        return res.status(400).json({
                                            status: "fail",
                                            message: "Cann't create party hall image!"
                                        });
                                    }
                                } catch (err) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Error when create party hall image!",
                                        error: err
                                    });
                                }
                            }

                            createLogAdmin(req, res, " vừa cập nhật Sảnh tiệc mã: " + partyHallId, "UPDATE").then(() => {
                                // Success
                                return res.status(200).json({
                                    status: "success",
                                    message: "Cập nhật Sảnh tiệc thành công!"
                                });
                            });

                        } catch (err) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Error when delete room image!",
                                error: err
                            });
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when update party hall!",
                            error: err
                        });
                    }
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when find party hall!",
                        error: err
                    });
                }
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when find party hall type!",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when find floor!",
                error: err
            });
        }
    },
    deletePartyHall: async (req, res) => {
        const partyHallId = parseInt(req.params.partyHallId);
        if (!partyHallId || !Number.isInteger(partyHallId) || partyHallId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã Sảnh tiệc không hợp lệ!"
            });
        }
        // Tìm và kiểm tra hợp lệ
        try {
            const partyHallRes = await findPartyHallById(partyHallId);
            if (!partyHallRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find party hall!"
                });
            }
            // Tiến hành xóa Sảnh tiệc
            try {
                const deletePartyHallRes = await deletePartyHall(partyHallId);
                if (!deletePartyHallRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't delete party hall!"
                    });
                }

                createLogAdmin(req, res, " vừa xóa Sảnh tiệc mã: " + partyHallId, "DELETE").then(() => {
                    // Success
                    return res.status(200).json({
                        status: "success",
                        message: "Xóa Sảnh tiệc thành công!"
                    });
                });

            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when delete party hall!",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when find party hall!",
                error: err
            });
        }
    }
};
