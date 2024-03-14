import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { formatUnits } from "viem";
import {
  FavEntity,
  Mutation as GraphqlMutation,
  Query as GraphqlQuery,
  LimitOrderEntity,
  LimitOrderType,
  News
} from "../../../../generated-graphql/graphql";
import {
  Query as SubgraphQuery
} from "../../../../generated-subgraph/graphql";
import {
  ApolloActionType,
  apolloClient,
  ClientType
} from "../../clients/apolloClient";
import {
  DEFAULT_IPO_AVAILABLE_SHARES,
  LIMIT_ORDER_PER_PAGE,
  NEWS_PER_PAGE,
} from "../../constants/base.const";
import { oceanaShareExContract, oceanaUSDCContract } from "../../constants/contract";
import { generateToggleLikeMutation } from "../../graphql-queries/backend-queries/favs.mutation";
import { generateFindAllFavsQuery } from "../../graphql-queries/backend-queries/favs.query";
import { generateFindAllLimitOrdersByFavIdQuery } from "../../graphql-queries/backend-queries/limitOrders.query";
import { generateNewsQuery } from "../../graphql-queries/backend-queries/news.query";
import { generateBlockchainHistoriesByFavIdQuery } from "../../graphql-queries/subgraph-queries/blockchainHistories.query";
import {
  generateHistoricalFavInfoOnlyOneDayQuery,
  generateHistoricalFavInfoQuery, generateMultiFavsInfoWithBlockQuery,
  generateTopFavsQuery, HistoricalFavInfo, MultiFavsInfo
} from "../../graphql-queries/subgraph-queries/favInfo.query";
import { FavsById, MultiFavInfo } from "../../interfaces/fav.type";
import { FilteredBlockchainHistory } from "../../interfaces/transaction.type";
import { boundObject } from "../../util/base.util";
import {
  getBlocksFromTimestamps,
  getDeltaTimestamps
} from "../../util/queries.util";

interface FavsSlice {
  // map(arg0: (favs: FavEntity) => void): unknown;
  loading: boolean;

  // fav data from backend graphql
  loadingFavs: boolean;
  favs: FavEntity[];
  favsById: FavsById;
  favIds: number[];

  // watchlist fav ids
  watchlistFavIds: number[];

  // top stocks
  topFavs: FavEntity[];

  // multi favs info
  loadingMultiFavsInfo: boolean;
  multiFavsInfo: MultiFavInfo;

  // all time fav info history
  loadingHistoricalFavInfo: boolean;
  historicalFavInfo: HistoricalFavInfo;

  // 24h fav info history
  historicalFavInfoOnlyOneDay: HistoricalFavInfo;
  loadingFavBlockchainHistories: boolean;

  // fav's blockchain histories
  favBlockchainHistories: FilteredBlockchainHistory[];

  // limit buy orders
  loadingLimitBuyOrdersByFavId: boolean;
  limitBuyOrdersByFavId: Array<LimitOrderEntity>;
  hasMoreLimitBuyOrdersByFavId: boolean;

  // limit sell orders
  loadingLimitSellOrdersByFavId: boolean;
  limitSellOrdersByFavId: Array<LimitOrderEntity>;
  hasMoreLimitSellOrdersByFavId: boolean;

  // news
  loadingNews: boolean;
  newsData: Array<News>;
  hasMoreNews: boolean;
}

const initialState = {
  loading: false,
  loadingFavs: false,
  favs: new Array<FavEntity>(),
  favsById: {},
  favIds: [],
  watchlistFavIds: [],
  topFavs: new Array<FavEntity>(),
  loadingMultiFavsInfo: false,
  multiFavsInfo: {},
  loadingHistoricalFavInfo: false,
  historicalFavInfo: {},
  historicalFavInfoOnlyOneDay: {},
  loadingFavBlockchainHistories: false,
  favBlockchainHistories: [],
  loadingLimitBuyOrdersByFavId: false,
  limitBuyOrdersByFavId: [],
  hasMoreLimitBuyOrdersByFavId: false,
  loadingLimitSellOrdersByFavId: false,
  limitSellOrdersByFavId: [],
  hasMoreLimitSellOrdersByFavId: false,
  loadingNews: false,
  newsData: [],
  hasMoreNews: false,
} as FavsSlice;

