const { createPartyBookingOrder, findPartyBookingOrder, getPartyBookingsAndDetail, getQuantityPartyBookings, findPartyBookingByIdOrCustomerEmailOrCustomerPhoneOrCustomerName, findPartyBookingById, findPartyBookingOrderByIdCheckIn, updatePartyBookingOrderInfoWhenCheckInSuccess, updatePartyBookingOrderState, updatePartyBookingOrderFinishDateWhenCheckOutSuccess, getDistinctDateInPartyBookingOrderFromDateToDate, getPartyBookingTotalByDate, getPartyBookingTotalByMonth, getLimitPartyBookingTotalOfCityForEachQuarter, getPartyBookingOrderByCityId, getPartyBookingTotalOfCityByDateAndLimitAsc, getPartyBookingTotalOfCityByDateAndAsc, getPartyBookingTotalOfCityByDateAndLimitDesc, getPartyBookingTotalOfCityByDateAndDesc, getPartyBookingTotalOfCityByDateByListDate, getPartyBookingTotalOfCityByDateByListDateNoLimit, getPartyBookingTotalOfCityByQuarterOneOrderByCaNamDescAndLimit, getPartyBookingTotalOfCityByQuarterOneOrderByCaNamDesc, getPartyBookingTotalOfCityByQuarterOneOrderByCaNamAscAndLimit, getPartyBookingTotalOfCityByQuarterOneOrderByCaNamAsc, getPartyBookingTotalOfCityByQuarterTwoOrderByCaNamDescAndLimit, getPartyBookingTotalOfCityByQuarterTwoOrderByCaNamDesc, getPartyBookingTotalOfCityByQuarterTwoOrderByCaNamAscAndLimit, getPartyBookingTotalOfCityByQuarterTwoOrderByCaNamAsc, getPartyBookingTotalOfCityByQuarterThreeOrderByCaNamDescAndLimit, getPartyBookingTotalOfCityByQuarterThreeOrderByCaNamDesc, getPartyBookingTotalOfCityByQuarterThreeOrderByCaNamAscAndLimit, getPartyBookingTotalOfCityByQuarterThreeOrderByCaNamAsc, getPartyBookingTotalOfCityByQuarterFourOrderByCaNamDescAndLimit, getPartyBookingTotalOfCityByQuarterFourOrderByCaNamDesc, getPartyBookingTotalOfCityByQuarterFourOrderByCaNamAscAndLimit, getPartyBookingTotalOfCityByQuarterFourOrderByCaNamAsc, getPartyBookingOrderFromDateToDate, getPartyBookingOrderOfQuarter, getPartyBookingOrderByDate, getPartyBookingOrderByQuarterAndCityId, getPartyBookingTotalOfTypeByQuarterOneOrderByCaNam, getPartyBookingOrderByQuarterAndPartyBookingTypeName, getPartyBookingTotalOfTypeByQuarterTwoOrderByCaNam, getPartyBookingTotalOfTypeByQuarterThreeOrderByCaNam, getPartyBookingTotalOfTypeByQuarterFourOrderByCaNam, getPartyBookingTotalOfTypeByDate, getPartyBookingOrderByDateAndPartyBookingTypeName, getPartyBookingTotalOfTypeByDateByListDate, getPartyBookingTotalOfCustomerByQuarterOneOrderByCaNam, getPartyBookingOrderByQuarterAndCustomerId, getPartyBookingTotalOfCustomerByQuarterTwoOrderByCaNam, getPartyBookingTotalOfCustomerByQuarterThreeOrderByCaNam, getPartyBookingTotalOfCustomerByQuarterFourOrderByCaNam, getPartyBookingTotalOfCustomerByDate, getPartyBookingOrderByDateAndCustomerId, getPartyBookingTotalOfCustomerByDateByListDate } = require("../service/PartyBookingOrderService");
const { createPartyHallDetail, getPartyHallDetailByPartyBookingOrderId } = require("../service/PartyHallDetailService");
const { getPartyHallWithTypeFloorByPartyHallId } = require("../service/PartyHallService");
const { getSetMenuBySetMenuId } = require("../service/SetMenuService");
const { format_money, createLogAdmin } = require("../utils/utils");

