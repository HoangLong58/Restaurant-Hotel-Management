const { getTableBookingOrders, createTableBookingOrder, findTableBookingOrder, getTableBookingsAndDetail, getQuantityTableBookings, findTableBookingByIdOrCustomerEmailOrCustomerPhoneOrCustomerName, findTableBookingById, findTableBookingOrderByIdCheckIn, updateTableBookingOrderInfoWhenCheckInSuccess, updateTableBookingOrderState, updateTableBookingOrderFinishDateWhenCheckOutSuccess, getDistinctDateInTableBookingOrderFromDateToDate, getLimitTableBookingTotalOfCityForEachQuarter, getTableBookingTotalOfCityByDateAndLimitAsc, getTableBookingTotalOfCityByDateAndAsc, getTableBookingTotalOfCityByDateAndLimitDesc, getTableBookingTotalOfCityByDateAndDesc, getTableBookingTotalOfCityByDateByListDate, getTableBookingTotalOfCityByDateByListDateNoLimit, getTableBookingTotalOfCityByQuarterOneOrderByCaNamDescAndLimit, getTableBookingTotalOfCityByQuarterOneOrderByCaNamDesc, getTableBookingTotalOfCityByQuarterOneOrderByCaNamAscAndLimit, getTableBookingTotalOfCityByQuarterOneOrderByCaNamAsc, getTableBookingTotalOfCityByQuarterTwoOrderByCaNamDescAndLimit, getTableBookingTotalOfCityByQuarterTwoOrderByCaNamDesc, getTableBookingTotalOfCityByQuarterTwoOrderByCaNamAscAndLimit, getTableBookingTotalOfCityByQuarterTwoOrderByCaNamAsc, getTableBookingTotalOfCityByQuarterThreeOrderByCaNamDescAndLimit, getTableBookingTotalOfCityByQuarterThreeOrderByCaNamDesc, getTableBookingTotalOfCityByQuarterThreeOrderByCaNamAscAndLimit, getTableBookingTotalOfCityByQuarterThreeOrderByCaNamAsc, getTableBookingTotalOfCityByQuarterFourOrderByCaNamDescAndLimit, getTableBookingTotalOfCityByQuarterFourOrderByCaNamDesc, getTableBookingTotalOfCityByQuarterFourOrderByCaNamAscAndLimit, getTableBookingTotalOfCityByQuarterFourOrderByCaNamAsc, getTableBookingTotalByMonth, getTableBookingOrderByCityId, getTableBookingTotalByDate } = require("../service/TableBookingOrderService");
// NODE Mailer
var nodemailer = require('nodemailer');
const { getCustomerByCustomerId, findCustomerByEmailOrPhoneNumber } = require("../service/CustomerService");
const { getTableBookingWithTypeAndFloorByTableBookingId } = require("../service/TableBookingService");
const { getWardByWardId } = require("../service/WardService");
const { createLogAdmin } = require("../utils/utils");
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'truonghoanglong588@gmail.com',
        pass: 'grkaaxhoeradbtop'
    }
});
var moment = require('moment');

