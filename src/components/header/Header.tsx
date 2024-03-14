import React, { useEffect, useMemo, useState } from "react";
import { Beforeunload } from "react-beforeunload";
import { Else, If, Then } from "react-if";
import SVG from "react-inlinesvg";
import { useIntl } from "react-intl";
import { Link, NavLink, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useNetwork } from "wagmi";

import { COMMONS } from "../../assets/i18n/commons";
import { RESPONSIVE } from "../../core/constants/responsive.const";
import { colors } from "../../core/constants/styleguide.const";
import { League } from "../../core/enums/league.enum";
import { useAppDispatch, useAppSelector } from "../../core/hooks/rtkHooks";
import { useLowercasedAccount } from "../../core/hooks/useLowercasedAccount";
import { useWatchResize } from "../../core/hooks/useWatchResize";
import {
  setShowPlanktonModalAction,
  setShowShrimpModalAction
} from "../../core/store/slices/modalSlice";
import { getCSSOfStyledComponent } from "../../core/util/base.util";
import { getLocalStorageWithExpiry } from "../../core/util/localstorage.util";
import {
  blogPath,
  fanMatchPath,
  fansPath,
  homePath,
  startHerePath,
  stocksPath
} from "../../core/util/pathBuilder.util";
import { RightArrowImage } from "../assets/app-images/AppImages";
import BurgerButton from "../button/burger-button/BurgerButton";
import ConnectWalletButton from "../button/connect-wallet-button/ConnectWalletButton";
import NotificationsButton from "../button/notifications-button/NotificationsButton";
import UserThumb from "../button/user-thumb/UserThumb";
import Logo from "../logo/Logo";
import AddFundsCanceledModal from "../modal/AddFundsCanceledModal";
import AddFundsModal from "../modal/add-funds-modal/AddFundsModal";
import BlowFishModal from "../modal/blowfish-modal/BlowFishModal";
import ClaimFundsModal from "../modal/claim-funds-modal/ClaimFundsModal";
import ClaimRejectedModal from "../modal/claim-rejected-modal/ClaimRejectedModal";
import CrabModal from "../modal/crab-modal/CrabModal";
import CrabModal2 from "../modal/crab-modal/CrabModal2";
import CrabModal3A from "../modal/crab-modal/CrabModal3A";
import CrabModal3B from "../modal/crab-modal/CrabModal3B";
import CrabModal3C from "../modal/crab-modal/CrabModal3C";
import ShareFanMatchModal from "../modal/fan-match-share-modal/ShareFanMatchModal";
import FundsAddedModal from "../modal/funds-added-modal/FundsAddedModal";
import FundsClaimedModal from "../modal/funds-claimed-modal/FundsClaimedModal";
import ImportTokenModal from "../modal/import-token-modal/ImportTokenModal";
import OrderRejectedModal from "../modal/order-rejected-modal/OrderRejectedModal";
import PlanktonModal from "../modal/plankton-modal/PlanktonModal";
import ShareProfileModal from "../modal/share-profile/ShareProfileModal";
import ShrimpModal from "../modal/shrimp-modal/ShrimpModal";
import SignRejectedModal from "../modal/sign-in-modal/SignRejectedModal";
import SigningModal from "../modal/sign-in-modal/SigningModal";
import WrongNetworkModal from "../modal/wrong-network-modal/WrongNetworkModal";
import { ButtonSmall } from "../styleguide/styleguide";
import BuySellModal from "../transaction/buy-sell-modal/BuySellModal";
import OpenWalletModal from "../transaction/open-wallet-modal/OpenWalletModal";
import OrderPlacedModal from "../transaction/order-placed-modal/OrderPlacedModal";
import ConnectWalletModal from "../wallet/ConnectWalletModal";
import "./header.scss";

export const navLinks = [
  {
    path: homePath(),
    title: COMMONS.explore
  },
  {
    path: stocksPath(),
    title: COMMONS.stocks
  },
  {
    path: fansPath(),
    title: COMMONS.fans
  },
  {
    path: startHerePath(),
    title: COMMONS.startHere
  }
];

