import { MAX_TAKE } from "../../constants/base.const";

export const generateNotificationsStatusQuery = (address: string) => `
  query findNotificationsStatus {
    findAllNotification(take: ${MAX_TAKE}, address: "${address}") {
      id
      txHash
      status
    }
  }
`;
