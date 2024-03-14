import dayjs from "dayjs";

import { ApolloActionType, apolloClient, ClientType } from "../clients/apolloClient";
import { oceanaShareExContract } from "../constants/contract";
import { generateGetBlocksQuery, generateGetLatestBlockQuery } from "../graphql-queries/subgraph-queries/blocks.query";

export function getDeltaTimestamps(): [number, number, number] {
  const utcCurrentTime = dayjs();
  const t1 = utcCurrentTime.subtract(1, "day").startOf("minute").unix();
  const t2 = utcCurrentTime.subtract(2, "day").startOf("minute").unix();
  const tWeek = utcCurrentTime.subtract(6, "day").startOf("minute").unix();
  return [t1, t2, tWeek];
}

export function getDailyTimestamps(): number[] {
  const timestamps = [];
  const startUnixTimestamp = dayjs().unix();
  const endUnixTimestamp = oceanaShareExContract.deployedTime / 1000;
  const oneDay = 3600 * 24;
  for (let d = startUnixTimestamp; d > endUnixTimestamp; d -= oneDay) {
    timestamps.push(d);
  }
  timestamps.push(endUnixTimestamp);
  return timestamps.reverse();
}

export function getOneDayTimestamps(): number[] {
  const timestamps = [];
  const utcUnixTimestamp = dayjs().unix();
  const startUnixTimestamp = Math.max(
    dayjs().subtract(1, "day").unix() - 3600,
    oceanaShareExContract.deployedTime / 1000
  );
  for (let d = utcUnixTimestamp; d >= startUnixTimestamp; d -= 3600) {
    timestamps.push(d);
  }
  return timestamps.reverse();
}

export type Blocks = {
  [tstamp: string]: {
    number: number;
  }[];
};

export type FormattedBlocks =
  | {
    timestamp: string;
    number: any;
  }[]
  | undefined;

/**
 * for a given array of timestamps, returns block entities
 * @param timestamps
 */
export const getBlocksFromTimestamps = async (timestamps: number[]) => {
  const blocks: Blocks = await apolloClient(ClientType.BLOCK, ApolloActionType.QUERY, generateGetBlocksQuery(timestamps));
  const latestBlock: { _meta: { block: { number: number; }; }; } = await apolloClient(ClientType.SUBGRAPH, ApolloActionType.QUERY, generateGetLatestBlockQuery());
  const latestBlockNumber = latestBlock._meta.block.number;
  const formatted: FormattedBlocks = [];

  for (const t in blocks) {
    const arr = blocks[t];
    if (arr.length > 0 && arr[0]["number"] < latestBlockNumber) {
      formatted.push({
        timestamp: t.split("t")[1],
        number: arr[0]["number"],
      });
    }
  };

  formatted.push({
    timestamp: dayjs().unix().toString(),
    number: latestBlockNumber
  });

  return formatted;
};