interface Props {
  logoOnly?: boolean; // Simplified version of header
}
export default function Header({ logoOnly }: Props) {
  const location = useLocation();
  const isBlogPage = useMemo(() => {
    return location.pathname.indexOf(blogPath()) >= 0;
  }, [location]);
  const dispatch = useAppDispatch();
  const intl = useIntl();
  const { address, isConnected } = useLowercasedAccount();
  const { chain } = useNetwork();
  const { smallerThanTablet, smallerThanLarge } = useWatchResize();

  const { profile, league, isLoggedIn } = useAppSelector((state) => state.user);
  const {
    showOrderRejectedModal,
    orderRejectedModalProps,
    showAddFundsModal,
    showFundsAddedModal,
    showPlanktonModal,
    showShrimpModal,
    showCrabModal,
    showCrabModal2,
    showCrabModal3A,
    showCrabModal3B,
    showCrabModal3C,
    showBlowFishModal,
    showClaimFundsModal,
    showOpeningWalletModal,
    openingWalletModalProps,
    showFundsClaimedModal,
    showClaimRejectedModal,
    showConnectWalletModal,
    showBuySellModal,
    buySellModalProps,
    showOrderPlacedModal,
    orderPlacedModalProps,
    showShareProfileModal,
    showShareFanMatchModal,
    shareFanMatchModalProps,
    showImportTokenModal,
    showAddFundsCanceledModal,
    addFundsCanceledModalProps,
    showSignRejectedModal,
    showSigningModal
  } = useAppSelector((state) => state.modal);

  const [showFansDropdown, setShowFansDropdown] = useState(false);

  const childrenSelected =
    location.pathname == fansPath() || location.pathname == fanMatchPath()
      ? true
      : false;
  useEffect(() => {
    function openLeagueModalAction() {
      if (!chain?.unsupported) {
        // Load Modal on Load according to the user League.
        // Wait for profile to have content
        dispatch(setShowPlanktonModalAction(false));
        dispatch(setShowShrimpModalAction(false));
        if (isLoggedIn) {
          // Load Modal according to League
          if (league === League.Microbe)
            dispatch(setShowPlanktonModalAction(true));
          if (league === League.Shrimp)
            dispatch(setShowShrimpModalAction(true));
          // if (league === League.Crab) dispatch(setShowCrabModalAction(true));
        }
      }
    }

    function checkLevelUp() {
      if (sessionStorage.getItem("hideLevelUp") == null && getLocalStorageWithExpiry("hasNextStep") === null) {
        if (!showPlanktonModal || !showShrimpModal || !showCrabModal) {
          // After timeout show level up modal
          setTimeout(() => {
            openLeagueModalAction();
          }, 120000);
        }
      }
    }

    checkLevelUp();

  }, [league, profile, dispatch, chain, isLoggedIn]);

  async function updateUserNextStep() {
    // localStorage.removeItem("hasNextStep");
    sessionStorage.removeItem("hideLevelUp");
  }

  return (
    <>
      <Beforeunload onBeforeunload={() => updateUserNextStep()} />
      <div
        className="header"
        style={{ justifyContent: logoOnly ? "center" : undefined }}
      >
        <Logo className="header-section" />
        {!logoOnly && (
          <>
            <StyledNavLinksContainer>
              {navLinks.map((navLink, index) => (
                <If key={index} condition={navLink.title === COMMONS.fans}>
                  <Then>
                    <div
                      key={index}
                      style={{
                        position: "relative",
                        lineHeight: "15px",
                        height: 48,
                        display: "flex",
                        alignItems: "center"
                      }}
                      onMouseLeave={() => setShowFansDropdown(false)}
                      onMouseOver={() => setShowFansDropdown(true)}
                    >
                      <StyledFansButton
                        onMouseOver={() => setShowFansDropdown(true)}
                        className={childrenSelected ? "selected" : ""}
                      >
                        {`fans`}
                      </StyledFansButton>

                      <StyledNavigationPan
                        className={showFansDropdown ? "" : "hide"}
                      >
                        <Link to={fansPath()}>
                          <StyledButton>
                            <span
                              style={{ marginLeft: "10px" }}
                            >{`Leaderboard`}</span>
                          </StyledButton>
                        </Link>

                        <Link to={fanMatchPath()}>
                          <StyledButton>
                            <span
                              style={{ marginLeft: "10px" }}
                            >{`Matches`}</span>
                          </StyledButton>
                        </Link>

                      </StyledNavigationPan>

                    </div>
                  </Then>
                  <Else>
                    <StyledNavLink key={index} to={navLink.path}>
                      {index === 3 && (
                        <StyledRightArrow src={RightArrowImage().props.src} />
                      )}
                      {index === 3 &&
                        !smallerThanTablet &&
                        smallerThanLarge &&
                        isConnected
                        ? "Start"
                        : intl.formatMessage(navLink.title)}
                    </StyledNavLink>
                  </Else>
                </If>
              ))}
            </StyledNavLinksContainer>
            <div
              className={`header-section right-section ${isBlogPage ? "hide-section-for-blog" : ""
              }`}
            >
              {/* <SearchButton /> */}

              {smallerThanTablet ? (
                isLoggedIn ? (
                  <>
                    {!isBlogPage && <NotificationsButton />}
                    <BurgerButton />
                    {/* <UserThumb address={address} displayLastCharacters={!smallerThanLarge} /> */}
                  </>
                ) : (
                  <BurgerButton />
                )
              ) : isLoggedIn ? (
                <>
                  {!isBlogPage && <NotificationsButton />}
                  <UserThumb
                    address={address}
                    displayLastCharacters={!smallerThanLarge}
                  />
                </>
              ) : (
                <ConnectWalletButton />
              )}
            </div>
          </>
        )}
        {showPlanktonModal && <PlanktonModal />}
        {showShrimpModal && <ShrimpModal />}
        {showCrabModal && <CrabModal />}
        {showCrabModal2 && <CrabModal2 />}
        {showCrabModal3A && <CrabModal3A />}
        {showCrabModal3B && <CrabModal3B />}
        {showCrabModal3C && <CrabModal3C />}
        {showBlowFishModal && <BlowFishModal />}
        {showOrderRejectedModal && (
          <OrderRejectedModal {...orderRejectedModalProps} />
        )}
        {showAddFundsModal && <AddFundsModal />}
        {showFundsAddedModal && <FundsAddedModal />}
        {showClaimFundsModal && <ClaimFundsModal />}
        {showOpeningWalletModal && (
          <OpenWalletModal {...openingWalletModalProps} />
        )}
        {showFundsClaimedModal && <FundsClaimedModal />}
        {showClaimRejectedModal && <ClaimRejectedModal />}
        {showConnectWalletModal && <ConnectWalletModal />}
        {address && chain?.unsupported && <WrongNetworkModal />}
        {showBuySellModal && <BuySellModal {...buySellModalProps} />}
        {showOrderPlacedModal && (
          <OrderPlacedModal {...orderPlacedModalProps} />
        )}
        {showShareProfileModal && <ShareProfileModal />}
        {showShareFanMatchModal && (
          <ShareFanMatchModal {...shareFanMatchModalProps} />
        )}
        {showImportTokenModal && <ImportTokenModal />}
        {showAddFundsCanceledModal && (
          <AddFundsCanceledModal {...addFundsCanceledModalProps} />
        )}
        {showSignRejectedModal && <SignRejectedModal />}
        {showSigningModal && <SigningModal />}
      </div>
    </>
  );
}

