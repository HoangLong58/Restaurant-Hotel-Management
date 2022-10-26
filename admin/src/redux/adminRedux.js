import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
    name: "admin",
    initialState: {
        currentAdmin: null,
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
            state.currentAdmin = action.payload.admin;
            state.token = action.payload.token;
        },
        loginFailure: (state) => {
            state.isFetching = false;
            state.error = true;
        },
        logoutAdmin: (state) => {
            state.currentAdmin = null;
            state.token = null;
            state.isFetching = false;
            state.error = false;
        },
        updateInfo: (state, action) => {
            state.isFetching = false;
            state.currentAdmin = action.payload;
        }
    }
});

export const { loginStart, loginSuccess, loginFailure, logoutAdmin, updateInfo } = adminSlice.actions;
export default adminSlice.reducer;