const { getCustomerByCustomerId, findCustomerByEmailOrPhoneNumber } = require("../service/CustomerService");
const { updateDiscountState } = require("../service/DiscountService");
const { createRoomBookingDetail, getRoomBookingDetailByRoomBookingOrderId, updateRoomBookingDetailKeyWhenCheckOutSuccess } = require("../service/RoomBookingDetailService");
const { createRoomBookingOrder, findRoomBookingOrder, getRoomBookingsAndDetail, getQuantityRoomBookings, findRoomBookingByIdOrCustomerEmailOrCustomerPhoneOrCustomerNameOrRoomName, findRoomBookingById, findRoomBookingOrderByIdCheckIn, updateRoomBookingOrderInfoWhenCheckInSuccess, updateRoomBookingOrderState, updateRoomBookingOrderFinishDateWhenCheckOutSuccess } = require("../service/RoomBookingOrderService");
const { findRoomByRoomId } = require("../service/RoomService");
const { format_money, createLogAdmin } = require("../utils/utils");

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
        const roomBookingOrderNote = req.body.roomBookingOrderNote;

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
        if (roomBookingOrderSurcharge === null) {
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
        if (discountId === null) {
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
                discountId,
                roomBookingOrderNote
            );
            if (createRoomBookingOrderRes) {
                try {
                    const roomBookingOrderRes = await findRoomBookingOrder(
                        roomBookingOrderBookDate,
                        roomBookingOrderPrice,
                        roomBookingOrderSurcharge,
                        roomBookingOrderTotal,
                        customerId,
                        discountId,
                        roomBookingOrderNote
                    );
                    if (roomBookingOrderRes) {
                        var roomBookingOrderId = roomBookingOrderRes.room_booking_order_id;
                        try {
                            // Create KEY to book foods
                            let random = (Math.random() + 1).toString(36).substring(7).toUpperCase();;
                            let key = "HL" + random;
                            const createRoomBookingDetailRes = await createRoomBookingDetail(
                                checkinDate,
                                checkoutDate,
                                key,
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
                                            noidung += '<div><p>Cảm ơn bạn đã tin tưởng và đặt phòng tại <font color="#41f1b6"><b>Hoàng Long Hotel &amp; Restaurant</b></font> với mã đặt phòng: ' + roomBookingOrderId + '</p></div>';
                                            noidung += '<p><b>Khách hàng:</b> ' + customerName + '<br /><b>Email:</b> ' + customerEmail + '<br /><b>Điện thoại:</b> ' + customerPhoneNumber + '<br />';

                                            // Mã KEY của phòng
                                            noidung += '<p align="justify"><b>Quý khách có thể dùng Mã phòng & Mã KEY sau để tiến hành Đặt món ăn online</b></p>';
                                            noidung += ' <table border="1px" cellpadding="10px" cellspacing="1px"width="100%"><tr><td align="center" bgcolor="#41f1b6"><fontcolor="white"><b>MÃ PHÒNG CỦA BẠN</b></fontcolor=></td><td align="center" bgcolor="#41f1b6"><fontcolor="white"><b>MÃ KEY CỦA BẠN</b></fontcolor=></td></tr>';
                                            noidung += '<tr><td class="prd-total"><b><font color="#41f1b6">' + roomId + '</font></b></td><td class="prd-total"><b><font color="#41f1b6">' + key + '</font></b></td></tr></table><br />';

                                            // Danh sách Sản phẩm đã mua
                                            noidung += ' <table border="1px" cellpadding="10px" cellspacing="1px"width="100%"><tr><td align="center" bgcolor="#41f1b6" colspan="4"><fontcolor="white"><b>ĐƠN ĐẶT PHÒNG CỦA BẠN</b></fontcolor=></td></tr><tr id="invoice-bar"><td width="45%"><b>Loại phòng</b></td><td width="20%"><b>Số phòng</b></td><td width="15%"><b>Số lượng</b></td><td width="20%"><b>Giá tiền</b></td></tr>';

                                            noidung += '<tr><td class="prd-name">' + roomTypeName + '</td><td class="prd-price"><font color="#41f1b6">' + roomName + '</font></td><td class="prd-number">' + "1 Phòng" + '</td><td class="prd-total"><font color="#41f1b6">' + format_money(roomPrice) + ' VNĐ</font></td></tr>';

                                            noidung += '<tr><td class="prd-name">Tổng tiền:</td><td colspan="2"></td><td class="prd-total"><b><font color="#41f1b6">' + format_money(roomBookingOrderTotal) + ' VNĐ</font></b></td></tr></table>';
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
    },

    // ADMIN: Quản lý Đặt phòng
    getRoomBookingAndDetails: async (req, res) => {
        try {
            const result = await getRoomBookingsAndDetail();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Lấy room bookings thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getRoomBookingsAndDetail",
                error: err
            });
        }
    },
    getQuantityRoomBooking: async (req, res) => {
        try {
            const result = await getQuantityRoomBookings();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Lấy quantity room bookings thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getQuantityRoomBookings",
                error: err
            });
        }
    },
    findRoomBookingByIdOrCustomerEmailOrCustomerPhoneOrCustomerNameOrRoomName: async (req, res) => {
        const search = req.params.search;
        try {
            const result = await findRoomBookingByIdOrCustomerEmailOrCustomerPhoneOrCustomerNameOrRoomName(search);
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Tìm room bookings thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findRoomBookingByIdOrCustomerEmailOrCustomerPhoneOrCustomerNameOrRoomName",
                error: err
            });
        }
    },
    findRoomBookingById: async (req, res) => {
        const roomBookingId = req.body.roomBookingId;
        try {
            const result = await findRoomBookingById(roomBookingId);
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Tìm room bookings thành công",
                data: result
            });
        } catch (err) {
            console.log("ERR: ", err);
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findRoomBookingById",
                error: err
            });
        }
    },
    // ADMIN: Check in
    checkInRoomBookingOrder: async (req, res) => {
        const customerFirstName = req.body.customerFirstName;
        const customerLastName = req.body.customerLastName;
        const customerEmail = req.body.customerEmail;
        const customerPhoneNumber = req.body.customerPhoneNumber;
        const roomBookingOrderIdentityCard = req.body.roomBookingOrderIdentityCard;
        const roomBookingOrderNation = req.body.roomBookingOrderNation;
        const roomBookingOrderId = req.body.roomBookingOrderId;

        if (!customerFirstName) {
            return res.status(400).json({
                status: "fail",
                message: "Họ của khách hàng không hợp lệ!"
            });
        }
        if (!customerLastName) {
            return res.status(400).json({
                status: "fail",
                message: "Tên của khách hàng không hợp lệ!"
            });
        }
        if (!customerEmail) {
            return res.status(400).json({
                status: "fail",
                message: "Email của khách hàng không hợp lệ!"
            });
        }
        if (!customerPhoneNumber) {
            return res.status(400).json({
                status: "fail",
                message: "Số điện thoại của khách hàng không hợp lệ!"
            });
        }
        if (!roomBookingOrderIdentityCard) {
            return res.status(400).json({
                status: "fail",
                message: "Số chứng minh thư của khách hàng không hợp lệ!"
            });
        }
        if (!roomBookingOrderNation) {
            return res.status(400).json({
                status: "fail",
                message: "Quốc tịch của khách hàng không hợp lệ!"
            });
        }
        if (!roomBookingOrderId || !Number.isInteger(roomBookingOrderId) || roomBookingOrderId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã Đặt phòng không hợp lệ!"
            });
        }
        // Tìm khách hàng
        try {
            const customerRes = await findCustomerByEmailOrPhoneNumber(customerEmail);
            if (!customerRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record customer not found"
                });
            }
            // Kiểm tra tên người dùng nhập vào
            const customerIdRes = customerRes.customer_id;
            const customerFirstNameRes = customerRes.customer_first_name;
            const customerLastNameRes = customerRes.customer_last_name;
            if (customerFirstNameRes !== customerFirstName && customerLastNameRes !== customerLastName) {
                return res.status(400).json({
                    status: "fail",
                    message: "Họ tên không đúng với email/ SDT đã đặt phòng!"
                });
            }
            // Tìm room booking order
            try {
                const roomBookingOrderRes = await findRoomBookingOrderByIdCheckIn(roomBookingOrderId);
                if (!roomBookingOrderRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Record room booking order not found"
                    });
                }
                const roomBookingOrderStateRes = roomBookingOrderRes.room_booking_order_state;
                if (roomBookingOrderStateRes !== 0) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Đơn đặt này Đã Check in hoặc Đã hoàn thành rồi!"
                    });
                }
                // Kiểm tra người dùng phải người đã đặt phòng này không?
                const customerIdInRoomBookingOrder = roomBookingOrderRes.customer_id;
                if (customerIdRes !== customerIdInRoomBookingOrder) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Phòng không được đặt bởi khách hàng này!"
                    });
                }
                // Kiểm tra ngày check in xem phải ngày muốn check in không?
                try {
                    const roomBookingDetailRes = await getRoomBookingDetailByRoomBookingOrderId(roomBookingOrderId);
                    if (!roomBookingDetailRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Record room booking detail not found"
                        });
                    }
                    var dateCheckinRes = new Date(roomBookingDetailRes.room_booking_detail_checkin_date);
                    var dateCheckoutRes = new Date(roomBookingDetailRes.room_booking_detail_checkout_date);

                    // So sánh ngày
                    var today = new Date();
                    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + (today.getDate() + 1);
                    var checkInDate = new Date(date);

                    if (checkInDate < dateCheckinRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Không thể check in trước ngày " + roomBookingDetailRes.room_booking_detail_checkin_date
                        });
                    }
                    if (checkInDate > dateCheckoutRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Ngày Check in đã quá ngày Check out: " + roomBookingDetailRes.room_booking_detail_checkout_date
                        });
                    }
                    // Cập nhật số cmnd và quốc tịch và ngày bắt đầu nhận phòng
                    // Lấy ngày hiện tại FORMAT: '2022-05-05 13:48:12' giống CSDL
                    var todayCheckIn = new Date();
                    var dateCheckIn = todayCheckIn.getFullYear() + '-' + (todayCheckIn.getMonth() + 1) + '-' + todayCheckIn.getDate();
                    var timeCheckIn = todayCheckIn.getHours() + ":" + todayCheckIn.getMinutes() + ":" + todayCheckIn.getSeconds();
                    var startDate = dateCheckIn + ' ' + timeCheckIn;
                    try {
                        const updateCheckInInfoRes = await updateRoomBookingOrderInfoWhenCheckInSuccess(roomBookingOrderIdentityCard, roomBookingOrderNation, startDate, roomBookingOrderId);
                        if (!updateCheckInInfoRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't update room booking info when check in success"
                            });
                        }
                        // Cập nhật state
                        try {
                            const updateStateRes = await updateRoomBookingOrderState(1, roomBookingOrderId);
                            if (!updateStateRes) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Cann't update room booking state when check in success"
                                });
                            }

                            createLogAdmin(req, res, " vừa Check in cho Đơn đặt phòng có mã: " + roomBookingOrderId, "UPDATE").then(() => {
                                // Success
                                return res.status(200).json({
                                    status: "success",
                                    message: "Check in thành công!"
                                });
                            });

                        } catch (err) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Error when update room booking order state when check in success!",
                                error: err
                            });
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when update room booking order info when check in success!",
                            error: err
                        });
                    }
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when find room booking detail!",
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
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when find customer!",
                error: err
            });
        }
    },
    // ADMIN: Check out
    checkOutRoomBookingOrder: async (req, res) => {
        const roomBookingOrderId = req.body.roomBookingOrderId;

        if (!roomBookingOrderId || !Number.isInteger(roomBookingOrderId) || roomBookingOrderId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã Đặt phòng không hợp lệ!"
            });
        }
        // Tìm room booking order xem có không
        try {
            const roomBookingOrderRes = await findRoomBookingOrderByIdCheckIn(roomBookingOrderId);
            if (!roomBookingOrderRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record room booking order not found"
                });
            }
            const roomBookingOrderStateRes = roomBookingOrderRes.room_booking_order_state;
            if (roomBookingOrderStateRes !== 1) {
                return res.status(400).json({
                    status: "fail",
                    message: "Đơn đặt này chưa Check in hoặc Đã hoàn thành rồi!"
                });
            }
            // Kiểm tra ngày check in xem phải ngày muốn check in không?
            try {
                const roomBookingDetailRes = await getRoomBookingDetailByRoomBookingOrderId(roomBookingOrderId);
                if (!roomBookingDetailRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Record room booking detail not found"
                    });
                }
                var roomBookingDetailId = roomBookingDetailRes.room_booking_detail_id;
                var dateCheckinRes = new Date(roomBookingDetailRes.room_booking_detail_checkin_date);
                var dateCheckoutRes = new Date(roomBookingDetailRes.room_booking_detail_checkout_date);

                // So sánh ngày
                var today = new Date();
                var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + (today.getDate() + 1);
                var checkOutDate = new Date(date);

                if (checkOutDate < dateCheckinRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Không thể check in trước ngày " + roomBookingDetailRes.room_booking_detail_checkin_date
                    });
                }
                if (checkOutDate > dateCheckoutRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Ngày Check in đã quá ngày Check out: " + roomBookingDetailRes.room_booking_detail_checkout_date
                    });
                }

                // Cập nhật ngày hoàn thành check out: finish date
                // Lấy ngày hiện tại FORMAT: '2022-05-05 13:48:12' giống CSDL
                var today = new Date();
                var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                var finishDate = date + ' ' + time;
                try {
                    const updateFinishDateRes = await updateRoomBookingOrderFinishDateWhenCheckOutSuccess(finishDate, roomBookingOrderId);
                    if (!updateFinishDateRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't update room booking finish date when check out success"
                        });
                    }

                    // Cập nhật key trong detail thành null => Để người dùng không đặt được nữa khi Đã check out!
                    try {
                        const updateDetailKeyRes = await updateRoomBookingDetailKeyWhenCheckOutSuccess(null, roomBookingDetailId);
                        if (!updateDetailKeyRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't update room booking detail key when check out success"
                            });
                        }
                        // Cập nhật state
                        try {
                            const updateStateRes = await updateRoomBookingOrderState(2, roomBookingOrderId);
                            if (!updateStateRes) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Cann't update room booking state when check out success"
                                });
                            }

                            createLogAdmin(req, res, " vừa Check out cho Đơn đặt phòng có mã: " + roomBookingOrderId, "UPDATE").then(() => {
                                // Success
                                return res.status(200).json({
                                    status: "success",
                                    message: "Check out thành công!"
                                });
                            });

                        } catch (err) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Error when update room booking order state when check out success!",
                                error: err
                            });
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when update room booking detail key when check out success!",
                            error: err
                        });
                    }
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when update room booking order finish date when check out success!",
                        error: err
                    });
                }
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when find room booking detail!",
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
};