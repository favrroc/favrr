export const generateFollowMutation = (address: string) => `
  mutation follow {
    follow(createFollowInput: { followingAddress: "${address}" }) {
      success
    }
  }
`;

export const generateUnfollowMutation = (address: string) => `
  mutation unfollow {
    unfollow(followingAddress: "${address}") {
      success
    }
  }
`;