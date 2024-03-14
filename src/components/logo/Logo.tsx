import React, { HTMLProps } from "react";
import { Link } from "react-router-dom";

import { homePath } from "../../core/util/pathBuilder.util";
import oceanaMarketLogoSrc from "../../assets/images/logo/oceana-market-logo.svg";

const Logo = (props: HTMLProps<unknown>) => {
  return (
    <Link to={homePath()} className={`logo ${props.className || ""}`}>
      <img src={oceanaMarketLogoSrc} alt="Oceana Market Logo" width="178" />
    </Link>
  );
};

export default Logo;
