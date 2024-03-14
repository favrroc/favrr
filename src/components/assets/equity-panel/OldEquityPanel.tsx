import React from "react";
import { FormattedMessage } from "react-intl";

import { DEFAULT_POOL_SIZE } from "../../../core/constants/base.const";
import { getColorOfValue } from "../../../core/util/base.util";
import { formatNumber, Unit } from "../../../core/util/string.util";
import "./old-equity-panel.scss";

const OldEquityPanel = (props: {
  totalEquity: number;
  totalCost: number;
  todaysReturn: number;
  todaysReturnPercent: number;
  totalReturn: number;
  totalReturnPercent: number;
  totalFavs?: number;
  totalShares?: number;
  shares?: number;
  currentPrice?: number;
  expandedVersion?: boolean;
  coin?: string;
}) => {
  const {
    totalEquity,
    totalCost,
    todaysReturn,
    todaysReturnPercent,
    totalReturn,
    totalReturnPercent,
    totalFavs,
    totalShares,
    coin,
    expandedVersion,
  } = props;

  return (
    <div className="old-equity-panel">
      <div className="old-equity-section">
        <div className="old-upper-section">
          <div className="old-title-section">
            <FormattedMessage
              defaultMessage="My {coin, select, null {Total} other {{coin}}} Equity"
              values={{ coin: coin || null }}
            />
          </div>
          <span className="old-main-values-container">
            <span className="old-main-value">{formatNumber({ value: totalEquity, unit: Unit.USDC, summarize: false, withUnit: true })}</span>
            <span className="old-usd-value">{formatNumber({ value: totalEquity, unit: Unit.USD, summarize: true, withUnit: true })}</span>
          </span>
        </div>
        {expandedVersion && (
          <div className="old-bottom-section">
            <div className="old-field-row">
              <span className="old-field-name">
                <FormattedMessage defaultMessage="Today's Return" />
              </span>
              <span className="old-field-value">
                <span className={`eth-value ${getColorOfValue(todaysReturn)}`}>
                  {formatNumber({ value: todaysReturn, unit: Unit.USDC, summarize: true, withUnit: true, withSign: true })}
                </span>
                <span>{formatNumber({ value: todaysReturnPercent, unit: Unit.PERCENT, summarize: true, withUnit: true })}</span>
              </span>
            </div>
            <div className="old-field-row">
              <span className="old-field-name">
                <FormattedMessage defaultMessage="Total Return" />
              </span>
              <span className="old-field-value">
                <span className={`eth-value ${getColorOfValue(totalReturn)}`}>
                  {formatNumber({ value: totalReturn, unit: Unit.USDC, summarize: true, withSign: true, withUnit: true })}
                </span>
                <span>{formatNumber({ value: totalReturnPercent, unit: Unit.PERCENT, summarize: true, withUnit: true })}</span>
              </span>
            </div>
          </div>
        )}
      </div>
      <div className="old-panel-separator" />
      <div className="old-equity-section">
        <div className="old-upper-section">
          <div className="old-title-section">
            {expandedVersion ? (
              <FormattedMessage
                defaultMessage="My {coin, select, null {Total} other {{coin} Average}} Cost"
                values={{ coin: coin || null }}
              />
            ) : totalShares == null || totalShares == undefined ? (
              <FormattedMessage defaultMessage="Yours shares" />
            ) : (
              <FormattedMessage defaultMessage="Yours FAVs" />
            )}
          </div>
          <div>
            <span className="old-main-values-container">
              <span className="old-main-value">
                {formatNumber({ value: totalCost, unit: Unit.USDC, summarize: false, withUnit: true })}
              </span>
              <span className="old-usd-value">{formatNumber({ value: totalCost, unit: Unit.USD, summarize: true, withUnit: true })}</span>
            </span>
          </div>
        </div>
        {expandedVersion &&
          (totalShares == null || totalShares == undefined ? (
            <div className="old-bottom-section">
              <div className="old-field-row">
                <span className="old-field-name">
                  <FormattedMessage defaultMessage="Shares" />
                </span>
                <span className="old-field-value">
                  <span className="old-white">{formatNumber({ value: props.shares, unit: Unit.SHARE, summarize: true }) + " "}</span>
                  <span>
                    <FormattedMessage
                      defaultMessage="of {sharesPool}"
                      values={{
                        sharesPool: formatNumber({ value: DEFAULT_POOL_SIZE, unit: Unit.SHARE, summarize: true }),
                      }}
                    />
                  </span>
                </span>
              </div>
              <div className="old-field-row">
                <span className="old-field-name">
                  <FormattedMessage defaultMessage="Current Price" />
                </span>
                <span className="old-field-value">
                  <span className="old-eth-value">
                    {`${formatNumber({ value: props.currentPrice, unit: Unit.USDC, summarize: false, withUnit: true })}`}
                  </span>
                  <span>
                    {`${formatNumber({ value: props.currentPrice, unit: Unit.USD, summarize: true, withUnit: true })}`}
                  </span>
                </span>
              </div>
            </div>
          ) : (
            <div className="old-bottom-section">
              <div className="old-field-row">
                <span className="old-field-name">
                  <FormattedMessage
                    defaultMessage="Total Stocks"
                  />
                </span>
                <span className="old-field-value white">
                  <span>{totalFavs}</span>
                </span>
              </div>
              <div className="old-field-row">
                <span className="old-field-name">
                  <FormattedMessage defaultMessage="Total Shares" />
                </span>
                <span className="old-field-value white">
                  <span>{formatNumber({ value: totalShares, unit: Unit.SHARE, summarize: true })}</span>
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default OldEquityPanel;
