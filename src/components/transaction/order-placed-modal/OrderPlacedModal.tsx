import React from "react";
import { FormattedMessage } from "react-intl";

import { useAppDispatch } from "../../../core/hooks/rtkHooks";
import { setShowOrderPlacedModal } from "../../../core/store/slices/modalSlice";
import { formatNumber, Unit } from "../../../core/util/string.util";
import ModalContent from "../../modal/children/modal-content/ModalContent";
import Modal from "../../modal/Modal";
import OrderStatusLabel from "../../orders/order-status-label/OrderStatusLabel";
import { Block, Caption, CaptionBold, H3 } from "../../styleguide/styleguide";

import { LimitOrderStatus } from "../../../../generated-graphql/graphql";
import { OrderType, Stage } from "../../../../generated-subgraph/graphql";
import { CURRENCY, ORDRE_STATUS_DISPLAY_TEXT } from "../../../core/constants/base.const";
import "./order-placed-modal.scss";

export interface IOrderPlacedModalProps {
  amount: number;
  tokenName?: string;
  stage: Stage;
  orderType: OrderType;
  transactionHash: string;
  totalPrice: number;
  orderStatus: LimitOrderStatus;
}
const OrderPlacedModal = (props: IOrderPlacedModalProps) => {
  const dispatch = useAppDispatch();
  const {
    amount,
    tokenName,
    transactionHash,
    stage,
    orderType,
    totalPrice,
    orderStatus,
  } = props;

  const closeModal = () => dispatch(setShowOrderPlacedModal({ showModal: false }));

  const amountLabel = formatNumber({
    value: amount,
    unit: Unit.SHARE,
    summarize: false,
    withUnit: false,
    decimalToFixed: 0
  });

  const totalPriceLabel = formatNumber({
    value: totalPrice,
    unit: Unit.USDC,
    summarize: false,
  });

  const IpoCaptionEl = <div>You purchased <b>{formatNumber({
    value: amount,
    unit: Unit.SHARE,
    summarize: false,
    withUnit: false,
    decimalToFixed: 0
  })} {tokenName}</b></div>;

  return (
    <Modal>
      <ModalContent className="order-placed-modal" onClose={closeModal}>
        <Block className="text-center font-neutrals7">
          <H3>
            {orderStatus === LimitOrderStatus.Cancelled ? (
              <FormattedMessage defaultMessage="Order Withdrawn" />
            ) : (
              <>
                {stage === Stage.Limit ? (
                  <>
                    <span>Limit</span>
                    <br />
                    <span>Order Placed</span>
                  </>
                ) : (
                  <FormattedMessage defaultMessage="Order Placed" />
                )}
              </>
            )}
          </H3>
        </Block>

        <div className="purchased-token-number">
          {(orderStatus !== LimitOrderStatus.Cancelled) &&
            (stage === Stage.Ipo ? (
              IpoCaptionEl
            ) : (
              <FormattedMessage
                defaultMessage="{stage, select, market {Market} limit {Limit} other {}} {orderType} of <b>{amount} {tokenName}</b> at <b>{totalPrice} {currency}</b>"
                values={{
                  amount: amountLabel,
                  tokenName,
                  b: (content: JSX.Element) => <b>{content}</b>,
                  stage: stage === Stage.Limit ? "limit" : "market",
                  orderType: orderType === OrderType.Buy ? "Buy" : "Sell",
                  totalPrice: totalPriceLabel,
                  currency: CURRENCY,
                }}
              />
            ))}
        </div>

        <div className="transaction-box">
          <div className="column">
            <Caption className="font-neutrals4">Status</Caption>
            <span
              className={`transaction-status ${orderStatus == LimitOrderStatus.Opened ? "pending" : orderStatus == LimitOrderStatus.Cancelled ? "failed" : "completed"}`}
            >
              <OrderStatusLabel
                displayText={ORDRE_STATUS_DISPLAY_TEXT[orderStatus]}
                orderStatus={orderStatus}
              />
            </span>
          </div>
          <div className="column">
            <Caption className="font-neutrals4">Order ID</Caption>
            <CaptionBold className="font-neutrals8">
              {`${transactionHash?.slice(0, 6)}...${transactionHash?.slice(
                -4
              )}`}
            </CaptionBold>
          </div>
        </div>

        <button
          className="action-button primary-button done-btn"
          onClick={closeModal}
        >
          <FormattedMessage defaultMessage="Done" />
        </button>
      </ModalContent>
    </Modal>
  );
};

export default OrderPlacedModal;
