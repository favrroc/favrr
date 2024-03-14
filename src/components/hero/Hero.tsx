import React from "react";
import SVG from "react-inlinesvg";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { getCSSOfStyledComponent } from "../../core/util/base.util";

import { RESPONSIVE } from "../../core/constants/responsive.const";
import { colors, sizes } from "../../core/constants/styleguide.const";
import { howItWorksPath } from "../../core/util/pathBuilder.util";
import { RightArrowImage } from "../assets/app-images/AppImages";
import {
  Body2,
  ButtonPrimary,
  Col,
  Flex,
  Hairline2,
  HairlineSmall,
  Padding
} from "../styleguide/styleguide";
import desktopHero from "./../../assets/images/hero-desktop.png";
import smallHero from "./../../assets/images/hero-mobile.png";
import tabletHero from "./../../assets/images/hero-tablet.png";
import "./hero.scss";

const Hero = () => {
  return (
    <HeroFlex className="hero-banner">
      <LeftCol>
        <StyledHairline className="font-neutrals4">
          CASH IN ON YOUR FAN OBSESSION
        </StyledHairline>
        <StyledHeading
          className="font-neutrals8"
          style={{ margin: "16px 0 32px 0" }}
        >
          UNLOCK THE ULTIMATE
          <br className="hide-md" /> ASSET, YOUR TRIBE
        </StyledHeading>
        <Body2 style={{ color: colors.neutrals4 }}>
          Invest in who and what you love most alongside
          <br className="hide-md" /> your fellow super fans!
        </Body2>
        <Flex style={{ paddingTop: "40px" }}>
          <FlexCol>
            <ButtonPrimary
              onClick={(e: React.MouseEvent<HTMLElement>) => {
                e.preventDefault();
                document
                  .querySelector("#explore")
                  ?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                    inline: "center"
                  });
              }}
            >
              Explore Now
            </ButtonPrimary>
            <StyledLink to={howItWorksPath(0)}>
              <StyledRightArrowSVG src={RightArrowImage().props.src} />
              How It Works
            </StyledLink>
          </FlexCol>
        </Flex>
      </LeftCol>
      <RightCol />
    </HeroFlex>
  );
};

const FlexCol = styled(Flex)`
  gap: 37px;
  @media screen and (max-width: ${RESPONSIVE.small}) {
    gap: 21px;
  }
  @media screen and (max-width: ${RESPONSIVE.xSmall}) {
    gap: 11px;
  }
`;

const StyledHeading = styled.div`
  font-family: "Oswald";
  font-style: normal;
  font-weight: 700;
  font-size: 48px;
  line-height: 56px;
  letter-spacing: -0.02em;

  @media screen and (max-width: 375px) {
    font-size: 40px;
    line-height: 40px;
  }
`;

const StyledHairline = styled.div`
  ${getCSSOfStyledComponent(HairlineSmall)}
  font-size: ${sizes.sm};
  @media screen and (max-width: ${RESPONSIVE.small}) {
    ${getCSSOfStyledComponent(Hairline2)}
  }
`;

const StyledLink = styled(Link)`
  background: none;
  height: 48px;
  line-height: ${sizes.base};
  font-family: "DM Sans";
  display: flex;
  align-items: center;
  padding: 0;
  color: ${colors.grayLighter};
`;

const StyledRightArrowSVG = styled(SVG)`
  padding-right: 11px;
  ${StyledLink}:hover & path {
    fill: #3f8cff;
  }
  @media screen and (max-width: ${RESPONSIVE.xSmall}) {
    display: none;
  }
`;

const LeftCol = styled(Col)`
  flex: 1;
  @media screen and (max-width: ${RESPONSIVE.small}) {
    flex: none;
  }
`;

const RightCol = styled(Col)`
  flex: 1;
  background-image: url(${desktopHero});
  background-repeat: no-repeat;
  background-position: right top;
  background-size: contain;
  width: 640px;
  height: 676px;
  @media screen and (max-width: ${RESPONSIVE.large}) {
    background-image: url(${tabletHero});
    width: 572px;
    flex: 1;
    height: 573px;
    background-size: contain;
  }
  @media screen and (max-width: ${RESPONSIVE.medium}) {
    flex: 1;
    height: 413px;
    width: inherit;
    background-size: cover;
  }
  @media screen and (max-width: ${RESPONSIVE.small}) {
    flex: none;
    background-image: url(${smallHero});
    background-position: center;
    border-radius: 52px;
    height: 490px;
    width: 100%;
  }
  @media screen and (max-width: ${RESPONSIVE.xSmall}) {
    height: 445px;
  }
`;

const HeroFlex = styled(Flex)`
  /* ${Padding}; */
  margin: auto;
  margin-top: 56px;
  align-items: center;
  padding: 0 76px;
  @media screen and (max-width: ${RESPONSIVE.large}) {
    padding: 0 0 0 76px;
  }
  @media screen and (max-width: ${RESPONSIVE.medium}) {
    padding: 0 0 0 76px;
  }
  @media screen and (max-width: ${RESPONSIVE.small}) {
    flex-direction: column;
    gap: 48px;
    padding: 0 24px;
  }
  @media screen and (max-width: ${RESPONSIVE.xSmall}) {
    padding: 0 4px;
  }
`;

export default Hero;
