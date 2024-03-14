import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  FanMatchEntity,
  Mutation as GraphqlMutation,
  Query as GraphqlQuery
} from "../../../../generated-graphql/graphql";
import {
  FavInfo,
  Query as SubgraphQuery
} from "../../../../generated-subgraph/graphql";

import dayjs from "dayjs";
import { Maybe } from "graphql/jsutils/Maybe";
import {
  ApolloActionType,
  ClientType,
  apolloClient
} from "../../clients/apolloClient";
import {
  generateFavInfo24,
  generateFavInfoWhenFanMatchStarted,
  generateFetchFanCountsQuery,
  generateFetchInvestorsQuery
} from "../../../core/graphql-queries/subgraph-queries/favInfo.query";
import { extractFavStatisticsInfo } from "../../../core/util/base.util";
import { Unit, formatNumber } from "../../../core/util/string.util";
import { DEFAULT_POOL_SIZE } from "../../constants/base.const";
import { generateFanMatchToggleLikeMutation } from "../../graphql-queries/backend-queries/fanMatches.mutation";
import { generateFindAllFanMatchesQuery } from "../../graphql-queries/backend-queries/fanMatches.query";
import {
  IFanMatchStats,
  IFanMatchStatsData,
  IUserMatchStatus
} from "../../interfaces/fanMatch.type";
import { AsyncThunkConfig } from "../store";

interface FanMatchSlice {
  userStatus: IUserMatchStatus;
  endedMatchResult: [number, number];
  favInfo24: [Maybe<FavInfo>, Maybe<FavInfo>];
  loadingFanMatchesList: boolean;
  fanMatchesList: Array<FanMatchEntity>;
  loadingFanMatchStatsData: boolean;
  statsData: IFanMatchStatsData;
  liveMatchResults: [number, number];
}

const initialState = {
  userStatus: {
    started: false,
    step: 0
  },
  endedMatchResult: [5, 2],
  loadingFanMatchStatsData: false,
  loadingFanMatchesList: false,
  fanMatchesList: [],
  statsData: {
    first: {},
    second: {}
  },
  favInfo24: [{}, {}],
  liveMatchResults: [0, 0]
} as unknown as FanMatchSlice;

export const loadAllFanMatches = createAsyncThunk<
  Array<FanMatchEntity>,
  string | undefined,
  AsyncThunkConfig
>("fanMatch/loadAllFanMatches", async (address, { dispatch, getState }) => {
  const { findAllFanMatch }: GraphqlQuery = await apolloClient(
    ClientType.GRAPHQL,
    ApolloActionType.QUERY,
    generateFindAllFanMatchesQuery(address)
  );

  // const thisModay = dayjs().startOf("week");

  // const endedMatch = findAllFanMatch.data
  //   .filter((match) =>
  //     match.expiredAt ? dayjs(match.expiredAt).isBefore(thisModay) : true
  //   )
  //   .sort((a, b) =>
  //     (b.expiredAt ? dayjs(b.expiredAt) : dayjs("2022-01-01")).diff(
  //       a.expiredAt ? dayjs(a.expiredAt) : dayjs("2022-01-01")
  //     )
  //   )[0];

  // const coming5Matches = findAllFanMatch.data
  //   .filter((match) =>
  //     match.expiredAt ? dayjs(match.expiredAt).isAfter(thisModay) : true
  //   )
  //   .sort((a, b) =>
  //     (a.expiredAt ? dayjs(a.expiredAt) : dayjs("2022-01-01")).diff(
  //       b.expiredAt ? dayjs(b.expiredAt) : dayjs("2022-01-01")
  //     )
  //   )
  //   .slice(0, 5);

  // const fanMatches = [endedMatch, ...coming5Matches];
  if (getState().fanMatch.fanMatchesList.length === 0) {
    dispatch(
      loadFanMatchStatsData({
        firstFavId: findAllFanMatch.data[0].leftFav.id,
        secondFavId: findAllFanMatch.data[0].rightFav.id
      })
    );
  }

  return findAllFanMatch.data;
});

export const toggleFanMatchLikesInfo = createAsyncThunk<
  void,
  {
    fanMatchId: string;
  },
  AsyncThunkConfig
>(
  "fanMatch/toggleFanMatchLikesInfo",
  async ({ fanMatchId }, { dispatch, getState }) => {
    const { toggleLikeFanMatch }: GraphqlMutation = await apolloClient(
      ClientType.GRAPHQL,
      ApolloActionType.MUTATE,
      generateFanMatchToggleLikeMutation(fanMatchId)
    );
    if (toggleLikeFanMatch.success) {
      const address = getState().user.profile.address;
      dispatch(loadAllFanMatches(address));
    }
    return;
  }
);

