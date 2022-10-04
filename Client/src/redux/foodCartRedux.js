import { createSlice } from "@reduxjs/toolkit";

const foodCartSlice = createSlice({
    name: "foodCart",
    initialState: {
        foods: [],
        foodCartQuantity: 0,
        foodCartTotal: 0,
    },
    reducers: {
        addFood: (state, action)=> {
            let i;
            let isFind = false;
            for(i = 0; i < state.foods.length; i++) {
                if(state.foods[i].data[0].foodId === parseInt(action.payload.data[0].foodId)) {
                    const quantityInCart = state.foods[i].quantityBuy;
                    const quantityCanBuy = state.foods[i].data[0].quantity - quantityInCart;
                    const quantityWantBuy = action.payload.quantityBuy;

                    if(quantityCanBuy == 0) {
                        console.log("Số lượng mua đã đạt giới hạn");
                        return;
                    }
                    if(quantityWantBuy <= quantityCanBuy) {
                        state.foods[i].quantityBuy += quantityWantBuy;
                        state.foddCartTotal += action.payload.data[0].price * quantityWantBuy;
                        console.log("So luong trong gio hang:"+quantityInCart+" So luong co the mua: "+quantityCanBuy+" So luong muon mua: "+quantityWantBuy)
                        console.log("Tìm thấy & cập nhật lại số lượng giỏ hàng thành công");
                        isFind = true;
                        break;
                    }else {
                        console.log("Số lượng không hợp lệ");
                        isFind = true;
                    }
                }
            }
            // Chưa có mã thú cưng này trong giỏ hàng
            if(!isFind) {
                state.foods.push(action.payload);
                state.foodCartQuantity += 1;
                state.foodCartTotal += action.payload.data[0].price * action.payload.quantityBuy;
                console.log("Thêm vào giỏ hàng thành công");
                console.log("Them san pham: ", action.payload)
            }
        },
        updateFood: (state, action)=> {
            console.log("Cap nhat san pham: ", action.payload)
            let i;
            for(i = 0; i < state.foods.length; i++) {
                if(state.foods[i].data[0].foodId === parseInt(action.payload.data[0].foodId)) {
                    if(action.payload.quantityUpdate === 0) {
                        state.foods[i].quantityBuy = action.payload.quantityUpdate;
                        state.foods.splice(i, 1);
                        state.foodCartQuantity -= 1 ;
                        state.foodCartTotal -= action.payload.data[0].price * action.payload.quantityBuy;
                    }
                    if(action.payload.quantityUpdate === 1) {
                        state.foods[i].quantityBuy += 1;
                        state.foodCartTotal += action.payload.data[0].price * 1;
                    }
                    if(action.payload.quantityUpdate === -1) {
                        state.foods[i].quantityBuy -= 1;
                        if(state.foods[i].quantityBuy <= 0){
                            state.foods.splice(i, 1);
                            state.foodCartQuantity -= 1 ;
                            state.foodCartTotal -= action.payload.data[0].price * action.payload.quantityBuy;
                        }else {
                            state.foodCartTotal -= action.payload.data[0].price * 1;
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