module.exports = {
    getTableBookingOrders: async (req, res) => {
        try {
            const result = await getTableBookingOrders();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found"
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Get all table booking orders successfully!",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getTableBookingOrders",
                error: err
            });
        }
    },
    createTableBookingOrder: async (req, res) => {
        const tableBookingOrderQuantity = req.body.tableBookingOrderQuantity;
        const tableBookingOrderTotal = req.body.tableBookingOrderTotal;
        const tableBookingOrderNote = req.body.tableBookingOrderNote;
        const customerId = req.body.customerId;
        const tableBookingId = req.body.tableBookingId;

        const dateBooking = req.body.dateBooking;
        const timeBooking = req.body.timeBooking;

        console.log("tableBookingOrderQuantity, tableBookingOrderTotal, tableBookingOrderNote, customerId, tableBookingId, dateBooking, timeBooking: ", tableBookingOrderQuantity, tableBookingOrderTotal, tableBookingOrderNote, customerId, tableBookingId, dateBooking, timeBooking)

        // Lấy ngày hiện tại FORMAT: '2022-05-05 13:48:12' giống CSDL
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var tableBookingOrderBookDate = date + ' ' + time;

        // Checkin date + time
        var tableBookingOrderCheckInDate = dateBooking + " " + timeBooking;
        if (!tableBookingOrderQuantity) {
            return res.status(404).json({
                status: "fail",
                message: "Số lượng khách không hợp lệ!"
            });
        }
        if (tableBookingOrderTotal === null) {
            return res.status(404).json({
                status: "fail",
                message: "Tổng số tiền không hợp lệ!"
            });
        }
        if (!customerId || !Number.isInteger(customerId) || customerId <= 0) {
            return res.status(404).json({
                status: "fail",
                message: "Mã khách hàng không hợp lệ!"
            });
        }
        if (!tableBookingId || !Number.isInteger(tableBookingId) || tableBookingId <= 0) {
            return res.status(404).json({
                status: "fail",
                message: "Mã bàn không hợp lệ!"
            });
        }
        if (!dateBooking) {
            return res.status(404).json({
                status: "fail",
                message: "Bạn chưa chọn Ngày đặt bàn!"
            });
        }
        if (!timeBooking) {
            return res.status(404).json({
                status: "fail",
                message: "Bạn chưa chọn Giờ đặt bàn!"
            });
        }
        try {
            const createtableBookingOrderRes = await createTableBookingOrder(
                tableBookingOrderBookDate,
                tableBookingOrderQuantity,
                0,
                tableBookingOrderNote,
                tableBookingOrderCheckInDate,
                customerId,
                tableBookingId
            );
            if (!createtableBookingOrderRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Create record fail"
                });
            }
            try {
                const tableBookingOrderRes = await findTableBookingOrder(
                    tableBookingOrderBookDate,
                    tableBookingOrderQuantity,
                    0,
                    tableBookingOrderNote,
                    tableBookingOrderCheckInDate,
                    customerId,
                    tableBookingId
                );
                if (!tableBookingOrderRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "find record fail"
                    });
                }
                const customerRes = await getCustomerByCustomerId(customerId);
                if (!customerRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Customer record not found"
                    });
                }
                const tableBookingRes = await getTableBookingWithTypeAndFloorByTableBookingId(tableBookingId);
                if (!tableBookingRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Table booking record not found"
                    });
                }

                var customerName = customerRes.customer_first_name + " " + customerRes.customer_last_name;
                var customerEmail = customerRes.customer_email;
                var customerPhoneNumber = customerRes.customer_phone_number;

                var tableBookingOrderId = tableBookingOrderRes.table_booking_order_id;

                var tableBookingName = tableBookingRes.table_booking_name;
                var tableBookingTypeName = tableBookingRes.table_type_name;
                var tableBookingFloorName = tableBookingRes.floor_name;
                // MAILER
                var noidung = '';
                noidung += '<div><p>Cảm ơn bạn đã tin tưởng và đặt bàn tại <font color="#41f1b6"><b>Hoàng Long Hotel &amp; Restaurant</b></font> với mã đặt bàn: ' + tableBookingOrderId + '</p></div>';
                noidung += '<p><b>Khách hàng:</b> ' + customerName + '<br /><b>Email:</b> ' + customerEmail + '<br /><b>Điện thoại:</b> ' + customerPhoneNumber + '<br />';

                // Danh sách Sản phẩm đã mua
                noidung += ' <table border="1px" cellpadding="10px" cellspacing="1px"width="100%"><tr><td align="center" bgcolor="#41f1b6" colspan="4"><fontcolor="white"><b>ĐƠN ĐẶT BÀN CỦA BẠN</b></fontcolor=></td></tr><tr id="invoice-bar"><td width="25%"><b>Loại bàn</b></td><td width="20%"><b>Số bàn</b></td><td width="30%"><b>Vị trí</b></td><td width="25%"><b>Ngày đã đặt</b></td></tr>';

                noidung += '<tr><td class="prd-name">' + tableBookingTypeName + '</td><td class="prd-price"><font color="#41f1b6">' + tableBookingName + '</font></td><td class="prd-number">' + tableBookingFloorName + '</td><td class="prd-total"><font color="#41f1b6">' + tableBookingOrderCheckInDate + '</font></td></tr></table>';

                noidung += '<p align="justify"><b>Quý khách đã đặt bàn thành công!</b><br /><b><br />Cám ơn Quý khách đã lựa chọn dịch vụ của chúng tôi!</b></p>';
                // ----- Mailer Option -----
                var mailOptions = {
                    from: 'Hoàng Long Hotel &amp; Restaurant',
                    to: customerEmail,
                    subject: 'Đặt bàn tại Hoàng Long thành công!',
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
                // Success
                return res.status(200).json({
                    status: "success",
                    message: "Create table booking order successfully!",
                });
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when find table booking order!",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when create table booking order!",
                error: err
            });
        }
    },

    // ADMIN: Quản lý Đặt Bàn
    getTableBookingAndDetails: async (req, res) => {
        try {
            const result = await getTableBookingsAndDetail();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Lấy table bookings thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getTableBookingsAndDetail",
                error: err
            });
        }
    },
    getQuantityTableBooking: async (req, res) => {
        try {
            const result = await getQuantityTableBookings();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Lấy quantity table bookings thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getQuantityTableBookings",
                error: err
            });
        }
    },
    findTableBookingByIdOrCustomerEmailOrCustomerPhoneOrCustomerName: async (req, res) => {
        const search = req.params.search;
        try {
            const result = await findTableBookingByIdOrCustomerEmailOrCustomerPhoneOrCustomerName(search);
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Tìm table bookings thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findTableBookingByIdOrCustomerEmailOrCustomerPhoneOrCustomerName",
                error: err
            });
        }
    },
    findTableBookingById: async (req, res) => {
        const tableBookingId = req.body.tableBookingId;
        try {
            const result = await findTableBookingById(tableBookingId);
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Tìm table bookings thành công",
                data: result
            });
        } catch (err) {
            console.log("ERR: ", err);
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findTableBookingById",
                error: err
            });
        }
    },

    // ADMIN: Check in
    checkInTableBookingOrder: async (req, res) => {
        const customerFirstName = req.body.customerFirstName;
        const customerLastName = req.body.customerLastName;
        const customerEmail = req.body.customerEmail;
        const customerPhoneNumber = req.body.customerPhoneNumber;
        const tableBookingOrderIdentityCard = req.body.tableBookingOrderIdentityCard;
        const tableBookingOrderNation = req.body.tableBookingOrderNation;
        const tableBookingOrderAddress = req.body.tableBookingOrderAddress;
        const tableBookingOrderWardId = req.body.tableBookingOrderWardId;
        const tableBookingOrderId = req.body.tableBookingOrderId;

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
        if (!tableBookingOrderIdentityCard) {
            return res.status(400).json({
                status: "fail",
                message: "Số chứng minh thư của khách hàng không hợp lệ!"
            });
        }
        if (!tableBookingOrderNation) {
            return res.status(400).json({
                status: "fail",
                message: "Quốc tịch của khách hàng không hợp lệ!"
            });
        }
        if (!tableBookingOrderAddress) {
            return res.status(400).json({
                status: "fail",
                message: "Địa chỉ của khách hàng không hợp lệ!"
            });
        }
        if (!tableBookingOrderWardId || tableBookingOrderWardId === '' || tableBookingOrderWardId === undefined || tableBookingOrderWardId === null) {
            return res.status(400).json({
                status: "fail",
                message: "Mã Xã phường của khách hàng không hợp lệ!"
            });
        }
        if (!tableBookingOrderId || !Number.isInteger(tableBookingOrderId) || tableBookingOrderId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã Đặt bàn không hợp lệ!"
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
                    message: "Họ tên không đúng với email/ SDT đã đặt bàn!"
                });
            }
            // Tìm table booking order
            try {
                const tableBookingOrderRes = await findTableBookingOrderByIdCheckIn(tableBookingOrderId);
                if (!tableBookingOrderRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Record table booking order not found"
                    });
                }
                const tableBookingOrderStateRes = tableBookingOrderRes.table_booking_order_state;
                if (tableBookingOrderStateRes !== 0) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Đơn đặt này Đã Check in hoặc Đã hoàn thành rồi!"
                    });
                }
                // Kiểm tra người dùng phải người đã đặt bàn này không?
                const customerIdInTableBookingOrder = tableBookingOrderRes.customer_id;
                if (customerIdRes !== customerIdInTableBookingOrder) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Phòng không được đặt bởi khách hàng này!"
                    });
                }
                // Kiểm tra ngày check in xem phải ngày muốn đặt không? - Lấy ngày muốn check in table_booking_order_checkin_date
                var dateCheckinRes = new Date(tableBookingOrderRes.table_booking_order_checkin_date);
                // So sánh ngày
                var today = new Date();
                var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + (today.getDate() + 1);
                var checkInDate = new Date(date);
                checkInDate.setHours(-17, 0, 0, 0);
                // Không cho checkin sớm hơn thời gian muốn nhận bàn table_booking_order_checkin_date
                if (checkInDate < dateCheckinRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Không thể Check in trước ngày Muốn nhận Bàn: " + tableBookingOrderRes.table_booking_order_checkin_date
                    });
                }
                // Tìm Xã phường có tồn tại không
                try {
                    const wardRes = await getWardByWardId(tableBookingOrderWardId);
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
                        const updateCheckInInfoRes = await updateTableBookingOrderInfoWhenCheckInSuccess(tableBookingOrderIdentityCard, tableBookingOrderNation, tableBookingOrderAddress, tableBookingOrderWardId, startDate, tableBookingOrderId);
                        if (!updateCheckInInfoRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't update table booking info when check in success"
                            });
                        }
                        // Cập nhật state
                        try {
                            const updateStateRes = await updateTableBookingOrderState(1, tableBookingOrderId);
                            if (!updateStateRes) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Cann't update table booking state when check in success"
                                });
                            }

                            createLogAdmin(req, res, " vừa Check in cho Đơn đặt bàn có mã: " + tableBookingOrderId, "UPDATE").then(() => {
                                // Success
                                return res.status(200).json({
                                    status: "success",
                                    message: "Check in thành công!"
                                });
                            });

                        } catch (err) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Error when update table booking order state when check in success!",
                                error: err
                            });
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when update table booking order info when check in success!",
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
                    message: "Error when find table booking order!",
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
    checkOutTableBookingOrder: async (req, res) => {
        const tableBookingOrderId = req.body.tableBookingOrderId;

        if (!tableBookingOrderId || !Number.isInteger(tableBookingOrderId) || tableBookingOrderId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã Đặt bàn không hợp lệ!"
            });
        }
        // Tìm table booking order xem có không
        try {
            const tableBookingOrderRes = await findTableBookingOrderByIdCheckIn(tableBookingOrderId);
            if (!tableBookingOrderRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record table booking order not found"
                });
            }
            const tableBookingOrderStateRes = tableBookingOrderRes.table_booking_order_state;
            if (tableBookingOrderStateRes !== 1) {
                return res.status(400).json({
                    status: "fail",
                    message: "Đơn đặt này chưa Check in hoặc Đã hoàn thành rồi!"
                });
            }
            // Kiểm tra ngày check in xem phải ngày muốn cử hành không? - Lấy ngày cử hành đã chọn ở party hall detail
            var dateCheckinRes = new Date(tableBookingOrderRes.table_booking_order_checkin_date);
            // ----- Quy đổi về giờ đúng
            dateCheckinRes.setTime(dateCheckinRes.getTime() - new Date().getTimezoneOffset() * 60 * 1000);
            // ----- Lấy ngày muộn hơn 1 so với ngày muốn đặt
            var dateResLate1Day = moment(dateCheckinRes).add(1, "days");
            var checkInDateLate1Day = new Date(dateResLate1Day);
            // Lấy ngày thực hiện check in
            var today = new Date();
            var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + (today.getDate() + 1);
            var checkInDate = new Date(date);
            // ----- Quy đổi về giờ đúng
            checkInDate.setTime(today.getTime() - new Date().getTimezoneOffset() * 60 * 1000);

            // // Ngày trễ hơn 1 thì không cho check out
            //  Không cho check out muộn lớn hơn ngày table_booking_order_checkin_date
            console.log(checkInDate, checkInDateLate1Day, dateCheckinRes, tableBookingOrderRes.table_booking_order_checkin_date)

            if (checkInDate > checkInDateLate1Day) {
                return res.status(400).json({
                    status: "fail",
                    message: "Ngày Check out đã quá 1 ngày từ ngày Muốn nhận Bàn: " + tableBookingOrderRes.table_booking_order_checkin_date
                });
            }
            // Cập nhật ngày hoàn thành check out: finish date
            // Lấy ngày hiện tại FORMAT: '2022-05-05 13:48:12' giống CSDL
            var today = new Date();
            var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var finishDate = date + ' ' + time;
            try {
                const updateFinishDateRes = await updateTableBookingOrderFinishDateWhenCheckOutSuccess(finishDate, tableBookingOrderId);
                if (!updateFinishDateRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't update table booking finish date when check out success"
                    });
                }
                // Cập nhật state
                try {
                    const updateStateRes = await updateTableBookingOrderState(2, tableBookingOrderId);
                    if (!updateStateRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't update table booking state when check out success"
                        });
                    }

                    createLogAdmin(req, res, " vừa Check out cho Đơn đặt bàn có mã: " + tableBookingOrderId, "UPDATE").then(() => {
                        // Success
                        return res.status(200).json({
                            status: "success",
                            message: "Check out thành công!"
                        });
                    });

                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when update table booking order state when check out success!",
                        error: err
                    });
                }
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when update table booking order finish date when check out success!",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when find table booking order!",
                error: err
            });
        }
    },

    // Admin: Quản lý đặt bàn - Thống kê doanh thu
    getStatisticTableBookingTotalByDate: async (req, res) => {
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
        // Lấy ngày trong table booking từ dateFrom đến dateTo
        try {
            const fromDateToDateListRes = await getDistinctDateInTableBookingOrderFromDateToDate(dateFrom, dateTo);
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
                    const totalRes = await getTableBookingTotalByDate(date);
                    if (!totalRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't find table booking total by date"
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
                    dateTo: dateTo
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
    // Admin: Quản lý đặt bàn - Thống kê doanh thu
    getStatisticTableBookingTotalByQuarter: async (req, res) => {
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
                const totalRes = await getTableBookingTotalByMonth(month);
                if (!totalRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't find table booking total by month"
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

        // Success
        return res.status(200).json({
            status: "success",
            message: "Thống kê doanh thu theo Tháng trong Quý thành công!",
            data: {
                statisticDate: statisticDate,
                monthArray: monthArray,
                data: finalArray,
                dataArray: dataArray,
                quarter: quarter
            }
        });
    },
    // Admin: Quản lý đặt bàn - Thống kê doanh thu Theo thành phố
    getLimitTableBookingTotalOfCityForEachQuarter: async (req, res) => {
        const limit = 5;
        try {
            const TableBookingTotalOfCityForEachQuarterRes = await getLimitTableBookingTotalOfCityForEachQuarter(limit);
            if (!TableBookingTotalOfCityForEachQuarterRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't get table booking total of city for each quarter list"
                });
            }

            let finalDataTableArray = [];
            // Lấy ngày hiện tại FORMAT: '2022-05-05 13:48:12' giống CSDL
            var todayCheckIn = new Date();
            var dateCheckIn = todayCheckIn.getFullYear() + '-' + (todayCheckIn.getMonth() + 1) + '-' + todayCheckIn.getDate();
            var timeCheckIn = todayCheckIn.getHours() + ":" + todayCheckIn.getMinutes() + ":" + todayCheckIn.getSeconds();
            var statisticDate = dateCheckIn + ' ' + timeCheckIn;

            for (var i = 0; i < TableBookingTotalOfCityForEachQuarterRes.length; i++) {
                const cityId = TableBookingTotalOfCityForEachQuarterRes[i].city_id;
                const cityName = TableBookingTotalOfCityForEachQuarterRes[i].city_name;
                // Lấy đơn đặt bàn cho từng city id
                try {
                    const TableBookingByCityIdRes = await getTableBookingOrderByCityId(cityId);
                    if (!TableBookingByCityIdRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't find table booking by city id"
                        });
                    }
                    finalDataTableArray.push({
                        cityName: cityName,
                        data: TableBookingByCityIdRes
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
                    data: TableBookingTotalOfCityForEachQuarterRes,
                    dataArray: finalDataTableArray,
                }
            });
        } catch (err) {
            console.log(err)
            return res.status(400).json({
                status: "fail",
                message: "Error when get table booking total of city for each quarter list!",
                error: err
            });
        }
    },
    // Admin: Quản lý đặt bàn - Thống kê doanh thu Theo thành phố
    getStatisticTableBookingTotalOfCityByDate: async (req, res) => {
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
        // Lấy ngày trong table booking từ dateFrom đến dateTo
        try {
            const fromDateToDateListRes = await getDistinctDateInTableBookingOrderFromDateToDate(dateFrom, dateTo);
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
                            const totalRes = await getTableBookingTotalOfCityByDateAndLimitAsc(date, 5);
                            if (!totalRes) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Cann't find table booking total by date"
                                });
                            }
                            finalArray.push({
                                date: date,
                                data: totalRes
                            });
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
                            const totalRes = await getTableBookingTotalOfCityByDateAndLimitAsc(date, 10);
                            if (!totalRes) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Cann't find table booking total by date"
                                });
                            }
                            finalArray.push({
                                date: date,
                                data: totalRes
                            });
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
                            const totalRes = await getTableBookingTotalOfCityByDateAndAsc(date);
                            if (!totalRes) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Cann't find table booking total by date"
                                });
                            }
                            finalArray.push({
                                date: date,
                                data: totalRes
                            });
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
                            const totalRes = await getTableBookingTotalOfCityByDateAndLimitDesc(date, 5);
                            if (!totalRes) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Cann't find table booking total by date"
                                });
                            }
                            finalArray.push({
                                date: date,
                                data: totalRes
                            });
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
                            const totalRes = await getTableBookingTotalOfCityByDateAndLimitDesc(date, 10);
                            if (!totalRes) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Cann't find table booking total by date"
                                });
                            }
                            finalArray.push({
                                date: date,
                                data: totalRes
                            });
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
                            const totalRes = await getTableBookingTotalOfCityByDateAndDesc(date);
                            if (!totalRes) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Cann't find table booking total by date"
                                });
                            }
                            finalArray.push({
                                date: date,
                                data: totalRes
                            });
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
                    const TableBookingTotalOfCityByDateRes = await getTableBookingTotalOfCityByDateByListDate(fromDateToDateListRes, sortWay, 5);
                    if (!TableBookingTotalOfCityByDateRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't get test"
                        });
                    }
                    statistisData = TableBookingTotalOfCityByDateRes
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when getTableBookingTotalOfCityByDateByListDate 5!",
                        error: err
                    });
                }
            }
            if (limit === "ten") {
                try {
                    const TableBookingTotalOfCityByDateRes = await getTableBookingTotalOfCityByDateByListDate(fromDateToDateListRes, sortWay, 10);
                    if (!TableBookingTotalOfCityByDateRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't get test"
                        });
                    }
                    statistisData = TableBookingTotalOfCityByDateRes
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when getTableBookingTotalOfCityByDateByListDate 10!",
                        error: err
                    });
                }
            }
            if (limit === "all") {
                try {
                    // TEST
                    const TableBookingTotalOfCityByDateRes = await getTableBookingTotalOfCityByDateByListDateNoLimit(fromDateToDateListRes, sortWay);
                    if (!TableBookingTotalOfCityByDateRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't get test"
                        });
                    }
                    statistisData = TableBookingTotalOfCityByDateRes
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when getTableBookingTotalOfCityByDateByListDateNoLimit!",
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

    // Admin: Quản lý đặt bàn - Thống kê doanh thu Theo thành phố
    getStatisticTableBookingTotalOfCityByQuarter: async (req, res) => {
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
        // Nếu là quý 1
        if (quarter === 1) {
            if (sortWay === "desc") {
                if (limit === "five") {
                    // Quarter 1: -limit 5 - desc
                    try {
                        const TableBookingTotalQuarterRes = await getTableBookingTotalOfCityByQuarterOneOrderByCaNamDescAndLimit(5);
                        if (!TableBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find table booking by Quarter 1: -limit 5 - desc"
                            });
                        }
                        finalDataArray = TableBookingTotalQuarterRes;
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getTableBookingTotalOfCityByQuarterOneOrderByCaNamDescAndLimit 5!",
                            error: err
                        });
                    }
                }
                if (limit === "ten") {
                    // Quarter 1: -limit 10 - desc
                    try {
                        const TableBookingTotalQuarterRes = await getTableBookingTotalOfCityByQuarterOneOrderByCaNamDescAndLimit(10);
                        if (!TableBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find table booking by Quarter 1: -limit 10 - desc"
                            });
                        }
                        finalDataArray = TableBookingTotalQuarterRes;
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getTableBookingTotalOfCityByQuarterOneOrderByCaNamDescAndLimit 10!",
                            error: err
                        });
                    }
                }
                if (limit === "all") {
                    // Quarter 1: - no limit - desc
                    try {
                        const TableBookingTotalQuarterRes = await getTableBookingTotalOfCityByQuarterOneOrderByCaNamDesc();
                        if (!TableBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find table booking by Quarter 1: - no limit - desc"
                            });
                        }
                        finalDataArray = TableBookingTotalQuarterRes;
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getTableBookingTotalOfCityByQuarterOneOrderByCaNamDesc!",
                            error: err
                        });
                    }
                }
            }
            if (sortWay === "asc") {
                if (limit === "five") {
                    // Quarter 1: -limit 5 - asc
                    try {
                        const TableBookingTotalQuarterRes = await getTableBookingTotalOfCityByQuarterOneOrderByCaNamAscAndLimit(5);
                        if (!TableBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find table booking by Quarter 1: -limit 5 - asc"
                            });
                        }
                        finalDataArray = TableBookingTotalQuarterRes;
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getTableBookingTotalOfCityByQuarterOneOrderByCaNamAscAndLimit 5!",
                            error: err
                        });
                    }
                }
                if (limit === "ten") {
                    // Quarter 1: -limit 10 - asc
                    try {
                        const TableBookingTotalQuarterRes = await getTableBookingTotalOfCityByQuarterOneOrderByCaNamAscAndLimit(10);
                        if (!TableBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find table booking by Quarter 1: -limit 10 - asc"
                            });
                        }
                        finalDataArray = TableBookingTotalQuarterRes;
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getTableBookingTotalOfCityByQuarterOneOrderByCaNamAscAndLimit 10!",
                            error: err
                        });
                    }
                }
                if (limit === "all") {
                    // Quarter 1: - no limit - asc
                    try {
                        const TableBookingTotalQuarterRes = await getTableBookingTotalOfCityByQuarterOneOrderByCaNamAsc();
                        if (!TableBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find table booking by Quarter 1: - no limit - asc"
                            });
                        }
                        finalDataArray = TableBookingTotalQuarterRes;
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getTableBookingTotalOfCityByQuarterOneOrderByCaNamAsc!",
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
                        const TableBookingTotalQuarterRes = await getTableBookingTotalOfCityByQuarterTwoOrderByCaNamDescAndLimit(5);
                        if (!TableBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find table booking by Quarter 2: -limit 5 - desc"
                            });
                        }
                        finalDataArray = TableBookingTotalQuarterRes;
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getTableBookingTotalOfCityByQuarterTwoOrderByCaNamDescAndLimit 5!",
                            error: err
                        });
                    }
                }
                if (limit === "ten") {
                    // Quarter 2: -limit 10 - desc
                    try {
                        const TableBookingTotalQuarterRes = await getTableBookingTotalOfCityByQuarterTwoOrderByCaNamDescAndLimit(10);
                        if (!TableBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find table booking by Quarter 2: -limit 10 - desc"
                            });
                        }
                        finalDataArray = TableBookingTotalQuarterRes;
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getTableBookingTotalOfCityByQuarterTwoOrderByCaNamDescAndLimit 10!",
                            error: err
                        });
                    }
                }
                if (limit === "all") {
                    // Quarter 2: - no limit - desc
                    try {
                        const TableBookingTotalQuarterRes = await getTableBookingTotalOfCityByQuarterTwoOrderByCaNamDesc();
                        if (!TableBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find table booking by Quarter 2: - no limit - desc"
                            });
                        }
                        finalDataArray = TableBookingTotalQuarterRes;
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getTableBookingTotalOfCityByQuarterTwoOrderByCaNamDesc!",
                            error: err
                        });
                    }
                }
            }
            if (sortWay === "asc") {
                if (limit === "five") {
                    // Quarter 2: -limit 5 - asc
                    try {
                        const TableBookingTotalQuarterRes = await getTableBookingTotalOfCityByQuarterTwoOrderByCaNamAscAndLimit(5);
                        if (!TableBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find table booking by Quarter 2: -limit 5 - asc"
                            });
                        }
                        finalDataArray = TableBookingTotalQuarterRes;
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getTableBookingTotalOfCityByQuarterTwoOrderByCaNamAscAndLimit 5!",
                            error: err
                        });
                    }
                }
                if (limit === "ten") {
                    // Quarter 2: -limit 10 - asc
                    try {
                        const TableBookingTotalQuarterRes = await getTableBookingTotalOfCityByQuarterTwoOrderByCaNamAscAndLimit(10);
                        if (!TableBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find table booking by Quarter 2: -limit 10 - asc"
                            });
                        }
                        finalDataArray = TableBookingTotalQuarterRes;
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getTableBookingTotalOfCityByQuarterTwoOrderByCaNamAscAndLimit 10!",
                            error: err
                        });
                    }
                }
                if (limit === "all") {
                    // Quarter 2: - no limit - asc
                    try {
                        const TableBookingTotalQuarterRes = await getTableBookingTotalOfCityByQuarterTwoOrderByCaNamAsc();
                        if (!TableBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find table booking by Quarter 2: - no limit - asc"
                            });
                        }
                        finalDataArray = TableBookingTotalQuarterRes;
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getTableBookingTotalOfCityByQuarterTwoOrderByCaNamAsc!",
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
                        const TableBookingTotalQuarterRes = await getTableBookingTotalOfCityByQuarterThreeOrderByCaNamDescAndLimit(5);
                        if (!TableBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find table booking by Quarter 3: -limit 5 - desc"
                            });
                        }
                        finalDataArray = TableBookingTotalQuarterRes;
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getTableBookingTotalOfCityByQuarterThreeOrderByCaNamDescAndLimit 5!",
                            error: err
                        });
                    }
                }
                if (limit === "ten") {
                    // Quarter 3: -limit 10 - desc
                    try {
                        const TableBookingTotalQuarterRes = await getTableBookingTotalOfCityByQuarterThreeOrderByCaNamDescAndLimit(10);
                        if (!TableBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find table booking by Quarter 3: -limit 10 - desc"
                            });
                        }
                        finalDataArray = TableBookingTotalQuarterRes;
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getTableBookingTotalOfCityByQuarterThreeOrderByCaNamDescAndLimit 10!",
                            error: err
                        });
                    }
                }
                if (limit === "all") {
                    // Quarter 3: - no limit - desc
                    try {
                        const TableBookingTotalQuarterRes = await getTableBookingTotalOfCityByQuarterThreeOrderByCaNamDesc();
                        if (!TableBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find table booking by Quarter 3: - no limit - desc"
                            });
                        }
                        finalDataArray = TableBookingTotalQuarterRes;
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getTableBookingTotalOfCityByQuarterThreeOrderByCaNamDesc!",
                            error: err
                        });
                    }
                }
            }
            if (sortWay === "asc") {
                if (limit === "five") {
                    // Quarter 3: -limit 5 - asc
                    try {
                        const TableBookingTotalQuarterRes = await getTableBookingTotalOfCityByQuarterThreeOrderByCaNamAscAndLimit(5);
                        if (!TableBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find table booking by Quarter 3: -limit 5 - asc"
                            });
                        }
                        finalDataArray = TableBookingTotalQuarterRes;
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getTableBookingTotalOfCityByQuarterThreeOrderByCaNamAscAndLimit 5!",
                            error: err
                        });
                    }
                }
                if (limit === "ten") {
                    // Quarter 3: -limit 10 - asc
                    try {
                        const TableBookingTotalQuarterRes = await getTableBookingTotalOfCityByQuarterThreeOrderByCaNamAscAndLimit(10);
                        if (!TableBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find table booking by Quarter 3: -limit 10 - asc"
                            });
                        }
                        finalDataArray = TableBookingTotalQuarterRes;
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getTableBookingTotalOfCityByQuarterThreeOrderByCaNamAscAndLimit 10!",
                            error: err
                        });
                    }
                }
                if (limit === "all") {
                    // Quarter 3: - no limit - asc
                    try {
                        const TableBookingTotalQuarterRes = await getTableBookingTotalOfCityByQuarterThreeOrderByCaNamAsc();
                        if (!TableBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find table booking by Quarter 3: - no limit - asc"
                            });
                        }
                        finalDataArray = TableBookingTotalQuarterRes;
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getTableBookingTotalOfCityByQuarterThreeOrderByCaNamAsc!",
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
                        const TableBookingTotalQuarterRes = await getTableBookingTotalOfCityByQuarterFourOrderByCaNamDescAndLimit(5);
                        if (!TableBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find table booking by Quarter 3: -limit 5 - desc"
                            });
                        }
                        finalDataArray = TableBookingTotalQuarterRes;
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getTableBookingTotalOfCityByQuarterFourOrderByCaNamDescAndLimit 5!",
                            error: err
                        });
                    }
                }
                if (limit === "ten") {
                    // Quarter 4: -limit 10 - desc
                    try {
                        const TableBookingTotalQuarterRes = await getTableBookingTotalOfCityByQuarterFourOrderByCaNamDescAndLimit(10);
                        if (!TableBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find table booking by Quarter 4: -limit 10 - desc"
                            });
                        }
                        finalDataArray = TableBookingTotalQuarterRes;
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getTableBookingTotalOfCityByQuarterFourOrderByCaNamDescAndLimit 10!",
                            error: err
                        });
                    }
                }
                if (limit === "all") {
                    // Quarter 4: - no limit - desc
                    try {
                        const TableBookingTotalQuarterRes = await getTableBookingTotalOfCityByQuarterFourOrderByCaNamDesc();
                        if (!TableBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find table booking by Quarter 4: - no limit - desc"
                            });
                        }
                        finalDataArray = TableBookingTotalQuarterRes;
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getTableBookingTotalOfCityByQuarterFourOrderByCaNamDesc!",
                            error: err
                        });
                    }
                }
            }
            if (sortWay === "asc") {
                if (limit === "five") {
                    // Quarter 4: -limit 5 - asc
                    try {
                        const TableBookingTotalQuarterRes = await getTableBookingTotalOfCityByQuarterFourOrderByCaNamAscAndLimit(5);
                        if (!TableBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find table booking by Quarter 4: -limit 5 - asc"
                            });
                        }
                        finalDataArray = TableBookingTotalQuarterRes;
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getTableBookingTotalOfCityByQuarterFourOrderByCaNamAscAndLimit 5!",
                            error: err
                        });
                    }
                }
                if (limit === "ten") {
                    // Quarter 4: -limit 10 - asc
                    try {
                        const TableBookingTotalQuarterRes = await getTableBookingTotalOfCityByQuarterFourOrderByCaNamAscAndLimit(10);
                        if (!TableBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find table booking by Quarter 4: -limit 10 - asc"
                            });
                        }
                        finalDataArray = TableBookingTotalQuarterRes;
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getTableBookingTotalOfCityByQuarterFourOrderByCaNamAscAndLimit 10!",
                            error: err
                        });
                    }
                }
                if (limit === "all") {
                    // Quarter 4: - no limit - asc
                    try {
                        const TableBookingTotalQuarterRes = await getTableBookingTotalOfCityByQuarterFourOrderByCaNamAsc();
                        if (!TableBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find table booking by Quarter 4: - no limit - asc"
                            });
                        }
                        finalDataArray = TableBookingTotalQuarterRes;
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getTableBookingTotalOfCityByQuarterFourOrderByCaNamAsc!",
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
                monthArray: monthInQuarterArray
            }
        });
    },
}