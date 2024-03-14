/* eslint-disable camelcase */
import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import SVG from "react-inlinesvg";
import { colors } from "../../../core/constants/styleguide.const";

// league images
import microbeImage from "../../../assets/images/league/plankton.png";
import shrimpImage from "../../../assets/images/league/shrimp.png";
import shrimpGreyImage from "../../../assets/images/league/shrimp-grey.png";
import crabImage from "../../../assets/images/league/crab.png";
import crabGreyImage from "../../../assets/images/league/crab-grey.png";
import blowfishImage from "../../../assets/images/league/blow-fish.png";
import lobsterImage from "../../../assets/images/league/lobster.png";
import octopusImage from "../../../assets/images/league/octopus.png";
import turtleImage from "../../../assets/images/league/turtle.png";
import dolphineImage from "../../../assets/images/league/dolphin.png";
import sharkImage from "../../../assets/images/league/shark.png";
import whaleImage from "../../../assets/images/league/spouting-whale.png";

import badgePositionGold from "../../../assets/images/badge1.svg";
import badgePositionSilwer from "../../../assets/images/badge2.svg";
import badgePositionBronze from "../../../assets/images/badge3.svg";

export const BadgePositionGold = () => badgePositionGold;
export const BadgePositionSilwer = () => badgePositionSilwer;
export const BadgePositionBronze = () => badgePositionBronze;

export const MicrobeImage = () => <img src={microbeImage} alt="microbe" />;
export const ShrimpImage = () => <img src={shrimpImage} alt="shrimp" />;
export const ShrimpGreyImage = () => <img src={shrimpGreyImage} alt="shrimp" />;
export const CrabImage = () => <img src={crabImage} alt="crab" />;
export const CrabGreyImage = () => <img src={crabGreyImage} alt="crab" />;
export const BlowfishImage = () => <img src={blowfishImage} alt="blowfish" />;
export const LobsterImage = () => <img src={lobsterImage} alt="lobster" />;
export const OctopusImage = () => <img src={octopusImage} alt="octopus" />;
export const TurtleImage = () => <img src={turtleImage} alt="turtle" />;
export const DolphineImage = () => <img src={dolphineImage} alt="dolphine" />;
export const SharkImage = () => <img src={sharkImage} alt="shark" />;
export const WhaleImage = () => <img src={whaleImage} alt="whale" />;

// Charity Logos
import acluLogo from "../../../assets/images/charities/ACLU_logo.svg";
import aspcaLogo from "../../../assets/images/charities/ASPCA_logo.svg";
import coolearthLogo from "../../../assets/images/charities/CoolEarth_logo.svg";
import feedingamericaLogo from "../../../assets/images/charities/FeedingAmerica_logo.svg";
import habitatLogo from "../../../assets/images/charities/Habitat_for_humanity_logo.svg";
import lcvLogo from "../../../assets/images/charities/LCV_logo.svg";
import specialLogo from "../../../assets/images/charities/SpecialOlympics_logo.svg";
import thehumanLogo from "../../../assets/images/charities/TheHumaneLeague_logo.svg";
import thehungerLogo from "../../../assets/images/charities/TheHungerProject_logo.svg";
import unicefLogo from "../../../assets/images/charities/Unicef_logo.svg";

export const CharityLogoImage = (index: number) => {
  let imageSrc: any = "";
  switch (index) {
  case 1: imageSrc = acluLogo; break;
  case 2: imageSrc = aspcaLogo; break;
  case 3: imageSrc = coolearthLogo; break;
  case 4: imageSrc = feedingamericaLogo; break;
  case 5: imageSrc = habitatLogo; break;
  case 6: imageSrc = lcvLogo; break;
  case 7: imageSrc = specialLogo; break;
  case 8: imageSrc = thehumanLogo; break;
  case 9: imageSrc = thehungerLogo; break;
  case 10: imageSrc = unicefLogo; break;
  default:
    imageSrc = unicefLogo;
    break;
  }
  return (
    <img src={imageSrc} alt={`charity-logo-${index}`} />
  );
};

