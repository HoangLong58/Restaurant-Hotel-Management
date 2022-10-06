import { createSlice } from "@reduxjs/toolkit";

const roomBookingSlice = createSlice({
    name: "roomBooking",
    initialState: {
        room: null,
        customer: null,
        roomQuantity: 0,
        checkInDate: null,
        checkOutDate: null,
        adultsQuantity: null,
        childrenQuantity: null,
        roomTotal: 0,
        discount: null,
    },
    reducers: {
        chooseDayAndQuantity: (state, action) => {
            state.checkInDate = action.payload.checkInDate;
            state.checkOutDate = action.payload.checkOutDate;
            state.adultsQuantity = action.payload.adultsQuantity;
            state.childrenQuantity = action.payload.childrenQuantity;
        },
        addCustomerBookingRoom: (state, action) => {
            state.customer = action.payload.customer;
        },
        addRoomBookingRoom: (state, action) => {
            state.room = action.payload.room;
        },
        addDiscount: (state, action) => {
            state.discount = action.payload.discount;
        },
        addRoomTotal: (state, action) => {
            state.roomTotal = action.payload.roomTotal;
        },
        logoutRoomBooking: (state) => {
            state.room = null;
            state.roomQuantity = 0;
            state.checkInDate = null;
            state.checkOutDate = null;
            state.adultsQuantity = null;
            state.childrenQuantity = null;
            state.roomTotal = 0;
            state.discount = null;
        }
    }
});

export const { chooseDayAndQuantity, addCustomerBookingRoom, addRoomBookingRoom, addDiscount, addRoomTotal, logoutRoomBooking } = roomBookingSlice.actions
export default roomBookingSlice.reducer;