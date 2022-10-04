const { getRoomByRoomId, getRooms, getRoomsWithTypeAndFloor, getRoomsWithImageTypeFloor, getMinMaxRoomPrice, getRoomWithTypeAndFloorByRoomId } = require("../service/RoomService");
const { getServicesByRoomTypeId } = require("../service/ServiceService");
const { getDevicesByRoomId } = require("../service/DeviceService");
const { getRoomImagesByRoomId } = require("../service/RoomImageService");

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

        getRoomsWithImageTypeFloor((err, results) => {
            if (err) {
                console.log("Lỗi getRoomsWithImageTypeFloor: ", err);
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
                    const getServicesByRoomTypeIds = async (roomTypeId) => {
                        const serviceList = await getServicesByRoomTypeId(roomTypeId);
                        let finalResultItem = { ...room, serviceList };
                        return finalResultItem;
                    };
                    // Check date here

                    finalResultArray.push(getServicesByRoomTypeIds(room.room_type_id));
                });
                // Đợi tất cả promise hoàn thành thì trả result về
                Promise.all(finalResultArray).then((result) => {
                    // ---Filter
                    result.map((room, key) => {
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
};