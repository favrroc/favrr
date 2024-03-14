import { NetworkStatus } from "@apollo/client";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import dayjs from "dayjs";

import { Mutation as GraphqlMutation, Query as GraphqlQuery, LimitOrderEntity, LimitOrderInput, LimitOrderStatus, LimitOrderType, NotificationInput, NotificationStatus, UserEntity } from "../../../../generated-graphql/graphql";
import { OrderType, Stage, Query as SubgraphQuery, UserInfo } from "../../../../generated-subgraph/graphql";
import { uploadImageFile } from "../../../api/upload";
import { ApolloActionType, apolloClient, ClientType } from "../../clients/apolloClient";
import { oceanaShareExContract } from "../../constants/contract";
import { League } from "../../enums/league.enum";
import { generateCreateLimitOrderMutation, generateCreateRejectedOrderMutation, generateUpdateLimitOrderMutation } from "../../graphql-queries/backend-queries/limitOrder.mutation";
import { generateFindAllLimitOrdersByAddressQuery } from "../../graphql-queries/backend-queries/limitOrders.query";
import { generateCreateNotificationMutation, generateUpdateNotificationMutation } from "../../graphql-queries/backend-queries/notification.mutation";
import { generateNotificationsStatusQuery } from "../../graphql-queries/backend-queries/notificationsStatus.query";
import { generateUpdateProfileMutation } from "../../graphql-queries/backend-queries/profile.mutation";
import { generateWeb3UserMutation } from "../../graphql-queries/backend-queries/web3Login.mutation";
import { generateBlockchainHistoriesByAddressQuery } from "../../graphql-queries/subgraph-queries/blockchainHistories.query";
import { generateHistoricalUserInfoOnlyOneDayQuery, generateHistoricalUserInfoQuery, generateUserInfoQuery, HistoricalUserInfo } from "../../graphql-queries/subgraph-queries/userInfo.query";
import { FilteredBlockchainHistory } from "../../interfaces/transaction.type";
import { NotificationStatusByTxHash, UserInfoHistory } from "../../interfaces/user.type";
import { boundObject } from "../../util/base.util";
import { findLeagueFromProfile } from "../../util/league.util";
import { toUSDC } from "../../util/string.util";
import { AsyncThunkConfig } from "../store";
import { addLimitOrderThunk, removeLimitOrderThunk } from "./favsSlice";
import { updateOneParticipant } from "./participantsSlice";
import { StorageKeys } from "../../constants/base.const";

interface UserSlice {
  loading: boolean;

  // user profile
  loadingProfile: boolean;

  // historical user info
  loadingHistoricalUserInfo: boolean;
  historicalUserInfo: UserInfoHistory | undefined;

  // 24h historical user info
  historicalUserInfoOnlyOneDay: UserInfoHistory | undefined;

  userTransactions: FilteredBlockchainHistory[]; // Contains blockchain transactions and limit orders
  fulfilledLimitOrderTxHashMap: { [txHash: string]: 1; };

  // notification data
  notificationStatusByTxHash: NotificationStatusByTxHash;
  hasUnreadNotifications: boolean;

  // my stocks
  historyFavIds: number[];

  networkStatus: NetworkStatus;

  // subgraph user info
  userInfo: UserInfo | undefined;

  // user profile data
  isLoggedIn: boolean;
  profile: UserEntity;

  // league information
  league: League;

  isFetchingUSDCBalance: boolean;
  usdcBalance: number;
}

const initialState = {
  loading: false,
  loadingProfile: false,
  loadingHistoricalUserInfo: false,
  historicalUserInfo: undefined,
  historicalUserInfoOnlyOneDay: undefined,
  userTransactions: [],
  fulfilledLimitOrderTxHashMap: {},
  historyFavIds: [],
  networkStatus: NetworkStatus.loading,
  notificationStatusByTxHash: {},
  hasUnreadNotifications: false,
  userInfo: undefined,
  isLoggedIn: false,
  profile: {
    address: "",
    gender: "",
    id: ""
  },
  league: League.Microbe,
  isFetchingUSDCBalance: false,
  usdcBalance: 0,
} as UserSlice;

