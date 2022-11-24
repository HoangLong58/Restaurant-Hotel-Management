const { createPartyBookingOrder, findPartyBookingOrder, getPartyBookingsAndDetail, getQuantityPartyBookings, findPartyBookingByIdOrCustomerEmailOrCustomerPhoneOrCustomerName, findPartyBookingById, findPartyBookingOrderByIdCheckIn, updatePartyBookingOrderInfoWhenCheckInSuccess, updatePartyBookingOrderState, updatePartyBookingOrderFinishDateWhenCheckOutSuccess, getDistinctDateInPartyBookingOrderFromDateToDate, getPartyBookingTotalByDate, getPartyBookingTotalByMonth, getLimitPartyBookingTotalOfCityForEachQuarter, getPartyBookingOrderByCityId, getPartyBookingTotalOfCityByDateAndLimitAsc, getPartyBookingTotalOfCityByDateAndAsc, getPartyBookingTotalOfCityByDateAndLimitDesc, getPartyBookingTotalOfCityByDateAndDesc, getPartyBookingTotalOfCityByDateByListDate, getPartyBookingTotalOfCityByDateByListDateNoLimit, getPartyBookingTotalOfCityByQuarterOneOrderByCaNamDescAndLimit, getPartyBookingTotalOfCityByQuarterOneOrderByCaNamDesc, getPartyBookingTotalOfCityByQuarterOneOrderByCaNamAscAndLimit, getPartyBookingTotalOfCityByQuarterOneOrderByCaNamAsc, getPartyBookingTotalOfCityByQuarterTwoOrderByCaNamDescAndLimit, getPartyBookingTotalOfCityByQuarterTwoOrderByCaNamDesc, getPartyBookingTotalOfCityByQuarterTwoOrderByCaNamAscAndLimit, getPartyBookingTotalOfCityByQuarterTwoOrderByCaNamAsc, getPartyBookingTotalOfCityByQuarterThreeOrderByCaNamDescAndLimit, getPartyBookingTotalOfCityByQuarterThreeOrderByCaNamDesc, getPartyBookingTotalOfCityByQuarterThreeOrderByCaNamAscAndLimit, getPartyBookingTotalOfCityByQuarterThreeOrderByCaNamAsc, getPartyBookingTotalOfCityByQuarterFourOrderByCaNamDescAndLimit, getPartyBookingTotalOfCityByQuarterFourOrderByCaNamDesc, getPartyBookingTotalOfCityByQuarterFourOrderByCaNamAscAndLimit, getPartyBookingTotalOfCityByQuarterFourOrderByCaNamAsc, getPartyBookingOrderFromDateToDate, getPartyBookingOrderOfQuarter, getPartyBookingOrderByDate, getPartyBookingOrderByQuarterAndCityId } = require("../service/PartyBookingOrderService");
const { createPartyHallDetail, getPartyHallDetailByPartyBookingOrderId } = require("../service/PartyHallDetailService");
const { getPartyHallWithTypeFloorByPartyHallId } = require("../service/PartyHallService");
const { getSetMenuBySetMenuId } = require("../service/SetMenuService");
const { format_money, createLogAdmin } = require("../utils/utils");

