import React, { useState } from "react";
import { FormattedMessage } from "react-intl";

import {
  FavEntity, LimitOrderStatus, NotificationStatus
} from "../../../../generated-graphql/graphql";
import profilePlaceholderSrc from "../../../assets/images/person-placeholder.svg";
import { CURRENCY, ORDRE_STATUS_DISPLAY_TEXT } from "../../../core/constants/base.const";
import { useAppDispatch, useAppSelector } from "../../../core/hooks/rtkHooks";
import { useLowercasedAccount } from "../../../core/hooks/useLowercasedAccount";
import { FilteredBlockchainHistory } from "../../../core/interfaces/transaction.type";
import * as userActions from "../../../core/store/slices/userSlice";
import { Unit, formatNumber } from "../../../core/util/string.util";
import ResponsiveImage from "../../image/responsive-image/ResponsiveImage";
import OrderSummaryModal from "../../modal/order-summary-modal/OrderSummaryModal";
import { MyOrderItem } from "../../orders/my-orders-panel/MyOrdersPanel";
import OrderStatusLabel from "../../orders/order-status-label/OrderStatusLabel";
import TimeSince from "../../time/time-since/TimeSince";
import BullePoint from "../../util/bullet-point/BulletPoint";
import "./notification-tile.scss";
import { Stage } from "../../../../generated-subgraph/graphql";

const NotificationTile = (props: {
  fav: FavEntity | undefined;
  history: FilteredBlockchainHistory;
  status: NotificationStatus;
}) => {
  const { fav, history, status } = props;

  const dispatch = useAppDispatch();
  const { address, isConnected } = useLowercasedAccount();
  const { fulfilledLimitOrderTxHashMap } = useAppSelector(state => state.user);
  
  const orderData: MyOrderItem = {
    ...history,
    date: new Date(history.createdAt),
    fav,
    status: history.status
  };
  
  const [orderIdDisplayed, setOrderIdDisplayed] = useState<string | null>(null);
  
  const isLimitOrder = orderData.stage === Stage.Limit || fulfilledLimitOrderTxHashMap[orderData.id];

  const amount: number = history.amount;
  const totalPrice = history.pps * amount;
  const createdDateString: string = new Date(+history.createdAt).toISOString();

  const onClose = () => {
    setOrderIdDisplayed(null);
  };

  return (
    <div
      className="notification-tile"
      onClick={() => {
        if (orderIdDisplayed) return;
        if (status === NotificationStatus.Unread && isConnected && address) {
          if (history.id.length === 66 && history.status == LimitOrderStatus.Opened) {
            // This is for the pending transactions of the market buy/sell orders.
            dispatch(userActions.updateNotificationStatusByTxHash({ txHash: history.id, status: NotificationStatus.Read }));
          }
          else {
            // This code send graphql mutation to the backend.
            dispatch(userActions.updateNotification({ txHash: history.id, address: address, status: NotificationStatus.Read }));
          }
        }
        setOrderIdDisplayed(history.id as string);
      }}
    >
      <ResponsiveImage
        images={[{ key: "default", image: fav?.iconImage || "" }]}
        defaultImg={profilePlaceholderSrc}
      />
      <div className="info">
        <span className="title">
          {`${formatNumber({ value: amount, unit: Unit.SHARE, summarize: true })} ${fav?.coin}`}
        </span>
        <div>
          {/* <span className={`type ${history.stage}`}>
            {history.type == OrderType.Buy ? (
              <FormattedMessage defaultMessage="Purchased" />
            ) : (
              <FormattedMessage defaultMessage="Sold" />
            )}
          </span>{" "} */}
          <span className="subtitle">
            <FormattedMessage
              defaultMessage="{orderType, select, BUY {{buyLabel}} other {{sellLabel}}} at {totalPrice} {currency}"
              values={{
                totalPrice: formatNumber({ value: totalPrice, unit: Unit.USDC, summarize: true, decimalToFixed: 2 }),
                orderType: history.type,
                currency: CURRENCY,
                buyLabel: isLimitOrder ? "Limit Buy" : "Buy",
                sellLabel: isLimitOrder ? "Limit Sell" : "Sell"
              }}
            />
          </span>
        </div>
        <div>
          <OrderStatusLabel
            orderStatus={orderData.status || LimitOrderStatus.Fulfilled}
            displayText={ORDRE_STATUS_DISPLAY_TEXT[orderData.status]}
          />
          <BullePoint />
          <TimeSince date={createdDateString} />
        </div>
      </div>
      {status == NotificationStatus.Unread && <div className="read-symbol" />}
      {orderIdDisplayed &&
        <OrderSummaryModal
          order={orderData}
          onClose={onClose}
        />
      }
    </div>
  );
};

export default NotificationTile;
