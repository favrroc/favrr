import React from "react";
import { ButtonPrimary, Flex } from "../../styleguide/styleguide";
import styled from "styled-components";
import { RESPONSIVE } from "../../../core/constants/responsive.const";
import { PromoDesktopImage, PromoMobileImage, PromoMobileSmallImage, PromoTabletImage } from "../../assets/app-images/AppImages";
import { Link } from "react-router-dom";
import { colors } from "../../../core/constants/styleguide.const";

const HeroPromo = () => {
  return(
    <Promo>
      <StyledFlex>
        <StyledH2>
          <span>Cash<br />In ON</span>
          <br />
            Your<br />Fan-<br />dom
        </StyledH2>
        <Actions>
          <div>Your <span>Obsession</span> Now Pays Off</div>
          <Link to="/start-here">
            <StyledButtonPrimary>Learn More</StyledButtonPrimary>
          </Link>
        </Actions>
      </StyledFlex>
    </Promo>
  );
};

const StyledButtonPrimary = styled(ButtonPrimary)`
    @media (max-width: ${RESPONSIVE.large}) {
        font-size: 14px;
        line-height: 16px;
        height: 40px;
    }
    @media (max-width: ${RESPONSIVE.small}) {
        font-weight: 600;
        font-size: 15px;
        line-height: 26px;
        height: 36px;
    }
`;

const StyledFlex = styled(Flex)`
    align-items: end;
    padding: 90px 60px 58px;
    background: #00001E;
    background-repeat: no-repeat;
    background-image: url(${PromoDesktopImage().props.src});
    background-size: cover;
    background-position: center;
    @media (max-width: ${RESPONSIVE.large}) {
        padding: 68px 46px 42px;
        background-image: url(${PromoTabletImage().props.src});
    }
    @media (max-width: ${RESPONSIVE.medium}) {
        /* flex-direction: column;
        align-items: start;
        padding: 42px 20px 25px; */
        background-image: url(${PromoTabletImage().props.src});
    }
    @media (max-width: ${RESPONSIVE.small}) {
        flex-direction: column;
        align-items: start;
        padding: 42px 20px 25px;
        background-image: url(${PromoMobileImage().props.src});
    }
    @media (max-width: ${RESPONSIVE.xSmall}) {
        background-image: url(${PromoMobileSmallImage().props.src});
    }
`;
const Promo = styled.div`
    max-width: 1272px;
    margin: auto;
    width: 100%;
    box-sizing: border-box;
`;
const StyledH2 = styled.h2`
    font-family: 'Oswald';
    font-style: normal;
    font-weight: 700;
    font-size: 86px;
    line-height: 78px;
    text-align: justify;
    letter-spacing: -0.03em;
    text-transform: uppercase;
    color: ${colors.accentYellow};
    span {
        text-shadow: 0px 24px 24px rgba(15, 15, 15, 0.2);
        color: transparent;
        -webkit-text-stroke: 2px ${colors.accentYellow};
        @media (max-width: ${RESPONSIVE.medium}) {
            -webkit-text-stroke: 1px ${colors.accentYellow};
        }
    }
    margin-bottom: 24px;
    @media (max-width: ${RESPONSIVE.large}) {
        font-size: 66px;
        line-height: 60px;
    }
    @media (max-width: ${RESPONSIVE.medium}) {
        font-size: 39px;
        line-height: 36px;
        margin-bottom: 26px;
    }
    @media (max-width: ${RESPONSIVE.small}) {
        font-size: 39px;
        line-height: 36px;
        margin-bottom: 0;
    }
`;
const Actions = styled.div`
    display: flex;
    gap: 24px;
    flex: 1;
    align-items: center;
    justify-content: center;
    font-family: 'Oswald';
    font-style: normal;
    font-weight: 700;
    font-size: 32px;
    line-height: 48px;
    text-align: center;
    letter-spacing: -0.01em;
    text-transform: uppercase;
    color: #FCFCFD;
    span {
     color: ${colors.accentYellow};   
    }
    @media (max-width: ${RESPONSIVE.large}) {
        font-size: 24px;
        line-height: 36px;
    }
    @media (max-width: ${RESPONSIVE.medium}) {
        font-size: 20px;
        line-height: 31px;
    }
    @media (max-width: ${RESPONSIVE.small}) {
        font-size: 20px;
        line-height: 31px;
        margin: auto;
        margin-top: 42px;
        flex-direction: column;
        gap: 14px;
    }
`;

export default HeroPromo;