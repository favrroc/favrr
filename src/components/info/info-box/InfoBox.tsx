import React, { PropsWithChildren } from "react";

import infoIconPink from "../../../assets/images/info-pink.svg";
import infoIcon from "../../../assets/images/info-purple.svg";
import "./info-box.scss";

const InfoBox = (
  props: PropsWithChildren<{ className: string; pink?: boolean; }>
) => {
  const { className, pink } = props;
  return (
    <div className={`info-box ${className || ""} ${pink ? "pink" : ""}`}>
      <img src={pink ? infoIconPink : infoIcon} />
      <span className="transaction-info">{props.children}</span>
    </div>
  );
};

export default InfoBox;
