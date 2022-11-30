import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH, PAUSE,
  PERSIST, persistReducer, persistStore, PURGE,
  REGISTER, REHYDRATE
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import customerReducer from "./customerRedux";
import foodCartReducer from "./foodCartRedux";
import partyBookingReducer from "./partyBookingRedux";
import roomBookingReducer from "./roomBookingRedux";

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
}

const rootReducer = combineReducers({ customer: customerReducer, foodCart: foodCartReducer, roomBooking: roomBookingReducer, partyBooking: partyBookingReducer });

const persistedReducer = persistReducer(persistConfig, rootReducer)
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export let persistor = persistStore(store);