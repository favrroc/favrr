import { NotificationStatus } from "../../../../generated-graphql/graphql";

export const generateUpdateNotificationMutation = (txHash: string, address: string) => `
  mutation UpdateNotification {
    updateNotification(
      txHash: "${txHash}", 
      updateNotificationInput: {
        txHash: "${txHash}"
        address: "${address}"
        status: ${NotificationStatus.Read}
      }
    ) {
      status
    }
  }
`;

export const generateCreateNotificationMutation = (txHash: string, address: string, status: NotificationStatus) => `
  mutation CreateNotification {
    createNotification(
      createNotificationInput: {
        txHash: "${txHash}"
        address: "${address}"
        status: ${status}
      }
    ) {
      status
    }
  }
`;