// store

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import clientSlice from './clientSlice';
import bookingSlice from './bookingSlice';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

const persistConfig = {
    key: "root",
    storage: AsyncStorage,
    whitelist: ["auth"], // Persist only the auth slice
};

const rootReducer = combineReducers({
    auth: authSlice,
    client: clientSlice,
    booking: bookingSlice
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware)=>
        getDefaultMiddleware({
            immutableCheck: false,
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            }
        })
})

export const persistor = persistStore(store)

export default store