export const loadAllFavs = createAsyncThunk(
  "favs/loadAllFavs",
  async (address: string | undefined) => {
    const { findAllFav }: GraphqlQuery = await apolloClient(
      ClientType.GRAPHQL,
      ApolloActionType.QUERY,
      generateFindAllFavsQuery(address)
    );
    if (!findAllFav) {
      return;
    }
    const { favInfos: topFavsInfo }: SubgraphQuery = await apolloClient(
      ClientType.SUBGRAPH,
      ApolloActionType.QUERY,
      generateTopFavsQuery()
    );
    if (!topFavsInfo) {
      return;
    }

    const favIds = findAllFav.map((o) => +o.id);
    const favsById = {} as FavsById;
    findAllFav.map((o) => {
      favsById[o.id.toString()] = o;
    });

    const watchlistFavIds = findAllFav
      .filter((o) => o.isLike)
      ?.map((o) => o.id);

    const topFavs = topFavsInfo.map((o) => favsById[o.id]).filter((o) => !!o);

    return { favs: findAllFav, favsById, favIds, watchlistFavIds, topFavs };
  }
);

export const loadMultiFavsInfo = createAsyncThunk(
  "favs/loadMultiFavsInfo",
  async () => {
    const [t24, t48, t168] = getDeltaTimestamps();
    const blocks = await getBlocksFromTimestamps([t24, t48, t168]);
    const [block24, block48, block168] = blocks ?? [];

    const blockToBlockNumber = (block: any) => {
      return block
        ? Math.max(+block.number, oceanaShareExContract.deployedBlockNumber)
        : oceanaShareExContract.deployedBlockNumber;
    };

    const [blockNumber24, blockNumber48, blockNumber168] = [
      blockToBlockNumber(block24),
      blockToBlockNumber(block48),
      blockToBlockNumber(block168),
    ];

    if (!blockNumber24 || !blockNumber48 || !blockNumber168) {
      return;
    }

    const data: MultiFavsInfo = await apolloClient(
      ClientType.SUBGRAPH,
      ApolloActionType.QUERY,
      generateMultiFavsInfoWithBlockQuery([
        blockNumber24,
        blockNumber48,
        blockNumber168,
      ])
    );
    if (!data) {
      return;
    }

    const result: MultiFavInfo = {};

    if (Object.keys(data).length > 0) {
      data.current.map((o, idx) => {
        const x = Object.assign({}, o);
        
        const currObj = {
          ...x,
          ipoPrice: +formatUnits(BigInt(x.ipoPrice), oceanaUSDCContract.decimals),
          marketPrice: +formatUnits(BigInt(x.marketPrice), oceanaUSDCContract.decimals),
          volume: x.volume ? +x.volume : 0,
          volumeUSDC: +formatUnits(BigInt(x.volumeUSDC), oceanaUSDCContract.decimals),
          // convert seconds to miliseconds
          ipoEndTime: x.ipoEndTime * 1000,
          totalCost: +formatUnits(BigInt(x.totalCost), oceanaUSDCContract.decimals)
        };

        const o24 = Object.assign({}, data?.oneDay[idx]);
        const parsed24 = {
          ...o24,
          ipoPrice: +formatUnits(BigInt(o24.ipoPrice), oceanaUSDCContract.decimals),
          marketPrice: +formatUnits(BigInt(o24.marketPrice), oceanaUSDCContract.decimals),
          availableSupply: o24.availableSupply || DEFAULT_IPO_AVAILABLE_SHARES,
          volume: o24.volume ? +o24.volume : 0,
          volumeUSDC: +formatUnits(BigInt(o24.volumeUSDC), oceanaUSDCContract.decimals),
        };

        const o48 = Object.assign({}, data?.twoDay[idx]);
        const parsed48 = {
          ...o48,
          ipoPrice: +formatUnits(BigInt(o48.ipoPrice), oceanaUSDCContract.decimals),
          marketPrice: +formatUnits(BigInt(o48.marketPrice), oceanaUSDCContract.decimals),
          availableSupply: o48.availableSupply || DEFAULT_IPO_AVAILABLE_SHARES,
          volume: o48.volume ? +o48.volume : 0,
          volumeUSDC: +formatUnits(BigInt(o48.volumeUSDC), oceanaUSDCContract.decimals),
        };

        const o168 = Object.assign({}, data?.sevenDay[idx]);
        const parsed168 = {
          ...o168,
          ipoPrice: +formatUnits(BigInt(o168.ipoPrice), oceanaUSDCContract.decimals),
          marketPrice: +formatUnits(BigInt(o168.marketPrice), oceanaUSDCContract.decimals),
          availableSupply: o168.availableSupply || DEFAULT_IPO_AVAILABLE_SHARES,
          volume: o168.volume ? +o168.volume : 0,
          volumeUSDC: +formatUnits(BigInt(o168.volumeUSDC), oceanaUSDCContract.decimals),
        };

        const isIPO = currObj.ipoEndTime > Date.now();
        const price = currObj.marketPrice || currObj.ipoPrice || 1;
        const price24 = parsed24.marketPrice || parsed24.ipoPrice || 1;
        const price168 = parsed168.marketPrice || parsed168.ipoPrice || 1;

        const todayVolume = currObj.volume - parsed24.volume;
        const yesterdayVolume = parsed24.volume - parsed48.volume;
        const volumeDeltaPercent =
          yesterdayVolume == 0
            ? 0
            : ((todayVolume - yesterdayVolume) / yesterdayVolume) * 100;

        const marketPriceDeltaPercent = ((price - price24) / price24) * 100;

        const marketPriceDeltaPercentForWeek =
          ((price - price168) / price168) * 100;

        result[currObj.id] = {
          data: currObj,
          isIPO: isIPO,
          sharesDelta: isIPO
            ? parsed24.availableSupply - currObj.availableSupply
            : currObj.volume - parsed24.volume,
          marketPriceDelta: price - price24,
          marketPriceDeltaPercent: marketPriceDeltaPercent,

          marketPriceDeltaForWeek: price - price168,
          marketPriceDeltaPercentForWeek: marketPriceDeltaPercentForWeek,
          marketCap:
            currObj.totalSupply *
            (isIPO ? currObj.ipoPrice : currObj.marketPrice),
          volumeUSDCDelta: currObj.volumeUSDC - parsed24.volumeUSDC,
          volumeDeltaPercent: volumeDeltaPercent,
          totalCost: currObj.totalCost
        };
      });
    }

    return { multiFavsInfo: result };
  }
);

