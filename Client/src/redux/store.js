import { configureStore, combineReducers } from "@reduxjs/toolkit";
import foodCartReducer from "./foodCartRedux";
import customerReducer from "./customerRedux";
import roomBookingReducer from "./roomBookingRedux";
import partyBookingReducer from "./partyBookingRedux";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

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