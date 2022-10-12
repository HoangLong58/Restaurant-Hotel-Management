import { createSlice } from "@reduxjs/toolkit";

const partyBookingSlice = createSlice({
    name: "partyBooking",
    initialState: {
        partyHall: null,

        customer: null,

        dateBooking: null,
        timeBooking: null,
        typeBooking: null,
        quantityBooking: 0,
        partyHallType: null,

        partyService: [],

        setMenu: null,
        foodList: [],

        partyBookingTotal: 0,
        discount: null
    },
    reducers: {
        chooseDayAndQuantityBookingParty: (state, action) => {
            state.dateBooking = action.payload.dateBooking;
            state.timeBooking = action.payload.timeBooking;
            state.typeBooking = action.payload.typeBooking;
            state.quantityBooking = action.payload.quantityBooking;
            state.partyHallType = action.payload.partyHallType;
        },
        addCustomerBookingParty: (state, action) => {
            state.customer = action.payload.customer;
        },
        addPartyHallBookingParty: (state, action) => {
            state.partyHall = action.payload.partyHall;
        },
        addPartyServiceBookingParty: (state, action) => {
            state.partyService = action.payload.partyService;
        },
        addSetMenuBookingParty: (state, action) => {
            state.setMenu = action.payload.setMenu;
        },
        addFoodListBookingParty: (state, action) => {
            state.foodList = action.payload.foodList;
        },
        addDiscountBookingParty: (state, action) => {
            state.discount = action.payload.discount;
        },
        addPartyBookingTotal: (state, action) => {
            state.partyBookingTotal = action.payload.partyBookingTotal;
        },
        logoutPartyBooking: (state) => {
            state.partyHall = null;

            state.customer = null;

            state.dateBooking = null;
            state.timeBooking = null;
            state.typeBooking = null;
            state.quantityBooking = 0;
            state.partyHallType = null;

            state.partyService = [];
            state.setMenu = null;
            state.foodList = [];

            state.partyBookingTotal = 0;
            state.discount = null;
        }
    }
});

export const {
    chooseDayAndQuantityBookingParty,
    addCustomerBookingParty,
    addPartyHallBookingParty,
    addPartyServiceBookingParty,
    addSetMenuBookingParty,
    addFoodListBookingParty,
    addDiscountBookingParty,
    addPartyBookingTotal,
    logoutPartyBooking
} = partyBookingSlice.actions
export default partyBookingSlice.reducer;