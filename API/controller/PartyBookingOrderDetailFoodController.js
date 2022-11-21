const { findAllPartyBookingOrderDetailFoodByPartyBookingOrderId } = require("../service/PartyBookingOrderDetailFoodService");
const { findPartyBookingById } = require("../service/PartyBookingOrderService");

module.exports = {
    // ADMIN: Quản lý Đặt tiệc
    findAllPartyBookingOrderDetailFoodByPartyBookingOrderId: async (req, res) => {
        const partyBookingOrderId = parseInt(req.params.partyBookingOrderId);
        if (!partyBookingOrderId || !Number.isInteger(partyBookingOrderId) || partyBookingOrderId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã đặt tiệc không hợp lệ!"
            });
        }
        // Kiểm tra tiệc tồn tại
        try {
            const partyBookingOrderRes = await findPartyBookingById(partyBookingOrderId);
            if (!partyBookingOrderRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find party booking order!"
                });
            }
            // Lấy Những food của party booking order
            try {
                const partyBookingOrderDetailFoodRes = await findAllPartyBookingOrderDetailFoodByPartyBookingOrderId(partyBookingOrderId);
                if (!partyBookingOrderDetailFoodRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't find party booking detail food by party booking order id!"
                    });
                }
    
                // Success
                return res.status(200).json({
                    status: "success",
                    message: "Lấy những Món ăn của Tiệc thành công!",
                    data: partyBookingOrderDetailFoodRes
                });
    
            } catch (err) {
                console.log("#EE", err)
                return res.status(400).json({
                    status: "fail",
                    message: "Error find party booking detail food by party booking order id!",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error find party booking order!",
                error: err
            });
        }
    },
}