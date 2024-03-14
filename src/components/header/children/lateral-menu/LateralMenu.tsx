import React, { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Else, If, Then } from "react-if";
import SVG from "react-inlinesvg";
import { useIntl } from "react-intl";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";

import { COMMONS } from "../../../../assets/i18n/commons";
import closeSrc from "../../../../assets/images/close.svg";
import { colors } from "../../../../core/constants/styleguide.const";
import { useLowercasedAccount } from "../../../../core/hooks/useLowercasedAccount";
import { useWatchResize } from "../../../../core/hooks/useWatchResize";
import { blogPath, fanMatchPath, fansPath, portfolioPath } from "../../../../core/util/pathBuilder.util";
import Accordion4 from "../../../accordion/Accordion4";
import { RightArrowImage } from "../../../assets/app-images/AppImages";
import ConnectWalletButton from "../../../button/connect-wallet-button/ConnectWalletButton";
import UserThumb from "../../../button/user-thumb/UserThumb";
import Logo from "../../../logo/Logo";
import PlanktonModal from "../../../modal/plankton-modal/PlanktonModal";
import { Body1Bold } from "../../../styleguide/styleguide";
import { navLinks } from "../../Header";
import "./lateral-menu.scss";

interface Props {
  onClose: () => void;
}

export default function LateralMenu(props: Props) {
  const intl = useIntl();
  const location = useLocation();
  const { address, isConnected } = useLowercasedAccount();
  const { smallerThanMobile } = useWatchResize();

  const isBlogPage = useMemo(() => {
    return location.pathname.indexOf(blogPath()) >= 0;
  }, [location]);

  const [showPlanktonModal, setShowPlanktonModal] = useState(false);

  const childrenSelected = (location.pathname == fansPath() || location.pathname == fanMatchPath()) ? true : false;
  return createPortal(
    <div className="lateral-menu">
      <div className="header">
        <Logo />
        <button onClick={props.onClose}>
          <img src={closeSrc} />
        </button>
      </div>

      {navLinks.map((navLink, index) => (
        <If key={index} condition={navLink.title === COMMONS.fans}>
          <Then>
            <div key={index}>
              <Accordion4 title={`Fans`} childrenSelected={childrenSelected}>
                <>
                  <StyledLink to={fansPath()} onClick={() => props.onClose()}><StyledText>{`Leaderboard`}</StyledText></StyledLink>
                  <StyledLink to={fanMatchPath()} onClick={() => props.onClose()}><StyledText>{`Matches`}</StyledText></StyledLink>
                </>
              </Accordion4>
            </div>
          </Then>
          <Else>
            <StyledLink
              key={index}
              className={`link-row ${location.pathname == navLink.path ? "selected" : ""
              }`}
              to={navLink.path}
              onClick={() => props.onClose()}
            >
              {index === 3 && <StyledRightArrow src={RightArrowImage().props.src} />}
              {intl.formatMessage(navLink.title)}
            </StyledLink>
          </Else>
        </If>
      ))}

      <div className={`buttons-container ${isBlogPage ? "hide-section-for-blog" : ""}`}>
        {address && isConnected ? (
          <>
            {/* <CreateNFTButton onClicked={() => props.onClose()} /> */}
            <Link to={portfolioPath()} onClick={() => props.onClose()}>
              <UserThumb
                address={address}
                displayLastCharacters={smallerThanMobile}
                mobileView={true}
              />
            </Link>
          </>
        ) : (
          <ConnectWalletButton />
        )}
      </div>
      {showPlanktonModal && (
        <PlanktonModal />
      )}
    </div>,
    document.querySelector("body") as HTMLBodyElement
  );
};

const StyledLink = styled(Link)`
  padding-left: 24px;
  display: flex !important;
  align-items: center;

  &.selected {
    padding-left: 21px;
    border-left: solid 3px ${colors.primaryBlue};
    > * {
     color: ${colors.neutrals8} 
    }
  }

  @media screen and (max-width: 320px) {
    padding-left: 3px;
  }
`;

const StyledRightArrow = styled(SVG)`
  margin-right: 17.5px;
  width: 21px;
  height: 13.5px;
`;

const StyledText = styled(Body1Bold)`
  padding: 16px 0px;
  color: ${colors.neutrals4};
  &:hover {
    color: ${colors.neutrals8}
  }
`;