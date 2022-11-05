const { getRoomByRoomId, getRooms, getRoomsWithTypeAndFloor, getRoomsWithImageTypeFloor, getMinMaxRoomPrice, getRoomWithTypeAndFloorByRoomId, updateRoomState, getAllRooms, getQuantityRooms, findAllRoomByIdOrName, findAllRoomById, createRoom, findNewestRoomByInfo, findRoomByRoomId, updateRoomById, deleteRoom, findRoomsWithImageTypeFloor, findRoomAndImageWhenAddDeviceByRoomId } = require("../service/RoomService");
const { getServicesByRoomTypeId } = require("../service/ServiceService");
const { getDevicesByRoomId } = require("../service/DeviceService");
const { getRoomImagesByRoomId, createRoomImage, DeleteRoomImagesByRoomId } = require("../service/RoomImageService");
const { getRoomBookingDetailByRoomId } = require("../service/RoomBookingDetailService");
const { findFloorById } = require("../service/FloorService");
const { findRoomTypeById } = require("../service/RoomTypeService");
const { createLogAdmin } = require("../utils/utils");

module.exports = {
    getRoomsWithTypeAndFloor: (req, res) => {
        getRoomsWithTypeAndFloor((err, results) => {
            if (err) {
                console.log("Lỗi getRoomsWithTypeAndFloor: ", err);
                return;
            }
            return res.json({
                status: "success",
                data: results
            });
        });
    },
    getRooms: (req, res) => {
        getRooms((err, results) => {
            if (err) {
                console.log("Lỗi getRooms: ", err);
                return;
            }
            return res.json({
                status: "success",
                data: results
            });
        });
    },
    getRoomsWithImageTypeFloor: (req, res) => {
        getRoomsWithImageTypeFloor((err, results) => {
            if (err) {
                console.log("Lỗi getRoomsWithImageTypeFloor: ", err);
                return;
            }
            return res.json({
                status: "success",
                data: results
            });
        });
    },
    getMinMaxRoomPrice: (req, res) => {
        getMinMaxRoomPrice((err, results) => {
            if (err) {
                console.log("Lỗi getMinMaxRoomPrice: ", err);
                return;
            }
            return res.json({
                status: "success",
                data: results
            });
        });
    },
    getRoomsAndServices: async (req, res) => {
        getRoomsWithImageTypeFloor((err, results) => {
            if (err) {
                console.log("Lỗi getRoomsWithImageTypeFloor: ", err);
                return;
            }
            if (!results) {
                return res.json({
                    status: "fail",
                    message: "Record not found"
                });
            } else {
                let finalResultArray = [];
                results.forEach(room => {
                    const getServicesByRoomTypeIds = async (roomTypeId) => {
                        const serviceList = await getServicesByRoomTypeId(roomTypeId);
                        let finalResultItem = { ...room, serviceList };
                        return finalResultItem;
                    };
                    finalResultArray.push(getServicesByRoomTypeIds(room.room_type_id));
                });
                // Đợi tất cả promise hoàn thành thì trả result về
                Promise.all(finalResultArray).then((result) => {
                    res.json({
                        status: "success",
                        data: result
                    });
                });
            }
        });
    },
    findRoomsAndServices: async (req, res) => {
        const checkInDate = req.body.checkInDate;
        const checkOutDate = req.body.checkOutDate;
        const adultsQuantity = req.body.adultsQuantity;
        const childrenQuantity = req.body.childrenQuantity;
        const maxPrice = req.body.maxPrice;
        const filterList = req.body.filterList;
        const checkinDateReq = new Date(checkInDate);
        const checkoutDateReq = new Date(checkOutDate);

        // Check date phải chênh lệch 1
        if (checkInDate === checkOutDate) {
            return res.status(400).json({
                status: "fail",
                message: "Số ngày đặt không thể bé hơn 1!"
            });
        }

        findRoomsWithImageTypeFloor(async (err, results) => {
            if (err) {
                console.log("Lỗi findRoomsWithImageTypeFloor: ", err);
                return;
            }
            if (!checkInDate) {
                return res.status(400).json({
                    status: "fail",
                    message: "Bạn chưa chọn ngày Check in!"
                });
            }
            if (!checkOutDate) {
                return res.status(400).json({
                    status: "fail",
                    message: "Bạn chưa chọn ngày Check out!"
                });
            }
            if (checkinDateReq > checkoutDateReq) {
                return res.status(400).json({
                    status: "fail",
                    message: "Ngày check-in và check-out không hợp lệ!"
                });
            }
            if (!adultsQuantity) {
                return res.status(400).json({
                    status: "fail",
                    message: "Số lượng Người lớn đang trống!"
                });
            }
            if (!childrenQuantity) {
                return res.status(400).json({
                    status: "fail",
                    message: "Số lượng Trẻ em đang trống!"
                });
            }
            if (!maxPrice) {
                return res.status(400).json({
                    status: "fail",
                    message: "Bạn chưa giới hạn giá phòng!"
                });
            }
            if (filterList.length === 0) {
                return res.status(400).json({
                    status: "fail",
                    message: "Bạn chưa chọn Dịch vụ!"
                });
            }
            if (!results) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found"
                });
            } else {
                let finalResultArray = [];
                let finalResultFilteredArray = [];
                results.forEach(room => {
                    const roomId = room.room_id;
                    const getServicesByRoomTypeIds = async (roomTypeId) => {
                        const serviceList = await getServicesByRoomTypeId(roomTypeId);
                        let finalResultItem = { ...room, serviceList };
                        return finalResultItem;
                    };
                    // Check date here
                    try {
                        const getRoomBookingDetail = async (roomId) => {
                            const roomBookingDetail = await getRoomBookingDetailByRoomId(roomId);
                            if (roomBookingDetail.length === 0) {
                                return getServicesByRoomTypeIds(room.room_type_id);
                            } else {
                                for (var i = 0; i < roomBookingDetail.length; i++) {
                                    const roomDetailCheckinDate = new Date(roomBookingDetail[i].room_booking_detail_checkin_date);
                                    const roomDetailCheckoutDate = new Date(roomBookingDetail[i].room_booking_detail_checkout_date);
                                    if (
                                        checkinDateReq <= roomDetailCheckinDate
                                        && checkoutDateReq <= roomDetailCheckinDate
                                    ) {
                                        return getServicesByRoomTypeIds(room.room_type_id);

                                    } else if (checkinDateReq >= roomDetailCheckoutDate
                                        && checkoutDateReq >= roomDetailCheckoutDate) {
                                        return getServicesByRoomTypeIds(room.room_type_id);
                                    } else {
                                        return null;
                                    }
                                }
                            }
                        };
                        finalResultArray.push(getRoomBookingDetail(roomId));
                    } catch (err) {
                        console.log("Lỗi getRoomBookingDetail: ", err);
                    }
                });
                // Đợi tất cả promise hoàn thành thì trả result về
                Promise.all(finalResultArray).then((result) => {
                    // Loại bỏ phần tử NULL và chỉ giữ lại 1 phòng cho từng loại phòng có thể đặt
                    result = result.filter(prev => prev !== null);
                    var newArr = [];
                    var roomTypeList = [];
                    for (var i = 0; i < result.length; i++) {
                        if (roomTypeList.includes(result[i].room_type_id)) {
                            continue;
                        } else {
                            roomTypeList.push(result[i].room_type_id);
                            newArr.push(result[i]);
                        }
                    }
                    // console.log("RES: ",result, newArr, roomTypeList)
                    // ---Filter
                    newArr.map((room, key) => {
                        if (
                            // Nếu giá phòng nhỏ hơn max
                            room.room_price <= maxPrice
                            // Số lượng cho phép người lớn & trẻ em lớn hơn đã chọn
                            && room.room_adult_quantity >= adultsQuantity
                            && room.room_child_quantity >= childrenQuantity
                        ) {
                            let roomServices = room.serviceList;
                            for (var i = 0; i < roomServices.length; i++) {
                                if (
                                    // Nếu phòng này có service_id chứa trong mảng checkbox service
                                    filterList.includes(roomServices[i].service_id)
                                ) {
                                    finalResultFilteredArray.push(room);
                                    break;
                                }
                            }
                        }
                    });
                    if (finalResultFilteredArray.length > 0) {
                        res.status(200).json({
                            status: "success",
                            message: "Đã tìm được phòng phù hợp!",
                            data: finalResultFilteredArray
                        });
                    } else {
                        res.status(200).json({
                            status: "success",
                            message: "Không tìm thấy phòng phù hợp!",
                            data: finalResultFilteredArray
                        });
                    }
                });
            }
        });
    },
    getRoomByRoomId: async (req, res) => {
        const roomId = req.params.roomId;
        let roomTypeId;
        let finalResult = {};

        let roomImages = [];
        let roomServices = [];
        let roomDevices = [];

        getRoomWithTypeAndFloorByRoomId(roomId, (err, result) => {
            if (err) {
                console.log("Lỗi getRoomWithTypeAndFloorByRoomId: ", err);
                return;
            }
            if (!result) {
                return res.json({
                    status: "fail",
                    message: "Record not found"
                });
            }
            roomTypeId = result.room_type_id;
            finalResult = { ...result };
        });
        // Lấy room image
        roomImages = await getRoomImagesByRoomId(roomId);
        // Lấy service
        roomServices = await getServicesByRoomTypeId(roomTypeId);
        // Lấy device
        roomDevices = await getDevicesByRoomId(roomId);
        finalResult = { ...finalResult, roomImages, roomServices, roomDevices }
        return res.json({
            status: "success",
            data: finalResult
        });
    },
    updateRoomState: async (req, res) => {
        const roomId = req.body.roomId;
        const roomState = req.body.roomState;
        try {
            const result = await updateRoomState(roomId, roomState);
            if (result) {
                return res.status(200).json({
                    status: "success",
                    message: "Update room state successfully!",
                });
            } else {
                return res.status(200).json({
                    status: "fail",
                    message: "Update room state fail!",
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when update room state!",
                error: err
            });
        }
    },

    // ADMIN: Quản lý Phòng - Khách sạn
    getAllRooms: async (req, res) => {
        try {
            const result = await getAllRooms();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Lấy all rooms thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getAllRooms",
                error: err
            });
        }
    },
    getQuantityRooms: async (req, res) => {
        try {
            const result = await getQuantityRooms();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Lấy quantity room thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getQuantityRooms",
                error: err
            });
        }
    },
    findAllRoomByIdOrName: async (req, res) => {
        const search = req.params.search;
        try {
            const result = await findAllRoomByIdOrName(search);
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Tìm room thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findAllRoomByIdOrName",
                error: err
            });
        }
    },
    findAllRoomById: async (req, res) => {
        const roomId = req.body.roomId;
        try {
            const result = await findAllRoomById(roomId);
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Tìm room thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findAllRoomById",
                error: err
            });
        }
    },
    createRoom: async (req, res) => {
        const roomName = req.body.roomName;
        const roomDescription = req.body.roomDescription;
        const roomFeature = req.body.roomFeature;
        const roomSize = req.body.roomSize;
        const roomAdultQuantity = req.body.roomAdultQuantity;
        const roomChildQuantity = req.body.roomChildQuantity;
        const roomView = req.body.roomView;
        const roomPrice = req.body.roomPrice;
        const roomState = 0;
        const floorId = req.body.floorId;
        const roomTypeId = req.body.roomTypeId;
        const roomImageList = req.body.roomImageList;

        if (!roomName) {
            return res.status(400).json({
                status: "fail",
                message: "Tên của Phòng không hợp lệ!"
            });
        }
        if (!roomDescription) {
            return res.status(400).json({
                status: "fail",
                message: "Mô tả của Phòng không hợp lệ!"
            });
        }
        if (!roomFeature) {
            return res.status(400).json({
                status: "fail",
                message: "Tiện ích của Phòng không hợp lệ!"
            });
        }
        if (!roomSize) {
            return res.status(400).json({
                status: "fail",
                message: "Diện tích của Phòng không hợp lệ!"
            });
        }
        if (roomAdultQuantity === null || roomAdultQuantity === undefined || roomAdultQuantity < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Giới hạn số Người lớn của Phòng không hợp lệ!"
            });
        }
        if (roomChildQuantity === null || roomChildQuantity === undefined || roomChildQuantity < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Giới hạn số Trẻ em của Phòng không hợp lệ!"
            });
        }
        if (!roomView) {
            return res.status(400).json({
                status: "fail",
                message: "View của Phòng không hợp lệ!"
            });
        }
        if (!roomPrice || !Number.isInteger(roomPrice) || roomPrice < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Giá tiền của Phòng không hợp lệ!"
            });
        }
        if (!floorId || !Number.isInteger(floorId) || floorId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã số Tầng của Phòng không hợp lệ!"
            });
        }
        if (!roomTypeId || !Number.isInteger(roomTypeId) || roomTypeId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã số Loại phòng của Phòng không hợp lệ!"
            });
        }
        if (!roomImageList || roomImageList.length === 0) {
            return res.status(400).json({
                status: "fail",
                message: "Hình ảnh của Phòng không hợp lệ!"
            });
        }

        // Lấy ngày hiện tại FORMAT: '2022-05-05 13:48:12' giống CSDL
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var roomDate = date + ' ' + time;

        // Find floor
        try {
            const floorRes = await findFloorById(floorId);
            if (!floorRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find floor!"
                });
            }
            // Find room type
            try {
                const roomTypeRes = await findRoomTypeById(roomTypeId);
                if (!roomTypeRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't find room type!"
                    });
                }
                // Create room
                try {
                    const createRoomRes = await createRoom(
                        roomName,
                        roomDescription,
                        roomFeature,
                        roomSize,
                        roomAdultQuantity,
                        roomChildQuantity,
                        roomView,
                        roomPrice,
                        roomState,
                        roomDate,
                        floorId,
                        roomTypeId
                    );
                    if (!createRoomRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't create room!"
                        });
                    }
                    // Find newest room
                    try {
                        const roomRes = await findNewestRoomByInfo(
                            roomName,
                            roomDescription,
                            roomFeature,
                            roomSize,
                            roomAdultQuantity,
                            roomChildQuantity,
                            roomView,
                            roomPrice,
                            roomState,
                            roomDate,
                            floorId,
                            roomTypeId
                        );
                        if (!roomRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find newest room!"
                            });
                        }

                        // Add room image list
                        const roomId = roomRes.room_id;
                        for (var i = 0; i < roomImageList.length; i++) {
                            var roomImageContent = roomImageList[i];
                            try {
                                const createRoomImageRes = await createRoomImage(roomImageContent, roomId);
                                if (!createRoomImageRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't create room image!"
                                    });
                                }
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when create room image!",
                                    error: err
                                });
                            }
                        }

                        createLogAdmin(req, res, " vừa thêm Phòng mới tên: " + roomName, "CREATE").then(() => {
                            // Success
                            return res.status(200).json({
                                status: "success",
                                message: "Thêm Phòng mới thành công!"
                            });
                        });

                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when find room newest!",
                            error: err
                        });
                    }
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when create room!",
                        error: err
                    });
                }
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when find room type!",
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
    updateRoom: async (req, res) => {
        const roomId = req.body.roomId;
        const roomName = req.body.roomName;
        const roomDescription = req.body.roomDescription;
        const roomFeature = req.body.roomFeature;
        const roomSize = req.body.roomSize;
        const roomAdultQuantity = req.body.roomAdultQuantity;
        const roomChildQuantity = req.body.roomChildQuantity;
        const roomView = req.body.roomView;
        const roomPrice = req.body.roomPrice;
        const roomState = 0;
        const floorId = req.body.floorId;
        const roomTypeId = req.body.roomTypeId;
        const roomImageList = req.body.roomImageList;

        if (!roomId || !Number.isInteger(roomId) || roomId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã số của Phòng không hợp lệ!"
            });
        }
        if (!roomName) {
            return res.status(400).json({
                status: "fail",
                message: "Tên của Phòng không hợp lệ!"
            });
        }
        if (!roomDescription) {
            return res.status(400).json({
                status: "fail",
                message: "Mô tả của Phòng không hợp lệ!"
            });
        }
        if (!roomFeature) {
            return res.status(400).json({
                status: "fail",
                message: "Tiện ích của Phòng không hợp lệ!"
            });
        }
        if (!roomSize) {
            return res.status(400).json({
                status: "fail",
                message: "Diện tích của Phòng không hợp lệ!"
            });
        }
        if (roomAdultQuantity === null || roomAdultQuantity === undefined || roomAdultQuantity < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Giới hạn số Người lớn của Phòng không hợp lệ!"
            });
        }
        if (roomChildQuantity === null || roomChildQuantity === undefined || roomChildQuantity < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Giới hạn số Trẻ em của Phòng không hợp lệ!"
            });
        }
        if (!roomView) {
            return res.status(400).json({
                status: "fail",
                message: "View của Phòng không hợp lệ!"
            });
        }
        if (!roomPrice || !Number.isInteger(roomPrice) || roomPrice < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Giá tiền của Phòng không hợp lệ!"
            });
        }
        if (!floorId || !Number.isInteger(floorId) || floorId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã số Tầng của Phòng không hợp lệ!"
            });
        }
        if (!roomTypeId || !Number.isInteger(roomTypeId) || roomTypeId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã số Loại phòng của Phòng không hợp lệ!"
            });
        }
        if (!roomImageList || roomImageList.length === 0) {
            return res.status(400).json({
                status: "fail",
                message: "Hình ảnh của Phòng không hợp lệ!"
            });
        }

        // Find floor
        try {
            const floorRes = await findFloorById(floorId);
            if (!floorRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find floor!"
                });
            }
            // Find room type
            try {
                const roomTypeRes = await findRoomTypeById(roomTypeId);
                if (!roomTypeRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't find room type!"
                    });
                }
                // Find room
                try {
                    const roomRes = await findRoomByRoomId(roomId);
                    if (!roomRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't find room!"
                        });
                    }
                    //Update room
                    try {
                        const updateRoomRes = await updateRoomById(
                            roomName,
                            roomDescription,
                            roomFeature,
                            roomSize,
                            roomAdultQuantity,
                            roomChildQuantity,
                            roomView,
                            roomPrice,
                            roomState,
                            floorId,
                            roomTypeId,
                            roomId
                        );
                        if (!updateRoomRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't update room!"
                            });
                        }
                        //Delete room image old
                        try {
                            const deleteRoomImageRes = await DeleteRoomImagesByRoomId(roomId);
                            if (!deleteRoomImageRes) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Cann't delete room image!"
                                });
                            }

                            // Add new room image list
                            for (var i = 0; i < roomImageList.length; i++) {
                                var roomImageContent = roomImageList[i];
                                try {
                                    const createRoomImageRes = await createRoomImage(roomImageContent, roomId);
                                    if (!createRoomImageRes) {
                                        return res.status(400).json({
                                            status: "fail",
                                            message: "Cann't create room image!"
                                        });
                                    }
                                } catch (err) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Error when create room image!",
                                        error: err
                                    });
                                }
                            }

                            createLogAdmin(req, res, " vừa cập nhật Phòng có mã: " + roomId, "UPDATE").then(() => {
                                // Success
                                return res.status(200).json({
                                    status: "success",
                                    message: "Cập nhật Phòng thành công!"
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
                            message: "Error when update room!",
                            error: err
                        });
                    }
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when find room!",
                        error: err
                    });
                }
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when find room type!",
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
    deleteRoom: async (req, res) => {
        const roomId = parseInt(req.params.roomId);
        if (!roomId || !Number.isInteger(roomId) || roomId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã của Phòng không hợp lệ!"
            });
        }
        try {
            const roomRes = await findRoomByRoomId(roomId);
            if (!roomRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find room!"
                });
            }
            try {
                const deleteRoomRes = await deleteRoom(roomId);
                if (!deleteRoomRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't delete room!"
                    });
                }

                createLogAdmin(req, res, " vừa xóa Phòng có mã: " + roomId, "DELETE").then(() => {
                    // Success
                    return res.status(200).json({
                        status: "success",
                        message: "Xóa Phòng thành công!"
                    });
                });

            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when delete room!",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when find room!",
                error: err
            });
        }
    },

    // Admin: Add device
    findRoomAndImageWhenAddDeviceByRoomId: async (req, res) => {
        const roomId = parseInt(req.params.roomId);
        if (!roomId || !Number.isInteger(roomId) || roomId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Room id không hợp lệ!"
            });
        }
        try {
            const result = await findRoomAndImageWhenAddDeviceByRoomId(roomId);
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Tìm room and image when add device thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findRoomAndImageWhenAddDeviceByRoomId",
                error: err
            });
        }
    },
};