export const loadFanMatchStatsData = createAsyncThunk<
  void,
  { firstFavId: number; secondFavId: number; },
  AsyncThunkConfig
>(
  "fanMatch/loadFanMatchStatsData",
  async ({ firstFavId, secondFavId }, { dispatch, getState }) => {
    const { shareAssets: firstShareAssets }: SubgraphQuery = await apolloClient(
      ClientType.SUBGRAPH,
      ApolloActionType.QUERY,
      generateFetchInvestorsQuery(firstFavId)
    );
    const { shareAssets: secondShareAssets }: SubgraphQuery =
      await apolloClient(
        ClientType.SUBGRAPH,
        ApolloActionType.QUERY,
        generateFetchInvestorsQuery(secondFavId)
      );
    const { fanCount: firstFanCount }: GraphqlQuery = await apolloClient(
      ClientType.GRAPHQL,
      ApolloActionType.QUERY,
      generateFetchFanCountsQuery(firstFavId)
    );
    const { fanCount: secondFanCount }: GraphqlQuery = await apolloClient(
      ClientType.GRAPHQL,
      ApolloActionType.QUERY,
      generateFetchFanCountsQuery(secondFavId)
    );

    const multiFavsInfo = getState().favs.multiFavsInfo;
    const statsData = getState().fanMatch.statsData;

    const {
      data: firstFavInfo,
      isIPO: isFirstFavIPO,
      marketCap: firstMarketCap,
      marketPriceDeltaPercent: firstMarketPriceDelta
    } = extractFavStatisticsInfo(multiFavsInfo, firstFavId);
    const {
      data: secondFavInfo,
      isIPO: isSecondFavIPO,
      marketCap: secondMarketCap,
      marketPriceDeltaPercent: secondMarketPriceDelta
    } = extractFavStatisticsInfo(multiFavsInfo, secondFavId);

    const {
      favInfos: [firstFavInfo24]
    }: SubgraphQuery = await apolloClient(
      ClientType.SUBGRAPH,
      ApolloActionType.QUERY,
      await generateFavInfo24(firstFavId)
    );

    const {
      favInfos: [secondFavInfo24]
    }: SubgraphQuery = await apolloClient(
      ClientType.SUBGRAPH,
      ApolloActionType.QUERY,
      await generateFavInfo24(secondFavId)
    );

    const {
      favInfos: [firstFavInfoWhenFanMatchStarted]
    }: SubgraphQuery = await apolloClient(
      ClientType.SUBGRAPH,
      ApolloActionType.QUERY,
      await generateFavInfoWhenFanMatchStarted(firstFavId)
    );

    const {
      favInfos: [secondFavInfoWhenFanMatchStarted]
    }: SubgraphQuery = await apolloClient(
      ClientType.SUBGRAPH,
      ApolloActionType.QUERY,
      await generateFavInfoWhenFanMatchStarted(secondFavId)
    );

    const firstFavEquity = isFirstFavIPO
      ? (+firstFavInfo?.volume).toFixed(2)
      : (
        (+firstFavInfo?.marketPrice || 1) *
        (DEFAULT_POOL_SIZE - +firstFavInfo?.amountInPool)
      ).toFixed(2);
    const secondFavEquity = isSecondFavIPO
      ? (+secondFavInfo?.volume).toFixed(2)
      : (
        (+secondFavInfo?.marketPrice || 1) *
        (DEFAULT_POOL_SIZE - +secondFavInfo?.amountInPool)
      ).toFixed(2);

    const isFirstFav24IPO = +firstFavInfo24?.ipoEndTime > dayjs().unix();
    const isSecondFav24IPO = +secondFavInfo24?.ipoEndTime > dayjs().unix();

    const firstFavEquity24 = isFirstFav24IPO
      ? (+firstFavInfo24?.volume).toFixed(2)
      : (
        ((+firstFavInfo24?.marketPrice || 1) *
          (DEFAULT_POOL_SIZE - +firstFavInfo24?.amountInPool)) /
        100000000
      ).toFixed(2);
    const secondFavEquity24 = isSecondFav24IPO
      ? (+secondFavInfo24?.volume).toFixed(2)
      : (
        ((+secondFavInfo24?.marketPrice || 1) *
          (DEFAULT_POOL_SIZE - +secondFavInfo24?.amountInPool)) /
        100000000
      ).toFixed(2);

    const firstFavTodaysReturn = +firstFavEquity - +firstFavEquity24;
    const secondFavTodaysReturn = +secondFavEquity - +secondFavEquity24;
    const newStatsData = {
      first: {
        ...statsData.first,
        pps: +formatNumber({
          value: firstFavInfo?.marketPrice || 1,
          unit: Unit.USDC,
          summarize: false,
          withUnit: false,
          decimalToFixed: 8
        }),
        numberOfInvestors: firstShareAssets.length,
        numberOfFans: firstFanCount,
        marketCap: firstMarketCap,
        delta: firstMarketPriceDelta,
        shareVolume:
          firstFavInfo?.volume - firstFavInfoWhenFanMatchStarted?.volume,
        usdcVolume:
          firstFavInfo?.volumeUSDC -
          firstFavInfoWhenFanMatchStarted?.volumeUSDC / 100000000,
        equity: +firstFavEquity,
        todaysReturn: firstFavTodaysReturn,
        totalReturn: Math.max(+firstFavEquity - +firstFavInfo?.totalCost, 0)
      },
      second: {
        ...statsData.second,
        pps: +formatNumber({
          value: secondFavInfo?.marketPrice || 1,
          unit: Unit.USDC,
          summarize: false,
          withUnit: false,
          decimalToFixed: 8
        }),
        numberOfInvestors: secondShareAssets.length,
        numberOfFans: secondFanCount,
        marketCap: secondMarketCap,
        delta: secondMarketPriceDelta,
        shareVolume:
          secondFavInfo?.volume - secondFavInfoWhenFanMatchStarted?.volume,
        usdcVolume:
          secondFavInfo?.volumeUSDC -
          secondFavInfoWhenFanMatchStarted?.volumeUSDC / 100000000,
        equity: +secondFavEquity,
        todaysReturn: secondFavTodaysReturn,
        totalReturn: Math.max(+secondFavEquity - +secondFavInfo?.totalCost, 0)
      }
    };

    const tmpLiveMatchResults: [number, number] = [0, 0];
    type Key = keyof IFanMatchStats;
    Object.keys(newStatsData.first).forEach((key: string) => {
      const isFirstWinner =
        newStatsData.first[key as Key] > newStatsData.second[key as Key];
      const isSecondWinner =
        newStatsData.second[key as Key] > newStatsData.first[key as Key];
      if (isFirstWinner || isSecondWinner) {
        tmpLiveMatchResults[isFirstWinner ? 0 : 1]++;
      }
    });

    dispatch(
      updateHistoricalFavInfoOnlyOneDay([firstFavInfo24, secondFavInfo24])
    );
    dispatch(updateStatsDataAction(newStatsData));
    dispatch(updateLiveMatchResultsAction(tmpLiveMatchResults));
  }
);

