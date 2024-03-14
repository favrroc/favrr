import { ApolloClient, createHttpLink, DefaultOptions, gql, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

import { NewsResult } from "../../../generated-graphql/graphql";
import { BACKEND_API_ENDPOINT, BLOCK_URI, StorageKeys, SUBGRAPH_URL } from "../constants/base.const";

export enum ClientType {
  GRAPHQL,
  SUBGRAPH,
  BLOCK
}

export enum ApolloActionType {
  QUERY,
  MUTATE
}

export const setAuthorizationHeader = async (newSignedMessage: string) => {
  const signedMessage = localStorage.getItem(StorageKeys.AuthorizationToken);

  if (signedMessage === newSignedMessage) {
    return;
  }

  clientInstance(ClientType.GRAPHQL).resetStore();
};

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        getNews: {
          keyArgs: false,
          merge: (existing: NewsResult | undefined, incoming: NewsResult | undefined, { }) => {
            const merged = existing ? Object.assign({}, existing) : {} as NewsResult;
            const oldResults = merged?.results || [];

            return {
              ...merged,
              ...incoming,
              page: incoming?.page,
              results: oldResults.concat(incoming?.results || [])
            };
          },
        },
      },
    },
  },
});

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: "no-cache",
    errorPolicy: "ignore",
  },
  query: {
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  },
};

const graphqlClientInstance = () => {
  const httpLink = createHttpLink({ uri: `${BACKEND_API_ENDPOINT}/graphql` });
  const authLink = setContext((_, { headers }) => {
    // return the headers to the context so httpLink can read them
    const signedMessage = localStorage.getItem(StorageKeys.AuthorizationToken);
    return {
      headers: {
        ...headers,
        "authorization": `Bearer ${signedMessage}`
      },
    };
  });

  return new ApolloClient({ link: authLink.concat(httpLink), cache, defaultOptions });
};

const subgraphClientInstance = () => {
  const httpLink = createHttpLink({ uri: SUBGRAPH_URL });

  return new ApolloClient({ link: httpLink, cache: new InMemoryCache(), defaultOptions });
};

const blockClientInstance = () => {
  const httpLink = createHttpLink({ uri: BLOCK_URI });

  return new ApolloClient({ link: httpLink, cache: new InMemoryCache(), defaultOptions });
};

export const clientInstance = (clientType: ClientType) => {
  return clientType === ClientType.GRAPHQL ? graphqlClientInstance()
    : clientType === ClientType.SUBGRAPH ? subgraphClientInstance()
      : blockClientInstance();
};

export const apolloClient = async (clientType: ClientType, apolloActionType: ApolloActionType, queryString: string) => {
  return apolloActionType == ApolloActionType.QUERY
    ? clientInstance(clientType).query({
      query: gql(queryString),
    })
      .then((response?: any) => {
        return response.data;
      })
      .catch()
    : clientInstance(clientType).mutate({
      mutation: gql(queryString)
    })
      .then((response?: any) => {
        return response.data;
      })
      .catch();
};
