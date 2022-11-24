const { getCustomerByCustomerId, findCustomerByEmailOrPhoneNumber } = require("../service/CustomerService");
const { updateDiscountState } = require("../service/DiscountService");
const { createRoomBookingDetail, getRoomBookingDetailByRoomBookingOrderId, updateRoomBookingDetailKeyWhenCheckOutSuccess } = require("../service/RoomBookingDetailService");
const { createRoomBookingOrder, findRoomBookingOrder, getRoomBookingsAndDetail, getQuantityRoomBookings, findRoomBookingByIdOrCustomerEmailOrCustomerPhoneOrCustomerNameOrRoomName, findRoomBookingById, findRoomBookingOrderByIdCheckIn, updateRoomBookingOrderInfoWhenCheckInSuccess, updateRoomBookingOrderState, updateRoomBookingOrderFinishDateWhenCheckOutSuccess, getRoomBookingTotalByDate, getDistinctDateInRoomBookingOrderFromDateToDate, getRoomBookingTotalByMonth, getLimitRoomBookingTotalOfCityForEachQuarter, getRoomBookingOrderByCityId, getRoomBookingTotalOfCityByDateAndLimitAsc, getRoomBookingTotalOfCityByDateAndAsc, getRoomBookingTotalOfCityByDateAndLimitDesc, getRoomBookingTotalOfCityByDateAndDesc, getRoomBookingTotalOfCityByMonthAndLimitAsc, getRoomBookingTotalOfCityByMonthAndAsc, getRoomBookingTotalOfCityByMonthAndDesc, getRoomBookingTotalOfCityByMonthAndLimitDesc, getRoomBookingTotalOfCityByQuarter1AnCityId, getRoomBookingTotalOfCityByQuarter2AnCityId, getRoomBookingTotalOfCityByQuarter3AnCityId, getRoomBookingTotalOfCityByQuarter4AnCityId, getRoomBookingTotalOfCityByQuarterOneOrderByCaNamDescAndLimit, getRoomBookingTotalOfCityByQuarterOneOrderByCaNamDesc, getRoomBookingTotalOfCityByQuarterOneOrderByCaNamAscAndLimit, getRoomBookingTotalOfCityByQuarterOneOrderByCaNamAsc, getRoomBookingTotalOfCityByQuarterTwoOrderByCaNamDescAndLimit, getRoomBookingTotalOfCityByQuarterTwoOrderByCaNamDesc, getRoomBookingTotalOfCityByQuarterTwoOrderByCaNamAscAndLimit, getRoomBookingTotalOfCityByQuarterTwoOrderByCaNamAsc, getRoomBookingTotalOfCityByQuarterThreeOrderByCaNamDescAndLimit, getRoomBookingTotalOfCityByQuarterThreeOrderByCaNamDesc, getRoomBookingTotalOfCityByQuarterThreeOrderByCaNamAscAndLimit, getRoomBookingTotalOfCityByQuarterThreeOrderByCaNamAsc, getRoomBookingTotalOfCityByQuarterFourOrderByCaNamDescAndLimit, getRoomBookingTotalOfCityByQuarterFourOrderByCaNamDesc, getRoomBookingTotalOfCityByQuarterFourOrderByCaNamAscAndLimit, getRoomBookingTotalOfCityByQuarterFourOrderByCaNamAsc, getRoomBookingTotalOfCityByDateByListDate, getRoomBookingTotalOfCityByDateByListDateNoLimit, getRoomBookingOrderByDate, getRoomBookingOrderByQuarterAndCityId, getRoomBookingOrderFromDateToDate, getRoomBookingOrderOfQuarter } = require("../service/RoomBookingOrderService");
const { findRoomByRoomId } = require("../service/RoomService");
const { format_money, createLogAdmin } = require("../utils/utils");

