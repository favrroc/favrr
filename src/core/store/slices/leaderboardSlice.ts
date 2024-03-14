import { createSlice } from "@reduxjs/toolkit";

interface LeaderboardSlice {
  numOfLoadedRowsByGroup: number[]
}

const initialState = {
  numOfLoadedRowsByGroup: Array.from({ length: 11 }, () => 10)
} as LeaderboardSlice;

const leaderboardSlice = createSlice({
  name: "leaderboard",
  initialState,
  reducers: {
    setNumOfLoadedRowsByGroup(state, action) {
      state.numOfLoadedRowsByGroup = action.payload;
    }
  }
});

export const { setNumOfLoadedRowsByGroup } = leaderboardSlice.actions;

export default leaderboardSlice.reducer;
