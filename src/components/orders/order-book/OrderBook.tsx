import React, { useCallback, useMemo } from "react";
import { FormattedMessage } from "react-intl";

import orderIcon from "../../../assets/images/icon_orders.svg";
import LoadMoreButton from "../../button/load-more-button/LoadMoreButton";
import * as favsActions from "../../../core/store/slices/favsSlice";
import { useAppDispatch, useAppSelector } from "../../../core/hooks/rtkHooks";
import { LimitOrderEntity, LimitOrderType } from "../../../../generated-graphql/graphql";
import { formatNumber, toUSDC, Unit } from "../../../core/util/string.util";
import "./order-book.scss";

const OrderBook = (props: { favId: number; }) => {
  const dispatch = useAppDispatch();
  const { favId } = props;
  const {
    multiFavsInfo,
    loadingLimitBuyOrdersByFavId,
    limitBuyOrdersByFavId,
    hasMoreLimitBuyOrdersByFavId,
    loadingLimitSellOrdersByFavId,
    limitSellOrdersByFavId,
    hasMoreLimitSellOrdersByFavId
  } = useAppSelector(state => state.favs);

  const currentSharePrice = useMemo(() => {
    const favInfo = multiFavsInfo[favId.toString()];
    if (favInfo && !favInfo.isIPO) {
      return favInfo.data.marketPrice;
    }
    else {
      return 1;
    }
  }, [multiFavsInfo]);

  const loadMore = (isBuyOrder: boolean) => {
    if (isBuyOrder) {
      dispatch(favsActions.loadLimitBuyOrdersByFavId({ favId, skip: limitBuyOrdersByFavId.length }));
    }
    else {
      dispatch(favsActions.loadLimitSellOrdersByFavId({ favId, skip: limitSellOrdersByFavId.length }));
    }
  };

  const renderNoOrders = useCallback((type: LimitOrderType) => (
    <div className="empty-order-container">
      <img src={orderIcon} className="empty-order-icon" />
      <div>
        {type == LimitOrderType.Buy ? (
          <FormattedMessage defaultMessage="No Buy Orders" />
        ) : (
          <FormattedMessage defaultMessage="No Sell Orders" />
        )}
      </div>
    </div>
  ), []);

  const renderOrderRow = (transaction: LimitOrderEntity, i: number, isBuyOrder: boolean) => {
    const pps = toUSDC(transaction.price?.toString());
    const shares = transaction.amount || 0;
    const totalPrice = pps * shares;

    return (
      <div key={i} className={`order-row ${isBuyOrder ? "buy" : "sell"}`}>
        <span className="row-item">
          <span>{formatNumber({ value: pps, unit: Unit.USDC, summarize: false, withUnit: true })}</span>
          <span className="usd-price">
            {" " + formatNumber({ value: pps, unit: Unit.USD, summarize: true, withUnit: true })}
          </span>
        </span>
        <span>{formatNumber({ value: shares, unit: Unit.SHARE, summarize: true })}</span>
        <span className="row-item">
          <span>{formatNumber({ value: totalPrice, unit: Unit.USDC, summarize: false, withUnit: true })}</span>
          <span className="usd-price">
            {" " + formatNumber({ value: totalPrice, unit: Unit.USD, summarize: true, withUnit: true })}
          </span>
        </span>
      </div>
    );
  };

  if (limitBuyOrdersByFavId.length == 0 && limitSellOrdersByFavId.length == 0) {
    return (
      <div className="order-book">
        <div className="empty-order-container">
          <img src={orderIcon} className="empty-order-icon" />
          <div>
            <FormattedMessage defaultMessage="No Orders" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-book">
      <div className="order-book--header">
        <span className="row-item">
          <FormattedMessage defaultMessage="Price Per Share" />
        </span>
        <span>
          <FormattedMessage defaultMessage="Shares" />
        </span>
        <span className="row-item">
          <FormattedMessage defaultMessage="Total Price" />
        </span>
      </div>
      {limitSellOrdersByFavId.length == 0 && renderNoOrders(LimitOrderType.Sell)}
      {limitSellOrdersByFavId.map((order, i) => renderOrderRow(order, i, false))}
      {hasMoreLimitSellOrdersByFavId && (
        <LoadMoreButton onClick={() => loadMore(false)} loading={loadingLimitSellOrdersByFavId} />
      )}
      <div className="last-pps">
        <span>
          <FormattedMessage defaultMessage="Last Price Per Share" />
        </span>
        <span>
          <span>{formatNumber({ value: currentSharePrice, unit: Unit.USDC, summarize: false, withUnit: true })}</span>
          <span className="usd-price">
            {" " + formatNumber({ value: currentSharePrice, unit: Unit.USD, summarize: true, withUnit: true })}
          </span>
        </span>
      </div>

      {limitBuyOrdersByFavId.length == 0 && renderNoOrders(LimitOrderType.Buy)}
      {limitBuyOrdersByFavId.map((order, i) => renderOrderRow(order, i, true))}
      {hasMoreLimitBuyOrdersByFavId && (
        <LoadMoreButton onClick={() => loadMore(true)} loading={loadingLimitBuyOrdersByFavId} />
      )}
    </div>
  );
};

export default OrderBook;