// social icons
const StyledSocialLink: typeof Link = styled(Link)`
  & > svg {
    fill: ${colors.neutrals5};
  }
  & > svg:hover {
    fill: ${colors.neutrals8};
  }
`;
export const TwitterImage = (props: { url: string; }) => (
  <StyledSocialLink to={props.url} target="_blank" style={{ height: "15px" }}>
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="13"><path fillRule="evenodd" d="M1.62 7.833C.518 7.836-.194 9.092.485 10.044c.973 1.363 2.737 2.456 5.681 2.456 4.563 0 8.226-3.719 7.714-8.113l.751-1.503c.521-1.042-.384-2.227-1.527-1.999l-.993.199c-.263-.139-.535-.244-.768-.32C10.89.617 10.341.5 9.833.5c-.913 0-1.701.234-2.327.704-.619.464-.968 1.075-1.159 1.635-.088.258-.147.518-.185.766-.354-.111-.715-.261-1.069-.445-.802-.415-1.451-.942-1.817-1.404-.614-.775-1.915-.717-2.371.29-.643 1.42-.467 3.102.111 4.462a6.57 6.57 0 0 0 .754 1.324l-.151.001zm4.546 3.334c-2.576 0-3.907-.933-4.596-1.898-.031-.043 0-.102.054-.103.701-.002 2.139-.035 3.087-.59.049-.029.038-.101-.016-.119-2.211-.743-3.467-3.891-2.575-5.86.02-.045.081-.051.112-.012C3.251 3.871 5.48 5.131 7.419 5.166c.042.001.074-.037.067-.079-.078-.507-.376-3.254 2.347-3.254.65 0 1.618.317 1.974.642a.07.07 0 0 0 .061.017l1.498-.3c.054-.011.098.046.073.095l-.929 1.858c-.007.013-.008.028-.006.042.651 3.658-2.345 6.978-6.337 6.978z" fill="#808191" /></svg>
  </StyledSocialLink>
);
export const InstagramImage = (props: { url: string; }) => (
  <StyledSocialLink to={props.url} target="_blank" style={{ height: "16.67px" }}>
    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17"><path fillRule="evenodd" d="M11.166 3.167H5.833c-1.473 0-2.667 1.194-2.667 2.667v5.333c0 1.473 1.194 2.667 2.667 2.667h5.333c1.473 0 2.667-1.194 2.667-2.667V5.834c0-1.473-1.194-2.667-2.667-2.667zM5.833 1.834a4 4 0 0 0-4 4v5.333a4 4 0 0 0 4 4h5.333a4 4 0 0 0 4-4V5.834a4 4 0 0 0-4-4H5.833z" /><path d="M11.834 5.833c.368 0 .667-.298.667-.667s-.298-.667-.667-.667-.667.298-.667.667.299.667.667.667z" /><path fillRule="evenodd" d="M11.834 8.5c0 1.841-1.492 3.333-3.333 3.333S5.167 10.341 5.167 8.5 6.659 5.167 8.5 5.167s3.333 1.492 3.333 3.333zm-1.333 0a2 2 0 0 1-4 0 2 2 0 0 1 4 0z" /></svg>
  </StyledSocialLink>
);
export const FacebookImage = (props: { url: string; }) => (
  <StyledSocialLink to={props.url} target="_blank" style={{ height: "16.67px" }}>
    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17"><path fillRule="evenodd" d="M8.5 13.834c2.946 0 5.333-2.388 5.333-5.333S11.445 3.167 8.5 3.167 3.166 5.555 3.166 8.5s2.388 5.333 5.333 5.333zm0 1.333A6.67 6.67 0 0 0 15.166 8.5 6.67 6.67 0 0 0 8.5 1.834 6.67 6.67 0 0 0 1.833 8.5 6.67 6.67 0 0 0 8.5 15.167z" /><path d="M8.5 7.167c0-.368.298-.667.667-.667h.667c.368 0 .667-.298.667-.667s-.299-.667-.667-.667h-.667a2 2 0 0 0-2 2V8.5H6.5c-.368 0-.667.298-.667.667s.298.667.667.667h.667v4c0 .368.298.667.667.667s.667-.298.667-.667v-4h1.333c.368 0 .667-.298.667-.667s-.299-.667-.667-.667H8.5V7.167z" /></svg>
  </StyledSocialLink>
);

// verified/unverified user
import verifiedUserImage from "../../../assets/images/verify-user/verified.png";
import unverifiedUserImage from "../../../assets/images/verify-user/not-verified.png";

