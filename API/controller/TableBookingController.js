const { getTableBookingOrderByTableBookingId } = require("../service/TableBookingOrderService");
const { getTableBookings, getTableBookingWithTypeAndFloor, updateTableBookingState } = require("../service/TableBookingService");

module.exports = {
    getTableBookings: async (req, res) => {
        try {
            const result = await getTableBookings();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found"
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Get all table bookings successfully!",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getTableBookings",
                error: err
            });
        }
    },
    getTableBookingWithTypeAndFloor: async (req, res) => {
        try {
            const result = await getTableBookingWithTypeAndFloor();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found"
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Get all table bookings with type and floor successfully!",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getTableBookingWithTypeAndFloor",
                error: err
            });
        }
    },
    findTableBookings: async (req, res) => {
        const dateBooking = req.body.dateBooking;
        const timeBooking = req.body.timeBooking;
        const quantityBooking = req.body.quantityBooking;
        const tableTypeId = req.body.tableTypeId;

        if (!dateBooking) {
            return res.status(400).json({
                status: "fail",
                message: "Bạn chưa chọn Ngày Đặt bàn!"
            });
        }
        if (!timeBooking) {
            return res.status(400).json({
                status: "fail",
                message: "Bạn chưa chọn Giờ đặt bàn!"
            });
        }
        if (!quantityBooking) {
            return res.status(400).json({
                status: "fail",
                message: "Bạn chưa chọn Số lượng khách!"
            });
        }
        if (!tableTypeId) {
            return res.status(400).json({
                status: "fail",
                message: "Bạn chưa chọn Loại bàn!"
            });
        }
        const finalResultArray = [];
        try {
            const tableBookingResult = await getTableBookingWithTypeAndFloor();
            if (!tableBookingResult) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found"
                });
            }
            var dateBookingReq = new Date(dateBooking);
            for (var i = 0; i < tableBookingResult.length; i++) {
                // Check date here
                try {
                    const tableBookingOrderRes = await getTableBookingOrderByTableBookingId(tableBookingResult[i].table_booking_id);
                    if (!tableBookingOrderRes) {
                        //  Check table type
                        if (tableBookingResult[i].table_type_id !== tableTypeId) {
                            continue;
                        }
                        finalResultArray.push(tableBookingResult[i]);
                    } else {
                        var checkInDateBookingOrder = new Date(tableBookingOrderRes.table_booking_order_checkin_date);
                        if (dateBookingReq.getFullYear() === checkInDateBookingOrder.getFullYear()
                            && dateBookingReq.getMonth() === checkInDateBookingOrder.getMonth()
                            && dateBookingReq.getDate() === checkInDateBookingOrder.getDate()
                        ) {
                            continue;
                        }
                        //  Check table type
                        if (tableBookingResult[i].table_type_id !== tableTypeId) {
                            continue;
                        }
                        finalResultArray.push(tableBookingResult[i]);
                    }
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Lỗi getTableBookingWithTypeAndFloor",
                        error: err
                    });
                }
            }
            // Success
            if (finalResultArray.length > 0) {
                res.status(200).json({
                    status: "success",
                    message: "Đã tìm được bàn phù hợp!",
                    data: finalResultArray
                });
            } else {
                res.status(200).json({
                    status: "success",
                    message: "Không tìm thấy bàn phù hợp!",
                    data: finalResultArray
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getTableBookingWithTypeAndFloor",
                error: err
            });
        }
    },
    updateTableBookingState: async (req, res) => {
        const tableBookingId = req.body.tableBookingId;
        const tableBookingState = req.body.tableBookingState;
        try {
            const result = await updateTableBookingState(tableBookingId, tableBookingState);
            if (result) {
                return res.status(200).json({
                    status: "success",
                    message: "Update table booking state successfully!",
                });
            } else {
                return res.status(200).json({
                    status: "fail",
                    message: "Update table booking state fail!",
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when update table booking state!",
                error: err
            });
        }
    },
}