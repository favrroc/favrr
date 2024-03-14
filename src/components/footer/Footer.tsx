import React, { useContext } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { COMMONS } from "../../assets/i18n/commons";
import { ResponsiveContext, screenType } from "../../core/context/responsive.context";
import { blogPath, fansPath, homePath, howItWorksPath, privacyPath, startHerePath, stocksPath, termsPath } from "../../core/util/pathBuilder.util";
import Accordion from "../layout/accordion/Accordion";
import Logo from "../logo/Logo";

import chevronSrc from "../../assets/images/chevron.svg";
import { getCSSOfStyledComponent } from "../../core/util/base.util";
import { Body2, Body2Bold, HairlineSmall } from "../styleguide/styleguide";
import "./footer.scss";

const Footer = () => {
  const intl = useIntl();
  const { currentScreenType } = useContext(ResponsiveContext);

  return (
    <>
      <div className="footer">
        <div className="links-section padding-container max-width-1120 width-100-perc">
          <div className="section">
            <Logo className="footer-section-title" />
            <Body2 className="footer-title">
              <FormattedMessage defaultMessage="The People Economy" />
            </Body2>
          </div>
          <hr className="accordion-hr" />
          <Accordion
            className="section"
            style={{minHeight: 14}}
            accordionHeader={({ expanded, setExpanded }) => (
              <div
                className="footer-section-title"
                onClick={() => setExpanded(!expanded)}
              >
                <StyledSectionTitle>Market</StyledSectionTitle>
                <img className="chevron" src={chevronSrc} />
              </div>
            )}
            alwaysDisplay={currentScreenType != screenType.MOBILE}
          >
            <>
              <Link to={homePath()} className="accordion-item first-item">
                {intl.formatMessage(COMMONS.explore)}
              </Link>
              <Link to={stocksPath()} className="accordion-item">
                {intl.formatMessage(COMMONS.stocks)}
              </Link>
              <Link to={fansPath()} className="accordion-item">
                {intl.formatMessage(COMMONS.fans)}
              </Link>
              <Link to={startHerePath()} className="accordion-item">
                {intl.formatMessage(COMMONS.startHere)}
              </Link>
            </>
          </Accordion>
          <hr className="accordion-hr" />
          <Accordion
            className="section"
            style={{minHeight: 14}}
            accordionHeader={({ expanded, setExpanded }) => (
              <div
                className="footer-section-title"
                onClick={() => setExpanded(!expanded)}
              >
                <StyledSectionTitle>
                  {intl.formatMessage(COMMONS.about)}
                </StyledSectionTitle>
                <img className="chevron" src={chevronSrc} />
              </div>
            )}
            alwaysDisplay={currentScreenType != screenType.MOBILE}
          >
            {
              <>
                <Link
                  to={blogPath()}
                  className="accordion-item first-item"
                  target="_blank"
                >
                  Blog
                </Link>
                <Link
                  to={howItWorksPath(0)}
                  className="accordion-item"
                >
                  {intl.formatMessage(COMMONS.howItWorks)}
                </Link>
                <Link to={howItWorksPath(1)} className="accordion-item">
                  {intl.formatMessage(COMMONS.faq)}
                </Link>
                <Link to={howItWorksPath(2)} className="accordion-item">
                  {intl.formatMessage(COMMONS.buyAndSell)}
                </Link>
              </>
            }
          </Accordion>
        </div>
        <hr />
        <div className="bottom-section">
          <span className="copyrights-label">
            Copyright © {new Date().getFullYear()} Oceana, Ltd. All rights reserved.
          </span>
          <span className="terms-privacy-container">
            <a
              href={termsPath()}
              style={{ marginRight: "16px" }}
              target="_blank"
              referrerPolicy="no-referrer"
              rel="noreferrer"
            >
              {intl.formatMessage(COMMONS.terms)}
            </a>
            <a
              href={privacyPath()}
              target="_blank"
              referrerPolicy="no-referrer"
              rel="noreferrer"
            >
              {intl.formatMessage(COMMONS.privacy)}
            </a>
          </span>
          {/* <SocialMediaBar /> */}
        </div>
      </div>
    </>
  );
};

const StyledSectionTitle = styled.div`
  ${getCSSOfStyledComponent(HairlineSmall)}
  @media screen and (min-width: 660px) {
    ${getCSSOfStyledComponent(Body2Bold)}
  }
`;

export default Footer;
