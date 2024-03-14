import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import dayjs from "dayjs";

import { Mutation as GraphqlMutation, Query as GraphqlQuery, UserEntity } from "../../../../generated-graphql/graphql";
import { Query as SubgraphQuery, UserInfo } from "../../../../generated-subgraph/graphql";
import {
  ApolloActionType,
  apolloClient,
  ClientType
} from "../../clients/apolloClient";
import { oceanaShareExContract } from "../../constants/contract";
import { League } from "../../enums/league.enum";
import { generateFollowMutation, generateUnfollowMutation } from "../../graphql-queries/backend-queries/follow.mutation";
import { generateFindFollowersQuery, generateFindFollowingsQuery } from "../../graphql-queries/backend-queries/follow.query";
import { generateFindAllUsersQuery } from "../../graphql-queries/backend-queries/users.query";
import {
  generateHoldingStocksListOfFansQuery,
  generateParticipantsInfoQuery,
  generateTimeTravelParticipantsInfoQuery, ParticipantsInfo
} from "../../graphql-queries/subgraph-queries/participantsInfo.query";
import { boundObject } from "../../util/base.util";
import { findLeagueFromProfile } from "../../util/league.util";
import {
  getBlocksFromTimestamps,
  getDeltaTimestamps
} from "../../util/queries.util";
import { formatUserDisplay, toUSDC } from "../../util/string.util";
import { AsyncThunkConfig } from "../store";

export type ParticipantInfo = {
  profile: UserEntity;
  league: League;
  displayName: string;
  rank: number;
  equity: number;
  equityDeltaPercent: number;
  stocksIdList: Array<number>;
  isFollowing: boolean;
  isFollower: boolean;
};

export type ParticipantsInfoByAddress = {
  [address: string]: ParticipantInfo;
};

interface ParticipantsSlice {
  loadingParticipantsData: boolean;
  loadingFollowingsAddress: boolean;
  loadingFollowersAddress: boolean;
  participantsData: Array<ParticipantInfo>;
  participantsInfoByAddress: ParticipantsInfoByAddress;
}

const initialState = {
  loadingParticipantsData: false,
  loadingFollowingsAddress: false,
  loadingFollowersAddress: false,
  participantsData: [],
  participantsInfoByAddress: {},
} as ParticipantsSlice;

