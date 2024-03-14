import React from "react";
import { FormattedMessage } from "react-intl";
import styled from "styled-components";

import { DEFAULT_POOL_SIZE } from "../../../core/constants/base.const";
import { RESPONSIVE } from "../../../core/constants/responsive.const";
import { getColorOfValue } from "../../../core/util/base.util";
import { formatNumber, Unit } from "../../../core/util/string.util";
import { Flex } from "../../styleguide/styleguide";

const EquityPanel = (props: {
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
    <StyledFlex>
      <div className="equity-section">
        <div className="upper-section">
          <div className="title-section">
            My Equity
          </div>
          <span className="main-values-container">
            <span className="main-value">{formatNumber({ value: totalEquity, unit: Unit.USDC, summarize: false, withUnit: true })}</span>
            <span className="usd-value">{formatNumber({ value: totalEquity, unit: Unit.USD, summarize: true, withUnit: true })}</span>
          </span>
        </div>
        {expandedVersion && (
          <>
            <div className="field-row">
              <span className="field-name">
                <FormattedMessage defaultMessage="Today's Return" />
              </span>
              <span className="field-value">
                <span className={`eth-value ${getColorOfValue(todaysReturn)}`}>
                  {formatNumber({ value: todaysReturn, unit: Unit.USDC, summarize: false, withUnit: true, withSign: true })}
                </span>
                <span className="smaller-font">{formatNumber({ value: todaysReturnPercent, unit: Unit.PERCENT, summarize: true, withUnit: true })}</span>
              </span>
            </div>
            {expandedVersion &&
              (totalShares == null || totalShares == undefined ? (
                <>
                  <div className="field-row">
                    <span className="field-value">
                      <span className="white">{formatNumber({ value: props.shares, unit: Unit.SHARE, summarize: true }) + " "}</span>
                      <span>
                        <FormattedMessage
                          defaultMessage="of {sharesPool}"
                          values={{
                            sharesPool: formatNumber({ value: DEFAULT_POOL_SIZE, unit: Unit.SHARE, summarize: true }),
                          }}
                        />
                      </span>
                    </span>
                    <span className="field-name">
                      <FormattedMessage defaultMessage="Shares" />
                    </span>
                  </div>
                  <div className="field-row">
                    <span className="field-value">
                      <span className="eth-value">
                        {`${formatNumber({ value: props.currentPrice, unit: Unit.USDC, summarize: false, withUnit: true })}`}
                      </span>
                      <span>
                        {`${formatNumber({ value: props.currentPrice, unit: Unit.USD, summarize: true, withUnit: true })}`}
                      </span>
                    </span>
                    <span className="field-name">
                      <FormattedMessage defaultMessage="Current Price" />
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="field-row">
                    <span className="field-name">
                      <FormattedMessage
                        defaultMessage="My Stocks"
                      />
                    </span>
                    <span className="field-value white">
                      <span>{totalFavs}</span>
                    </span>
                  </div>
                  <div className="field-row">
                    <span className="field-name">
                      <FormattedMessage defaultMessage="My Shares" />
                    </span>
                    <span className="field-value white">
                      <span>{formatNumber({ value: totalShares, unit: Unit.SHARE, summarize: true })}</span>
                    </span>
                  </div>
                </>
              ))}
          </>
        )}
      </div>
      <div className="equity-section">
        <div className="upper-section">
          <div className="title-section custom">
            {expandedVersion ? (
              <>My Return</>
            ) : totalShares == null || totalShares == undefined ? (
              <FormattedMessage defaultMessage="Yours shares" />
            ) : (
              <FormattedMessage defaultMessage="Yours FAVs" />
            )}
          </div>
          <div>
            <span className="main-values-container">
              <span className="main-value">
                {formatNumber({ value: totalReturn, unit: Unit.USDC, summarize: false, withSign: false, withUnit: true })}
              </span>
              <span className="usd-value">
                {formatNumber({ value: totalReturn, unit: Unit.USD, summarize: true, withSign: false, withUnit: true })}
              </span>
            </span>
          </div>
        </div>
        <div className="field-row">
          <span className="field-name">Total Cost</span>
          <span className="field-value">
            <span className="eth-value">
              {formatNumber({ value: totalCost, unit: Unit.USDC, summarize: true, withSign: false, withUnit: true })}
            </span>
            <span style={{color: "#808191", fontWeight: "400"}}>{formatNumber({ value: totalCost, unit: Unit.USD, summarize: true, withSign: false, withUnit: true })}</span>
          </span>
        </div>
      </div>
    </StyledFlex>
  );
};

const StyledFlex = styled(Flex)`
  flex-direction: column;
  gap: 20px;
  .main-values-container {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    @media screen and (max-width: 850px) {
      flex-direction: column;
      align-items: start;
      gap: 0;
    }
  }
  .upper-section {
    margin-bottom: 14px;
  }
  .equity-section {
    padding: 32px;
    background: #23262F;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    justify-content: center;
    min-height: 254px;
    @media screen and (max-width: 850px) {
      min-height: auto;
    }
    @media screen and (max-width: 576px) {
      gap: 16px;
    }
  }
  .main-value {
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 600;
    font-size: 24px;
    line-height: 32px;
    color: #F2F2F2;
  }
  .usd-value {
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    color: #808191;
    display: block;
  }
  .title-section {
    margin-bottom: 4px;
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 24px;
    color: #FCFCFD;
  }
  .field-name {
    display: block;
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 20px;
    display: flex;
    align-items: center;
    color: #808191;
  }
  .field-row {
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 24px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    flex-direction: row;
    @media screen and (max-width: ${RESPONSIVE.large}) {
      flex-direction: column-reverse;
    }
    @media screen and (max-width: 375px) {
      flex-direction: row;
    }    
  }
  .smaller-font {
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 24px;
    color: #808191;
  }
  .eth-value {
    margin-right: 8px;
  }
`;

export default EquityPanel;
