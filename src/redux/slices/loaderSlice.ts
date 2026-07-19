// redux/slices/loaderSlice.ts
import { createSlice } from "@reduxjs/toolkit";

const loaderSlice = createSlice({
  name: "loader",
  initialState: { loading: false, mode: "full" },
  reducers: {
    showLoader: (state, action) => {
      state.loading = true;
      state.mode = action.payload || "full";
    },
    hideLoader: (state) => {
      state.loading = false;
    },
  },
});

export const { showLoader, hideLoader } = loaderSlice.actions;
export default loaderSlice.reducer;