export const loadParticipantsInfo = createAsyncThunk(
  "participants/loadParticipantsInfo",
  async () => {
    const [t24] = getDeltaTimestamps();
    const blocks = await getBlocksFromTimestamps([t24]);
    const [block24] = blocks ?? [];

    const blockNumber = block24
      ? Math.max(+block24.number, oceanaShareExContract.deployedBlockNumber)
      : oceanaShareExContract.deployedBlockNumber;
    const participantsInfo: ParticipantsInfo = {
      current: (
        await apolloClient(
          ClientType.SUBGRAPH,
          ApolloActionType.QUERY,
          generateParticipantsInfoQuery()
        )
      ).userInfos,
      oneDay: (
        await apolloClient(
          ClientType.SUBGRAPH,
          ApolloActionType.QUERY,
          generateTimeTravelParticipantsInfoQuery(blockNumber)
        )
      ).userInfos,
    };

    const { findAllUser: profilesData }: GraphqlQuery = await apolloClient(
      ClientType.GRAPHQL,
      ApolloActionType.QUERY,
      generateFindAllUsersQuery()
    );

    let participantsData: Array<ParticipantInfo> = [];
    const participantsInfoByAddress: {
      [address: string]: ParticipantInfo;
    } = {};

    const data = Object.assign({}, participantsInfo);

    const currentUnixTimestamp = dayjs().unix();
    const oneDayAgoUnixTimestamp = dayjs().subtract(1, "day").unix();

    try {
      if (Object.keys(data).length > 0) {
        const profilesDataByAddress: {
          [address: string]: UserEntity;
        } = {};

        profilesData?.map((o) => {
          profilesDataByAddress[o.address] = {
            ...o,
            createdAt: dayjs(o.createdAt).valueOf(),
          };
        });

        data.current?.map((userInfo, idx) => {
          if (profilesDataByAddress[userInfo.id]) {
            let equity = 0;
            let equity24 = 0;

            const currObj = Object.assign({}, userInfo);
            const parsed24 = Object.assign({}, data.oneDay[idx]);
            currObj.shareAssets.map((o) => {
              const isIPO = o.favInfo.ipoEndTime > currentUnixTimestamp;
              const price = toUSDC(
                isIPO ? o.favInfo.ipoPrice : o.favInfo.marketPrice
              );
              equity += price * o.amount;
            });

            parsed24?.shareAssets?.map((o) => {
              const isIPO = o.favInfo.ipoEndTime > oneDayAgoUnixTimestamp;
              const price = toUSDC(
                isIPO ? o.favInfo.ipoPrice : o.favInfo.marketPrice
              );
              equity24 += price * o.amount;
            });
            const equityDeltaPercent =
              equity24 === 0 ? 0 : ((equity - equity24) / equity24) * 100;


            participantsInfoByAddress[userInfo.id] = {
              profile: profilesDataByAddress[userInfo.id],
              league: findLeagueFromProfile(profilesDataByAddress[userInfo.id]),
              displayName: formatUserDisplay(
                profilesDataByAddress[userInfo.id]?.address || "",
                profilesDataByAddress[userInfo.id]?.fullName || ""
              ),
              rank: 0,
              equity,
              equityDeltaPercent,
              stocksIdList: [],
              isFollower: false,
              isFollowing: false
            };
          }
        });

        profilesData.map(profileData => {
          const address = profileData.address;
          if (!participantsInfoByAddress[address]) {
            const profile = profilesDataByAddress[address];
            participantsInfoByAddress[address] = {
              profile: profile,
              league: findLeagueFromProfile(profile),
              displayName: formatUserDisplay(profile.address, profile.fullName as string),
              rank: 0,
              equity: 0,
              equityDeltaPercent: 0,
              stocksIdList: [],
              isFollower: false,
              isFollowing: false
            };
          }
        });

        participantsData = Object.entries(participantsInfoByAddress)
          .sort((a, b) => b[1].equity - a[1].equity)
          .map((tuple, index) => {
            tuple[1].rank = index + 1;

            return {
              ...tuple[1],
              rank: index + 1
            };
          });
      }
    }
    catch (e) {
      console.error(e);
    }

    return { participantsData, participantsInfoByAddress };
  }
);

export const loadFollowersAddress = createAsyncThunk<Array<string>, string, AsyncThunkConfig>(
  "participants/loadFollowersAddress",
  async (address) => {
    const { findFollowers }: GraphqlQuery = await apolloClient(
      ClientType.GRAPHQL,
      ApolloActionType.QUERY,
      generateFindFollowersQuery(address)
    );

    return findFollowers.map(userEntity => userEntity.address);
  }
);

export const loadFollowingsAddress = createAsyncThunk<Array<string>, string, AsyncThunkConfig>(
  "participants/loadFollowingsAddress",
  async (address) => {
    const { findFollowings }: GraphqlQuery = await apolloClient(
      ClientType.GRAPHQL,
      ApolloActionType.QUERY,
      generateFindFollowingsQuery(address)
    );

    return findFollowings.map(userEntity => userEntity.address);
  }
);

export const loadHoldingStocksListOfFansQuery = createAsyncThunk<void, void, AsyncThunkConfig>(
  "participants/generateHoldingStocksListOfFansQuery",
  async (_, { dispatch }) => {
    const { userInfos }: SubgraphQuery = await apolloClient(
      ClientType.SUBGRAPH,
      ApolloActionType.QUERY,
      generateHoldingStocksListOfFansQuery()
    );

    dispatch(updateStocksIdListAction(userInfos));
  }
);

export const follow = createAsyncThunk<string, string, AsyncThunkConfig>(
  "participants/follow",
  async (address) => {
    const { follow }: GraphqlMutation = await apolloClient(
      ClientType.GRAPHQL,
      ApolloActionType.MUTATE,
      generateFollowMutation(address)
    );

    return follow.success ? address : "";
  }
);

export const unfollow = createAsyncThunk<string, string, AsyncThunkConfig>(
  "participants/unfollow",
  async (address) => {
    const { unfollow }: GraphqlMutation = await apolloClient(
      ClientType.GRAPHQL,
      ApolloActionType.MUTATE,
      generateUnfollowMutation(address)
    );

    return unfollow.success ? address : "";
  }
);