const { getPartyBookingTypeByPartyBookingTypeId } = require("../service/PartyBookingTypeService");
const { getPartyHallTimeByPartyHallTimeId } = require("../service/PartyHallTimeService");
const { updateDiscountState } = require("../service/DiscountService");
const { getCustomerByCustomerId, findCustomerByEmailOrPhoneNumber, findCustomerInPartyBookingOrder } = require("../service/CustomerService");
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

        // L???y ng??y hi???n t???i FORMAT: '2022-05-05 13:48:12' gi???ng CSDL
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var partyBookingOrderBookDate = date + ' ' + time;

        if (!partyBookingOrderPrice || !Number.isInteger(partyBookingOrderPrice) || partyBookingOrderPrice <= 0) {
            return res.status(404).json({
                status: "fail",
                message: "Book price kh??ng h???p l???!"
            });
        }
        if (partyBookingOrderSurcharge === null) {
            return res.status(404).json({
                status: "fail",
                message: "Book surcharge kh??ng h???p l???!"
            });
        }
        if (!partyBookingOrderTotal || !Number.isInteger(partyBookingOrderTotal) || partyBookingOrderTotal <= 0) {
            return res.status(404).json({
                status: "fail",
                message: "Book total kh??ng h???p l???!"
            });
        }
        if (discountId === null) {
            return res.status(404).json({
                status: "fail",
                message: "Discount id kh??ng h???p l???!"
            });
        }
        if (!customerId || !Number.isInteger(customerId) || customerId <= 0) {
            return res.status(404).json({
                status: "fail",
                message: "Customer id kh??ng h???p l???!"
            });
        }
        if (!setMenuId || !Number.isInteger(setMenuId) || setMenuId <= 0) {
            return res.status(404).json({
                status: "fail",
                message: "Set menu id kh??ng h???p l???!"
            });
        }
        if (!partyBookingTypeId || !Number.isInteger(partyBookingTypeId) || partyBookingTypeId <= 0) {
            return res.status(404).json({
                status: "fail",
                message: "Party booking type id kh??ng h???p l???!"
            });
        }

        if (!partyHallDetailDate) {
            return res.status(404).json({
                status: "fail",
                message: "Party hall detail date kh??ng h???p l???!"
            });
        }
        if (!partyHallDetailName) {
            return res.status(404).json({
                status: "fail",
                message: "Party hall detail name kh??ng h???p l???!"
            });
        }
        if (!partyHallId || !Number.isInteger(partyHallId) || partyHallId <= 0) {
            return res.status(404).json({
                status: "fail",
                message: "Party hall id kh??ng h???p l???!"
            });
        }
        if (!partyHallTimeId || !Number.isInteger(partyHallTimeId) || partyHallTimeId <= 0) {
            return res.status(404).json({
                status: "fail",
                message: "Party hall time id kh??ng h???p l???!"
            });
        }
        // T???o ?????t ti???c
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
                // T??m ?????t ti???c v???a ?????t
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
                        // T???o chi ti???t ?????t ti???c
                        try {
                            const createpartyHallDetailRes = await createPartyHallDetail(
                                partyHallDetailName,
                                partyHallDetailDate,
                                partyHallId,
                                partyHallTimeId,
                                partyBookingOrderId
                            );
                            if (createpartyHallDetailRes) {
                                // C???p nh???t m?? gi???m gi??
                                try {
                                    const updateDiscountStateRes = await updateDiscountState(discountId, 1);
                                    if (updateDiscountStateRes) {
                                        // T???o chi ti???t cho nh???ng m??n ??n ???? ch???n
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
                                        // T???o chi ti???t cho nh???ng D???ch v??? ???? ch???n (State = 0) do ???? thanh to??n
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
                                        // G???i mail
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
                                            noidung += '<div><p>C???m ??n b???n ???? tin t?????ng v?? ?????t ti???c t???i <font color="#41f1b6"><b>Ho??ng Long Hotel &amp; Restaurant</b></font> v???i m?? ?????t ti???c: ' + partyBookingOrderId + '</p></div>';
                                            noidung += '<p><b>Kh??ch h??ng:</b> ' + customerName + '<br /><b>Email:</b> ' + customerEmail + '<br /><b>??i???n tho???i:</b> ' + customerPhoneNumber + '<br /><b>Lo???i ti???c:</b> ' + partyBookingTypeName + '<br /><b>Th???i gian:</b> ' + partyHallDetailDate + ', ' + partyHallTimeName + '<br />';

                                            // ?????t s???nh
                                            noidung += ' <table border="1px" cellpadding="10px" cellspacing="1px"width="100%"><tr><td align="center" bgcolor="#41f1b6" colspan="4"><fontcolor="white"><b>????N ?????T TI???C C???A B???N</b></fontcolor=></td></tr><tr id="invoice-bar"><td width="45%"><b>T??n s???nh</b></td><td width="20%"><b>Lo???i s???nh</b></td><td width="15%"><b>V??? tr??</b></td><td width="20%"><b>Gi?? ti???n</b></td></tr>';
                                            noidung += '<tr><td class="prd-name">' + partyHallName + '</td><td class="prd-price"><font color="#41f1b6">' + partyHallTypeName + '</font></td><td class="prd-number">' + partyHallFloorName + " - " + partyHallView + '</td><td class="prd-total"><font color="#41f1b6">' + format_money(partyHallPrice) + ' VN??</font></td></tr>';
                                            noidung += '<tr><td class="prd-name"><b>T???ng ti???n:</b></td><td class="prd-total" colspan="3"><b><font color="#41f1b6">' + format_money(partyHallPrice) + ' VN??</font></b></td></tr></table>';

                                            // ?????t d???ch v???
                                            noidung += ' <table border="1px" cellpadding="10px" cellspacing="1px"width="100%"><tr><td align="center" bgcolor="#41f1b6" colspan="2"><fontcolor="white"><b>NH???NG D???CH V??? ???? CH???N</b></fontcolor=></td></tr><tr id="invoice-bar"><td width="70%"><b>T??n d???ch v???</b></td><td width="30%"><b>Gi?? ti???n</b></td></tr>';
                                            for (var i = 0; i < serviceList.length; i++) {
                                                noidung += '<tr><td class="prd-name">' + serviceList[i].party_service_name + '</td><td class="prd-price"><font color="#41f1b6">' + format_money(serviceList[i].party_service_price) + ' VN??</font></td></tr>';
                                            };
                                            noidung += '<tr><td class="prd-name"><b>T???ng ti???n:</b></td><td><font color="#41f1b6">' + format_money(servicePrice) + ' VN??</font></td></tr></table>';

                                            // ?????t menu
                                            noidung += ' <table border="1px" cellpadding="10px" cellspacing="1px"width="100%"><tr><td align="center" bgcolor="#41f1b6" colspan="2"><fontcolor="white"><b>MENU TI???C - ' + setMenuName + '</b></fontcolor=></td></tr><tr id="invoice-bar"><td width="50%"><b>Lo???i m??n ??n</b></td><td width="50%"><b>T??n m??n ??n</b></td></tr>';
                                            for (var i = 0; i < foodList.length; i++) {
                                                noidung += '<tr><td class="prd-name">' + foodList[i].food_type_name + '</td><td class="prd-price"><font color="#41f1b6">' + foodList[i].food_name + '</font></td></tr>';
                                            };
                                            noidung += '<tr><td class="prd-name"><b>T???ng ti???n: </b><br/><font color="#41f1b6">' + format_money(setMenuPrice) + ' VN??</font> x <font color="#41f1b6">' + tableQuantity + ' B??n ti???c</font></td><td class="prd-total"><b><font color="#41f1b6">' + format_money(setMenuPrice * tableQuantity) + ' VN??</font></b></td></tr></table>';

                                            noidung += '<p align="justify"><b>T???ng ti???n:&emsp;&emsp;&emsp;&emsp;<font color="#41f1b6">' + format_money(partyPriceTotalNoDiscount) + ' VN??</font></b><br /></p>';
                                            noidung += '<p align="justify"><b>???????c gi???m gi??:&emsp;&emsp;<font color="#41f1b6">' + format_money(partyPriceTotalNoDiscount - partyBookingOrderTotal) + ' VN??</font></b><br /></p>';
                                            noidung += '<p align="justify"><b>T???ng c???ng:&emsp;&emsp;&emsp;&emsp;<font color="#41f1b6">' + format_money(partyBookingOrderTotal) + ' VN??</font></b><br /></p>';
                                            noidung += '<p align="justify"><b>Qu?? kh??ch ???? ?????t ti???c th??nh c??ng!</b><br/><b><br />C??m ??n Qu?? kh??ch ???? l???a ch???n d???ch v??? c???a ch??ng t??i!</b></p>';
                                            // ----- Mailer Option -----
                                            var mailOptions = {
                                                from: 'Ho??ng Long Hotel &amp; Restaurant',
                                                to: customerEmail,
                                                subject: '?????t ti???c t???i Ho??ng Long th??nh c??ng!',
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

    // ADMIN: Qu???n l?? ?????t ti???c
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
                message: "L???y party bookings th??nh c??ng",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "L???i getPartyBookingsAndDetail",
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
                message: "L???y quantity parrty bookings th??nh c??ng",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "L???i getQuantityPartyBookings",
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
                message: "T??m party bookings th??nh c??ng",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "L???i findPartyBookingByIdOrCustomerEmailOrCustomerPhoneOrCustomerName",
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
                message: "T??m party bookings th??nh c??ng",
                data: result
            });
        } catch (err) {
            console.log("ERR: ", err);
            return res.status(400).json({
                status: "fail",
                message: "L???i findPartyBookingById",
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
        if (!partyBookingOrderIdentityCard) {
            return res.status(400).json({
                status: "fail",
                message: "S??? ch???ng minh th?? c???a kh??ch h??ng kh??ng h???p l???!"
            });
        }
        if (!partyBookingOrderNation) {
            return res.status(400).json({
                status: "fail",
                message: "Qu???c t???ch c???a kh??ch h??ng kh??ng h???p l???!"
            });
        }
        if (!partyBookingOrderAddress) {
            return res.status(400).json({
                status: "fail",
                message: "?????a ch??? c???a kh??ch h??ng kh??ng h???p l???!"
            });
        }
        if (!partyBookingOrderWardId || partyBookingOrderWardId === '' || partyBookingOrderWardId === undefined || partyBookingOrderWardId === null) {
            return res.status(400).json({
                status: "fail",
                message: "M?? X?? ph?????ng c???a kh??ch h??ng kh??ng h???p l???!"
            });
        }
        if (!partyBookingOrderId || !Number.isInteger(partyBookingOrderId) || partyBookingOrderId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "M?? ?????t ti???c kh??ng h???p l???!"
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
                    message: "H??? t??n kh??ng ????ng v???i email/ SDT ???? ?????t ti???c!"
                });
            }
            // T??m party booking order
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
                        message: "????n ?????t n??y ???? Check in ho???c ???? ho??n th??nh r???i!"
                    });
                }
                // Ki???m tra ng?????i d??ng ph???i ng?????i ???? ?????t ti???c n??y kh??ng?
                const customerIdInPartyBookingOrder = partyBookingOrderRes.customer_id;
                if (customerIdRes !== customerIdInPartyBookingOrder) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Ph??ng kh??ng ???????c ?????t b???i kh??ch h??ng n??y!"
                    });
                }
                // Ki???m tra ng??y check in xem ph???i ng??y mu???n c??? h??nh kh??ng? - L???y ng??y c??? h??nh ???? ch???n ??? party hall detail
                try {
                    const partyHallDetailRes = await getPartyHallDetailByPartyBookingOrderId(partyBookingOrderId);
                    if (!partyHallDetailRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Record party hall detail not found"
                        });
                    }
                    var dateCheckinRes = new Date(partyHallDetailRes.party_hall_detail_date);

                    // So s??nh ng??y
                    var today = new Date();
                    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + (today.getDate() + 1);
                    var checkInDate = new Date(date);
                    checkInDate.setHours(-17, 0, 0, 0);
                    if (checkInDate < dateCheckinRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Kh??ng th??? Check in tr?????c ng??y C??? h??nh ti???c: " + partyHallDetailRes.party_hall_detail_date
                        });
                    }
                    if (checkInDate > dateCheckinRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Ng??y Check in ???? qu?? ng??y C??? h??nh ti???c: " + partyHallDetailRes.party_hall_detail_date
                        });
                    }
                    // T??m X?? ph?????ng c?? t???n t???i kh??ng
                    try {
                        const wardRes = await getWardByWardId(partyBookingOrderWardId);
                        if (!wardRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find ward"
                            });
                        }
                        // C???p nh???t s??? cmnd v?? qu???c t???ch v?? ng??y b???t ?????u nh???n ti???c
                        // L???y ng??y hi???n t???i FORMAT: '2022-05-05 13:48:12' gi???ng CSDL
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
                            // C???p nh???t state
                            try {
                                const updateStateRes = await updatePartyBookingOrderState(1, partyBookingOrderId);
                                if (!updateStateRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't update party booking state when check in success"
                                    });
                                }

                                createLogAdmin(req, res, " v???a Check in cho ????n ?????t ti???c c?? m??: " + partyBookingOrderId, "UPDATE").then(() => {
                                    // Success
                                    return res.status(200).json({
                                        status: "success",
                                        message: "Check in th??nh c??ng!"
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
                message: "M?? ?????t ti???c kh??ng h???p l???!"
            });
        }
        // T??m party booking order xem c?? kh??ng
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
                    message: "????n ?????t n??y ch??a Check in ho???c ???? ho??n th??nh r???i!"
                });
            }
            // Ki???m tra ng??y check in xem ph???i ng??y mu???n c??? h??nh kh??ng? - L???y ng??y c??? h??nh ???? ch???n ??? party hall detail
            try {
                const partyHallDetailRes = await getPartyHallDetailByPartyBookingOrderId(partyBookingOrderId);
                if (!partyHallDetailRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Record party hall detail not found"
                    });
                }
                var dateCheckinRes = new Date(partyHallDetailRes.party_hall_detail_date);

                // So s??nh ng??y
                var today = new Date();
                var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + (today.getDate() + 1);
                var checkInDate = new Date(date);
                checkInDate.setHours(-17, 0, 0, 0);
                if (checkInDate < dateCheckinRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Kh??ng th??? Check out tr?????c ng??y C??? h??nh ti???c: " + partyHallDetailRes.party_hall_detail_date
                    });
                }
                if (checkInDate > dateCheckinRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Ng??y Check out ???? qu?? ng??y C??? h??nh ti???c: " + partyHallDetailRes.party_hall_detail_date
                    });
                }

                // C???p nh???t ng??y ho??n th??nh check out: finish date
                // L???y ng??y hi???n t???i FORMAT: '2022-05-05 13:48:12' gi???ng CSDL
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
                    // C???p nh???t state
                    try {
                        const updateStateRes = await updatePartyBookingOrderState(2, partyBookingOrderId);
                        if (!updateStateRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't update party booking state when check out success"
                            });
                        }

                        createLogAdmin(req, res, " v???a Check out cho ????n ?????t ti???c c?? m??: " + partyBookingOrderId, "UPDATE").then(() => {
                            // Success
                            return res.status(200).json({
                                status: "success",
                                message: "Check out th??nh c??ng!"
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

    // Admin: Qu???n l?? ?????t Ti???c - Th???ng k?? doanh thu
    getStatisticPartyBookingTotalByDate: async (req, res) => {
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
        // L???y ng??y trong party booking t??? dateFrom ?????n dateTo
        try {
            const fromDateToDateListRes = await getDistinctDateInPartyBookingOrderFromDateToDate(dateFrom, dateTo);
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
            // L???y danh s??ch ?????t ti???c chi ti???t
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
                message: "Th???ng k?? doanh thu theo ng??y th??nh c??ng!",
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
    // Admin: Qu???n l?? ?????t Ti???c - Th???ng k?? doanh thu
    getStatisticPartyBookingTotalByQuarter: async (req, res) => {
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
        // L???y danh s??ch ?????t ti???c chi ti???t
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
            message: "Th???ng k?? doanh thu theo Th??ng trong Qu?? th??nh c??ng!",
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
    // Admin: Qu???n l?? ?????t Ti???c - Th???ng k?? doanh thu Theo th??nh ph???
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
            // L???y ng??y hi???n t???i FORMAT: '2022-05-05 13:48:12' gi???ng CSDL
            var todayCheckIn = new Date();
            var dateCheckIn = todayCheckIn.getFullYear() + '-' + (todayCheckIn.getMonth() + 1) + '-' + todayCheckIn.getDate();
            var timeCheckIn = todayCheckIn.getHours() + ":" + todayCheckIn.getMinutes() + ":" + todayCheckIn.getSeconds();
            var statisticDate = dateCheckIn + ' ' + timeCheckIn;

            for (var i = 0; i < PartyBookingTotalOfCityForEachQuarterRes.length; i++) {
                const cityId = PartyBookingTotalOfCityForEachQuarterRes[i].city_id;
                const cityName = PartyBookingTotalOfCityForEachQuarterRes[i].city_name;
                // L???y ????n ?????t Ti???c cho t???ng city id
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
                message: "Th???ng k?? doanh thu theo Th??nh ph??? c???a 4 qu?? th??nh c??ng!",
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
    // Admin: Qu???n l?? ?????t Ti???c - Th???ng k?? doanh thu Theo th??nh ph???
    getStatisticPartyBookingTotalOfCityByDate: async (req, res) => {
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
        // L???y ng??y trong party booking t??? dateFrom ?????n dateTo
        try {
            const fromDateToDateListRes = await getDistinctDateInPartyBookingOrderFromDateToDate(dateFrom, dateTo);
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
                            const totalRes = await getPartyBookingTotalOfCityByDateAndLimitAsc(date, 5);
                            if (!totalRes) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Cann't find party booking total by date"
                                });
                            }
                            // L???y ????n ?????t ti???c cho t???ng Ng??y
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
                            // L???y ????n ?????t ti???c cho t???ng Ng??y
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
                            // L???y ????n ?????t ti???c cho t???ng Ng??y
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
                            // L???y ????n ?????t ti???c cho t???ng Ng??y
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
                            // L???y ????n ?????t ti???c cho t???ng Ng??y
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
                            // L???y ????n ?????t ti???c cho t???ng Ng??y
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

            // L???y data ????? hi???n bi???u ?????
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

    // Admin: Qu???n l?? ?????t Ti???c - Th???ng k?? doanh thu Theo th??nh ph???
    getStatisticPartyBookingTotalOfCityByQuarter: async (req, res) => {
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
        let partyBookingOrderDetailList = [];
        // N???u l?? qu?? 1
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
                        // L???y danh s??ch ????n ?????t ti???c chi ti???t cho t???ng city thu???c qu?? ????
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
                        // L???y danh s??ch ????n ?????t ti???c chi ti???t cho t???ng city thu???c qu?? ????
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
                        // L???y danh s??ch ????n ?????t ti???c chi ti???t cho t???ng city thu???c qu?? ????
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
                        // L???y danh s??ch ????n ?????t ti???c chi ti???t cho t???ng city thu???c qu?? ????
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
                        // L???y danh s??ch ????n ?????t ti???c chi ti???t cho t???ng city thu???c qu?? ????
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
                        // L???y danh s??ch ????n ?????t ti???c chi ti???t cho t???ng city thu???c qu?? ????
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
        // N???u l?? qu?? 2
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
                        // L???y danh s??ch ????n ?????t ti???c chi ti???t cho t???ng city thu???c qu?? ????
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
                        // L???y danh s??ch ????n ?????t ti???c chi ti???t cho t???ng city thu???c qu?? ????
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
                        // L???y danh s??ch ????n ?????t ti???c chi ti???t cho t???ng city thu???c qu?? ????
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
                        // L???y danh s??ch ????n ?????t ti???c chi ti???t cho t???ng city thu???c qu?? ????
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
                        // L???y danh s??ch ????n ?????t ti???c chi ti???t cho t???ng city thu???c qu?? ????
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
                        // L???y danh s??ch ????n ?????t ti???c chi ti???t cho t???ng city thu???c qu?? ????
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
        // N???u l?? qu?? 3
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
                        // L???y danh s??ch ????n ?????t ti???c chi ti???t cho t???ng city thu???c qu?? ????
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
                        // L???y danh s??ch ????n ?????t ti???c chi ti???t cho t???ng city thu???c qu?? ????
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
                        // L???y danh s??ch ????n ?????t ti???c chi ti???t cho t???ng city thu???c qu?? ????
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
                        // L???y danh s??ch ????n ?????t ti???c chi ti???t cho t???ng city thu???c qu?? ????
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
                        // L???y danh s??ch ????n ?????t ti???c chi ti???t cho t???ng city thu???c qu?? ????
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
                        // L???y danh s??ch ????n ?????t ti???c chi ti???t cho t???ng city thu???c qu?? ????
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
                        const partyBookingTotalQuarterRes = await getPartyBookingTotalOfCityByQuarterFourOrderByCaNamDescAndLimit(5);
                        if (!partyBookingTotalQuarterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find party booking by Quarter 3: -limit 5 - desc"
                            });
                        }
                        finalDataArray = partyBookingTotalQuarterRes;
                        // L???y danh s??ch ????n ?????t ti???c chi ti???t cho t???ng city thu???c qu?? ????
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
                        // L???y danh s??ch ????n ?????t ti???c chi ti???t cho t???ng city thu???c qu?? ????
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
                        // L???y danh s??ch ????n ?????t ti???c chi ti???t cho t???ng city thu???c qu?? ????
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
                        // L???y danh s??ch ????n ?????t ti???c chi ti???t cho t???ng city thu???c qu?? ????
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
                        // L???y danh s??ch ????n ?????t ti???c chi ti???t cho t???ng city thu???c qu?? ????
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
                        // L???y danh s??ch ????n ?????t ti???c chi ti???t cho t???ng city thu???c qu?? ????
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
            message: "Th???ng k?? doanh thu theo th??ng c???a Th??nh ph??? th??nh c??ng!",
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


    // -------------------------------------------- TH???NG K?? LO???I TI???C --------------------------------------------
    // Admin: Qu???n l?? ?????t ti???c - Th???ng k?? doanh thu Theo Lo???i
    getStatisticPartyBookingTotalOfTypeByQuarter: async (req, res) => {
        const quarter = req.body.quarter;
        const sortWay = req.body.sortWay;
        const partyTypeList = req.body.partyTypeList;
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
        if (!partyTypeList) {
            return res.status(400).json({
                status: "fail",
                message: "Lo???i ti???c kh??ng h???p l???!"
            });
        }
        let finalDataArray = [];
        // N???u l?? qu?? 1
        if (quarter === 1) {
            // Quarter 1:
            for (var k = 0; k < partyTypeList.length; k++) {
                const partyTypeName = partyTypeList[k];
                // L???y th???ng k?? doanh thu c???a Lo???i ti???c theo qu??
                try {
                    const partyBookingTotalQuarterRes = await getPartyBookingTotalOfTypeByQuarterOneOrderByCaNam(partyTypeName);
                    if (!partyBookingTotalQuarterRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't find party booking by Quarter 1"
                        });
                    }
                    // L???y danh s??ch ????n ?????t ti???c chi ti???t cho t???ng Lo???i ti???c thu???c qu?? ???? 
                    try {
                        const partyBookingOrderListRes = await getPartyBookingOrderByQuarterAndPartyBookingTypeName(quarter, partyTypeName);
                        if (!partyBookingOrderListRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find party booking order list by quarter and party type name"
                            });
                        }
                        finalDataArray.push({
                            partyTypeName: partyTypeName,
                            totalData: partyBookingTotalQuarterRes,
                            partyBookingOrderList: partyBookingOrderListRes
                        });
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getPartyBookingOrderByQuarterAndPartyBookingTypeName!",
                            error: err
                        });
                    }
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when getPartyBookingTotalOfTypeByQuarterOneOrderByCaNam!",
                        error: err
                    });
                }
            }
        }
        // N???u l?? qu?? 2
        if (quarter === 2) {
            // Quarter 2:
            for (var k = 0; k < partyTypeList.length; k++) {
                const partyTypeName = partyTypeList[k];
                // L???y th???ng k?? doanh thu c???a Lo???i ti???c theo qu??
                try {
                    const partyBookingTotalQuarterRes = await getPartyBookingTotalOfTypeByQuarterTwoOrderByCaNam(partyTypeName);
                    if (!partyBookingTotalQuarterRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't find party booking by Quarter 2"
                        });
                    }
                    // L???y danh s??ch ????n ?????t ti???c chi ti???t cho t???ng Lo???i ti???c thu???c qu?? ???? 
                    try {
                        const partyBookingOrderListRes = await getPartyBookingOrderByQuarterAndPartyBookingTypeName(quarter, partyTypeName);
                        if (!partyBookingOrderListRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find party booking order list by quarter and party type name"
                            });
                        }
                        finalDataArray.push({
                            partyTypeName: partyTypeName,
                            totalData: partyBookingTotalQuarterRes,
                            partyBookingOrderList: partyBookingOrderListRes
                        });
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getPartyBookingOrderByQuarterAndPartyBookingTypeName!",
                            error: err
                        });
                    }
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when getPartyBookingTotalOfTypeByQuarterTwoOrderByCaNam!",
                        error: err
                    });
                }
            }
        }
        // N???u l?? qu?? 3
        if (quarter === 3) {
            // Quarter 3:
            for (var k = 0; k < partyTypeList.length; k++) {
                const partyTypeName = partyTypeList[k];
                // L???y th???ng k?? doanh thu c???a Lo???i ti???c theo qu??
                try {
                    const partyBookingTotalQuarterRes = await getPartyBookingTotalOfTypeByQuarterThreeOrderByCaNam(partyTypeName);
                    if (!partyBookingTotalQuarterRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't find party booking by Quarter 3"
                        });
                    }
                    // L???y danh s??ch ????n ?????t ti???c chi ti???t cho t???ng Lo???i ti???c thu???c qu?? ???? 
                    try {
                        const partyBookingOrderListRes = await getPartyBookingOrderByQuarterAndPartyBookingTypeName(quarter, partyTypeName);
                        if (!partyBookingOrderListRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find party booking order list by quarter and party type name"
                            });
                        }
                        finalDataArray.push({
                            partyTypeName: partyTypeName,
                            totalData: partyBookingTotalQuarterRes,
                            partyBookingOrderList: partyBookingOrderListRes
                        });
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getPartyBookingOrderByQuarterAndPartyBookingTypeName!",
                            error: err
                        });
                    }
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when getPartyBookingTotalOfTypeByQuarterThreeOrderByCaNam!",
                        error: err
                    });
                }
            }
        }
        // N???u l?? qu?? 4
        if (quarter === 4) {
            // Quarter 4:
            for (var k = 0; k < partyTypeList.length; k++) {
                const partyTypeName = partyTypeList[k];
                // L???y th???ng k?? doanh thu c???a Lo???i ti???c theo qu??
                try {
                    const partyBookingTotalQuarterRes = await getPartyBookingTotalOfTypeByQuarterFourOrderByCaNam(partyTypeName);
                    if (!partyBookingTotalQuarterRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't find party booking by Quarter 1"
                        });
                    }
                    // L???y danh s??ch ????n ?????t ti???c chi ti???t cho t???ng Lo???i ti???c thu???c qu?? ???? 
                    try {
                        const partyBookingOrderListRes = await getPartyBookingOrderByQuarterAndPartyBookingTypeName(quarter, partyTypeName);
                        if (!partyBookingOrderListRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find party booking order list by quarter and party type name"
                            });
                        }
                        finalDataArray.push({
                            partyTypeName: partyTypeName,
                            totalData: partyBookingTotalQuarterRes,
                            partyBookingOrderList: partyBookingOrderListRes
                        });
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getPartyBookingOrderByQuarterAndPartyBookingTypeName!",
                            error: err
                        });
                    }
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when getPartyBookingTotalOfTypeByQuarterFourOrderByCaNam!",
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
            message: "Th???ng k?? doanh thu theo th??ng c???a Lo???i ti???c th??nh c??ng!",
            data: {
                statisticDate: statisticDate,
                quarter: quarter,
                sortWay: sortWay,
                data: finalDataArray,
                monthArray: monthInQuarterArray
            }
        });
    },
    // Admin: Qu???n l?? ?????t ti???c - Th???ng k?? doanh thu Theo Lo???i v?? Ng??y th???ng k??
    getStatisticPartyBookingTotalOfTypeByDate: async (req, res) => {
        const dateFrom = req.body.dateFrom;
        const dateTo = req.body.dateTo;
        const sortWay = req.body.sortWay;
        const partyTypeList = req.body.partyTypeList;
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
        if (!partyTypeList) {
            return res.status(400).json({
                status: "fail",
                message: "Lo???i ti???c kh??ng h???p l???!"
            });
        }

        // L???y ng??y trong party booking t??? dateFrom ?????n dateTo
        try {
            const fromDateToDateListRes = await getDistinctDateInPartyBookingOrderFromDateToDate(dateFrom, dateTo);
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
            let finalPartyBookingOrderList = [];
            for (var i = 0; i < fromDateToDateListRes.length; i++) {
                const date = fromDateToDateListRes[i].finishDate;
                var dataArray = [];
                for (var j = 0; j < partyTypeList.length; j++) {
                    const partyTypeName = partyTypeList[j];
                    try {
                        const totalRes = await getPartyBookingTotalOfTypeByDate(date, partyTypeName);
                        const totalCaNamRes = totalRes.canam;
                        if (!totalRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find party booking total type by date"
                            });
                        }
                        // L???y ????n ?????t ti???c cho t???ng Ng??y
                        try {
                            const partyBookingByDateRes = await getPartyBookingOrderByDateAndPartyBookingTypeName(date, partyTypeName);
                            if (!partyBookingByDateRes) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Cann't find party booking by date"
                                });
                            }
                            dataArray.push({
                                totalCaNam: totalCaNamRes,
                                totalData: totalRes,
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
                // Sort
                if (sortWay === "asc") {
                    dataArray = dataArray.sort((a, b) => a.totalCaNam - b.totalCaNam);
                } else {
                    dataArray = dataArray.sort((a, b) => b.totalCaNam - a.totalCaNam);
                }
                dataArray.map((data, key) => {
                    const partyBookingListRes = data.partyBookingOrderDetailList;
                    partyBookingListRes.map((partyBookingOrder) => {
                        finalPartyBookingOrderList.push(partyBookingOrder);
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
            for (var i = 0; i < partyTypeList.length; i++) {
                const partyTypeName = partyTypeList[i];
                try {
                    const partyBookingTotalOfCityByDateRes = await getPartyBookingTotalOfTypeByDateByListDate(fromDateToDateListRes, partyTypeName, sortWay);
                    if (!partyBookingTotalOfCityByDateRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't get test"
                        });
                    }
                    statisticArray.push(partyBookingTotalOfCityByDateRes);
                } catch (err) {
                    console.log("ERR: ", err);
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when getPartyBookingTotalOfTypeByDateByListDate!",
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
                    finalPartyBookingOrderList: finalPartyBookingOrderList
                }
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when find date!",
                error: err
            });
        }
    },

    // -------------------------------------------- TH???NG K?? KH??CH H??NG --------------------------------------------
    // Admin: Qu???n l?? ?????t ti???c - Th???ng k?? doanh thu Theo Kh??ch h??ng
    getStatisticPartyBookingTotalOfCustomerByQuarter: async (req, res) => {
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

            // Ki???m tra Kh??ch h??ng n??y c?? ?????t ti???c kh??ng
            try {
                const isCustomerBooking = await findCustomerInPartyBookingOrder(customerId);
                if (!isCustomerBooking) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Kh??ch h??ng ch??a c?? th??ng tin ?????t ti???c n??o!"
                    });
                }
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when findCustomerInPartyBookingOrder!",
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
                const partyBookingTotalQuarterRes = await getPartyBookingTotalOfCustomerByQuarterOneOrderByCaNam(customerId);
                if (!partyBookingTotalQuarterRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't find party booking by Quarter 1"
                    });
                }
                // L???y danh s??ch ????n ?????t ti???c chi ti???t cho t???ng Kh??ch h??ng thu???c qu?? ???? 
                try {
                    const partyBookingOrderListRes = await getPartyBookingOrderByQuarterAndCustomerId(quarter, customerId);
                    if (!partyBookingOrderListRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't find party booking order list by quarter and customer id"
                        });
                    }
                    var sortedListRes = partyBookingOrderListRes;
                    // Sort
                    if (sortWay === "asc") {
                        sortedListRes = sortedListRes.sort((a, b) => a.party_booking_order_total - b.party_booking_order_total);
                    } else {
                        sortedListRes = sortedListRes.sort((a, b) => b.party_booking_order_total - a.party_booking_order_total);
                    }

                    finalDataArray.push({
                        customerName: customerName,
                        totalData: partyBookingTotalQuarterRes,
                        partyBookingOrderList: sortedListRes
                    });
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when getPartyBookingOrderByQuarterAndCustomerId!",
                        error: err
                    });
                }
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when getPartyBookingTotalOfCustomerByQuarterOneOrderByCaNam!",
                    error: err
                });
            }
        }
        // N???u l?? qu?? 2
        if (quarter === 2) {
            // L???y th???ng k?? doanh thu c???a Kh??ch h??ng theo qu??
            try {
                const partyBookingTotalQuarterRes = await getPartyBookingTotalOfCustomerByQuarterTwoOrderByCaNam(customerId);
                if (!partyBookingTotalQuarterRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't find party booking by Quarter 2"
                    });
                }
                // L???y danh s??ch ????n ?????t ti???c chi ti???t cho t???ng Kh??ch h??ng thu???c qu?? ???? 
                try {
                    const partyBookingOrderListRes = await getPartyBookingOrderByQuarterAndCustomerId(quarter, customerId);
                    if (!partyBookingOrderListRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't find party booking order list by quarter and customer id"
                        });
                    }
                    var sortedListRes = partyBookingOrderListRes;
                    // Sort
                    if (sortWay === "asc") {
                        sortedListRes = sortedListRes.sort((a, b) => a.party_booking_order_total - b.party_booking_order_total);
                    } else {
                        sortedListRes = sortedListRes.sort((a, b) => b.party_booking_order_total - a.party_booking_order_total);
                    }

                    finalDataArray.push({
                        customerName: customerName,
                        totalData: partyBookingTotalQuarterRes,
                        partyBookingOrderList: sortedListRes
                    });
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when getPartyBookingOrderByQuarterAndCustomerId!",
                        error: err
                    });
                }
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when getPartyBookingTotalOfCustomerByQuarterTwoOrderByCaNam!",
                    error: err
                });
            }
        }
        // N???u l?? qu?? 3
        if (quarter === 3) {
            // L???y th???ng k?? doanh thu c???a Kh??ch h??ng theo qu??
            try {
                const partyBookingTotalQuarterRes = await getPartyBookingTotalOfCustomerByQuarterThreeOrderByCaNam(customerId);
                if (!partyBookingTotalQuarterRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't find party booking by Quarter 3"
                    });
                }
                // L???y danh s??ch ????n ?????t ti???c chi ti???t cho t???ng Kh??ch h??ng thu???c qu?? ???? 
                try {
                    const partyBookingOrderListRes = await getPartyBookingOrderByQuarterAndCustomerId(quarter, customerId);
                    if (!partyBookingOrderListRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't find party booking order list by quarter and customer id"
                        });
                    }
                    var sortedListRes = partyBookingOrderListRes;
                    // Sort
                    if (sortWay === "asc") {
                        sortedListRes = sortedListRes.sort((a, b) => a.party_booking_order_total - b.party_booking_order_total);
                    } else {
                        sortedListRes = sortedListRes.sort((a, b) => b.party_booking_order_total - a.party_booking_order_total);
                    }

                    finalDataArray.push({
                        customerName: customerName,
                        totalData: partyBookingTotalQuarterRes,
                        partyBookingOrderList: sortedListRes
                    });
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when getPartyBookingOrderByQuarterAndCustomerId!",
                        error: err
                    });
                }
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when getPartyBookingTotalOfCustomerByQuarterThreeOrderByCaNam!",
                    error: err
                });
            }
        }
        // N???u l?? qu?? 4
        if (quarter === 4) {
            // L???y th???ng k?? doanh thu c???a Kh??ch h??ng theo qu??
            try {
                const partyBookingTotalQuarterRes = await getPartyBookingTotalOfCustomerByQuarterFourOrderByCaNam(customerId);
                if (!partyBookingTotalQuarterRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't find party booking by Quarter 4"
                    });
                }
                // L???y danh s??ch ????n ?????t ti???c chi ti???t cho t???ng Kh??ch h??ng thu???c qu?? ???? 
                try {
                    const partyBookingOrderListRes = await getPartyBookingOrderByQuarterAndCustomerId(quarter, customerId);
                    if (!partyBookingOrderListRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't find party booking order list by quarter and customer id"
                        });
                    }
                    var sortedListRes = partyBookingOrderListRes;
                    // Sort
                    if (sortWay === "asc") {
                        sortedListRes = sortedListRes.sort((a, b) => a.party_booking_order_total - b.party_booking_order_total);
                    } else {
                        sortedListRes = sortedListRes.sort((a, b) => b.party_booking_order_total - a.party_booking_order_total);
                    }

                    finalDataArray.push({
                        customerName: customerName,
                        totalData: partyBookingTotalQuarterRes,
                        partyBookingOrderList: sortedListRes
                    });
                } catch (err) {
                    console.log(err);
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when getPartyBookingOrderByQuarterAndCustomerId!",
                        error: err
                    });
                }
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when getPartyBookingTotalOfCustomerByQuarterFourOrderByCaNam!",
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
    // Admin: Qu???n l?? ?????t ti???c - Th???ng k?? doanh thu Theo Kh??ch h??ng v?? Ng??y th???ng k??
    getStatisticPartyBookingTotalOfCustomerByDate: async (req, res) => {
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

            // Ki???m tra Kh??ch h??ng n??y c?? ?????t ti???c kh??ng
            try {
                const isCustomerBooking = await findCustomerInPartyBookingOrder(customerId);
                if (!isCustomerBooking) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Kh??ch h??ng ch??a c?? th??ng tin ?????t ti???c n??o!"
                    });
                }
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when findCustomerInPartyBookingOrder!",
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

        // L???y ng??y trong party booking t??? dateFrom ?????n dateTo
        try {
            const fromDateToDateListRes = await getDistinctDateInPartyBookingOrderFromDateToDate(dateFrom, dateTo);
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
            let finalPartyBookingOrderList = [];
            for (var i = 0; i < fromDateToDateListRes.length; i++) {
                const date = fromDateToDateListRes[i].finishDate;
                try {
                    const totalRes = await getPartyBookingTotalOfCustomerByDate(date, customerId);
                    const totalCaNamRes = totalRes.canam;
                    if (!totalRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't find party booking total type by date"
                        });
                    }
                    // L???y ????n ?????t ti???c cho t???ng Ng??y
                    try {
                        const partyBookingByDateRes = await getPartyBookingOrderByDateAndCustomerId(date, customerId);
                        if (!partyBookingByDateRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't find party booking by date"
                            });
                        }
                        // Sau khi l???p xong c??c room type trong 1 ng??y th?? cho v??o m???ng k???t qu???
                        finalArray.push({
                            date: date,
                            dataArray: {
                                totalCaNam: totalCaNamRes,
                                totalData: totalRes,
                                partyBookingOrderDetailList: partyBookingByDateRes
                            }
                        })
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when getPartyBookingOrderByDateAndCustomerId!",
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
                const partyBookingListRes = data.dataArray.partyBookingOrderDetailList;
                partyBookingListRes.map((partyBookingOrder) => {
                    finalPartyBookingOrderList.push(partyBookingOrder);
                })
            })

            // Sort
            if (sortWay === "asc") {
                finalPartyBookingOrderList = finalPartyBookingOrderList.sort((a, b) => a.party_booking_order_total - b.party_booking_order_total);
            } else {
                finalPartyBookingOrderList = finalPartyBookingOrderList.sort((a, b) => b.party_booking_order_total - a.party_booking_order_total);
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
                const partyBookingTotalOfCityByDateRes = await getPartyBookingTotalOfCustomerByDateByListDate(fromDateToDateListRes, customerId, sortWay);
                if (!partyBookingTotalOfCityByDateRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't get test"
                    });
                }
                statisticArray = partyBookingTotalOfCityByDateRes;
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when getPartyBookingTotalOfCustomerByDateByListDate!",
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
                    finalPartyBookingOrderList: finalPartyBookingOrderList
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