import { createSlice } from "@reduxjs/toolkit";

const customerSlice = createSlice({
    name: "customer",
    initialState: {
        currentCustomer: null,
        token: null,
        isFetching: false,
        error: false,
    },
    reducers: {
        loginStart: (state) => {
            state.isFetching = true;
        },
        loginSuccess: (state, action) => {
            state.isFetching = false;
            state.currentCustomer = action.payload.customer;
            state.token = action.payload.token;
        },
        loginFailure: (state) => {
            state.isFetching = false;
            state.error = true;
        },
        logoutCustomer: (state) => {
            state.currentCustomer = null;
            state.token = null;
            state.isFetching = false;
            state.error = false;
        },
        updateInfo: (state, action) => {
            state.isFetching = false;
            state.currentCustomer = action.payload;
        }
    }
});

export const { loginStart, loginSuccess, loginFailure, logoutCustomer, updateInfo } = customerSlice.actions;
export default customerSlice.reducer;