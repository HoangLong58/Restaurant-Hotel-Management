const { getDiscounts, getDiscountByDiscountCode, getDiscountById, updateDiscountState, getAllDiscounts, getQuantityDiscounts, findAllDiscountByIdOrName, findAllDiscountById, createDiscount, getAllDiscountByDiscountCode, updateDiscountById, deleteDiscount } = require("../service/DiscountService");
const { randomIntFromInterval } = require("../utils/utils");

module.exports = {
    getDiscounts: (req, res) => {
        getDiscounts((err, result) => {
            if (err) {
                console.log("Lỗi getDiscounts: ", err);
                return;
            }
            return res.json({
                status: "success",
                data: result
            });
        });
    },
    getDiscountByDiscountCode: async (req, res) => {
        const discountCode = req.body.discountCode;
        try {
            const result = await getDiscountByDiscountCode(discountCode);
            if (!result) {
                return res.status(200).json({
                    status: "success",
                    message: "Mã giảm giá không tồn tại!",
                    data: null
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Áp dụng mã giảm giá thành công",
                data: result
            });
        } catch (err) {
            console.log("Lỗi getDiscountByDiscountCode: ", err);
            return res.status(400).json({
                status: "fail",
                message: "Mã khuyến mãi không hợp lệ",
                error: err
            });
        }
    },
    getDiscountById: async (req, res) => {
        const discountId = req.params.discountId;
        try {
            const result = await getDiscountById(discountId);
            if (!result) {
                return res.status(200).json({
                    status: "success",
                    message: "Mã giảm giá không tồn tại!",
                    data: result
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Áp dụng mã giảm giá thành công",
                data: result
            });
        } catch (err) {
            console.log("Lỗi getDiscountById: ", err);
            return res.status(400).json({
                status: "fail",
                message: "Mã khuyến mãi không hợp lệ",
                error: err
            });
        }
    },
    updateDiscountState: async (req, res) => {
        const discountId = req.body.discountId;
        const discountState = req.body.discountState;
        try {
            const result = await updateDiscountState(discountId, discountState);
            if (result) {
                return res.status(200).json({
                    status: "success",
                    message: "Update discount state successfully!",
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
    },

    // ADMIN: Quản lý Mã giảm giá
    getAllDiscounts: async (req, res) => {
        try {
            const result = await getAllDiscounts();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Lấy Mã giảm giá thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getAllDiscounts",
                error: err
            });
        }
    },
    getQuantityDiscount: async (req, res) => {
        try {
            const result = await getQuantityDiscounts();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Lấy quantity discounts thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getQuantityDiscounts",
                error: err
            });
        }
    },
    findDiscountByIdOrName: async (req, res) => {
        const search = req.params.search;
        try {
            const result = await findAllDiscountByIdOrName(search);
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Tìm Mã giảm giá thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findAllDiscountByIdOrName",
                error: err
            });
        }
    },
    findDiscountById: async (req, res) => {
        const discountId = req.body.discountId;
        try {
            const result = await findAllDiscountById(discountId);
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Tìm Mã giảm giá thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findAllDiscountById",
                error: err
            });
        }
    },
    createDiscount: async (req, res) => {
        const discountPercent = req.body.discountPercent;
        const discountName = req.body.discountName;
        const discountQuantity = req.body.discountQuantity;
        const discountState = 0;
        if (!discountPercent || !Number.isInteger(discountPercent) || discountPercent < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Tỉ lệ giảm giá không hợp lệ!"
            });
        }
        if (!discountName) {
            return res.status(400).json({
                status: "fail",
                message: "Tên giảm giá không hợp lệ!"
            });
        }
        if (!discountQuantity || !Number.isInteger(discountQuantity) || discountQuantity < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Số lượng Mã giảm giá không hợp lệ!"
            });
        }
        // Tạo số lượng Mã giảm giá với mỗi mã sẽ có mã khác nhau!
        // Mã được lấy từ: Tên + Giảm % + mili giây hiện tại + random từ 1000 - 9999
        for (var i = 0; i < discountQuantity; i++) {
            let now = new Date();
            let random = randomIntFromInterval(1000, 9999);
            let discountCode = discountName + discountPercent + now.getMilliseconds() + random;
            try {
                const createDiscountRes = await createDiscount(discountPercent, discountCode, discountState);
                if (!createDiscountRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't create discount!"
                    });
                }
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when create discount!",
                    error: err
                });
            }
        }
        // Success
        return res.status(200).json({
            status: "success",
            message: "Thêm Mã giảm giá mới thành công!"
        });
    },
    updateDiscountById: async (req, res) => {
        const discountCode = req.body.discountCode;
        const discountPercent = req.body.discountPercent;
        const discountId = req.body.discountId;
        if (!discountCode) {
            return res.status(400).json({
                status: "fail",
                message: "Mã giảm giá không hợp lệ!"
            });
        }
        if (!discountPercent || !Number.isInteger(discountPercent) || discountPercent < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Tỉ lệ giảm giá không hợp lệ!"
            });
        }
        if (!discountId || !Number.isInteger(discountId) || discountId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã số Mã giảm giá không hợp lệ!"
            });
        }
        try {
            const discountRes = await getAllDiscountByDiscountCode(discountCode);
            if (discountRes && discountRes.discount_id !== discountId) {
                return res.status(400).json({
                    status: "fail",
                    message: "Mã giảm giá đã tồn tại!"
                });
            }
            try {
                const updateDiscountRes = await updateDiscountById(discountPercent, discountCode, discountId);
                if (!updateDiscountRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't update discount!"
                    });
                }
                // Success
                return res.status(200).json({
                    status: "success",
                    message: "Cập nhật Mã giảm giá thành công!"
                });
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when update discount!",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when find discount code!",
                error: err
            });
        }
    },
    deleteDiscount: async (req, res) => {
        const discountId = parseInt(req.params.discountId);
        if (!discountId || !Number.isInteger(discountId) || discountId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã số Mã giảm giá không hợp lệ!"
            });
        }
        try {
            const discountRes = await findAllDiscountById(discountId);
            if (!discountRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find discount!"
                });
            }
            try {
                const deleteDiscountRes = await deleteDiscount(discountId);
                if (!deleteDiscountRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't delete discount!"
                    });
                }
                // Success
                return res.status(200).json({
                    status: "success",
                    message: "Xóa Mã giảm giá thành công!"
                });
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when delete discount!",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when find discount!",
                error: err
            });
        }
    }
}