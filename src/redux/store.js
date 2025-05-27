import { configureStore } from "@reduxjs/toolkit";
import userDetailsReducer from "./reducer/userDetailsReducer";

const store = configureStore({
  reducer: {
    userDetails: userDetailsReducer, // Add your reducer here
  }, // Add your reducers here
});

export default store;
