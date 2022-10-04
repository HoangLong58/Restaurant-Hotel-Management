const { getCustomerByCustomerId } = require("../service/CustomerService");
const { updateDiscountState } = require("../service/DiscountService");
const { createRoomBookingDetail } = require("../service/RoomBookingDetailService");
const { createRoomBookingOrder, findRoomBookingOrder } = require("../service/RoomBookingOrderService");
const { findRoomByRoomId } = require("../service/RoomService");

// NODE Mailer
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'truonghoanglong588@gmail.com',
        pass: 'grkaaxhoeradbtop'
    }
});

module.exports = {
    createRoomBookingOrder: async (req, res) => {
        // const roomBookingOrderBookDate = req.body.roomBookingOrderBookDate;
        const roomBookingOrderPrice = req.body.roomBookingOrderPrice;
        const roomBookingOrderSurcharge = req.body.roomBookingOrderSurcharge;
        const roomBookingOrderTotal = req.body.roomBookingOrderTotal;
        const customerId = req.body.customerId;
        const discountId = req.body.discountId;
        const checkinDate = req.body.checkinDate;
        const checkoutDate = req.body.checkoutDate;
        const roomId = req.body.roomId;

        // Lấy ngày hiện tại FORMAT: '2022-05-05 13:48:12' giống CSDL
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var roomBookingOrderBookDate = date + ' ' + time;

        if (!roomBookingOrderBookDate) {
            return res.status(404).json({
                status: "fail",
                message: "Bookdate không hợp lệ!"
            });
        }
        if (!roomBookingOrderPrice || !Number.isInteger(roomBookingOrderPrice) || roomBookingOrderPrice <= 0) {
            return res.status(404).json({
                status: "fail",
                message: "Book price không hợp lệ!"
            });
        }
        if (!roomBookingOrderSurcharge || !Number.isInteger(roomBookingOrderSurcharge) || roomBookingOrderSurcharge <= 0) {
            return res.status(404).json({
                status: "fail",
                message: "Book surcharge không hợp lệ!"
            });
        }
        if (!roomBookingOrderTotal || !Number.isInteger(roomBookingOrderTotal) || roomBookingOrderTotal <= 0) {
            return res.status(404).json({
                status: "fail",
                message: "Book total không hợp lệ!"
            });
        }
        if (!customerId || !Number.isInteger(customerId) || customerId <= 0) {
            return res.status(404).json({
                status: "fail",
                message: "Customer id không hợp lệ!"
            });
        }
        if (!discountId || !Number.isInteger(discountId) || discountId <= 0) {
            return res.status(404).json({
                status: "fail",
                message: "Discount id không hợp lệ!"
            });
        }
        if (!checkinDate) {
            return res.status(404).json({
                status: "fail",
                message: "Ngày check in không hợp lệ!"
            });
        }
        if (!checkoutDate) {
            return res.status(404).json({
                status: "fail",
                message: "Ngày check out không hợp lệ!"
            });
        }
        if (!roomId || !Number.isInteger(roomId) || roomId <= 0) {
            return res.status(404).json({
                status: "fail",
                message: "Room id không hợp lệ!"
            });
        }
        try {
            const createRoomBookingOrderRes = await createRoomBookingOrder(
                roomBookingOrderBookDate,
                roomBookingOrderPrice,
                roomBookingOrderSurcharge,
                roomBookingOrderTotal,
                customerId,
                discountId
            );
            if (createRoomBookingOrderRes) {

                try {
                    const roomBookingOrderRes = await findRoomBookingOrder(
                        roomBookingOrderBookDate,
                        roomBookingOrderPrice,
                        roomBookingOrderSurcharge,
                        roomBookingOrderTotal,
                        customerId,
                        discountId
                    );
                    if (roomBookingOrderRes) {
                        var roomBookingOrderId = roomBookingOrderRes.room_booking_order_id;
                        try {
                            const createRoomBookingDetailRes = await createRoomBookingDetail(
                                checkinDate,
                                checkoutDate,
                                roomId,
                                roomBookingOrderId
                            );
                            if (createRoomBookingDetailRes) {
                                try {
                                    const updateDiscountStateRes = await updateDiscountState(discountId, 1);
                                    if (updateDiscountStateRes) {
                                        try {
                                            // ---------------------------------------------------------------------------
                                            const customerRes = await getCustomerByCustomerId(customerId);
                                            if (!customerRes) {
                                                return res.status(400).json({
                                                    status: "fail",
                                                    message: "Customer record not found"
                                                });
                                            }
                                            const roomRes = await findRoomByRoomId(roomId);
                                            if (!customerRes) {
                                                return res.status(400).json({
                                                    status: "fail",
                                                    message: "Room record not found"
                                                });
                                            }
                                            var customerName = customerRes.customer_first_name + " " + customerRes.customer_last_name;
                                            var customerEmail = customerRes.customer_email;
                                            var customerPhoneNumber = customerRes.customer_phone_number;
                                            var roomTypeName = roomRes.room_type_name;
                                            var roomName = roomRes.room_name;
                                            var roomPrice = roomRes.room_price;

                                            // MAILER
                                            var noidung = '';
                                            noidung += '<div><p>Cảm ơn bạn đã tin tưởng và đặt mua thú cưng tại <font color="#41f1b6"><b>Hoàng Long Hotel &amp; Restaurant</b></font> với mã đặt phòng: ' + roomBookingOrderId + '</p></div>';
                                            noidung += '<p><b>Khách hàng:</b> ' + customerName + '<br /><b>Email:</b> ' + customerEmail + '<br /><b>Điện thoại:</b> ' + customerPhoneNumber + '<br />';

                                            // Danh sách Sản phẩm đã mua
                                            noidung += ' <table border="1px" cellpadding="10px" cellspacing="1px"width="100%"><tr><td align="center" bgcolor="#41f1b6" colspan="4"><fontcolor="white"><b>ĐƠN ĐẶT PHÒNG CỦA BẠN</b></fontcolor=></td></tr><tr id="invoice-bar"><td width="45%"><b>Loại phòng</b></td><td width="20%"><b>Số phòng</b></td><td width="15%"><b>Số lượng</b></td><td width="20%"><b>Giá tiền</b></td></tr>';

                                            noidung += '<tr><td class="prd-name">' + roomTypeName + '</td><td class="prd-price"><font color="#41f1b6">' + roomName + '</font></td><td class="prd-number">' + "1 Phòng" + '</td><td class="prd-total"><font color="#41f1b6">' + roomPrice + '</font></td></tr>';

                                            noidung += '<tr><td class="prd-name">Tổng tiền:</td><td colspan="2"></td><td class="prd-total"><b><font color="#41f1b6">' + roomBookingOrderTotal + 'VNĐ</font></b></td></tr></table>';
                                            noidung += '<p align="justify"><b>Quý khách đã đặt phòng thành công!</b><br />• Thời gian check-in nhận phòng là 14:00 AM, thời gian trả phòng là 12:00 AM.<br/>• Quý khách vui lòng lưu ý thời gian trên để quá trình nhận phòng/ trả phòng được thuận tiện.<br /><b><br />Cám ơn Quý khách đã lựa chọn dịch vụ của chúng tôi!</b></p>';
                                            // ----- Mailer Option -----
                                            var mailOptions = {
                                                from: 'Hoàng Long Hotel &amp; Restaurant',
                                                to: customerEmail,
                                                subject: 'Đặt phòng tại Hoàng Long thành công!',
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
                                            message: "Create room booking order successfully!",
                                        });
                                    } else {
                                        return res.status(200).json({
                                            status: "fail",
                                            message: "Update discount state fail!",
                                        });
                                    }
                                } catch (err) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Error when update discount state!",
                                        error: err
                                    });
                                }
                            } else {
                                return res.status(200).json({
                                    status: "fail",
                                    message: "Create room booking detail fail!",
                                });
                            }
                        } catch (err) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Error when create room booking detail!",
                                error: err
                            });
                        }
                    } else {
                        return res.status(200).json({
                            status: "fail",
                            message: "Find room booking order fail!",
                        });
                    }

                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when find room booking order!",
                        error: err
                    });
                }
            } else {
                return res.status(200).json({
                    status: "fail",
                    message: "Create room booking order fail!",
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when create room booking order!",
                error: err
            });
        }
    }
};