export const VerifiedUserImage = () => <img src={verifiedUserImage} alt="verified" width={156} />;
export const UnverifiedUserImage = () => <img src={unverifiedUserImage} alt="not verified" width={156} />;

// pencil icon
import pencilImage from "../../../assets/images/pencil.svg";

export const PencilImage = (props: {
  size: "small" | "large";
}) => (
  <img
    src={pencilImage}
    width={props.size === "small" ? 13.26 : 26.53}
    height={props.size === "small" ? 13.26 : 26.53}
    alt="pencil"
  />
);

// avatars
import imagePlaceholderImage from "../../../assets/images/avatars/image-placeholder.svg";
import wrongImagePlaceholderImage from "../../../assets/images/avatars/wrong-image-placeholder.svg";
import oceanaCoinImage from "../../../assets/images/oceana-placeholder.svg";

export const ImagePlaceholderImage = () => <img src={imagePlaceholderImage} alt="image-placeholder" />;
export const WrongImagePlaceholderImage = () => <img src={wrongImagePlaceholderImage} alt="wrongImagePlaceholderImage" />;
export const OceanaCoinImage = () => <img src={oceanaCoinImage} alt="oceanaCoinImage" />;

// arrows
import rightArrowImage from "../../../assets/images/arrow-icons/right-arrow.svg";

export const RightArrowImage = () => <img src={rightArrowImage} alt="right-arrow" />;

// chevrons
import chevron3Image from "../../../assets/images/chevron3.svg";

export const Chevron3Image = () => <img src={chevron3Image} alt="chevron3Image" />;

// devices
import mobileDeviceImage from "../../../assets/images/devices/mobile.png";
import tabletDeviceImage from "../../../assets/images/devices/tablet.png";

export const MobileDeviceImage = () => <img src={mobileDeviceImage} alt="mobileDeviceImage" />;
export const TabletDeviceImage = () => <img src={tabletDeviceImage} alt="tabletDeviceImage" />;

// check icons
import greenCheckFilledImage from "../../../assets/images/check-icons/green-check-filled.svg";

export const GreenCheckFilledImage = () => <img src={greenCheckFilledImage} alt="greenCheckFilledImage" />;

// error icons
import errorImage from "../../../assets/images/error.svg";
export const ErrorIconImage = () => <img src={errorImage} alt="ErrorIconImage" />;

// error icons
import infoImage from "../../../assets/images/info.svg";
export const InfoIconImage = () => <img src={infoImage} alt="InfoIconImage" />;

// loader icons
import oceanaCoinIconImage from "../../../assets/images/oceana-coin.svg";
import favrrIconImage from "../../../assets/images/loader.svg";

export const OceanaCoinIconImage = () => <SVG src={oceanaCoinIconImage} />;
export const FavrrIconImage = () => <SVG src={favrrIconImage} />;

// cross icons
import crossImage from "../../../assets/images/close.svg";

export const CrossImage = () => <img src={crossImage} alt="crossImage" />;

// social icons
import twitterIconSrc from "../../../assets/images/twitter-icon.svg";
export const TwitterIconImage = () => <img src={twitterIconSrc} alt="TwitterIconImage" />;
import instagramIconSrc from "../../../assets/images/instagram-icon.svg";
export const InstagramIconImage = () => <img src={instagramIconSrc} alt="InstagramIconImage" />;
import facebookIconSrc from "../../../assets/images/facebook-icon.svg";
export const FacebookIconImage = () => <img src={facebookIconSrc} alt="FacebookIconImage" />;

/******************************************************************************************************
                                            Start Here Page
 ******************************************************************************************************/
// hero module
import startHereDemo1TabletImage from "../../../assets/images/demos/start-here-demo-1-tablet.png";
import startHereDemo1MobileImage from "../../../assets/images/demos/start-here-demo-1-mobile.png";
import startHereDemo2MobileImage from "../../../assets/images/demos/start-here-demo-2-mobile.png";
import charity3Image from "../../../assets/images/demos/charity3.jpg";
import charity4Image from "../../../assets/images/demos/charity4.jpg";
import charity5Image from "../../../assets/images/demos/charity5.jpg";
import promoDesktopImage from "../../../assets/images/promo/promo_desktop.png";
import promoTabletImage from "../../../assets/images/promo/promo_tablet.png";
import promoMobileImage from "../../../assets/images/promo/promo_mobile.png";
import promoMobileSmallImage from "../../../assets/images/promo/promo_mobilesmall.png";

