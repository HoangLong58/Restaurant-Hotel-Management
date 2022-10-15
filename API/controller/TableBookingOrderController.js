const { getTableBookingOrders, createTableBookingOrder, findTableBookingOrder } = require("../service/TableBookingOrderService");

// NODE Mailer
var nodemailer = require('nodemailer');
const { findRoomBookingOrder } = require("../service/RoomBookingOrderService");
const { getCustomerByCustomerId } = require("../service/CustomerService");
const { getTableBookingWithTypeAndFloorByTableBookingId } = require("../service/TableBookingService");
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'truonghoanglong588@gmail.com',
        pass: 'grkaaxhoeradbtop'
    }
});

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
            const createTableBookingOrderRes = await createTableBookingOrder(
                tableBookingOrderBookDate,
                tableBookingOrderQuantity,
                0,
                tableBookingOrderNote,
                tableBookingOrderCheckInDate,
                customerId,
                tableBookingId
            );
            if (!createTableBookingOrderRes) {
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
                    message: "Create room booking order successfully!",
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
    }
}