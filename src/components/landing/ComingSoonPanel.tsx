import React from "react";
import { FormattedMessage } from "react-intl";

import "./coming-soon-panel.scss";

const ComingSoonPanel = () => {
  return (
    <div className="coming-soon-panel">
      <div className="panel-content">
        <div className="coming-soon-label">
          <FormattedMessage defaultMessage="COMING SOON" />
        </div>
        <div className="panel-title">
          <FormattedMessage defaultMessage="Invest in a new asset class." />
        </div>
        <div className="panel-text">
          <FormattedMessage defaultMessage="A platform designed to give investors access to the largest untapped asset class in the world — people." />
        </div>
      </div>
    </div>
  );
};

export default ComingSoonPanel;
