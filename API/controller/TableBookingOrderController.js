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
                message: "L???i getTableBookingOrders",
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

        // L???y ng??y hi???n t???i FORMAT: '2022-05-05 13:48:12' gi???ng CSDL
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var tableBookingOrderBookDate = date + ' ' + time;

        // Checkin date + time
        var tableBookingOrderCheckInDate = dateBooking + " " + timeBooking;
        if (!tableBookingOrderQuantity) {
            return res.status(404).json({
                status: "fail",
                message: "S??? l?????ng kh??ch kh??ng h???p l???!"
            });
        }
        if (tableBookingOrderTotal === null) {
            return res.status(404).json({
                status: "fail",
                message: "T???ng s??? ti???n kh??ng h???p l???!"
            });
        }
        if (!customerId || !Number.isInteger(customerId) || customerId <= 0) {
            return res.status(404).json({
                status: "fail",
                message: "M?? kh??ch h??ng kh??ng h???p l???!"
            });
        }
        if (!tableBookingId || !Number.isInteger(tableBookingId) || tableBookingId <= 0) {
            return res.status(404).json({
                status: "fail",
                message: "M?? b??n kh??ng h???p l???!"
            });
        }
        if (!dateBooking) {
            return res.status(404).json({
                status: "fail",
                message: "B???n ch??a ch???n Ng??y ?????t b??n!"
            });
        }
        if (!timeBooking) {
            return res.status(404).json({
                status: "fail",
                message: "B???n ch??a ch???n Gi??? ?????t b??n!"
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
                noidung += '<div><p>C???m ??n b???n ???? tin t?????ng v?? ?????t b??n t???i <font color="#41f1b6"><b>Ho??ng Long Hotel &amp; Restaurant</b></font> v???i m?? ?????t b??n: ' + tableBookingOrderId + '</p></div>';
                noidung += '<p><b>Kh??ch h??ng:</b> ' + customerName + '<br /><b>Email:</b> ' + customerEmail + '<br /><b>??i???n tho???i:</b> ' + customerPhoneNumber + '<br />';

                // Danh s??ch S???n ph???m ???? mua
                noidung += ' <table border="1px" cellpadding="10px" cellspacing="1px"width="100%"><tr><td align="center" bgcolor="#41f1b6" colspan="4"><fontcolor="white"><b>????N ?????T B??N C???A B???N</b></fontcolor=></td></tr><tr id="invoice-bar"><td width="25%"><b>Lo???i b??n</b></td><td width="20%"><b>S??? b??n</b></td><td width="30%"><b>V??? tr??</b></td><td width="25%"><b>Ng??y ???? ?????t</b></td></tr>';

                noidung += '<tr><td class="prd-name">' + tableBookingTypeName + '</td><td class="prd-price"><font color="#41f1b6">' + tableBookingName + '</font></td><td class="prd-number">' + tableBookingFloorName + '</td><td class="prd-total"><font color="#41f1b6">' + tableBookingOrderCheckInDate + '</font></td></tr></table>';

                noidung += '<p align="justify"><b>Qu?? kh??ch ???? ?????t b??n th??nh c??ng!</b><br /><b><br />C??m ??n Qu?? kh??ch ???? l???a ch???n d???ch v??? c???a ch??ng t??i!</b></p>';
                // ----- Mailer Option -----
                var mailOptions = {
                    from: 'Ho??ng Long Hotel &amp; Restaurant',
                    to: customerEmail,
                    subject: '?????t b??n t???i Ho??ng Long th??nh c??ng!',
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

    // ADMIN: Qu???n l?? ?????t B??n
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
                message: "L???y table bookings th??nh c??ng",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "L???i getTableBookingsAndDetail",
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
                message: "L???y quantity table bookings th??nh c??ng",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "L???i getQuantityTableBookings",
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
                message: "T??m table bookings th??nh c??ng",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "L???i findTableBookingByIdOrCustomerEmailOrCustomerPhoneOrCustomerName",
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
                message: "T??m table bookings th??nh c??ng",
                data: result
            });
        } catch (err) {
            console.log("ERR: ", err);
            return res.status(400).json({
                status: "fail",
                message: "L???i findTableBookingById",
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
        if (!tableBookingOrderIdentityCard) {
            return res.status(400).json({
                status: "fail",
                message: "S??? ch???ng minh th?? c???a kh??ch h??ng kh??ng h???p l???!"
            });
        }
        if (!tableBookingOrderNation) {
            return res.status(400).json({
                status: "fail",
                message: "Qu???c t???ch c???a kh??ch h??ng kh??ng h???p l???!"
            });
        }
        if (!tableBookingOrderAddress) {
            return res.status(400).json({
                status: "fail",
                message: "?????a ch??? c???a kh??ch h??ng kh??ng h???p l???!"
            });
        }
        if (!tableBookingOrderWardId || tableBookingOrderWardId === '' || tableBookingOrderWardId === undefined || tableBookingOrderWardId === null) {
            return res.status(400).json({
                status: "fail",
                message: "M?? X?? ph?????ng c???a kh??ch h??ng kh??ng h???p l???!"
            });
        }
        if (!tableBookingOrderId || !Number.isInteger(tableBookingOrderId) || tableBookingOrderId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "M?? ?????t b??n kh??ng h???p l???!"
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
                    message: "H??? t??n kh??ng ????ng v???i email/ SDT ???? ?????t b??n!"
                });
            }
            // T??m table booking order
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
                        message: "????n ?????t n??y ???? Check in ho???c ???? ho??n th??nh r???i!"
                    });
                }
                // Ki???m tra ng?????i d??ng ph???i ng?????i ???? ?????t b??n n??y kh??ng?
                const customerIdInTableBookingOrder = tableBookingOrderRes.customer_id;
                if (customerIdRes !== customerIdInTableBookingOrder) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Ph??ng kh??ng ???????c ?????t b???i kh??ch h??ng n??y!"
                    });
                }
                // Ki???m tra ng??y check in xem ph???i ng??y mu???n ?????t kh??ng? - L???y ng??y mu???n check in table_booking_order_checkin_date
                var dateCheckinRes = new Date(tableBookingOrderRes.table_booking_order_checkin_date);
                // So s??nh ng??y
                var today = new Date();
                var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + (today.getDate() + 1);
                var checkInDate = new Date(date);
                checkInDate.setHours(-17, 0, 0, 0);
                // Kh??ng cho checkin s???m h??n th???i gian mu???n nh???n b??n table_booking_order_checkin_date
                if (checkInDate < dateCheckinRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Kh??ng th??? Check in tr?????c ng??y Mu???n nh???n B??n: " + tableBookingOrderRes.table_booking_order_checkin_date
                    });
                }
                // T??m X?? ph?????ng c?? t???n t???i kh??ng
                try {
                    const wardRes = await getWardByWardId(tableBookingOrderWardId);
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
                        const updateCheckInInfoRes = await updateTableBookingOrderInfoWhenCheckInSuccess(tableBookingOrderIdentityCard, tableBookingOrderNation, tableBookingOrderAddress, tableBookingOrderWardId, startDate, tableBookingOrderId);
                        if (!updateCheckInInfoRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't update table booking info when check in success"
                            });
                        }
                        // C???p nh???t state
                        try {
                            const updateStateRes = await updateTableBookingOrderState(1, tableBookingOrderId);
                            if (!updateStateRes) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Cann't update table booking state when check in success"
                                });
                            }

                            createLogAdmin(req, res, " v???a Check in cho ????n ?????t b??n c?? m??: " + tableBookingOrderId, "UPDATE").then(() => {
                                // Success
                                return res.status(200).json({
                                    status: "success",
                                    message: "Check in th??nh c??ng!"
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
                message: "M?? ?????t b??n kh??ng h???p l???!"
            });
        }
        // T??m table booking order xem c?? kh??ng
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
                    message: "????n ?????t n??y ch??a Check in ho???c ???? ho??n th??nh r???i!"
                });
            }
            // Ki???m tra ng??y check in xem ph???i ng??y mu???n c??? h??nh kh??ng? - L???y ng??y c??? h??nh ???? ch???n ??? party hall detail
            var dateCheckinRes = new Date(tableBookingOrderRes.table_booking_order_checkin_date);
            // ----- Quy ?????i v??? gi??? ????ng
            dateCheckinRes.setTime(dateCheckinRes.getTime() - new Date().getTimezoneOffset() * 60 * 1000);
            // ----- L???y ng??y mu???n h??n 1 so v???i ng??y mu???n ?????t
            var dateResLate1Day = moment(dateCheckinRes).add(1, "days");
            var checkInDateLate1Day = new Date(dateResLate1Day);
            // L???y ng??y th???c hi???n check in
            var today = new Date();
            var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + (today.getDate() + 1);
            var checkInDate = new Date(date);
            // ----- Quy ?????i v??? gi??? ????ng
            checkInDate.setTime(today.getTime() - new Date().getTimezoneOffset() * 60 * 1000);

            // // Ng??y tr??? h??n 1 th?? kh??ng cho check out
            //  Kh??ng cho check out mu???n l???n h??n ng??y table_booking_order_checkin_date
            console.log(checkInDate, checkInDateLate1Day, dateCheckinRes, tableBookingOrderRes.table_booking_order_checkin_date)

            if (checkInDate > checkInDateLate1Day) {
                return res.status(400).json({
                    status: "fail",
                    message: "Ng??y Check out ???? qu?? 1 ng??y t??? ng??y Mu???n nh???n B??n: " + tableBookingOrderRes.table_booking_order_checkin_date
                });
            }
            // C???p nh???t ng??y ho??n th??nh check out: finish date
            // L???y ng??y hi???n t???i FORMAT: '2022-05-05 13:48:12' gi???ng CSDL
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
                // C???p nh???t state
                try {
                    const updateStateRes = await updateTableBookingOrderState(2, tableBookingOrderId);
                    if (!updateStateRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't update table booking state when check out success"
                        });
                    }

                    createLogAdmin(req, res, " v???a Check out cho ????n ?????t b??n c?? m??: " + tableBookingOrderId, "UPDATE").then(() => {
                        // Success
                        return res.status(200).json({
                            status: "success",
                            message: "Check out th??nh c??ng!"
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

    // Admin: Qu???n l?? ?????t b??n - Th???ng k?? doanh thu
    getStatisticTableBookingTotalByDate: async (req, res) => {
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
        // L???y ng??y trong table booking t??? dateFrom ?????n dateTo
        try {
            const fromDateToDateListRes = await getDistinctDateInTableBookingOrderFromDateToDate(dateFrom, dateTo);
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
            // L???y danh s??ch ?????t b??n chi ti???t
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
                message: "Th???ng k?? doanh thu theo ng??y th??nh c??ng!",
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
    // Admin: Qu???n l?? ?????t b??n - Th???ng k?? doanh thu
    getStatisticTableBookingTotalByQuarter: async (req, res) => {
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
        // L???y danh s??ch ?????t b??n chi ti???t
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
            message: "Th???ng k?? doanh thu theo Th??ng trong Qu?? th??nh c??ng!",
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
    // Admin: Qu???n l?? ?????t b??n - Th???ng k?? doanh thu Theo th??nh ph???
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
            // L???y ng??y hi???n t???i FORMAT: '2022-05-05 13:48:12' gi???ng CSDL
            var todayCheckIn = new Date();
            var dateCheckIn = todayCheckIn.getFullYear() + '-' + (todayCheckIn.getMonth() + 1) + '-' + todayCheckIn.getDate();
            var timeCheckIn = todayCheckIn.getHours() + ":" + todayCheckIn.getMinutes() + ":" + todayCheckIn.getSeconds();
            var statisticDate = dateCheckIn + ' ' + timeCheckIn;

            for (var i = 0; i < TableBookingTotalOfCityForEachQuarterRes.length; i++) {
                const cityId = TableBookingTotalOfCityForEachQuarterRes[i].city_id;
                const cityName = TableBookingTotalOfCityForEachQuarterRes[i].city_name;
                // L???y ????n ?????t b??n cho t???ng city id
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
                message: "Th???ng k?? doanh thu theo Th??nh ph??? c???a 4 qu?? th??nh c??ng!",
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
    // Admin: Qu???n l?? ?????t b??n - Th???ng k?? doanh thu Theo th??nh ph???
    getStatisticTableBookingTotalOfCityByDate: async (req, res) => {
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
        // L???y ng??y trong table booking t??? dateFrom ?????n dateTo
        try {
            const fromDateToDateListRes = await getDistinctDateInTableBookingOrderFromDateToDate(dateFrom, dateTo);
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
                            const totalRes = await getTableBookingTotalOfCityByDateAndLimitAsc(date, 5);
                            if (!totalRes) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Cann't find table booking total by date"
                                });
                            }
                            // L???y ????n ?????t b??n cho t???ng Ng??y
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
                            // L???y ????n ?????t b??n cho t???ng Ng??y
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
                            // L???y ????n ?????t b??n cho t???ng Ng??y
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
                            // L???y ????n ?????t b??n cho t???ng Ng??y
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
                            // L???y ????n ?????t b??n cho t???ng Ng??y
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
                            // L???y ????n ?????t b??n cho t???ng Ng??y
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

            // L???y data ????? hi???n bi???u ?????
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

    // Admin: Qu???n l?? ?????t b??n - Th???ng k?? doanh thu Theo th??nh ph???
    getStatisticTableBookingTotalOfCityByQuarter: async (req, res) => {
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
        let tableBookingOrderDetailList = [];
        // N???u l?? qu?? 1
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
                        // L???y danh s??ch ????n ?????t b??n chi ti???t cho t???ng city thu???c qu?? ????
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
                        // L???y danh s??ch ????n ?????t b??n chi ti???t cho t???ng city thu???c qu?? ????
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
                        // L???y danh s??ch ????n ?????t b??n chi ti???t cho t???ng city thu???c qu?? ????
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
                        // L???y danh s??ch ????n ?????t b??n chi ti???t cho t???ng city thu???c qu?? ????
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
                        // L???y danh s??ch ????n ?????t b??n chi ti???t cho t???ng city thu???c qu?? ????
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
                        // L???y danh s??ch ????n ?????t b??n chi ti???t cho t???ng city thu???c qu?? ????
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
        // N???u l?? qu?? 2
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
                        // L???y danh s??ch ????n ?????t b??n chi ti???t cho t???ng city thu???c qu?? ????
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
                        // L???y danh s??ch ????n ?????t b??n chi ti???t cho t???ng city thu???c qu?? ????
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
                        // L???y danh s??ch ????n ?????t b??n chi ti???t cho t???ng city thu???c qu?? ????
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
                        // L???y danh s??ch ????n ?????t b??n chi ti???t cho t???ng city thu???c qu?? ????
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
                        // L???y danh s??ch ????n ?????t b??n chi ti???t cho t???ng city thu???c qu?? ????
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
                        // L???y danh s??ch ????n ?????t b??n chi ti???t cho t???ng city thu???c qu?? ????
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
        // N???u l?? qu?? 3
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
                        // L???y danh s??ch ????n ?????t b??n chi ti???t cho t???ng city thu???c qu?? ????
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
                        // L???y danh s??ch ????n ?????t b??n chi ti???t cho t???ng city thu???c qu?? ????
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
                        // L???y danh s??ch ????n ?????t b??n chi ti???t cho t???ng city thu???c qu?? ????
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
                        // L???y danh s??ch ????n ?????t b??n chi ti???t cho t???ng city thu???c qu?? ????
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
                        // L???y danh s??ch ????n ?????t b??n chi ti???t cho t???ng city thu???c qu?? ????
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
                        // L???y danh s??ch ????n ?????t b??n chi ti???t cho t???ng city thu???c qu?? ????
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
                        const tableBookingTotalQuarterRes = await getTableBookingTotalOfCityByQuarterFourOrderByCaNamDescAndLimit(5);
                        if (!tableBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find table booking by Quarter 3: -limit 5 - desc"
                            });
                        }
                        finalDataArray = tableBookingTotalQuarterRes;
                        // L???y danh s??ch ????n ?????t b??n chi ti???t cho t???ng city thu???c qu?? ????
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
                        // L???y danh s??ch ????n ?????t b??n chi ti???t cho t???ng city thu???c qu?? ????
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
                        // L???y danh s??ch ????n ?????t b??n chi ti???t cho t???ng city thu???c qu?? ????
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
                        // L???y danh s??ch ????n ?????t b??n chi ti???t cho t???ng city thu???c qu?? ????
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
                        // L???y danh s??ch ????n ?????t b??n chi ti???t cho t???ng city thu???c qu?? ????
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
                        // L???y danh s??ch ????n ?????t b??n chi ti???t cho t???ng city thu???c qu?? ????
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
            message: "Th???ng k?? doanh thu theo th??ng c???a Th??nh ph??? th??nh c??ng!",
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


    // -------------------------------------------- TH???NG K?? LO???I B??N --------------------------------------------
    // Admin: Qu???n l?? ?????t b??n - Th???ng k?? doanh thu Theo Lo???i
    getStatisticTableBookingTotalOfTypeByQuarter: async (req, res) => {
        const quarter = req.body.quarter;
        const sortWay = req.body.sortWay;
        const tableTypeList = req.body.tableTypeList;
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
        if (!tableTypeList) {
            return res.status(400).json({
                status: "fail",
                message: "Lo???i b??n kh??ng h???p l???!"
            });
        }
        let finalDataArray = [];
        // N???u l?? qu?? 1
        if (quarter === 1) {
            // Quarter 1:
            for (var k = 0; k < tableTypeList.length; k++) {
                const tableTypeName = tableTypeList[k];
                // L???y th???ng k?? doanh thu c???a Lo???i b??n theo qu??
                try {
                    const tableBookingTotalQuarterRes = await getTableBookingTotalOfTypeByQuarterOneOrderByCaNam(tableTypeName);
                    if (!tableBookingTotalQuarterRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't find table booking by Quarter 1"
                        });
                    }
                    // L???y danh s??ch ????n ?????t b??n chi ti???t cho t???ng Lo???i b??n thu???c qu?? ???? 
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
        // N???u l?? qu?? 2
        if (quarter === 2) {
            // Quarter 2:
            for (var k = 0; k < tableTypeList.length; k++) {
                const tableTypeName = tableTypeList[k];
                // L???y th???ng k?? doanh thu c???a Lo???i b??n theo qu??
                try {
                    const tableBookingTotalQuarterRes = await getTableBookingTotalOfTypeByQuarterTwoOrderByCaNam(tableTypeName);
                    if (!tableBookingTotalQuarterRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't find table booking by Quarter 2"
                        });
                    }
                    // L???y danh s??ch ????n ?????t b??n chi ti???t cho t???ng Lo???i b??n thu???c qu?? ???? 
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
        // N???u l?? qu?? 3
        if (quarter === 3) {
            // Quarter 3:
            for (var k = 0; k < tableTypeList.length; k++) {
                const tableTypeName = tableTypeList[k];
                // L???y th???ng k?? doanh thu c???a Lo???i b??n theo qu??
                try {
                    const tableBookingTotalQuarterRes = await getTableBookingTotalOfTypeByQuarterThreeOrderByCaNam(tableTypeName);
                    if (!tableBookingTotalQuarterRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't find table booking by Quarter 3"
                        });
                    }
                    // L???y danh s??ch ????n ?????t b??n chi ti???t cho t???ng Lo???i b??n thu???c qu?? ???? 
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
        // N???u l?? qu?? 4
        if (quarter === 4) {
            // Quarter 4:
            for (var k = 0; k < tableTypeList.length; k++) {
                const tableTypeName = tableTypeList[k];
                // L???y th???ng k?? doanh thu c???a Lo???i b??n theo qu??
                try {
                    const tableBookingTotalQuarterRes = await getTableBookingTotalOfTypeByQuarterFourOrderByCaNam(tableTypeName);
                    if (!tableBookingTotalQuarterRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't find table booking by Quarter 1"
                        });
                    }
                    // L???y danh s??ch ????n ?????t b??n chi ti???t cho t???ng Lo???i b??n thu???c qu?? ???? 
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
            message: "Th???ng k?? doanh thu theo th??ng c???a Lo???i b??n th??nh c??ng!",
            data: {
                statisticDate: statisticDate,
                quarter: quarter,
                sortWay: sortWay,
                data: finalDataArray,
                monthArray: monthInQuarterArray
            }
        });
    },
    // Admin: Qu???n l?? ?????t b??n - Th???ng k?? doanh thu Theo Lo???i v?? Ng??y th???ng k??
    getStatisticTableBookingTotalOfTypeByDate: async (req, res) => {
        const dateFrom = req.body.dateFrom;
        const dateTo = req.body.dateTo;
        const sortWay = req.body.sortWay;
        const tableTypeList = req.body.tableTypeList;
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
        if (!tableTypeList) {
            return res.status(400).json({
                status: "fail",
                message: "Lo???i b??n kh??ng h???p l???!"
            });
        }

        // L???y ng??y trong table booking t??? dateFrom ?????n dateTo
        try {
            const fromDateToDateListRes = await getDistinctDateInTableBookingOrderFromDateToDate(dateFrom, dateTo);
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
                        // L???y ????n ?????t b??n cho t???ng Ng??y
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
                message: "Th???ng k?? doanh thu theo ng??y c???a Th??nh ph??? theo Lo???i th??nh c??ng!",
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

    // -------------------------------------------- TH???NG K?? KH??CH H??NG --------------------------------------------
    // Admin: Qu???n l?? ?????t b??n - Th???ng k?? doanh thu Theo Kh??ch h??ng
    getStatisticTableBookingTotalOfCustomerByQuarter: async (req, res) => {
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

            // Ki???m tra Kh??ch h??ng n??y c?? ?????t b??n kh??ng
            try {
                const isCustomerBooking = await findCustomerInTableBookingOrder(customerId);
                if (!isCustomerBooking) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Kh??ch h??ng ch??a c?? th??ng tin ?????t b??n n??o!"
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
        // N???u l?? qu?? 1
        if (quarter === 1) {
            // L???y th???ng k?? doanh thu c???a Kh??ch h??ng theo qu??
            try {
                const tableBookingTotalQuarterRes = await getTableBookingTotalOfCustomerByQuarterOneOrderByCaNam(customerId);
                if (!tableBookingTotalQuarterRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't find table booking by Quarter 1"
                    });
                }
                // L???y danh s??ch ????n ?????t b??n chi ti???t cho t???ng Kh??ch h??ng thu???c qu?? ???? 
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
        // N???u l?? qu?? 2
        if (quarter === 2) {
            // L???y th???ng k?? doanh thu c???a Kh??ch h??ng theo qu??
            try {
                const tableBookingTotalQuarterRes = await getTableBookingTotalOfCustomerByQuarterTwoOrderByCaNam(customerId);
                if (!tableBookingTotalQuarterRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't find table booking by Quarter 2"
                    });
                }
                // L???y danh s??ch ????n ?????t b??n chi ti???t cho t???ng Kh??ch h??ng thu???c qu?? ???? 
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
        // N???u l?? qu?? 3
        if (quarter === 3) {
            // L???y th???ng k?? doanh thu c???a Kh??ch h??ng theo qu??
            try {
                const tableBookingTotalQuarterRes = await getTableBookingTotalOfCustomerByQuarterThreeOrderByCaNam(customerId);
                if (!tableBookingTotalQuarterRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't find table booking by Quarter 3"
                    });
                }
                // L???y danh s??ch ????n ?????t b??n chi ti???t cho t???ng Kh??ch h??ng thu???c qu?? ???? 
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
        // N???u l?? qu?? 4
        if (quarter === 4) {
            // L???y th???ng k?? doanh thu c???a Kh??ch h??ng theo qu??
            try {
                const tableBookingTotalQuarterRes = await getTableBookingTotalOfCustomerByQuarterFourOrderByCaNam(customerId);
                if (!tableBookingTotalQuarterRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't find table booking by Quarter 4"
                    });
                }
                // L???y danh s??ch ????n ?????t b??n chi ti???t cho t???ng Kh??ch h??ng thu???c qu?? ???? 
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
    // Admin: Qu???n l?? ?????t b??n - Th???ng k?? doanh thu Theo Kh??ch h??ng v?? Ng??y th???ng k??
    getStatisticTableBookingTotalOfCustomerByDate: async (req, res) => {
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

            // Ki???m tra Kh??ch h??ng n??y c?? ?????t b??n kh??ng
            try {
                const isCustomerBooking = await findCustomerInTableBookingOrder(customerId);
                if (!isCustomerBooking) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Kh??ch h??ng ch??a c?? th??ng tin ?????t b??n n??o!"
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

        // L???y ng??y trong table booking t??? dateFrom ?????n dateTo
        try {
            const fromDateToDateListRes = await getDistinctDateInTableBookingOrderFromDateToDate(dateFrom, dateTo);
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
                    // L???y ????n ?????t b??n cho t???ng Ng??y
                    try {
                        const tableBookingByDateRes = await getTableBookingOrderByDateAndCustomerId(date, customerId);
                        if (!tableBookingByDateRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find table booking by date"
                            });
                        }
                        // Sau khi l???p xong c??c room type trong 1 ng??y th?? cho v??o m???ng k???t qu???
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
                message: "Th???ng k?? doanh thu theo ng??y c???a Th??nh ph??? theo Kh??ch h??ng th??nh c??ng!",
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