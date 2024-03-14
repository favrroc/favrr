import dayjs from "dayjs";
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import styled from "styled-components";

import {
  LimitOrderStatus,
  LimitOrderType,
  NotificationStatus
} from "../../../../generated-graphql/graphql";
import {
  OrderType,
  Stage
} from "../../../../generated-subgraph/graphql";
import {
  CHAIN,
  ORDRE_STATUS_DISPLAY_TEXT
} from "../../../core/constants/base.const";
import { oceanaShareExContract } from "../../../core/constants/contract";
import { colors } from "../../../core/constants/styleguide.const";
import { useAppDispatch, useAppSelector } from "../../../core/hooks/rtkHooks";
import { useWatchResize } from "../../../core/hooks/useWatchResize";
import { setShowOrderPlacedModal } from "../../../core/store/slices/modalSlice";
import * as userActions from "../../../core/store/slices/userSlice";
import { favPath } from "../../../core/util/pathBuilder.util";
import { Unit, formatNumber, toTitleCase } from "../../../core/util/string.util";
import BackButton from "../../button/back-button/BackButton";
import ModalCloseButton from "../../button/modal-close-button/ModalCloseButton";
import FavThumb from "../../fav/fav-thumb/FavThumb";
import InfoBox from "../../info/info-box/InfoBox";
import { MyOrderItem } from "../../orders/my-orders-panel/MyOrdersPanel";
import OrderStatusLabel from "../../orders/order-status-label/OrderStatusLabel";
import { ActionButtonGroup, ButtonPrimary, ButtonSecondary, Flex, H3, H4 } from "../../styleguide/styleguide";
import Modal from "../Modal";
import ModalContent from "../children/modal-content/ModalContent";
import "./order-summary-modal.scss";

const mobileWidth = 375;

