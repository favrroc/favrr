export const generateFanMatchToggleLikeMutation = (fanMatchId: string) => `
mutation toggleLikeFanMatch{
  toggleLikeFanMatch(fanMatchId: "${fanMatchId}") {
    success
    message
  }
}
`;

export const generateCreateEmailSubscriptionQuery = (
  emailSubscribeInput: string
) => `
mutation createEmailSubscribe{
  createEmailSubscribe(emailSubscribeInput: { email: "${emailSubscribeInput}" }) {
    id
    email
    createdAt
    updatedAt
    deletedAt
  }
}
`;