export const StartHereDemo1TabletImage = () => <img src={startHereDemo1TabletImage} alt="startHereDemo1TabletImage" />;
export const StartHereDemo1MobileImage = () => <img src={startHereDemo1MobileImage} alt="startHereDemo1MobileImage" />;
export const StartHereDemo2MobileImage = () => <img src={startHereDemo2MobileImage} alt="startHereDemo2MobileImage" />;
export const Charity3Image = () => <img src={charity3Image} alt="charity3Image" />;
export const Charity4Image = () => <img src={charity4Image} alt="charity4Image" />;
export const Charity5Image = () => <img src={charity5Image} alt="charity5Image" />;
export const PromoDesktopImage = () => <img src={promoDesktopImage} alt="promoTabletImage" />;
export const PromoTabletImage = () => <img src={promoTabletImage} alt="promoTabletImage" />;
export const PromoMobileImage = () => <img src={promoMobileImage} alt="promoTabletImage" />;
export const PromoMobileSmallImage = () => <img src={promoMobileSmallImage} alt="promoTabletImage" />;

// charity icons
import charityIcon_0_0 from "../../../assets/images/charity/0-0.svg";
import charityIcon_0_1 from "../../../assets/images/charity/0-1.svg";
import charityIcon_0_2 from "../../../assets/images/charity/0-2.svg";
import charityIcon_0_3 from "../../../assets/images/charity/0-3.svg";
import charityIcon_0_4 from "../../../assets/images/charity/0-4.svg";
import charityIcon_0_5 from "../../../assets/images/charity/0-5.svg";
import charityIcon_0_6 from "../../../assets/images/charity/0-6.svg";
import charityIcon_0_7 from "../../../assets/images/charity/0-7.svg";
import charityIcon_0_8 from "../../../assets/images/charity/0-8.svg";
import charityIcon_0_9 from "../../../assets/images/charity/0-9.svg";
import charityIcon_0_10 from "../../../assets/images/charity/0-10.svg";
import charityIcon_0_11 from "../../../assets/images/charity/0-11.svg";
import charityIcon_0_12 from "../../../assets/images/charity/0-12.svg";
import charityIcon_0_13 from "../../../assets/images/charity/0-13.svg";
import charityIcon_1_0 from "../../../assets/images/charity/1-0.svg";
import charityIcon_1_1 from "../../../assets/images/charity/1-1.svg";
import charityIcon_1_2 from "../../../assets/images/charity/1-2.svg";
import charityIcon_1_3 from "../../../assets/images/charity/1-3.svg";
import charityIcon_1_4 from "../../../assets/images/charity/1-4.svg";
import charityIcon_1_5 from "../../../assets/images/charity/1-5.svg";
import charityIcon_1_6 from "../../../assets/images/charity/1-6.svg";
import charityIcon_1_7 from "../../../assets/images/charity/1-7.svg";
import charityIcon_1_8 from "../../../assets/images/charity/1-8.svg";
import charityIcon_1_9 from "../../../assets/images/charity/1-9.svg";
import charityIcon_1_10 from "../../../assets/images/charity/1-10.svg";
import charityIcon_1_11 from "../../../assets/images/charity/1-11.svg";
import charityIcon_1_12 from "../../../assets/images/charity/1-12.svg";
import charityIcon_1_13 from "../../../assets/images/charity/1-13.svg";
import charityIcon_2_0 from "../../../assets/images/charity/2-0.svg";
import charityIcon_2_1 from "../../../assets/images/charity/2-1.svg";
import charityIcon_2_2 from "../../../assets/images/charity/2-2.svg";
import charityIcon_2_3 from "../../../assets/images/charity/2-3.svg";
import charityIcon_2_4 from "../../../assets/images/charity/2-4.svg";
import charityIcon_2_5 from "../../../assets/images/charity/2-5.svg";
import charityIcon_2_6 from "../../../assets/images/charity/2-6.svg";
import charityIcon_2_7 from "../../../assets/images/charity/2-7.svg";
import charityIcon_2_8 from "../../../assets/images/charity/2-8.svg";
import charityIcon_2_9 from "../../../assets/images/charity/2-9.svg";
import charityIcon_2_10 from "../../../assets/images/charity/2-10.svg";
import charityIcon_2_11 from "../../../assets/images/charity/2-11.svg";
import charityIcon_2_12 from "../../../assets/images/charity/2-12.svg";
import charityIcon_2_13 from "../../../assets/images/charity/2-13.svg";

