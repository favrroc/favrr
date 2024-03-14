## How to integrate with graphql
1. Set `GRAPHQL_URL` in the `.env` file.
2. Make `codegen-graphql.yml` file.
3. Make `gql` files in the `src/graphql` folder if needed.
4. Insert `"generate-graphql-types": "dotenv -- graphql-codegen --config codegen-graphql.yml"` to `"scripts"` of `package.json` file.
5. Delete `generated-graphql` folder if exists.
6. Run `npm run generate-graphql-types`.

## How to integrate with smart contracts
1. Set smart contract addresses in the `src/constants/addresses.ts`.
2. Set smart contract ABIs in the `src/constants/ABI.ts`.

## How to integrate with subgraph
1. Set `SUBGRAPH_URL` in the `.env` file.
2. Make `codegen-subgraph.yml` file.
3. Insert `"generate-subgraph-types": "dotenv -- graphql-codegen --config codegen-subgraph.yml"` to `"scripts"` of `package.json` file.
4. Delete `generated-subgraph` folder if exists.
5. Run `npm run generate-subgraph-types`.