import { createSlice } from "@reduxjs/toolkit"; // Import createSlice from Redux Toolkit
const userSlice = createSlice({
  name: "user", // Name of the slice
  initialState: {
    // Initial state of the slice
    user: null, // User object to store user information
  },
  reducers: {
    // Reducers to handle actions
    SetUser: (state, action) => {
      // Action to set user information
      state.user = action.payload; // Update user state with payload
    },
  },
});

export const { SetUser } = userSlice.actions; // Export actions for use in components
export default userSlice.reducer; // Export the reducer to be used in the store
