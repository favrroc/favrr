import React, { useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import styled from "styled-components";

import { FavEntity, LimitOrderStatus } from "../../../../generated-graphql/graphql";
import emptyOrdersSrc from "../../../assets/images/icon_orders.svg";
import { ORDRE_STATUS_DISPLAY_TEXT } from "../../../core/constants/base.const";
import { useAppSelector } from "../../../core/hooks/rtkHooks";
import { useWatchResize } from "../../../core/hooks/useWatchResize";
import { FilteredBlockchainHistory } from "../../../core/interfaces/transaction.type";
import { Unit, formatNumber } from "../../../core/util/string.util";
import LoadMoreButton from "../../button/load-more-button/LoadMoreButton";
import FavThumb from "../../fav/fav-thumb/FavThumb";
import ExclusivePicker from "../../input/exclusive-picker/ExclusivePicker";
import Loader from "../../loader/Loader";
import OrderSummaryModal from "../../modal/order-summary-modal/OrderSummaryModal";
import TimeSince from "../../time/time-since/TimeSince";
import OrderStatusLabel from "../order-status-label/OrderStatusLabel";
import "./my-orders-panel.scss";

export interface MyOrderItem extends FilteredBlockchainHistory {
  date: Date;
  fav: FavEntity | null | undefined;
}

const OrderRow = (props: {
  order: MyOrderItem;
  onClick: () => void;
  numberOfColumns: number;
}) => {
  const { order, onClick, numberOfColumns } = props;

  const shares = props.order.amount;
  const pps = props.order.pps;

  const statusLabel = useMemo(() => (
    <div className={`order-status ${order.status || LimitOrderStatus.Fulfilled}`}>
      <OrderStatusLabel
        orderStatus={order.status || LimitOrderStatus.Fulfilled}
        displayText={ORDRE_STATUS_DISPLAY_TEXT[order.status]}
      />
    </div>
  ), [order.status]);

  const typeLabel = (
    <div className={`${order?.type || ""} order-type`}>{order?.type}</div>
  );

  return (
    <tr className="order-row" onClick={onClick}>
      <td style={{ display: "table-cell" }}>
        <div
          className={`image-name-container ${numberOfColumns >= 5 ? "row" : "column"}`}
        >
          <FavThumb
            images={[{ key: "default", image: order.fav?.iconImage || "" }]}
            size={40}
            style={{ margin: "auto 0px" }}
          />
          <div>
            {numberOfColumns >= 5 && <div>{order?.fav?.displayName}</div>}
            <div
              className={numberOfColumns >= 5 ? "secondary-info" : undefined}
              style={{
                textAlign: numberOfColumns >= 5 ? "left" : "center",
              }}
            >
              {order?.fav?.coin}
            </div>
          </div>
        </div>
      </td>
      <td>
        <div>
          {formatNumber({ value: pps, unit: Unit.USDC, summarize: false, withUnit: true })}
        </div>
        <div className="secondary-info">
          {formatNumber({ value: pps, unit: Unit.USD, summarize: false, withUnit: true })}
        </div>
        {numberOfColumns < 4 && (
          <span>
            {formatNumber({ value: shares, unit: Unit.SHARE, summarize: true })}{" "}
            <span className="secondary-info">
              <FormattedMessage defaultMessage="shares" />
            </span>
          </span>
        )}
      </td>

      {numberOfColumns >= 4 && <td>{formatNumber({ value: shares, unit: Unit.SHARE, summarize: true })}</td>}
      <td>
        {numberOfColumns < 5 && typeLabel}
        {statusLabel}
        <TimeSince date={order.date.toISOString()} />
      </td>
      {numberOfColumns >= 5 && <td>{typeLabel}</td>}
    </tr>
  );
};

const ITEMS_PER_PAGE = 4;

const MyOrdersPanel = () => {
  const { favsById } = useAppSelector(state => state.favs);
  const { userTransactions, loading } = useAppSelector(state => state.user);
  const { windowWidth } = useWatchResize();

  const [statusFilter, setStatusFilter] = useState<LimitOrderStatus | null>(null);
  const [ordersShowAmount, setOrdersShowAmount] = useState<number>(ITEMS_PER_PAGE);
  const [orderDisplayed, setOrderDisplayed] = useState<MyOrderItem | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const fetchMore = () => setOrdersShowAmount(ordersShowAmount + ITEMS_PER_PAGE);

  const filteredBlockchainHistories: FilteredBlockchainHistory[] = useMemo(() => {
    const _userTransactions = statusFilter == null ? userTransactions : userTransactions.filter(o => o.status == statusFilter);
    setHasMore(ordersShowAmount < _userTransactions.length);

    return _userTransactions.filter((o, idx) => idx < ordersShowAmount);
  }, [userTransactions, ordersShowAmount, statusFilter]);


  let numberOfColumns = 5;
  if (windowWidth < 1160) {
    numberOfColumns = 4;
  }
  if (windowWidth <= 430) {
    numberOfColumns = 3;
  }

  return (
    <>
      <StyledH2>My Orders</StyledH2>
      <div className="my-orders-panel">
        {(statusFilter != null || filteredBlockchainHistories.length != 0) && (
          <ExclusivePicker
            value={statusFilter || "ALL"}
            options={[
              {
                value: "ALL",
                label: "All",
              },
              {
                value: LimitOrderStatus.Opened,
                label: "Open",
              },
              {
                value: LimitOrderStatus.Fulfilled,
                label: "Completed",
              },
              {
                value: LimitOrderStatus.Cancelled,
                label: "Withdrawn",
              },
              {
                value: LimitOrderStatus.Rejected,
                label: "Rejected",
              }
            ]}
            onChange={(status) => {
              setStatusFilter(status == "ALL" ? null : status);
            }}
          />
        )}
        <table>
          {filteredBlockchainHistories.length != 0 && (
            <thead>
              <tr>
                <th>
                  <FormattedMessage defaultMessage="Asset" />
                </th>
                <th>
                  <FormattedMessage defaultMessage="Share Price" />
                </th>
                {numberOfColumns >= 4 && (
                  <th>
                    <FormattedMessage defaultMessage="Shares" />
                  </th>
                )}
                {numberOfColumns >= 5 && (
                  <th>
                    <FormattedMessage defaultMessage="Status" />
                  </th>
                )}
                <th>
                  <FormattedMessage defaultMessage="Type" />
                </th>
              </tr>
            </thead>
          )}
          <tbody>
            {!filteredBlockchainHistories ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", paddingTop: 50 }}>
                  <Loader />
                </td>
              </tr>
            ) : (
              <>
                {filteredBlockchainHistories?.map(order => {
                  const orderItem: MyOrderItem = {
                    ...order,
                    date: new Date(order.createdAt),
                    fav: favsById[order.favId]
                  };
                  return (
                    <OrderRow
                      key={order.id}
                      order={orderItem}
                      onClick={() => setOrderDisplayed(orderItem)}
                      numberOfColumns={numberOfColumns}
                    />
                  );
                })}
                {filteredBlockchainHistories.length == 0 && (
                  <tr>
                    <td className="no-orders" colSpan={5}>
                      <div className="empty-order">
                        <img src={emptyOrdersSrc} />
                        <div>
                          <FormattedMessage defaultMessage="No Orders Yet" />
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
        {hasMore ? (
          <div style={{ width: "100%", textAlign: "center", display: "flex", justifyContent: "center" }}>
            <LoadMoreButton loading={loading.toString()} onClick={fetchMore} />
          </div>
        ) : null}
      </div>
      {orderDisplayed && (
        <OrderSummaryModal
          order={orderDisplayed}
          onClose={() => setOrderDisplayed(null)}
        />
      )}
    </>
  );
};

const StyledH2 = styled.h2`
  font-family: 'DM Sans';
  font-style: normal;
  font-weight: 700;
  font-size: 40px;
  line-height: 48px;
  letter-spacing: -0.01em;
  color: #FCFCFD;
  margin: 48px 0 40px;
  @media screen and (max-width: 576px) {
    font-size: 32px;
    margin-top: 64px;
  }
`;

export default MyOrdersPanel;
