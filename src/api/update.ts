import { UserEntity } from "../../generated-graphql/graphql";
import { ApolloActionType, apolloClient, ClientType } from "../core/clients/apolloClient";
import { generateUpdateProfileMutation } from "../core/graphql-queries/backend-queries/profile.mutation";

export const updateProfile = async (props: UserEntity ) => {
  const { profileUpdate } = await apolloClient(
    ClientType.GRAPHQL,
    ApolloActionType.MUTATE,
    generateUpdateProfileMutation(props)
  );
  return profileUpdate;
};