const fanMatchSlice = createSlice({
  name: "fanMatch",
  initialState,
  reducers: {
    updateLiveMatchResultsAction(
      state,
      { payload }: PayloadAction<[number, number]>
    ) {
      state.liveMatchResults = payload;
    },
    updateStatsDataAction(
      state,
      { payload }: PayloadAction<IFanMatchStatsData>
    ) {
      state.statsData = payload;
    },
    updateHistoricalFavInfoOnlyOneDay(
      state,
      { payload }: PayloadAction<[Maybe<FavInfo>, Maybe<FavInfo>]>
    ) {
      state.favInfo24 = payload;
    },
    updateFanMatchesListAction(
      state,
      { payload }: PayloadAction<Array<FanMatchEntity>>
    ) {
      state.fanMatchesList = payload;
    },
    updateUserMatchStatusAction(state, { payload }: PayloadAction<IUserMatchStatus>) {
      state.userStatus = payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadAllFanMatches.pending, (state) => {
        if (state.fanMatchesList.length === 0) {
          state.loadingFanMatchesList = true;
        }
      })
      .addCase(
        loadAllFanMatches.fulfilled,
        (state, { payload }: PayloadAction<FanMatchEntity[]>) => {
          state.fanMatchesList = payload;
          state.loadingFanMatchesList = false;
        }
      )
      .addCase(loadAllFanMatches.rejected, (state, { error }) => {
        state.loadingFanMatchesList = false;
        console.error("loadAllFanMatches rejected", error);
      })
      .addCase(loadFanMatchStatsData.pending, (state) => {
        state.loadingFanMatchStatsData = true;
      })
      .addCase(loadFanMatchStatsData.fulfilled, (state) => {
        state.loadingFanMatchStatsData = false;
      })
      .addCase(loadFanMatchStatsData.rejected, (state) => {
        state.loadingFanMatchStatsData = false;
        console.error("loadAllFanMatches rejected");
      })

      // toggle FanMatchLikes info
      .addCase(toggleFanMatchLikesInfo.rejected, (_state, { error }) => {
        console.error(error.name, error.message, error.stack);
      });
  }
});

export const {
  updateLiveMatchResultsAction,
  updateStatsDataAction,
  updateHistoricalFavInfoOnlyOneDay,
  updateUserMatchStatusAction
} = fanMatchSlice.actions;

export default fanMatchSlice.reducer;
