const { findAllFoodById } = require("../service/FoodService");
const { findTableBookingById, updateTableBookingOrderTotalByTableBookingOrderId } = require("../service/TableBookingOrderService");
const { findAllTableDetailByTableBookingOrderId, findAllTableDetailByTableBookingOrderIdAndFoodId, createTableDetail, updateTableDetailQuantityAndTableDetailTotalById, findTableDetailById, deleteTableDetailById } = require("../service/TableDetailService");
const { createLogAdmin } = require("../utils/utils");

module.exports = {
    // ADMIN: Quản lý Đặt Bàn
    findAllTableDetailByTableBookingOrderId: async (req, res) => {
        const tableBookingOrderId = parseInt(req.params.tableBookingOrderId);
        if (!tableBookingOrderId || !Number.isInteger(tableBookingOrderId) || tableBookingOrderId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã đặt bàn không hợp lệ!"
            });
        }
        // Kiểm tra Đặt bàn tồn tại
        try {
            const tableBookingOrderRes = await findTableBookingById(tableBookingOrderId);
            if (!tableBookingOrderRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find table booking order!"
                });
            }
            // Lấy Những food của table booking order
            try {
                const tableDetailFoodRes = await findAllTableDetailByTableBookingOrderId(tableBookingOrderId);
                if (!tableDetailFoodRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't find table detail food by table booking order id!"
                    });
                }

                // Success
                return res.status(200).json({
                    status: "success",
                    message: "Lấy những Món ăn của Bàn ăn thành công!",
                    data: tableDetailFoodRes
                });

            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error find table detail food by table booking order id!",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error find table booking order!",
                error: err
            });
        }
    },
    // ADMIN: Quản lý đặt bàn - Thêm món ăn
    createTableDetailByFoodListAndTableBookingOrderId: async (req, res) => {
        const tableBookingOrderId = parseInt(req.body.tableBookingOrderId);
        const foodList = req.body.foodList;
        if (!tableBookingOrderId || !Number.isInteger(tableBookingOrderId) || tableBookingOrderId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã đặt bàn không hợp lệ!"
            });
        }
        if (foodList.length === 0) {
            return res.status(400).json({
                status: "fail",
                message: "Bạn chưa chọn Món ăn nào cho Đặt bàn này!"
            });
        }
        // Kiểm tra Đặt bàn tồn tại
        try {
            const tableBookingOrderRes = await findTableBookingById(tableBookingOrderId);
            if (!tableBookingOrderRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find table booking order!"
                });
            }
            // Kiểm tra Đặt bàn có hoàn thành chưa (State = 2)
            const tableBookingOrderStateRes = tableBookingOrderRes.table_booking_order_state;
            if (tableBookingOrderStateRes === 2) {
                return res.status(400).json({
                    status: "fail",
                    message: "Đặt bàn đã Hoàn thành, Không thể thêm Món ăn!"
                });
            }
            var foodNameStringLog = "";
            for (var i = 0; i < foodList.length; i++) {
                const food = foodList[i];
                const foodName = foodList[i].food_name;
                const foodQuantity = foodList[i].foodChooseQuantity;
                const foodPrice = foodList[i].food_price;
                const foodTotal = foodList[i].food_price * foodList[i].foodChooseQuantity;
                const foodId = foodList[i].food_id;
                // Kiểm tra tồn tại của food
                try {
                    const foodRes = await findAllFoodById(foodId);
                    if (!foodRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't find food!"
                        });
                    }
                    // Tìm xem đẵ có Món ăn này trước đó được chọn chưa => Để cập nhật lại số lượng
                    try {
                        const tableDetailRes = await findAllTableDetailByTableBookingOrderIdAndFoodId(tableBookingOrderId, foodId);
                        if (!tableDetailRes) {
                            // Tạo table detail
                            try {
                                const createTableDetailRes = await createTableDetail(foodQuantity, foodPrice, foodTotal, foodId, tableBookingOrderId);
                                if (!createTableDetailRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't create table detail!"
                                    });
                                }
                                foodNameStringLog += foodName + " x" + foodQuantity + ", ";
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when create table detail!",
                                    error: err
                                });
                            }
                        } else {
                            // Cập nhật food trước đó
                            const tableDetailId = tableDetailRes.table_detail_id;
                            const foodQuantityBefore = tableDetailRes.table_detail_quantity;
                            const foodQuantityAfter = foodQuantityBefore + foodQuantity;
                            const foodTotalAfter = foodQuantityAfter * foodPrice;
                            // Cập nhật table detail
                            try {
                                const updateTableDetailRes = await updateTableDetailQuantityAndTableDetailTotalById(foodQuantityAfter, foodTotalAfter, tableDetailId);
                                if (!updateTableDetailRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't update table detail!"
                                    });
                                }
                                foodNameStringLog += foodName + " từ x" + foodQuantityBefore + " thành x" + foodQuantityAfter + ", ";
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when update table detail!",
                                    error: err
                                });
                            }
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when find all table detail by tableBookingOrderId and foodId!",
                            error: err
                        });
                    }
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when find food!",
                        error: err
                    });
                }
            }
            // --------------------- TÍNH LẠI TỔNG CỘNG ĐƠN ĐẶT BÀN và Cập nhật ---------------------
            // Sau khi Thêm chi tiết đặt bàn thì TÍNH LẠI TỔNG TIỀN ĐƠN ĐẶT BÀN và Cập nhật lại
            // - Lấy tất cả chi tiết đặt bàn của ĐƠN ĐẶT BÀN
            try {
                const tableDetailList = await findAllTableDetailByTableBookingOrderId(tableBookingOrderId);
                if (!tableDetailList) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't get all table detail of table booking order!"
                    });
                }
                // Cộng tất cả table_detail_total => Tổng phí
                var sumTableDetailTotal = 0;
                for (var j = 0; j < tableDetailList.length; j++) {
                    sumTableDetailTotal += tableDetailList[j].table_detail_total;
                }
                // Cập nhật lại table booking order total
                try {
                    const updateTableBookingOrderTotalRes = await updateTableBookingOrderTotalByTableBookingOrderId(sumTableDetailTotal, tableBookingOrderId);
                    if (!updateTableBookingOrderTotalRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't update table booking order total!"
                        });
                    }

                    createLogAdmin(req, res, " vừa Thêm Món ăn: " + foodNameStringLog + " vào Đặt bàn có mã: " + tableBookingOrderId, "CREATE").then(() => {
                        // Success
                        return res.status(200).json({
                            status: "success",
                            message: "Thêm Món ăn cho Đặt bàn thành công!"
                        });
                    });

                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when update table booking order total!",
                        error: err
                    });
                }
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when get all table detail of table booking order!",
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
    // ADMIN: Quản lý đặt bàn - Chỉnh sửa số lượng Món ăn: Tăng - Giảm - Xóa
    updateTableDetailQuantityByTableDetailId: async (req, res) => {
        const tableDetailQuantity = parseInt(req.body.tableDetailQuantity);
        const tableDetailId = parseInt(req.body.tableDetailId);
        if (tableDetailQuantity !== 1 && tableDetailQuantity !== -1 && tableDetailQuantity !== 0) {
            return res.status(400).json({
                status: "fail",
                message: "Số lượng Chi tiết Món ăn Đặt bàn không hợp lệ!"
            });
        }
        if (!tableDetailId || !Number.isInteger(tableDetailId) || tableDetailId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã Chi tiết Món ăn Đặt bàn không hợp lệ!"
            });
        }
        // Kiểm tra tồn tại table detail
        try {
            const tableDetailRes = await findTableDetailById(tableDetailId);
            if (!tableDetailRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find table detail!"
                });
            }
            const tableDetailQuantityRes = tableDetailRes.table_detail_quantity;
            const tableDetailPriceRes = tableDetailRes.table_detail_price;
            const tableDetailTotalRes = tableDetailRes.table_detail_total;
            const tableBookingOrderIdRes = tableDetailRes.table_booking_order_id;
            const foodIdRes = tableDetailRes.food_id;

            var foodName;
            // Lấy thông tin Món ăn để ghi log
            try {
                const foodRes = await findAllFoodById(foodIdRes);
                if (!foodRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't find food!"
                    });
                }
                foodName = foodRes.food_name;
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when find food!",
                    error: err
                });
            }

            if (tableDetailQuantity === 1) {
                var tableDetailQuantityAfter = tableDetailQuantityRes + 1;
                var tableDetailTotalAfter = tableDetailQuantityAfter * tableDetailPriceRes;
                // Cập nhật table detail
                try {
                    const updateTableDetailRes = await updateTableDetailQuantityAndTableDetailTotalById(tableDetailQuantityAfter, tableDetailTotalAfter, tableDetailId);
                    if (!updateTableDetailRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't update table detail!"
                        });
                    }
                    // - Lấy tất cả Chi tiết Món ăn Đặt bàn
                    try {
                        const tableDetailList = await findAllTableDetailByTableBookingOrderId(tableBookingOrderIdRes);
                        if (!tableDetailList) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't get all table detail of table booking order!"
                            });
                        }
                        // Cộng tất cả table_detail_total => Tổng phí
                        var sumTableDetailTotal = 0;
                        for (var j = 0; j < tableDetailList.length; j++) {
                            sumTableDetailTotal += tableDetailList[j].table_detail_total;
                        }
                        // Cập nhật lại table booking order total
                        try {
                            const updateTableBookingOrderTotalRes = await updateTableBookingOrderTotalByTableBookingOrderId(sumTableDetailTotal, tableBookingOrderIdRes);
                            if (!updateTableBookingOrderTotalRes) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Cann't update table booking order total!"
                                });
                            }

                            createLogAdmin(req, res, " vừa Thêm Món ăn: " + foodName + " từ x" + tableDetailQuantityRes + " thành x" + tableDetailQuantityAfter + " vào Đặt bàn có mã: " + tableBookingOrderIdRes, "UPDATE").then(() => {
                                // Success
                                return res.status(200).json({
                                    status: "success",
                                    message: "Thêm Chi tiết Món ăn cho Đặt bàn thành công!"
                                });
                            });

                        } catch (err) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Error when update table booking order total!",
                                error: err
                            });
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when get all table detail of table booking order!",
                            error: err
                        });
                    }
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when update table detail!",
                        error: err
                    });
                }
            } else if (tableDetailQuantity === -1) {
                // Khi số lượng Chi tiết Món ăn Đặt bàn lớn hơn 1
                if (tableDetailQuantityRes > 1) {
                    var tableDetailQuantityAfter = tableDetailQuantityRes - 1;
                    var tableDetailTotalAfter = tableDetailQuantityAfter * tableDetailPriceRes;
                    // Cập nhật table detail
                    try {
                        const updateTableDetailRes = await updateTableDetailQuantityAndTableDetailTotalById(tableDetailQuantityAfter, tableDetailTotalAfter, tableDetailId);
                        if (!updateTableDetailRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't update table detail!"
                            });
                        }
                        // - Lấy tất cả Chi tiết Món ăn Đặt bàn
                        try {
                            const tableDetailList = await findAllTableDetailByTableBookingOrderId(tableBookingOrderIdRes);
                            if (!tableDetailList) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Cann't get all table detail of table booking order!"
                                });
                            }
                            // Cộng tất cả table_detail_total => Tổng phí
                            var sumTableDetailTotal = 0;
                            for (var j = 0; j < tableDetailList.length; j++) {
                                sumTableDetailTotal += tableDetailList[j].table_detail_total;
                            }
                            // Cập nhật lại table booking order total
                            try {
                                const updateTableBookingOrderTotalRes = await updateTableBookingOrderTotalByTableBookingOrderId(sumTableDetailTotal, tableBookingOrderIdRes);
                                if (!updateTableBookingOrderTotalRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't update table booking order total!"
                                    });
                                }

                                createLogAdmin(req, res, " vừa Giảm số lượng Món ăn: " + foodName + " từ x" + tableDetailQuantityRes + " thành x" + tableDetailQuantityAfter + " vào Đặt bàn có mã: " + tableBookingOrderIdRes, "UPDATE").then(() => {
                                    // Success
                                    return res.status(200).json({
                                        status: "success",
                                        message: "Giảm số lượng Chi tiết Món ăn Đặt bàn thành công!"
                                    });
                                });

                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when update table booking order total!",
                                    error: err
                                });
                            }
                        } catch (err) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Error when get all table detail of table booking order!",
                                error: err
                            });
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when update table detail!",
                            error: err
                        });
                    }
                } else {
                    // Khi số lượng Chi tiết Món ăn Đặt bàn bé hơn hoặc bằng 1
                    // Xóa table detail
                    try {
                        const deleteTableDetailRes = await deleteTableDetailById(tableDetailId);
                        if (!deleteTableDetailRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't delete table detail!"
                            });
                        }
                        // - Lấy tất cả Chi tiết Món ăn Đặt bàn
                        try {
                            const tableDetailList = await findAllTableDetailByTableBookingOrderId(tableBookingOrderIdRes);
                            if (!tableDetailList) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Cann't get all table detail of table booking order!"
                                });
                            }
                            // Cộng tất cả table_detail_total => Tổng phí
                            var sumTableDetailTotal = 0;
                            for (var j = 0; j < tableDetailList.length; j++) {
                                sumTableDetailTotal += tableDetailList[j].table_detail_total;
                            }
                            // Cập nhật lại table booking order total
                            try {
                                const updateTableBookingOrderTotalRes = await updateTableBookingOrderTotalByTableBookingOrderId(sumTableDetailTotal, tableBookingOrderIdRes);
                                if (!updateTableBookingOrderTotalRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't update table booking order total!"
                                    });
                                }

                                createLogAdmin(req, res, " vừa Giảm số lượng Chi tiết Món ăn Đặt bàn: " + foodName + " từ x" + tableDetailQuantityRes + " thành x0 vào Đặt bàn có mã: " + tableBookingOrderIdRes, "UPDATE").then(() => {
                                    // Success
                                    return res.status(200).json({
                                        status: "success",
                                        message: "Giảm số lượng Chi tiết Món ăn Đặt bàn thành công!"
                                    });
                                });

                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when update table booking order total!",
                                    error: err
                                });
                            }
                        } catch (err) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Error when get all table detail of table booking order!",
                                error: err
                            });
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when update table detail!",
                            error: err
                        });
                    }
                }
            } else {
                // tableDetailQuantity === 0
                // Xóa table detail
                try {
                    const deleteTableDetailRes = await deleteTableDetailById(tableDetailId);
                    if (!deleteTableDetailRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't delete table detail!"
                        });
                    }
                    // - Lấy tất cả Chi tiết Món ăn Đặt bàn
                    try {
                        const tableDetailList = await findAllTableDetailByTableBookingOrderId(tableBookingOrderIdRes);
                        if (!tableDetailList) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't get all table detail of table booking order!"
                            });
                        }
                        // Cộng tất cả table_detail_total => Tổng phí
                        var sumTableDetailTotal = 0;
                        for (var j = 0; j < tableDetailList.length; j++) {
                            sumTableDetailTotal += tableDetailList[j].table_detail_total;
                        }
                        // Cập nhật lại table booking order total
                        try {
                            const updateTableBookingOrderTotalRes = await updateTableBookingOrderTotalByTableBookingOrderId(sumTableDetailTotal, tableBookingOrderIdRes);
                            if (!updateTableBookingOrderTotalRes) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Cann't update table booking order total!"
                                });
                            }

                            createLogAdmin(req, res, " vừa Giảm số lượng Chi tiết Món ăn Đặt bàn: " + foodName + " từ x" + tableDetailQuantityRes + " thành x0 vào Đặt bàn có mã: " + tableBookingOrderIdRes, "UPDATE").then(() => {
                                // Success
                                return res.status(200).json({
                                    status: "success",
                                    message: "Giảm số lượng Chi tiết Món ăn Đặt bàn thành công!"
                                });
                            });

                        } catch (err) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Error when update table booking order surcharge and table booking order total!",
                                error: err
                            });
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when get all table detail of table booking order!",
                            error: err
                        });
                    }
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when update table detail!",
                        error: err
                    });
                }
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when find table detail!",
                error: err
            });
        }
    }
}