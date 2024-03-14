import React from "react";

import EquityPanel from "../equity-panel/EquityPanel";

const AddressEquityPanel = (props: {
  totalEquity: number;
  todaysReturn: number;
  todaysReturnPercent: number;
  totalReturn: number;
  totalReturnPercent: number;
  totalCost: number;
  totalFavs: number;
  totalShares: number;
}) => {

  return (
    <EquityPanel
      totalEquity={props.totalEquity}
      totalCost={props.totalCost}
      todaysReturn={props.todaysReturn}
      todaysReturnPercent={props.todaysReturnPercent}
      totalReturn={props.totalReturn}
      totalReturnPercent={props.totalReturnPercent}
      totalFavs={props.totalFavs}
      totalShares={props.totalShares}
      expandedVersion
    />
  );
};

export default AddressEquityPanel;
