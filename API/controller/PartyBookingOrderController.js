const { createPartyBookingOrder, findPartyBookingOrder } = require("../service/PartyBookingOrderService");
const { createPartyHallDetail } = require("../service/PartyHallDetailService");
const { getPartyHallWithTypeFloorByPartyHallId } = require("../service/PartyHallService");
const { getSetMenuBySetMenuId } = require("../service/SetMenuService");
const { format_money } = require("../utils/utils");

// NODE Mailer
var nodemailer = require('nodemailer');
const { getPartyBookingTypeByPartyBookingTypeId } = require("../service/PartyBookingTypeService");
const { getPartyHallTimeByPartyHallTimeId } = require("../service/PartyHallTimeService");
const { updateDiscountState } = require("../service/DiscountService");
const { getCustomerByCustomerId } = require("../service/CustomerService");
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
        try {
            const createPartyBookingRes = await createPartyBookingOrder(
                partyBookingOrderBookDate,
                partyBookingOrderPrice,
                partyBookingOrderSurcharge,
                partyBookingOrderTotal,
                partyBookingOrderNote,
                discountId,
                customerId,
                setMenuId,
                partyBookingTypeId
            );
            if (createPartyBookingRes) {
                try {
                    const partyBookingOrderRes = await findPartyBookingOrder(
                        partyBookingOrderBookDate,
                        partyBookingOrderPrice,
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
                        try {
                            const createPartyHallDetailRes = await createPartyHallDetail(
                                partyHallDetailName,
                                partyHallDetailDate,
                                partyHallId,
                                partyHallTimeId,
                                partyBookingOrderId
                            );
                            if (createPartyHallDetailRes) {
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

                                            var partyPriceTotalNoDiscount = partyHallPrice + servicePrice + setMenuPrice*tableQuantity;

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
                                            noidung += ' <table border="1px" cellpadding="10px" cellspacing="1px"width="100%"><tr><td align="center" bgcolor="#41f1b6" colspan="2"><fontcolor="white"><b>MENU TIỆC - '+ setMenuName +'</b></fontcolor=></td></tr><tr id="invoice-bar"><td width="50%"><b>Loại món ăn</b></td><td width="50%"><b>Tên món ăn</b></td></tr>';
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
                        return res.status(200).json({
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

    }
};