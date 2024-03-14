import { NotificationStatus } from "../../../generated-graphql/graphql";
import { UserInfo } from "../../../generated-subgraph/graphql";

export interface UserInfoHistory {
  [timestamp: string]: UserInfo[];
};

export type NotificationStatusByTxHash = {
  [txHash: string]: NotificationStatus;
};