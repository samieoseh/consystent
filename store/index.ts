import { configureStore } from "@reduxjs/toolkit";
import systemCreateReducer from "../features/createSystemSlice";
import exampleReducer from "../features/exampleSlice";

export const store = configureStore({
  reducer: {
    example: exampleReducer,
    systemCreate: systemCreateReducer,
  },
});

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
