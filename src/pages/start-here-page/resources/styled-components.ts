import styled from "styled-components";
import { Body1, Body1Bold, Body2, ButtonPrimary, Caption1Bold, Caption2, H4, HairlineLarge } from "../../../components/styleguide/styleguide";
import { RESPONSIVE } from "../../../core/constants/responsive.const";
import { colors } from "../../../core/constants/styleguide.const";
import { getCSSOfStyledComponent } from "../../../core/util/base.util";

export const StyledLetsGoButton = styled(ButtonPrimary)`
  font-size: 14px;
  line-height: 16px;
  height: 40px;
  @media screen and (min-width: ${RESPONSIVE.tablet}) {
    font-size: 16px;
    line-height: 16px;
    height: 48px;
  }
`;
export const StartHereH1 = styled.span`
  font-family: 'Oswald';
  font-style: normal;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${colors.neutrals8};
  text-transform: uppercase;

  font-size: 32px;
  line-height: 34px;

  @media screen and (min-width: ${RESPONSIVE.tablet}) {
    font-size: 48px;
    line-height: 52px;
  }
  @media screen and (min-width: ${RESPONSIVE.large}) {
    font-size: 56px;
    line-height: 58px;    
  }
`;
export const StartHereH2 = styled.span`
  font-family: 'Oswald';
  font-style: normal;
  font-weight: 700;
  font-size: 32px;
  line-height: 34px;
  color: ${colors.neutrals8};
  text-transform: uppercase;
  @media screen and (min-width: ${RESPONSIVE.tablet}) {
    font-size: 40px;
    line-height: 42px;
  }
  @media screen and (min-width: ${RESPONSIVE.large}) {
    font-size: 48px;
    line-height: 52px;
  }
`;
export const StartHereH6 = styled.span`
  ${getCSSOfStyledComponent(HairlineLarge)}
  color: ${colors.primaryGreen};
  text-transform: uppercase;
  @media screen and (min-width: ${RESPONSIVE.tablet}) {
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 600;
    font-size: 24px;
    line-height: 32px;
  }
`;
export const StyledNeutrals1Container = styled.div`
  max-width: 100%;
  background-color: ${colors.neutrals1};
`;
export const StyledJoinEarlyAdoptersModule = styled.div`
  width: 100%;
  display: flex;
  gap: 4px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: ${colors.neutrals2};
  text-align: center;
  padding: 16px 0px;
  color: ${colors.neutrals6};
  @media screen and (max-width: 430px) {
    padding: 6px 0px;
    gap: 0px;
    flex-direction: column;
  }
`;
export const StyledHeroModule = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 64px 24px 153px;
  @media screen and (min-width: ${RESPONSIVE.tablet}) {
    padding: 90px 24px 156px;
  }
  .caption {
    ${getCSSOfStyledComponent(Caption1Bold)}
    color: ${colors.neutrals4};
  }
  .title {
    ${getCSSOfStyledComponent(StartHereH1)}
    text-align: center;
    margin-top: 16px;
    margin-bottom: 24px;
  }
  button {
    width: 100%;
    @media screen and (min-width: ${RESPONSIVE.tablet}) {
      width: fit-content;
    }
  }
