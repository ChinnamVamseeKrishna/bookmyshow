import { createSlice } from "@reduxjs/toolkit";

const loaderSlice = createSlice({
  name: "loader", // Name of the slice
  initialState: {
    // Initial state of the slice
    isLoading: false, // Boolean to track loading state
  },
  reducers: {
    // Reducers to handle actions
    ShowLoading: (state) => {
      // Action to set loading state
      state.isLoading = true; // Set loading state to true
    },
    HideLoading: (state) => {
      // Action to reset loading state
      state.isLoading = false; // Set loading state to false
    },
  },
});

export const { ShowLoading, HideLoading } = loaderSlice.actions; // Export actions for use in components

export default loaderSlice.reducer; // Export the reducer to be used in the store
