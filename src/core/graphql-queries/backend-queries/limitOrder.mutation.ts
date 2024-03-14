import { LimitOrderStatus, LimitOrderType } from "../../../../generated-graphql/graphql";
import { Stage } from "../../../../generated-subgraph/graphql";

export const generateCreateLimitOrderMutation = (props: { favId: number, type: LimitOrderType, status: LimitOrderStatus, price: number, amount: number; }) => `
  mutation createLimitOrder {
    createLimitOrder(createLimitOrderInput: { favId: ${props.favId}, type: ${props.type}, status: ${props.status}, price: ${props.price} amount: ${props.amount} }) {
      id
      amount
      fav {
        id
      }
      price
      status
      type
      user {
        address
      }
    }
  }
`;

export const generateCreateRejectedOrderMutation = (props: {
  favId: number,
  type: LimitOrderType,
  status: LimitOrderStatus,
  price: number,
  amount: number,
  stage: Stage
}) => `
  mutation createRejectedOrder {
    createLimitOrder(createLimitOrderInput: { favId: ${props.favId}, type: ${props.type}, status: ${props.status}, price: ${props.price}, amount: ${props.amount}, stage: "${props.stage}" }) {
      id
      amount
      fav {
        id
      }
      price
      status
      type
      user {
        address
      }
    }
  }
`;

export const generateUpdateLimitOrderMutation = (props: { id: string, favId: number, type: LimitOrderType, status: LimitOrderStatus, price: number, amount: number; }) => `
  mutation updateLimitOrder {
    updateLimitOrder(limitOrderId: "${props.id}" updateLimitOrderInput: { favId: ${props.favId}, type: ${props.type}, status: ${props.status}, price: ${props.price} amount: ${props.amount} }) {
      id
    }
  }
`;