export const CharityIconImage = (rowIndex: number, colIndex: number) => {
  let imageSrc: any = "";
  switch (colIndex) {
  case 0: imageSrc = rowIndex === 0 ? charityIcon_0_0 : rowIndex === 1 ? charityIcon_1_0 : charityIcon_2_0; break;
  case 1: imageSrc = rowIndex === 0 ? charityIcon_0_1 : rowIndex === 1 ? charityIcon_1_1 : charityIcon_2_1; break;
  case 2: imageSrc = rowIndex === 0 ? charityIcon_0_2 : rowIndex === 1 ? charityIcon_1_2 : charityIcon_2_2; break;
  case 3: imageSrc = rowIndex === 0 ? charityIcon_0_3 : rowIndex === 1 ? charityIcon_1_3 : charityIcon_2_3; break;
  case 4: imageSrc = rowIndex === 0 ? charityIcon_0_4 : rowIndex === 1 ? charityIcon_1_4 : charityIcon_2_4; break;
  case 5: imageSrc = rowIndex === 0 ? charityIcon_0_5 : rowIndex === 1 ? charityIcon_1_5 : charityIcon_2_5; break;
  case 6: imageSrc = rowIndex === 0 ? charityIcon_0_6 : rowIndex === 1 ? charityIcon_1_6 : charityIcon_2_6; break;
  case 7: imageSrc = rowIndex === 0 ? charityIcon_0_7 : rowIndex === 1 ? charityIcon_1_7 : charityIcon_2_7; break;
  case 8: imageSrc = rowIndex === 0 ? charityIcon_0_8 : rowIndex === 1 ? charityIcon_1_8 : charityIcon_2_8; break;
  case 9: imageSrc = rowIndex === 0 ? charityIcon_0_9 : rowIndex === 1 ? charityIcon_1_9 : charityIcon_2_9; break;
  case 10: imageSrc = rowIndex === 0 ? charityIcon_0_10 : rowIndex === 1 ? charityIcon_1_10 : charityIcon_2_10; break;
  case 11: imageSrc = rowIndex === 0 ? charityIcon_0_11 : rowIndex === 1 ? charityIcon_1_11 : charityIcon_2_11; break;
  case 12: imageSrc = rowIndex === 0 ? charityIcon_0_12 : rowIndex === 1 ? charityIcon_1_12 : charityIcon_2_12; break;
  case 13: imageSrc = rowIndex === 0 ? charityIcon_0_13 : rowIndex === 1 ? charityIcon_1_13 : charityIcon_2_13; break;
  }
  return (
    <img src={imageSrc} alt={`charity-icon-${rowIndex}-${colIndex}`} />
  );
};

// how it works images
import fansPlayImage from "../../../assets/images/demos/fans-play.png";
import celebsGiveImage from "../../../assets/images/demos/celebs-give.png";
import charitiesReceiveImage from "../../../assets/images/demos/charities-receive.png";

export const FansPlayImage = () => <img src={fansPlayImage} alt="fansPlayImage" />;
export const CelebsGiveImage = () => <img src={celebsGiveImage} alt="celebsGiveImage" />;
export const CharitiesReceiveImage = () => <img src={charitiesReceiveImage} alt="charitiesReceiveImage" />;

// wallet icons
import metamaskIconImage from "../../../assets/images/wallet/metamask.svg";
import coinbaseIconImage from "../../../assets/images/wallet/coinbase-v2.svg";
import walletConnectIconImage from "../../../assets/images/wallet/walletconnect.svg";

export const MetamaskIconImage = () => <img src={metamaskIconImage} alt="metamaskIconImage" />;
export const CoinbaseIconImage = () => <img src={coinbaseIconImage} alt="coinbaseIconImage" />;
export const WalletConnectIconImage = () => <img src={walletConnectIconImage} alt="walletConnectIconImage" />;