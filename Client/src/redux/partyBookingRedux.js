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
            var arrayFinal = [];
            action.payload.partyService.map((service, key) => {
                arrayFinal.push({
                    ...service,
                    partyServiceQuantity: 1
                })
            })
            state.partyService = arrayFinal;
        },
        updatePartyServiceBookingParty: (state, action) => {
            console.log("Cap nhat san pham: ", action.payload)
            for (var i = 0; i < state.partyService.length; i++) {
                if (state.partyService[i].party_service_id === parseInt(action.payload.party_service_id)) {
                    if (action.payload.partyServiceQuantityUpdate === 0) {
                        state.partyService[i].partyServiceQuantity = action.payload.partyServiceQuantityUpdate;
                        state.partyService.splice(i, 1);
                        state.partyBookingTotal -= action.payload.party_service_price * action.payload.partyServiceQuantity;
                    }
                    if (action.payload.partyServiceQuantityUpdate === 1) {
                        state.partyService[i].partyServiceQuantity += 1;
                        state.partyBookingTotal += action.payload.party_service_price * 1;
                    }
                    if (action.payload.partyServiceQuantityUpdate === -1) {
                        state.partyService[i].partyServiceQuantity -= 1;
                        if (state.partyService[i].partyServiceQuantity <= 0) {
                            state.partyService.splice(i, 1);
                            state.partyBookingTotal -= action.payload.party_service_price * action.payload.partyServiceQuantity;
                        } else {
                            state.partyBookingTotal -= action.payload.party_service_price * 1;
                        }
                    }
                }
            }
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
    updatePartyServiceBookingParty,
    addSetMenuBookingParty,
    addFoodListBookingParty,
    addDiscountBookingParty,
    addPartyBookingTotal,
    logoutPartyBooking
} = partyBookingSlice.actions
export default partyBookingSlice.reducer;