import { UserInfo } from "../../../../generated-subgraph/graphql";
import { getBlocksFromTimestamps, getDailyTimestamps, getOneDayTimestamps } from "../../util/queries.util";

export const generateUserInfoQuery = (address: string) => `
  query userInfo {
    userInfo(id: "${address}") {
      id
      totalCost
      totalShares
      shareAssets {
        favInfo {
          id
          ipoPrice
          marketPrice
        }
        totalCost
        amount
      }
    }
  }
`;

export type HistoricalUserInfo = {
  [tstamp: string]: UserInfo;
};

export const generateHistoricalUserInfoQuery = async (address: string) => {
  const timestamps = getDailyTimestamps();
  const blocks = await getBlocksFromTimestamps(timestamps);

  let queryString = "query useHistoricalUserInfo {";
  queryString += blocks?.map(({ number }, idx) => {
    if (number) {
      return `t${timestamps[idx]}:userInfos(where: { id: "${address}" }, block: { number: ${number} }) {
        totalCost
        totalShares
        shareAssets {
          favInfo {
            id
            ipoEndTime
            ipoPrice
            marketPrice
          }
          totalCost
          amount
        }
      }`;
    }
  });
  queryString += "}";

  return queryString;
};

export const generateHistoricalUserInfoOnlyOneDayQuery = async (address: string) => {
  const timestampsOnlyOneDay = getOneDayTimestamps();
  const blocksOnlyOneDay = await getBlocksFromTimestamps(timestampsOnlyOneDay);

  let queryStringOnlyOneDay = "query useHistoricalUserInfo {";
  queryStringOnlyOneDay += blocksOnlyOneDay?.map(({ number }, idx) => {
    if (number) {
      return `t${timestampsOnlyOneDay[idx]}:userInfos(where: { id: "${address}" }, block: { number: ${number} }) {
        totalCost
        totalShares
        shareAssets {
          favInfo {
            id
            ipoEndTime
            ipoPrice
            marketPrice
          }
          totalCost
          amount
        }
      }`;
    }
  });
  queryStringOnlyOneDay += "}";

  return queryStringOnlyOneDay;
};
