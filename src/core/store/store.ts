import { configureStore } from "@reduxjs/toolkit";

import favsSliceReducer from "./slices/favsSlice";
import userSliceReducer from "./slices/userSlice";
import participantsSliceReducer from "./slices/participantsSlice";
import modalSliceReducer from "./slices/modalSlice";
import wyreSliceReducer from "./slices/wyreSlice";
import leaderboardSliceReducer from "./slices/leaderboardSlice";
import followSliceReducer from "./slices/followSlice";
import usageSliceReducer from "./slices/usageSlice";
import fanMatchSliceReducer from "./slices/fanMatchSlice";

export const store = configureStore({
  reducer: {
    favs: favsSliceReducer,
    user: userSliceReducer,
    participants: participantsSliceReducer,
    modal: modalSliceReducer,
    wyre: wyreSliceReducer,
    leaderboard: leaderboardSliceReducer,
    follow: followSliceReducer,
    usage: usageSliceReducer,
    fanMatch: fanMatchSliceReducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AsyncThunkConfig = {
  state: RootState,
  dispatch: AppDispatch;
};

export default store;
