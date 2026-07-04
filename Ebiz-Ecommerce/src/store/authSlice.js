import { createSlice } from "@reduxjs/toolkit";

const getUserFromStorage = () => {
  try {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error("Failed to parse user from localStorage:", error);
    return null;
  }
};

const tokenStr = localStorage.getItem("token") || localStorage.getItem("authToken") || localStorage.getItem("accessToken");

const initialState = {
  user: getUserFromStorage(),
  token: tokenStr || null,
  isAuthenticated: Boolean(tokenStr),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(state, action) {
      state.user = action.payload?.user ?? null;
      state.token = action.payload?.token ?? null;
      state.isAuthenticated = Boolean(action.payload?.token);
    },
    clearAuth(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
