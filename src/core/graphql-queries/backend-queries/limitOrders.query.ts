import { LimitOrderStatus, LimitOrderType } from "../../../../generated-graphql/graphql";
import { MAX_TAKE } from "../../constants/base.const";

export const generateFindAllLimitOrdersByAddressQuery = (props: { address: string; }) => `
  query findAllLimitOrdersByAddress {
    findAllLimitOrder(walletAddress: "${props.address}", take: ${MAX_TAKE}) {
      data {
        id
        fav {
          id
        }
        user {
          address
        }
        type
        status
        stage
        txHash
        price
        amount
        createdAt
        updatedAt
      }
    }
  }
`;

export const generateFindAllLimitOrdersByFavIdQuery = (props: { skip: number, take: number, favId: number, type: LimitOrderType; }) => `
  query findAllLimitOrdersByFavId {
    findAllLimitOrder(skip: ${props.skip}, take: ${props.take}, favId: ${props.favId}, type: "${props.type}", status: "${LimitOrderStatus.Opened}") {
      data {
        id
        fav {
          id
        }
        type
        status
        price
        amount
        createdAt
        updatedAt
      }
      count
    }
  }
`;