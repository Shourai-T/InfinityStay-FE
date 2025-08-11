import { configureStore } from "@reduxjs/toolkit";
import bookingReducer from "./bookingSlice";
import authReducer from "./authSlice";
export const store = configureStore({
  reducer: {
    booking: bookingReducer,
    auth: authReducer,
  },
});

// Infer types for dispatch and state
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
