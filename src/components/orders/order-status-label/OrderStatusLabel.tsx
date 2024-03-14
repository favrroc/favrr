import React from "react";

import { LimitOrderStatus } from "../../../../generated-graphql/graphql";
import "./order-status-label.scss";

const OrderStatusLabel = (props: {
  displayText?: string;
  orderStatus: LimitOrderStatus;
}) => {
  const { displayText, orderStatus } = props;

  const orderStatusLabel = {
    [LimitOrderStatus.Fulfilled]: "completed",
    [LimitOrderStatus.Opened]: "pending",
    [LimitOrderStatus.Cancelled]: "withdrawn",
    [LimitOrderStatus.Rejected]: "rejected"
  };

  return (
    <span className={`order-status-label ${orderStatusLabel[orderStatus]}`}>
      {displayText}
    </span>
  );
};

export default OrderStatusLabel;
