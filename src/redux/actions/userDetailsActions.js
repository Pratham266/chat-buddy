import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginWithCode } from "../../services/authService";

export const loginUser = createAsyncThunk(
  "userDetails/loginUser", // Action type prefix (used for matching in reducers)
  async (code, { rejectWithValue }) => {
    try {
      // Call the login API with the given code
      const result = await loginWithCode(code);

      // If the API call is successful (e.g. result.success = true)
      if (result.success) {
        // Return the user data, which will be available in `action.payload` in the fulfilled reducer
        return result.userData;
      } else {
        // If login failed, reject the promise and return the error message
        return rejectWithValue(result.message);
      }
    } catch (err) {
      // If any error (like network issues), reject with the error message
      return rejectWithValue(err.message);
    }
  }
);