const participantsSlice = createSlice({
  name: "participants",
  initialState,
  reducers: {
    updateParticipantsInfo(state, action) {
      boundObject(state, action.payload);
    },
    updateOneParticipant(state, { payload }: PayloadAction<UserEntity>) {
      const newParticipantsData = state.participantsData.map((o) => {
        if (o.profile.address === payload.address) {
          return {
            ...o,
            profile: payload,
            displayName: formatUserDisplay(payload.address, payload.fullName as string),
            league: findLeagueFromProfile(payload)
          };
        }
        return o;
      });
      state.participantsData = newParticipantsData.sort((a, b) => b.equity - a.equity);
      state.participantsInfoByAddress[payload.address] = {
        ...state.participantsInfoByAddress[payload.address],
        profile: payload,
        displayName: formatUserDisplay(payload.address, payload.fullName as string),
        league: findLeagueFromProfile(payload)
      };
    },
    updateStocksIdListAction(state, action: PayloadAction<Array<UserInfo>>) {
      action.payload.map(userInfo => {
        if (state.participantsInfoByAddress[userInfo.id]) {
          state.participantsInfoByAddress[userInfo.id].stocksIdList =
            userInfo.shareAssets
              .filter(a => a.amount > 0)
              .map(o => +o.favInfo.id);
        }
      });

      state.participantsData = Object.values(state.participantsInfoByAddress)
        .sort((a, b) => b.equity - a.equity);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadParticipantsInfo.pending, (state) => {
        state.loadingParticipantsData = true;
      })
      .addCase(loadParticipantsInfo.fulfilled, (state, action) => {
        boundObject(state, action.payload);
        state.loadingParticipantsData = false;
      })
      .addCase(loadParticipantsInfo.rejected, (state, { error }) => {
        state.loadingParticipantsData = false;
        console.error(error.name, error.message, error.stack);
      })

      // load followers address
      .addCase(loadFollowersAddress.pending, (state) => {
        state.loadingFollowersAddress = true;
      })
      .addCase(loadFollowersAddress.fulfilled, (state, action) => {
        state.participantsData.map(data => {
          if (data.profile?.address) {
            const isFollower = action.payload.includes(data.profile.address);
            data.isFollower = isFollower;
            state.participantsInfoByAddress[data.profile.address].isFollower = isFollower;
          }
        });
        state.loadingFollowersAddress = false;
      })
      .addCase(loadFollowersAddress.rejected, (state, { error }) => {
        state.loadingFollowersAddress = false;
        console.error(error.name, error.message, error.stack);
      })

      // load followings address
      .addCase(loadFollowingsAddress.pending, (state) => {
        state.loadingFollowingsAddress = true;
      })
      .addCase(loadFollowingsAddress.fulfilled, (state, action) => {
        state.participantsData.map(data => {
          if (data.profile?.address) {
            const isFollowing = action.payload.includes(data.profile.address);
            data.isFollowing = isFollowing;
            state.participantsInfoByAddress[data.profile.address].isFollowing = isFollowing;
          }
        });
        state.loadingFollowingsAddress = false;
      })
      .addCase(loadFollowingsAddress.rejected, (state, { error }) => {
        console.error(error.name, error.message, error.stack);
        state.loadingFollowingsAddress = false;
      })

      // follow
      .addCase(follow.fulfilled, (state, action) => {
        const address = action.payload;
        if (address) {
          state.participantsInfoByAddress[address].isFollowing = true;
          state.participantsData = Object.values(state.participantsInfoByAddress).sort((a, b) => b.equity - a.equity);
        }
      })
      .addCase(follow.rejected, (_state, { error }) => {
        console.error(error.name, error.message, error.stack);
      })

      // unfollow
      .addCase(unfollow.fulfilled, (state, action) => {
        const address = action.payload;
        if (address) {
          state.participantsInfoByAddress[address].isFollowing = false;
          state.participantsData = Object.values(state.participantsInfoByAddress).sort((a, b) => b.equity - a.equity);
        }
      })
      .addCase(unfollow.rejected, (_state, { error }) => {
        console.error(error.name, error.message, error.stack);
      });
  },
});

export const { updateParticipantsInfo, updateOneParticipant, updateStocksIdListAction } =
  participantsSlice.actions;

export default participantsSlice.reducer;
