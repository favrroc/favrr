import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import React, { useMemo } from "react";
import { FormattedMessage } from "react-intl";
import styled from "styled-components";

import { FavEntity } from "../../../../generated-graphql/graphql";
import { FavInfo, OrderType } from "../../../../generated-subgraph/graphql";
import { DEFAULT_IPO_AVAILABLE_SHARES } from "../../../core/constants/base.const";
import { RESPONSIVE } from "../../../core/constants/responsive.const";
import { colors } from "../../../core/constants/styleguide.const";
import { useAppDispatch, useAppSelector } from "../../../core/hooks/rtkHooks";
import { setShowBuySellModal } from "../../../core/store/slices/modalSlice";
import { getCSSOfStyledComponent } from "../../../core/util/base.util";
import { Unit, formatNumber } from "../../../core/util/string.util";
import ProgressBar from "../../fav/progress-bar/ProgressBar";
import Loader from "../../loader/Loader";
import { ActionButtonGroup, Block, Body1Bold, Body2Bold, ButtonPrimary, ButtonSecondary, Caption1Bold, Caption2Bold, Flex } from "../../styleguide/styleguide";
import Countdown from "../../time/count-down/CountDown";
import Tooltip, { TooltipBody } from "../../tooltip/Tooltip";

import { Link } from "react-router-dom";
import infoSrc from "../../../assets/images/info.svg";
import blueClockSrc from "../../../assets/images/lightBlueClock.svg";
import redClockSrc from "../../../assets/images/redclock.svg";
import { howItWorksPath } from "../../../core/util/pathBuilder.util";

import { useAuthentication } from "../../../core/hooks/useAuthentication";
import "./buy-sell-panel.scss";


dayjs.extend(duration);

interface Props {
  type?: "panel" | "row";
  fav?: FavEntity;
  className?: string;
  isIPO: boolean;
  ipoEndTime: number; // seconds
  loading: boolean;
  favInfo: FavInfo;
  holdingShares: number;
}

