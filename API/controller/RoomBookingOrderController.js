const { getCustomerByCustomerId, findCustomerByEmailOrPhoneNumber, findCustomerInRoomBookingOrder } = require("../service/CustomerService");
const { updateDiscountState } = require("../service/DiscountService");
const { createRoomBookingDetail, getRoomBookingDetailByRoomBookingOrderId, updateRoomBookingDetailKeyWhenCheckOutSuccess } = require("../service/RoomBookingDetailService");
const { createRoomBookingOrder, findRoomBookingOrder, getRoomBookingsAndDetail, getQuantityRoomBookings, findRoomBookingByIdOrCustomerEmailOrCustomerPhoneOrCustomerNameOrRoomName, findRoomBookingById, findRoomBookingOrderByIdCheckIn, updateRoomBookingOrderInfoWhenCheckInSuccess, updateRoomBookingOrderState, updateRoomBookingOrderFinishDateWhenCheckOutSuccess, getRoomBookingTotalByDate, getDistinctDateInRoomBookingOrderFromDateToDate, getRoomBookingTotalByMonth, getLimitRoomBookingTotalOfCityForEachQuarter, getRoomBookingOrderByCityId, getRoomBookingTotalOfCityByDateAndLimitAsc, getRoomBookingTotalOfCityByDateAndAsc, getRoomBookingTotalOfCityByDateAndLimitDesc, getRoomBookingTotalOfCityByDateAndDesc, getRoomBookingTotalOfCityByMonthAndLimitAsc, getRoomBookingTotalOfCityByMonthAndAsc, getRoomBookingTotalOfCityByMonthAndDesc, getRoomBookingTotalOfCityByMonthAndLimitDesc, getRoomBookingTotalOfCityByQuarter1AnCityId, getRoomBookingTotalOfCityByQuarter2AnCityId, getRoomBookingTotalOfCityByQuarter3AnCityId, getRoomBookingTotalOfCityByQuarter4AnCityId, getRoomBookingTotalOfCityByQuarterOneOrderByCaNamDescAndLimit, getRoomBookingTotalOfCityByQuarterOneOrderByCaNamDesc, getRoomBookingTotalOfCityByQuarterOneOrderByCaNamAscAndLimit, getRoomBookingTotalOfCityByQuarterOneOrderByCaNamAsc, getRoomBookingTotalOfCityByQuarterTwoOrderByCaNamDescAndLimit, getRoomBookingTotalOfCityByQuarterTwoOrderByCaNamDesc, getRoomBookingTotalOfCityByQuarterTwoOrderByCaNamAscAndLimit, getRoomBookingTotalOfCityByQuarterTwoOrderByCaNamAsc, getRoomBookingTotalOfCityByQuarterThreeOrderByCaNamDescAndLimit, getRoomBookingTotalOfCityByQuarterThreeOrderByCaNamDesc, getRoomBookingTotalOfCityByQuarterThreeOrderByCaNamAscAndLimit, getRoomBookingTotalOfCityByQuarterThreeOrderByCaNamAsc, getRoomBookingTotalOfCityByQuarterFourOrderByCaNamDescAndLimit, getRoomBookingTotalOfCityByQuarterFourOrderByCaNamDesc, getRoomBookingTotalOfCityByQuarterFourOrderByCaNamAscAndLimit, getRoomBookingTotalOfCityByQuarterFourOrderByCaNamAsc, getRoomBookingTotalOfCityByDateByListDate, getRoomBookingTotalOfCityByDateByListDateNoLimit, getRoomBookingOrderByDate, getRoomBookingOrderByQuarterAndCityId, getRoomBookingOrderFromDateToDate, getRoomBookingOrderOfQuarter, getRoomBookingTotalOfTypeByQuarterOneOrderByCaNamDesc, getRoomBookingOrderByQuarterAndRoomTypeName, getRoomBookingTotalOfTypeByQuarterOneOrderByCaNamAsc, getRoomBookingTotalOfTypeByQuarterTwoOrderByCaNamDesc, getRoomBookingTotalOfTypeByQuarterTwoOrderByCaNamAsc, getRoomBookingTotalOfTypeByQuarterThreeOrderByCaNamDesc, getRoomBookingTotalOfTypeByQuarterThreeOrderByCaNamAsc, getRoomBookingTotalOfTypeByQuarterFourOrderByCaNamDesc, getRoomBookingTotalOfTypeByQuarterFourOrderByCaNamAsc, getRoomBookingTotalOfTypeByQuarterOneOrderByCaNam, getRoomBookingTotalOfTypeByQuarterTwoOrderByCaNam, getRoomBookingTotalOfTypeByQuarterThreeOrderByCaNam, getRoomBookingTotalOfTypeByQuarterFourOrderByCaNam, getRoomBookingTotalOfTypeByDate, getRoomBookingOrderByDateAndRoomTypeName, getRoomBookingTotalOfTypeByDateByListDate, getRoomBookingTotalOfCustomerByQuarterOneOrderByCaNam, getRoomBookingOrderByQuarterAndCustomerId, getRoomBookingTotalOfCustomerByQuarterTwoOrderByCaNam, getRoomBookingTotalOfCustomerByQuarterThreeOrderByCaNam, getRoomBookingTotalOfCustomerByQuarterFourOrderByCaNam, getRoomBookingTotalOfCustomerByDate, getRoomBookingOrderByDateAndCustomerId, getRoomBookingTotalOfCustomerByDateByListDate } = require("../service/RoomBookingOrderService");
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

        // L???y ng??y hi???n t???i FORMAT: '2022-05-05 13:48:12' gi???ng CSDL
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var roomBookingOrderBookDate = date + ' ' + time;

        if (!roomBookingOrderBookDate) {
            return res.status(404).json({
                status: "fail",
                message: "Bookdate kh??ng h???p l???!"
            });
        }
        if (!roomBookingOrderPrice || !Number.isInteger(roomBookingOrderPrice) || roomBookingOrderPrice <= 0) {
            return res.status(404).json({
                status: "fail",
                message: "Book price kh??ng h???p l???!"
            });
        }
        if (roomBookingOrderSurcharge === null) {
            return res.status(404).json({
                status: "fail",
                message: "Book surcharge kh??ng h???p l???!"
            });
        }
        if (!roomBookingOrderTotal || !Number.isInteger(roomBookingOrderTotal) || roomBookingOrderTotal <= 0) {
            return res.status(404).json({
                status: "fail",
                message: "Book total kh??ng h???p l???!"
            });
        }
        if (!customerId || !Number.isInteger(customerId) || customerId <= 0) {
            return res.status(404).json({
                status: "fail",
                message: "Customer id kh??ng h???p l???!"
            });
        }
        if (discountId === null) {
            return res.status(404).json({
                status: "fail",
                message: "Discount id kh??ng h???p l???!"
            });
        }
        if (!checkinDate) {
            return res.status(404).json({
                status: "fail",
                message: "Ng??y check in kh??ng h???p l???!"
            });
        }
        if (!checkoutDate) {
            return res.status(404).json({
                status: "fail",
                message: "Ng??y check out kh??ng h???p l???!"
            });
        }
        if (!roomId || !Number.isInteger(roomId) || roomId <= 0) {
            return res.status(404).json({
                status: "fail",
                message: "Room id kh??ng h???p l???!"
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
                                            noidung += '<div><p>C???m ??n b???n ???? tin t?????ng v?? ?????t ph??ng t???i <font color="#41f1b6"><b>Ho??ng Long Hotel &amp; Restaurant</b></font> v???i m?? ?????t ph??ng: ' + roomBookingOrderId + '</p></div>';
                                            noidung += '<p><b>Kh??ch h??ng:</b> ' + customerName + '<br /><b>Email:</b> ' + customerEmail + '<br /><b>??i???n tho???i:</b> ' + customerPhoneNumber + '<br />';

                                            // M?? KEY c???a ph??ng
                                            noidung += '<p align="justify"><b>Qu?? kh??ch c?? th??? d??ng M?? ph??ng & M?? KEY sau ????? ti???n h??nh ?????t m??n ??n online</b></p>';
                                            noidung += ' <table border="1px" cellpadding="10px" cellspacing="1px"width="100%"><tr><td align="center" bgcolor="#41f1b6"><fontcolor="white"><b>M?? PH??NG C???A B???N</b></fontcolor=></td><td align="center" bgcolor="#41f1b6"><fontcolor="white"><b>M?? KEY C???A B???N</b></fontcolor=></td></tr>';
                                            noidung += '<tr><td class="prd-total"><b><font color="#41f1b6">' + roomId + '</font></b></td><td class="prd-total"><b><font color="#41f1b6">' + key + '</font></b></td></tr></table><br />';

                                            // Danh s??ch S???n ph???m ???? mua
                                            noidung += ' <table border="1px" cellpadding="10px" cellspacing="1px"width="100%"><tr><td align="center" bgcolor="#41f1b6" colspan="4"><fontcolor="white"><b>????N ?????T PH??NG C???A B???N</b></fontcolor=></td></tr><tr id="invoice-bar"><td width="45%"><b>Lo???i ph??ng</b></td><td width="20%"><b>S??? ph??ng</b></td><td width="15%"><b>S??? l?????ng</b></td><td width="20%"><b>Gi?? ti???n</b></td></tr>';

                                            noidung += '<tr><td class="prd-name">' + roomTypeName + '</td><td class="prd-price"><font color="#41f1b6">' + roomName + '</font></td><td class="prd-number">' + "1 Ph??ng" + '</td><td class="prd-total"><font color="#41f1b6">' + format_money(roomPrice) + ' VN??</font></td></tr>';

                                            noidung += '<tr><td class="prd-name">T???ng ti???n:</td><td colspan="2"></td><td class="prd-total"><b><font color="#41f1b6">' + format_money(roomBookingOrderTotal) + ' VN??</font></b></td></tr></table>';
                                            noidung += '<p align="justify"><b>Qu?? kh??ch ???? ?????t ph??ng th??nh c??ng!</b><br />??? Th???i gian check-in nh???n ph??ng l?? 14:00 AM, th???i gian tr??? ph??ng l?? 12:00 AM.<br/>??? Qu?? kh??ch vui l??ng l??u ?? th???i gian tr??n ????? qu?? tr??nh nh???n ph??ng/ tr??? ph??ng ???????c thu???n ti???n.<br /><b><br />C??m ??n Qu?? kh??ch ???? l???a ch???n d???ch v??? c???a ch??ng t??i!</b></p>';
                                            // ----- Mailer Option -----
                                            var mailOptions = {
                                                from: 'Ho??ng Long Hotel &amp; Restaurant',
                                                to: customerEmail,
                                                subject: '?????t ph??ng t???i Ho??ng Long th??nh c??ng!',
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

    // ADMIN: Qu???n l?? ?????t ph??ng
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
                message: "L???y room bookings th??nh c??ng",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "L???i getRoomBookingsAndDetail",
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
                message: "L???y quantity room bookings th??nh c??ng",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "L???i getQuantityRoomBookings",
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
                message: "T??m room bookings th??nh c??ng",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "L???i findRoomBookingByIdOrCustomerEmailOrCustomerPhoneOrCustomerNameOrRoomName",
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
                message: "T??m room bookings th??nh c??ng",
                data: result
            });
        } catch (err) {
            console.log("ERR: ", err);
            return res.status(400).json({
                status: "fail",
                message: "L???i findRoomBookingById",
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
                message: "H??? c???a kh??ch h??ng kh??ng h???p l???!"
            });
        }
        if (!customerLastName) {
            return res.status(400).json({
                status: "fail",
                message: "T??n c???a kh??ch h??ng kh??ng h???p l???!"
            });
        }
        if (!customerEmail) {
            return res.status(400).json({
                status: "fail",
                message: "Email c???a kh??ch h??ng kh??ng h???p l???!"
            });
        }
        if (!customerPhoneNumber) {
            return res.status(400).json({
                status: "fail",
                message: "S??? ??i???n tho???i c???a kh??ch h??ng kh??ng h???p l???!"
            });
        }
        if (!roomBookingOrderIdentityCard) {
            return res.status(400).json({
                status: "fail",
                message: "S??? ch???ng minh th?? c???a kh??ch h??ng kh??ng h???p l???!"
            });
        }
        if (!roomBookingOrderNation) {
            return res.status(400).json({
                status: "fail",
                message: "Qu???c t???ch c???a kh??ch h??ng kh??ng h???p l???!"
            });
        }
        if (!roomBookingOrderAddress) {
            return res.status(400).json({
                status: "fail",
                message: "?????a ch??? c???a kh??ch h??ng kh??ng h???p l???!"
            });
        }
        if (!roomBookingOrderWardId || roomBookingOrderWardId === '' || roomBookingOrderWardId === undefined || roomBookingOrderWardId === null) {
            return res.status(400).json({
                status: "fail",
                message: "M?? X?? ph?????ng c???a kh??ch h??ng kh??ng h???p l???!"
            });
        }
        if (!roomBookingOrderId || !Number.isInteger(roomBookingOrderId) || roomBookingOrderId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "M?? ?????t ph??ng kh??ng h???p l???!"
            });
        }
        // T??m kh??ch h??ng
        try {
            const customerRes = await findCustomerByEmailOrPhoneNumber(customerEmail);
            if (!customerRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record customer not found"
                });
            }
            // Ki???m tra t??n ng?????i d??ng nh???p v??o
            const customerIdRes = customerRes.customer_id;
            const customerFirstNameRes = customerRes.customer_first_name;
            const customerLastNameRes = customerRes.customer_last_name;
            if (customerFirstNameRes !== customerFirstName && customerLastNameRes !== customerLastName) {
                return res.status(400).json({
                    status: "fail",
                    message: "H??? t??n kh??ng ????ng v???i email/ SDT ???? ?????t ph??ng!"
                });
            }
            // T??m room booking order
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
                        message: "????n ?????t n??y ???? Check in ho???c ???? ho??n th??nh r???i!"
                    });
                }
                // Ki???m tra ng?????i d??ng ph???i ng?????i ???? ?????t ph??ng n??y kh??ng?
                const customerIdInRoomBookingOrder = roomBookingOrderRes.customer_id;
                if (customerIdRes !== customerIdInRoomBookingOrder) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Ph??ng kh??ng ???????c ?????t b???i kh??ch h??ng n??y!"
                    });
                }
                // Ki???m tra ng??y check in xem ph???i ng??y mu???n check in kh??ng?
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

                    // So s??nh ng??y
                    var today = new Date();
                    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + (today.getDate() + 1);
                    var checkInDate = new Date(date);
                    checkInDate.setHours(-17, 0, 0, 0);
                    console.log("checkInDate > dateCheckinRes: ", checkInDate > dateCheckinRes, checkInDate, dateCheckinRes)
                    if (checkInDate < dateCheckinRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Kh??ng th??? check in tr?????c ng??y " + roomBookingDetailRes.room_booking_detail_checkin_date
                        });
                    }
                    if (checkInDate > dateCheckoutRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Ng??y Check in ???? qu?? ng??y Check out: " + roomBookingDetailRes.room_booking_detail_checkout_date
                        });
                    }
                    // T??m X?? ph?????ng c?? t???n t???i kh??ng
                    try {
                        const wardRes = await getWardByWardId(roomBookingOrderWardId);
                        if (!wardRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find ward"
                            });
                        }
                        // C???p nh???t s??? cmnd v?? qu???c t???ch v?? ng??y b???t ?????u nh???n ph??ng
                        // L???y ng??y hi???n t???i FORMAT: '2022-05-05 13:48:12' gi???ng CSDL
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
                            // C???p nh???t state
                            try {
                                const updateStateRes = await updateRoomBookingOrderState(1, roomBookingOrderId);
                                if (!updateStateRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't update room booking state when check in success"
                                    });
                                }

                                createLogAdmin(req, res, " v???a Check in cho ????n ?????t ph??ng c?? m??: " + roomBookingOrderId, "UPDATE").then(() => {
                                    // Success
                                    return res.status(200).json({
                                        status: "success",
                                        message: "Check in th??nh c??ng!"
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
                message: "M?? ?????t ph??ng kh??ng h???p l???!"
            });
        }
        // T??m room booking order xem c?? kh??ng
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
                    message: "????n ?????t n??y ch??a Check in ho???c ???? ho??n th??nh r???i!"
                });
            }
            // Ki???m tra ng??y check in xem ph???i ng??y mu???n check in kh??ng?
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

                // So s??nh ng??y
                var today = new Date();
                var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + (today.getDate() + 1);
                var checkOutDate = new Date(date);
                checkOutDate.setHours(-17, 0, 0, 0);

                console.log("checkOutDate > dateCheckinRes: ", checkOutDate > dateCheckoutRes, checkOutDate, dateCheckoutRes)
                if (checkOutDate < dateCheckinRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Kh??ng th??? check out tr?????c ng??y " + roomBookingDetailRes.room_booking_detail_checkin_date
                    });
                }
                if (checkOutDate > dateCheckoutRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "???? qu?? ng??y Check out: " + roomBookingDetailRes.room_booking_detail_checkout_date
                    });
                }

                // C???p nh???t ng??y ho??n th??nh check out: finish date
                // L???y ng??y hi???n t???i FORMAT: '2022-05-05 13:48:12' gi???ng CSDL
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

                    // C???p nh???t key trong detail th??nh null => ????? ng?????i d??ng kh??ng ?????t ???????c n???a khi ???? check out!
                    try {
                        const updateDetailKeyRes = await updateRoomBookingDetailKeyWhenCheckOutSuccess(null, roomBookingDetailId);
                        if (!updateDetailKeyRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't update room booking detail key when check out success"
                            });
                        }
                        // C???p nh???t state
                        try {
                            const updateStateRes = await updateRoomBookingOrderState(2, roomBookingOrderId);
                            if (!updateStateRes) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Cann't update room booking state when check out success"
                                });
                            }

                            createLogAdmin(req, res, " v???a Check out cho ????n ?????t ph??ng c?? m??: " + roomBookingOrderId, "UPDATE").then(() => {
                                // Success
                                return res.status(200).json({
                                    status: "success",
                                    message: "Check out th??nh c??ng!"
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

    // Admin: Qu???n l?? ?????t ph??ng - Th???ng k?? doanh thu
    getStatisticRoomBookingTotalByDate: async (req, res) => {
        const dateFrom = req.body.dateFrom;
        const dateTo = req.body.dateTo;
        const sortWay = req.body.sortWay;
        if (!dateFrom) {
            return res.status(400).json({
                status: "fail",
                message: "Ng??y b???t ?????u th???ng k?? kh??ng h???p l???!"
            });
        }
        if (!dateTo) {
            return res.status(400).json({
                status: "fail",
                message: "Ng??y k???t th??c th???ng k?? kh??ng h???p l???!"
            });
        }
        if (!sortWay) {
            return res.status(400).json({
                status: "fail",
                message: "C??ch s???p x???p kh??ng h???p l???!"
            });
        }
        // L???y ng??y trong room booking t??? dateFrom ?????n dateTo
        try {
            const fromDateToDateListRes = await getDistinctDateInRoomBookingOrderFromDateToDate(dateFrom, dateTo);
            if (!fromDateToDateListRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't get date list"
                });
            }

            let finalArray = [];
            // L???y ng??y hi???n t???i FORMAT: '2022-05-05 13:48:12' gi???ng CSDL
            var todayCheckIn = new Date();
            var dateCheckIn = todayCheckIn.getFullYear() + '-' + (todayCheckIn.getMonth() + 1) + '-' + todayCheckIn.getDate();
            var timeCheckIn = todayCheckIn.getHours() + ":" + todayCheckIn.getMinutes() + ":" + todayCheckIn.getSeconds();
            var statisticDate = dateCheckIn + ' ' + timeCheckIn;

            for (var i = 0; i < fromDateToDateListRes.length; i++) {
                const date = fromDateToDateListRes[i].finishDate;
                // L???y doanh thu theo ng??y
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
            // L???y danh s??ch ?????t ph??ng chi ti???t
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
                message: "Th???ng k?? doanh thu theo ng??y th??nh c??ng!",
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
    // Admin: Qu???n l?? ?????t ph??ng - Th???ng k?? doanh thu
    getStatisticRoomBookingTotalByQuarter: async (req, res) => {
        const quarter = req.body.quarter;
        const sortWay = req.body.sortWay;
        if (!quarter || !Number.isInteger(quarter) || quarter >= 5 || quarter < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Qu?? th???ng k?? kh??ng h???p l???!"
            });
        }
        if (!sortWay) {
            return res.status(400).json({
                status: "fail",
                message: "C??ch s???p x???p kh??ng h???p l???!"
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
        // L???y ng??y hi???n t???i FORMAT: '2022-05-05 13:48:12' gi???ng CSDL
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var statisticDate = date + ' ' + time;

        for (var i = 0; i < monthInQuarterArray.length; i++) {
            const month = monthInQuarterArray[i];
            // L???y doanh thu theo th??ng
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
        // L???y danh s??ch ?????t ph??ng chi ti???t
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
            message: "Th???ng k?? doanh thu theo Th??ng trong Qu?? th??nh c??ng!",
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
    // Admin: Qu???n l?? ?????t ph??ng - Th???ng k?? doanh thu Theo th??nh ph???
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
            // L???y ng??y hi???n t???i FORMAT: '2022-05-05 13:48:12' gi???ng CSDL
            var todayCheckIn = new Date();
            var dateCheckIn = todayCheckIn.getFullYear() + '-' + (todayCheckIn.getMonth() + 1) + '-' + todayCheckIn.getDate();
            var timeCheckIn = todayCheckIn.getHours() + ":" + todayCheckIn.getMinutes() + ":" + todayCheckIn.getSeconds();
            var statisticDate = dateCheckIn + ' ' + timeCheckIn;

            for (var i = 0; i < roomBookingTotalOfCityForEachQuarterRes.length; i++) {
                const cityId = roomBookingTotalOfCityForEachQuarterRes[i].city_id;
                const cityName = roomBookingTotalOfCityForEachQuarterRes[i].city_name;
                // L???y ????n ?????t ph??ng cho t???ng city id
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
                message: "Th???ng k?? doanh thu theo Th??nh ph??? c???a 4 qu?? th??nh c??ng!",
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
    // Admin: Qu???n l?? ?????t ph??ng - Th???ng k?? doanh thu Theo th??nh ph???
    getStatisticRoomBookingTotalOfCityByDate: async (req, res) => {
        const dateFrom = req.body.dateFrom;
        const dateTo = req.body.dateTo;
        const sortWay = req.body.sortWay;
        const limit = req.body.limit;
        if (!dateFrom) {
            return res.status(400).json({
                status: "fail",
                message: "Ng??y b???t ?????u th???ng k?? kh??ng h???p l???!"
            });
        }
        if (!dateTo) {
            return res.status(400).json({
                status: "fail",
                message: "Ng??y k???t th??c th???ng k?? kh??ng h???p l???!"
            });
        }
        if (!sortWay) {
            return res.status(400).json({
                status: "fail",
                message: "C??ch s???p x???p kh??ng h???p l???!"
            });
        }
        if (!limit || limit !== 'five' && limit !== 'ten' && limit !== 'all') {
            return res.status(400).json({
                status: "fail",
                message: "B???n ch??a gi???i h???n s??? l?????ng t??m ki???m!"
            });
        }
        // L???y ng??y trong room booking t??? dateFrom ?????n dateTo
        try {
            const fromDateToDateListRes = await getDistinctDateInRoomBookingOrderFromDateToDate(dateFrom, dateTo);
            if (!fromDateToDateListRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't get date list"
                });
            }

            let finalArray = [];
            // L???y ng??y hi???n t???i FORMAT: '2022-05-05 13:48:12' gi???ng CSDL
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
                            // L???y ????n ?????t ph??ng cho t???ng Ng??y
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
                            // L???y ????n ?????t ph??ng cho t???ng Ng??y
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
                            // L???y ????n ?????t ph??ng cho t???ng Ng??y
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
                            // L???y ????n ?????t ph??ng cho t???ng Ng??y
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
                            // L???y ????n ?????t ph??ng cho t???ng Ng??y
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
                            // L???y ????n ?????t ph??ng cho t???ng Ng??y
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

            // L???y data ????? hi???n bi???u ?????
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
                message: "Th???ng k?? doanh thu theo ng??y c???a Th??nh ph??? th??nh c??ng!",
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

    // Admin: Qu???n l?? ?????t ph??ng - Th???ng k?? doanh thu Theo th??nh ph???
    getStatisticRoomBookingTotalOfCityByQuarter: async (req, res) => {
        const quarter = req.body.quarter;
        const sortWay = req.body.sortWay;
        const limit = req.body.limit;
        if (!quarter || !Number.isInteger(quarter) || quarter >= 5 || quarter < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Qu?? th???ng k?? kh??ng h???p l???!"
            });
        }
        if (!sortWay) {
            return res.status(400).json({
                status: "fail",
                message: "C??ch s???p x???p kh??ng h???p l???!"
            });
        }
        if (!limit || limit !== 'five' && limit !== 'ten' && limit !== 'all') {
            return res.status(400).json({
                status: "fail",
                message: "B???n ch??a gi???i h???n s??? l?????ng t??m ki???m!"
            });
        }
        let finalDataArray = {};
        let roomBookingOrderDetailList = [];
        // N???u l?? qu?? 1
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
                        // L???y danh s??ch ????n ?????t ph??ng chi ti???t cho t???ng city thu???c qu?? ????
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
                        // L???y danh s??ch ????n ?????t ph??ng chi ti???t cho t???ng city thu???c qu?? ????
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
                        // L???y danh s??ch ????n ?????t ph??ng chi ti???t cho t???ng city thu???c qu?? ????
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
                        // L???y danh s??ch ????n ?????t ph??ng chi ti???t cho t???ng city thu???c qu?? ????
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
                        // L???y danh s??ch ????n ?????t ph??ng chi ti???t cho t???ng city thu???c qu?? ????
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
                        // L???y danh s??ch ????n ?????t ph??ng chi ti???t cho t???ng city thu???c qu?? ????
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
        // N???u l?? qu?? 2
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
                        // L???y danh s??ch ????n ?????t ph??ng chi ti???t cho t???ng city thu???c qu?? ????
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
                        // L???y danh s??ch ????n ?????t ph??ng chi ti???t cho t???ng city thu???c qu?? ????
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
                        // L???y danh s??ch ????n ?????t ph??ng chi ti???t cho t???ng city thu???c qu?? ????
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
                        // L???y danh s??ch ????n ?????t ph??ng chi ti???t cho t???ng city thu???c qu?? ????
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
                        // L???y danh s??ch ????n ?????t ph??ng chi ti???t cho t???ng city thu???c qu?? ????
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
                        // L???y danh s??ch ????n ?????t ph??ng chi ti???t cho t???ng city thu???c qu?? ????
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
        // N???u l?? qu?? 3
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
                        // L???y danh s??ch ????n ?????t ph??ng chi ti???t cho t???ng city thu???c qu?? ????
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
                        // L???y danh s??ch ????n ?????t ph??ng chi ti???t cho t???ng city thu???c qu?? ????
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
                        // L???y danh s??ch ????n ?????t ph??ng chi ti???t cho t???ng city thu???c qu?? ????
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
                        // L???y danh s??ch ????n ?????t ph??ng chi ti???t cho t???ng city thu???c qu?? ????
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
                        // L???y danh s??ch ????n ?????t ph??ng chi ti???t cho t???ng city thu???c qu?? ????
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
                        // L???y danh s??ch ????n ?????t ph??ng chi ti???t cho t???ng city thu???c qu?? ????
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

        // L???y ng??y hi???n t???i FORMAT: '2022-05-05 13:48:12' gi???ng CSDL
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

        // N???u l?? qu?? 4
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
                        // L???y danh s??ch ????n ?????t ph??ng chi ti???t cho t???ng city thu???c qu?? ????
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
                        // L???y danh s??ch ????n ?????t ph??ng chi ti???t cho t???ng city thu???c qu?? ????
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
                        // L???y danh s??ch ????n ?????t ph??ng chi ti???t cho t???ng city thu???c qu?? ????
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
                        // L???y danh s??ch ????n ?????t ph??ng chi ti???t cho t???ng city thu???c qu?? ????
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
                        // L???y danh s??ch ????n ?????t ph??ng chi ti???t cho t???ng city thu???c qu?? ????
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
                        // L???y danh s??ch ????n ?????t ph??ng chi ti???t cho t???ng city thu???c qu?? ????
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
            message: "Th???ng k?? doanh thu theo th??ng c???a Th??nh ph??? th??nh c??ng!",
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

    // -------------------------------------------- TH???NG K?? LO???I PH??NG --------------------------------------------
    // Admin: Qu???n l?? ?????t ph??ng - Th???ng k?? doanh thu Theo Lo???i
    getStatisticRoomBookingTotalOfTypeByQuarter: async (req, res) => {
        const quarter = req.body.quarter;
        const sortWay = req.body.sortWay;
        const roomTypeList = req.body.roomTypeList;
        if (!quarter || !Number.isInteger(quarter) || quarter >= 5 || quarter < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Qu?? th???ng k?? kh??ng h???p l???!"
            });
        }
        if (!sortWay) {
            return res.status(400).json({
                status: "fail",
                message: "C??ch s???p x???p kh??ng h???p l???!"
            });
        }
        if (!roomTypeList) {
            return res.status(400).json({
                status: "fail",
                message: "Lo???i ph??ng kh??ng h???p l???!"
            });
        }
        let finalDataArray = [];
        // N???u l?? qu?? 1
        if (quarter === 1) {
            // Quarter 1:
            for (var k = 0; k < roomTypeList.length; k++) {
                const roomTypeName = roomTypeList[k];
                // L???y th???ng k?? doanh thu c???a Lo???i ph??ng theo qu??
                try {
                    const roomBookingTotalQuarterRes = await getRoomBookingTotalOfTypeByQuarterOneOrderByCaNam(roomTypeName);
                    if (!roomBookingTotalQuarterRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't find room booking by Quarter 1"
                        });
                    }
                    // L???y danh s??ch ????n ?????t ph??ng chi ti???t cho t???ng Lo???i ph??ng thu???c qu?? ???? 
                    try {
                        const roomBookingOrderListRes = await getRoomBookingOrderByQuarterAndRoomTypeName(quarter, roomTypeName);
                        if (!roomBookingOrderListRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find room booking order list by quarter and room type name"
                            });
                        }
                        finalDataArray.push({
                            roomTypeName: roomTypeName,
                            totalData: roomBookingTotalQuarterRes,
                            roomBookingOrderList: roomBookingOrderListRes
                        });
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getRoomBookingOrderByQuarterAndRoomTypeName!",
                            error: err
                        });
                    }
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when getRoomBookingTotalOfTypeByQuarterOneOrderByCaNam!",
                        error: err
                    });
                }
            }
        }
        // N???u l?? qu?? 2
        if (quarter === 2) {
            // Quarter 2:
            for (var k = 0; k < roomTypeList.length; k++) {
                const roomTypeName = roomTypeList[k];
                // L???y th???ng k?? doanh thu c???a Lo???i ph??ng theo qu??
                try {
                    const roomBookingTotalQuarterRes = await getRoomBookingTotalOfTypeByQuarterTwoOrderByCaNam(roomTypeName);
                    if (!roomBookingTotalQuarterRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't find room booking by Quarter 2"
                        });
                    }
                    // L???y danh s??ch ????n ?????t ph??ng chi ti???t cho t???ng Lo???i ph??ng thu???c qu?? ???? 
                    try {
                        const roomBookingOrderListRes = await getRoomBookingOrderByQuarterAndRoomTypeName(quarter, roomTypeName);
                        if (!roomBookingOrderListRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find room booking order list by quarter and room type name"
                            });
                        }
                        finalDataArray.push({
                            roomTypeName: roomTypeName,
                            totalData: roomBookingTotalQuarterRes,
                            roomBookingOrderList: roomBookingOrderListRes
                        });
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getRoomBookingOrderByQuarterAndRoomTypeName!",
                            error: err
                        });
                    }
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when getRoomBookingTotalOfTypeByQuarterTwoOrderByCaNam!",
                        error: err
                    });
                }
            }
        }
        // N???u l?? qu?? 3
        if (quarter === 3) {
            // Quarter 3:
            for (var k = 0; k < roomTypeList.length; k++) {
                const roomTypeName = roomTypeList[k];
                // L???y th???ng k?? doanh thu c???a Lo???i ph??ng theo qu??
                try {
                    const roomBookingTotalQuarterRes = await getRoomBookingTotalOfTypeByQuarterThreeOrderByCaNam(roomTypeName);
                    if (!roomBookingTotalQuarterRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't find room booking by Quarter 3"
                        });
                    }
                    // L???y danh s??ch ????n ?????t ph??ng chi ti???t cho t???ng Lo???i ph??ng thu???c qu?? ???? 
                    try {
                        const roomBookingOrderListRes = await getRoomBookingOrderByQuarterAndRoomTypeName(quarter, roomTypeName);
                        if (!roomBookingOrderListRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find room booking order list by quarter and room type name"
                            });
                        }
                        finalDataArray.push({
                            roomTypeName: roomTypeName,
                            totalData: roomBookingTotalQuarterRes,
                            roomBookingOrderList: roomBookingOrderListRes
                        });
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getRoomBookingOrderByQuarterAndRoomTypeName!",
                            error: err
                        });
                    }
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when getRoomBookingTotalOfTypeByQuarterThreeOrderByCaNam!",
                        error: err
                    });
                }
            }
        }
        // N???u l?? qu?? 4
        if (quarter === 4) {
            // Quarter 4:
            for (var k = 0; k < roomTypeList.length; k++) {
                const roomTypeName = roomTypeList[k];
                // L???y th???ng k?? doanh thu c???a Lo???i ph??ng theo qu??
                try {
                    const roomBookingTotalQuarterRes = await getRoomBookingTotalOfTypeByQuarterFourOrderByCaNam(roomTypeName);
                    if (!roomBookingTotalQuarterRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't find room booking by Quarter 1"
                        });
                    }
                    // L???y danh s??ch ????n ?????t ph??ng chi ti???t cho t???ng Lo???i ph??ng thu???c qu?? ???? 
                    try {
                        const roomBookingOrderListRes = await getRoomBookingOrderByQuarterAndRoomTypeName(quarter, roomTypeName);
                        if (!roomBookingOrderListRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find room booking order list by quarter and room type name"
                            });
                        }
                        finalDataArray.push({
                            roomTypeName: roomTypeName,
                            totalData: roomBookingTotalQuarterRes,
                            roomBookingOrderList: roomBookingOrderListRes
                        });
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getRoomBookingOrderByQuarterAndRoomTypeName!",
                            error: err
                        });
                    }
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when getRoomBookingTotalOfTypeByQuarterFourOrderByCaNam!",
                        error: err
                    });
                }
            }
        }

        // L???y ng??y hi???n t???i FORMAT: '2022-05-05 13:48:12' gi???ng CSDL
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

        // Sort
        if (sortWay === "asc") {
            finalDataArray = finalDataArray.sort((a, b) => a.totalData.canam - b.totalData.canam);
        } else {
            finalDataArray = finalDataArray.sort((a, b) => b.totalData.canam - a.totalData.canam);
        }

        // Success
        return res.status(200).json({
            status: "success",
            message: "Th???ng k?? doanh thu theo th??ng c???a Lo???i ph??ng th??nh c??ng!",
            data: {
                statisticDate: statisticDate,
                quarter: quarter,
                sortWay: sortWay,
                data: finalDataArray,
                monthArray: monthInQuarterArray
            }
        });
    },
    // Admin: Qu???n l?? ?????t ph??ng - Th???ng k?? doanh thu Theo Lo???i v?? Ng??y th???ng k??
    getStatisticRoomBookingTotalOfTypeByDate: async (req, res) => {
        const dateFrom = req.body.dateFrom;
        const dateTo = req.body.dateTo;
        const sortWay = req.body.sortWay;
        const roomTypeList = req.body.roomTypeList;
        if (!dateFrom) {
            return res.status(400).json({
                status: "fail",
                message: "Ng??y b???t ?????u th???ng k?? kh??ng h???p l???!"
            });
        }
        if (!dateTo) {
            return res.status(400).json({
                status: "fail",
                message: "Ng??y k???t th??c th???ng k?? kh??ng h???p l???!"
            });
        }
        if (!sortWay) {
            return res.status(400).json({
                status: "fail",
                message: "C??ch s???p x???p kh??ng h???p l???!"
            });
        }
        if (!roomTypeList) {
            return res.status(400).json({
                status: "fail",
                message: "Lo???i ph??ng kh??ng h???p l???!"
            });
        }

        // L???y ng??y trong room booking t??? dateFrom ?????n dateTo
        try {
            const fromDateToDateListRes = await getDistinctDateInRoomBookingOrderFromDateToDate(dateFrom, dateTo);
            if (!fromDateToDateListRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't get date list"
                });
            }

            // L???y ng??y hi???n t???i FORMAT: '2022-05-05 13:48:12' gi???ng CSDL
            var todayCheckIn = new Date();
            var dateCheckIn = todayCheckIn.getFullYear() + '-' + (todayCheckIn.getMonth() + 1) + '-' + todayCheckIn.getDate();
            var timeCheckIn = todayCheckIn.getHours() + ":" + todayCheckIn.getMinutes() + ":" + todayCheckIn.getSeconds();
            var statisticDate = dateCheckIn + ' ' + timeCheckIn;

            let finalArray = [];
            let finalRoomBookingOrderList = [];
            for (var i = 0; i < fromDateToDateListRes.length; i++) {
                const date = fromDateToDateListRes[i].finishDate;
                var dataArray = [];
                for (var j = 0; j < roomTypeList.length; j++) {
                    const roomTypeName = roomTypeList[j];
                    try {
                        const totalRes = await getRoomBookingTotalOfTypeByDate(date, roomTypeName);
                        const totalCaNamRes = totalRes.canam;
                        if (!totalRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find room booking total type by date"
                            });
                        }
                        // L???y ????n ?????t ph??ng cho t???ng Ng??y
                        try {
                            const roomBookingByDateRes = await getRoomBookingOrderByDateAndRoomTypeName(date, roomTypeName);
                            if (!roomBookingByDateRes) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Cann't find room booking by date"
                                });
                            }
                            dataArray.push({
                                totalCaNam: totalCaNamRes,
                                totalData: totalRes,
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
                // Sort
                if (sortWay === "asc") {
                    dataArray = dataArray.sort((a, b) => a.totalCaNam - b.totalCaNam);
                } else {
                    dataArray = dataArray.sort((a, b) => b.totalCaNam - a.totalCaNam);
                }
                dataArray.map((data, key) => {
                    const roomBookingListRes = data.roomBookingOrderDetailList;
                    roomBookingListRes.map((roomBookingOrder) => {
                        finalRoomBookingOrderList.push(roomBookingOrder);
                    })
                })
                // Sau khi l???p xong c??c room type trong 1 ng??y th?? cho v??o m???ng k???t qu???
                finalArray.push({
                    date: date,
                    dataArray: dataArray
                })
            }

            // Sort xong t??ch m???ng ng??y m???i v?? m???ng data sau sort
            let dateArray = []; //L??u M???ng ng??y sau khi ???? sort theo doanh thu c??? n??m
            let dataTableArray = [];
            for (var i = 0; i < finalArray.length; i++) {
                dateArray.push(finalArray[i].date);
                dataTableArray.push(finalArray[i].dataArray);
            }
            // M???ng ng??y m???i th?? l???y ????? ??em truy v???n l???y t???ng c???t d??? li???u l??m bi???u ?????
            let statisticArray = [];
            for (var i = 0; i < roomTypeList.length; i++) {
                const roomTypeName = roomTypeList[i];
                try {
                    const roomBookingTotalOfCityByDateRes = await getRoomBookingTotalOfTypeByDateByListDate(fromDateToDateListRes, roomTypeName, sortWay);
                    if (!roomBookingTotalOfCityByDateRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't get test"
                        });
                    }
                    statisticArray.push(roomBookingTotalOfCityByDateRes);
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when getRoomBookingTotalOfTypeByDateByListDate!",
                        error: err
                    });
                }
            }

            // Success
            return res.status(200).json({
                status: "success",
                message: "Th???ng k?? doanh thu theo ng??y c???a Th??nh ph??? theo Lo???i th??nh c??ng!",
                data: {
                    statisticDate: statisticDate,
                    dateArray: dateArray,
                    dataArray: finalArray,
                    dateFrom: dateFrom,
                    dateTo: dateTo,
                    sortWay: sortWay,
                    statisticArray: statisticArray,
                    finalRoomBookingOrderList: finalRoomBookingOrderList
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

    // -------------------------------------------- TH???NG K?? KH??CH H??NG --------------------------------------------
    // Admin: Qu???n l?? ?????t ph??ng - Th???ng k?? doanh thu Theo Kh??ch h??ng
    getStatisticRoomBookingTotalOfCustomerByQuarter: async (req, res) => {
        const quarter = req.body.quarter;
        const sortWay = req.body.sortWay;
        const customerInfo = req.body.customerInfo;
        if (!quarter || !Number.isInteger(quarter) || quarter >= 5 || quarter < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Qu?? th???ng k?? kh??ng h???p l???!"
            });
        }
        if (!sortWay) {
            return res.status(400).json({
                status: "fail",
                message: "C??ch s???p x???p kh??ng h???p l???!"
            });
        }
        if (!customerInfo) {
            return res.status(400).json({
                status: "fail",
                message: "Email/ S??? ??i???n tho???i c???a Kh??ch h??ng kh??ng h???p l???!"
            });
        }

        // Ki???m tra Kh??ch h??ng n??o c???n th???ng k??? Kh??ch h??ng c?? t???n t???i hay kh??ng?
        var customerId;
        var customerName;
        try {
            const customerRes = await findCustomerByEmailOrPhoneNumber(customerInfo);
            if (!customerRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Kh??ch h??ng kh??ng t???n t???i!"
                });
            }
            // T??m ???????c customer
            customerId = customerRes.customer_id;
            customerName = customerRes.customer_first_name + " " + customerRes.customer_last_name;

            // Ki???m tra Kh??ch h??ng n??y c?? ?????t ph??ng kh??ng
            try {
                const isCustomerBooking = await findCustomerInRoomBookingOrder(customerId);
                if (!isCustomerBooking) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Kh??ch h??ng ch??a c?? th??ng tin ?????t ph??ng n??o!"
                    });
                }
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when findCustomerInRoomBookingOrder!",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when findCustomerByEmailOrPhoneNumber!",
                error: err
            });
        }

        let finalDataArray = [];
        // N???u l?? qu?? 1
        if (quarter === 1) {
            // L???y th???ng k?? doanh thu c???a Kh??ch h??ng theo qu??
            try {
                const roomBookingTotalQuarterRes = await getRoomBookingTotalOfCustomerByQuarterOneOrderByCaNam(customerId);
                if (!roomBookingTotalQuarterRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't find room booking by Quarter 1"
                    });
                }
                // L???y danh s??ch ????n ?????t ph??ng chi ti???t cho t???ng Kh??ch h??ng thu???c qu?? ???? 
                try {
                    const roomBookingOrderListRes = await getRoomBookingOrderByQuarterAndCustomerId(quarter, customerId);
                    if (!roomBookingOrderListRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't find room booking order list by quarter and customer id"
                        });
                    }
                    var sortedListRes = roomBookingOrderListRes;
                    // Sort
                    if (sortWay === "asc") {
                        sortedListRes = sortedListRes.sort((a, b) => a.room_booking_order_total - b.room_booking_order_total);
                    } else {
                        sortedListRes = sortedListRes.sort((a, b) => b.room_booking_order_total - a.room_booking_order_total);
                    }

                    finalDataArray.push({
                        customerName: customerName,
                        totalData: roomBookingTotalQuarterRes,
                        roomBookingOrderList: sortedListRes
                    });
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when getRoomBookingOrderByQuarterAndCustomerId!",
                        error: err
                    });
                }
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when getRoomBookingTotalOfCustomerByQuarterOneOrderByCaNam!",
                    error: err
                });
            }
        }
        // N???u l?? qu?? 2
        if (quarter === 2) {
            // L???y th???ng k?? doanh thu c???a Kh??ch h??ng theo qu??
            try {
                const roomBookingTotalQuarterRes = await getRoomBookingTotalOfCustomerByQuarterTwoOrderByCaNam(customerId);
                if (!roomBookingTotalQuarterRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't find room booking by Quarter 2"
                    });
                }
                // L???y danh s??ch ????n ?????t ph??ng chi ti???t cho t???ng Kh??ch h??ng thu???c qu?? ???? 
                try {
                    const roomBookingOrderListRes = await getRoomBookingOrderByQuarterAndCustomerId(quarter, customerId);
                    if (!roomBookingOrderListRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't find room booking order list by quarter and customer id"
                        });
                    }
                    var sortedListRes = roomBookingOrderListRes;
                    // Sort
                    if (sortWay === "asc") {
                        sortedListRes = sortedListRes.sort((a, b) => a.room_booking_order_total - b.room_booking_order_total);
                    } else {
                        sortedListRes = sortedListRes.sort((a, b) => b.room_booking_order_total - a.room_booking_order_total);
                    }

                    finalDataArray.push({
                        customerName: customerName,
                        totalData: roomBookingTotalQuarterRes,
                        roomBookingOrderList: sortedListRes
                    });
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when getRoomBookingOrderByQuarterAndCustomerId!",
                        error: err
                    });
                }
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when getRoomBookingTotalOfCustomerByQuarterTwoOrderByCaNam!",
                    error: err
                });
            }
        }
        // N???u l?? qu?? 3
        if (quarter === 3) {
            // L???y th???ng k?? doanh thu c???a Kh??ch h??ng theo qu??
            try {
                const roomBookingTotalQuarterRes = await getRoomBookingTotalOfCustomerByQuarterThreeOrderByCaNam(customerId);
                if (!roomBookingTotalQuarterRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't find room booking by Quarter 3"
                    });
                }
                // L???y danh s??ch ????n ?????t ph??ng chi ti???t cho t???ng Kh??ch h??ng thu???c qu?? ???? 
                try {
                    const roomBookingOrderListRes = await getRoomBookingOrderByQuarterAndCustomerId(quarter, customerId);
                    if (!roomBookingOrderListRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't find room booking order list by quarter and customer id"
                        });
                    }
                    var sortedListRes = roomBookingOrderListRes;
                    // Sort
                    if (sortWay === "asc") {
                        sortedListRes = sortedListRes.sort((a, b) => a.room_booking_order_total - b.room_booking_order_total);
                    } else {
                        sortedListRes = sortedListRes.sort((a, b) => b.room_booking_order_total - a.room_booking_order_total);
                    }

                    finalDataArray.push({
                        customerName: customerName,
                        totalData: roomBookingTotalQuarterRes,
                        roomBookingOrderList: sortedListRes
                    });
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when getRoomBookingOrderByQuarterAndCustomerId!",
                        error: err
                    });
                }
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when getRoomBookingTotalOfCustomerByQuarterThreeOrderByCaNam!",
                    error: err
                });
            }
        }
        // N???u l?? qu?? 4
        if (quarter === 4) {
            // L???y th???ng k?? doanh thu c???a Kh??ch h??ng theo qu??
            try {
                const roomBookingTotalQuarterRes = await getRoomBookingTotalOfCustomerByQuarterFourOrderByCaNam(customerId);
                if (!roomBookingTotalQuarterRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't find room booking by Quarter 4"
                    });
                }
                // L???y danh s??ch ????n ?????t ph??ng chi ti???t cho t???ng Kh??ch h??ng thu???c qu?? ???? 
                try {
                    const roomBookingOrderListRes = await getRoomBookingOrderByQuarterAndCustomerId(quarter, customerId);
                    if (!roomBookingOrderListRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't find room booking order list by quarter and customer id"
                        });
                    }
                    var sortedListRes = roomBookingOrderListRes;
                    // Sort
                    if (sortWay === "asc") {
                        sortedListRes = sortedListRes.sort((a, b) => a.room_booking_order_total - b.room_booking_order_total);
                    } else {
                        sortedListRes = sortedListRes.sort((a, b) => b.room_booking_order_total - a.room_booking_order_total);
                    }

                    finalDataArray.push({
                        customerName: customerName,
                        totalData: roomBookingTotalQuarterRes,
                        roomBookingOrderList: sortedListRes
                    });
                } catch (err) {
                    console.log(err);
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when getRoomBookingOrderByQuarterAndCustomerId!",
                        error: err
                    });
                }
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when getRoomBookingTotalOfCustomerByQuarterFourOrderByCaNam!",
                    error: err
                });
            }
        }

        // L???y ng??y hi???n t???i FORMAT: '2022-05-05 13:48:12' gi???ng CSDL
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

        // Success
        return res.status(200).json({
            status: "success",
            message: "Th???ng k?? doanh thu theo th??ng c???a Kh??ch h??ng th??nh c??ng!",
            data: {
                statisticDate: statisticDate,
                quarter: quarter,
                sortWay: sortWay,
                data: finalDataArray,
                monthArray: monthInQuarterArray
            }
        });
    },
    // Admin: Qu???n l?? ?????t ph??ng - Th???ng k?? doanh thu Theo Kh??ch h??ng v?? Ng??y th???ng k??
    getStatisticRoomBookingTotalOfCustomerByDate: async (req, res) => {
        const dateFrom = req.body.dateFrom;
        const dateTo = req.body.dateTo;
        const sortWay = req.body.sortWay;
        const customerInfo = req.body.customerInfo;
        if (!dateFrom) {
            return res.status(400).json({
                status: "fail",
                message: "Ng??y b???t ?????u th???ng k?? kh??ng h???p l???!"
            });
        }
        if (!dateTo) {
            return res.status(400).json({
                status: "fail",
                message: "Ng??y k???t th??c th???ng k?? kh??ng h???p l???!"
            });
        }
        if (!sortWay) {
            return res.status(400).json({
                status: "fail",
                message: "C??ch s???p x???p kh??ng h???p l???!"
            });
        }
        if (!customerInfo) {
            return res.status(400).json({
                status: "fail",
                message: "Email/ S??? ??i???n tho???i c???a Kh??ch h??ng kh??ng h???p l???!"
            });
        }

        // Ki???m tra Kh??ch h??ng n??o c???n th???ng k??? Kh??ch h??ng c?? t???n t???i hay kh??ng?
        var customerId;
        var customerName;
        try {
            const customerRes = await findCustomerByEmailOrPhoneNumber(customerInfo);
            if (!customerRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Kh??ch h??ng kh??ng t???n t???i!"
                });
            }
            // T??m ???????c customer
            customerId = customerRes.customer_id;
            customerName = customerRes.customer_first_name + " " + customerRes.customer_last_name;

            // Ki???m tra Kh??ch h??ng n??y c?? ?????t ph??ng kh??ng
            try {
                const isCustomerBooking = await findCustomerInRoomBookingOrder(customerId);
                if (!isCustomerBooking) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Kh??ch h??ng ch??a c?? th??ng tin ?????t ph??ng n??o!"
                    });
                }
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when findCustomerInRoomBookingOrder!",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when findCustomerByEmailOrPhoneNumber!",
                error: err
            });
        }

        // L???y ng??y trong room booking t??? dateFrom ?????n dateTo
        try {
            const fromDateToDateListRes = await getDistinctDateInRoomBookingOrderFromDateToDate(dateFrom, dateTo);
            if (!fromDateToDateListRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't get date list"
                });
            }

            // L???y ng??y hi???n t???i FORMAT: '2022-05-05 13:48:12' gi???ng CSDL
            var todayCheckIn = new Date();
            var dateCheckIn = todayCheckIn.getFullYear() + '-' + (todayCheckIn.getMonth() + 1) + '-' + todayCheckIn.getDate();
            var timeCheckIn = todayCheckIn.getHours() + ":" + todayCheckIn.getMinutes() + ":" + todayCheckIn.getSeconds();
            var statisticDate = dateCheckIn + ' ' + timeCheckIn;

            let finalArray = [];
            let finalRoomBookingOrderList = [];
            for (var i = 0; i < fromDateToDateListRes.length; i++) {
                const date = fromDateToDateListRes[i].finishDate;
                try {
                    const totalRes = await getRoomBookingTotalOfCustomerByDate(date, customerId);
                    const totalCaNamRes = totalRes.canam;
                    if (!totalRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't find room booking total type by date"
                        });
                    }
                    // L???y ????n ?????t ph??ng cho t???ng Ng??y
                    try {
                        const roomBookingByDateRes = await getRoomBookingOrderByDateAndCustomerId(date, customerId);
                        if (!roomBookingByDateRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find room booking by date"
                            });
                        }
                        // Sau khi l???p xong c??c room type trong 1 ng??y th?? cho v??o m???ng k???t qu???
                        finalArray.push({
                            date: date,
                            dataArray: {
                                totalCaNam: totalCaNamRes,
                                totalData: totalRes,
                                roomBookingOrderDetailList: roomBookingByDateRes
                            }
                        })
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getRoomBookingOrderByDateAndCustomerId!",
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

            // // Sort
            // if (sortWay === "asc") {
            //     finalArray = finalArray.sort((a, b) => a.dataArray.totalCaNam - b.dataArray.totalCaNam);
            // } else {
            //     finalArray = finalArray.sort((a, b) => b.dataArray.totalCaNam - a.dataArray.totalCaNam);
            // }
            finalArray.map((data, key) => {
                const roomBookingListRes = data.dataArray.roomBookingOrderDetailList;
                roomBookingListRes.map((roomBookingOrder) => {
                    finalRoomBookingOrderList.push(roomBookingOrder);
                })
            })

            // Sort
            if (sortWay === "asc") {
                finalRoomBookingOrderList = finalRoomBookingOrderList.sort((a, b) => a.room_booking_order_total - b.room_booking_order_total);
            } else {
                finalRoomBookingOrderList = finalRoomBookingOrderList.sort((a, b) => b.room_booking_order_total - a.room_booking_order_total);
            }

            // Sort xong t??ch m???ng ng??y m???i v?? m???ng data sau sort
            let dateArray = []; //L??u M???ng ng??y sau khi ???? sort theo doanh thu c??? n??m
            let dataTableArray = [];
            for (var i = 0; i < finalArray.length; i++) {
                dateArray.push(finalArray[i].date);
                dataTableArray.push(finalArray[i].dataArray);
            }
            // M???ng ng??y m???i th?? l???y ????? ??em truy v???n l???y t???ng c???t d??? li???u l??m bi???u ?????
            let statisticArray;
            try {
                const roomBookingTotalOfCityByDateRes = await getRoomBookingTotalOfCustomerByDateByListDate(fromDateToDateListRes, customerId, sortWay);
                if (!roomBookingTotalOfCityByDateRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't get test"
                    });
                }
                statisticArray = roomBookingTotalOfCityByDateRes;
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when getRoomBookingTotalOfCustomerByDateByListDate!",
                    error: err
                });
            }

            // Success
            return res.status(200).json({
                status: "success",
                message: "Th???ng k?? doanh thu theo ng??y c???a Th??nh ph??? theo Kh??ch h??ng th??nh c??ng!",
                data: {
                    statisticDate: statisticDate,
                    dateArray: dateArray,
                    dataArray: finalArray,
                    dateFrom: dateFrom,
                    dateTo: dateTo,
                    sortWay: sortWay,
                    statisticArray: statisticArray,
                    finalRoomBookingOrderList: finalRoomBookingOrderList
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
};