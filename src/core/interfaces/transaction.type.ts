import { LimitOrderStatus } from "../../../generated-graphql/graphql";
import { OrderType, Stage } from "../../../generated-subgraph/graphql";

export interface FilteredBlockchainHistory {
  id: string;
  address: string;
  createdAt: number; // milliseconds
  favId: number;
  amount: number;
  stage: Stage;
  type: OrderType;
  pps: number;
  ppsBefore: number;
  status: LimitOrderStatus;
};

export enum WyreOrderActionType {
  ALL = "ALL",
  ADDED = "ADDED",
  CLAIMED = "CLAIMED",
  CANCELLED = "CANCELLED"
}

export interface WyreHistory {
  date: number; // milliseconds
  type: WyreOrderActionType;
  amount: number,
  balance: number,
}

export type IFindWyreTransactionsProps = {
  skip: number,
  take: number,
  actionType: WyreOrderActionType;
};