import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "./todoSlice";
//creating store
export const store = configureStore({
  reducer: todoReducer,
});