`;
export const StyledCharitiesModule = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin-bottom: 84px;
  @media screen and (min-width: ${RESPONSIVE.tablet}) {
    height: 620px;
    margin-bottom: 120px;
  }
  .unicef-row {
    display: flex;
    flex-direction: row;
    .unicef-item {
      margin: 0px 20px;
      @media screen and (min-width: ${RESPONSIVE.tablet}) {
        margin: 0px 30px;
      }
    }
  }
  .demo1-container {
    z-index: 1;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    img {
      width: 275px;
      height: 560px;
      @media screen and (min-width: ${RESPONSIVE.tablet}) {
        width: 546px;
        height: 758px;
      }
    }
  }
`;
export const StyledModuleContainer1 = styled.div`
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 64px 0px;
  @media screen and (min-width: ${RESPONSIVE.mobile}) {
    padding: 64px 24px;
  }
  @media screen and (min-width: ${RESPONSIVE.tablet}) {
    padding: 120px 64px;
  }
  @media screen and (min-width: ${RESPONSIVE.large}) {
    max-width: 1120px;
  }
`;
export const StyledQuoteModule = styled(StyledModuleContainer1)`
  text-align: center;
  gap: 8px;
  .description {
    font-family: 'Oswald';
    font-style: normal;
    font-weight: 700;
    font-size: 32px;
    line-height: 34px;
    color: ${colors.neutrals8};
    text-transform: uppercase;
    @media screen and (min-width: ${RESPONSIVE.tablet}) {
      font-size: 48px;
      line-height: 52px;
    }
  }
`;
export const StyledHowItWorksModule = styled.div`
  display: grid !important;
  img {
    width: 100%;
  }
  max-width: 327px;
  grid-template-columns: "auto";
  @media screen and (min-width: ${RESPONSIVE.tablet}) {
    max-width: 640px;
    grid-template-columns: 292px 64px 284px;
  }
  @media screen and (min-width: ${RESPONSIVE.large}) {
    max-width: 816px;
    grid-template-columns: 350px 58px 408px;
  }
  .left {
    display: flex;
    flex-direction: column;
    gap: 248px;
    @media screen and (min-width: ${RESPONSIVE.tablet}) {
      gap: 440px;
    }
    .title {
      display: block;
      margin: 12px 0px 24px;
    }
    @media screen and (min-width: ${RESPONSIVE.tablet}) {
      margin: 10px 0px 24px;
    }
  }
  .right {
    position: relative;
    .sticky-image-container {
      position: sticky;
      top: 150px;
      width: fit-content;
      margin-left: auto;
      .imagetransition-enter {
        opacity: 0;
      }
      .imagetransition-enter-active {
        opacity: 1;
        transition: opacity 500ms ease-in;
      }
      .imagetransition-exit {
        opacity: 1;
      }
      .imagetransition-exit-active {
        opacity: 0;
        transition: opacity 300ms ease-in;
      }
    }
  }
`;
export const StyledKeyStatsTopModule = styled(StyledModuleContainer1)`
  .title {
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: Oswald;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: ${colors.primaryGreen};

    font-size: 80px;
    line-height: 80px;
    .left-title {
      margin-bottom: 56px;
    }
    .right-title {
      margin-top: 56px;
    }
    @media screen and (min-width: ${RESPONSIVE.tablet}) {
      font-size: 164px;
      line-height: 216px;
      .left-title {
        margin-bottom: 76px;
      }
      .right-title {
        margin-top: 76px;
      } 
    }
    @media screen and (min-width: ${RESPONSIVE.large}) {
      font-size: 216px;
    }
  }
  .num-4100500 {
    font-family: DM Sans;
    font-weight: 700;
    text-align: center;
    color: ${colors.neutrals1};
    background-color: ${colors.primaryGreen};

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    font-size: 60px;
    line-height: 68px;
    letter-spacing: -6px;
    margin-top: 40px;
    margin-bottom: 24px;
    padding: 8px 14px;
    border-radius: 600px;

    @media screen and (min-width: ${RESPONSIVE.mobile}) {
      font-size: 69px;
      line-height: 72px;
      letter-spacing: -6px;
    }
    @media screen and (min-width: ${RESPONSIVE.tablet}) {
      font-size: 132px;
      line-height: 148px;
      letter-spacing: -12px;
      margin-top: 64px;
      margin-bottom: 64px;
      padding: 8px 27px;
    }
    @media screen and (min-width: ${RESPONSIVE.large}) {
      font-size: 165px;
      line-height: 190px;
      letter-spacing: -12px;
      margin-top: 112px;
      margin-bottom: 64px;
      padding: 8px 36px;
    }
    @media screen and (min-width: ${RESPONSIVE.xLarge}) {
      font-size: 220px;
      line-height: 240px;
      letter-spacing: -15px;
      padding: 8px 60px;
    }
  }

  .content {
    ${getCSSOfStyledComponent(Caption2)}
    text-align: center;
    color: ${colors.neutrals8};
    @media screen and (min-width: ${RESPONSIVE.tablet}) {
      ${getCSSOfStyledComponent(H4)}
    }
  }
`;
export const StyledKeyStatsBottomModule = styled.div`
  max-width: 1142px;
  box-sizing: border-box;
  align-items: flex-start;
  display: grid;
  position: relative;
  grid-auto-flow: row;
  gap: 64px;
  @media screen and (min-width: ${RESPONSIVE.large}) {
    grid-auto-flow: column;
    gap: 32px;
  }
  @media screen and (min-width: ${RESPONSIVE.xLarge}) {
    gap: 52px;
  }
  .card {
    box-sizing: border-box;
    background-color: ${colors.primaryGreen};
    border-radius: 16px;
    color: ${colors.neutrals1};
    text-align: center;
    padding: 32px 24px;
    display: flex;
    flex-direction: column;

    position: relative;
    width: 312px;
    gap: 50px;
    top: 0px;
    
    @media screen and (min-width: ${RESPONSIVE.tablet}) {
      width: 327px;
    }
    @media screen and (min-width: ${RESPONSIVE.tablet}) {
      gap: 37px;
      width: 346px;
    }
    @media screen and (min-width: ${RESPONSIVE.large}) {
      position: sticky;
      top: 150px;
      gap: 13px;
      width: 266px;
    }
    @media screen and (min-width: ${RESPONSIVE.xLarge}) {
      gap: 37px;
      width: 346px;
    }
    
    .title {
      ${getCSSOfStyledComponent(HairlineLarge)}
    }
    .value {
      font-family: "DM Sans";
      font-weight: 700;
      letter-spacing: -0.02em;

      font-size: 100px;
      line-height: 130px;
      sup {
        font-weight: 500;
        font-size: 60px;
        line-height: 78px;
      }
      
      @media screen and (min-width: ${RESPONSIVE.tablet}) {
        font-size: 120px;
        line-height: 156px;
      }
      @media screen and (min-width: ${RESPONSIVE.large}) {
        font-size: 100px;
        line-height: 130px;
        sup {
          font-size: 50px;
          line-height: 65px;
        }
      }
      @media screen and (min-width: ${RESPONSIVE.xLarge}) {
        font-size: 120px;
        line-height: 156px;
        sup {
          font-size: 60px;
          line-height: 78px;
        }
      }
    }
    .description {
      ${getCSSOfStyledComponent(Body1Bold)}
    }
  }
  .card.card-2 {
    margin-top: 0px;
    @media screen and (min-width: ${RESPONSIVE.large}) {
      margin-top: 300px;
    }
    @media screen and (min-width: ${RESPONSIVE.xLarge}) {
      margin-top: 270px;
    }
  }
  .card.card-3 {
    margin-top: 0px;
    @media screen and (min-width: ${RESPONSIVE.large}) {
      margin-top: 570px;
    }
    @media screen and (min-width: ${RESPONSIVE.xLarge}) {
      margin-top: 540px;
    }
  }
`;
export const StyledJoinEarlyAdoptersMainModule = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-left: 24px;
  padding-right: 24px;
  @media screen and (min-width: ${RESPONSIVE.mobile}) {
    padding: 0;
  }
  .title {
    text-transform: uppercase;
    font-family: "Oswald";
    font-weight: 700;
    font-size: 32px;
    line-height: 34px;
    letter-spacing: -0.02em;
    text-align: center;
    color: ${colors.neutrals8};
    @media screen and (min-width: ${RESPONSIVE.tablet}) {
      font-size: 48px;
      line-height: 52px;
    }
  }
  .title2 {
    text-transform: uppercase;
    font-family: Oswald;
    font-weight: 700;
    font-size: 32px;
    line-height: 34px;
    letter-spacing: -0.02em;
    text-align: center;
    color: ${colors.primaryGreen};
    @media screen and (min-width: ${RESPONSIVE.tablet}) {
      font-size: 48px;
      line-height: 48px;
    }
  }
  .caption {
    text-align: center;
    color: ${colors.neutrals4};
    ${getCSSOfStyledComponent(Body2)}
    margin: 16px 0px 48px;
    @media screen and (min-width: ${RESPONSIVE.tablet}) {
      ${getCSSOfStyledComponent(Body1)}
    }
  }
  .caption.caption2 {
    margin: 16px 0px 32px;
  }
  .email-input {
    display: flex;
    width: 100%;
    flex-direction: column;
    gap: 24px;
    @media screen and (min-width: ${RESPONSIVE.tablet}) {
      width: 620px;
      flex-direction: row;
      gap: 16px;
    }
  }
`;
export const StyledWhatToKnowModule = styled.div`
  display: flex;
  flex-direction: column;
  gap: 64px;
  padding-left: 24px;
  padding-right: 24px;
  @media screen and (min-width: ${RESPONSIVE.mobile}) {
    padding: 0;
  }
  @media screen and (min-width: ${RESPONSIVE.tablet}) {
    gap: 96px;
  }
  @media screen and (min-width: ${RESPONSIVE.large}) {
    max-width: 1120px;
  }
  .wtk-header {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    gap: 24px;
    width: 100%;
    @media screen and (min-width: ${RESPONSIVE.tablet}) {
      flex-direction: row;
      justify-content: space-between;  
      gap: 0px;
    }
    .title {
      font-family: 'Oswald';
      font-style: normal;
      font-weight: 700;
      font-size: 32px;
      line-height: 34px;
      letter-spacing: -0.01em;
      text-transform: uppercase;
      color: ${colors.neutrals8};
      @media screen and (min-width: ${RESPONSIVE.tablet}) {
        font-size: 48px;
        line-height: 52px;
        letter-spacing: -0.02em;
      }
    }
  }
  .divider {
    width: 100%;
    height: 1px;
    background-color: ${colors.neutrals3};
  }
`;