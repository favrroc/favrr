export const generateGetBlocksQuery = (timestamps: number[]) => {
  let queryString = "query blocks {";
  queryString += timestamps.map((timestamp) => {
    return `t${timestamp}:blocks(first: 1, orderBy: timestamp, orderDirection: desc, where: { timestamp_gt: ${timestamp}, timestamp_lt: ${timestamp + 600
    } }) {
        number
      }`;
  });
  queryString += "}";
  return queryString;
};

export const generateGetLatestBlockQuery = () => `
query getLatestBlock {
  _meta {
    block {
      number
    }
  }
}
`;