const BuySellPanel = (props: Props) => {
  const { fav, className, isIPO, ipoEndTime, loading, favInfo, holdingShares } = props;
  const dispatch = useAppDispatch();
  const { checkAuthentication } = useAuthentication();

  const { isLoggedIn } = useAppSelector(state => state.user);

  const type = props.type || "panel";
  const displaySellButton: boolean = !isIPO && (holdingShares > 0);
  const now = dayjs();
  const ipoDate = useMemo(() => {
    return dayjs(new Date(ipoEndTime || 0).toISOString() as string);
  }, [new Date(ipoEndTime || 0).toISOString() as string]);
  const days = ipoDate.diff(now, "day");
  const ppsUSDCWithoutUnit = formatNumber({ value: isIPO ? favInfo.ipoPrice : favInfo.marketPrice, unit: Unit.USDC, summarize: false, withUnit: false });
  const ppsUSDWithUnit = formatNumber({ value: isIPO ? favInfo.ipoPrice : favInfo.marketPrice, unit: Unit.USD, summarize: false, withUnit: true });

  const renderIPOSellToolTip = () => (
    <Tooltip
      position="top"
      tooltip={
        <TooltipBody>
          During the IPO phase, insiders and early investors cannot sell their shares. Once the IPO period ends, trading restrictions are removed. <Link className="learn-more" to={howItWorksPath(2, "buyingAndSelling01")}>Learn More</Link>
        </TooltipBody>
      }
    >
      <img src={infoSrc} className="info-icon" alt="Info" />
    </Tooltip>
  );

  const renderIPOToolTip = () => (
    <Tooltip
      position="top"
      tooltip={
        <>
          <div className="pretrade-tooltip-title">
            <FormattedMessage defaultMessage="What's an IPO price?" />
          </div>
          <div className="pretrade-tooltip-subtitle">
            {"The current price available to investors during the limited IPO phase. It's usually a pretty good deal."} <Link className="learn-more" to={howItWorksPath(2, "buyingAndSelling01")}>
              Learn More
            </Link>
          </div>
        </>
      }
    >
      <img src={infoSrc} className="info-icon" />
    </Tooltip>
  );

  const handleClickBuy = () => {
    if (checkAuthentication()) {
      dispatch(setShowBuySellModal({
        showModal: true, props: {
          fav: fav as FavEntity,
          isIPO,
          orderType: OrderType.Buy,
          favInfo,
          holdingShares
        }
      }));
    }
  };

  const handleClickSell = () => {
    if (checkAuthentication()) {
      dispatch(setShowBuySellModal({
        showModal: true, props: {
          fav: fav as FavEntity,
          isIPO,
          orderType: OrderType.Sell,
          favInfo,
          holdingShares
        }
      }));
    }
  };

  return (
    <>
      <Block className={`buy-sell-panel ${type} ${className || ""}`}>
        {loading ? (
          <Loader />
        ) : (
          <>
            {type == "panel" ? (
              <>
                <Body2Bold className="font-neutrals8 flex justify-center gap-8">
                  {isIPO ? (
                    <FormattedMessage defaultMessage="IPO Share Price" />
                  ) : (
                    <FormattedMessage defaultMessage="Share Price" />
                  )}
                  {isIPO && renderIPOToolTip()}
                </Body2Bold>

                <Block className="ethereum-price">
                  {ppsUSDCWithoutUnit}
                  <Body2Bold className="font-neutrals4">USDC</Body2Bold>
                </Block>

                <Body1Bold className="font-neutrals4">
                  {ppsUSDWithUnit}
                </Body1Bold>
              </>
            ) : (
              <PinnedPPSContainer>
                <Block className="font-neutrals8">{ppsUSDCWithoutUnit} USDC</Block>
                <Block className="font-neutrals4">{ppsUSDWithUnit}</Block>
              </PinnedPPSContainer>
            )}

            <StyledActionButtonGroup type={type}>
              {(displaySellButton || isIPO) && (
                <SellButtonSecondary
                  onClick={handleClickSell}
                  disabled={isIPO}
                >
                  <FormattedMessage defaultMessage='Sell {coin}' values={{ coin: fav?.coin }} />
                  {isIPO && renderIPOSellToolTip()}
                </SellButtonSecondary>
              )}

              <ButtonPrimary
                onClick={handleClickBuy}
                className="p-0 flex-1"
                disabled={favInfo.availableSupply === 0}
              >
                {favInfo.availableSupply === 0 ? "Sold Out" : `Buy ${fav?.coin}`}
              </ButtonPrimary>

            </StyledActionButtonGroup>

            {isIPO && !!ipoEndTime && (
              <>
                <IPOCountdown className={`${days < 1 ? "no-days-left" : ""}`} type={type}>
                  {days < 1 ? <img style={{ marginRight: "14px" }} src={redClockSrc} /> : <img style={{ marginRight: "14px" }} src={blueClockSrc} />}
                  <span>IPO Ends</span>
                  {days < 1 && <span>🔥</span>}
                  <Countdown endDate={new Date(ipoEndTime || 0).toISOString() as string} />
                </IPOCountdown>
                <span className="progress-bar-container">
                  <ProgressBar
                    sharesLeft={favInfo.availableSupply}
                    sharesTotal={DEFAULT_IPO_AVAILABLE_SHARES}
                    isIpo={true}
                  />
                </span>
              </>
            )}
          </>
        )}
      </Block>
    </>
  );
};

const SellButtonSecondary = styled(ButtonSecondary)`
  padding: 0;
  gap: 0px;
  flex: 1;
  .tooltip  {
    cursor: pointer;
    pointer-events: all;
    white-space: normal;
  }
  &:disabled {
    color: ${colors.neutrals4};
  }
`;

const StyledActionButtonGroup = styled(ActionButtonGroup)`
  margin-top: ${(props: any) => props.type === "row" ? "8px" : "48px"};

  @media screen and (max-width: 1024px) {
    margin-top: ${(props: any) => props.type === "row" ? "8px" : "32px"};
  }
`;

const IPOCountdown = styled.div`
  padding: 12px 24px;
  gap: 4px;
  width: 100%;
  height: 48px;
  background: rgba(108, 93, 211, 0.08);
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 20px;
  color: #E6E8EC;
  margin: auto;
  margin-top: 32px;
  @media screen and (max-width: ${RESPONSIVE.large}) {
    margin-top: ${(props: { type: string; }) => props.type === "row" ? "14px" : "32px"};
  }
  box-sizing: border-box;
  img {
    height: 32px;
  }
  .countdown {
    margin: 0 !important;
    padding: 0;
    font-family: 'Poppins' !important;
    font-style: normal !important;
    font-weight: 600 !important;
    font-size: 12px !important;
    line-height: 20px !important;
    color: #7FBA7A;
    &.no-days-left {
      color: #FFA2C0;
    }
  }
  &.no-days-left {
    background: rgba(255, 162, 192, 0.08);
    .countdown {
      color: #FFA2C0;
    }
  }
`;

const PinnedPPSContainer = styled(Flex)`
  justify-content: center;
  gap: 8px;
  ${getCSSOfStyledComponent(Caption1Bold)}

  @media screen and (max-width: ${RESPONSIVE.medium}) {
    ${getCSSOfStyledComponent(Caption2Bold)}
  }
`;

export default BuySellPanel;
