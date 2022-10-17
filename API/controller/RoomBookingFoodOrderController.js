const { createRoomBookingFoodDetail } = require("../service/RoomBookingFoodDetailService");
const { createRoomBookingFoodOrder, findRoomBookingFoodOrder } = require("../service/RoomBookingFoodOrderService");
const { findRoomBookingOrderByCustomerIdAndRoomIdAndKey, updateRoomBookingOrderSurchargeAndTotalByRoomBookingOrderId, findRoomBookingOrderByRoomBookingOrderId } = require("../service/RoomBookingOrderService");
const { format_money } = require("../utils/utils");

// NODE Mailer
var nodemailer = require('nodemailer');
const { getCustomerByCustomerId } = require("../service/CustomerService");
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'truonghoanglong588@gmail.com',
        pass: 'grkaaxhoeradbtop'
    }
});

module.exports = {
    createRoomBookingFoodOrder: async (req, res) => {
        const customerId = req.body.customerId;
        const roomId = req.body.roomId;
        const key = req.body.key;

        const roomBookingFoodOrderNote = req.body.roomBookingFoodOrderNote;
        const roomBookingFoodOrderTotal = req.body.roomBookingFoodOrderTotal;
        // const roomBookingDetailId = req.body.roomBookingDetailId;

        const foodList = req.body.foodList;

        // Lấy ngày hiện tại FORMAT: '2022-05-05 13:48:12' giống CSDL
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var roomBookingOrderBookDate = date + ' ' + time;

        if (!customerId || !Number.isInteger(customerId) || customerId <= 0) {
            return res.status(400).json({
                status: "fail",
                message: "Customer id không hợp lệ!"
            });
        }
        if (!roomId || !Number.isInteger(roomId) || roomId <= 0) {
            return res.status(400).json({
                status: "fail",
                message: "Room id không hợp lệ!"
            });
        }
        if (!key) {
            return res.status(400).json({
                status: "fail",
                message: "Mã key không hợp lệ!"
            });
        }
        if (!roomBookingFoodOrderTotal || !Number.isInteger(roomBookingFoodOrderTotal) || roomBookingFoodOrderTotal <= 0) {
            return res.status(400).json({
                status: "fail",
                message: "Food order total không hợp lệ!"
            });
        }
        if (!foodList) {
            return res.status(400).json({
                status: "fail",
                message: "Giỏ hàng đang rỗng!"
            });
        }
        // Tìm room booking order
        try {
            const roomBookingOrderRes = await findRoomBookingOrderByCustomerIdAndRoomIdAndKey(
                customerId,
                roomId,
                key
            );
            if (!roomBookingOrderRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Không tìm được thông tin đặt phòng của bạn!"
                });
            };
            // Tạo room booking food order
            let roomBookingDetailId = roomBookingOrderRes.room_booking_detail_id;
            let roomBookingOrderId = roomBookingOrderRes.room_booking_order_id;
            try {
                const createBookingFoodOrder = await createRoomBookingFoodOrder(
                    roomBookingOrderBookDate,
                    roomBookingFoodOrderNote,
                    roomBookingFoodOrderTotal,
                    roomBookingDetailId
                );
                if (!createBookingFoodOrder) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't create room booking food order!"
                    });
                }
                // Tìm room booking food order vừa tạo
                try {
                    const roomBookingFoodOrderRes = await findRoomBookingFoodOrder(
                        roomBookingOrderBookDate,
                        roomBookingFoodOrderNote,
                        roomBookingFoodOrderTotal,
                        roomBookingDetailId
                    );
                    if (!roomBookingFoodOrderRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't find room booking food order!"
                        });
                    }
                    // Thêm detail vào order trên
                    let roomBookingFoodOrderId = roomBookingFoodOrderRes.room_booking_food_order_id;
                    let totalPriceSurcharge = 0;
                    for (var i = 0; i < foodList.length; i++) {
                        try {
                            const createRoomBookingFoodDetailRes = await createRoomBookingFoodDetail(
                                foodList[i].foodQuantity,
                                foodList[i].food_price,
                                foodList[i].foodQuantity * foodList[i].food_price,
                                foodList[i].food_id,
                                roomBookingFoodOrderId
                            );
                            if (!createRoomBookingFoodDetailRes) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Cann't create room booking food detail!"
                                });
                            }
                            totalPriceSurcharge += foodList[i].foodQuantity * foodList[i].food_price;
                        } catch (err) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Error when create room booking food detail!",
                                error: err
                            });
                        }
                    }
                    // Update surcharge and total into Room booking order
                    try {
                        const updateSurchargeAndTotalRes = await updateRoomBookingOrderSurchargeAndTotalByRoomBookingOrderId(
                            totalPriceSurcharge,
                            roomBookingOrderId
                        );
                        if (!updateSurchargeAndTotalRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't update room booking order surcharge and total!"
                            });
                        } else {
                            // Gửi mail
                            try {
                                // ---------------------------------------------------------------------------
                                // Lấy thông tin khách hàng
                                const customerRes = await getCustomerByCustomerId(customerId);
                                if (!customerRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Customer record not found"
                                    });
                                }
                                // Lấy thông tin đặt phòng
                                const roomBookingOrderAfterRes = await findRoomBookingOrderByRoomBookingOrderId(roomBookingOrderId);
                                if (!roomBookingOrderAfterRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Room booking order after record not found"
                                    });
                                }
                                var customerName = customerRes.customer_first_name + " " + customerRes.customer_last_name;
                                var customerEmail = customerRes.customer_email;
                                var customerPhoneNumber = customerRes.customer_phone_number;

                                var roomBookingOrderPriceAfter = roomBookingOrderAfterRes.room_booking_order_price;
                                var roomBookingOrderSurchargeAfter = roomBookingOrderAfterRes.room_booking_order_surcharge;
                                var roomBookingOrderTotalAfter = roomBookingOrderAfterRes.room_booking_order_total;
                                console.log("REE: ", roomBookingOrderId, roomBookingOrderPriceAfter, roomBookingOrderSurchargeAfter, roomBookingOrderTotalAfter)
                                // MAILER
                                var noidung = '';
                                noidung += '<div><p>Cảm ơn bạn đã tin tưởng và đặt món ăn tại <font color="#41f1b6"><b>Hoàng Long Hotel &amp; Restaurant</b></font> với Mã đặt món ăn: ' + roomBookingFoodOrderId + '</p></div>';
                                noidung += '<p><b>Khách hàng:</b> ' + customerName + '<br /><b>Email:</b> ' + customerEmail + '<br /><b>Điện thoại:</b> ' + customerPhoneNumber + '<br />';

                                // Danh sách Sản phẩm đã mua
                                noidung += '<p align="justify"><b>Tổng tiền đặt món ăn sẽ tính vào Phụ phí và thanh toán sau khi quý khách Check out!</b></p>';
                                noidung += ' <table border="1px" cellpadding="10px" cellspacing="1px"width="100%"><tr><td align="center" bgcolor="#41f1b6" colspan="4"><fontcolor="white"><b>ĐƠN ĐẶT MÓN ĂN CỦA BẠN</b></fontcolor=></td></tr><tr id="invoice-bar"><td width="45%"><b>Loại món ăn</b></td><td width="20%"><b>Tên món ăn</b></td><td width="15%"><b>Số lượng</b></td><td width="20%"><b>Giá tiền</b></td></tr>';
                                for (var i = 0; i < foodList.length; i++) {
                                    noidung += '<tr><td class="prd-name">' + foodList[i].food_type_name + '</td><td class="prd-price"><font color="#41f1b6">' + foodList[i].food_name + '</font></td><td class="prd-number">' + foodList[i].foodQuantity + '</td><td class="prd-total"><font color="#41f1b6">' + format_money(foodList[i].food_price * foodList[i].foodQuantity) + ' VNĐ</font></td></tr>';
                                }
                                noidung += '<tr><td class="prd-name" colspan="3">Tổng tiền đon đặt món ăn này:</td><td class="prd-total"><b><font color="#41f1b6">' + format_money(totalPriceSurcharge) + ' VNĐ</font></b></td></tr></table>';

                                // Mã KEY của phòng
                                noidung += '<table border="1px" cellpadding="10px" cellspacing="1px"width="100%"><tr><td align="center" bgcolor="#41f1b6" colspan="3"><fontcolor="white"><b>NHỮNG HÓA ĐƠN CẦN THANH TOÁN</b></fontcolor=></td></tr>';
                                noidung += '<tr><td class="prd-name">Tiền đặt phòng:</td><td class="prd-total"><b><font color="#41f1b6">' + format_money(roomBookingOrderPriceAfter) + ' VNĐ</font></b></td><td class="prd-name">Đã thanh toán</td></tr>';
                                noidung += '<tr><td class="prd-name">Phụ phí:</td><td class="prd-total"><b><font color="#41f1b6">' + format_money(roomBookingOrderSurchargeAfter) + ' VNĐ</font></b></td><td class="prd-name">Chưa thanh toán</td></tr>';
                                noidung += '<tr><td class="prd-name">Tổng tiền thanh toán khi Check out:</td><td class="prd-total" colspan="2"><b><font color="#41f1b6">' + format_money(roomBookingOrderTotalAfter - roomBookingOrderPriceAfter) + ' VNĐ</font></b></td></tr></table>';

                                noidung += '<p align="justify"><b>Quý khách đã đặt món ăn thành công!</b><br />• Món ăn sẽ được nhanh chóng chuẩn bị và mang đến nhanh chóng!.<br/><b><br />Cám ơn Quý khách đã lựa chọn dịch vụ của chúng tôi!</b></p>';

                                // ----- Mailer Option -----
                                var mailOptions = {
                                    from: 'Hoàng Long Hotel &amp; Restaurant',
                                    to: customerEmail,
                                    subject: 'Đặt Món ăn tại Hoàng Long thành công!',
                                    html: noidung,
                                };

                                transporter.sendMail(mailOptions, function (error, info) {
                                    if (error) {
                                        console.log(error);
                                    } else {
                                        console.log('Email sent: ' + info.response);
                                    }
                                });
                                // ---------------------------------------------------------------------------
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when send mail!",
                                    error: err
                                });
                            }
                            // Success
                            return res.status(200).json({
                                status: "success",
                                message: "Create room booking food order successfully!",
                            });
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when update surcharge and total room booking order!",
                            error: err
                        });
                    }
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when find room booking food order!",
                        error: err
                    });
                }
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when create room booking food order!",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when find room booking order!",
                error: err
            });
        }
    }
}