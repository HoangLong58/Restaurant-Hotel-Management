const { findAllPartyServiceDetailByPartyBookingOrderIdAndState0, findAllPartyServiceDetailByPartyBookingOrderIdAndState1, createPartyServiceDetail, findAllPartyServiceDetailByPartyBookingOrderIdAndPartyServiceIdAndState1NeedPayment, updatePartyServiceDetailQuantityAndPartyServiceDetailTotalById, findPartyServiceDetailById, deletePartyServiceDetailById } = require("../service/PartyServiceDetailService");
const { findPartyBookingById, updatePartyBookingOrderSurchargeAndPartyBookingOrderTotalByPartyBookingOrderId } = require("../service/PartyBookingOrderService");
const { findPartyServiceById } = require("../service/PartyServiceService");
const { createLogAdmin } = require("../utils/utils");

module.exports = {
    // ADMIN: Quản lý Đặt tiệc
    findAllPartyServiceDetailByPartyBookingOrderIdAndState0: async (req, res) => {
        const partyBookingOrderId = parseInt(req.params.partyBookingOrderId);
        if (!partyBookingOrderId || !Number.isInteger(partyBookingOrderId) || partyBookingOrderId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã đặt tiệc không hợp lệ!"
            });
        }
        // Kiểm tra tiệc tồn tại
        try {
            const partyBookingOrderRes = await findPartyBookingById(partyBookingOrderId);
            if (!partyBookingOrderRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find party booking order!"
                });
            }
            // Lấy Những food của party booking order
            try {
                const partyServiceDetailRes = await findAllPartyServiceDetailByPartyBookingOrderIdAndState0(partyBookingOrderId);
                if (!partyServiceDetailRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't find party service detail by party booking order id and state 0!"
                    });
                }

                // Success
                return res.status(200).json({
                    status: "success",
                    message: "Lấy những Dịch vụ Đã thanh toán của Tiệc thành công!",
                    data: partyServiceDetailRes
                });

            } catch (err) {
                console.log("#EE", err)
                return res.status(400).json({
                    status: "fail",
                    message: "Error find party service detail by party booking order id and state 0!",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error find party booking order!",
                error: err
            });
        }
    },
    findAllPartyServiceDetailByPartyBookingOrderIdAndState1: async (req, res) => {
        const partyBookingOrderId = parseInt(req.params.partyBookingOrderId);
        if (!partyBookingOrderId || !Number.isInteger(partyBookingOrderId) || partyBookingOrderId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã đặt tiệc không hợp lệ!"
            });
        }
        // Kiểm tra tiệc tồn tại
        try {
            const partyBookingOrderRes = await findPartyBookingById(partyBookingOrderId);
            if (!partyBookingOrderRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find party booking order!"
                });
            }
            // Lấy Những food của party booking order
            try {
                const partyServiceDetailRes = await findAllPartyServiceDetailByPartyBookingOrderIdAndState1(partyBookingOrderId);
                if (!partyServiceDetailRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't find party service detail by party booking order id and state 1!"
                    });
                }

                // Success
                return res.status(200).json({
                    status: "success",
                    message: "Lấy những Dịch vụ Chưa thanh toán của Tiệc thành công!",
                    data: partyServiceDetailRes
                });

            } catch (err) {
                console.log("#EE", err)
                return res.status(400).json({
                    status: "fail",
                    message: "Error find party service detail by party booking order id and state 1!",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error find party booking order!",
                error: err
            });
        }
    },
    // ADMIN: Quản lý đặt tiệc - Thêm dịch vụ
    createPartyServiceDetailByListPartyServiceDetailAndPartyBookingOrderId: async (req, res) => {
        const partyBookingOrderId = parseInt(req.body.partyBookingOrderId);
        const partyServiceList = req.body.partyServiceList;
        if (!partyBookingOrderId || !Number.isInteger(partyBookingOrderId) || partyBookingOrderId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã đặt tiệc không hợp lệ!"
            });
        }
        if (partyServiceList.length === 0) {
            return res.status(400).json({
                status: "fail",
                message: "Bạn chưa chọn Dịch vụ nào cho Tiệc này!"
            });
        }
        // Kiểm tra tiệc tồn tại
        try {
            const partyBookingOrderRes = await findPartyBookingById(partyBookingOrderId);
            if (!partyBookingOrderRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find party booking order!"
                });
            }
            // Kiểm tra Tiệc có hoàn thành chưa (State = 2)
            const partyBookingOrderStateRes = partyBookingOrderRes.party_booking_order_state;
            if (partyBookingOrderStateRes === 2) {
                return res.status(400).json({
                    status: "fail",
                    message: "Tiệc đã Hoàn thành, Không thể thêm Dịch vụ!"
                });
            }
            var partyServiceNameStringLog = "";
            for (var i = 0; i < partyServiceList.length; i++) {
                const partyService = partyServiceList[i];
                const partyServiceName = partyServiceList[i].party_service_name;
                const partyServiceQuantity = partyServiceList[i].serviceChooseQuantity;
                const partyServicePrice = partyServiceList[i].party_service_price;
                const partyServiceTotal = partyServiceList[i].party_service_price * partyServiceList[i].serviceChooseQuantity;
                const partyServiceId = partyServiceList[i].party_service_id;
                const partyServiceDetailState = 1;  // Dịch vụ tính phí
                // Kiểm tra tồn tại của party service
                try {
                    const partyServiceRes = await findPartyServiceById(partyServiceId);
                    if (!partyServiceRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't find party service!"
                        });
                    }
                    // Tìm xem đẵ có dịch vụ này trước đó được chọn chưa => Để cập nhật lại số lượng
                    try {
                        const partyServiceDetailRes = await findAllPartyServiceDetailByPartyBookingOrderIdAndPartyServiceIdAndState1NeedPayment(partyBookingOrderId, partyServiceId);
                        if (!partyServiceDetailRes) {
                            // Tạo party service detail
                            try {
                                const createPartyServiceDetailRes = await createPartyServiceDetail(partyServiceDetailState, partyServiceQuantity, partyServicePrice, partyServiceTotal, partyServiceId, partyBookingOrderId);
                                if (!createPartyServiceDetailRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't create party service detail!"
                                    });
                                }
                                partyServiceNameStringLog += partyServiceName + " x" + partyServiceQuantity + ", ";
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when create party service detail!",
                                    error: err
                                });
                            }
                        } else {
                            // Cập nhật party service trước đó
                            const partyServiceDetailId = partyServiceDetailRes.party_service_detail_id;
                            const partyServiceQuantityBefore = partyServiceDetailRes.party_service_detail_quantity;
                            const partyServiceQuantityAfter = partyServiceQuantityBefore + partyServiceQuantity;
                            const partyServiceTotalAfter = partyServiceQuantityAfter * partyServicePrice;
                            // Cập nhật party service detail
                            try {
                                const updatePartyServiceDetailRes = await updatePartyServiceDetailQuantityAndPartyServiceDetailTotalById(partyServiceQuantityAfter, partyServiceTotalAfter, partyServiceDetailId);
                                if (!updatePartyServiceDetailRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't update party service detail!"
                                    });
                                }
                                partyServiceNameStringLog += partyServiceName + " từ x" + partyServiceQuantityBefore + " thành x" + partyServiceQuantityAfter + ", ";
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when update party service detail!",
                                    error: err
                                });
                            }
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when All Party Service Detail By PartyBookingOrderId And PartyServiceId And State 1 Need Payment!",
                            error: err
                        });
                    }
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when find party service!",
                        error: err
                    });
                }
            }
            // --------------------- TÍNH LẠI TỔNG PHỤ PHÍ VÀ TỔNG CỘNG ĐỢN TIỆC và Cập nhật ---------------------
            // Sau khi Thêm chi tiết dịch vụ tiệc thì TÍNH LẠI TỔNG PHỤ PHÍ VÀ TỔNG CỘNG ĐỢN TIỆC và Cập nhật lại
            // - Lấy tất cả chi tiết dịch vụ của Tiệc - CHƯA THANH TOÁN
            try {
                const partyServiceDetailList = await findAllPartyServiceDetailByPartyBookingOrderIdAndState1(partyBookingOrderId);
                if (!partyServiceDetailList) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't get all party service detail of party booking order!"
                    });
                }
                // Cộng tất cả party_service_detail_total => Phụ phí
                var sumPartyServiceDetailTotal = 0;
                for (var j = 0; j < partyServiceDetailList.length; j++) {
                    sumPartyServiceDetailTotal += partyServiceDetailList[j].party_service_detail_total;
                }
                // Cập nhật lại party booking order surcharge và party booking order total
                try {
                    const updatePartyBookingOrdeSurchargeAndTotalRes = await updatePartyBookingOrderSurchargeAndPartyBookingOrderTotalByPartyBookingOrderId(sumPartyServiceDetailTotal, partyBookingOrderId);
                    if (!updatePartyBookingOrdeSurchargeAndTotalRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't update party booking order surcharge and party booking order total!"
                        });
                    }

                    createLogAdmin(req, res, " vừa Thêm Dịch vụ: " + partyServiceNameStringLog + " vào Tiệc có mã: " + partyBookingOrderId, "CREATE").then(() => {
                        // Success
                        return res.status(200).json({
                            status: "success",
                            message: "Thêm Dịch vụ cho Tiệc thành công!"
                        });
                    });

                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when update party booking order surcharge and party booking order total!",
                        error: err
                    });
                }
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when get all party service detail of party booking order!",
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
    // ADMIN: Quản lý đặt tiệc - Thêm dịch vụ
    updatePartyServiceDetailQuantityByPartyServiceDetailId: async (req, res) => {
        const partyServiceDetailQuantity = parseInt(req.body.partyServiceDetailQuantity);
        const partyServiceDetailId = parseInt(req.body.partyServiceDetailId);
        if (partyServiceDetailQuantity !== 1 && partyServiceDetailQuantity !== -1 && partyServiceDetailQuantity !== 0) {
            return res.status(400).json({
                status: "fail",
                message: "Số lượng Chi tiết Dịch vụ Tiệc không hợp lệ!"
            });
        }
        if (!partyServiceDetailId || !Number.isInteger(partyServiceDetailId) || partyServiceDetailId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã Chi tiết Dịch vụ Tiệc không hợp lệ!"
            });
        }
        // Kiểm tra tồn tại party service detail
        try {
            const partyServiceDetailRes = await findPartyServiceDetailById(partyServiceDetailId);
            if (!partyServiceDetailRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find party service detail!"
                });
            }
            const partyServiceDetailQuantityRes = partyServiceDetailRes.party_service_detail_quantity;
            const partyServiceDetailPriceRes = partyServiceDetailRes.party_service_detail_price;
            const partyServiceDetailTotalRes = partyServiceDetailRes.party_service_detail_total;
            const partyBookingOrderIdRes = partyServiceDetailRes.party_booking_order_id;
            const partyServiceIdRes = partyServiceDetailRes.party_service_id;

            var serviceName;
            // Lấy thông tin Dịch vụ để ghi log
            try {
                const partyServiceRes = await findPartyServiceById(partyServiceIdRes);
                if (!partyServiceRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't find party service!"
                    });
                }
                serviceName = partyServiceRes.party_service_name;
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when find party service!",
                    error: err
                });
            }

            if (partyServiceDetailQuantity === 1) {
                var partyServiceQuantityAfter = partyServiceDetailQuantityRes + 1;
                var partyServiceDetailTotalAfter = partyServiceQuantityAfter * partyServiceDetailPriceRes;
                // Cập nhật party service detail
                try {
                    const updatePartyServiceDetailRes = await updatePartyServiceDetailQuantityAndPartyServiceDetailTotalById(partyServiceQuantityAfter, partyServiceDetailTotalAfter, partyServiceDetailId);
                    if (!updatePartyServiceDetailRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't update party service detail!"
                        });
                    }
                    // - Lấy tất cả chi tiết dịch vụ của Tiệc - CHƯA THANH TOÁN
                    try {
                        const partyServiceDetailList = await findAllPartyServiceDetailByPartyBookingOrderIdAndState1(partyBookingOrderIdRes);
                        if (!partyServiceDetailList) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't get all party service detail of party booking order!"
                            });
                        }
                        // Cộng tất cả party_service_detail_total => Phụ phí
                        var sumPartyServiceDetailTotal = 0;
                        for (var j = 0; j < partyServiceDetailList.length; j++) {
                            sumPartyServiceDetailTotal += partyServiceDetailList[j].party_service_detail_total;
                        }
                        // Cập nhật lại party booking order surcharge và party booking order total
                        try {
                            const updatePartyBookingOrdeSurchargeAndTotalRes = await updatePartyBookingOrderSurchargeAndPartyBookingOrderTotalByPartyBookingOrderId(sumPartyServiceDetailTotal, partyBookingOrderIdRes);
                            if (!updatePartyBookingOrdeSurchargeAndTotalRes) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Cann't update party booking order surcharge and party booking order total!"
                                });
                            }

                            createLogAdmin(req, res, " vừa Thêm Dịch vụ: " + serviceName + " từ x" + partyServiceDetailQuantityRes + " thành x" + partyServiceQuantityAfter + " vào Tiệc có mã: " + partyBookingOrderIdRes, "UPDATE").then(() => {
                                // Success
                                return res.status(200).json({
                                    status: "success",
                                    message: "Thêm Dịch vụ cho Tiệc thành công!"
                                });
                            });

                        } catch (err) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Error when update party booking order surcharge and party booking order total!",
                                error: err
                            });
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when get all party service detail of party booking order!",
                            error: err
                        });
                    }
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when update party service detail!",
                        error: err
                    });
                }
            } else if (partyServiceDetailQuantity === -1) {
                // Khi số lượng chi tiết Dịch vụ lớn hơn 1
                if (partyServiceDetailQuantityRes > 1) {
                    var partyServiceQuantityAfter = partyServiceDetailQuantityRes - 1;
                    var partyServiceDetailTotalAfter = partyServiceQuantityAfter * partyServiceDetailPriceRes;
                    // Cập nhật party service detail
                    try {
                        const updatePartyServiceDetailRes = await updatePartyServiceDetailQuantityAndPartyServiceDetailTotalById(partyServiceQuantityAfter, partyServiceDetailTotalAfter, partyServiceDetailId);
                        if (!updatePartyServiceDetailRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't update party service detail!"
                            });
                        }
                        // - Lấy tất cả chi tiết dịch vụ của Tiệc - CHƯA THANH TOÁN
                        try {
                            const partyServiceDetailList = await findAllPartyServiceDetailByPartyBookingOrderIdAndState1(partyBookingOrderIdRes);
                            if (!partyServiceDetailList) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Cann't get all party service detail of party booking order!"
                                });
                            }
                            // Cộng tất cả party_service_detail_total => Phụ phí
                            var sumPartyServiceDetailTotal = 0;
                            for (var j = 0; j < partyServiceDetailList.length; j++) {
                                sumPartyServiceDetailTotal += partyServiceDetailList[j].party_service_detail_total;
                            }
                            // Cập nhật lại party booking order surcharge và party booking order total
                            try {
                                const updatePartyBookingOrdeSurchargeAndTotalRes = await updatePartyBookingOrderSurchargeAndPartyBookingOrderTotalByPartyBookingOrderId(sumPartyServiceDetailTotal, partyBookingOrderIdRes);
                                if (!updatePartyBookingOrdeSurchargeAndTotalRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't update party booking order surcharge and party booking order total!"
                                    });
                                }

                                createLogAdmin(req, res, " vừa Giảm số lượng Dịch vụ: " + serviceName + " từ x" + partyServiceDetailQuantityRes + " thành x" + partyServiceQuantityAfter + " vào Tiệc có mã: " + partyBookingOrderIdRes, "UPDATE").then(() => {
                                    // Success
                                    return res.status(200).json({
                                        status: "success",
                                        message: "Giảm số lượng Dịch vụ cho Tiệc thành công!"
                                    });
                                });

                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when update party booking order surcharge and party booking order total!",
                                    error: err
                                });
                            }
                        } catch (err) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Error when get all party service detail of party booking order!",
                                error: err
                            });
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when update party service detail!",
                            error: err
                        });
                    }
                } else {
                    // Khi số lượng chi tiết Dịch vụ bé hơn hoặc bằng 1
                    // Xóa party service detail
                    try {
                        const deletePartyServiceDetailRes = await deletePartyServiceDetailById(partyServiceDetailId);
                        if (!deletePartyServiceDetailRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't delete party service detail!"
                            });
                        }
                        // - Lấy tất cả chi tiết dịch vụ của Tiệc - CHƯA THANH TOÁN
                        try {
                            const partyServiceDetailList = await findAllPartyServiceDetailByPartyBookingOrderIdAndState1(partyBookingOrderIdRes);
                            if (!partyServiceDetailList) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Cann't get all party service detail of party booking order!"
                                });
                            }
                            // Cộng tất cả party_service_detail_total => Phụ phí
                            var sumPartyServiceDetailTotal = 0;
                            for (var j = 0; j < partyServiceDetailList.length; j++) {
                                sumPartyServiceDetailTotal += partyServiceDetailList[j].party_service_detail_total;
                            }
                            // Cập nhật lại party booking order surcharge và party booking order total
                            try {
                                const updatePartyBookingOrdeSurchargeAndTotalRes = await updatePartyBookingOrderSurchargeAndPartyBookingOrderTotalByPartyBookingOrderId(sumPartyServiceDetailTotal, partyBookingOrderIdRes);
                                if (!updatePartyBookingOrdeSurchargeAndTotalRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Cann't update party booking order surcharge and party booking order total!"
                                    });
                                }

                                createLogAdmin(req, res, " vừa Giảm số lượng Dịch vụ: " + serviceName + " từ x" + partyServiceDetailQuantityRes + " thành x0 vào Tiệc có mã: " + partyBookingOrderIdRes, "UPDATE").then(() => {
                                    // Success
                                    return res.status(200).json({
                                        status: "success",
                                        message: "Giảm số lượng Dịch vụ cho Tiệc thành công!"
                                    });
                                });

                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Error when update party booking order surcharge and party booking order total!",
                                    error: err
                                });
                            }
                        } catch (err) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Error when get all party service detail of party booking order!",
                                error: err
                            });
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when update party service detail!",
                            error: err
                        });
                    }
                }
            } else {
                // partyServiceDetailQuantity === 0
                // Xóa party service detail
                try {
                    const deletePartyServiceDetailRes = await deletePartyServiceDetailById(partyServiceDetailId);
                    if (!deletePartyServiceDetailRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't delete party service detail!"
                        });
                    }
                    // - Lấy tất cả chi tiết dịch vụ của Tiệc - CHƯA THANH TOÁN
                    try {
                        const partyServiceDetailList = await findAllPartyServiceDetailByPartyBookingOrderIdAndState1(partyBookingOrderIdRes);
                        if (!partyServiceDetailList) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't get all party service detail of party booking order!"
                            });
                        }
                        // Cộng tất cả party_service_detail_total => Phụ phí
                        var sumPartyServiceDetailTotal = 0;
                        for (var j = 0; j < partyServiceDetailList.length; j++) {
                            sumPartyServiceDetailTotal += partyServiceDetailList[j].party_service_detail_total;
                        }
                        // Cập nhật lại party booking order surcharge và party booking order total
                        try {
                            const updatePartyBookingOrdeSurchargeAndTotalRes = await updatePartyBookingOrderSurchargeAndPartyBookingOrderTotalByPartyBookingOrderId(sumPartyServiceDetailTotal, partyBookingOrderIdRes);
                            if (!updatePartyBookingOrdeSurchargeAndTotalRes) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Cann't update party booking order surcharge and party booking order total!"
                                });
                            }

                            createLogAdmin(req, res, " vừa Giảm số lượng Dịch vụ: " + serviceName + " từ x" + partyServiceDetailQuantityRes + " thành x0 vào Tiệc có mã: " + partyBookingOrderIdRes, "UPDATE").then(() => {
                                // Success
                                return res.status(200).json({
                                    status: "success",
                                    message: "Giảm số lượng Dịch vụ cho Tiệc thành công!"
                                });
                            });

                        } catch (err) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Error when update party booking order surcharge and party booking order total!",
                                error: err
                            });
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when get all party service detail of party booking order!",
                            error: err
                        });
                    }
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when update party service detail!",
                        error: err
                    });
                }
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when find party service detail!",
                error: err
            });
        }
    }
}