import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { portfolioPath } from "../../util/pathBuilder.util";

interface FollowSlice {
  numOfLoadedFollowing: {
    [url: string]: number;
  },
  numOfLoadedFollower: {
    [url: string]: number;
  };
}

const initialState = {
  numOfLoadedFollowing: {
    [portfolioPath()]: 4
  },
  numOfLoadedFollower: {
    [portfolioPath()]: 4
  },
} as FollowSlice;

const followSlice = createSlice({
  name: "follow",
  initialState,
  reducers: {
    increaseNumOfLoadedFollowing(state, { payload }: PayloadAction<string>) {
      state.numOfLoadedFollowing[payload] = (state.numOfLoadedFollowing[payload] || 0) + 4;
    },
    increaseNumOfLoadedFollower(state, { payload }: PayloadAction<string>) {
      state.numOfLoadedFollower[payload] = (state.numOfLoadedFollower[payload] || 0) + 4;
    }
  }
});

export const { increaseNumOfLoadedFollowing, increaseNumOfLoadedFollower } = followSlice.actions;

export default followSlice.reducer;