// NODE Mailer
var nodemailer = require('nodemailer');
const { getWardByWardId } = require("../service/WardService");
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
        const roomBookingOrderAddress = req.body.roomBookingOrderAddress;
        const roomBookingOrderWardId = req.body.roomBookingOrderWardId;
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
        if (!roomBookingOrderAddress) {
            return res.status(400).json({
                status: "fail",
                message: "Địa chỉ của khách hàng không hợp lệ!"
            });
        }
        if (!roomBookingOrderWardId || roomBookingOrderWardId === '' || roomBookingOrderWardId === undefined || roomBookingOrderWardId === null) {
            return res.status(400).json({
                status: "fail",
                message: "Mã Xã phường của khách hàng không hợp lệ!"
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
                    checkInDate.setHours(-17, 0, 0, 0);
                    console.log("checkInDate > dateCheckinRes: ", checkInDate > dateCheckinRes, checkInDate, dateCheckinRes)
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
                    // Tìm Xã phường có tồn tại không
                    try {
                        const wardRes = await getWardByWardId(roomBookingOrderWardId);
                        if (!wardRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find ward"
                            });
                        }
                        // Cập nhật số cmnd và quốc tịch và ngày bắt đầu nhận phòng
                        // Lấy ngày hiện tại FORMAT: '2022-05-05 13:48:12' giống CSDL
                        var todayCheckIn = new Date();
                        var dateCheckIn = todayCheckIn.getFullYear() + '-' + (todayCheckIn.getMonth() + 1) + '-' + todayCheckIn.getDate();
                        var timeCheckIn = todayCheckIn.getHours() + ":" + todayCheckIn.getMinutes() + ":" + todayCheckIn.getSeconds();
                        var startDate = dateCheckIn + ' ' + timeCheckIn;
                        try {
                            const updateCheckInInfoRes = await updateRoomBookingOrderInfoWhenCheckInSuccess(roomBookingOrderIdentityCard, roomBookingOrderNation, roomBookingOrderAddress, roomBookingOrderWardId, startDate, roomBookingOrderId);
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
                            message: "Error when find ward!",
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
                checkOutDate.setHours(-17, 0, 0, 0);

                console.log("checkOutDate > dateCheckinRes: ", checkOutDate > dateCheckoutRes, checkOutDate, dateCheckoutRes)
                if (checkOutDate < dateCheckinRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Không thể check out trước ngày " + roomBookingDetailRes.room_booking_detail_checkin_date
                    });
                }
                if (checkOutDate > dateCheckoutRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Đã quá ngày Check out: " + roomBookingDetailRes.room_booking_detail_checkout_date
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
    },

    // Admin: Quản lý đặt phòng - Thống kê doanh thu
    getStatisticRoomBookingTotalByDate: async (req, res) => {
        const dateFrom = req.body.dateFrom;
        const dateTo = req.body.dateTo;
        const sortWay = req.body.sortWay;
        if (!dateFrom) {
            return res.status(400).json({
                status: "fail",
                message: "Ngày bắt đầu thống kê không hợp lệ!"
            });
        }
        if (!dateTo) {
            return res.status(400).json({
                status: "fail",
                message: "Ngày kết thúc thống kê không hợp lệ!"
            });
        }
        if (!sortWay) {
            return res.status(400).json({
                status: "fail",
                message: "Cách sắp xếp không hợp lệ!"
            });
        }
        // Lấy ngày trong room booking từ dateFrom đến dateTo
        try {
            const fromDateToDateListRes = await getDistinctDateInRoomBookingOrderFromDateToDate(dateFrom, dateTo);
            if (!fromDateToDateListRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't get date list"
                });
            }

            let finalArray = [];
            // Lấy ngày hiện tại FORMAT: '2022-05-05 13:48:12' giống CSDL
            var todayCheckIn = new Date();
            var dateCheckIn = todayCheckIn.getFullYear() + '-' + (todayCheckIn.getMonth() + 1) + '-' + todayCheckIn.getDate();
            var timeCheckIn = todayCheckIn.getHours() + ":" + todayCheckIn.getMinutes() + ":" + todayCheckIn.getSeconds();
            var statisticDate = dateCheckIn + ' ' + timeCheckIn;

            for (var i = 0; i < fromDateToDateListRes.length; i++) {
                const date = fromDateToDateListRes[i].finishDate;
                // Lấy doanh thu theo ngày
                try {
                    const totalRes = await getRoomBookingTotalByDate(date);
                    if (!totalRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't find room booking total by date"
                        });
                    }
                    finalArray.push({
                        date: date,
                        data: totalRes.total
                    });
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when statist by date!",
                        error: err
                    });
                }
            }

            // Sort
            let dateArray = [];
            let dataArray = [];
            if (sortWay === "asc") {
                finalArray = finalArray.sort((a, b) => a.data - b.data);
            } else {
                finalArray = finalArray.sort((a, b) => b.data - a.data);
            }
            for (var i = 0; i < finalArray.length; i++) {
                dateArray.push(finalArray[i].date);
                dataArray.push(finalArray[i].data);
            }

            var roomBookingOrderList = [];
            // Lấy danh sách đặt phòng chi tiết
            try {
                const roomBookingOrderListRes = await getRoomBookingOrderFromDateToDate(dateFrom, dateTo);
                if (!roomBookingOrderListRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't find room booking order from date to date"
                    });
                }
                roomBookingOrderList = roomBookingOrderListRes;
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when getRoomBookingOrderFromDateToDate!",
                    error: err
                });
            }

            // Success
            return res.status(200).json({
                status: "success",
                message: "Thống kê doanh thu theo ngày thành công!",
                data: {
                    statisticDate: statisticDate,
                    dateArray: dateArray,
                    data: finalArray,
                    dataArray: dataArray,
                    dateFrom: dateFrom,
                    dateTo: dateTo,
                    roomBookingOrderList: roomBookingOrderList
                }
            });
        } catch (err) {
            console.log(err)
            return res.status(400).json({
                status: "fail",
                message: "Error when find date!",
                error: err
            });
        }
    },
    // Admin: Quản lý đặt phòng - Thống kê doanh thu
    getStatisticRoomBookingTotalByQuarter: async (req, res) => {
        const quarter = req.body.quarter;
        const sortWay = req.body.sortWay;
        if (!quarter || !Number.isInteger(quarter) || quarter >= 5 || quarter < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Quý thống kê không hợp lệ!"
            });
        }
        if (!sortWay) {
            return res.status(400).json({
                status: "fail",
                message: "Cách sắp xếp không hợp lệ!"
            });
        }

        var monthInQuarterArray = [];
        if (quarter === 1) {
            monthInQuarterArray = [1, 2, 3];
        } else if (quarter === 2) {
            monthInQuarterArray = [4, 5, 6];
        } else if (quarter === 3) {
            monthInQuarterArray = [7, 8, 9];
        } else {
            monthInQuarterArray = [10, 11, 12];
        }

        let finalArray = [];
        // Lấy ngày hiện tại FORMAT: '2022-05-05 13:48:12' giống CSDL
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var statisticDate = date + ' ' + time;

        for (var i = 0; i < monthInQuarterArray.length; i++) {
            const month = monthInQuarterArray[i];
            // Lấy doanh thu theo tháng
            try {
                const totalRes = await getRoomBookingTotalByMonth(month);
                if (!totalRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't find room booking total by month"
                    });
                }
                finalArray.push({
                    month: month,
                    data: totalRes.total
                });
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when statist by month!",
                    error: err
                });
            }
        }

        // Sort
        let monthArray = [];
        let dataArray = [];
        if (sortWay === "asc") {
            finalArray = finalArray.sort((a, b) => a.data - b.data);
        } else {
            finalArray = finalArray.sort((a, b) => b.data - a.data);
        }
        for (var i = 0; i < finalArray.length; i++) {
            monthArray.push(finalArray[i].month);
            dataArray.push(finalArray[i].data);
        }
        var roomBookingOrderList = [];
        // Lấy danh sách đặt phòng chi tiết
        try {
            const roomBookingOrderListRes = await getRoomBookingOrderOfQuarter(quarter);
            if (!roomBookingOrderListRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find room booking order of quarter"
                });
            }
            roomBookingOrderList = roomBookingOrderListRes;
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when getRoomBookingOrderOfQuarter!",
                error: err
            });
        }
        // Success
        return res.status(200).json({
            status: "success",
            message: "Thống kê doanh thu theo Tháng trong Quý thành công!",
            data: {
                statisticDate: statisticDate,
                monthArray: monthArray,
                data: finalArray,
                dataArray: dataArray,
                quarter: quarter,
                roomBookingOrderList: roomBookingOrderList
            }
        });
    },
    // Admin: Quản lý đặt phòng - Thống kê doanh thu Theo thành phố
    getLimitRoomBookingTotalOfCityForEachQuarter: async (req, res) => {
        const limit = 5;
        try {
            const roomBookingTotalOfCityForEachQuarterRes = await getLimitRoomBookingTotalOfCityForEachQuarter(limit);
            if (!roomBookingTotalOfCityForEachQuarterRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't get room booking total of city for each quarter list"
                });
            }

            let finalDataTableArray = [];
            // Lấy ngày hiện tại FORMAT: '2022-05-05 13:48:12' giống CSDL
            var todayCheckIn = new Date();
            var dateCheckIn = todayCheckIn.getFullYear() + '-' + (todayCheckIn.getMonth() + 1) + '-' + todayCheckIn.getDate();
            var timeCheckIn = todayCheckIn.getHours() + ":" + todayCheckIn.getMinutes() + ":" + todayCheckIn.getSeconds();
            var statisticDate = dateCheckIn + ' ' + timeCheckIn;

            for (var i = 0; i < roomBookingTotalOfCityForEachQuarterRes.length; i++) {
                const cityId = roomBookingTotalOfCityForEachQuarterRes[i].city_id;
                const cityName = roomBookingTotalOfCityForEachQuarterRes[i].city_name;
                // Lấy đơn đặt phòng cho từng city id
                try {
                    const roomBookingByCityIdRes = await getRoomBookingOrderByCityId(cityId);
                    if (!roomBookingByCityIdRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't find room booking by city id"
                        });
                    }
                    finalDataTableArray.push({
                        cityName: cityName,
                        data: roomBookingByCityIdRes
                    });
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when statist by date!",
                        error: err
                    });
                }
            }

            // Success
            return res.status(200).json({
                status: "success",
                message: "Thống kê doanh thu theo Thành phố của 4 quý thành công!",
                data: {
                    statisticDate: statisticDate,
                    data: roomBookingTotalOfCityForEachQuarterRes,
                    dataArray: finalDataTableArray,
                }
            });
        } catch (err) {
            console.log(err)
            return res.status(400).json({
                status: "fail",
                message: "Error when get room booking total of city for each quarter list!",
                error: err
            });
        }
    },
    // Admin: Quản lý đặt phòng - Thống kê doanh thu Theo thành phố
    getStatisticRoomBookingTotalOfCityByDate: async (req, res) => {
        const dateFrom = req.body.dateFrom;
        const dateTo = req.body.dateTo;
        const sortWay = req.body.sortWay;
        const limit = req.body.limit;
        if (!dateFrom) {
            return res.status(400).json({
                status: "fail",
                message: "Ngày bắt đầu thống kê không hợp lệ!"
            });
        }
        if (!dateTo) {
            return res.status(400).json({
                status: "fail",
                message: "Ngày kết thúc thống kê không hợp lệ!"
            });
        }
        if (!sortWay) {
            return res.status(400).json({
                status: "fail",
                message: "Cách sắp xếp không hợp lệ!"
            });
        }
        if (!limit || limit !== 'five' && limit !== 'ten' && limit !== 'all') {
            return res.status(400).json({
                status: "fail",
                message: "Bạn chưa giới hạn số lượng tìm kiếm!"
            });
        }
        // Lấy ngày trong room booking từ dateFrom đến dateTo
        try {
            const fromDateToDateListRes = await getDistinctDateInRoomBookingOrderFromDateToDate(dateFrom, dateTo);
            if (!fromDateToDateListRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't get date list"
                });
            }

            let finalArray = [];
            // Lấy ngày hiện tại FORMAT: '2022-05-05 13:48:12' giống CSDL
            var todayCheckIn = new Date();
            var dateCheckIn = todayCheckIn.getFullYear() + '-' + (todayCheckIn.getMonth() + 1) + '-' + todayCheckIn.getDate();
            var timeCheckIn = todayCheckIn.getHours() + ":" + todayCheckIn.getMinutes() + ":" + todayCheckIn.getSeconds();
            var statisticDate = dateCheckIn + ' ' + timeCheckIn;
            for (var i = 0; i < fromDateToDateListRes.length; i++) {
                const date = fromDateToDateListRes[i].finishDate;
                if (sortWay === 'asc') {
                    // Date: limit 5 - asc
                    if (limit === 'five') {
                        try {
                            const totalRes = await getRoomBookingTotalOfCityByDateAndLimitAsc(date, 5);
                            if (!totalRes) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Cann't find room booking total by date"
                                });
                            }
                            // Lấy đơn đặt phòng cho từng Ngày
                            try {
                                const roomBookingByDateRes = await getRoomBookingOrderByDate(date);
                                if (!roomBookingByDateRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find room booking by date"
                                    });
                                }
                                finalArray.push({
                                    date: date,
                                    data: totalRes,
                                    roomBookingOrderDetailList: roomBookingByDateRes
                                });
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getRoomBookingOrderByDate!",
                                    error: err
                                });
                            }
                        } catch (err) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Error when statist by date!",
                                error: err
                            });
                        }
                    }
                    // Date: limit 10 - asc
                    if (limit === 'ten') {
                        try {
                            const totalRes = await getRoomBookingTotalOfCityByDateAndLimitAsc(date, 10);
                            if (!totalRes) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Cann't find room booking total by date"
                                });
                            }
                            // Lấy đơn đặt phòng cho từng Ngày
                            try {
                                const roomBookingByDateRes = await getRoomBookingOrderByDate(date);
                                if (!roomBookingByDateRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find room booking by date"
                                    });
                                }
                                finalArray.push({
                                    date: date,
                                    data: totalRes,
                                    roomBookingOrderDetailList: roomBookingByDateRes
                                });
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getRoomBookingOrderByDate!",
                                    error: err
                                });
                            }
                        } catch (err) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Error when statist by date!",
                                error: err
                            });
                        }
                    }
                    // Date: - asc
                    if (limit === 'all') {
                        try {
                            const totalRes = await getRoomBookingTotalOfCityByDateAndAsc(date);
                            if (!totalRes) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Cann't find room booking total by date"
                                });
                            }
                            // Lấy đơn đặt phòng cho từng Ngày
                            try {
                                const roomBookingByDateRes = await getRoomBookingOrderByDate(date);
                                if (!roomBookingByDateRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find room booking by date"
                                    });
                                }
                                finalArray.push({
                                    date: date,
                                    data: totalRes,
                                    roomBookingOrderDetailList: roomBookingByDateRes
                                });
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getRoomBookingOrderByDate!",
                                    error: err
                                });
                            }
                        } catch (err) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Error when statist by date!",
                                error: err
                            });
                        }
                    }
                }
                if (sortWay === 'desc') {
                    // Date: limit 5 - desc
                    if (limit === 'five') {
                        try {
                            const totalRes = await getRoomBookingTotalOfCityByDateAndLimitDesc(date, 5);
                            if (!totalRes) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Cann't find room booking total by date"
                                });
                            }
                            // Lấy đơn đặt phòng cho từng Ngày
                            try {
                                const roomBookingByDateRes = await getRoomBookingOrderByDate(date);
                                if (!roomBookingByDateRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find room booking by date"
                                    });
                                }
                                finalArray.push({
                                    date: date,
                                    data: totalRes,
                                    roomBookingOrderDetailList: roomBookingByDateRes
                                });
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getRoomBookingOrderByDate!",
                                    error: err
                                });
                            }
                        } catch (err) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Error when statist by date!",
                                error: err
                            });
                        }
                    }
                    // Date: limit 10 - desc
                    if (limit === 'ten') {
                        try {
                            const totalRes = await getRoomBookingTotalOfCityByDateAndLimitDesc(date, 10);
                            if (!totalRes) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Cann't find room booking total by date"
                                });
                            }
                            // Lấy đơn đặt phòng cho từng Ngày
                            try {
                                const roomBookingByDateRes = await getRoomBookingOrderByDate(date);
                                if (!roomBookingByDateRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find room booking by date"
                                    });
                                }
                                finalArray.push({
                                    date: date,
                                    data: totalRes,
                                    roomBookingOrderDetailList: roomBookingByDateRes
                                });
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getRoomBookingOrderByDate!",
                                    error: err
                                });
                            }
                        } catch (err) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Error when statist by date!",
                                error: err
                            });
                        }
                    }
                    // Date: - desc
                    if (limit === 'all') {
                        try {
                            const totalRes = await getRoomBookingTotalOfCityByDateAndDesc(date);
                            if (!totalRes) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Cann't find room booking total by date"
                                });
                            }
                            // Lấy đơn đặt phòng cho từng Ngày
                            try {
                                const roomBookingByDateRes = await getRoomBookingOrderByDate(date);
                                if (!roomBookingByDateRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find room booking by date"
                                    });
                                }
                                finalArray.push({
                                    date: date,
                                    data: totalRes,
                                    roomBookingOrderDetailList: roomBookingByDateRes
                                });
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getRoomBookingOrderByDate!",
                                    error: err
                                });
                            }
                        } catch (err) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Error when statist by date!",
                                error: err
                            });
                        }
                    }
                }
            }

            // Sort
            let dateArray = [];
            let dataArray = [];
            for (var i = 0; i < finalArray.length; i++) {
                dateArray.push(finalArray[i].date);
                dataArray.push(finalArray[i].data);
            }

            // Lấy data để hiện biểu đồ
            var statistisData = {};
            if (limit === "five") {
                try {
                    const roomBookingTotalOfCityByDateRes = await getRoomBookingTotalOfCityByDateByListDate(fromDateToDateListRes, sortWay, 5);
                    if (!roomBookingTotalOfCityByDateRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't get test"
                        });
                    }
                    statistisData = roomBookingTotalOfCityByDateRes
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when getRoomBookingTotalOfCityByDateByListDate 5!",
                        error: err
                    });
                }
            }
            if (limit === "ten") {
                try {
                    const roomBookingTotalOfCityByDateRes = await getRoomBookingTotalOfCityByDateByListDate(fromDateToDateListRes, sortWay, 10);
                    if (!roomBookingTotalOfCityByDateRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't get test"
                        });
                    }
                    statistisData = roomBookingTotalOfCityByDateRes
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when getRoomBookingTotalOfCityByDateByListDate 10!",
                        error: err
                    });
                }
            }
            if (limit === "all") {
                try {
                    // TEST
                    const roomBookingTotalOfCityByDateRes = await getRoomBookingTotalOfCityByDateByListDateNoLimit(fromDateToDateListRes, sortWay);
                    if (!roomBookingTotalOfCityByDateRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't get test"
                        });
                    }
                    statistisData = roomBookingTotalOfCityByDateRes
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when getRoomBookingTotalOfCityByDateByListDateNoLimit!",
                        error: err
                    });
                }
            }

            // Success
            return res.status(200).json({
                status: "success",
                message: "Thống kê doanh thu theo ngày của Thành phố thành công!",
                data: {
                    statisticDate: statisticDate,
                    dateArray: dateArray,
                    data: finalArray,
                    dataArray: dataArray,
                    dateFrom: dateFrom,
                    dateTo: dateTo,
                    limit: limit,
                    sortWay: sortWay,
                    statistisData: statistisData
                }
            });
        } catch (err) {
            console.log(err)
            return res.status(400).json({
                status: "fail",
                message: "Error when find date!",
                error: err
            });
        }
    },

    // Admin: Quản lý đặt phòng - Thống kê doanh thu Theo thành phố
    getStatisticRoomBookingTotalOfCityByQuarter: async (req, res) => {
        const quarter = req.body.quarter;
        const sortWay = req.body.sortWay;
        const limit = req.body.limit;
        if (!quarter || !Number.isInteger(quarter) || quarter >= 5 || quarter < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Quý thống kê không hợp lệ!"
            });
        }
        if (!sortWay) {
            return res.status(400).json({
                status: "fail",
                message: "Cách sắp xếp không hợp lệ!"
            });
        }
        if (!limit || limit !== 'five' && limit !== 'ten' && limit !== 'all') {
            return res.status(400).json({
                status: "fail",
                message: "Bạn chưa giới hạn số lượng tìm kiếm!"
            });
        }
        let finalDataArray = {};
        let roomBookingOrderDetailList = [];
        // Nếu là quý 1
        if (quarter === 1) {
            if (sortWay === "desc") {
                if (limit === "five") {
                    // Quarter 1: -limit 5 - desc
                    try {
                        const roomBookingTotalQuarterRes = await getRoomBookingTotalOfCityByQuarterOneOrderByCaNamDescAndLimit(5);
                        if (!roomBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find room booking by Quarter 1: -limit 5 - desc"
                            });
                        }
                        finalDataArray = roomBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt phòng chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < roomBookingTotalQuarterRes.length; j++) {
                            const cityId = roomBookingTotalQuarterRes[j].city_id;
                            try {
                                const roomBookingOrderListRes = await getRoomBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!roomBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find room booking order list by quarter and city id"
                                    });
                                }
                                roomBookingOrderListRes.map((roomBookingOrder, key) => {
                                    roomBookingOrderDetailList.push(roomBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getRoomBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getRoomBookingTotalOfCityByQuarterOneOrderByCaNamDescAndLimit 5!",
                            error: err
                        });
                    }
                }
                if (limit === "ten") {
                    // Quarter 1: -limit 10 - desc
                    try {
                        const roomBookingTotalQuarterRes = await getRoomBookingTotalOfCityByQuarterOneOrderByCaNamDescAndLimit(10);
                        if (!roomBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find room booking by Quarter 1: -limit 10 - desc"
                            });
                        }
                        finalDataArray = roomBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt phòng chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < roomBookingTotalQuarterRes.length; j++) {
                            const cityId = roomBookingTotalQuarterRes[j].city_id;
                            try {
                                const roomBookingOrderListRes = await getRoomBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!roomBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find room booking order list by quarter and city id"
                                    });
                                }
                                roomBookingOrderListRes.map((roomBookingOrder, key) => {
                                    roomBookingOrderDetailList.push(roomBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getRoomBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getRoomBookingTotalOfCityByQuarterOneOrderByCaNamDescAndLimit 10!",
                            error: err
                        });
                    }
                }
                if (limit === "all") {
                    // Quarter 1: - no limit - desc
                    try {
                        const roomBookingTotalQuarterRes = await getRoomBookingTotalOfCityByQuarterOneOrderByCaNamDesc();
                        if (!roomBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find room booking by Quarter 1: - no limit - desc"
                            });
                        }
                        finalDataArray = roomBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt phòng chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < roomBookingTotalQuarterRes.length; j++) {
                            const cityId = roomBookingTotalQuarterRes[j].city_id;
                            try {
                                const roomBookingOrderListRes = await getRoomBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!roomBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find room booking order list by quarter and city id"
                                    });
                                }
                                roomBookingOrderListRes.map((roomBookingOrder, key) => {
                                    roomBookingOrderDetailList.push(roomBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getRoomBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getRoomBookingTotalOfCityByQuarterOneOrderByCaNamDesc!",
                            error: err
                        });
                    }
                }
            }
            if (sortWay === "asc") {
                if (limit === "five") {
                    // Quarter 1: -limit 5 - asc
                    try {
                        const roomBookingTotalQuarterRes = await getRoomBookingTotalOfCityByQuarterOneOrderByCaNamAscAndLimit(5);
                        if (!roomBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find room booking by Quarter 1: -limit 5 - asc"
                            });
                        }
                        finalDataArray = roomBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt phòng chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < roomBookingTotalQuarterRes.length; j++) {
                            const cityId = roomBookingTotalQuarterRes[j].city_id;
                            try {
                                const roomBookingOrderListRes = await getRoomBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!roomBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find room booking order list by quarter and city id"
                                    });
                                }
                                roomBookingOrderListRes.map((roomBookingOrder, key) => {
                                    roomBookingOrderDetailList.push(roomBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getRoomBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getRoomBookingTotalOfCityByQuarterOneOrderByCaNamAscAndLimit 5!",
                            error: err
                        });
                    }
                }
                if (limit === "ten") {
                    // Quarter 1: -limit 10 - asc
                    try {
                        const roomBookingTotalQuarterRes = await getRoomBookingTotalOfCityByQuarterOneOrderByCaNamAscAndLimit(10);
                        if (!roomBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find room booking by Quarter 1: -limit 10 - asc"
                            });
                        }
                        finalDataArray = roomBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt phòng chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < roomBookingTotalQuarterRes.length; j++) {
                            const cityId = roomBookingTotalQuarterRes[j].city_id;
                            try {
                                const roomBookingOrderListRes = await getRoomBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!roomBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find room booking order list by quarter and city id"
                                    });
                                }
                                roomBookingOrderListRes.map((roomBookingOrder, key) => {
                                    roomBookingOrderDetailList.push(roomBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getRoomBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getRoomBookingTotalOfCityByQuarterOneOrderByCaNamAscAndLimit 10!",
                            error: err
                        });
                    }
                }
                if (limit === "all") {
                    // Quarter 1: - no limit - asc
                    try {
                        const roomBookingTotalQuarterRes = await getRoomBookingTotalOfCityByQuarterOneOrderByCaNamAsc();
                        if (!roomBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find room booking by Quarter 1: - no limit - asc"
                            });
                        }
                        finalDataArray = roomBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt phòng chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < roomBookingTotalQuarterRes.length; j++) {
                            const cityId = roomBookingTotalQuarterRes[j].city_id;
                            try {
                                const roomBookingOrderListRes = await getRoomBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!roomBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find room booking order list by quarter and city id"
                                    });
                                }
                                roomBookingOrderListRes.map((roomBookingOrder, key) => {
                                    roomBookingOrderDetailList.push(roomBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getRoomBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getRoomBookingTotalOfCityByQuarterOneOrderByCaNamAsc!",
                            error: err
                        });
                    }
                }
            }
        }
        // Nếu là quý 2
        if (quarter === 2) {
            if (sortWay === "desc") {
                if (limit === "five") {
                    // Quarter 2: -limit 5 - desc
                    try {
                        const roomBookingTotalQuarterRes = await getRoomBookingTotalOfCityByQuarterTwoOrderByCaNamDescAndLimit(5);
                        if (!roomBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find room booking by Quarter 2: -limit 5 - desc"
                            });
                        }
                        finalDataArray = roomBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt phòng chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < roomBookingTotalQuarterRes.length; j++) {
                            const cityId = roomBookingTotalQuarterRes[j].city_id;
                            try {
                                const roomBookingOrderListRes = await getRoomBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!roomBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find room booking order list by quarter and city id"
                                    });
                                }
                                roomBookingOrderListRes.map((roomBookingOrder, key) => {
                                    roomBookingOrderDetailList.push(roomBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getRoomBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getRoomBookingTotalOfCityByQuarterTwoOrderByCaNamDescAndLimit 5!",
                            error: err
                        });
                    }
                }
                if (limit === "ten") {
                    // Quarter 2: -limit 10 - desc
                    try {
                        const roomBookingTotalQuarterRes = await getRoomBookingTotalOfCityByQuarterTwoOrderByCaNamDescAndLimit(10);
                        if (!roomBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find room booking by Quarter 2: -limit 10 - desc"
                            });
                        }
                        finalDataArray = roomBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt phòng chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < roomBookingTotalQuarterRes.length; j++) {
                            const cityId = roomBookingTotalQuarterRes[j].city_id;
                            try {
                                const roomBookingOrderListRes = await getRoomBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!roomBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find room booking order list by quarter and city id"
                                    });
                                }
                                roomBookingOrderListRes.map((roomBookingOrder, key) => {
                                    roomBookingOrderDetailList.push(roomBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getRoomBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getRoomBookingTotalOfCityByQuarterTwoOrderByCaNamDescAndLimit 10!",
                            error: err
                        });
                    }
                }
                if (limit === "all") {
                    // Quarter 2: - no limit - desc
                    try {
                        const roomBookingTotalQuarterRes = await getRoomBookingTotalOfCityByQuarterTwoOrderByCaNamDesc();
                        if (!roomBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find room booking by Quarter 2: - no limit - desc"
                            });
                        }
                        finalDataArray = roomBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt phòng chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < roomBookingTotalQuarterRes.length; j++) {
                            const cityId = roomBookingTotalQuarterRes[j].city_id;
                            try {
                                const roomBookingOrderListRes = await getRoomBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!roomBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find room booking order list by quarter and city id"
                                    });
                                }
                                roomBookingOrderListRes.map((roomBookingOrder, key) => {
                                    roomBookingOrderDetailList.push(roomBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getRoomBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getRoomBookingTotalOfCityByQuarterTwoOrderByCaNamDesc!",
                            error: err
                        });
                    }
                }
            }
            if (sortWay === "asc") {
                if (limit === "five") {
                    // Quarter 2: -limit 5 - asc
                    try {
                        const roomBookingTotalQuarterRes = await getRoomBookingTotalOfCityByQuarterTwoOrderByCaNamAscAndLimit(5);
                        if (!roomBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find room booking by Quarter 2: -limit 5 - asc"
                            });
                        }
                        finalDataArray = roomBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt phòng chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < roomBookingTotalQuarterRes.length; j++) {
                            const cityId = roomBookingTotalQuarterRes[j].city_id;
                            try {
                                const roomBookingOrderListRes = await getRoomBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!roomBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find room booking order list by quarter and city id"
                                    });
                                }
                                roomBookingOrderListRes.map((roomBookingOrder, key) => {
                                    roomBookingOrderDetailList.push(roomBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getRoomBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getRoomBookingTotalOfCityByQuarterTwoOrderByCaNamAscAndLimit 5!",
                            error: err
                        });
                    }
                }
                if (limit === "ten") {
                    // Quarter 2: -limit 10 - asc
                    try {
                        const roomBookingTotalQuarterRes = await getRoomBookingTotalOfCityByQuarterTwoOrderByCaNamAscAndLimit(10);
                        if (!roomBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find room booking by Quarter 2: -limit 10 - asc"
                            });
                        }
                        finalDataArray = roomBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt phòng chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < roomBookingTotalQuarterRes.length; j++) {
                            const cityId = roomBookingTotalQuarterRes[j].city_id;
                            try {
                                const roomBookingOrderListRes = await getRoomBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!roomBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find room booking order list by quarter and city id"
                                    });
                                }
                                roomBookingOrderListRes.map((roomBookingOrder, key) => {
                                    roomBookingOrderDetailList.push(roomBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getRoomBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getRoomBookingTotalOfCityByQuarterTwoOrderByCaNamAscAndLimit 10!",
                            error: err
                        });
                    }
                }
                if (limit === "all") {
                    // Quarter 2: - no limit - asc
                    try {
                        const roomBookingTotalQuarterRes = await getRoomBookingTotalOfCityByQuarterTwoOrderByCaNamAsc();
                        if (!roomBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find room booking by Quarter 2: - no limit - asc"
                            });
                        }
                        finalDataArray = roomBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt phòng chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < roomBookingTotalQuarterRes.length; j++) {
                            const cityId = roomBookingTotalQuarterRes[j].city_id;
                            try {
                                const roomBookingOrderListRes = await getRoomBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!roomBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find room booking order list by quarter and city id"
                                    });
                                }
                                roomBookingOrderListRes.map((roomBookingOrder, key) => {
                                    roomBookingOrderDetailList.push(roomBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getRoomBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getRoomBookingTotalOfCityByQuarterTwoOrderByCaNamAsc!",
                            error: err
                        });
                    }
                }
            }
        }
        // Nếu là quý 3
        if (quarter === 3) {
            if (sortWay === "desc") {
                if (limit === "five") {
                    // Quarter 3: -limit 5 - desc
                    try {
                        const roomBookingTotalQuarterRes = await getRoomBookingTotalOfCityByQuarterThreeOrderByCaNamDescAndLimit(5);
                        if (!roomBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find room booking by Quarter 3: -limit 5 - desc"
                            });
                        }
                        finalDataArray = roomBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt phòng chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < roomBookingTotalQuarterRes.length; j++) {
                            const cityId = roomBookingTotalQuarterRes[j].city_id;
                            try {
                                const roomBookingOrderListRes = await getRoomBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!roomBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find room booking order list by quarter and city id"
                                    });
                                }
                                roomBookingOrderListRes.map((roomBookingOrder, key) => {
                                    roomBookingOrderDetailList.push(roomBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getRoomBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getRoomBookingTotalOfCityByQuarterThreeOrderByCaNamDescAndLimit 5!",
                            error: err
                        });
                    }
                }
                if (limit === "ten") {
                    // Quarter 3: -limit 10 - desc
                    try {
                        const roomBookingTotalQuarterRes = await getRoomBookingTotalOfCityByQuarterThreeOrderByCaNamDescAndLimit(10);
                        if (!roomBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find room booking by Quarter 3: -limit 10 - desc"
                            });
                        }
                        finalDataArray = roomBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt phòng chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < roomBookingTotalQuarterRes.length; j++) {
                            const cityId = roomBookingTotalQuarterRes[j].city_id;
                            try {
                                const roomBookingOrderListRes = await getRoomBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!roomBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find room booking order list by quarter and city id"
                                    });
                                }
                                roomBookingOrderListRes.map((roomBookingOrder, key) => {
                                    roomBookingOrderDetailList.push(roomBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getRoomBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getRoomBookingTotalOfCityByQuarterThreeOrderByCaNamDescAndLimit 10!",
                            error: err
                        });
                    }
                }
                if (limit === "all") {
                    // Quarter 3: - no limit - desc
                    try {
                        const roomBookingTotalQuarterRes = await getRoomBookingTotalOfCityByQuarterThreeOrderByCaNamDesc();
                        if (!roomBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find room booking by Quarter 3: - no limit - desc"
                            });
                        }
                        finalDataArray = roomBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt phòng chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < roomBookingTotalQuarterRes.length; j++) {
                            const cityId = roomBookingTotalQuarterRes[j].city_id;
                            try {
                                const roomBookingOrderListRes = await getRoomBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!roomBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find room booking order list by quarter and city id"
                                    });
                                }
                                roomBookingOrderListRes.map((roomBookingOrder, key) => {
                                    roomBookingOrderDetailList.push(roomBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getRoomBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getRoomBookingTotalOfCityByQuarterThreeOrderByCaNamDesc!",
                            error: err
                        });
                    }
                }
            }
            if (sortWay === "asc") {
                if (limit === "five") {
                    // Quarter 3: -limit 5 - asc
                    try {
                        const roomBookingTotalQuarterRes = await getRoomBookingTotalOfCityByQuarterThreeOrderByCaNamAscAndLimit(5);
                        if (!roomBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find room booking by Quarter 3: -limit 5 - asc"
                            });
                        }
                        finalDataArray = roomBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt phòng chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < roomBookingTotalQuarterRes.length; j++) {
                            const cityId = roomBookingTotalQuarterRes[j].city_id;
                            try {
                                const roomBookingOrderListRes = await getRoomBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!roomBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find room booking order list by quarter and city id"
                                    });
                                }
                                roomBookingOrderListRes.map((roomBookingOrder, key) => {
                                    roomBookingOrderDetailList.push(roomBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getRoomBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getRoomBookingTotalOfCityByQuarterThreeOrderByCaNamAscAndLimit 5!",
                            error: err
                        });
                    }
                }
                if (limit === "ten") {
                    // Quarter 3: -limit 10 - asc
                    try {
                        const roomBookingTotalQuarterRes = await getRoomBookingTotalOfCityByQuarterThreeOrderByCaNamAscAndLimit(10);
                        if (!roomBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find room booking by Quarter 3: -limit 10 - asc"
                            });
                        }
                        finalDataArray = roomBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt phòng chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < roomBookingTotalQuarterRes.length; j++) {
                            const cityId = roomBookingTotalQuarterRes[j].city_id;
                            try {
                                const roomBookingOrderListRes = await getRoomBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!roomBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find room booking order list by quarter and city id"
                                    });
                                }
                                roomBookingOrderListRes.map((roomBookingOrder, key) => {
                                    roomBookingOrderDetailList.push(roomBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getRoomBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getRoomBookingTotalOfCityByQuarterThreeOrderByCaNamAscAndLimit 10!",
                            error: err
                        });
                    }
                }
                if (limit === "all") {
                    // Quarter 3: - no limit - asc
                    try {
                        const roomBookingTotalQuarterRes = await getRoomBookingTotalOfCityByQuarterThreeOrderByCaNamAsc();
                        if (!roomBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find room booking by Quarter 3: - no limit - asc"
                            });
                        }
                        finalDataArray = roomBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt phòng chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < roomBookingTotalQuarterRes.length; j++) {
                            const cityId = roomBookingTotalQuarterRes[j].city_id;
                            try {
                                const roomBookingOrderListRes = await getRoomBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!roomBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find room booking order list by quarter and city id"
                                    });
                                }
                                roomBookingOrderListRes.map((roomBookingOrder, key) => {
                                    roomBookingOrderDetailList.push(roomBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getRoomBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getRoomBookingTotalOfCityByQuarterThreeOrderByCaNamAsc!",
                            error: err
                        });
                    }
                }
            }
        }

        // Lấy ngày hiện tại FORMAT: '2022-05-05 13:48:12' giống CSDL
        var todayCheckIn = new Date();
        var dateCheckIn = todayCheckIn.getFullYear() + '-' + (todayCheckIn.getMonth() + 1) + '-' + todayCheckIn.getDate();
        var timeCheckIn = todayCheckIn.getHours() + ":" + todayCheckIn.getMinutes() + ":" + todayCheckIn.getSeconds();
        var statisticDate = dateCheckIn + ' ' + timeCheckIn;

        var monthInQuarterArray = [];
        if (quarter === 1) {
            monthInQuarterArray = [1, 2, 3];
        } else if (quarter === 2) {
            monthInQuarterArray = [4, 5, 6];
        } else if (quarter === 3) {
            monthInQuarterArray = [7, 8, 9];
        } else {
            monthInQuarterArray = [10, 11, 12];
        }

        // Nếu là quý 4
        if (quarter === 4) {
            if (sortWay === "desc") {
                if (limit === "five") {
                    // Quarter 4: -limit 5 - desc
                    try {
                        const roomBookingTotalQuarterRes = await getRoomBookingTotalOfCityByQuarterFourOrderByCaNamDescAndLimit(5);
                        if (!roomBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find room booking by Quarter 3: -limit 5 - desc"
                            });
                        }
                        finalDataArray = roomBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt phòng chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < roomBookingTotalQuarterRes.length; j++) {
                            const cityId = roomBookingTotalQuarterRes[j].city_id;
                            try {
                                const roomBookingOrderListRes = await getRoomBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!roomBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find room booking order list by quarter and city id"
                                    });
                                }
                                roomBookingOrderListRes.map((roomBookingOrder, key) => {
                                    roomBookingOrderDetailList.push(roomBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getRoomBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getRoomBookingTotalOfCityByQuarterFourOrderByCaNamDescAndLimit 5!",
                            error: err
                        });
                    }
                }
                if (limit === "ten") {
                    // Quarter 4: -limit 10 - desc
                    try {
                        const roomBookingTotalQuarterRes = await getRoomBookingTotalOfCityByQuarterFourOrderByCaNamDescAndLimit(10);
                        if (!roomBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find room booking by Quarter 4: -limit 10 - desc"
                            });
                        }
                        finalDataArray = roomBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt phòng chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < roomBookingTotalQuarterRes.length; j++) {
                            const cityId = roomBookingTotalQuarterRes[j].city_id;
                            try {
                                const roomBookingOrderListRes = await getRoomBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!roomBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find room booking order list by quarter and city id"
                                    });
                                }
                                roomBookingOrderListRes.map((roomBookingOrder, key) => {
                                    roomBookingOrderDetailList.push(roomBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getRoomBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getRoomBookingTotalOfCityByQuarterFourOrderByCaNamDescAndLimit 10!",
                            error: err
                        });
                    }
                }
                if (limit === "all") {
                    // Quarter 4: - no limit - desc
                    try {
                        const roomBookingTotalQuarterRes = await getRoomBookingTotalOfCityByQuarterFourOrderByCaNamDesc();
                        if (!roomBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find room booking by Quarter 4: - no limit - desc"
                            });
                        }
                        finalDataArray = roomBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt phòng chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < roomBookingTotalQuarterRes.length; j++) {
                            const cityId = roomBookingTotalQuarterRes[j].city_id;
                            try {
                                const roomBookingOrderListRes = await getRoomBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!roomBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find room booking order list by quarter and city id"
                                    });
                                }
                                roomBookingOrderListRes.map((roomBookingOrder, key) => {
                                    roomBookingOrderDetailList.push(roomBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getRoomBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getRoomBookingTotalOfCityByQuarterFourOrderByCaNamDesc!",
                            error: err
                        });
                    }
                }
            }
            if (sortWay === "asc") {
                if (limit === "five") {
                    // Quarter 4: -limit 5 - asc
                    try {
                        const roomBookingTotalQuarterRes = await getRoomBookingTotalOfCityByQuarterFourOrderByCaNamAscAndLimit(5);
                        if (!roomBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find room booking by Quarter 4: -limit 5 - asc"
                            });
                        }
                        finalDataArray = roomBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt phòng chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < roomBookingTotalQuarterRes.length; j++) {
                            const cityId = roomBookingTotalQuarterRes[j].city_id;
                            try {
                                const roomBookingOrderListRes = await getRoomBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!roomBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find room booking order list by quarter and city id"
                                    });
                                }
                                roomBookingOrderListRes.map((roomBookingOrder, key) => {
                                    roomBookingOrderDetailList.push(roomBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getRoomBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getRoomBookingTotalOfCityByQuarterFourOrderByCaNamAscAndLimit 5!",
                            error: err
                        });
                    }
                }
                if (limit === "ten") {
                    // Quarter 4: -limit 10 - asc
                    try {
                        const roomBookingTotalQuarterRes = await getRoomBookingTotalOfCityByQuarterFourOrderByCaNamAscAndLimit(10);
                        if (!roomBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find room booking by Quarter 4: -limit 10 - asc"
                            });
                        }
                        finalDataArray = roomBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt phòng chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < roomBookingTotalQuarterRes.length; j++) {
                            const cityId = roomBookingTotalQuarterRes[j].city_id;
                            try {
                                const roomBookingOrderListRes = await getRoomBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!roomBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find room booking order list by quarter and city id"
                                    });
                                }
                                roomBookingOrderListRes.map((roomBookingOrder, key) => {
                                    roomBookingOrderDetailList.push(roomBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getRoomBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getRoomBookingTotalOfCityByQuarterFourOrderByCaNamAscAndLimit 10!",
                            error: err
                        });
                    }
                }
                if (limit === "all") {
                    // Quarter 4: - no limit - asc
                    try {
                        const roomBookingTotalQuarterRes = await getRoomBookingTotalOfCityByQuarterFourOrderByCaNamAsc();
                        if (!roomBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find room booking by Quarter 4: - no limit - asc"
                            });
                        }
                        finalDataArray = roomBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt phòng chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < roomBookingTotalQuarterRes.length; j++) {
                            const cityId = roomBookingTotalQuarterRes[j].city_id;
                            try {
                                const roomBookingOrderListRes = await getRoomBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!roomBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find room booking order list by quarter and city id"
                                    });
                                }
                                roomBookingOrderListRes.map((roomBookingOrder, key) => {
                                    roomBookingOrderDetailList.push(roomBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getRoomBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getRoomBookingTotalOfCityByQuarterFourOrderByCaNamAsc!",
                            error: err
                        });
                    }
                }
            }
        }
        // Success
        return res.status(200).json({
            status: "success",
            message: "Thống kê doanh thu theo tháng của Thành phố thành công!",
            data: {
                statisticDate: statisticDate,
                quarter: quarter,
                sortWay: sortWay,
                limit: limit,
                data: finalDataArray,
                monthArray: monthInQuarterArray,
                roomBookingOrderDetailList: roomBookingOrderDetailList
            }
        });
    },
};