export const web3Login = createAsyncThunk(
  "user/web3Login",
  async (address: string) => {
    const { login }: GraphqlMutation = await apolloClient(ClientType.GRAPHQL, ApolloActionType.MUTATE, generateWeb3UserMutation(address));
    return login;
  }
);

export const loadUserTransactions = createAsyncThunk(
  "user/loadUserTransactions",
  async (address: string) => {
    if (!address) {
      return;
    }
    const { blockchainHistories }: SubgraphQuery = await apolloClient(ClientType.SUBGRAPH, ApolloActionType.QUERY, generateBlockchainHistoriesByAddressQuery(address));
    if (!blockchainHistories) {
      return;
    }

    const filteredBlockchainHistory = blockchainHistories.map(o => {
      const obj = Object.assign({}, { ...o, status: LimitOrderStatus.Fulfilled });
      obj.pps = toUSDC(obj.pps);
      obj.ppsBefore = toUSDC(obj.ppsBefore);
      obj.createdAt = typeof obj.createdAt === "string" ? +obj.createdAt * 1000 : obj.createdAt;
      return obj;
    }) as FilteredBlockchainHistory[];

    const historyFavIds: number[] = [];

    filteredBlockchainHistory.map(o => {
      if (!historyFavIds.includes(o.favId)) {
        historyFavIds.push(o.favId);
      }
    }
    );

    const { findAllLimitOrder: response }: GraphqlQuery = await apolloClient(ClientType.GRAPHQL, ApolloActionType.QUERY, generateFindAllLimitOrdersByAddressQuery({ address }));

    const [limitOrdersByAddress, fulfilledLimitOrders] = response.data.reduce((tuple: [Array<LimitOrderEntity>, Array<LimitOrderEntity>], next) => {
      tuple[next.status === LimitOrderStatus.Fulfilled && next.txHash ? 1 : 0].push(next);
      return tuple;
    }, [[], []]);

    const limitOrderHistories = limitOrdersByAddress.map(o => {
      return {
        id: o.id,
        address: o.user.address,
        createdAt: dayjs(o.updatedAt).valueOf(),
        favId: o.fav.id,
        amount: o.amount,
        stage: o.stage || Stage.Limit,
        type: o.type == LimitOrderType.Buy ? OrderType.Buy : OrderType.Sell,
        pps: toUSDC(o.price?.toString()),
        ppsBefore: toUSDC(o.price?.toString()),
        status: o.status
      } as FilteredBlockchainHistory;
    });

    const userTransactions = limitOrderHistories.concat(filteredBlockchainHistory).sort((a, b) => +b.createdAt - +a.createdAt);

    return { historyFavIds, userTransactions, fulfilledLimitOrders };
  }
);

export const createNotification = createAsyncThunk(
  "user/createNotification",
  async (props: NotificationInput) => {
    const { txHash, address } = props;

    await apolloClient(ClientType.GRAPHQL, ApolloActionType.MUTATE, generateCreateNotificationMutation(txHash, address, NotificationStatus.Unread));
    return { txHash };
  }
);

export const updateNotification = createAsyncThunk(
  "user/updateNotification",
  async (props: NotificationInput) => {
    const { txHash, address } = props;

    await apolloClient(ClientType.GRAPHQL, ApolloActionType.MUTATE, generateUpdateNotificationMutation(txHash, address));
    return { txHash };
  }
);

export const loadNotificationsStatus = createAsyncThunk(
  "user/loadNotificationsStatus",
  async (address: string) => {
    if (!address) {
      return;
    }
    const { findAllNotification }: GraphqlQuery = await apolloClient(ClientType.GRAPHQL, ApolloActionType.QUERY, generateNotificationsStatusQuery(address));
    if (!findAllNotification) {
      return;
    }

    const notificationStatusByTxHash: NotificationStatusByTxHash = {};
    findAllNotification.map(o => {
      notificationStatusByTxHash[o.txHash] = o.status;
    });

    return { notificationStatusByTxHash };
  }
);

