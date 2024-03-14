import { polygonMumbai } from "viem/chains";
import { LimitOrderStatus } from "../../../generated-graphql/graphql";
import {
  CoinbaseIconImage,
  MetamaskIconImage,
  WalletConnectIconImage
} from "../../components/assets/app-images/AppImages";

export const ENV_STAGE = process.env.STAGE as "local" | "dev" | "prod-oceana" | "beta";

export let PUBLIC_URL = "";
export let CHAIN: typeof polygonMumbai;
export let BACKEND_API_ENDPOINT = "";
export let SUBGRAPH_URL = "";
export let ETH_WS_RPC_URL = "";
export let BLOCK_URI = "";

switch (ENV_STAGE) {
case "local":
  PUBLIC_URL = "https://localhost:3000";
  CHAIN = polygonMumbai as typeof polygonMumbai;
  BACKEND_API_ENDPOINT = "https://oceana-new-backend.bixlist.com";
  SUBGRAPH_URL = "https://api.studio.thegraph.com/query/32922/oceana-staging/v0.1.0";
  ETH_WS_RPC_URL = "wss://polygon-mumbai.g.alchemy.com/v2/OVBrpoIY1X52RETWZVXsU1iUNVeT-t-M";
  BLOCK_URI = "https://api.thegraph.com/subgraphs/name/nnons/mumbai-blocks";
  
  break;
case "dev":
  PUBLIC_URL = "https://d1v7c8jomk6xu9.cloudfront.net";
  CHAIN = polygonMumbai as typeof polygonMumbai;
  BACKEND_API_ENDPOINT = "https://oceana-new-backend.bixlist.com";
  SUBGRAPH_URL = "https://api.studio.thegraph.com/query/32922/oceana-staging/v0.1.0";
  ETH_WS_RPC_URL = "wss://polygon-mumbai.g.alchemy.com/v2/OVBrpoIY1X52RETWZVXsU1iUNVeT-t-M";
  BLOCK_URI = "https://api.thegraph.com/subgraphs/name/nnons/mumbai-blocks";
  break;
case "prod-oceana":
  PUBLIC_URL = "https://oceana.market";
  CHAIN = polygonMumbai as typeof polygonMumbai;
  BACKEND_API_ENDPOINT = "https://oceana-market-prod-backend.bixlist.com";
  SUBGRAPH_URL = "https://api.studio.thegraph.com/query/32922/oceana-production-mumbai/v0.1.0";
  ETH_WS_RPC_URL = "wss://polygon-mumbai.g.alchemy.com/v2/OVBrpoIY1X52RETWZVXsU1iUNVeT-t-M";
  BLOCK_URI = "https://api.thegraph.com/subgraphs/name/nnons/mumbai-blocks";
  break;
}

// Wallets information
export const WalletsData: {
  [connectorId: string]: {
    icon: string,
    website: string
  }
} = {
  "metaMask": {
    icon: MetamaskIconImage().props.src,
    website: "https://metamask.io/"
  },
  "coinbaseWallet": {
    icon: CoinbaseIconImage().props.src,
    website: "https://www.coinbase.com/"
  },
  "walletConnect": {
    icon: WalletConnectIconImage().props.src,
    website: "https://walletconnect.com/"
  }
};

// alchemy api key
export const ALCHEMY_API_KEY = "nnVqy8oU9LZafH-F0wMI-ELuWYFSDcc1";

// local storage keys
export enum StorageKeys {
  AuthorizationToken = "AUTHORIZATION_TOKEN",
  EmailForVerification = "EMAIL_FOR_VERIFICATION",
  RecentConnectorId = "RECENT_CONNECTOR_ID",
  IsLoggedIn = "IS_LOGGED_IN"
}

// project constants
export const WEB3_SIGN_MESSAGE = "This application uses this cryptographic signature, verifying that you are the owner of this address.";
export const CURRENCY = "USDC";
export const DEFAULT_IPO_AVAILABLE_SHARES = 1000000;
export const DEFAULT_IPO_SUPPLY = 700000;
export const DEFAULT_POOL_SIZE = 400000;
export const MAX_TAKE = 2147483647;
export const NEWS_PER_PAGE = 5;
export const LIMIT_ORDER_PER_PAGE = 4;

// Email validation api key
export const EMAIL_VALIDATION_API_KEY = "80a98f859bbd4de19d0fdac8f8d73af6";

// WalletConnect Project ID
export const WALLET_CONNECT_PROJECT_ID = "9658be696c85857e496562d681b5d9d9";

export const MAX_MOBILE_WIDTH = 660;
export const MAX_TABLET_WIDTH = 1200;

export const ORDRE_STATUS_DISPLAY_TEXT = {
  [LimitOrderStatus.Cancelled]: "Withdrawn",
  [LimitOrderStatus.Fulfilled]: "Completed",
  [LimitOrderStatus.Opened]: "Processing",
  [LimitOrderStatus.Rejected]: "Rejected"
};

export const SUPPORTED_IMAGE_FORMATS = {
  "image/jpg": [".jpg", ".jpeg", ".gif", ".png"],
};

export const AVATAR_IMAGE_SIZE_LIMIT = 5 * 1024 * 1024;
export const COVER_IMAGE_SIZE_LIMIT = 15 * 1024 * 1024;