const { getPartyBookingTypeByPartyBookingTypeId } = require("../service/PartyBookingTypeService");
const { getPartyHallTimeByPartyHallTimeId } = require("../service/PartyHallTimeService");
const { updateDiscountState } = require("../service/DiscountService");
const { getCustomerByCustomerId, findCustomerByEmailOrPhoneNumber } = require("../service/CustomerService");
const { createPartyBookingOrderDetailFood } = require("../service/PartyBookingOrderDetailFoodService");
const { createPartyServiceDetail } = require("../service/PartyServiceDetailService");
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
    createPartyBookingOrder: async (req, res) => {
        const partyBookingOrderPrice = req.body.partyBookingOrderPrice;
        const partyBookingOrderSurcharge = req.body.partyBookingOrderSurcharge;
        const partyBookingOrderTotal = req.body.partyBookingOrderTotal;
        const partyBookingOrderNote = req.body.partyBookingOrderNote;
        const discountId = req.body.discountId;
        const customerId = req.body.customerId;
        const setMenuId = req.body.setMenuId;
        const partyBookingTypeId = req.body.partyBookingTypeId;

        const partyHallDetailName = req.body.partyHallDetailName;
        const partyHallDetailDate = req.body.partyHallDetailDate;
        const partyHallId = req.body.partyHallId;
        const partyHallTimeId = req.body.partyHallTimeId;

        const serviceList = req.body.serviceList;
        const foodList = req.body.foodList;
        const tableQuantity = req.body.tableQuantity;

        // Lấy ngày hiện tại FORMAT: '2022-05-05 13:48:12' giống CSDL
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var partyBookingOrderBookDate = date + ' ' + time;

        if (!partyBookingOrderPrice || !Number.isInteger(partyBookingOrderPrice) || partyBookingOrderPrice <= 0) {
            return res.status(404).json({
                status: "fail",
                message: "Book price không hợp lệ!"
            });
        }
        if (partyBookingOrderSurcharge === null) {
            return res.status(404).json({
                status: "fail",
                message: "Book surcharge không hợp lệ!"
            });
        }
        if (!partyBookingOrderTotal || !Number.isInteger(partyBookingOrderTotal) || partyBookingOrderTotal <= 0) {
            return res.status(404).json({
                status: "fail",
                message: "Book total không hợp lệ!"
            });
        }
        if (discountId === null) {
            return res.status(404).json({
                status: "fail",
                message: "Discount id không hợp lệ!"
            });
        }
        if (!customerId || !Number.isInteger(customerId) || customerId <= 0) {
            return res.status(404).json({
                status: "fail",
                message: "Customer id không hợp lệ!"
            });
        }
        if (!setMenuId || !Number.isInteger(setMenuId) || setMenuId <= 0) {
            return res.status(404).json({
                status: "fail",
                message: "Set menu id không hợp lệ!"
            });
        }
        if (!partyBookingTypeId || !Number.isInteger(partyBookingTypeId) || partyBookingTypeId <= 0) {
            return res.status(404).json({
                status: "fail",
                message: "Party booking type id không hợp lệ!"
            });
        }

        if (!partyHallDetailDate) {
            return res.status(404).json({
                status: "fail",
                message: "Party hall detail date không hợp lệ!"
            });
        }
        if (!partyHallDetailName) {
            return res.status(404).json({
                status: "fail",
                message: "Party hall detail name không hợp lệ!"
            });
        }
        if (!partyHallId || !Number.isInteger(partyHallId) || partyHallId <= 0) {
            return res.status(404).json({
                status: "fail",
                message: "Party hall id không hợp lệ!"
            });
        }
        if (!partyHallTimeId || !Number.isInteger(partyHallTimeId) || partyHallTimeId <= 0) {
            return res.status(404).json({
                status: "fail",
                message: "Party hall time id không hợp lệ!"
            });
        }
        // Tạo đặt tiệc
        try {
            const createPartyBookingRes = await createPartyBookingOrder(
                partyBookingOrderBookDate,
                partyBookingOrderPrice,
                tableQuantity,
                partyBookingOrderSurcharge,
                partyBookingOrderTotal,
                partyBookingOrderNote,
                discountId,
                customerId,
                setMenuId,
                partyBookingTypeId
            );
            if (createPartyBookingRes) {
                // Tìm đặt tiệc vừa đặt
                try {
                    const partyBookingOrderRes = await findPartyBookingOrder(
                        partyBookingOrderBookDate,
                        partyBookingOrderPrice,
                        tableQuantity,
                        partyBookingOrderSurcharge,
                        partyBookingOrderTotal,
                        partyBookingOrderNote,
                        discountId,
                        customerId,
                        setMenuId,
                        partyBookingTypeId
                    );
                    if (partyBookingOrderRes) {
                        var partyBookingOrderId = partyBookingOrderRes.party_booking_order_id;
                        // Tạo chi tiết đặt tiệc
                        try {
                            const createpartyHallDetailRes = await createPartyHallDetail(
                                partyHallDetailName,
                                partyHallDetailDate,
                                partyHallId,
                                partyHallTimeId,
                                partyBookingOrderId
                            );
                            if (createpartyHallDetailRes) {
                                // Cập nhật mã giảm giá
                                try {
                                    const updateDiscountStateRes = await updateDiscountState(discountId, 1);
                                    if (updateDiscountStateRes) {
                                        // Tạo chi tiết cho những món ăn đã chọn
                                        for (var k = 0; k < foodList.length; k++) {
                                            const foodId = foodList[k].food_id;
                                            try {
                                                const createPartyBookingDetailFoodRes = await createPartyBookingOrderDetailFood(partyBookingOrderId, foodId);
                                                if (!createPartyBookingDetailFoodRes) {
                                                    return res.status(400).json({
                                                        status: "fail",
                                                        message: "Can not create party booking food detail!"
                                                    });
                                                }
                                            } catch (err) {
                                                return res.status(400).json({
                                                    status: "fail",
                                                    message: "Error when create party booking food detail!",
                                                    error: err
                                                });
                                            }
                                        }
                                        // Tạo chi tiết cho những Dịch vụ đã chọn (State = 0) do đã thanh toán
                                        for (var q = 0; q < serviceList.length; q++) {
                                            const partyServiceId = serviceList[q].party_service_id;
                                            const partyServiceQuantity = serviceList[q].partyServiceQuantity;
                                            const partyServicePrice = serviceList[q].party_service_price;
                                            const partyServiceTotal = serviceList[q].party_service_price * serviceList[q].partyServiceQuantity;
                                            const partyServiceDetailState = 0;
                                            try {
                                                const createPartyServiceDetailRes = await createPartyServiceDetail(partyServiceDetailState, partyServiceQuantity, partyServicePrice, partyServiceTotal, partyServiceId, partyBookingOrderId);
                                                if (!createPartyServiceDetailRes) {
                                                    return res.status(400).json({
                                                        status: "fail",
                                                        message: "Can not create party booking service detail!"
                                                    });
                                                }
                                            } catch (err) {
                                                return res.status(400).json({
                                                    status: "fail",
                                                    message: "Error when create party booking service detail!",
                                                    error: err
                                                });
                                            }
                                        }
                                        // Gửi mail
                                        try {
                                            // ---------------------------------------------------------------------------
                                            const customerRes = await getCustomerByCustomerId(customerId);
                                            if (!customerRes) {
                                                return res.status(400).json({
                                                    status: "fail",
                                                    message: "Customer record not found"
                                                });
                                            }
                                            const partyHallRes = await getPartyHallWithTypeFloorByPartyHallId(partyHallId);
                                            if (!partyHallRes) {
                                                return res.status(400).json({
                                                    status: "fail",
                                                    message: "Party hall record not found"
                                                });
                                            }
                                            const partyBookingTypeRes = await getPartyBookingTypeByPartyBookingTypeId(partyBookingTypeId);
                                            if (!partyBookingTypeRes) {
                                                return res.status(400).json({
                                                    status: "fail",
                                                    message: "Party booking type record not found"
                                                });
                                            }
                                            const partyHallTimeRes = await getPartyHallTimeByPartyHallTimeId(partyHallTimeId);
                                            if (!partyHallTimeRes) {
                                                return res.status(400).json({
                                                    status: "fail",
                                                    message: "Party hall time record not found"
                                                });
                                            }
                                            const setMenuRes = await getSetMenuBySetMenuId(setMenuId);
                                            if (!setMenuRes) {
                                                return res.status(400).json({
                                                    status: "fail",
                                                    message: "Set menu record not found"
                                                });
                                            }
                                            var customerName = customerRes.customer_first_name + " " + customerRes.customer_last_name;
                                            var customerEmail = customerRes.customer_email;
                                            var customerPhoneNumber = customerRes.customer_phone_number;

                                            var partyHallName = partyHallRes.party_hall_name;
                                            var partyHallView = partyHallRes.party_hall_view;
                                            var partyHallPrice = partyHallRes.party_hall_price;
                                            var partyHallTypeName = partyHallRes.party_hall_type_name;
                                            var partyHallFloorName = partyHallRes.floor_name;

                                            var partyBookingTypeName = partyBookingTypeRes.party_booking_type_name;
                                            var partyHallTimeName = partyHallTimeRes.party_hall_time_name;
                                            var setMenuName = setMenuRes.set_menu_name;
                                            var setMenuPrice = setMenuRes.set_menu_price;

                                            var servicePrice = 0;
                                            for (var i = 0; i < serviceList.length; i++) {
                                                servicePrice += serviceList[i].party_service_price;
                                            };

                                            var partyPriceTotalNoDiscount = partyHallPrice + servicePrice + setMenuPrice * tableQuantity;

                                            // MAILER
                                            var noidung = '';
                                            noidung += '<div><p>Cảm ơn bạn đã tin tưởng và đặt tiệc tại <font color="#41f1b6"><b>Hoàng Long Hotel &amp; Restaurant</b></font> với mã đặt tiệc: ' + partyBookingOrderId + '</p></div>';
                                            noidung += '<p><b>Khách hàng:</b> ' + customerName + '<br /><b>Email:</b> ' + customerEmail + '<br /><b>Điện thoại:</b> ' + customerPhoneNumber + '<br /><b>Loại tiệc:</b> ' + partyBookingTypeName + '<br /><b>Thời gian:</b> ' + partyHallDetailDate + ', ' + partyHallTimeName + '<br />';

                                            // Đặt sảnh
                                            noidung += ' <table border="1px" cellpadding="10px" cellspacing="1px"width="100%"><tr><td align="center" bgcolor="#41f1b6" colspan="4"><fontcolor="white"><b>ĐƠN ĐẶT TIỆC CỦA BẠN</b></fontcolor=></td></tr><tr id="invoice-bar"><td width="45%"><b>Tên sảnh</b></td><td width="20%"><b>Loại sảnh</b></td><td width="15%"><b>Vị trí</b></td><td width="20%"><b>Giá tiền</b></td></tr>';
                                            noidung += '<tr><td class="prd-name">' + partyHallName + '</td><td class="prd-price"><font color="#41f1b6">' + partyHallTypeName + '</font></td><td class="prd-number">' + partyHallFloorName + " - " + partyHallView + '</td><td class="prd-total"><font color="#41f1b6">' + format_money(partyHallPrice) + ' VNĐ</font></td></tr>';
                                            noidung += '<tr><td class="prd-name"><b>Tổng tiền:</b></td><td class="prd-total" colspan="3"><b><font color="#41f1b6">' + format_money(partyHallPrice) + ' VNĐ</font></b></td></tr></table>';

                                            // Đặt dịch vụ
                                            noidung += ' <table border="1px" cellpadding="10px" cellspacing="1px"width="100%"><tr><td align="center" bgcolor="#41f1b6" colspan="2"><fontcolor="white"><b>NHỮNG DỊCH VỤ ĐÃ CHỌN</b></fontcolor=></td></tr><tr id="invoice-bar"><td width="70%"><b>Tên dịch vụ</b></td><td width="30%"><b>Giá tiền</b></td></tr>';
                                            for (var i = 0; i < serviceList.length; i++) {
                                                noidung += '<tr><td class="prd-name">' + serviceList[i].party_service_name + '</td><td class="prd-price"><font color="#41f1b6">' + format_money(serviceList[i].party_service_price) + ' VNĐ</font></td></tr>';
                                            };
                                            noidung += '<tr><td class="prd-name"><b>Tổng tiền:</b></td><td><font color="#41f1b6">' + format_money(servicePrice) + ' VNĐ</font></td></tr></table>';

                                            // Đặt menu
                                            noidung += ' <table border="1px" cellpadding="10px" cellspacing="1px"width="100%"><tr><td align="center" bgcolor="#41f1b6" colspan="2"><fontcolor="white"><b>MENU TIỆC - ' + setMenuName + '</b></fontcolor=></td></tr><tr id="invoice-bar"><td width="50%"><b>Loại món ăn</b></td><td width="50%"><b>Tên món ăn</b></td></tr>';
                                            for (var i = 0; i < foodList.length; i++) {
                                                noidung += '<tr><td class="prd-name">' + foodList[i].food_type_name + '</td><td class="prd-price"><font color="#41f1b6">' + foodList[i].food_name + '</font></td></tr>';
                                            };
                                            noidung += '<tr><td class="prd-name"><b>Tổng tiền: </b><br/><font color="#41f1b6">' + format_money(setMenuPrice) + ' VNĐ</font> x <font color="#41f1b6">' + tableQuantity + ' Bàn tiệc</font></td><td class="prd-total"><b><font color="#41f1b6">' + format_money(setMenuPrice * tableQuantity) + ' VNĐ</font></b></td></tr></table>';

                                            noidung += '<p align="justify"><b>Tổng tiền:&emsp;&emsp;&emsp;&emsp;<font color="#41f1b6">' + format_money(partyPriceTotalNoDiscount) + ' VNĐ</font></b><br /></p>';
                                            noidung += '<p align="justify"><b>Được giảm giá:&emsp;&emsp;<font color="#41f1b6">' + format_money(partyPriceTotalNoDiscount - partyBookingOrderTotal) + ' VNĐ</font></b><br /></p>';
                                            noidung += '<p align="justify"><b>Tổng cộng:&emsp;&emsp;&emsp;&emsp;<font color="#41f1b6">' + format_money(partyBookingOrderTotal) + ' VNĐ</font></b><br /></p>';
                                            noidung += '<p align="justify"><b>Quý khách đã đặt tiệc thành công!</b><br/><b><br />Cám ơn Quý khách đã lựa chọn dịch vụ của chúng tôi!</b></p>';
                                            // ----- Mailer Option -----
                                            var mailOptions = {
                                                from: 'Hoàng Long Hotel &amp; Restaurant',
                                                to: customerEmail,
                                                subject: 'Đặt tiệc tại Hoàng Long thành công!',
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
                                            message: "Create party booking order successfully!",
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
                                    message: "Create party booking detail fail!",
                                });
                            }
                        } catch (err) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Error when create party booking detail!",
                                error: err
                            });
                        }
                    } else {
                        return res.status(400).json({
                            status: "fail",
                            message: "Find party booking order fail!",
                        });
                    }

                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when find party booking order!",
                        error: err
                    });
                }
            } else {
                return res.status(200).json({
                    status: "fail",
                    message: "Create party booking order fail!",
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when create party booking order!",
                error: err
            });
        }
    },

    // ADMIN: Quản lý Đặt tiệc
    getPartyBookingAndDetails: async (req, res) => {
        try {
            const result = await getPartyBookingsAndDetail();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Lấy party bookings thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getPartyBookingsAndDetail",
                error: err
            });
        }
    },
    getQuantityPartyBooking: async (req, res) => {
        try {
            const result = await getQuantityPartyBookings();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Lấy quantity parrty bookings thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getQuantityPartyBookings",
                error: err
            });
        }
    },
    findPartyBookingByIdOrCustomerEmailOrCustomerPhoneOrCustomerName: async (req, res) => {
        const search = req.params.search;
        try {
            const result = await findPartyBookingByIdOrCustomerEmailOrCustomerPhoneOrCustomerName(search);
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Tìm party bookings thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findPartyBookingByIdOrCustomerEmailOrCustomerPhoneOrCustomerName",
                error: err
            });
        }
    },
    findPartyBookingById: async (req, res) => {
        const partyBookingId = req.body.partyBookingId;
        try {
            const result = await findPartyBookingById(partyBookingId);
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Tìm party bookings thành công",
                data: result
            });
        } catch (err) {
            console.log("ERR: ", err);
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findPartyBookingById",
                error: err
            });
        }
    },

    // ADMIN: Check in
    checkInPartyBookingOrder: async (req, res) => {
        const customerFirstName = req.body.customerFirstName;
        const customerLastName = req.body.customerLastName;
        const customerEmail = req.body.customerEmail;
        const customerPhoneNumber = req.body.customerPhoneNumber;
        const partyBookingOrderIdentityCard = req.body.partyBookingOrderIdentityCard;
        const partyBookingOrderNation = req.body.partyBookingOrderNation;
        const partyBookingOrderAddress = req.body.partyBookingOrderAddress;
        const partyBookingOrderWardId = req.body.partyBookingOrderWardId;
        const partyBookingOrderId = req.body.partyBookingOrderId;

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
        if (!partyBookingOrderIdentityCard) {
            return res.status(400).json({
                status: "fail",
                message: "Số chứng minh thư của khách hàng không hợp lệ!"
            });
        }
        if (!partyBookingOrderNation) {
            return res.status(400).json({
                status: "fail",
                message: "Quốc tịch của khách hàng không hợp lệ!"
            });
        }
        if (!partyBookingOrderAddress) {
            return res.status(400).json({
                status: "fail",
                message: "Địa chỉ của khách hàng không hợp lệ!"
            });
        }
        if (!partyBookingOrderWardId || partyBookingOrderWardId === '' || partyBookingOrderWardId === undefined || partyBookingOrderWardId === null) {
            return res.status(400).json({
                status: "fail",
                message: "Mã Xã phường của khách hàng không hợp lệ!"
            });
        }
        if (!partyBookingOrderId || !Number.isInteger(partyBookingOrderId) || partyBookingOrderId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã Đặt tiệc không hợp lệ!"
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
                    message: "Họ tên không đúng với email/ SDT đã đặt tiệc!"
                });
            }
            // Tìm party booking order
            try {
                const partyBookingOrderRes = await findPartyBookingOrderByIdCheckIn(partyBookingOrderId);
                if (!partyBookingOrderRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Record party booking order not found"
                    });
                }
                const partyBookingOrderStateRes = partyBookingOrderRes.party_booking_order_state;
                if (partyBookingOrderStateRes !== 0) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Đơn đặt này Đã Check in hoặc Đã hoàn thành rồi!"
                    });
                }
                // Kiểm tra người dùng phải người đã đặt tiệc này không?
                const customerIdInPartyBookingOrder = partyBookingOrderRes.customer_id;
                if (customerIdRes !== customerIdInPartyBookingOrder) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Phòng không được đặt bởi khách hàng này!"
                    });
                }
                // Kiểm tra ngày check in xem phải ngày muốn cử hành không? - Lấy ngày cử hành đã chọn ở party hall detail
                try {
                    const partyHallDetailRes = await getPartyHallDetailByPartyBookingOrderId(partyBookingOrderId);
                    if (!partyHallDetailRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Record party hall detail not found"
                        });
                    }
                    var dateCheckinRes = new Date(partyHallDetailRes.party_hall_detail_date);

                    // So sánh ngày
                    var today = new Date();
                    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + (today.getDate() + 1);
                    var checkInDate = new Date(date);
                    checkInDate.setHours(-17, 0, 0, 0);
                    if (checkInDate < dateCheckinRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Không thể Check in trước ngày Cử hành tiệc: " + partyHallDetailRes.party_hall_detail_date
                        });
                    }
                    if (checkInDate > dateCheckinRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Ngày Check in đã quá ngày Cử hành tiệc: " + partyHallDetailRes.party_hall_detail_date
                        });
                    }
                    // Tìm Xã phường có tồn tại không
                    try {
                        const wardRes = await getWardByWardId(partyBookingOrderWardId);
                        if (!wardRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find ward"
                            });
                        }
                        // Cập nhật số cmnd và quốc tịch và ngày bắt đầu nhận tiệc
                        // Lấy ngày hiện tại FORMAT: '2022-05-05 13:48:12' giống CSDL
                        var todayCheckIn = new Date();
                        var dateCheckIn = todayCheckIn.getFullYear() + '-' + (todayCheckIn.getMonth() + 1) + '-' + todayCheckIn.getDate();
                        var timeCheckIn = todayCheckIn.getHours() + ":" + todayCheckIn.getMinutes() + ":" + todayCheckIn.getSeconds();
                        var startDate = dateCheckIn + ' ' + timeCheckIn;
                        try {
                            const updateCheckInInfoRes = await updatePartyBookingOrderInfoWhenCheckInSuccess(partyBookingOrderIdentityCard, partyBookingOrderNation, partyBookingOrderAddress, partyBookingOrderWardId, startDate, partyBookingOrderId);
                            if (!updateCheckInInfoRes) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Cann't update party booking info when check in success"
                                });
                            }
                            // Cập nhật state
                            try {
                                const updateStateRes = await updatePartyBookingOrderState(1, partyBookingOrderId);
                                if (!updateStateRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't update party booking state when check in success"
                                    });
                                }

                                createLogAdmin(req, res, " vừa Check in cho Đơn đặt tiệc có mã: " + partyBookingOrderId, "UPDATE").then(() => {
                                    // Success
                                    return res.status(200).json({
                                        status: "success",
                                        message: "Check in thành công!"
                                    });
                                });

                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when update party booking order state when check in success!",
                                    error: err
                                });
                            }
                        } catch (err) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Error when update party booking order info when check in success!",
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
                        message: "Error when find party booking detail!",
                        error: err
                    });
                }
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when find party booking order!",
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
    checkOutPartyBookingOrder: async (req, res) => {
        const partyBookingOrderId = req.body.partyBookingOrderId;

        if (!partyBookingOrderId || !Number.isInteger(partyBookingOrderId) || partyBookingOrderId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã Đặt tiệc không hợp lệ!"
            });
        }
        // Tìm party booking order xem có không
        try {
            const partyBookingOrderRes = await findPartyBookingOrderByIdCheckIn(partyBookingOrderId);
            if (!partyBookingOrderRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record party booking order not found"
                });
            }
            const partyBookingOrderStateRes = partyBookingOrderRes.party_booking_order_state;
            if (partyBookingOrderStateRes !== 1) {
                return res.status(400).json({
                    status: "fail",
                    message: "Đơn đặt này chưa Check in hoặc Đã hoàn thành rồi!"
                });
            }
            // Kiểm tra ngày check in xem phải ngày muốn cử hành không? - Lấy ngày cử hành đã chọn ở party hall detail
            try {
                const partyHallDetailRes = await getPartyHallDetailByPartyBookingOrderId(partyBookingOrderId);
                if (!partyHallDetailRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Record party hall detail not found"
                    });
                }
                var dateCheckinRes = new Date(partyHallDetailRes.party_hall_detail_date);

                // So sánh ngày
                var today = new Date();
                var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + (today.getDate() + 1);
                var checkInDate = new Date(date);
                checkInDate.setHours(-17, 0, 0, 0);
                if (checkInDate < dateCheckinRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Không thể Check out trước ngày Cử hành tiệc: " + partyHallDetailRes.party_hall_detail_date
                    });
                }
                if (checkInDate > dateCheckinRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Ngày Check out đã quá ngày Cử hành tiệc: " + partyHallDetailRes.party_hall_detail_date
                    });
                }

                // Cập nhật ngày hoàn thành check out: finish date
                // Lấy ngày hiện tại FORMAT: '2022-05-05 13:48:12' giống CSDL
                var today = new Date();
                var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                var finishDate = date + ' ' + time;
                try {
                    const updateFinishDateRes = await updatePartyBookingOrderFinishDateWhenCheckOutSuccess(finishDate, partyBookingOrderId);
                    if (!updateFinishDateRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't update party booking finish date when check out success"
                        });
                    }
                    // Cập nhật state
                    try {
                        const updateStateRes = await updatePartyBookingOrderState(2, partyBookingOrderId);
                        if (!updateStateRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't update party booking state when check out success"
                            });
                        }

                        createLogAdmin(req, res, " vừa Check out cho Đơn đặt tiệc có mã: " + partyBookingOrderId, "UPDATE").then(() => {
                            // Success
                            return res.status(200).json({
                                status: "success",
                                message: "Check out thành công!"
                            });
                        });

                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when update party booking order state when check out success!",
                            error: err
                        });
                    }
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when update party booking order finish date when check out success!",
                        error: err
                    });
                }
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when find party booking detail!",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when find party booking order!",
                error: err
            });
        }
    },

    // Admin: Quản lý đặt Tiệc - Thống kê doanh thu
    getStatisticPartyBookingTotalByDate: async (req, res) => {
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
        // Lấy ngày trong party booking từ dateFrom đến dateTo
        try {
            const fromDateToDateListRes = await getDistinctDateInPartyBookingOrderFromDateToDate(dateFrom, dateTo);
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
                    const totalRes = await getPartyBookingTotalByDate(date);
                    if (!totalRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't find party booking total by date"
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

            var partyBookingOrderList = [];
            // Lấy danh sách đặt tiệc chi tiết
            try {
                const partyBookingOrderListRes = await getPartyBookingOrderFromDateToDate(dateFrom, dateTo);
                if (!partyBookingOrderListRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't find party booking order from date to date"
                    });
                }
                partyBookingOrderList = partyBookingOrderListRes;
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when getPartyBookingOrderFromDateToDate!",
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
                    partyBookingOrderList: partyBookingOrderList
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
    // Admin: Quản lý đặt Tiệc - Thống kê doanh thu
    getStatisticPartyBookingTotalByQuarter: async (req, res) => {
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
                const totalRes = await getPartyBookingTotalByMonth(month);
                if (!totalRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't find party booking total by month"
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

        var partyBookingOrderList = [];
        // Lấy danh sách đặt tiệc chi tiết
        try {
            const partyBookingOrderListRes = await getPartyBookingOrderOfQuarter(quarter);
            if (!partyBookingOrderListRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find party booking order from date to date"
                });
            }
            partyBookingOrderList = partyBookingOrderListRes;
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when getPartyBookingOrderOfQuarter!",
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
                partyBookingOrderList: partyBookingOrderList
            }
        });
    },
    // Admin: Quản lý đặt Tiệc - Thống kê doanh thu Theo thành phố
    getLimitPartyBookingTotalOfCityForEachQuarter: async (req, res) => {
        const limit = 5;
        try {
            const PartyBookingTotalOfCityForEachQuarterRes = await getLimitPartyBookingTotalOfCityForEachQuarter(limit);
            if (!PartyBookingTotalOfCityForEachQuarterRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't get party booking total of city for each quarter list"
                });
            }

            let finalDataTableArray = [];
            // Lấy ngày hiện tại FORMAT: '2022-05-05 13:48:12' giống CSDL
            var todayCheckIn = new Date();
            var dateCheckIn = todayCheckIn.getFullYear() + '-' + (todayCheckIn.getMonth() + 1) + '-' + todayCheckIn.getDate();
            var timeCheckIn = todayCheckIn.getHours() + ":" + todayCheckIn.getMinutes() + ":" + todayCheckIn.getSeconds();
            var statisticDate = dateCheckIn + ' ' + timeCheckIn;

            for (var i = 0; i < PartyBookingTotalOfCityForEachQuarterRes.length; i++) {
                const cityId = PartyBookingTotalOfCityForEachQuarterRes[i].city_id;
                const cityName = PartyBookingTotalOfCityForEachQuarterRes[i].city_name;
                // Lấy đơn đặt Tiệc cho từng city id
                try {
                    const PartyBookingByCityIdRes = await getPartyBookingOrderByCityId(cityId);
                    if (!PartyBookingByCityIdRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't find party booking by city id"
                        });
                    }
                    finalDataTableArray.push({
                        cityName: cityName,
                        data: PartyBookingByCityIdRes
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
                    data: PartyBookingTotalOfCityForEachQuarterRes,
                    dataArray: finalDataTableArray,
                }
            });
        } catch (err) {
            console.log(err)
            return res.status(400).json({
                status: "fail",
                message: "Error when get party booking total of city for each quarter list!",
                error: err
            });
        }
    },
    // Admin: Quản lý đặt Tiệc - Thống kê doanh thu Theo thành phố
    getStatisticPartyBookingTotalOfCityByDate: async (req, res) => {
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
        // Lấy ngày trong party booking từ dateFrom đến dateTo
        try {
            const fromDateToDateListRes = await getDistinctDateInPartyBookingOrderFromDateToDate(dateFrom, dateTo);
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
                            const totalRes = await getPartyBookingTotalOfCityByDateAndLimitAsc(date, 5);
                            if (!totalRes) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Cann't find party booking total by date"
                                });
                            }
                            // Lấy đơn đặt tiệc cho từng Ngày
                            try {
                                const partyBookingByDateRes = await getPartyBookingOrderByDate(date);
                                if (!partyBookingByDateRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find party booking by date"
                                    });
                                }
                                finalArray.push({
                                    date: date,
                                    data: totalRes,
                                    partyBookingOrderDetailList: partyBookingByDateRes
                                });
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getPartyBookingOrderByDate!",
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
                            const totalRes = await getPartyBookingTotalOfCityByDateAndLimitAsc(date, 10);
                            if (!totalRes) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Cann't find party booking total by date"
                                });
                            }
                            // Lấy đơn đặt tiệc cho từng Ngày
                            try {
                                const partyBookingByDateRes = await getPartyBookingOrderByDate(date);
                                if (!partyBookingByDateRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find party booking by date"
                                    });
                                }
                                finalArray.push({
                                    date: date,
                                    data: totalRes,
                                    partyBookingOrderDetailList: partyBookingByDateRes
                                });
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getPartyBookingOrderByDate!",
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
                            const totalRes = await getPartyBookingTotalOfCityByDateAndAsc(date);
                            if (!totalRes) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Cann't find party booking total by date"
                                });
                            }
                            // Lấy đơn đặt tiệc cho từng Ngày
                            try {
                                const partyBookingByDateRes = await getPartyBookingOrderByDate(date);
                                if (!partyBookingByDateRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find party booking by date"
                                    });
                                }
                                finalArray.push({
                                    date: date,
                                    data: totalRes,
                                    partyBookingOrderDetailList: partyBookingByDateRes
                                });
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getPartyBookingOrderByDate!",
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
                            const totalRes = await getPartyBookingTotalOfCityByDateAndLimitDesc(date, 5);
                            if (!totalRes) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Cann't find party booking total by date"
                                });
                            }
                            // Lấy đơn đặt tiệc cho từng Ngày
                            try {
                                const partyBookingByDateRes = await getPartyBookingOrderByDate(date);
                                if (!partyBookingByDateRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find party booking by date"
                                    });
                                }
                                finalArray.push({
                                    date: date,
                                    data: totalRes,
                                    partyBookingOrderDetailList: partyBookingByDateRes
                                });
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getPartyBookingOrderByDate!",
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
                            const totalRes = await getPartyBookingTotalOfCityByDateAndLimitDesc(date, 10);
                            if (!totalRes) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Cann't find party booking total by date"
                                });
                            }
                            // Lấy đơn đặt tiệc cho từng Ngày
                            try {
                                const partyBookingByDateRes = await getPartyBookingOrderByDate(date);
                                if (!partyBookingByDateRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find party booking by date"
                                    });
                                }
                                finalArray.push({
                                    date: date,
                                    data: totalRes,
                                    partyBookingOrderDetailList: partyBookingByDateRes
                                });
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getPartyBookingOrderByDate!",
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
                            const totalRes = await getPartyBookingTotalOfCityByDateAndDesc(date);
                            if (!totalRes) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Cann't find party booking total by date"
                                });
                            }
                            // Lấy đơn đặt tiệc cho từng Ngày
                            try {
                                const partyBookingByDateRes = await getPartyBookingOrderByDate(date);
                                if (!partyBookingByDateRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find party booking by date"
                                    });
                                }
                                finalArray.push({
                                    date: date,
                                    data: totalRes,
                                    partyBookingOrderDetailList: partyBookingByDateRes
                                });
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getPartyBookingOrderByDate!",
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
                    const PartyBookingTotalOfCityByDateRes = await getPartyBookingTotalOfCityByDateByListDate(fromDateToDateListRes, sortWay, 5);
                    if (!PartyBookingTotalOfCityByDateRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't get test"
                        });
                    }
                    statistisData = PartyBookingTotalOfCityByDateRes
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when getPartyBookingTotalOfCityByDateByListDate 5!",
                        error: err
                    });
                }
            }
            if (limit === "ten") {
                try {
                    const PartyBookingTotalOfCityByDateRes = await getPartyBookingTotalOfCityByDateByListDate(fromDateToDateListRes, sortWay, 10);
                    if (!PartyBookingTotalOfCityByDateRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't get test"
                        });
                    }
                    statistisData = PartyBookingTotalOfCityByDateRes
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when getPartyBookingTotalOfCityByDateByListDate 10!",
                        error: err
                    });
                }
            }
            if (limit === "all") {
                try {
                    // TEST
                    const PartyBookingTotalOfCityByDateRes = await getPartyBookingTotalOfCityByDateByListDateNoLimit(fromDateToDateListRes, sortWay);
                    if (!PartyBookingTotalOfCityByDateRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't get test"
                        });
                    }
                    statistisData = PartyBookingTotalOfCityByDateRes
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when getPartyBookingTotalOfCityByDateByListDateNoLimit!",
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

    // Admin: Quản lý đặt Tiệc - Thống kê doanh thu Theo thành phố
    getStatisticPartyBookingTotalOfCityByQuarter: async (req, res) => {
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
        let partyBookingOrderDetailList = [];
        // Nếu là quý 1
        if (quarter === 1) {
            if (sortWay === "desc") {
                if (limit === "five") {
                    // Quarter 1: -limit 5 - desc
                    try {
                        const partyBookingTotalQuarterRes = await getPartyBookingTotalOfCityByQuarterOneOrderByCaNamDescAndLimit(5);
                        if (!partyBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find party booking by Quarter 1: -limit 5 - desc"
                            });
                        }
                        finalDataArray = partyBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt tiệc chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < partyBookingTotalQuarterRes.length; j++) {
                            const cityId = partyBookingTotalQuarterRes[j].city_id;
                            try {
                                const partyBookingOrderListRes = await getPartyBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!partyBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find party booking order list by quarter and city id"
                                    });
                                }
                                partyBookingOrderListRes.map((partyBookingOrder, key) => {
                                    partyBookingOrderDetailList.push(partyBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getPartyBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getPartyBookingTotalOfCityByQuarterOneOrderByCaNamDescAndLimit 5!",
                            error: err
                        });
                    }
                }
                if (limit === "ten") {
                    // Quarter 1: -limit 10 - desc
                    try {
                        const partyBookingTotalQuarterRes = await getPartyBookingTotalOfCityByQuarterOneOrderByCaNamDescAndLimit(10);
                        if (!partyBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find party booking by Quarter 1: -limit 10 - desc"
                            });
                        }
                        finalDataArray = partyBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt tiệc chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < partyBookingTotalQuarterRes.length; j++) {
                            const cityId = partyBookingTotalQuarterRes[j].city_id;
                            try {
                                const partyBookingOrderListRes = await getPartyBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!partyBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find party booking order list by quarter and city id"
                                    });
                                }
                                partyBookingOrderListRes.map((partyBookingOrder, key) => {
                                    partyBookingOrderDetailList.push(partyBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getPartyBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getPartyBookingTotalOfCityByQuarterOneOrderByCaNamDescAndLimit 10!",
                            error: err
                        });
                    }
                }
                if (limit === "all") {
                    // Quarter 1: - no limit - desc
                    try {
                        const partyBookingTotalQuarterRes = await getPartyBookingTotalOfCityByQuarterOneOrderByCaNamDesc();
                        if (!partyBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find party booking by Quarter 1: - no limit - desc"
                            });
                        }
                        finalDataArray = partyBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt tiệc chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < partyBookingTotalQuarterRes.length; j++) {
                            const cityId = partyBookingTotalQuarterRes[j].city_id;
                            try {
                                const partyBookingOrderListRes = await getPartyBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!partyBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find party booking order list by quarter and city id"
                                    });
                                }
                                partyBookingOrderListRes.map((partyBookingOrder, key) => {
                                    partyBookingOrderDetailList.push(partyBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getPartyBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getPartyBookingTotalOfCityByQuarterOneOrderByCaNamDesc!",
                            error: err
                        });
                    }
                }
            }
            if (sortWay === "asc") {
                if (limit === "five") {
                    // Quarter 1: -limit 5 - asc
                    try {
                        const partyBookingTotalQuarterRes = await getPartyBookingTotalOfCityByQuarterOneOrderByCaNamAscAndLimit(5);
                        if (!partyBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find party booking by Quarter 1: -limit 5 - asc"
                            });
                        }
                        finalDataArray = partyBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt tiệc chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < partyBookingTotalQuarterRes.length; j++) {
                            const cityId = partyBookingTotalQuarterRes[j].city_id;
                            try {
                                const partyBookingOrderListRes = await getPartyBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!partyBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find party booking order list by quarter and city id"
                                    });
                                }
                                partyBookingOrderListRes.map((partyBookingOrder, key) => {
                                    partyBookingOrderDetailList.push(partyBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getPartyBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getPartyBookingTotalOfCityByQuarterOneOrderByCaNamAscAndLimit 5!",
                            error: err
                        });
                    }
                }
                if (limit === "ten") {
                    // Quarter 1: -limit 10 - asc
                    try {
                        const partyBookingTotalQuarterRes = await getPartyBookingTotalOfCityByQuarterOneOrderByCaNamAscAndLimit(10);
                        if (!partyBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find party booking by Quarter 1: -limit 10 - asc"
                            });
                        }
                        finalDataArray = partyBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt tiệc chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < partyBookingTotalQuarterRes.length; j++) {
                            const cityId = partyBookingTotalQuarterRes[j].city_id;
                            try {
                                const partyBookingOrderListRes = await getPartyBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!partyBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find party booking order list by quarter and city id"
                                    });
                                }
                                partyBookingOrderListRes.map((partyBookingOrder, key) => {
                                    partyBookingOrderDetailList.push(partyBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getPartyBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getPartyBookingTotalOfCityByQuarterOneOrderByCaNamAscAndLimit 10!",
                            error: err
                        });
                    }
                }
                if (limit === "all") {
                    // Quarter 1: - no limit - asc
                    try {
                        const partyBookingTotalQuarterRes = await getPartyBookingTotalOfCityByQuarterOneOrderByCaNamAsc();
                        if (!partyBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find party booking by Quarter 1: - no limit - asc"
                            });
                        }
                        finalDataArray = partyBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt tiệc chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < partyBookingTotalQuarterRes.length; j++) {
                            const cityId = partyBookingTotalQuarterRes[j].city_id;
                            try {
                                const partyBookingOrderListRes = await getPartyBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!partyBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find party booking order list by quarter and city id"
                                    });
                                }
                                partyBookingOrderListRes.map((partyBookingOrder, key) => {
                                    partyBookingOrderDetailList.push(partyBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getPartyBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getPartyBookingTotalOfCityByQuarterOneOrderByCaNamAsc!",
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
                        const partyBookingTotalQuarterRes = await getPartyBookingTotalOfCityByQuarterTwoOrderByCaNamDescAndLimit(5);
                        if (!partyBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find party booking by Quarter 2: -limit 5 - desc"
                            });
                        }
                        finalDataArray = partyBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt tiệc chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < partyBookingTotalQuarterRes.length; j++) {
                            const cityId = partyBookingTotalQuarterRes[j].city_id;
                            try {
                                const partyBookingOrderListRes = await getPartyBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!partyBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find party booking order list by quarter and city id"
                                    });
                                }
                                partyBookingOrderListRes.map((partyBookingOrder, key) => {
                                    partyBookingOrderDetailList.push(partyBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getPartyBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getPartyBookingTotalOfCityByQuarterTwoOrderByCaNamDescAndLimit 5!",
                            error: err
                        });
                    }
                }
                if (limit === "ten") {
                    // Quarter 2: -limit 10 - desc
                    try {
                        const partyBookingTotalQuarterRes = await getPartyBookingTotalOfCityByQuarterTwoOrderByCaNamDescAndLimit(10);
                        if (!partyBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find party booking by Quarter 2: -limit 10 - desc"
                            });
                        }
                        finalDataArray = partyBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt tiệc chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < partyBookingTotalQuarterRes.length; j++) {
                            const cityId = partyBookingTotalQuarterRes[j].city_id;
                            try {
                                const partyBookingOrderListRes = await getPartyBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!partyBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find party booking order list by quarter and city id"
                                    });
                                }
                                partyBookingOrderListRes.map((partyBookingOrder, key) => {
                                    partyBookingOrderDetailList.push(partyBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getPartyBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getPartyBookingTotalOfCityByQuarterTwoOrderByCaNamDescAndLimit 10!",
                            error: err
                        });
                    }
                }
                if (limit === "all") {
                    // Quarter 2: - no limit - desc
                    try {
                        const partyBookingTotalQuarterRes = await getPartyBookingTotalOfCityByQuarterTwoOrderByCaNamDesc();
                        if (!partyBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find party booking by Quarter 2: - no limit - desc"
                            });
                        }
                        finalDataArray = partyBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt tiệc chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < partyBookingTotalQuarterRes.length; j++) {
                            const cityId = partyBookingTotalQuarterRes[j].city_id;
                            try {
                                const partyBookingOrderListRes = await getPartyBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!partyBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find party booking order list by quarter and city id"
                                    });
                                }
                                partyBookingOrderListRes.map((partyBookingOrder, key) => {
                                    partyBookingOrderDetailList.push(partyBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getPartyBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getPartyBookingTotalOfCityByQuarterTwoOrderByCaNamDesc!",
                            error: err
                        });
                    }
                }
            }
            if (sortWay === "asc") {
                if (limit === "five") {
                    // Quarter 2: -limit 5 - asc
                    try {
                        const partyBookingTotalQuarterRes = await getPartyBookingTotalOfCityByQuarterTwoOrderByCaNamAscAndLimit(5);
                        if (!partyBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find party booking by Quarter 2: -limit 5 - asc"
                            });
                        }
                        finalDataArray = partyBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt tiệc chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < partyBookingTotalQuarterRes.length; j++) {
                            const cityId = partyBookingTotalQuarterRes[j].city_id;
                            try {
                                const partyBookingOrderListRes = await getPartyBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!partyBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find party booking order list by quarter and city id"
                                    });
                                }
                                partyBookingOrderListRes.map((partyBookingOrder, key) => {
                                    partyBookingOrderDetailList.push(partyBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getPartyBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getPartyBookingTotalOfCityByQuarterTwoOrderByCaNamAscAndLimit 5!",
                            error: err
                        });
                    }
                }
                if (limit === "ten") {
                    // Quarter 2: -limit 10 - asc
                    try {
                        const partyBookingTotalQuarterRes = await getPartyBookingTotalOfCityByQuarterTwoOrderByCaNamAscAndLimit(10);
                        if (!partyBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find party booking by Quarter 2: -limit 10 - asc"
                            });
                        }
                        finalDataArray = partyBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt tiệc chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < partyBookingTotalQuarterRes.length; j++) {
                            const cityId = partyBookingTotalQuarterRes[j].city_id;
                            try {
                                const partyBookingOrderListRes = await getPartyBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!partyBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find party booking order list by quarter and city id"
                                    });
                                }
                                partyBookingOrderListRes.map((partyBookingOrder, key) => {
                                    partyBookingOrderDetailList.push(partyBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getPartyBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getPartyBookingTotalOfCityByQuarterTwoOrderByCaNamAscAndLimit 10!",
                            error: err
                        });
                    }
                }
                if (limit === "all") {
                    // Quarter 2: - no limit - asc
                    try {
                        const partyBookingTotalQuarterRes = await getPartyBookingTotalOfCityByQuarterTwoOrderByCaNamAsc();
                        if (!partyBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find party booking by Quarter 2: - no limit - asc"
                            });
                        }
                        finalDataArray = partyBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt tiệc chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < partyBookingTotalQuarterRes.length; j++) {
                            const cityId = partyBookingTotalQuarterRes[j].city_id;
                            try {
                                const partyBookingOrderListRes = await getPartyBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!partyBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find party booking order list by quarter and city id"
                                    });
                                }
                                partyBookingOrderListRes.map((partyBookingOrder, key) => {
                                    partyBookingOrderDetailList.push(partyBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getPartyBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getPartyBookingTotalOfCityByQuarterTwoOrderByCaNamAsc!",
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
                        const partyBookingTotalQuarterRes = await getPartyBookingTotalOfCityByQuarterThreeOrderByCaNamDescAndLimit(5);
                        if (!partyBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find party booking by Quarter 3: -limit 5 - desc"
                            });
                        }
                        finalDataArray = partyBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt tiệc chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < partyBookingTotalQuarterRes.length; j++) {
                            const cityId = partyBookingTotalQuarterRes[j].city_id;
                            try {
                                const partyBookingOrderListRes = await getPartyBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!partyBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find party booking order list by quarter and city id"
                                    });
                                }
                                partyBookingOrderListRes.map((partyBookingOrder, key) => {
                                    partyBookingOrderDetailList.push(partyBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getPartyBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getPartyBookingTotalOfCityByQuarterThreeOrderByCaNamDescAndLimit 5!",
                            error: err
                        });
                    }
                }
                if (limit === "ten") {
                    // Quarter 3: -limit 10 - desc
                    try {
                        const partyBookingTotalQuarterRes = await getPartyBookingTotalOfCityByQuarterThreeOrderByCaNamDescAndLimit(10);
                        if (!partyBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find party booking by Quarter 3: -limit 10 - desc"
                            });
                        }
                        finalDataArray = partyBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt tiệc chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < partyBookingTotalQuarterRes.length; j++) {
                            const cityId = partyBookingTotalQuarterRes[j].city_id;
                            try {
                                const partyBookingOrderListRes = await getPartyBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!partyBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find party booking order list by quarter and city id"
                                    });
                                }
                                partyBookingOrderListRes.map((partyBookingOrder, key) => {
                                    partyBookingOrderDetailList.push(partyBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getPartyBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getPartyBookingTotalOfCityByQuarterThreeOrderByCaNamDescAndLimit 10!",
                            error: err
                        });
                    }
                }
                if (limit === "all") {
                    // Quarter 3: - no limit - desc
                    try {
                        const partyBookingTotalQuarterRes = await getPartyBookingTotalOfCityByQuarterThreeOrderByCaNamDesc();
                        if (!partyBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find party booking by Quarter 3: - no limit - desc"
                            });
                        }
                        finalDataArray = partyBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt tiệc chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < partyBookingTotalQuarterRes.length; j++) {
                            const cityId = partyBookingTotalQuarterRes[j].city_id;
                            try {
                                const partyBookingOrderListRes = await getPartyBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!partyBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find party booking order list by quarter and city id"
                                    });
                                }
                                partyBookingOrderListRes.map((partyBookingOrder, key) => {
                                    partyBookingOrderDetailList.push(partyBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getPartyBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getPartyBookingTotalOfCityByQuarterThreeOrderByCaNamDesc!",
                            error: err
                        });
                    }
                }
            }
            if (sortWay === "asc") {
                if (limit === "five") {
                    // Quarter 3: -limit 5 - asc
                    try {
                        const partyBookingTotalQuarterRes = await getPartyBookingTotalOfCityByQuarterThreeOrderByCaNamAscAndLimit(5);
                        if (!partyBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find party booking by Quarter 3: -limit 5 - asc"
                            });
                        }
                        finalDataArray = partyBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt tiệc chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < partyBookingTotalQuarterRes.length; j++) {
                            const cityId = partyBookingTotalQuarterRes[j].city_id;
                            try {
                                const partyBookingOrderListRes = await getPartyBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!partyBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find party booking order list by quarter and city id"
                                    });
                                }
                                partyBookingOrderListRes.map((partyBookingOrder, key) => {
                                    partyBookingOrderDetailList.push(partyBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getPartyBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getPartyBookingTotalOfCityByQuarterThreeOrderByCaNamAscAndLimit 5!",
                            error: err
                        });
                    }
                }
                if (limit === "ten") {
                    // Quarter 3: -limit 10 - asc
                    try {
                        const partyBookingTotalQuarterRes = await getPartyBookingTotalOfCityByQuarterThreeOrderByCaNamAscAndLimit(10);
                        if (!partyBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find party booking by Quarter 3: -limit 10 - asc"
                            });
                        }
                        finalDataArray = partyBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt tiệc chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < partyBookingTotalQuarterRes.length; j++) {
                            const cityId = partyBookingTotalQuarterRes[j].city_id;
                            try {
                                const partyBookingOrderListRes = await getPartyBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!partyBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find party booking order list by quarter and city id"
                                    });
                                }
                                partyBookingOrderListRes.map((partyBookingOrder, key) => {
                                    partyBookingOrderDetailList.push(partyBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getPartyBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getPartyBookingTotalOfCityByQuarterThreeOrderByCaNamAscAndLimit 10!",
                            error: err
                        });
                    }
                }
                if (limit === "all") {
                    // Quarter 3: - no limit - asc
                    try {
                        const partyBookingTotalQuarterRes = await getPartyBookingTotalOfCityByQuarterThreeOrderByCaNamAsc();
                        if (!partyBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find party booking by Quarter 3: - no limit - asc"
                            });
                        }
                        finalDataArray = partyBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt tiệc chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < partyBookingTotalQuarterRes.length; j++) {
                            const cityId = partyBookingTotalQuarterRes[j].city_id;
                            try {
                                const partyBookingOrderListRes = await getPartyBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!partyBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find party booking order list by quarter and city id"
                                    });
                                }
                                partyBookingOrderListRes.map((partyBookingOrder, key) => {
                                    partyBookingOrderDetailList.push(partyBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getPartyBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getPartyBookingTotalOfCityByQuarterThreeOrderByCaNamAsc!",
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
                        const partyBookingTotalQuarterRes = await getPartyBookingTotalOfCityByQuarterFourOrderByCaNamDescAndLimit(5);
                        if (!partyBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find party booking by Quarter 3: -limit 5 - desc"
                            });
                        }
                        finalDataArray = partyBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt tiệc chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < partyBookingTotalQuarterRes.length; j++) {
                            const cityId = partyBookingTotalQuarterRes[j].city_id;
                            try {
                                const partyBookingOrderListRes = await getPartyBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!partyBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find party booking order list by quarter and city id"
                                    });
                                }
                                partyBookingOrderListRes.map((partyBookingOrder, key) => {
                                    partyBookingOrderDetailList.push(partyBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getPartyBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
                    } catch (err) {
                        console.log("err", err)
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getPartyBookingTotalOfCityByQuarterFourOrderByCaNamDescAndLimit 5!",
                            error: err
                        });
                    }
                }
                if (limit === "ten") {
                    // Quarter 4: -limit 10 - desc
                    try {
                        const partyBookingTotalQuarterRes = await getPartyBookingTotalOfCityByQuarterFourOrderByCaNamDescAndLimit(10);
                        if (!partyBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find party booking by Quarter 4: -limit 10 - desc"
                            });
                        }
                        finalDataArray = partyBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt tiệc chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < partyBookingTotalQuarterRes.length; j++) {
                            const cityId = partyBookingTotalQuarterRes[j].city_id;
                            try {
                                const partyBookingOrderListRes = await getPartyBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!partyBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find party booking order list by quarter and city id"
                                    });
                                }
                                partyBookingOrderListRes.map((partyBookingOrder, key) => {
                                    partyBookingOrderDetailList.push(partyBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getPartyBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getPartyBookingTotalOfCityByQuarterFourOrderByCaNamDescAndLimit 10!",
                            error: err
                        });
                    }
                }
                if (limit === "all") {
                    // Quarter 4: - no limit - desc
                    try {
                        const partyBookingTotalQuarterRes = await getPartyBookingTotalOfCityByQuarterFourOrderByCaNamDesc();
                        if (!partyBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find party booking by Quarter 4: - no limit - desc"
                            });
                        }
                        finalDataArray = partyBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt tiệc chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < partyBookingTotalQuarterRes.length; j++) {
                            const cityId = partyBookingTotalQuarterRes[j].city_id;
                            try {
                                const partyBookingOrderListRes = await getPartyBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!partyBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find party booking order list by quarter and city id"
                                    });
                                }
                                partyBookingOrderListRes.map((partyBookingOrder, key) => {
                                    partyBookingOrderDetailList.push(partyBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getPartyBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getPartyBookingTotalOfCityByQuarterFourOrderByCaNamDesc!",
                            error: err
                        });
                    }
                }
            }
            if (sortWay === "asc") {
                if (limit === "five") {
                    // Quarter 4: -limit 5 - asc
                    try {
                        const partyBookingTotalQuarterRes = await getPartyBookingTotalOfCityByQuarterFourOrderByCaNamAscAndLimit(5);
                        if (!partyBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find party booking by Quarter 4: -limit 5 - asc"
                            });
                        }
                        finalDataArray = partyBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt tiệc chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < partyBookingTotalQuarterRes.length; j++) {
                            const cityId = partyBookingTotalQuarterRes[j].city_id;
                            try {
                                const partyBookingOrderListRes = await getPartyBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!partyBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find party booking order list by quarter and city id"
                                    });
                                }
                                partyBookingOrderListRes.map((partyBookingOrder, key) => {
                                    partyBookingOrderDetailList.push(partyBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getPartyBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getPartyBookingTotalOfCityByQuarterFourOrderByCaNamAscAndLimit 5!",
                            error: err
                        });
                    }
                }
                if (limit === "ten") {
                    // Quarter 4: -limit 10 - asc
                    try {
                        const partyBookingTotalQuarterRes = await getPartyBookingTotalOfCityByQuarterFourOrderByCaNamAscAndLimit(10);
                        if (!partyBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find party booking by Quarter 4: -limit 10 - asc"
                            });
                        }
                        finalDataArray = partyBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt tiệc chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < partyBookingTotalQuarterRes.length; j++) {
                            const cityId = partyBookingTotalQuarterRes[j].city_id;
                            try {
                                const partyBookingOrderListRes = await getPartyBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!partyBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find party booking order list by quarter and city id"
                                    });
                                }
                                partyBookingOrderListRes.map((partyBookingOrder, key) => {
                                    partyBookingOrderDetailList.push(partyBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getPartyBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getPartyBookingTotalOfCityByQuarterFourOrderByCaNamAscAndLimit 10!",
                            error: err
                        });
                    }
                }
                if (limit === "all") {
                    // Quarter 4: - no limit - asc
                    try {
                        const partyBookingTotalQuarterRes = await getPartyBookingTotalOfCityByQuarterFourOrderByCaNamAsc();
                        if (!partyBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find party booking by Quarter 4: - no limit - asc"
                            });
                        }
                        finalDataArray = partyBookingTotalQuarterRes;
                        // Lấy danh sách đơn đặt tiệc chi tiết cho từng city thuộc quý đó
                        for (var j = 0; j < partyBookingTotalQuarterRes.length; j++) {
                            const cityId = partyBookingTotalQuarterRes[j].city_id;
                            try {
                                const partyBookingOrderListRes = await getPartyBookingOrderByQuarterAndCityId(quarter, cityId);
                                if (!partyBookingOrderListRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't find party booking order list by quarter and city id"
                                    });
                                }
                                partyBookingOrderListRes.map((partyBookingOrder, key) => {
                                    partyBookingOrderDetailList.push(partyBookingOrder);
                                })
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when getPartyBookingOrderByQuarterAndCityId!",
                                    error: err
                                });
                            }
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getPartyBookingTotalOfCityByQuarterFourOrderByCaNamAsc!",
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
                partyBookingOrderDetailList: partyBookingOrderDetailList
            }
        });
    },
};