export const loadUserInfo = createAsyncThunk(
  "user/loadUserInfo",
  async (address: string) => {
    if (!address) {
      return;
    }
    const { userInfo }: SubgraphQuery = await apolloClient(ClientType.SUBGRAPH, ApolloActionType.QUERY, generateUserInfoQuery(address));

    return { userInfo };
  }
);

export const loadHistoricalUserInfo = createAsyncThunk(
  "user/loadHistoricalUserInfo",
  async (address: string) => {
    const historicalUserInfoOnlyOneDay: HistoricalUserInfo = await apolloClient(ClientType.SUBGRAPH, ApolloActionType.QUERY, await generateHistoricalUserInfoOnlyOneDayQuery(address));
    const historicalUserInfo: HistoricalUserInfo = await apolloClient(ClientType.SUBGRAPH, ApolloActionType.QUERY, await generateHistoricalUserInfoQuery(address));

    return { historicalUserInfo, historicalUserInfoOnlyOneDay };
  }
);

export const createLimitOrder = createAsyncThunk<FilteredBlockchainHistory, LimitOrderInput, AsyncThunkConfig>(
  "user/createLimitOrder",
  async (props, { dispatch, getState }) => {
    const { favId, type, price: blockchainPrice, amount } = props;

    const price: number = (blockchainPrice || 0) / 10 ** oceanaShareExContract.decimals;

    const { createLimitOrder }: GraphqlMutation = await apolloClient(ClientType.GRAPHQL, ApolloActionType.MUTATE, generateCreateLimitOrderMutation({
      favId: favId as number,
      type: type as LimitOrderType,
      status: LimitOrderStatus.Opened,
      price: blockchainPrice as number,
      amount: amount as number
    }));

    // add limit order to the store
    dispatch(addLimitOrderThunk(createLimitOrder));

    return {
      id: createLimitOrder.id,
      address: getState().user.profile.address,
      createdAt: new Date().getTime(),
      favId,
      amount,
      stage: Stage.Limit,
      type: type === LimitOrderType.Buy ? OrderType.Buy : OrderType.Sell,
      pps: price,
      ppsBefore: price,
      status: LimitOrderStatus.Opened,
    } as FilteredBlockchainHistory;
  }
);

export const createRejectedOrder = createAsyncThunk<FilteredBlockchainHistory, { stage: Stage; } & LimitOrderInput, AsyncThunkConfig>(
  "user/createRejectedOrder",
  async (props, { getState }) => {
    const { favId, type, price: blockchainPrice, amount, stage } = props;

    const price: number = (blockchainPrice || 0) / 10 ** oceanaShareExContract.decimals;

    const { createLimitOrder: rejectedOrderEntity }: GraphqlMutation = await apolloClient(ClientType.GRAPHQL, ApolloActionType.MUTATE, generateCreateRejectedOrderMutation({
      favId: favId as number,
      type: type as LimitOrderType,
      status: LimitOrderStatus.Rejected,
      price: blockchainPrice as number,
      amount: amount as number,
      stage: stage
    }));

    return {
      id: rejectedOrderEntity.id,
      address: getState().user.profile.address,
      createdAt: new Date().getTime(),
      favId,
      amount,
      stage: stage,
      type: type === LimitOrderType.Buy ? OrderType.Buy : OrderType.Sell,
      pps: price,
      ppsBefore: price,
      status: LimitOrderStatus.Rejected,
    } as FilteredBlockchainHistory;
  }
);

export const withdrawLimitOrder = createAsyncThunk<LimitOrderEntity, LimitOrderInput, AsyncThunkConfig>(
  "user/withdrawLimitOrder",
  async (props, { dispatch }) => {
    const { id, favId, type, price, amount } = props;

    const { updateLimitOrder }: GraphqlMutation = await apolloClient(ClientType.GRAPHQL, ApolloActionType.MUTATE, generateUpdateLimitOrderMutation({
      id: id as string,
      favId: favId as number,
      type: type as LimitOrderType,
      status: LimitOrderStatus.Cancelled,
      price: price as number,
      amount: amount as number
    }));

    // remove limit order from the store
    dispatch(removeLimitOrderThunk(updateLimitOrder));

    return updateLimitOrder;
  }
);

