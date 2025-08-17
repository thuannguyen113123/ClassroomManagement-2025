import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import persistStore from "redux-persist/es/persistStore";

import userReducer from "./user/userSlice.js";

import notificationReducer from "./notification/notificationSlice.js";

import uiReducer from "./ui/uiSlice.js";

const rootReducer = combineReducers({
  user: userReducer,
  notifications: notificationReducer,
  ui: uiReducer,
});
const persistConfig = {
  key: "root",
  storage,
  version: 1,
  blacklist: ["chat"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
