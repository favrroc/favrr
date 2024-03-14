import React, { useEffect, useRef } from "react";
import { FormattedMessage } from "react-intl";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useDisconnect } from "wagmi";

import dayjs from "dayjs";
import AccountSrc from "../../../../assets/images/account.svg";
import briefcaseWhiteSrc from "../../../../assets/images/briefcase-white.svg";
import briefcaseSrc from "../../../../assets/images/briefcase.svg";
import downloadWhiteSrc from "../../../../assets/images/download-white.svg";
import downloadSrc from "../../../../assets/images/download.svg";
import notificationSrc from "../../../../assets/images/notification.svg";
import usdcIcon from "../../../../assets/images/usdc.svg";
import { StorageKeys } from "../../../../core/constants/base.const";
import { colors } from "../../../../core/constants/styleguide.const";
import { League } from "../../../../core/enums/league.enum";
import {
  useAppDispatch,
  useAppSelector
} from "../../../../core/hooks/rtkHooks";
import { useBalance } from "../../../../core/hooks/useBalance";
import { useClickOutside } from "../../../../core/hooks/useClickOutside";
import {
  setShowAddFundsModalAction,
  setShowCrabModalAction,
  setShowPlanktonModalAction,
  setShowShrimpModalAction
} from "../../../../core/store/slices/modalSlice";
import { LeagueLib } from "../../../../core/util/league.util";
import { homePath } from "../../../../core/util/pathBuilder.util";
import { Unit, formatNumber } from "../../../../core/util/string.util";
import Loader from "../../../loader/Loader";
import { Caption2, Caption2Bold } from "../../../styleguide/styleguide";
import "./mobile-user-menu.scss";

interface Props {
  onClose?: () => void;
  hideNotifications?: boolean;
}
const MobileUserMenu = (props: Props) => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { disconnect } = useDisconnect();
  const { syncBalance } = useBalance();

  const { league, usdcBalance, isFetchingUSDCBalance, isLoggedIn } = useAppSelector(
    (state) => state.user
  );
  const { fanMatchesList, userStatus } = useAppSelector((state) => state.fanMatch);
  const isThereLiveMatch =
    dayjs(fanMatchesList[0]?.expiredAt).diff(dayjs(), "week") === 0
      ? true
      : false;

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    syncBalance();
  }, []);

  useClickOutside(ref, () => {
    if (props.onClose) {
      props.onClose();
    }
  });

  // league box handler
  const leagueToggleSwitch = () => {
    if (league === League.Shrimp) return setShowShrimpModalAction(true);
    if (league === League.Crab) {
      // if (isThereLiveMatch) {
      //   if(userStatus.step === 0){
      //     return setShowCrabModal2Action(true);
      //   }
      //   if(userStatus.started && userStatus.step === 1){
      //     return setShowCrabModal3AAction(true);
      //   }
      //   if(userStatus.started && userStatus.step === 2){
      //     return setShowCrabModal3BAction(true);
      //   }
      //   if(userStatus.started && userStatus.step === 3){
      //     return setShowCrabModal3CAction(true);
      //   }
      // }
      return setShowCrabModalAction(true);
    }
    return setShowPlanktonModalAction(true);
  };

  const handleClickLeagueBox = () => dispatch(leagueToggleSwitch());

  return (
    <StyledPopup ref={ref} onClose={props.onClose}>
      <LeagueBox onClick={handleClickLeagueBox}>
        <StyledTextContent>
          <Caption2Bold>{`${LeagueLib[league].title} League`}</Caption2Bold>
          <br />
          <Caption2>{LeagueLib[league].userMenuDescription}</Caption2>
        </StyledTextContent>
        <StyledLeagueImage src={LeagueLib[league].image.props.src} />
      </LeagueBox>
      <BalanceBox>
        <InnerBox>
          <div>
            <img className="icon" src={usdcIcon} alt="USDC Icon" />
          </div>
          <BalanceDetail>
            <span>USDC Balance</span>
            {isFetchingUSDCBalance ? (
              <Loader />
            ) : (
              <strong>
                {formatNumber({
                  value: usdcBalance,
                  unit: Unit.USDC,
                  summarize: true,
                  forceSummarize: true
                })}
              </strong>
            )}
          </BalanceDetail>
        </InnerBox>
        <Button onClick={() => dispatch(setShowAddFundsModalAction(true))}>
          Add Funds
        </Button>
      </BalanceBox>

      <ActionBox>
        <PortfolioLink
          to="/portfolio"
          className={`${location.pathname.startsWith("/portfolio") ? "active-row" : ""
          }`}
          onClick={props.onClose}
        >
          <FormattedMessage defaultMessage="Portfolio" />
        </PortfolioLink>
        <StyledHr />
        <AccountLink
          to="/account"
          className={`${location.pathname.startsWith("/account") ? "active-row" : ""
          }`}
          onClick={props.onClose}
        >
          <FormattedMessage defaultMessage="Account" />
        </AccountLink>
        <StyledHr />
        {!props.hideNotifications && (
          <>
            <NotificationsLink
              to="/notifications"
              className={`${location.pathname.startsWith("/notifications")
                ? "active-row"
                : ""
              }`}
              onClick={props.onClose}
            >
              <FormattedMessage defaultMessage="Notifications" />
            </NotificationsLink>
            <StyledHr />
          </>
        )}
        <DisconnectButton
          onClick={() => {
            disconnect();
            localStorage.setItem(StorageKeys.IsLoggedIn, "FALSE");
            document.location.reload();
            navigate(homePath());

            if (props.onClose) {
              props.onClose();
            }
          }}
        >
          <FormattedMessage defaultMessage="Disconnect" />
        </DisconnectButton>
      </ActionBox>
    </StyledPopup>
  );
};

