const { getFoodTypeByFoodTypeId } = require("../service/FoodTypeService");
const { getDistinctFoodTypeIdBySetMenuId, getFoodBySetMenuIdAndFoodTypeId } = require("../service/MenuDetailFoodService");
const { getSetMenus, getAllSetMenus, getQuantitySetMenus, findSetMenuByIdOrName, findSetMenuById, createSetMenu, updateSetMenuById, updateSetMenuState, deleteSetMenu } = require("../service/SetMenuService");
const { createLogAdmin } = require("../utils/utils");

module.exports = {
    getSetMenus: async (req, res) => {
        try {
            const result = await getSetMenus();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found"
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Get all set menus successfully!",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getSetMenus",
                error: err
            });
        }
    },
    getSetMenuAndMenuDetailFoodAndFoodAndType: async (req, res) => {
        // Lấy thông tin tất cả set menu
        try {
            const finalResult = [];
            const setMenuRes = await getSetMenus();
            if (!setMenuRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Set menu record not found"
                });
            }
            for (var i = 0; i < setMenuRes.length; i++) {
                const setMenuId = setMenuRes[i].set_menu_id;
                let finalResultItem = {};
                let setMenu = { ...setMenuRes[i] };
                let foodTypeWithFoods = [];
                // Lấy các food_type từ set_menu_id
                try {
                    const foodTypeInMenuDetailRes = await getDistinctFoodTypeIdBySetMenuId(setMenuId);
                    if (!foodTypeInMenuDetailRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Food type distinct record not found"
                        });
                    }
                    for (var j = 0; j < foodTypeInMenuDetailRes.length; j++) {
                        const foodTypeId = foodTypeInMenuDetailRes[j].food_type_id;
                        let foodTypeWithFoodsItem = {};
                        // Lấy thông tin food type
                        try {
                            const foodTypeRes = await getFoodTypeByFoodTypeId(foodTypeId);
                            if (!foodTypeRes) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Food type record not found"
                                });
                            }
                            // Lấy foods từ food_type
                            try {
                                const foodRes = await getFoodBySetMenuIdAndFoodTypeId(setMenuId, foodTypeId);
                                if (!foodRes) {
                                    return res.status(400).json({
                                        status: "fail",
                                        message: "Food record not found"
                                    });
                                }
                                foodTypeWithFoodsItem = {
                                    foodType: foodTypeRes,
                                    food: foodRes
                                };
                                foodTypeWithFoods.push(foodTypeWithFoodsItem);
                            } catch (err) {
                                return res.status(400).json({
                                    status: "fail",
                                    message: "Lỗi getFoodBysetMenuIdAndFoodTypeId",
                                    error: err
                                });
                            }
                        } catch (err) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Lỗi getFoodTypeByFoodTypeId",
                                error: err
                            });
                        }
                    }
                } catch (err) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Lỗi getDistinctFoodTypeIdBysetMenuId",
                        error: err
                    });
                }
                finalResultItem = {
                    setMenu: setMenu,
                    foodTypeAndFoods: foodTypeWithFoods
                };
                finalResult.push(finalResultItem);
            }
            return res.status(200).json({
                status: "success",
                message: "Get set menu with food and type",
                data: finalResult
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getSetMenus",
                error: err
            });
        }
    },


    // ADMIN: Quản lý Loại Set menu - Nhà hàng
    getAllSetMenus: async (req, res) => {
        try {
            const result = await getAllSetMenus();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Lấy set menus thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getAllSetMenus",
                error: err
            });
        }
    },
    getQuantitySetMenu: async (req, res) => {
        try {
            const result = await getQuantitySetMenus();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Lấy quantity set menus thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getQuantitySetMenus",
                error: err
            });
        }
    },
    findSetMenuByIdOrName: async (req, res) => {
        const search = req.params.search;
        try {
            const result = await findSetMenuByIdOrName(search);
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Tìm set menus thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findSetMenuByIdOrName",
                error: err
            });
        }
    },
    findSetMenuById: async (req, res) => {
        const setMenuId = req.body.setMenuId;
        try {
            const result = await findSetMenuById(setMenuId);
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found!",
                    data: []
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Tìm set menus thành công",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi findSetMenuById",
                error: err
            });
        }
    },
    createSetMenu: async (req, res) => {
        const setMenuName = req.body.setMenuName;
        const setMenuDescription = req.body.setMenuDescription;
        const setMenuPrice = parseInt(req.body.setMenuPrice);
        const setMenuImage = req.body.setMenuImage;
        const setMenuState = 0;
        if (!setMenuName) {
            return res.status(400).json({
                status: "fail",
                message: "Tên Set Menu không hợp lệ!"
            });
        }
        if (!setMenuDescription) {
            return res.status(400).json({
                status: "fail",
                message: "Mô tả Set Menu không hợp lệ!"
            });
        }
        if (!setMenuPrice || !Number.isInteger(setMenuPrice) || setMenuPrice < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Giá của Set Menu không hợp lệ!"
            });
        }
        if (!setMenuImage) {
            return res.status(400).json({
                status: "fail",
                message: "Hình ảnh của Set Menu không hợp lệ!"
            });
        }
        try {
            const createsetMenuRes = await createSetMenu(setMenuName, setMenuDescription, setMenuPrice, setMenuImage, setMenuState);
            if (!createsetMenuRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't create set menu!"
                });
            }

            createLogAdmin(req, res, " vừa thêm Set Menu mới tên: " + setMenuName, "CREATE").then(() => {
                // Success
                return res.status(200).json({
                    status: "success",
                    message: "Thêm Set Menu mới thành công!"
                });
            });

        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when create set menu!",
                error: err
            });
        }
    },
    updateSetMenu: async (req, res) => {
        const setMenuName = req.body.setMenuName;
        const setMenuDescription = req.body.setMenuDescription;
        const setMenuPrice = parseInt(req.body.setMenuPrice);
        const setMenuImage = req.body.setMenuImage;
        const setMenuId = req.body.setMenuId;
        if (!setMenuName) {
            return res.status(400).json({
                status: "fail",
                message: "Tên Set Menu không hợp lệ!"
            });
        }
        if (!setMenuDescription) {
            return res.status(400).json({
                status: "fail",
                message: "Mô tả Set Menu không hợp lệ!"
            });
        }
        if (!setMenuPrice || !Number.isInteger(setMenuPrice) || setMenuPrice < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Giá của Set Menu không hợp lệ!"
            });
        }
        if (!setMenuImage) {
            return res.status(400).json({
                status: "fail",
                message: "Hình ảnh của Set Menu không hợp lệ!"
            });
        }
        if (!setMenuId || !Number.isInteger(setMenuId) || setMenuId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã Set Menu không hợp lệ!"
            });
        }
        // Tìm và kiểm tra tồn tại
        try {
            const setMenuRes = await findSetMenuById(setMenuId);
            if (!setMenuRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find set menu!"
                });
            }
            // Cập nhật
            try {
                const updatesetMenuRes = await updateSetMenuById(setMenuName, setMenuDescription, setMenuPrice, setMenuImage, setMenuId);
                if (!updatesetMenuRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't update set menu!"
                    });
                }

                createLogAdmin(req, res, " vừa cập nhật Set Menu mã: " + setMenuId, "UPDATE").then(() => {
                    // Success
                    return res.status(200).json({
                        status: "success",
                        message: "Cập nhật Set Menu thành công!"
                    });
                });

            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when update set menu!",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when find set menu!",
                error: err
            });
        }
    },
    // Disable Set Menu
    updateSetMenuStateTo1: async (req, res) => {
        const setMenuId = req.body.setMenuId;
        if (!setMenuId || !Number.isInteger(setMenuId) || setMenuId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã Set Menu không hợp lệ!"
            });
        }
        // Tìm và kiểm tra tồn tại
        try {
            const setMenuRes = await findSetMenuById(setMenuId);
            if (!setMenuRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find set menu!"
                });
            }
            // Kiểm tra state hiện tại
            const stateRes = setMenuRes.set_menu_state;
            if (stateRes === 1) {
                return res.status(400).json({
                    status: "fail",
                    message: "Set Menu này đã bị vô hiệu trước đó!"
                });
            }
            // Cập nhật state 0 - 1: Vô hiệu
            const setMenuState = 1;
            try {
                const updatesetMenuRes = await updateSetMenuState(setMenuState, setMenuId);
                if (!updatesetMenuRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't update set menu!"
                    });
                }

                createLogAdmin(req, res, " vừa Vô hiệu hóa Set Menu mã: " + setMenuId, "UPDATE").then(() => {
                    // Success
                    return res.status(200).json({
                        status: "success",
                        message: "Vô hiệu hóa Set Menu thành công!"
                    });
                });

            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when update set menu!",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when find set menu!",
                error: err
            });
        }
    },
    // Mở khóa Set Menu
    updateSetMenuStateTo0: async (req, res) => {
        const setMenuId = req.body.setMenuId;
        if (!setMenuId || !Number.isInteger(setMenuId) || setMenuId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã Set Menu không hợp lệ!"
            });
        }
        // Tìm và kiểm tra tồn tại
        try {
            const setMenuRes = await findSetMenuById(setMenuId);
            if (!setMenuRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find set menu!"
                });
            }
            // Kiểm tra state hiện tại
            const stateRes = setMenuRes.set_menu_state;
            if (stateRes === 0) {
                return res.status(400).json({
                    status: "fail",
                    message: "Set Menu này vẫn đang hoạt động!"
                });
            }
            // Cập nhật state 1 - 0: Mở khóa
            const setMenuState = 0;
            try {
                const updatesetMenuRes = await updateSetMenuState(setMenuState, setMenuId);
                if (!updatesetMenuRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't update set menu!"
                    });
                }

                createLogAdmin(req, res, " vừa Mở khóa Set Menu mã: " + setMenuId, "UPDATE").then(() => {
                    // Success
                    return res.status(200).json({
                        status: "success",
                        message: "Mở khóa Set Menu thành công!"
                    });
                });

            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when update set menu!",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when find set menu!",
                error: err
            });
        }
    },
    deleteSetMenu: async (req, res) => {
        const setMenuId = parseInt(req.params.setMenuId);
        if (!setMenuId || !Number.isInteger(setMenuId) || setMenuId < 0) {
            return res.status(400).json({
                status: "fail",
                message: "Mã Set Menu không hợp lệ!"
            });
        }
        // Tìm và kiểm tra hợp lệ
        try {
            const setMenuRes = await findSetMenuById(setMenuId);
            if (!setMenuRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Cann't find set menu!"
                });
            }
            // Tiến hành xóa Set Menu
            try {
                const deletesetMenuRes = await deleteSetMenu(setMenuId);
                if (!deletesetMenuRes) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Cann't delete set menu!"
                    });
                }

                createLogAdmin(req, res, " vừa xóa Set Menu mã: " + setMenuId, "DELETE").then(() => {
                    // Success
                    return res.status(200).json({
                        status: "success",
                        message: "Xóa Set Menu thành công!"
                    });
                });

            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Error when delete set menu!",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Error when find set menu!",
                error: err
            });
        }
    }
}