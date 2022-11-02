const { findRoomBookingFoodDetailByRoomBookingFoodOrderId } = require("../service/RoomBookingFoodDetailService");
const { findRoomBookingFoodOrdersByRoomBookingDetailId } = require("../service/RoomBookingFoodOrderService");

module.exports = {
    getRoomBookingFoodDetailByRoomBookingDetailId: async (req, res) => {
        const roomBookingDetailId = req.params.roomBookingDetailId;
        try {
            const roomBookingFoodOrderRes = await findRoomBookingFoodOrdersByRoomBookingDetailId(roomBookingDetailId);
            if (!roomBookingFoodOrderRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found"
                });
            }

            let foodDetailFinal = [];
            for (var i = 0; i < roomBookingFoodOrderRes.length; i++) {
                const roomBookingFoodOrderId = roomBookingFoodOrderRes[i].room_booking_food_order_id;
                const roomBookingFoodOrderBookDate = roomBookingFoodOrderRes[i].room_booking_food_order_book_date;
                const roomBookingFoodOrderTotal = roomBookingFoodOrderRes[i].room_booking_food_order_total;
                try {
                    const result = await findRoomBookingFoodDetailByRoomBookingFoodOrderId(roomBookingFoodOrderId);
                    if (!result) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Record not found"
                        });
                    }
                    foodDetailFinal.push({
                        bookDate: roomBookingFoodOrderBookDate,
                        total: roomBookingFoodOrderTotal,
                        foodArray: result
                    });
                } catch (err) {
                    console.log("ERR: ", err);
                    return res.status(400).json({
                        status: "fail",
                        message: "Lỗi findRoomBookingFoodDetailByRoomBookingFoodOrderId",
                        error: err
                    });
                }
            }
            // Success
            return res.status(200).json({
                status: "success",
                message: "Get all room booking detail foods successfully!",
                data: foodDetailFinal
            });
        } catch (err) {
            console.log("ERR: ", err);
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findRoomBookingFoodOrdersByRoomBookingDetailId",
                error: err
            });
        }
    },
}