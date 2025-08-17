import { createSlice } from "@reduxjs/toolkit";

const savedUser = localStorage.getItem("currentUser");

const initialState = {
  currentUser: savedUser ? JSON.parse(savedUser) : null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    sendCodeStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    sendCodeSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    sendCodeFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    verifyCodeStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    verifyCodeSuccess: (state, action) => {
      console.log("Payload xác thực nhận được:", action.payload);

      state.currentUser = {
        phone: action.payload.phone || null,
        email: action.payload.email || null,
        username: action.payload.username || null,
        role: action.payload.role || null,
        token: action.payload.token || null,
      };
      state.loading = false;
      state.error = null;
      localStorage.setItem("currentUser", JSON.stringify(state.currentUser));
    },

    verifyCodeFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    signout: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem("currentUser");
    },
  },
});

export const {
  sendCodeStart,
  sendCodeSuccess,
  sendCodeFailure,
  verifyCodeStart,
  verifyCodeSuccess,
  verifyCodeFailure,
  signout,
} = userSlice.actions;

export default userSlice.reducer;
