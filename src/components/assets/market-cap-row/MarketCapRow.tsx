import React from "react";
import { FormattedMessage } from "react-intl";

import { FavInfo } from "../../../../generated-subgraph/graphql";
import infoSrc from "../../../assets/images/info.svg";
import { DEFAULT_IPO_AVAILABLE_SHARES } from "../../../core/constants/base.const";
import { colors } from "../../../core/constants/styleguide.const";
import { formatNumber, Unit } from "../../../core/util/string.util";
import { Body2 } from "../../styleguide/styleguide";
import Tooltip from "../../tooltip/Tooltip";
import "./market-cap-row.scss";

const MarketCapRow = (props: {
  isIPO: boolean;
  marketCap: number;
  sharesDelta: number;
  volumeUSDCDelta: number;
  marketPriceDelta: number;
  favInfo: FavInfo;
}) => {
  const { isIPO, marketCap, sharesDelta, favInfo, volumeUSDCDelta } = props;

  const newMarketCap = formatNumber({
    value: marketCap,
    unit: Unit.USDC,
    summarize: true,
    withUnit: true
  }).replace(/(.[0-9])[0-9]/, "$1");

  return (
    <div className="market-cap-row">
      <div className="field">
        <span>{newMarketCap}</span>
        <span className="field-name">
          <FormattedMessage defaultMessage="Market Cap" />
          <Tooltip
            tooltip={
              <>
                <div className="tooltip-title">
                  <FormattedMessage defaultMessage="What's market cap?" />
                </div>
                <div className="tooltip-text">
                  <FormattedMessage defaultMessage="An easy way to measure the value of a celeb's stock. It's calculated by taking the total number of celeb shares and multiplying them by their price per share." />
                </div>
              </>
            }
            position="top"
          >
            <img src={infoSrc} />
          </Tooltip>
        </span>
      </div>
      {isIPO ? (
        <div className="field">
          <span>
            <FormattedMessage
              defaultMessage="{left}<Grey> of {total}</Grey>"
              values={{
                left: formatNumber({ value: favInfo.availableSupply, unit: Unit.SHARE, summarize: true }),
                total: formatNumber({ value: DEFAULT_IPO_AVAILABLE_SHARES, unit: Unit.SHARE, summarize: true }),
                Grey: (content: JSX.Element) => (
                  <Body2 style={{ color: colors.neutrals4 }}>{content}</Body2>
                ),
              }}
            />
          </span>
          <span className="field-name">
            <FormattedMessage defaultMessage="IPO Shares Available" />
            <Tooltip
              tooltip={
                <>
                  <div className="tooltip-title">
                    <FormattedMessage defaultMessage="What's IPO shares available?" />
                  </div>
                  <div className="tooltip-text">
                    <FormattedMessage defaultMessage="The number of shares that are still available to buy in the IPO phase." />
                  </div>
                </>
              }
              position="top"
            >
              <img src={infoSrc} />
            </Tooltip>
          </span>
        </div>
      ) : (
        <div className="field">
          <span>
            <FormattedMessage
              defaultMessage="{shares}<Grey> of {total}</Grey>"
              values={{
                shares: formatNumber({ value: sharesDelta, unit: Unit.SHARE, summarize: true }),
                total: formatNumber({ value: DEFAULT_IPO_AVAILABLE_SHARES, unit: Unit.SHARE, summarize: true }),
                Grey: (content: JSX.Element) => (
                  <Body2 style={{ color: colors.neutrals4 }}>{content}</Body2>
                ),
              }}
            />
          </span>
          {/* Replace this with volume in shares */}
          <span className="field-name">
            <FormattedMessage defaultMessage="Share Volume (24h)" />
            <Tooltip
              tooltip={
                <>
                  <div className="tooltip-title">
                    <FormattedMessage defaultMessage="What's share volume?" />
                  </div>
                  <div className="tooltip-text">
                    <FormattedMessage
                      defaultMessage="The number of{oceana, select, true {} other { FAV}} shares {term} the past 24 hours."
                      values={{
                        oceana: true,
                        term: isIPO ? "sold in" : "traded over",
                      }}
                    />
                  </div>
                </>
              }
              position="top"
            >
              <img src={infoSrc} />
            </Tooltip>
          </span>
        </div>
      )}

      <div className="field">
        <span>{formatNumber({ value: volumeUSDCDelta, unit: Unit.USDC, summarize: true, withUnit: true })}</span>
        <span className="field-name">
          <FormattedMessage defaultMessage="USDC Volume (24h)" />
          <Tooltip
            tooltip={
              <>
                <div className="tooltip-title">
                  <FormattedMessage defaultMessage="What's USDC volume?" />
                </div>
                <div className="tooltip-text">
                  <FormattedMessage
                    defaultMessage="The USDC value of {ipoText} {oceana, select, true {} other { FAV}} shares {term} in the past 24 hours."
                    values={{
                      oceana: true,
                      term: isIPO ? "sold" : "traded",
                      ipoText: isIPO ? "IPO" : "",
                    }}
                  />
                </div>
              </>
            }
            position="top"
          >
            <img src={infoSrc} />
          </Tooltip>
        </span>
      </div>
    </div>
  );
};

export default MarketCapRow;
