import dayjs from "dayjs";
import { FavInfo } from "../../../../generated-subgraph/graphql";
import {
  getBlocksFromTimestamps,
  getDailyTimestamps,
  getOneDayTimestamps
} from "../../util/queries.util";

export const generateFavsInfoQuery = (address: string) => `
  query favInfos {
    favInfos(where: { id: "${address}" }) {
      id
      ipoPrice
      totalSupply
      circulatingSupply
      ipoSupply
      availableSupply
      ipoEndTime
      marketPrice
      amountInPool
      minAmountInPool
      updatedAt
      volume
    }
  }
`;

export const generateFavsInfoWithBlockQuery = (
  favId: number,
  blockNumber: number
) => `
  query favInfosWithBlock {
    current: favInfos(where: { id: ${favId} }) {
      id
      ipoPrice
      totalSupply
      circulatingSupply
      ipoSupply
      availableSupply
      ipoEndTime
      marketPrice
      amountInPool
      minAmountInPool
      updatedAt
      volume
    }
    oneDay: favInfos(where: { id: ${favId} }, block: { number: ${blockNumber} }) {
      ipoPrice
      totalSupply
      circulatingSupply
      ipoSupply
      availableSupply
      ipoEndTime
      marketPrice
      amountInPool
      minAmountInPool
      updatedAt
      volume
    }
  }
`;

export type MultiFavsInfo = {
  current: Array<FavInfo>;
  oneDay: Array<FavInfo>;
  twoDay: Array<FavInfo>;
  sevenDay: Array<FavInfo>;
};

export const generateMultiFavsInfoWithBlockQuery = (blockNumber: number[]) => `
  query multiFavInfosWithBlock {
    current: favInfos {
      id
      ipoPrice
      totalSupply
      circulatingSupply
      ipoSupply
      availableSupply
      ipoEndTime
      marketPrice
      amountInPool
      minAmountInPool
      updatedAt
      volume
      volumeUSDC
      totalCost
    }
    oneDay: favInfos(block: { number: ${blockNumber[0]} }) {
      ipoPrice
      totalSupply
      circulatingSupply
      ipoSupply
      availableSupply
      ipoEndTime
      marketPrice
      amountInPool
      minAmountInPool
      updatedAt
      volume
      volumeUSDC
      totalCost
    }
    twoDay: favInfos(block: { number: ${blockNumber[1]} }) {
      ipoPrice
      totalSupply
      circulatingSupply
      ipoSupply
      availableSupply
      ipoEndTime
      marketPrice
      amountInPool
      minAmountInPool
      updatedAt
      volume
      volumeUSDC
      totalCost
    }
    sevenDay: favInfos(block: { number: ${blockNumber[2]} }) {
      ipoPrice
      totalSupply
      circulatingSupply
      ipoSupply
      availableSupply
      ipoEndTime
      marketPrice
      amountInPool
      minAmountInPool
      updatedAt
      volume
      volumeUSDC
      totalCost
    }
  }
`;

export const generateTopFavsQuery = () => `
  query topFavInfos {
    favInfos(
      where: { ipoEndTime_lt: ${dayjs().unix()} }
      orderBy: marketPrice
      orderDirection: desc
      first: 15
    ) {
      id
    }
  }
`;

export type HistoricalFavInfo = {
  [tstamp: string]: Array<FavInfo>;
};

export const generateFavInfo24 = async (favId: number) => {
  const oneDayAgoTimestamp = dayjs().subtract(1, "day").unix();
  const blocks = await getBlocksFromTimestamps([oneDayAgoTimestamp]);

  let queryString = "query favInfo24 {";
  queryString += blocks?.map(({ number }) => {
    if (number) {
      return `favInfos(where: { id: "${favId}" }, block: { number: ${number} }) {
        ipoEndTime
        marketPrice
        volume
        volumeUSDC
        amountInPool
      }`;
    }
  });
  queryString += "}";

  return queryString;
};

export const generateFavInfoWhenFanMatchStarted = async (favId: number) => {
  const dayjsMonday = dayjs().day(1);
  const mondayTimestamp = dayjsMonday.subtract(dayjsMonday.isAfter(dayjs()) ? 1 : 0, "week").startOf("day").unix();
  const blocks = await getBlocksFromTimestamps([mondayTimestamp]);

  let queryString = "query favInfoWhenFanMatchStarted {";
  queryString += blocks?.map(({ number }) => {
    if (number) {
      return `favInfos(where: { id: "${favId}" }, block: { number: ${number} }) {
        ipoEndTime
        marketPrice
        volume
        volumeUSDC
        amountInPool
      }`;
    }
  });
  queryString += "}";

  return queryString;
};

export const generateHistoricalFavInfoQuery = async (favId: number) => {
  const timestamps = getDailyTimestamps();
  const blocks = await getBlocksFromTimestamps(timestamps);

  let queryString = "query useHistoricalFavInfo {";
  queryString += blocks?.map(({ number }, idx) => {
    if (number) {
      return `t${timestamps[idx]}:favInfos(where: { id: "${favId}" }, block: { number: ${number} }) {
        ipoPrice
        ipoEndTime
        marketPrice
        volume
      }`;
    }
  });
  queryString += "}";

  return queryString;
};

export const generateHistoricalFavInfoOnlyOneDayQuery = async (
  favId: number
) => {
  const timestampsOnlyOneDay = getOneDayTimestamps();
  const blocksOnlyOneDay = await getBlocksFromTimestamps(timestampsOnlyOneDay);

  let queryStringOnlyOneDay = "query useHistoricalFavInfo {";
  queryStringOnlyOneDay += blocksOnlyOneDay?.map(({ number }, idx) => {
    if (number) {
      return `t${timestampsOnlyOneDay[idx]}:favInfos(where: { id: "${favId}" }, block: { number: ${number} }) {
        ipoPrice
        ipoEndTime
        marketPrice
        volume
      }`;
    }
  });
  queryStringOnlyOneDay += "}";

  return queryStringOnlyOneDay;
};

export const generateFetchInvestorsQuery = (favId: number) => `
  query getShareAssets{
    shareAssets(where: {
      favInfo_: {
        id: ${favId}
      },
      amount_gt: 0
    }) {
      userInfo {
        id
      }
    }
  }
`;

export const generateFetchFanCountsQuery = (favId: number) => `
  query getFanCounts{
    fanCount(favId:${favId})
  }
`;
