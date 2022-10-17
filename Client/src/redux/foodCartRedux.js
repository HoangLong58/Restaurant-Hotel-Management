import { createSlice } from "@reduxjs/toolkit";

const foodCartSlice = createSlice({
    name: "foodCart",
    initialState: {
        foods: [],
        foodCartQuantity: 0,
        foodCartTotal: 0,
    },
    // food object {
    //  food info,
    //  foodQuantity: số lượng mua của food trên
    // }
    reducers: {
        addFood: (state, action) => {
            let i;
            let isFind = false;
            for (i = 0; i < state.foods.length; i++) {
                if (state.foods[i].food_id === parseInt(action.payload.food_id)) {
                    const quantityWantBuy = action.payload.foodQuantity;
                    state.foods[i].foodQuantity += quantityWantBuy;

                    state.foodCartTotal += action.payload.food_price * quantityWantBuy;
                    isFind = true;
                    break;
                }
            }
            // Chưa có mã món ăn này trong giỏ hàng
            if (!isFind) {
                state.foods.push(action.payload);
                state.foodCartQuantity += 1;
                state.foodCartTotal += action.payload.food_price * action.payload.foodQuantity;
                console.log("Thêm vào giỏ hàng thành công");
                console.log("Them san pham: ", action.payload)
            }
        },
        updateFood: (state, action) => {
            console.log("Cap nhat san pham: ", action.payload)
            for (var i = 0; i < state.foods.length; i++) {
                if (state.foods[i].food_id === parseInt(action.payload.food_id)) {
                    if (action.payload.foodQuantityUpdate === 0) {
                        state.foods[i].foodQuantity = action.payload.foodQuantityUpdate;
                        state.foods.splice(i, 1);
                        state.foodCartQuantity -= 1;
                        state.foodCartTotal -= action.payload.food_price * action.payload.foodQuantity;
                    }
                    if (action.payload.foodQuantityUpdate === 1) {
                        state.foods[i].foodQuantity += 1;
                        state.foodCartTotal += action.payload.food_price * 1;
                    }
                    if (action.payload.foodQuantityUpdate === -1) {
                        state.foods[i].foodQuantity -= 1;
                        if (state.foods[i].foodQuantity <= 0) {
                            state.foods.splice(i, 1);
                            state.foodCartQuantity -= 1;
                            state.foodCartTotal -= action.payload.food_price * action.payload.foodQuantity;
                        } else {
                            state.foodCartTotal -= action.payload.food_price * 1;
                        }
                    }
                }
            }
        },
        logoutCart: (state) => {
            state.foods = [];
            state.foodCartQuantity = 0;
            state.foodCartTotal = 0;
        }
    }
});

export const { addFood, updateFood, logoutCart } = foodCartSlice.actions
export default foodCartSlice.reducer;