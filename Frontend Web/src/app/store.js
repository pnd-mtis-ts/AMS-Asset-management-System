import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice.js";
import toastReducer from "../features/toastSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    toast: toastReducer,
  },
});
