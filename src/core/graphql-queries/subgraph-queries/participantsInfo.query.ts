import { UserInfo } from "../../../../generated-subgraph/graphql";

export type ParticipantsInfo = {
  current: Array<UserInfo>;
  oneDay: Array<UserInfo>;
};

export const generateParticipantsInfoQuery = () => `
  query participantsInfo {
    userInfos {
      id
      shareAssets {
        favInfo {
          id
          ipoPrice
          ipoEndTime
          marketPrice
        }
        amount
      }
    }
  }
`;

export const generateTimeTravelParticipantsInfoQuery = (blockNumber: number) => `
  query timeTravelParticipantsInfo {
    userInfos(block: { number: ${blockNumber} }) {
      id
      shareAssets {
        favInfo {
          id
          ipoPrice
          ipoEndTime
          marketPrice
        }
        amount
      }
    }
  }
`;

export const generateHoldingStocksListOfFansQuery = () => `
  query holdingStocksListOfFans {
    userInfos {
      id
      shareAssets {
        favInfo {
          id
        }
        amount
      }
    }
  }
`;