interface Props {
  order: MyOrderItem;
  onClose: () => void;
}
const OrderSummaryModal = (props: Props) => {
  const { order, onClose } = props;
  const dispatch = useAppDispatch();
  const { windowWidth } = useWatchResize();
  const { fulfilledLimitOrderTxHashMap } = useAppSelector(state => state.user);
  const [isConfirmModal, setIsConfirmModal] = useState(false);

  const isLimitOrder = order.stage === Stage.Limit || fulfilledLimitOrderTxHashMap[order.id];

  const orderTypeLabel = (order.stage == Stage.Ipo ? "IPO "
    : isLimitOrder ? "Limit "
      : "Market ") + toTitleCase(order.type);

  const orderDateTimeLabel = ` • ${dayjs(+order.createdAt).format("MMM D, h:mma")}`;

  const pps = formatNumber({
    value: order.ppsBefore,
    unit: Unit.USDC,
    summarize: false,
    withUnit: true,
  });

  const numOfShares = formatNumber({
    value: order.amount,
    unit: Unit.SHARE,
    summarize: false
  });

  const totalPriceUSDC = formatNumber({
    value: order.pps * order.amount,
    unit: Unit.USDC,
    summarize: false,
    withUnit: true,
  });

  const totalPriceUSD = formatNumber({
    value: order.pps * order.amount,
    unit: Unit.USD,
    summarize: false,
    withUnit: true,
  });

  const onClickContinueWithdraw = () => {
    // update status from "Processing" to "Withdrawn"
    // remove limit order from the store
    dispatch(
      userActions.withdrawLimitOrder({
        id: order.id,
        favId: order.favId,
        type:
          order.type == OrderType.Buy
            ? LimitOrderType.Buy
            : LimitOrderType.Sell,
        price: order.pps * 10 ** oceanaShareExContract.decimals,
        amount: order.amount,
      })
    );

    // update notification from "Processing" to "Withdrawn" on the backend
    // set tx status of txHash to Unread on the store
    dispatch(userActions.createNotification({
      txHash: order.id as string,
      address: order.address as string,
      status: NotificationStatus.Unread
    }));

    // display Order Withdrawn modal
    dispatch(setShowOrderPlacedModal({
      showModal: true,
      props: {
        amount: 0,
        orderStatus: LimitOrderStatus.Cancelled,
        orderType: OrderType.Buy,
        stage: Stage.Limit,
        totalPrice: 0,
        transactionHash: order.id,
        tokenName: order?.fav?.coin || ""
      }
    }));

    onClose();
  };

  return (
    <Modal>
      <ModalContent className="order-summary-modal">
        {windowWidth <= mobileWidth && (
          <BackButton onClose={() => isConfirmModal ? setIsConfirmModal(false) : onClose()} />
        )}
        <div>
          {isConfirmModal ? (
            <>
              {windowWidth > mobileWidth ? (
                <>
                  <Flex className="justify-between align-center">
                    <H3 className="font-neutrals8 text-center"> Withdraw </H3>
                    <ModalCloseButton onClose={props.onClose} />
                  </Flex>
                </>
              ) : (
                <H4 className="font-neutrals8"> Withdraw </H4>
              )}
            </>
          ) : (
            <Flex className="justify-between align-center">
              <div>
                <H4 className="font-neutrals8">
                  Order Summary
                </H4>
                <br />
                <span className="order-status">
                  <OrderStatusLabel
                    orderStatus={order.status}
                    displayText={ORDRE_STATUS_DISPLAY_TEXT[order.status]}
                  />
                </span>
              </div>
              {windowWidth > mobileWidth && <ModalCloseButton onClose={props.onClose} />}
            </Flex>
          )}
        </div>
        <div className="transaction-info">
          <Link to={favPath(order.fav?.title as string)} onClick={() => props.onClose()}>
            <FavThumb
              images={[{ key: "default", image: order.fav?.iconImage || "" }]}
              size={64}
              style={{ borderRadius: 16 }}
            />
          </Link>

          <div>
            <div>
              {order.type == OrderType.Buy || order.type == OrderType.Sell ? (
                <Link to={favPath(order.fav?.title as string)} onClick={() => props.onClose()}>
                  <span>{order.fav?.displayName}</span>
                  <span className="coin-tag">{order.fav?.coin}</span>
                </Link>
              ) : (
                <></>
              )}
            </div>
            <div className="type-date">
              {order.type == OrderType.Buy || order.type == OrderType.Sell ? (
                <>
                  <span className="order-type">{orderTypeLabel}</span>
                  <span className="date-label">{orderDateTimeLabel}</span>
                </>
              ) : (
                <>
                </>
              )}
            </div>
          </div>
        </div>
        {!isConfirmModal && (
          <h3 className="details-title">
            <FormattedMessage defaultMessage="Order Details" />
          </h3>
        )}
        <div>
          {order.type == OrderType.Buy || order.type == OrderType.Sell ? (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {isLimitOrder && (
                  <div className="detail-row">
                    <span className="field-name">Limit Share Price</span>
                    <span className="field-value">
                      {pps}
                    </span>
                  </div>
                )}
                <div className="detail-row">
                  <span className="field-name">Number of Shares</span>
                  <span className="field-value">
                    {numOfShares}
                  </span>
                </div>
                {order.status == LimitOrderStatus.Cancelled && (
                  <>
                    <li className="detail-row">
                      <span className="field-name">Filled Shares</span>
                      <span className="field-value">0</span>
                    </li>
                    <li className="detail-row">
                      <span className="field-name">Withdrawn Shares</span>
                      <span className="field-value">
                        {numOfShares}
                      </span>
                    </li>
                  </>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}></div>
          )}
          <hr />
          {(order.type == OrderType.Buy || order.type == OrderType.Sell) &&
            !isLimitOrder && (
            <div className="detail-row" style={{ marginBottom: "12px" }}>
              <span className="field-name">Share Price</span>
              <div className="field-value">
                {pps}
              </div>
            </div>
          )}
          <div className="detail-row">
            <span className="field-name">
              <FormattedMessage defaultMessage="Total Price" />
            </span>
            <div className="field-value">
              <div>
                {totalPriceUSDC}
              </div>
              <div className="usd-price">
                {totalPriceUSD}
              </div>
            </div>
          </div>
        </div>
        {isConfirmModal && (
          <StyledInfoBox>
            You are about to withdraw your order. This action cannot be undone.
          </StyledInfoBox>
        )}
        <ActionButtonGroup>
          {isConfirmModal ? (
            <>
              <ButtonSecondary onClick={() => setIsConfirmModal(false)}> Cancel </ButtonSecondary>
              <ButtonPrimary onClick={onClickContinueWithdraw}> Withdraw Now </ButtonPrimary>
            </>
          ) : (
            <>
              {/* Don't show "Withdraw Order" button for the pending transactions on the blockchain. */}
              {order.status == LimitOrderStatus.Opened && order.id.length < 66 && (
                <ButtonSecondary onClick={() => setIsConfirmModal(true)}> Withdraw </ButtonSecondary>
              )}
              <ButtonPrimary onClick={props.onClose}> OK </ButtonPrimary>
            </>
          )}
        </ActionButtonGroup>
        {order.status == LimitOrderStatus.Fulfilled && (
          <a
            href={`${CHAIN?.blockExplorers?.default.url}/tx/${order.id}`}
            target="_blank"
            referrerPolicy="no-referrer"
            rel="noreferrer"
            className="ether-scan-link"
          >
            <FormattedMessage defaultMessage="View on Etherscan" />
          </a>
        )}
      </ModalContent >
    </Modal >
  );
};

const StyledInfoBox = styled(InfoBox)`
  color: ${colors.neutrals6} !important;
`;

export default OrderSummaryModal;
