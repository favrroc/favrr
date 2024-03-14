import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IUsageSlice {
  secondsOnApp: number;
}

const initialState = {
  secondsOnApp: 0
} as IUsageSlice;

const usageSlice = createSlice({
  name: "usage",
  initialState,
  reducers: {
    updateSecondsOnApp(state, action: PayloadAction<number>) {
      state.secondsOnApp = action.payload;
    },
  },
});

export const { 
  updateSecondsOnApp
} = usageSlice.actions;

export default usageSlice.reducer;
