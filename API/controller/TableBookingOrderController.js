const { getTableBookingOrders, createTableBookingOrder, findTableBookingOrder, getTableBookingsAndDetail, getQuantityTableBookings, findTableBookingByIdOrCustomerEmailOrCustomerPhoneOrCustomerName, findTableBookingById, findTableBookingOrderByIdCheckIn, updateTableBookingOrderInfoWhenCheckInSuccess, updateTableBookingOrderState, updateTableBookingOrderFinishDateWhenCheckOutSuccess, getDistinctDateInTableBookingOrderFromDateToDate, getLimitTableBookingTotalOfCityForEachQuarter, getTableBookingTotalOfCityByDateAndLimitAsc, getTableBookingTotalOfCityByDateAndAsc, getTableBookingTotalOfCityByDateAndLimitDesc, getTableBookingTotalOfCityByDateAndDesc, getTableBookingTotalOfCityByDateByListDate, getTableBookingTotalOfCityByDateByListDateNoLimit, getTableBookingTotalOfCityByQuarterOneOrderByCaNamDescAndLimit, getTableBookingTotalOfCityByQuarterOneOrderByCaNamDesc, getTableBookingTotalOfCityByQuarterOneOrderByCaNamAscAndLimit, getTableBookingTotalOfCityByQuarterOneOrderByCaNamAsc, getTableBookingTotalOfCityByQuarterTwoOrderByCaNamDescAndLimit, getTableBookingTotalOfCityByQuarterTwoOrderByCaNamDesc, getTableBookingTotalOfCityByQuarterTwoOrderByCaNamAscAndLimit, getTableBookingTotalOfCityByQuarterTwoOrderByCaNamAsc, getTableBookingTotalOfCityByQuarterThreeOrderByCaNamDescAndLimit, getTableBookingTotalOfCityByQuarterThreeOrderByCaNamDesc, getTableBookingTotalOfCityByQuarterThreeOrderByCaNamAscAndLimit, getTableBookingTotalOfCityByQuarterThreeOrderByCaNamAsc, getTableBookingTotalOfCityByQuarterFourOrderByCaNamDescAndLimit, getTableBookingTotalOfCityByQuarterFourOrderByCaNamDesc, getTableBookingTotalOfCityByQuarterFourOrderByCaNamAscAndLimit, getTableBookingTotalOfCityByQuarterFourOrderByCaNamAsc, getTableBookingTotalByMonth, getTableBookingOrderByCityId, getTableBookingTotalByDate, getTableBookingOrderFromDateToDate, getTableBookingOrderOfQuarter, getTableBookingOrderByDate, getTableBookingOrderByQuarterAndCityId, getTableBookingTotalOfTypeByQuarterOneOrderByCaNam, getTableBookingOrderByQuarterAndTableTypeName, getTableBookingTotalOfTypeByQuarterTwoOrderByCaNam, getTableBookingTotalOfTypeByQuarterThreeOrderByCaNam, getTableBookingTotalOfTypeByQuarterFourOrderByCaNam, getTableBookingTotalOfTypeByDate, getTableBookingOrderByDateAndTableTypeName, getTableBookingTotalOfTypeByDateByListDate, getTableBookingTotalOfCustomerByQuarterOneOrderByCaNam, getTableBookingOrderByQuarterAndCustomerId, getTableBookingTotalOfCustomerByQuarterTwoOrderByCaNam, getTableBookingTotalOfCustomerByQuarterThreeOrderByCaNam, getTableBookingTotalOfCustomerByQuarterFourOrderByCaNam, getTableBookingOrderByDateAndCustomerId, getTableBookingTotalOfCustomerByDateByListDate, getTableBookingTotalOfCustomerByDate } = require("../service/TableBookingOrderService");
// NODE Mailer
var nodemailer = require('nodemailer');
const { getCustomerByCustomerId, findCustomerByEmailOrPhoneNumber, findCustomerInTableBookingOrder } = require("../service/CustomerService");
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
                var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + (today.getDate());
                var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                var datetime = date + ' ' + time;
                var checkInDate = new Date(datetime);
                checkInDate.setTime(checkInDate.getTime() - new Date().getTimezoneOffset() * 60 * 1000);
                dateCheckinRes.setTime(dateCheckinRes.getTime() - new Date().getTimezoneOffset() * 60 * 1000);
                // Không cho checkin sớm hơn thời gian muốn nhận bàn table_booking_order_checkin_date
                console.log("checkInDate < dateCheckinRes: ", checkInDate, dateCheckinRes)
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

            var tableBookingOrderList = [];
            // Lấy danh sách đặt bàn chi tiết
            try {
                const tableBookingOrderListRes = await getTableBookingOrderFromDateToDate(dateFrom, dateTo);
                if (!tableBookingOrderListRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't find table booking order from date to date"
                    });
                }
                tableBookingOrderList = tableBookingOrderListRes;
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when getTableBookingOrderFromDateToDate!",
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
                    tableBookingOrderList: tableBookingOrderList
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

        var tableBookingOrderList = [];
        // Lấy danh sách đặt bàn chi tiết
        try {
            const tableBookingOrderListRes = await getTableBookingOrderOfQuarter(quarter);
            if (!tableBookingOrderListRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find table booking order of quarter"
                });
            }
            tableBookingOrderList = tableBookingOrderListRes;
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when getTableBookingOrderOfQuarter!",
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
                tableBookingOrderList: tableBookingOrderList
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
                            // Lấy đơn đặt bàn cho từng Ngày
                            try {
                                const tableBookingByDateRes = await getTableBookingOrderByDate(date);
                                if (!tableBookingByDateRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find table booking by date"
                                    });
                                }
                                finalArray.push({
                                    date: date,
                                    data: totalRes,
                                    tableBookingOrderDetailList: tableBookingByDateRes
                                });
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getTableBookingOrderByDate!",
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
                            const totalRes = await getTableBookingTotalOfCityByDateAndLimitAsc(date, 10);
                            if (!totalRes) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Cann't find table booking total by date"
                                });
                            }
                            // Lấy đơn đặt bàn cho từng Ngày
                            try {
                                const tableBookingByDateRes = await getTableBookingOrderByDate(date);
                                if (!tableBookingByDateRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find table booking by date"
                                    });
                                }
                                finalArray.push({
                                    date: date,
                                    data: totalRes,
                                    tableBookingOrderDetailList: tableBookingByDateRes
                                });
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getTableBookingOrderByDate!",
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
                            const totalRes = await getTableBookingTotalOfCityByDateAndAsc(date);
                            if (!totalRes) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Cann't find table booking total by date"
                                });
                            }
                            // Lấy đơn đặt bàn cho từng Ngày
                            try {
                                const tableBookingByDateRes = await getTableBookingOrderByDate(date);
                                if (!tableBookingByDateRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find table booking by date"
                                    });
                                }
                                finalArray.push({
                                    date: date,
                                    data: totalRes,
                                    tableBookingOrderDetailList: tableBookingByDateRes
                                });
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getTableBookingOrderByDate!",
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
                            const totalRes = await getTableBookingTotalOfCityByDateAndLimitDesc(date, 5);
                            if (!totalRes) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Cann't find table booking total by date"
                                });
                            }
                            // Lấy đơn đặt bàn cho từng Ngày
                            try {
                                const tableBookingByDateRes = await getTableBookingOrderByDate(date);
                                if (!tableBookingByDateRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find table booking by date"
                                    });
                                }
                                finalArray.push({
                                    date: date,
                                    data: totalRes,
                                    tableBookingOrderDetailList: tableBookingByDateRes
                                });
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getTableBookingOrderByDate!",
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
                            const totalRes = await getTableBookingTotalOfCityByDateAndLimitDesc(date, 10);
                            if (!totalRes) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Cann't find table booking total by date"
                                });
                            }
                            // Lấy đơn đặt bàn cho từng Ngày
                            try {
                                const tableBookingByDateRes = await getTableBookingOrderByDate(date);
                                if (!tableBookingByDateRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find table booking by date"
                                    });
                                }
                                finalArray.push({
                                    date: date,
                                    data: totalRes,
                                    tableBookingOrderDetailList: tableBookingByDateRes
                                });
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getTableBookingOrderByDate!",
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
                            const totalRes = await getTableBookingTotalOfCityByDateAndDesc(date);
                            if (!totalRes) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Cann't find table booking total by date"
                                });
                            }
                            // Lấy đơn đặt bàn cho từng Ngày
                            try {
                                const tableBookingByDateRes = await getTableBookingOrderByDate(date);
                                if (!tableBookingByDateRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find table booking by date"
                                    });
                                }
                                finalArray.push({
                                    date: date,
                                    data: totalRes,
                                    tableBookingOrderDetailList: tableBookingByDateRes
                                });
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getTableBookingOrderByDate!",
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
        let tableBookingOrderDetailList = [];
        // Nếu là quý 1
        if (quarter === 1) {
            if (sortWay === "desc") {
                if (limit === "five") {
                    // Quarter 1: -limit 5 - desc
                    try {
                        const tableBookingTotalQuarterRes = await getTableBookingTotalOfCityByQuarterOneOrderByCaNamDescAndLimit(5);
                        if (!tableBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find table booking by Quarter 1: -limit 5 - desc"
                            });
                        }
                        finalDataArray = tableBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt bàn chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < tableBookingTotalQuarterRes.length; j++) {
                            const cityId = tableBookingTotalQuarterRes[j].city_id;
                            try {
                                const tableBookingOrderListRes = await getTableBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!tableBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find table booking order list by quarter and city id"
                                    });
                                }
                                tableBookingOrderListRes.map((tableBookingOrder, key) => {
                                    tableBookingOrderDetailList.push(tableBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getTableBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
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
                        const tableBookingTotalQuarterRes = await getTableBookingTotalOfCityByQuarterOneOrderByCaNamDescAndLimit(10);
                        if (!tableBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find table booking by Quarter 1: -limit 10 - desc"
                            });
                        }
                        finalDataArray = tableBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt bàn chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < tableBookingTotalQuarterRes.length; j++) {
                            const cityId = tableBookingTotalQuarterRes[j].city_id;
                            try {
                                const tableBookingOrderListRes = await getTableBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!tableBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find table booking order list by quarter and city id"
                                    });
                                }
                                tableBookingOrderListRes.map((tableBookingOrder, key) => {
                                    tableBookingOrderDetailList.push(tableBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getTableBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
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
                        const tableBookingTotalQuarterRes = await getTableBookingTotalOfCityByQuarterOneOrderByCaNamDesc();
                        if (!tableBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find table booking by Quarter 1: - no limit - desc"
                            });
                        }
                        finalDataArray = tableBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt bàn chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < tableBookingTotalQuarterRes.length; j++) {
                            const cityId = tableBookingTotalQuarterRes[j].city_id;
                            try {
                                const tableBookingOrderListRes = await getTableBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!tableBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find table booking order list by quarter and city id"
                                    });
                                }
                                tableBookingOrderListRes.map((tableBookingOrder, key) => {
                                    tableBookingOrderDetailList.push(tableBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getTableBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
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
                        const tableBookingTotalQuarterRes = await getTableBookingTotalOfCityByQuarterOneOrderByCaNamAscAndLimit(5);
                        if (!tableBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find table booking by Quarter 1: -limit 5 - asc"
                            });
                        }
                        finalDataArray = tableBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt bàn chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < tableBookingTotalQuarterRes.length; j++) {
                            const cityId = tableBookingTotalQuarterRes[j].city_id;
                            try {
                                const tableBookingOrderListRes = await getTableBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!tableBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find table booking order list by quarter and city id"
                                    });
                                }
                                tableBookingOrderListRes.map((tableBookingOrder, key) => {
                                    tableBookingOrderDetailList.push(tableBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getTableBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
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
                        const tableBookingTotalQuarterRes = await getTableBookingTotalOfCityByQuarterOneOrderByCaNamAscAndLimit(10);
                        if (!tableBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find table booking by Quarter 1: -limit 10 - asc"
                            });
                        }
                        finalDataArray = tableBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt bàn chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < tableBookingTotalQuarterRes.length; j++) {
                            const cityId = tableBookingTotalQuarterRes[j].city_id;
                            try {
                                const tableBookingOrderListRes = await getTableBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!tableBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find table booking order list by quarter and city id"
                                    });
                                }
                                tableBookingOrderListRes.map((tableBookingOrder, key) => {
                                    tableBookingOrderDetailList.push(tableBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getTableBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
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
                        const tableBookingTotalQuarterRes = await getTableBookingTotalOfCityByQuarterOneOrderByCaNamAsc();
                        if (!tableBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find table booking by Quarter 1: - no limit - asc"
                            });
                        }
                        finalDataArray = tableBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt bàn chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < tableBookingTotalQuarterRes.length; j++) {
                            const cityId = tableBookingTotalQuarterRes[j].city_id;
                            try {
                                const tableBookingOrderListRes = await getTableBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!tableBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find table booking order list by quarter and city id"
                                    });
                                }
                                tableBookingOrderListRes.map((tableBookingOrder, key) => {
                                    tableBookingOrderDetailList.push(tableBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getTableBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
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
                        const tableBookingTotalQuarterRes = await getTableBookingTotalOfCityByQuarterTwoOrderByCaNamDescAndLimit(5);
                        if (!tableBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find table booking by Quarter 2: -limit 5 - desc"
                            });
                        }
                        finalDataArray = tableBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt bàn chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < tableBookingTotalQuarterRes.length; j++) {
                            const cityId = tableBookingTotalQuarterRes[j].city_id;
                            try {
                                const tableBookingOrderListRes = await getTableBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!tableBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find table booking order list by quarter and city id"
                                    });
                                }
                                tableBookingOrderListRes.map((tableBookingOrder, key) => {
                                    tableBookingOrderDetailList.push(tableBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getTableBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
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
                        const tableBookingTotalQuarterRes = await getTableBookingTotalOfCityByQuarterTwoOrderByCaNamDescAndLimit(10);
                        if (!tableBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find table booking by Quarter 2: -limit 10 - desc"
                            });
                        }
                        finalDataArray = tableBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt bàn chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < tableBookingTotalQuarterRes.length; j++) {
                            const cityId = tableBookingTotalQuarterRes[j].city_id;
                            try {
                                const tableBookingOrderListRes = await getTableBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!tableBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find table booking order list by quarter and city id"
                                    });
                                }
                                tableBookingOrderListRes.map((tableBookingOrder, key) => {
                                    tableBookingOrderDetailList.push(tableBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getTableBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
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
                        const tableBookingTotalQuarterRes = await getTableBookingTotalOfCityByQuarterTwoOrderByCaNamDesc();
                        if (!tableBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find table booking by Quarter 2: - no limit - desc"
                            });
                        }
                        finalDataArray = tableBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt bàn chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < tableBookingTotalQuarterRes.length; j++) {
                            const cityId = tableBookingTotalQuarterRes[j].city_id;
                            try {
                                const tableBookingOrderListRes = await getTableBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!tableBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find table booking order list by quarter and city id"
                                    });
                                }
                                tableBookingOrderListRes.map((tableBookingOrder, key) => {
                                    tableBookingOrderDetailList.push(tableBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getTableBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
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
                        const tableBookingTotalQuarterRes = await getTableBookingTotalOfCityByQuarterTwoOrderByCaNamAscAndLimit(5);
                        if (!tableBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find table booking by Quarter 2: -limit 5 - asc"
                            });
                        }
                        finalDataArray = tableBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt bàn chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < tableBookingTotalQuarterRes.length; j++) {
                            const cityId = tableBookingTotalQuarterRes[j].city_id;
                            try {
                                const tableBookingOrderListRes = await getTableBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!tableBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find table booking order list by quarter and city id"
                                    });
                                }
                                tableBookingOrderListRes.map((tableBookingOrder, key) => {
                                    tableBookingOrderDetailList.push(tableBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getTableBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
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
                        const tableBookingTotalQuarterRes = await getTableBookingTotalOfCityByQuarterTwoOrderByCaNamAscAndLimit(10);
                        if (!tableBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find table booking by Quarter 2: -limit 10 - asc"
                            });
                        }
                        finalDataArray = tableBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt bàn chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < tableBookingTotalQuarterRes.length; j++) {
                            const cityId = tableBookingTotalQuarterRes[j].city_id;
                            try {
                                const tableBookingOrderListRes = await getTableBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!tableBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find table booking order list by quarter and city id"
                                    });
                                }
                                tableBookingOrderListRes.map((tableBookingOrder, key) => {
                                    tableBookingOrderDetailList.push(tableBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getTableBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
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
                        const tableBookingTotalQuarterRes = await getTableBookingTotalOfCityByQuarterTwoOrderByCaNamAsc();
                        if (!tableBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find table booking by Quarter 2: - no limit - asc"
                            });
                        }
                        finalDataArray = tableBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt bàn chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < tableBookingTotalQuarterRes.length; j++) {
                            const cityId = tableBookingTotalQuarterRes[j].city_id;
                            try {
                                const tableBookingOrderListRes = await getTableBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!tableBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find table booking order list by quarter and city id"
                                    });
                                }
                                tableBookingOrderListRes.map((tableBookingOrder, key) => {
                                    tableBookingOrderDetailList.push(tableBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getTableBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
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
                        const tableBookingTotalQuarterRes = await getTableBookingTotalOfCityByQuarterThreeOrderByCaNamDescAndLimit(5);
                        if (!tableBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find table booking by Quarter 3: -limit 5 - desc"
                            });
                        }
                        finalDataArray = tableBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt bàn chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < tableBookingTotalQuarterRes.length; j++) {
                            const cityId = tableBookingTotalQuarterRes[j].city_id;
                            try {
                                const tableBookingOrderListRes = await getTableBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!tableBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find table booking order list by quarter and city id"
                                    });
                                }
                                tableBookingOrderListRes.map((tableBookingOrder, key) => {
                                    tableBookingOrderDetailList.push(tableBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getTableBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
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
                        const tableBookingTotalQuarterRes = await getTableBookingTotalOfCityByQuarterThreeOrderByCaNamDescAndLimit(10);
                        if (!tableBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find table booking by Quarter 3: -limit 10 - desc"
                            });
                        }
                        finalDataArray = tableBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt bàn chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < tableBookingTotalQuarterRes.length; j++) {
                            const cityId = tableBookingTotalQuarterRes[j].city_id;
                            try {
                                const tableBookingOrderListRes = await getTableBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!tableBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find table booking order list by quarter and city id"
                                    });
                                }
                                tableBookingOrderListRes.map((tableBookingOrder, key) => {
                                    tableBookingOrderDetailList.push(tableBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getTableBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
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
                        const tableBookingTotalQuarterRes = await getTableBookingTotalOfCityByQuarterThreeOrderByCaNamDesc();
                        if (!tableBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find table booking by Quarter 3: - no limit - desc"
                            });
                        }
                        finalDataArray = tableBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt bàn chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < tableBookingTotalQuarterRes.length; j++) {
                            const cityId = tableBookingTotalQuarterRes[j].city_id;
                            try {
                                const tableBookingOrderListRes = await getTableBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!tableBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find table booking order list by quarter and city id"
                                    });
                                }
                                tableBookingOrderListRes.map((tableBookingOrder, key) => {
                                    tableBookingOrderDetailList.push(tableBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getTableBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
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
                        const tableBookingTotalQuarterRes = await getTableBookingTotalOfCityByQuarterThreeOrderByCaNamAscAndLimit(5);
                        if (!tableBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find table booking by Quarter 3: -limit 5 - asc"
                            });
                        }
                        finalDataArray = tableBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt bàn chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < tableBookingTotalQuarterRes.length; j++) {
                            const cityId = tableBookingTotalQuarterRes[j].city_id;
                            try {
                                const tableBookingOrderListRes = await getTableBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!tableBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find table booking order list by quarter and city id"
                                    });
                                }
                                tableBookingOrderListRes.map((tableBookingOrder, key) => {
                                    tableBookingOrderDetailList.push(tableBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getTableBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
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
                        const tableBookingTotalQuarterRes = await getTableBookingTotalOfCityByQuarterThreeOrderByCaNamAscAndLimit(10);
                        if (!tableBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find table booking by Quarter 3: -limit 10 - asc"
                            });
                        }
                        finalDataArray = tableBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt bàn chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < tableBookingTotalQuarterRes.length; j++) {
                            const cityId = tableBookingTotalQuarterRes[j].city_id;
                            try {
                                const tableBookingOrderListRes = await getTableBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!tableBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find table booking order list by quarter and city id"
                                    });
                                }
                                tableBookingOrderListRes.map((tableBookingOrder, key) => {
                                    tableBookingOrderDetailList.push(tableBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getTableBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
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
                        const tableBookingTotalQuarterRes = await getTableBookingTotalOfCityByQuarterThreeOrderByCaNamAsc();
                        if (!tableBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find table booking by Quarter 3: - no limit - asc"
                            });
                        }
                        finalDataArray = tableBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt bàn chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < tableBookingTotalQuarterRes.length; j++) {
                            const cityId = tableBookingTotalQuarterRes[j].city_id;
                            try {
                                const tableBookingOrderListRes = await getTableBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!tableBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find table booking order list by quarter and city id"
                                    });
                                }
                                tableBookingOrderListRes.map((tableBookingOrder, key) => {
                                    tableBookingOrderDetailList.push(tableBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getTableBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
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
                        const tableBookingTotalQuarterRes = await getTableBookingTotalOfCityByQuarterFourOrderByCaNamDescAndLimit(5);
                        if (!tableBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find table booking by Quarter 3: -limit 5 - desc"
                            });
                        }
                        finalDataArray = tableBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt bàn chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < tableBookingTotalQuarterRes.length; j++) {
                            const cityId = tableBookingTotalQuarterRes[j].city_id;
                            try {
                                const tableBookingOrderListRes = await getTableBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!tableBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find table booking order list by quarter and city id"
                                    });
                                }
                                tableBookingOrderListRes.map((tableBookingOrder, key) => {
                                    tableBookingOrderDetailList.push(tableBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getTableBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
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
                        const tableBookingTotalQuarterRes = await getTableBookingTotalOfCityByQuarterFourOrderByCaNamDescAndLimit(10);
                        if (!tableBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find table booking by Quarter 4: -limit 10 - desc"
                            });
                        }
                        finalDataArray = tableBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt bàn chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < tableBookingTotalQuarterRes.length; j++) {
                            const cityId = tableBookingTotalQuarterRes[j].city_id;
                            try {
                                const tableBookingOrderListRes = await getTableBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!tableBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find table booking order list by quarter and city id"
                                    });
                                }
                                tableBookingOrderListRes.map((tableBookingOrder, key) => {
                                    tableBookingOrderDetailList.push(tableBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getTableBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
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
                        const tableBookingTotalQuarterRes = await getTableBookingTotalOfCityByQuarterFourOrderByCaNamDesc();
                        if (!tableBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find table booking by Quarter 4: - no limit - desc"
                            });
                        }
                        finalDataArray = tableBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt bàn chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < tableBookingTotalQuarterRes.length; j++) {
                            const cityId = tableBookingTotalQuarterRes[j].city_id;
                            try {
                                const tableBookingOrderListRes = await getTableBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!tableBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find table booking order list by quarter and city id"
                                    });
                                }
                                tableBookingOrderListRes.map((tableBookingOrder, key) => {
                                    tableBookingOrderDetailList.push(tableBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getTableBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
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
                        const tableBookingTotalQuarterRes = await getTableBookingTotalOfCityByQuarterFourOrderByCaNamAscAndLimit(5);
                        if (!tableBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find table booking by Quarter 4: -limit 5 - asc"
                            });
                        }
                        finalDataArray = tableBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt bàn chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < tableBookingTotalQuarterRes.length; j++) {
                            const cityId = tableBookingTotalQuarterRes[j].city_id;
                            try {
                                const tableBookingOrderListRes = await getTableBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!tableBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find table booking order list by quarter and city id"
                                    });
                                }
                                tableBookingOrderListRes.map((tableBookingOrder, key) => {
                                    tableBookingOrderDetailList.push(tableBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getTableBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
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
                        const tableBookingTotalQuarterRes = await getTableBookingTotalOfCityByQuarterFourOrderByCaNamAscAndLimit(10);
                        if (!tableBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find table booking by Quarter 4: -limit 10 - asc"
                            });
                        }
                        finalDataArray = tableBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt bàn chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < tableBookingTotalQuarterRes.length; j++) {
                            const cityId = tableBookingTotalQuarterRes[j].city_id;
                            try {
                                const tableBookingOrderListRes = await getTableBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!tableBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find table booking order list by quarter and city id"
                                    });
                                }
                                tableBookingOrderListRes.map((tableBookingOrder, key) => {
                                    tableBookingOrderDetailList.push(tableBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getTableBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
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
                        const tableBookingTotalQuarterRes = await getTableBookingTotalOfCityByQuarterFourOrderByCaNamAsc();
                        if (!tableBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find table booking by Quarter 4: - no limit - asc"
                            });
                        }
                        finalDataArray = tableBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt bàn chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < tableBookingTotalQuarterRes.length; j++) {
                            const cityId = tableBookingTotalQuarterRes[j].city_id;
                            try {
                                const tableBookingOrderListRes = await getTableBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!tableBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find table booking order list by quarter and city id"
                                    });
                                }
                                tableBookingOrderListRes.map((tableBookingOrder, key) => {
                                    tableBookingOrderDetailList.push(tableBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getTableBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
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
                monthArray: monthInQuarterArray,
                tableBookingOrderDetailList: tableBookingOrderDetailList
            }
        });
    },


    // -------------------------------------------- THỐNG KÊ LOẠI BÀN --------------------------------------------
    // Admin: Quản lý đặt bàn - Thống kê doanh thu Theo Loại
    getStatisticTableBookingTotalOfTypeByQuarter: async (req, res) => {
        const quarter = req.body.quarter;
        const sortWay = req.body.sortWay;
        const tableTypeList = req.body.tableTypeList;
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
        if (!tableTypeList) {
            return res.status(400).json({
                status: "fail",
                message: "Loại bàn không hợp lệ!"
            });
        }
        let finalDataArray = [];
        // Nếu là quý 1
        if (quarter === 1) {
            // Quarter 1:
            for (var k = 0; k < tableTypeList.length; k++) {
                const tableTypeName = tableTypeList[k];
                // Lấy thống kê doanh thu của Loại bàn theo quý
                try {
                    const tableBookingTotalQuarterRes = await getTableBookingTotalOfTypeByQuarterOneOrderByCaNam(tableTypeName);
                    if (!tableBookingTotalQuarterRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't find table booking by Quarter 1"
                        });
                    }
                    // Lấy danh sách đơn đặt bàn chi tiết cho từng Loại bàn thuộc quý đó 
                    try {
                        const tableBookingOrderListRes = await getTableBookingOrderByQuarterAndTableTypeName(quarter, tableTypeName);
                        if (!tableBookingOrderListRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find table booking order list by quarter and table type name"
                            });
                        }
                        finalDataArray.push({
                            tableTypeName: tableTypeName,
                            totalData: tableBookingTotalQuarterRes,
                            tableBookingOrderList: tableBookingOrderListRes
                        });
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getTableBookingOrderByQuarterAndTableTypeName!",
                            error: err
                        });
                    }
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when getTableBookingTotalOfTypeByQuarterOneOrderByCaNam!",
                        error: err
                    });
                }
            }
        }
        // Nếu là quý 2
        if (quarter === 2) {
            // Quarter 2:
            for (var k = 0; k < tableTypeList.length; k++) {
                const tableTypeName = tableTypeList[k];
                // Lấy thống kê doanh thu của Loại bàn theo quý
                try {
                    const tableBookingTotalQuarterRes = await getTableBookingTotalOfTypeByQuarterTwoOrderByCaNam(tableTypeName);
                    if (!tableBookingTotalQuarterRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't find table booking by Quarter 2"
                        });
                    }
                    // Lấy danh sách đơn đặt bàn chi tiết cho từng Loại bàn thuộc quý đó 
                    try {
                        const tableBookingOrderListRes = await getTableBookingOrderByQuarterAndTableTypeName(quarter, tableTypeName);
                        if (!tableBookingOrderListRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find table booking order list by quarter and table type name"
                            });
                        }
                        finalDataArray.push({
                            tableTypeName: tableTypeName,
                            totalData: tableBookingTotalQuarterRes,
                            tableBookingOrderList: tableBookingOrderListRes
                        });
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getTableBookingOrderByQuarterAndTableTypeName!",
                            error: err
                        });
                    }
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when getTableBookingTotalOfTypeByQuarterTwoOrderByCaNam!",
                        error: err
                    });
                }
            }
        }
        // Nếu là quý 3
        if (quarter === 3) {
            // Quarter 3:
            for (var k = 0; k < tableTypeList.length; k++) {
                const tableTypeName = tableTypeList[k];
                // Lấy thống kê doanh thu của Loại bàn theo quý
                try {
                    const tableBookingTotalQuarterRes = await getTableBookingTotalOfTypeByQuarterThreeOrderByCaNam(tableTypeName);
                    if (!tableBookingTotalQuarterRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't find table booking by Quarter 3"
                        });
                    }
                    // Lấy danh sách đơn đặt bàn chi tiết cho từng Loại bàn thuộc quý đó 
                    try {
                        const tableBookingOrderListRes = await getTableBookingOrderByQuarterAndTableTypeName(quarter, tableTypeName);
                        if (!tableBookingOrderListRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find table booking order list by quarter and table type name"
                            });
                        }
                        finalDataArray.push({
                            tableTypeName: tableTypeName,
                            totalData: tableBookingTotalQuarterRes,
                            tableBookingOrderList: tableBookingOrderListRes
                        });
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getTableBookingOrderByQuarterAndTableTypeName!",
                            error: err
                        });
                    }
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when getTableBookingTotalOfTypeByQuarterThreeOrderByCaNam!",
                        error: err
                    });
                }
            }
        }
        // Nếu là quý 4
        if (quarter === 4) {
            // Quarter 4:
            for (var k = 0; k < tableTypeList.length; k++) {
                const tableTypeName = tableTypeList[k];
                // Lấy thống kê doanh thu của Loại bàn theo quý
                try {
                    const tableBookingTotalQuarterRes = await getTableBookingTotalOfTypeByQuarterFourOrderByCaNam(tableTypeName);
                    if (!tableBookingTotalQuarterRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't find table booking by Quarter 1"
                        });
                    }
                    // Lấy danh sách đơn đặt bàn chi tiết cho từng Loại bàn thuộc quý đó 
                    try {
                        const tableBookingOrderListRes = await getTableBookingOrderByQuarterAndTableTypeName(quarter, tableTypeName);
                        if (!tableBookingOrderListRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find table booking order list by quarter and table type name"
                            });
                        }
                        finalDataArray.push({
                            tableTypeName: tableTypeName,
                            totalData: tableBookingTotalQuarterRes,
                            tableBookingOrderList: tableBookingOrderListRes
                        });
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getTableBookingOrderByQuarterAndTableTypeName!",
                            error: err
                        });
                    }
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when getTableBookingTotalOfTypeByQuarterFourOrderByCaNam!",
                        error: err
                    });
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

        // Sort
        if (sortWay === "asc") {
            finalDataArray = finalDataArray.sort((a, b) => a.totalData.canam - b.totalData.canam);
        } else {
            finalDataArray = finalDataArray.sort((a, b) => b.totalData.canam - a.totalData.canam);
        }

        // Success
        return res.status(200).json({
            status: "success",
            message: "Thống kê doanh thu theo tháng của Loại bàn thành công!",
            data: {
                statisticDate: statisticDate,
                quarter: quarter,
                sortWay: sortWay,
                data: finalDataArray,
                monthArray: monthInQuarterArray
            }
        });
    },
    // Admin: Quản lý đặt bàn - Thống kê doanh thu Theo Loại và Ngày thống kê
    getStatisticTableBookingTotalOfTypeByDate: async (req, res) => {
        const dateFrom = req.body.dateFrom;
        const dateTo = req.body.dateTo;
        const sortWay = req.body.sortWay;
        const tableTypeList = req.body.tableTypeList;
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
        if (!tableTypeList) {
            return res.status(400).json({
                status: "fail",
                message: "Loại bàn không hợp lệ!"
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

            // Lấy ngày hiện tại FORMAT: '2022-05-05 13:48:12' giống CSDL
            var todayCheckIn = new Date();
            var dateCheckIn = todayCheckIn.getFullYear() + '-' + (todayCheckIn.getMonth() + 1) + '-' + todayCheckIn.getDate();
            var timeCheckIn = todayCheckIn.getHours() + ":" + todayCheckIn.getMinutes() + ":" + todayCheckIn.getSeconds();
            var statisticDate = dateCheckIn + ' ' + timeCheckIn;

            let finalArray = [];
            let finalTableBookingOrderList = [];
            for (var i = 0; i < fromDateToDateListRes.length; i++) {
                const date = fromDateToDateListRes[i].finishDate;
                var dataArray = [];
                for (var j = 0; j < tableTypeList.length; j++) {
                    const tableTypeName = tableTypeList[j];
                    try {
                        const totalRes = await getTableBookingTotalOfTypeByDate(date, tableTypeName);
                        const totalCaNamRes = totalRes.canam;
                        if (!totalRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find table booking total type by date"
                            });
                        }
                        // Lấy đơn đặt bàn cho từng Ngày
                        try {
                            const tableBookingByDateRes = await getTableBookingOrderByDateAndTableTypeName(date, tableTypeName);
                            if (!tableBookingByDateRes) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Cann't find table booking by date"
                                });
                            }
                            dataArray.push({
                                totalCaNam: totalCaNamRes,
                                totalData: totalRes,
                                tableBookingOrderDetailList: tableBookingByDateRes
                            });
                        } catch (err) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Error when getTableBookingOrderByDate!",
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
                    const tableBookingListRes = data.tableBookingOrderDetailList;
                    tableBookingListRes.map((tableBookingOrder) => {
                        finalTableBookingOrderList.push(tableBookingOrder);
                    })
                })
                // Sau khi lặp xong các room type trong 1 ngày thì cho vào mảng kết quả
                finalArray.push({
                    date: date,
                    dataArray: dataArray
                })
            }

            // Sort xong tách mảng ngày mới và mảng data sau sort
            let dateArray = []; //Lưu Mảng ngày sau khi đã sort theo doanh thu cả năm
            let dataTableArray = [];
            for (var i = 0; i < finalArray.length; i++) {
                dateArray.push(finalArray[i].date);
                dataTableArray.push(finalArray[i].dataArray);
            }
            // Mảng ngày mới thì lấy để đem truy vấn lấy từng cột dữ liệu làm biểu đồ
            let statisticArray = [];
            for (var i = 0; i < tableTypeList.length; i++) {
                const tableTypeName = tableTypeList[i];
                try {
                    const tableBookingTotalOfCityByDateRes = await getTableBookingTotalOfTypeByDateByListDate(fromDateToDateListRes, tableTypeName, sortWay);
                    if (!tableBookingTotalOfCityByDateRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't get test"
                        });
                    }
                    statisticArray.push(tableBookingTotalOfCityByDateRes);
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when getTableBookingTotalOfTypeByDateByListDate!",
                        error: err
                    });
                }
            }

            // Success
            return res.status(200).json({
                status: "success",
                message: "Thống kê doanh thu theo ngày của Thành phố theo Loại thành công!",
                data: {
                    statisticDate: statisticDate,
                    dateArray: dateArray,
                    dataArray: finalArray,
                    dateFrom: dateFrom,
                    dateTo: dateTo,
                    sortWay: sortWay,
                    statisticArray: statisticArray,
                    finalTableBookingOrderList: finalTableBookingOrderList
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

    // -------------------------------------------- THỐNG KÊ KHÁCH HÀNG --------------------------------------------
    // Admin: Quản lý đặt bàn - Thống kê doanh thu Theo Khách hàng
    getStatisticTableBookingTotalOfCustomerByQuarter: async (req, res) => {
        const quarter = req.body.quarter;
        const sortWay = req.body.sortWay;
        const customerInfo = req.body.customerInfo;
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
        if (!customerInfo) {
            return res.status(400).json({
                status: "fail",
                message: "Email/ Số điện thoại của Khách hàng không hợp lệ!"
            });
        }

        // Kiểm tra Khách hàng nào cần thống kê? Khách hàng có tồn tại hay không?
        var customerId;
        var customerName;
        try {
            const customerRes = await findCustomerByEmailOrPhoneNumber(customerInfo);
            if (!customerRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Khách hàng không tồn tại!"
                });
            }
            // Tìm được customer
            customerId = customerRes.customer_id;
            customerName = customerRes.customer_first_name + " " + customerRes.customer_last_name;

            // Kiểm tra Khách hàng này có đặt bàn không
            try {
                const isCustomerBooking = await findCustomerInTableBookingOrder(customerId);
                if (!isCustomerBooking) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Khách hàng chưa có thông tin Đặt bàn nào!"
                    });
                }
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when findCustomerInTableBookingOrder!",
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
        // Nếu là quý 1
        if (quarter === 1) {
            // Lấy thống kê doanh thu của Khách hàng theo quý
            try {
                const tableBookingTotalQuarterRes = await getTableBookingTotalOfCustomerByQuarterOneOrderByCaNam(customerId);
                if (!tableBookingTotalQuarterRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't find table booking by Quarter 1"
                    });
                }
                // Lấy danh sách đơn đặt bàn chi tiết cho từng Khách hàng thuộc quý đó 
                try {
                    const tableBookingOrderListRes = await getTableBookingOrderByQuarterAndCustomerId(quarter, customerId);
                    if (!tableBookingOrderListRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't find table booking order list by quarter and customer id"
                        });
                    }
                    var sortedListRes = tableBookingOrderListRes;
                    // Sort
                    if (sortWay === "asc") {
                        sortedListRes = sortedListRes.sort((a, b) => a.table_booking_order_total - b.table_booking_order_total);
                    } else {
                        sortedListRes = sortedListRes.sort((a, b) => b.table_booking_order_total - a.table_booking_order_total);
                    }

                    finalDataArray.push({
                        customerName: customerName,
                        totalData: tableBookingTotalQuarterRes,
                        tableBookingOrderList: sortedListRes
                    });
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when getTableBookingOrderByQuarterAndCustomerId!",
                        error: err
                    });
                }
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when getTableBookingTotalOfCustomerByQuarterOneOrderByCaNam!",
                    error: err
                });
            }
        }
        // Nếu là quý 2
        if (quarter === 2) {
            // Lấy thống kê doanh thu của Khách hàng theo quý
            try {
                const tableBookingTotalQuarterRes = await getTableBookingTotalOfCustomerByQuarterTwoOrderByCaNam(customerId);
                if (!tableBookingTotalQuarterRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't find table booking by Quarter 2"
                    });
                }
                // Lấy danh sách đơn đặt bàn chi tiết cho từng Khách hàng thuộc quý đó 
                try {
                    const tableBookingOrderListRes = await getTableBookingOrderByQuarterAndCustomerId(quarter, customerId);
                    if (!tableBookingOrderListRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't find table booking order list by quarter and customer id"
                        });
                    }
                    var sortedListRes = tableBookingOrderListRes;
                    // Sort
                    if (sortWay === "asc") {
                        sortedListRes = sortedListRes.sort((a, b) => a.table_booking_order_total - b.table_booking_order_total);
                    } else {
                        sortedListRes = sortedListRes.sort((a, b) => b.table_booking_order_total - a.table_booking_order_total);
                    }

                    finalDataArray.push({
                        customerName: customerName,
                        totalData: tableBookingTotalQuarterRes,
                        tableBookingOrderList: sortedListRes
                    });
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when getTableBookingOrderByQuarterAndCustomerId!",
                        error: err
                    });
                }
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when getTableBookingTotalOfCustomerByQuarterTwoOrderByCaNam!",
                    error: err
                });
            }
        }
        // Nếu là quý 3
        if (quarter === 3) {
            // Lấy thống kê doanh thu của Khách hàng theo quý
            try {
                const tableBookingTotalQuarterRes = await getTableBookingTotalOfCustomerByQuarterThreeOrderByCaNam(customerId);
                if (!tableBookingTotalQuarterRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't find table booking by Quarter 3"
                    });
                }
                // Lấy danh sách đơn đặt bàn chi tiết cho từng Khách hàng thuộc quý đó 
                try {
                    const tableBookingOrderListRes = await getTableBookingOrderByQuarterAndCustomerId(quarter, customerId);
                    if (!tableBookingOrderListRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't find table booking order list by quarter and customer id"
                        });
                    }
                    var sortedListRes = tableBookingOrderListRes;
                    // Sort
                    if (sortWay === "asc") {
                        sortedListRes = sortedListRes.sort((a, b) => a.table_booking_order_total - b.table_booking_order_total);
                    } else {
                        sortedListRes = sortedListRes.sort((a, b) => b.table_booking_order_total - a.table_booking_order_total);
                    }

                    finalDataArray.push({
                        customerName: customerName,
                        totalData: tableBookingTotalQuarterRes,
                        tableBookingOrderList: sortedListRes
                    });
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when getTableBookingOrderByQuarterAndCustomerId!",
                        error: err
                    });
                }
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when getTableBookingTotalOfCustomerByQuarterThreeOrderByCaNam!",
                    error: err
                });
            }
        }
        // Nếu là quý 4
        if (quarter === 4) {
            // Lấy thống kê doanh thu của Khách hàng theo quý
            try {
                const tableBookingTotalQuarterRes = await getTableBookingTotalOfCustomerByQuarterFourOrderByCaNam(customerId);
                if (!tableBookingTotalQuarterRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't find table booking by Quarter 4"
                    });
                }
                // Lấy danh sách đơn đặt bàn chi tiết cho từng Khách hàng thuộc quý đó 
                try {
                    const tableBookingOrderListRes = await getTableBookingOrderByQuarterAndCustomerId(quarter, customerId);
                    if (!tableBookingOrderListRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't find table booking order list by quarter and customer id"
                        });
                    }
                    var sortedListRes = tableBookingOrderListRes;
                    // Sort
                    if (sortWay === "asc") {
                        sortedListRes = sortedListRes.sort((a, b) => a.table_booking_order_total - b.table_booking_order_total);
                    } else {
                        sortedListRes = sortedListRes.sort((a, b) => b.table_booking_order_total - a.table_booking_order_total);
                    }

                    finalDataArray.push({
                        customerName: customerName,
                        totalData: tableBookingTotalQuarterRes,
                        tableBookingOrderList: sortedListRes
                    });
                } catch (err) {
                    console.log(err);
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when getTableBookingOrderByQuarterAndCustomerId!",
                        error: err
                    });
                }
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when getTableBookingTotalOfCustomerByQuarterFourOrderByCaNam!",
                    error: err
                });
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

        // Success
        return res.status(200).json({
            status: "success",
            message: "Thống kê doanh thu theo tháng của Khách hàng thành công!",
            data: {
                statisticDate: statisticDate,
                quarter: quarter,
                sortWay: sortWay,
                data: finalDataArray,
                monthArray: monthInQuarterArray
            }
        });
    },
    // Admin: Quản lý đặt bàn - Thống kê doanh thu Theo Khách hàng và Ngày thống kê
    getStatisticTableBookingTotalOfCustomerByDate: async (req, res) => {
        const dateFrom = req.body.dateFrom;
        const dateTo = req.body.dateTo;
        const sortWay = req.body.sortWay;
        const customerInfo = req.body.customerInfo;
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
        if (!customerInfo) {
            return res.status(400).json({
                status: "fail",
                message: "Email/ Số điện thoại của Khách hàng không hợp lệ!"
            });
        }

        // Kiểm tra Khách hàng nào cần thống kê? Khách hàng có tồn tại hay không?
        var customerId;
        var customerName;
        try {
            const customerRes = await findCustomerByEmailOrPhoneNumber(customerInfo);
            if (!customerRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Khách hàng không tồn tại!"
                });
            }
            // Tìm được customer
            customerId = customerRes.customer_id;
            customerName = customerRes.customer_first_name + " " + customerRes.customer_last_name;

            // Kiểm tra Khách hàng này có đặt bàn không
            try {
                const isCustomerBooking = await findCustomerInTableBookingOrder(customerId);
                if (!isCustomerBooking) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Khách hàng chưa có thông tin Đặt bàn nào!"
                    });
                }
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when findCustomerInTableBookingOrder!",
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

        // Lấy ngày trong table booking từ dateFrom đến dateTo
        try {
            const fromDateToDateListRes = await getDistinctDateInTableBookingOrderFromDateToDate(dateFrom, dateTo);
            if (!fromDateToDateListRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't get date list"
                });
            }

            // Lấy ngày hiện tại FORMAT: '2022-05-05 13:48:12' giống CSDL
            var todayCheckIn = new Date();
            var dateCheckIn = todayCheckIn.getFullYear() + '-' + (todayCheckIn.getMonth() + 1) + '-' + todayCheckIn.getDate();
            var timeCheckIn = todayCheckIn.getHours() + ":" + todayCheckIn.getMinutes() + ":" + todayCheckIn.getSeconds();
            var statisticDate = dateCheckIn + ' ' + timeCheckIn;

            let finalArray = [];
            let finalTableBookingOrderList = [];
            for (var i = 0; i < fromDateToDateListRes.length; i++) {
                const date = fromDateToDateListRes[i].finishDate;
                try {
                    const totalRes = await getTableBookingTotalOfCustomerByDate(date, customerId);
                    const totalCaNamRes = totalRes.canam;
                    if (!totalRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't find table booking total type by date"
                        });
                    }
                    // Lấy đơn đặt bàn cho từng Ngày
                    try {
                        const tableBookingByDateRes = await getTableBookingOrderByDateAndCustomerId(date, customerId);
                        if (!tableBookingByDateRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find table booking by date"
                            });
                        }
                        // Sau khi lặp xong các room type trong 1 ngày thì cho vào mảng kết quả
                        finalArray.push({
                            date: date,
                            dataArray: {
                                totalCaNam: totalCaNamRes,
                                totalData: totalRes,
                                tableBookingOrderDetailList: tableBookingByDateRes
                            }
                        })
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getTableBookingOrderByDateAndCustomerId!",
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
                const tableBookingListRes = data.dataArray.tableBookingOrderDetailList;
                tableBookingListRes.map((tableBookingOrder) => {
                    finalTableBookingOrderList.push(tableBookingOrder);
                })
            })

            // Sort
            if (sortWay === "asc") {
                finalTableBookingOrderList = finalTableBookingOrderList.sort((a, b) => a.table_booking_order_total - b.table_booking_order_total);
            } else {
                finalTableBookingOrderList = finalTableBookingOrderList.sort((a, b) => b.table_booking_order_total - a.table_booking_order_total);
            }

            // Sort xong tách mảng ngày mới và mảng data sau sort
            let dateArray = []; //Lưu Mảng ngày sau khi đã sort theo doanh thu cả năm
            let dataTableArray = [];
            for (var i = 0; i < finalArray.length; i++) {
                dateArray.push(finalArray[i].date);
                dataTableArray.push(finalArray[i].dataArray);
            }
            // Mảng ngày mới thì lấy để đem truy vấn lấy từng cột dữ liệu làm biểu đồ
            let statisticArray;
            try {
                const tableBookingTotalOfCityByDateRes = await getTableBookingTotalOfCustomerByDateByListDate(fromDateToDateListRes, customerId, sortWay);
                if (!tableBookingTotalOfCityByDateRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't get test"
                    });
                }
                statisticArray = tableBookingTotalOfCityByDateRes;
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when getTableBookingTotalOfCustomerByDateByListDate!",
                    error: err
                });
            }

            // Success
            return res.status(200).json({
                status: "success",
                message: "Thống kê doanh thu theo ngày của Thành phố theo Khách hàng thành công!",
                data: {
                    statisticDate: statisticDate,
                    dateArray: dateArray,
                    dataArray: finalArray,
                    dateFrom: dateFrom,
                    dateTo: dateTo,
                    sortWay: sortWay,
                    statisticArray: statisticArray,
                    finalTableBookingOrderList: finalTableBookingOrderList
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
}