export const loadHistoricalFavInfo = createAsyncThunk(
  "favs/loadHistoricalFavInfo",
  async (favId: number) => {
    const historicalFavInfo: HistoricalFavInfo = await apolloClient(
      ClientType.SUBGRAPH,
      ApolloActionType.QUERY,
      await generateHistoricalFavInfoQuery(favId)
    );
    const historicalFavInfoOnlyOneDay: HistoricalFavInfo = await apolloClient(
      ClientType.SUBGRAPH,
      ApolloActionType.QUERY,
      await generateHistoricalFavInfoOnlyOneDayQuery(favId)
    );

    return { historicalFavInfo, historicalFavInfoOnlyOneDay };
  }
);

export const loadBlockchainHistoriesByFavId = createAsyncThunk(
  "favs/loadBlockchainHistoriesByFavId",
  async (favId: number) => {
    const { blockchainHistories }: SubgraphQuery = await apolloClient(
      ClientType.SUBGRAPH,
      ApolloActionType.QUERY,
      generateBlockchainHistoriesByFavIdQuery(favId)
    );

    return {
      favBlockchainHistories: blockchainHistories.map((o) => {
        const obj = Object.assign({}, o);
        obj.pps = +formatUnits(BigInt(obj.pps), oceanaUSDCContract.decimals);
        obj.ppsBefore = +formatUnits(BigInt(obj.ppsBefore), oceanaUSDCContract.decimals);
        obj.createdAt =
          typeof obj.createdAt === "string"
            ? +obj.createdAt * 1000
            : obj.createdAt;
        return obj;
      }) as FilteredBlockchainHistory[],
    };
  }
);

export const loadLimitBuyOrdersByFavId = createAsyncThunk(
  "favs/loadLimitBuyOrdersByFavId",
  async (props: { favId: number; skip: number; }) => {
    const { findAllLimitOrder: response }: GraphqlQuery = await apolloClient(
      ClientType.GRAPHQL,
      ApolloActionType.QUERY,
      generateFindAllLimitOrdersByFavIdQuery({
        skip: props.skip,
        take: LIMIT_ORDER_PER_PAGE,
        favId: props.favId,
        type: LimitOrderType.Buy,
      })
    );

    const hasMore = props.skip + LIMIT_ORDER_PER_PAGE < response.count;

    return {
      reset: props.skip === 0,
      limitBuyOrdersByFavId: response.data,
      hasMoreLimitBuyOrdersByFavId: hasMore,
    };
  }
);

