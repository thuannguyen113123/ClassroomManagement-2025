import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  globalLoadingCount: 0,
  isLoading: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    startLoading: (state) => {
      state.globalLoadingCount += 1;
      state.isLoading = true;
    },
    stopLoading: (state) => {
      state.globalLoadingCount = Math.max(0, state.globalLoadingCount - 1);
      if (state.globalLoadingCount === 0) {
        state.isLoading = false;
      }
    },
    resetLoading: (state) => {
      state.globalLoadingCount = 0;
      state.isLoading = false;
    },
  },
});

export const { startLoading, stopLoading, resetLoading } = uiSlice.actions;
export default uiSlice.reducer;