export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async (props: UserEntity) => {
    const { updateUser }: GraphqlMutation = await apolloClient(ClientType.GRAPHQL, ApolloActionType.MUTATE, generateUpdateProfileMutation(props));
    return updateUser;
  }
);

export const updateUserImagesFromFile = createAsyncThunk<void, { profileImageFile?: File | null, bannerImageFile?: File | null; }, AsyncThunkConfig>(
  "user/updateUserImageFromFile",
  async ({ profileImageFile, bannerImageFile }, { getState, dispatch }) => {
    try {
      const profile = getState().user.profile;
      let profileImageUrl = profile.profileImageUrl || "";
      let bannerImageUrl = profile.bannerImageUrl || "";
      const fullName = profile.fullName || "";
      const bio = profile.bio || "";
      const email = profile.email || "";
      if (profileImageFile) {
        profileImageUrl = await uploadImageFile(profileImageFile);
      }
      if (bannerImageFile) {
        bannerImageUrl = await uploadImageFile(bannerImageFile);
      }
      console.log(320, profile);
      const newProfile: UserEntity = {
        ...profile,
        profileImageUrl,
        bannerImageUrl,
        fullName,
        bio,
        email,
      };
      dispatch(updateUserProfile(newProfile));
      dispatch(updateOneParticipant(newProfile));
    } catch (error) {
      console.log("Error: ", error);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUserInfo(state, action) {
      boundObject(state, action.payload);
    },
    updateFetchingBalanceStatus(state, action: PayloadAction<boolean>) {
      state.isFetchingUSDCBalance = action.payload;
    },
    updateUSDCBalance(state, action) {
      state.usdcBalance = action.payload.usdcBalance;
      state.isFetchingUSDCBalance = false;
    },
    addToUserTransactions(state, action: PayloadAction<FilteredBlockchainHistory>) {
      state.userTransactions = [action.payload].concat(state.userTransactions);
    },
    updateNotificationStatusByTxHash(state, action: PayloadAction<{ txHash: string, status: NotificationStatus; }>) {
      state.notificationStatusByTxHash[action.payload.txHash] = action.payload.status;
    },
    updateProfileState(state, action: PayloadAction<UserEntity>) {
      state.profile = action.payload;
      state.league = findLeagueFromProfile(action.payload);
    },
    rejectWeb3LoginAction(state) {
      state.isLoggedIn = false;
      localStorage.setItem(StorageKeys.IsLoggedIn, "FALSE");
      state.loadingProfile = false;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(web3Login.pending, (state) => {
        state.isLoggedIn = false;
        state.loadingProfile = true;
      })
      .addCase(web3Login.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        localStorage.setItem(StorageKeys.IsLoggedIn, "TRUE");
        state.profile = {
          ...action.payload,
          createdAt: dayjs(action.payload.createdAt)
        };
        state.league = findLeagueFromProfile(action.payload);
        state.loadingProfile = false;
      })
      .addCase(web3Login.rejected, (state, { error }) => {
        console.error(error.name, error.message, error.stack);
        state.isLoggedIn = false;
        localStorage.setItem(StorageKeys.IsLoggedIn, "FALSE");
        state.loadingProfile = false;
      })

      // load user transactions
      .addCase(loadUserTransactions.pending, state => {
        state.loading = true;
      })
      .addCase(loadUserTransactions.fulfilled, (state, action) => {
        state.historyFavIds = action.payload?.historyFavIds as number[];
        state.userTransactions = action.payload?.userTransactions as FilteredBlockchainHistory[];
        state.fulfilledLimitOrderTxHashMap = action.payload?.fulfilledLimitOrders.reduce((a: { [txHash: string]: 1; }, b) => {
          a[b.txHash as string] = 1;
          return a;
        }, {}) as { [txHash: string]: 1; };
        state.loading = false;
      })
      .addCase(loadUserTransactions.rejected, (state, { error }) => {
        state.loading = false;
        console.error(error.name, error.message, error.stack);
      })

      // load historical user info
      .addCase(loadHistoricalUserInfo.pending, state => {
        state.loadingHistoricalUserInfo = true;
      })
      .addCase(loadHistoricalUserInfo.fulfilled, (state, action) => {
        boundObject(state, action.payload);
        state.loadingHistoricalUserInfo = false;
      })
      .addCase(loadHistoricalUserInfo.rejected, (state, { error }) => {
        state.loadingHistoricalUserInfo = false;
        console.error(error.name, error.message, error.stack);
      })

      // load notifications status
      .addCase(loadNotificationsStatus.pending, state => {
        state.loading = true;
      })
      .addCase(loadNotificationsStatus.fulfilled, (state, action) => {
        boundObject(state, action.payload);
        state.loading = false;
      })
      .addCase(loadNotificationsStatus.rejected, (state, { error }) => {
        state.loading = false;
        console.error(error.name, error.message, error.stack);
      })

      // load user info
      .addCase(loadUserInfo.pending, state => {
        state.loading = true;
      })
      .addCase(loadUserInfo.fulfilled, (state, action) => {
        boundObject(state, action.payload);
        state.loading = false;
      })
      .addCase(loadUserInfo.rejected, (state, { error }) => {
        state.loading = false;
        console.error(error.name, error.message, error.stack);
      })

      // create notification
      .addCase(createNotification.fulfilled, (state, action) => {
        state.notificationStatusByTxHash[action.payload.txHash] = NotificationStatus.Unread;
      })
      .addCase(createNotification.rejected, (_state, { error }) => {
        console.error(error.name, error.message, error.stack);
      })

      // update notification
      .addCase(updateNotification.fulfilled, (state, action) => {
        state.notificationStatusByTxHash[action.payload.txHash] = NotificationStatus.Read;
      })
      .addCase(updateNotification.rejected, (_state, { error }) => {
        console.error(error.name, error.message, error.stack);
      })

      // update user profile
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.league = findLeagueFromProfile(action.payload);
      })
      .addCase(updateUserProfile.rejected, (_state, { error }) => {
        console.error(error.name, error.message, error.stack);
      })

      // create limit order
      .addCase(createLimitOrder.fulfilled, (state, action: PayloadAction<FilteredBlockchainHistory>) => {
        // add user transaction to the store
        state.userTransactions = [action.payload].concat(state.userTransactions);
      })
      .addCase(createLimitOrder.rejected, (_state, { error }) => {
        console.error(error.name, error.message, error.stack);
      })

      // create rejected order
      .addCase(createRejectedOrder.fulfilled, (state, action: PayloadAction<FilteredBlockchainHistory>) => {
        // add user transaction to the store
        state.userTransactions = [action.payload].concat(state.userTransactions);
      })
      .addCase(createRejectedOrder.rejected, (_state, { error }) => {
        console.error(error.name, error.message, error.stack);
      })

      // withdraw limit order
      .addCase(withdrawLimitOrder.fulfilled, (state, action: PayloadAction<LimitOrderEntity>) => {
        // update status from "Processing" to "Withdrawn"
        let index = 0;
        state.userTransactions.map((o, idx) => {
          if (o.id === action.payload.id) {
            index = idx;
            o.status = LimitOrderStatus.Cancelled;
            o.createdAt = dayjs().valueOf();
          }
        });
        // sort transactions by createdAt
        const tmp = state.userTransactions[index];
        for (let i = index; i > 0; i--) {
          state.userTransactions[i] = state.userTransactions[i - 1];
        }
        state.userTransactions[0] = tmp;
      })
      .addCase(withdrawLimitOrder.rejected, (_state, { error }) => {
        console.error(error.name, error.message, error.stack);
      });
  }
});

export const {
  updateUserInfo,
  updateFetchingBalanceStatus,
  updateUSDCBalance,
  addToUserTransactions,
  updateNotificationStatusByTxHash,
  updateProfileState,
  rejectWeb3LoginAction
} = userSlice.actions;

export default userSlice.reducer;