export const loadLimitSellOrdersByFavId = createAsyncThunk(
  "favs/loadLimitSellOrdersByFavId",
  async (props: { favId: number; skip: number; }) => {
    const { findAllLimitOrder: response }: GraphqlQuery = await apolloClient(
      ClientType.GRAPHQL,
      ApolloActionType.QUERY,
      generateFindAllLimitOrdersByFavIdQuery({
        skip: props.skip,
        take: LIMIT_ORDER_PER_PAGE,
        favId: props.favId,
        type: LimitOrderType.Sell,
      })
    );

    const hasMore = props.skip + LIMIT_ORDER_PER_PAGE < response.count;

    return {
      reset: props.skip === 0,
      limitSellOrdersByFavId: response.data,
      hasMoreLimitSellOrdersByFavId: hasMore,
    };
  }
);

export const loadNews = createAsyncThunk(
  "favs/loadNews",
  async (props: { favKeys: string[]; skip: number; }) => {
    const { getNews }: GraphqlQuery = await apolloClient(
      ClientType.GRAPHQL,
      ApolloActionType.QUERY,
      generateNewsQuery(props.skip, props.favKeys)
    );

    const hasMore = props.skip + NEWS_PER_PAGE < (getNews.count || 0);

    return {
      newsData: getNews.results,
      hasMoreNews: hasMore,
      shouldClear: props.skip === 0,
    };
  }
);

export const toggleFavLikesInfo = createAsyncThunk(
  "favs/toggleFavLikesInfo",
  async (props: { favId: number; }) => {
    const { toggleLikeFav }: GraphqlMutation = await apolloClient(
      ClientType.GRAPHQL,
      ApolloActionType.MUTATE,
      generateToggleLikeMutation(props.favId)
    );

    return { success: toggleLikeFav.success, favId: props.favId };
  }
);

