import { UserEntity } from "../../../../generated-graphql/graphql";

export const generateUpdateProfileMutation = (props: UserEntity) => `
  mutation updateUser {
    updateUser(
      updateUserInput: {
        address: "${props.address}"
        fullName: "${props.fullName == null || props.fullName === "null" ? "" : props.fullName}"
        profileImageUrl: "${props.profileImageUrl == null || props.profileImageUrl === "null" ? "" : props.profileImageUrl}"
        bannerImageUrl: "${props.bannerImageUrl == null || props.bannerImageUrl === "null" ? "" : props.bannerImageUrl}"
        bio: "${props.bio == null || props.bio === "null" ? "" : props.bio}"
        email: "${props.email == null || props.email === "null" ? "" : props.email}"
        facebookInfo: "${props.facebookInfo}"
        hasNextStep: ${props.hasNextStep}
      }
    ) {
      address
      fullName
      profileImageUrl
      bannerImageUrl
      bio
      email
      emailVerified
      facebookInfo
      isVerified
      hasNextStep
    }
  }
`;

export const generateProfileImageUploadMutation = (props: { name: string, contentType: string, body: string; }) => `
  mutation {
    profileImageUpload (
      name: "${props.name}",
      contentType: "${props.contentType}",
      body: "${props.body}"
    )
  }
`;