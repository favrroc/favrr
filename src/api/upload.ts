import { ApolloActionType, apolloClient, ClientType } from "../core/clients/apolloClient";
import { generateProfileImageUploadMutation } from "../core/graphql-queries/backend-queries/profile.mutation";
import { imageToString } from "../core/util/image.util";

export const uploadProfileImage = async (name: string, contentType: string, body: string) => {
  const { profileImageUpload } = await apolloClient(
    ClientType.GRAPHQL,
    ApolloActionType.MUTATE,
    generateProfileImageUploadMutation({ name, contentType, body })
  );

  return profileImageUpload;
};

export const uploadImageFile = async (file: File) => {
  const base64String = await imageToString(file);
  const objectUrl = await uploadProfileImage(file.name, file.type, base64String);
  return objectUrl;
};