const favsSlice = createSlice({
  name: "favs",
  initialState,
  reducers: {
    updateFavs(state, action) {
      boundObject(state, action.payload);
    },
    updateMultiFavsInfo(state, action) {
      state.multiFavsInfo = action.payload;
    },
    addLimitOrderThunk(state, action: PayloadAction<LimitOrderEntity>) {
      const pps = +formatUnits(BigInt(action.payload.price?.toString() || 0), oceanaUSDCContract.decimals);
      if (action.payload.type === LimitOrderType.Buy) {
        if (
          state.limitBuyOrdersByFavId.length === 0 ||
          pps <= (state.limitBuyOrdersByFavId[state.limitBuyOrdersByFavId.length - 1].price || 0)
        ) {
          // since limit orders are sorted by the share price, if the new order's share price is not included in the range of displayed orders, we don't need to display that new order
          state.limitBuyOrdersByFavId = state.limitBuyOrdersByFavId.concat(action.payload).sort((a, b) => (a.price || 0) - (b.price || 0));
        }
      }
      else {
        if (
          state.limitSellOrdersByFavId.length === 0 ||
          pps <= (state.limitSellOrdersByFavId[state.limitSellOrdersByFavId.length - 1].price || 0)
        ) {
          state.limitSellOrdersByFavId = state.limitSellOrdersByFavId.concat(action.payload).sort((a, b) => (a.price || 0) - (b.price || 0));
        }
      }
    },
    removeLimitOrderThunk(state, action: PayloadAction<LimitOrderEntity>) {
      if (action.payload.type === LimitOrderType.Buy) {
        state.limitBuyOrdersByFavId = state.limitBuyOrdersByFavId.filter(o => o.id !== action.payload.id);
      }
      else {
        state.limitSellOrdersByFavId = state.limitSellOrdersByFavId.filter(o => o.id !== action.payload.id);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadAllFavs.pending, (state) => {
        state.loadingFavs = true;
      })
      .addCase(loadAllFavs.fulfilled, (state, action) => {
        boundObject(state, action.payload);
        state.loadingFavs = false;
      })
      .addCase(loadAllFavs.rejected, (state, { error }) => {
        state.loadingFavs = false;
        console.error(error.name, error.message, error.stack);
      })

      // load multi favs info
      .addCase(loadMultiFavsInfo.pending, (state) => {
        state.loadingMultiFavsInfo = true;
      })
      .addCase(loadMultiFavsInfo.fulfilled, (state, action) => {
        boundObject(state, action.payload);
        state.loadingMultiFavsInfo = false;
      })
      .addCase(loadMultiFavsInfo.rejected, (state, { error }) => {
        state.loadingMultiFavsInfo = false;
        console.error(error.name, error.message, error.stack);
      })

      // load historical favInfo
      .addCase(loadHistoricalFavInfo.pending, (state) => {
        state.loadingHistoricalFavInfo = true;
      })
      .addCase(loadHistoricalFavInfo.fulfilled, (state, action) => {
        boundObject(state, action.payload);
        state.loadingHistoricalFavInfo = false;
      })
      .addCase(loadHistoricalFavInfo.rejected, (state, { error }) => {
        state.loadingHistoricalFavInfo = false;
        console.error(error.name, error.message, error.stack);
      })

      // load blockchain histories by favId
      .addCase(loadBlockchainHistoriesByFavId.pending, (state) => {
        state.loadingFavBlockchainHistories = true;
      })
      .addCase(loadBlockchainHistoriesByFavId.fulfilled, (state, action) => {
        boundObject(state, action.payload);
        state.loadingFavBlockchainHistories = false;
      })
      .addCase(loadBlockchainHistoriesByFavId.rejected, (state, { error }) => {
        state.loadingFavBlockchainHistories = false;
        console.error(error.name, error.message, error.stack);
      })

      // load limit buy orders by favId
      .addCase(loadLimitBuyOrdersByFavId.pending, (state) => {
        state.loadingLimitBuyOrdersByFavId = true;
      })
      .addCase(loadLimitBuyOrdersByFavId.fulfilled, (state, action) => {
        state.limitBuyOrdersByFavId = action.payload.reset
          ? action.payload.limitBuyOrdersByFavId
          : state.limitBuyOrdersByFavId.concat(action.payload.limitBuyOrdersByFavId);
        state.hasMoreLimitBuyOrdersByFavId = action.payload.hasMoreLimitBuyOrdersByFavId;
        state.loadingLimitBuyOrdersByFavId = false;
      })
      .addCase(loadLimitBuyOrdersByFavId.rejected, (state, { error }) => {
        state.loadingLimitBuyOrdersByFavId = false;
        console.error(error.name, error.message, error.stack);
      })

      // load limit sell orders by favId
      .addCase(loadLimitSellOrdersByFavId.pending, (state) => {
        state.loadingLimitSellOrdersByFavId = true;
      })
      .addCase(loadLimitSellOrdersByFavId.fulfilled, (state, action) => {
        state.limitSellOrdersByFavId = action.payload.reset
          ? action.payload.limitSellOrdersByFavId
          : state.limitSellOrdersByFavId.concat(action.payload.limitSellOrdersByFavId);
        state.hasMoreLimitSellOrdersByFavId = action.payload.hasMoreLimitSellOrdersByFavId;
        state.loadingLimitSellOrdersByFavId = false;
      })
      .addCase(loadLimitSellOrdersByFavId.rejected, (state, { error }) => {
        state.loadingLimitSellOrdersByFavId = false;
        console.error(error.name, error.message, error.stack);
      })

      // load news
      .addCase(loadNews.pending, (state) => {
        state.loadingNews = true;
      })
      .addCase(loadNews.fulfilled, (state, action) => {
        if (action.payload.shouldClear) {
          state.newsData = [];
        }
        boundObject(state, {
          ...action.payload,
          newsData: [...state.newsData, ...action.payload.newsData],
        });
        state.loadingNews = false;
      })
      .addCase(loadNews.rejected, (state, { error }) => {
        state.loadingNews = false;
        console.error(error.name, error.message, error.stack);
      })

      // toggle favLikes info
      .addCase(toggleFavLikesInfo.fulfilled, (state, action) => {
        if (action.payload.success) {
          const favId = action.payload.favId;
          state.favsById[favId].isLike = !state.favsById[favId].isLike;
          state.favs.map((o) => {
            if (o.id === favId) {
              o.isLike = !o.isLike;
              const pos = state.watchlistFavIds.indexOf(favId);
              pos === -1 ? state.watchlistFavIds.push(favId) : state.watchlistFavIds.splice(pos, 1);
            }
          });
        }
      })
      .addCase(toggleFavLikesInfo.rejected, (_state, { error }) => {
        console.error(error.name, error.message, error.stack);
      });
  },
});

export const { updateFavs, updateMultiFavsInfo, addLimitOrderThunk, removeLimitOrderThunk } = favsSlice.actions;

export default favsSlice.reducer;
