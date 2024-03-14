export const generateBlockchainHistoriesByFavIdQuery = (favId: number) => `
  query blockchainHistoriesByFavId {
    blockchainHistories(where: { favId: ${favId} }, orderBy: createdAt, orderDirection: desc) {
      id
      address
      createdAt
      favId
      amount
      stage
      type
      pps
      ppsBefore
    }
  }
`;

export const generateBlockchainHistoriesByAddressQuery = (address: string) => `
  query blockchainHistoriesByAddress {
    blockchainHistories(where: { address: "${address}" }, orderBy: createdAt, orderDirection: desc) {
      id
      address
      createdAt
      favId
      amount
      stage
      type
      pps
      ppsBefore
    }
  }
`;
