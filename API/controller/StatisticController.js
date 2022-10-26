const { getTotalFinishPartyBookingOrderByFinishDate, getTotalFinishPartyBookingOrder, getTotalFinishPartyBookingOrderForEachMonthByYear } = require("../service/PartyBookingOrderService");
const { getTotalFinishRoomBookingOrderByFinishDate, getTotalFinishRoomBookingOrder, getTotalFinishRoomBookingOrderForEachMonthByYear } = require("../service/RoomBookingOrderService");
const { getTotalFinishTableBookingOrderByFinishDate, getTotalFinishTableBookingOrder, getTotalFinishTableBookingOrderForEachMonthByYear } = require("../service/TableBookingOrderService");

module.exports = {
    getStatisticRoomAndTableAndPartyBooking: async (req, res) => {
        if (req.body.date === null) {
            // Lấy ngày hiện tại FORMAT: '2022-05-05 13:48:12' giống CSDL
            var today = new Date();
            var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var bookingOrderStatisticDate = date + ' ' + time;
            try {
                let roomTotalPrice = 0;
                let tableTotalPrice = 0;
                let partyTotalPrice = 0;
                // Room
                const getTotalRoomBookingRes = await getTotalFinishRoomBookingOrder();

                if (getTotalRoomBookingRes.sum_room_booking_order_total) {
                    roomTotalPrice = getTotalRoomBookingRes.sum_room_booking_order_total;
                }

                // Table
                const getTotalTableBookingRes = await getTotalFinishTableBookingOrder();
                if (getTotalTableBookingRes.sum_table_booking_order_total) {
                    tableTotalPrice = getTotalTableBookingRes.sum_table_booking_order_total;
                }

                // Party
                let getTotalPartyBookingRes = await getTotalFinishPartyBookingOrder();
                if (getTotalPartyBookingRes.sum_party_booking_order_total) {
                    partyTotalPrice = getTotalPartyBookingRes.sum_party_booking_order_total;
                }

                let totalPrice = roomTotalPrice + tableTotalPrice + partyTotalPrice;
                return res.status(200).json({
                    status: "success",
                    message: "Get statistic booking order total successfully!",
                    data: {
                        roomTotalPrice: roomTotalPrice,
                        tableTotalPrice: tableTotalPrice,
                        partyTotalPrice: partyTotalPrice,
                        totalPrice: totalPrice,
                        bookingOrderStatisticDate: bookingOrderStatisticDate
                    }
                });
            } catch (err) {
                console.log("ERR: ", err);
                return res.status(400).json({
                    status: "fail",
                    message: "Error when get statistic booking order total!",
                    error: err
                });
            }
        } else {
            const dateReq = req.body.date;
            var parts = dateReq.split('-');
            var statisticDate = new Date(parts[0], parts[1] - 1, parts[2]);

            // Lấy ngày hiện tại FORMAT: '2022-05-05 13:48:12' giống CSDL
            var today = new Date();
            var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var bookingOrderStatisticDate = date + ' ' + time;
            try {
                let roomTotalPrice = 0;
                let tableTotalPrice = 0;
                let partyTotalPrice = 0;
                // Room
                const getTotalRoomBookingRes = await getTotalFinishRoomBookingOrderByFinishDate(statisticDate.getDate(), statisticDate.getMonth() + 1, statisticDate.getFullYear());
                if (getTotalRoomBookingRes.sum_room_booking_order_total) {
                    roomTotalPrice = getTotalRoomBookingRes.sum_room_booking_order_total;
                }

                // Table
                const getTotalTableBookingRes = await getTotalFinishTableBookingOrderByFinishDate(statisticDate.getDate(), statisticDate.getMonth() + 1, statisticDate.getFullYear());
                if (getTotalTableBookingRes.sum_table_booking_order_total) {
                    tableTotalPrice = getTotalTableBookingRes.sum_table_booking_order_total;
                }

                // Party
                const getTotalPartyBookingRes = await getTotalFinishPartyBookingOrderByFinishDate(statisticDate.getDate(), statisticDate.getMonth() + 1, statisticDate.getFullYear());
                if (getTotalPartyBookingRes.sum_party_booking_order_total) {
                    partyTotalPrice = getTotalPartyBookingRes.sum_party_booking_order_total;
                }

                let totalPrice = roomTotalPrice + tableTotalPrice + partyTotalPrice;
                // Success
                return res.status(200).json({
                    status: "success",
                    message: "Get statistic booking order total successfully!",
                    data: {
                        roomTotalPrice: roomTotalPrice,
                        tableTotalPrice: tableTotalPrice,
                        partyTotalPrice: partyTotalPrice,
                        totalPrice: totalPrice,
                        bookingOrderStatisticDate: bookingOrderStatisticDate
                    }
                });

            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when get statistic booking order total!",
                    error: err
                });
            }
        }
    },
    getStatisticRoomAndTableAndPartyBookingTotalForEachMonthByYear: async (req, res) => {
        const year = req.body.year;
        if (!year || !Number.isInteger(year) || year < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Năm cần thống kê không hợp lệ!"
            });
        }
        // Lấy ngày hiện tại FORMAT: '2022-05-05 13:48:12' giống CSDL
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var statisticDate = date + ' ' + time;
        
        try {
            let resultArray = [];
            const getTotalRoomBookingForEachMonthRes = await getTotalFinishRoomBookingOrderForEachMonthByYear(year);
            if (!getTotalRoomBookingForEachMonthRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't get statistic room booking order total for each month by year!"
                });
            }
            resultArray.push({
                data: getTotalRoomBookingForEachMonthRes,
                name: "Doanh thu Khách sạn"
            });
            const getTotalTableBookingForEachMonthRes = await getTotalFinishTableBookingOrderForEachMonthByYear(year);
            if (!getTotalTableBookingForEachMonthRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't get statistic table booking order total for each month by year!"
                });
            }
            resultArray.push({
                data: getTotalTableBookingForEachMonthRes,
                name: "Doanh thu Nhà hàng - Bàn ăn"
            });
            const getTotalPartyBookingForEachMonthRes = await getTotalFinishPartyBookingOrderForEachMonthByYear(year);
            if (!getTotalPartyBookingForEachMonthRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't get statistic party booking order total for each month by year!"
                });
            }
            resultArray.push({
                data: getTotalPartyBookingForEachMonthRes,
                name: "Doanh thu Nhà hàng - Tiệc"
            });

            // Success
            return res.status(200).json({
                status: "success",
                message: "Get statistic booking order total for each month by year successfully!",
                data: resultArray,
                statisticDate: statisticDate
            });

        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when get statistic booking order total for each month by year!",
                error: err
            });
        }
    }
}