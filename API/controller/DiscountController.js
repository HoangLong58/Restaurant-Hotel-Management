const { getDiscounts, getDiscountByDiscountCode, getDiscountById, updateDiscountState } = require("../service/DiscountService");

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
            if(result) {
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
}