import { MAX_TAKE } from "../../constants/base.const";

export const generateFindAllUsersQuery = () => `
  query findAllUsers {
    findAllUser(take: ${MAX_TAKE}) {
      id
      address
      fullName
      profileImageUrl
      bannerImageUrl
      bio
      email
      emailVerified
      isVerified
      discordInfo
      facebookInfo
      twitterInfo
      createdAt
      hasNextStep
    }
  }
`;