const StyledNavLinksContainer = styled.div`
  display: none;
  align-items: center;
  @media screen and (min-width: ${RESPONSIVE.tablet}) {
    display: flex;
    gap: 24px;
  }
  @media screen and (min-width: ${RESPONSIVE.large}) {
    gap: 40px;
  }
`;

const StyledNavLink = styled(NavLink)`
  ${getCSSOfStyledComponent(ButtonSmall)}
  text-transform: capitalize;
  color: ${colors.neutrals4};
  &.arrow-icon {
    background-image: url(${RightArrowImage().props.src});
    background-repeat: no-repeat;
    background-position: left center;
    padding-left: 25px;
  }
  svg,
  path {
    fill: ${colors.neutrals4};
  }

  &.active {
    color: ${colors.neutrals8};
    svg,
    path {
      fill: ${colors.neutrals8};
    }
  }

  &:hover {
    color: ${colors.neutrals8} !important;
    svg,
    path {
      fill: ${colors.neutrals8} !important;
    }
  }
`;

const StyledFansButton = styled(ButtonSmall)`
  text-transform: capitalize;
  color: ${colors.neutrals4};
  &:hover {
    color: ${colors.neutrals8} !important;
    cursor: pointer;
  }
  &.selected {
    color: ${colors.neutrals8};
  }
`;

const StyledRightArrow = styled(SVG)`
  margin-right: 11px;
`;

const StyledNavigationPan = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 256px;
  height: Hug(143px);
  border-radius: 12px;
  padding: 25px 0px;
  gap: 12px;
  background-color: ${colors.neutrals2};
  position: absolute;
  top: 100%;
  left: -30px;
  opacity: 1;
  transition: all 0.3s ease;
  &.hide {
    display: none;
    opacity: 0;
  }
`;

const StyledButton = styled.button`
  background-color: ${colors.neutrals2};
  width: 228px;
  height: 40px;
  border-radius: 12px;
  text-align: left;

  font-family: DM Sans;
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 16px;
  color: ${colors.neutrals4};

  &:hover {
    background-color: ${colors.neutrals1};
    color: ${colors.neutrals8};
  }
`;
