import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice"; // Import user reducer
import loaderReducer from "./loaderSlice"; // Import loader reducer

const store = configureStore({
  reducer: {
    loader: loaderReducer,
    user: userReducer,
  },
});

export default store;
