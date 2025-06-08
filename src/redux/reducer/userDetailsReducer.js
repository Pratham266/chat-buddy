// reducer/userDetailsReducer.js
import { createSlice } from "@reduxjs/toolkit";
import { loginUser } from "../actions/userDetailsActions";

const userDetailsReducer = createSlice({
  name: "userDetails",
  initialState: {
    user: null,
    chatUser: null,
    status: "idle", // 'idle' | 'pending' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.status = "idle";
      state.error = null;
      state.chatUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.chatUser = action.payload.chatUser;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.chatUser = null;
        state.user = null;
      });
  },
});

export const { logout } = userDetailsReducer.actions;
export default userDetailsReducer.reducer;
