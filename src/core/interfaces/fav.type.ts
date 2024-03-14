import { FavEntity } from "../../../generated-graphql/graphql";
import { FavInfo } from "../../../generated-subgraph/graphql";

export type FavsById = {
  [favId: string]: FavEntity;
};

export type FavStatisticsInfo = {
  data: FavInfo;
  isIPO: boolean;
  sharesDelta: number;
  marketPriceDelta: number;
  marketPriceDeltaPercent: number;
  marketPriceDeltaForWeek: number;
  marketPriceDeltaPercentForWeek: number;
  marketCap: number;
  volumeUSDCDelta: number;
  volumeDeltaPercent: number;
  totalCost: number;
};

export type MultiFavInfo = {
  [favId: string]: FavStatisticsInfo;
};