import { MAX_TAKE } from "../../constants/base.const";

export const generateFindFollowersQuery = (address: string) => `
  query findFollowers {
    findFollowers(take: ${MAX_TAKE}, followingAddress: "${address}") {
      address
    }
  }
`;

export const generateFindFollowingsQuery = (address: string) => `
  query findFollowings {
    findFollowings(take: ${MAX_TAKE}, followerAddress: "${address}") {
      address
    }
  }
`;