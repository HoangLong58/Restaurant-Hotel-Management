const { getCustomerByCustomerId } = require("../service/CustomerService");
const { getFoodByFoodId, updateFoodVoteByFoodId } = require("../service/FoodService");
const { createFoodVote, getFoodVoteByFoodId, getFoodVoteQuantityForEachStarByFoodId, getFoodVoteTotalByFoodId, getFoodVoteWithCustomerAndEmployeeByFoodId, updateFoodVoteCommentByFoodVoteId, deleteFoodVoteByFoodVoteId, getFoodVoteByFoodVoteId, getQuantityFoodVotes, findFoodVoteByIdOrName, findFoodVoteById, getAllFoodVotes, updateFoodVoteAdminIdAndReplyAndDateByFoodVoteId, deleteFoodVoteAdminById } = require("../service/FoodVoteService");
const { getAdminObjectFromJwtRequest, createLogAdmin } = require("../utils/utils");

module.exports = {
    getFoodVoteByFoodIdAndCustomerId: async (req, res) => {
        const customerId = req.body.customerId;
        const foodId = req.body.foodId;
        if (!customerId || !Number.isInteger(customerId) || customerId <= 0) {
            return res.status(400).json({
                status: "fail",
                message: "Customer id không hợp lệ!"
            });
        }
        if (!foodId || !Number.isInteger(foodId) || foodId <= 0) {
            return res.status(400).json({
                status: "fail",
                message: "Food id không hợp lệ!"
            });
        }
        // Find food
        let finalResult = {};
        try {
            const foodRes = await getFoodByFoodId(foodId);
            if (!foodRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find food by id!"
                });
            }
            // Find customer
            try {
                const customerRes = await getCustomerByCustomerId(customerId);
                if (!customerRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't find customer by id!"
                    });
                }
                try {
                    // Lấy số lượng từng sao
                    const getVoteQuantityRes = await getFoodVoteQuantityForEachStarByFoodId(foodId);
                    if (!getVoteQuantityRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't get food quantity for each star!"
                        });
                    }
                    // Lấy tổng vote
                    const getVoteTotalRes = await getFoodVoteTotalByFoodId(foodId);
                    if (!getVoteTotalRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't get food vote total by food id!"
                        });
                    }
                    //Lấy vote của người dùng và admin bình luận
                    const foodVoteListRes = await getFoodVoteWithCustomerAndEmployeeByFoodId(foodId);
                    if (!foodVoteListRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't get food vote list by food id!"
                        });
                    }
                    // Tìm bình luận của customer => nếu có thì trả về đầu mảng (Các phần tử sau thì xếp giảm theo ngày), 
                    // không thì trả mảng bth( Xếp theo giảm ngày)
                    for (var i = 0; i < foodVoteListRes.length; i++) {
                        if (foodVoteListRes[i].customer_id === customerId) {
                            let term = foodVoteListRes[i];
                            let filteredList = foodVoteListRes.filter(prev => prev.customer_id !== customerId);
                            finalResult = {
                                foodVoteDetail: getVoteQuantityRes,
                                foodVoteTotal: getVoteTotalRes.vote_total,
                                foodVoteList: [
                                    term,
                                    ...filteredList
                                ]
                            }
                            //Success
                            return res.status(200).json({
                                status: "success",
                                message: "Get food vote list by food id!",
                                data: finalResult
                            });
                        }
                    }
                    finalResult = {
                        foodVoteDetail: getVoteQuantityRes,
                        foodVoteTotal: getVoteTotalRes.vote_total,
                        foodVoteList: foodVoteListRes
                    }
                    //Success
                    return res.status(200).json({
                        status: "success",
                        message: "Get food vote list by food id!",
                        data: finalResult
                    });
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when get quantity vote detail!",
                        error: err
                    });
                }
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when get customer by id!",
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
    },
    createFoodVote: async (req, res) => {
        const foodVoteNumber = req.body.foodVoteNumber;
        const foodVoteComment = req.body.foodVoteComment;
        const customerId = req.body.customerId;
        const foodId = req.body.foodId;
        // Lấy ngày hiện tại FORMAT: '2022-05-05 13:48:12' giống CSDL
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var foodVoteDate = date + ' ' + time;

        if (!foodVoteNumber || !Number.isInteger(foodVoteNumber) || foodVoteNumber < 0 || foodVoteNumber > 5) {
            return res.status(400).json({
                status: "fail",
                message: "Số sao đánh giá không hợp lệ!"
            });
        }
        if (!foodVoteComment) {
            return res.status(400).json({
                status: "fail",
                message: "Bình luận không hợp lệ!"
            });
        }
        if (!customerId || !Number.isInteger(customerId) || customerId <= 0) {
            return res.status(400).json({
                status: "fail",
                message: "Customer id không hợp lệ!"
            });
        }
        if (!foodId || !Number.isInteger(foodId) || foodId <= 0) {
            return res.status(400).json({
                status: "fail",
                message: "Food id không hợp lệ!"
            });
        }
        // Tìm food id
        try {
            const foodRes = await getFoodByFoodId(foodId);
            if (!foodRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find food by id!"
                });
            }
            // Tìm food vote xem Người dùng đã đánh giá food này chưa
            try {
                const foodVoteListRes = await getFoodVoteByFoodId(foodId);
                if (!foodVoteListRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't get food vote!"
                    });
                }
                for (var i = 0; i < foodVoteListRes.length; i++) {
                    if (foodVoteListRes[i].customer_id === customerId) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Bạn đã đánh giá món ăn này rồi!"
                        });
                    }
                }
                // Chưa đánh giá thì tạo food-vote
                try {
                    const createFoodVoteRes = await createFoodVote(
                        foodVoteDate,
                        foodVoteNumber,
                        foodVoteComment,
                        customerId,
                        foodId
                    );
                    if (!createFoodVoteRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't create food vote!"
                        });
                    }
                    // Tìm food vote list sau khi thêm
                    try {
                        const foodVoteListAfterRes = await getFoodVoteByFoodId(foodId);
                        if (!foodVoteListAfterRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't get food vote list after!"
                            });
                        }
                        let numberVote = 0;
                        let sumVote = 0;
                        let averageVote = 0;
                        for (var j = 0; j < foodVoteListAfterRes.length; j++) {
                            sumVote += foodVoteListAfterRes[j].food_vote_number;
                            numberVote++;
                        }
                        // Nếu số lượng = 0 thì trung bình là 0
                        if (numberVote === 0) {
                            averageVote = null;
                        } else {
                            averageVote = Math.round(sumVote / numberVote * 100) / 100;
                        }
                        // LOG:
                        console.log("numberVote, sumVote, averageVote: ", numberVote, sumVote, averageVote);
                        // update avegare food vote in food by food id
                        try {
                            const updateAvegareFoodVote = await updateFoodVoteByFoodId(foodId, averageVote);
                            if (!updateAvegareFoodVote) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Cann't update avegare food vote!"
                                });
                            }
                            // Success
                            return res.status(200).json({
                                status: "success",
                                message: "Đánh giá thành công!"
                            });
                        } catch (err) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Error when update average food vote in food!",
                                error: err
                            });
                        }
                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when get food vote list after!",
                            error: err
                        });
                    }
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when create food vote!",
                        error: err
                    });
                }
            } catch (err) {
                console.log("Lỗi: ", err);
                return res.status(400).json({
                    status: "fail",
                    message: "Error when get food vote by food id!",
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
    },
    updateFoodVoteCommentByFoodVoteId: async (req, res) => {
        const foodId = req.body.foodId;
        const foodVoteId = req.body.foodVoteId;
        const foodVoteNumber = req.body.foodVoteNumber;
        const foodVoteComment = req.body.foodVoteComment;

        // Lấy ngày hiện tại FORMAT: '2022-05-05 13:48:12' giống CSDL
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var foodVoteDate = date + ' ' + time;

        if (!foodId || !Number.isInteger(foodId) || foodId <= 0) {
            return res.status(400).json({
                status: "fail",
                message: "Food id không hợp lệ!"
            });
        }
        if (!foodVoteId || !Number.isInteger(foodVoteId) || foodVoteId <= 0) {
            return res.status(400).json({
                status: "fail",
                message: "Food vote id không hợp lệ!"
            });
        }
        if (!foodVoteNumber || !Number.isInteger(foodVoteNumber) || foodVoteNumber < 0 || foodVoteNumber > 5) {
            return res.status(400).json({
                status: "fail",
                message: "Số sao đánh giá không hợp lệ!"
            });
        }
        if (!foodVoteComment) {
            return res.status(400).json({
                status: "fail",
                message: "Bình luận không hợp lệ!"
            });
        }
        try {
            // Kiểm tra có food không?
            const foodRes = await getFoodByFoodId(foodId);
            if (!foodRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Food record not found!"
                });
            }
            // Kiểm tra có food vote không?
            const foodVoteRes = await getFoodVoteByFoodVoteId(foodVoteId);
            if (!foodVoteRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Food vote record not found!"
                });
            }
            const updateCommentRes = await updateFoodVoteCommentByFoodVoteId(foodVoteNumber, foodVoteComment, foodVoteDate, foodVoteId);
            if (!updateCommentRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't update food vote comment!"
                });
            }
            // Tìm food vote list sau khi thêm
            try {
                const foodVoteListAfterRes = await getFoodVoteByFoodId(foodId);
                if (!foodVoteListAfterRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't get food vote list after!"
                    });
                }
                let numberVote = 0;
                let sumVote = 0;
                let averageVote = 0;
                for (var j = 0; j < foodVoteListAfterRes.length; j++) {
                    sumVote += foodVoteListAfterRes[j].food_vote_number;
                    numberVote++;
                }
                // Nếu số lượng = 0 thì trung bình là 0
                if (numberVote === 0) {
                    averageVote = null;
                } else {
                    averageVote = Math.round(sumVote / numberVote * 100) / 100;
                }
                // LOG:
                console.log("numberVote, sumVote, averageVote: ", numberVote, sumVote, averageVote);
                // update avegare food vote in food by food id
                try {
                    const updateAvegareFoodVote = await updateFoodVoteByFoodId(foodId, averageVote);
                    if (!updateAvegareFoodVote) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't update avegare food vote!"
                        });
                    }
                    // Success
                    return res.status(200).json({
                        status: "success",
                        message: "Cập nhật đánh giá thành công!"
                    });
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when update average food vote in food!",
                        error: err
                    });
                }
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when get food vote list after!",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when update food vote comment!",
                error: err
            });
        }
    },
    deleteFoodVoteCommentByFoodVoteId: async (req, res) => {
        const foodId = req.body.foodId;
        const foodVoteId = req.body.foodVoteId;
        if (!foodId || !Number.isInteger(foodId) || foodId <= 0) {
            return res.status(400).json({
                status: "fail",
                message: "Food id không hợp lệ!"
            });
        }
        if (!foodVoteId || !Number.isInteger(foodVoteId) || foodVoteId <= 0) {
            return res.status(400).json({
                status: "fail",
                message: "Food vote id không hợp lệ!"
            });
        }
        try {
            // Kiểm tra có food không?
            const foodRes = await getFoodByFoodId(foodId);
            if (!foodRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Food record not found!"
                });
            }
            // Kiểm tra có food vote không?
            const foodVoteRes = await getFoodVoteByFoodVoteId(foodVoteId);
            if (!foodVoteRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Food vote record not found!"
                });
            }
            const deleteCommentRes = await deleteFoodVoteByFoodVoteId(foodVoteId);
            if (!deleteCommentRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't delete food vote comment!"
                });
            }
            // Tìm food vote list sau khi thêm
            try {
                const foodVoteListAfterRes = await getFoodVoteByFoodId(foodId);
                if (!foodVoteListAfterRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't get food vote list after!"
                    });
                }
                let numberVote = 0;
                let sumVote = 0;
                let averageVote = 0;
                for (var j = 0; j < foodVoteListAfterRes.length; j++) {
                    sumVote += foodVoteListAfterRes[j].food_vote_number;
                    numberVote++;
                }
                // Nếu số lượng = 0 thì trung bình là 0
                if (numberVote === 0) {
                    averageVote = null;
                } else {
                    averageVote = Math.round(sumVote / numberVote * 100) / 100;
                }
                // LOG:
                console.log("numberVote, sumVote, averageVote: ", numberVote, sumVote, averageVote);
                // update avegare food vote in food by food id
                try {
                    const updateAvegareFoodVote = await updateFoodVoteByFoodId(foodId, averageVote);
                    if (!updateAvegareFoodVote) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't update avegare food vote!"
                        });
                    }
                    // Success
                    return res.status(200).json({
                        status: "success",
                        message: "Xóa đánh giá thành công!"
                    });
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when update average food vote in food!",
                        error: err
                    });
                }
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when get food vote list after!",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when delete food vote comment!",
                error: err
            });
        }
    },

    // ADMIN: Quản lý Bình luận - Đánh giá - Khách sạn
    getAllFoodVotes: async (req, res) => {
        try {
            const result = await getAllFoodVotes();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Lấy food votes thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getAllFoodVotes",
                error: err
            });
        }
    },
    getQuantityFoodVote: async (req, res) => {
        try {
            const result = await getQuantityFoodVotes();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Lấy quantity food votes thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getQuantityFoodVotes",
                error: err
            });
        }
    },
    findFoodVoteByIdOrName: async (req, res) => {
        const search = req.params.search;
        try {
            const result = await findFoodVoteByIdOrName(search);
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Tìm food votes thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findFoodVoteByIdOrName",
                error: err
            });
        }
    },
    findFoodVoteById: async (req, res) => {
        const foodVoteId = req.body.foodVoteId;
        try {
            const result = await findFoodVoteById(foodVoteId);
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Tìm food votes thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findFoodVoteById",
                error: err
            });
        }
    },
    // ADMIN: Quản lý Bình luận - Đánh giá: Phản hồi bình luận getAdminObjectFromJwtRequest
    replyCustomerComment: async (req, res) => {
        const foodVoteReply = req.body.foodVoteReply;
        const foodVoteId = parseInt(req.body.foodVoteId);
        if (!foodVoteReply) {
            return res.status(400).json({
                status: "fail",
                message: "Bạn chưa nhập bình luận phản hồi!"
            });
        }
        if (!foodVoteId || !Number.isInteger(foodVoteId) || foodVoteId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã số Bình luận không hợp lệ!"
            });
        }
        // Tìm xem food vote có tồn tại không
        try {
            const foodVoteRes = await findFoodVoteById(foodVoteId);
            if (!foodVoteRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find food vote!"
                });
            }

            // Lấy ngày hiện tại FORMAT: '2022-05-05 13:48:12' giống CSDL
            var today = new Date();
            var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var foodVoteReplyDate = date + ' ' + time;
            // Lấy admin từ req
            const admin = getAdminObjectFromJwtRequest(req);

            // Cập nhật phản hồi
            try {
                const updateFoodVoteRes = await updateFoodVoteAdminIdAndReplyAndDateByFoodVoteId(foodVoteReply, foodVoteReplyDate, admin.employee_id, foodVoteId);
                if (!updateFoodVoteRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't update food vote reply!"
                    });
                }

                createLogAdmin(req, res, " vừa Phản hồi bình luận có mã số: " + foodVoteId, "UPDATE").then(() => {
                    // Success
                    return res.status(200).json({
                        status: "success",
                        message: "Phản hồi bình luận Khách hàng thành công!"
                    });
                });

            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when update food vote reply!",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when find food vote!",
                error: err
            });
        }
    },
    // ADMIN: Quản lý Bình luận - Đánh giá: Xóa bình luận admin
    deleteFoodVoteAdminById: async (req, res) => {
        const foodVoteId = parseInt(req.params.foodVoteId);
        if (!foodVoteId || !Number.isInteger(foodVoteId) || foodVoteId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã Bình luận không hợp lệ!"
            });
        }
        // Tìm food vote xem có tồn tại không
        try {
            const foodVoteRes = await findFoodVoteById(foodVoteId);
            if (!foodVoteRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find food vote!"
                });
            }
            // Lấy food id để tính trung bình lại sau khi xóa
            const foodId = foodVoteRes.food_id;
            // Xóa food vote
            try {
                const deleteFoodVoteRes = await deleteFoodVoteAdminById(foodVoteId);
                if (!deleteFoodVoteRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't delete food vote!"
                    });
                }

                // Tìm food vote list sau khi xóa
                try {
                    const foodVoteListAfterRes = await getFoodVoteByFoodId(foodId);
                    if (!foodVoteListAfterRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Cann't get food vote list after!"
                        });
                    }
                    let numberVote = 0;
                    let sumVote = 0;
                    let averageVote = 0;
                    for (var j = 0; j < foodVoteListAfterRes.length; j++) {
                        sumVote += foodVoteListAfterRes[j].food_vote_number;
                        numberVote++;
                    }
                    // Nếu số lượng = 0 thì trung bình là 0
                    if (numberVote === 0) {
                        averageVote = null;
                    } else {
                        averageVote = Math.round(sumVote / numberVote * 100) / 100;
                    }
                    // LOG:
                    console.log("numberVote, sumVote, averageVote: ", numberVote, sumVote, averageVote);
                    // update avegare food vote in food by food id
                    try {
                        const updateAvegareFoodVote = await updateFoodVoteByFoodId(foodId, averageVote);
                        if (!updateAvegareFoodVote) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Cann't update avegare food vote!"
                            });
                        }

                        createLogAdmin(req, res, " vừa xóa Bình luận có mã: " + foodVoteId, "DELETE").then(() => {
                            // Success
                            return res.status(200).json({
                                status: "success",
                                message: "Xóa Bình luận thành công!"
                            });
                        });

                    } catch (err) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Error when update average food vote in food!",
                            error: err
                        });
                    }
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Error when get food vote list after!",
                        error: err
                    });
                }
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when delete food vote!",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when find food vote!",
                error: err
            });
        }
    },
}