const NotificationsLink = styled(Link)`
  background: url(${notificationSrc}) no-repeat left top;
  background-size: 16px;
  &:hover {
    filter: brightness(2);
    cursor: pointer !important;
    color: #fff !important;
  }
`;

const PortfolioLink = styled(Link)`
  &:after {
    display: none;
    content: url(${briefcaseWhiteSrc}) url(${downloadWhiteSrc});
  }
  background: url(${briefcaseSrc}) no-repeat left top;
  &:hover,
  &.active-row {
    filter: brightness(2);
    cursor: pointer !important;
    color: #fff !important;
  }
`;

const AccountLink = styled(Link)`
  background: url(${AccountSrc}) no-repeat left top;
  &:hover,
  &.active-row {
    filter: brightness(2);
    cursor: pointer !important;
    color: #fff !important;
  }
`;

const DisconnectButton = styled.button`
  background: url(${downloadSrc}) no-repeat left top;
  &:hover {
    filter: brightness(2);
    cursor: pointer !important;
    color: #fff !important;
  }
`;

const StyledPopup = styled.div`
  max-height: calc(100vh - 80px);
  overflow-y: auto;
  display: flex;
  gap: 26px;
  background: #242731;
  box-shadow: 0px 16px 50px 2px rgb(15, 17, 24, 67%);
  border-radius: 12px;
  padding: 32px 16px;
  flex-direction: column;
  width: 231px;
  position: absolute;
  margin: auto;
  position: absolute;
  right: -48px;
  z-index: 10;
  box-sizing: border-box;
  @media screen and (max-width: 375px) {
    width: calc(100% - 48px);
    right: 0px;
    left: 50%;
    transform: translateX(-50%);
    position: fixed;
  }
  @media screen and (max-width: 320px) {
    width: calc(100% - 10px);
    position: fixed;
  }
`;

const LeagueBox = styled.div`
  display: flex;
  color: ${colors.neutrals8};
  padding: 12px;
  background: rgba(63, 140, 255, 0.08);
  border: 1px dashed #3f8cff;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    color: ${colors.primaryBlue};
    background-color: rgba(63, 140, 255, 0.2);
  }
`;
const StyledTextContent = styled.div`
  flex: 1;
`;
const StyledLeagueImage = styled.div`
  width: 52px;
  background-image: url("${(props: { src: string; }) => props.src}");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`;
const BalanceBox = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  flex-direction: column;
  background: #242731;
  box-shadow: 0px 14px 19px -10px rgb(15, 15, 15, 0.5);
  border-radius: 16px;
  padding: 6px 8px 12px;
`;

const Button = styled.button`
  font-family: "DM Sans";
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 16px;
  text-align: center;
  color: #fcfcfd;
  flex: none;
  background: #3f8cff;
  border-radius: 90px;
  order: 1;
  align-self: stretch;
  flex-grow: 0;
  padding: 8px;
  &:hover {
    transition: all 0.33s ease;
    background: #315ec9;
  }
`;

const InnerBox = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  width: 100%;
  .icon {
    width: 40px;
    height: 40px;
  }
`;

const BalanceDetail = styled.div`
  font-family: "Poppins";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
  color: #808191;
  display: flex;
  flex-direction: column;
  strong {
    font-family: "Poppins";
    font-style: normal;
    font-weight: 600;
    font-size: 24px;
    line-height: 32px;
    color: #fcfcfd;
  }
`;
const ActionBox = styled.div`
  display: flex;
  flex-direction: column;
  > * {
    font-family: "DM Sans";
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    line-height: 16px;
    color: #808191;
    padding: 0 14px 14px 24px;
    margin-top: 18px;
    text-align: left;
    border-bottom: none;
    &:first-child {
      margin-top: 0;
    }
    &:last-child {
      border: none;
    }
  }
`;

const StyledHr = styled.hr`
  height: 1px !important;
  line-height: 1px;
  padding: 0;
  width: 100%;
  border: none !important;
  background: #353945;
  margin: 0 7px !important;
`;

export default MobileUserMenu;
