import dayjs from "dayjs";
import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { ErrorCode, FileRejection, useDropzone } from "react-dropzone";
import { Link, useNavigate } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import styled from "styled-components";

import { UserEntity } from "../../../generated-graphql/graphql";
import { ReactComponent as ShareIcon } from "../../assets/images/utility-icons/share.svg";
import {
  AVATAR_IMAGE_SIZE_LIMIT,
  SUPPORTED_IMAGE_FORMATS
} from "../../core/constants/base.const";
import { RESPONSIVE } from "../../core/constants/responsive.const";
import { colors } from "../../core/constants/styleguide.const";
import { ImageVariant } from "../../core/enums/image-variant.enum";
import { League } from "../../core/enums/league.enum";
import { useAppDispatch, useAppSelector } from "../../core/hooks/rtkHooks";
import { useAuthentication } from "../../core/hooks/useAuthentication";
import {
  setShowPlanktonModalAction,
  setShowShareProfileModal
} from "../../core/store/slices/modalSlice";
import {
  ParticipantInfo,
  follow,
  unfollow
} from "../../core/store/slices/participantsSlice";
import { updateUserImagesFromFile } from "../../core/store/slices/userSlice";
import {
  getCSSOfStyledComponent,
  getColorOfValue
} from "../../core/util/base.util";
import { isValidImageDimension } from "../../core/util/image.util";
import { LeagueLib } from "../../core/util/league.util";
import { portfolioEditPath } from "../../core/util/pathBuilder.util";
import {
  Unit,
  formatNumber,
  formatUserDisplay
} from "../../core/util/string.util";
import {
  BadgePositionBronze,
  BadgePositionGold,
  BadgePositionSilwer,
  OceanaCoinImage,
  VerifiedUserImage
} from "../assets/app-images/AppImages";
import PencilOverlayWithLoader from "../image/pencil-overlay-with-loader/PencilOverlayWithLoader";
import UploadImageModal from "../modal/UploadImageModal";
import {
  Block,
  Button2,
  ButtonPrimary,
  ButtonPrimarySmall,
  ButtonSecondary,
  ButtonSecondarySmall,
  Caption2,
  Flex,
  ShareButton
} from "../styleguide/styleguide";
import coinCopySrc from "./../../assets/images/coin-copy.svg";
import globeSrc from "./../../assets/images/globe.svg";

interface Props {
  user?: ParticipantInfo;
}
const UserModule = (props: Props) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { checkAuthentication } = useAuthentication();
  const isPublic = !!props.user;

  // Check wallet connection status & identify self profile on followings and followers tab using this address value.
  const address = useAppSelector((state) => state.user.profile.address);

  // Display self profile. On public portfolio page, this data is useless.
  const {
    loadingProfile: loadingSelfProfile,
    profile: selfProfile,
    league: selfLeague
  } = useAppSelector((state) => state.user);

  const [loadingProfile, profile, league] = isPublic
    ? [false, props.user?.profile as UserEntity, props.user?.league as League]
    : [loadingSelfProfile, selfProfile, selfLeague];

  const [copied, setCopied] = useState<boolean>(false);
  const [disabled, setDisabled] = useState(false);
  const [showUploadImageModal, setShowUploadImageModal] = useState(false);
  const [hoveringAvatarImage, setHoveringAvatarImage] = useState(false);
  const [hasImageDimensionError, setHasImageDimensionError] = useState(false);
  const [hasImageSizeError, setHasImageSizeError] = useState(false);
  const [hasImageFileFormatError, setHasImageFileFormatError] = useState(false);
  const [uploadingAvatarImage, setUploadingAvatarImage] = useState(false);
  const clearImageErrors = () => {
    setHasImageDimensionError(false);
    setHasImageSizeError(false);
    setHasImageFileFormatError(false);
  };

  const onDropAccepted = async (acceptedFiles: File[]) => {
    if (acceptedFiles?.length > 0) {
      const avatarUrl = URL.createObjectURL(acceptedFiles[0]);
      if (!(await isValidImageDimension(avatarUrl, ImageVariant.Avatar))) {
        setHasImageDimensionError(true);
      } else {
        setUploadingAvatarImage(true);
        await dispatch(
          updateUserImagesFromFile({ profileImageFile: acceptedFiles[0] })
        );
        setUploadingAvatarImage(false);
        setShowUploadImageModal(false);
      }
    }
  };
  const onDropRejected = async (fileRejections: FileRejection[]) => {
    clearImageErrors();
    if (fileRejections) {
      const avatarUrl = URL.createObjectURL(fileRejections[0].file);

      // check image dimension
      try {
        if (!(await isValidImageDimension(avatarUrl, ImageVariant.Avatar))) {
          setHasImageDimensionError(true);
        }
      } catch (e) {
        console.log(e);
      }

      // check file size and format
      fileRejections.map((fileRejection) => {
        fileRejection.errors.map((error) => {
          if (error.code === ErrorCode.FileTooLarge) {
            setHasImageSizeError(true);
          } else if (error.code === ErrorCode.FileInvalidType) {
            setHasImageFileFormatError(true);
          }
        });
      });
    }
  };
  const { getRootProps, getInputProps, open } = useDropzone({
    onDropAccepted,
    onDropRejected,
    accept: SUPPORTED_IMAGE_FORMATS,
    maxSize: AVATAR_IMAGE_SIZE_LIMIT,
    multiple: false,
    noClick: true,
    noDrag: true,
    noKeyboard: true
  });

  const handleClickAvatarImage = () => {
    clearImageErrors();
    setShowUploadImageModal(true);
  };

  const displayName = profile.fullName
    ? profile?.fullName
    : formatUserDisplay(profile.address as string);
  const createdAt = profile?.createdAt;

  const toggleCopied = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  const handleClickGetVerified = () => {
    navigate(portfolioEditPath());
  };
  const handleClickShareButton = (isPublic: boolean) => {
    dispatch(
      setShowShareProfileModal({
        showModal: true,
        props: {
          sharetitle: "Share Profile",
          url: window.location.href,
          // url: `oceana.market/fan/${profile?.fullName || profile?.address}`
          img: profile?.profileImageUrl || OceanaCoinImage().props.src,
          public: isPublic
        }
      })
    );
  };
  const handleClickLeagueBadge = () =>
    dispatch(setShowPlanktonModalAction(true));
  const handleClickAddUsername = () =>
    navigate(`${portfolioEditPath()}#add-username`);
  const handleClickAddShortBio = () =>
    navigate(`${portfolioEditPath()}#add-bio`);

  const onClickFollow = async () => {
    if (checkAuthentication()) {
      setDisabled(true);
      await dispatch(follow(profile.address));
      setDisabled(false);
    }
  };
  const onClickUnfollow = async () => {
    setDisabled(true);
    await dispatch(unfollow(profile.address));
    setDisabled(false);
  };

  return (
    <User>
      <Upper has={!!profile.fullName}>
        <div style={{ position: "relative", margin: "auto" }}>
          {/* Avatar Image */}
          {isPublic ? (
            <StyledProfileImageContainer
              imgSrc={profile.profileImageUrl || OceanaCoinImage().props.src}
            />
          ) : (
            <StyledProfileImageContainer
              imgSrc={profile.profileImageUrl || OceanaCoinImage().props.src}
              {...getRootProps()}
              onClick={handleClickAvatarImage}
              onMouseEnter={() => setHoveringAvatarImage(true)}
              onMouseLeave={() => setHoveringAvatarImage(false)}
            >
              <input {...getInputProps()} />
              <PencilOverlayWithLoader
                isMouseHovered={hoveringAvatarImage}
                uploading={uploadingAvatarImage}
              />
            </StyledProfileImageContainer>
          )}

          {/* Badge | League status yellow circle */}
          {isPublic ? (
            <Rank position={props?.user?.rank}>
              <div className={`inner badge-${props?.user?.rank}`}>
                {!loadingProfile && LeagueLib[league].image}
                {props?.user?.rank}
              </div>
            </Rank>
          ) : (
            <svg viewBox="0 0 36 36" className="circular-chart">
              <path
                className="circle"
                strokeDasharray={`${(league + 1) * 10}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
          )}

          {/* League image & title */}
          {!isPublic && (
            <LeagueContainer onClick={handleClickLeagueBadge}>
              {!loadingProfile && LeagueLib[league].image}
              <span>{!loadingProfile && LeagueLib[league].title}</span>
            </LeagueContainer>
          )}
        </div>

        <UsernameCenter isPublic={isPublic}>
          {isPublic && (
            <Username isPublic={isPublic}>
              {profile.fullName
                ? profile?.fullName
                : formatUserDisplay(profile.address as string)}
              {profile.isVerified && (
                <>
                  <img
                    data-for="verified-tooltip"
                    data-tip
                    src={VerifiedUserImage().props.src}
                    alt="Verified"
                  />
                  <ReactTooltip
                    place="top"
                    effect="solid"
                    className="react-tooltip"
                    id="verified-tooltip"
                    delayHide={200}
                  >
                    Verified
                  </ReactTooltip>
                </>
              )}
            </Username>
          )}
          {!isPublic && profile.fullName && profile?.fullName !== "null" && (
            <Username>
              {profile?.fullName}
              {profile.isVerified && (
                <>
                  <img
                    data-for="verified-tooltip"
                    data-tip
                    src={VerifiedUserImage().props.src}
                    alt="Verified"
                  />
                  <ReactTooltip
                    place="top"
                    effect="solid"
                    className="react-tooltip"
                    id="verified-tooltip"
                    delayHide={200}
                  >
                    Verified
                  </ReactTooltip>
                </>
              )}
            </Username>
          )}
          {!isPublic && (
            <>
              <CopyToClipboard text={profile.address} onCopy={toggleCopied}>
                <UsernameAddress
                  style={{
                    justifyContent:
                      league === League.Microbe ? "start" : "center"
                  }}
                  title="Copy address to clipboard."
                >
                  {formatUserDisplay(profile.address as string)}
                  <Flex style={{ position: "relative" }}>
                    <img height="16" src={coinCopySrc} alt="Copy Address" />
                    {copied && <GreenCopied>Copied!</GreenCopied>}
                  </Flex>
                </UsernameAddress>
              </CopyToClipboard>
              {!profile.fullName && (
                <StyledAddProfileDetail
                  style={{ marginTop: 20 }}
                  onClick={handleClickAddUsername}
                >
                  Add Username
                </StyledAddProfileDetail>
              )}
            </>
          )}
        </UsernameCenter>

        {/* Equity & Equity Delta Percent */}
        {isPublic && (
          <Balance>
            {formatNumber({
              value: props?.user?.equity,
              unit: Unit.USDC,
              summarize: false,
              withUnit: true
            })}
            <span
              className={`percentage ${getColorOfValue(
                props?.user?.equityDeltaPercent
              )}`}
            >
              {formatNumber({
                value: props?.user?.equityDeltaPercent,
                unit: Unit.PERCENT,
                summarize: true,
                withUnit: true,
                withSign: true
              })}
            </span>
          </Balance>
        )}

        {!isPublic && league !== League.Microbe ? (
          <>
            {/* Bio */}
            {profile.bio && profile.bio !== "null" ? (
              <Desc>{profile.bio}</Desc>
            ) : (
              <StyledAddProfileDetail onClick={handleClickAddShortBio}>
                Add Short Bio
              </StyledAddProfileDetail>
            )}

            {/* Public Profile Link */}
            <DescLink>
              <img src={globeSrc} alt={`oceana.market/fan/${profile}`} />
              <Link to={`/fan/${profile?.fullName || profile?.address}`}>
                oceana.../{displayName}
              </Link>
            </DescLink>

            {/* Invite Friends & Share Profile */}
            <Flex
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: "48px",
                gap: "8px",
                width: "100%"
              }}
            >
              {profile.isVerified ? (
                <Block data-for="invite-friends-tooltip" data-tip>
                  <StyledButtonSecondary disabled={true}>
                    Invite Friends
                  </StyledButtonSecondary>
                  <ReactTooltip
                    place="top"
                    effect="solid"
                    className="react-tooltip"
                    id="invite-friends-tooltip"
                    delayHide={200}
                  >
                    Coming Soon
                  </ReactTooltip>
                </Block>
              ) : (
                <StyledButtonPrimary onClick={handleClickGetVerified}>
                  Get Verified
                </StyledButtonPrimary>
              )}
              <ShareButton onClick={() => handleClickShareButton(false)}>
                <ShareIcon />
              </ShareButton>
            </Flex>
          </>
        ) : (
          <>
            {profile.bio && profile.bio !== "null" ? (
              <Desc>{profile.bio}</Desc>
            ) : (
              <>
                {!isPublic && (
                  <>
                    <StyledAddProfileDetail onClick={handleClickAddShortBio}>
                      Add Short Bio
                    </StyledAddProfileDetail>
                  </>
                )}
              </>
            )}
            <DescLink>
              <img src={globeSrc} alt={`oceana.market/fan/${profile}`} />
              <Link to={`/fan/${profile?.fullName || profile?.address}`}>
                oceana.../{displayName}
              </Link>
            </DescLink>
          </>
        )}

        {isPublic && (
          <Flex
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: "48px",
              gap: "8px",
              width: "100%"
            }}
          >
            <>
              {props?.user?.isFollowing || profile.address === address ? (
                <StyledButtonSecondarySmall
                  onClick={onClickUnfollow}
                  disabled={profile.address === address ? true : disabled}
                  style={{ fontSize: "14px", lineHeight: "16px", flex: "1" }}
                >
                  Unfollow
                </StyledButtonSecondarySmall>
              ) : (
                <StyledButtonPrimarySmall
                  onClick={onClickFollow}
                  disabled={disabled}
                  style={{ fontSize: "14px", lineHeight: "16px", flex: "1" }}
                >
                  Follow
                </StyledButtonPrimarySmall>
              )}
            </>
            <ShareButton onClick={() => handleClickShareButton(true)}>
              <ShareIcon />
            </ShareButton>
          </Flex>
        )}

        {/* {profile.twitterInfo || profile.facebookInfo && <StyledSocialIconsGroup>
          {profile.twitterInfo && <TwitterImage url={profile.twitterInfo} />}
          {profile.facebookInfo && <FacebookImage url="https://www.facebook.com/" />}
          {profile.discordInfo && <FacebookImage url={profile.discordInfo} />}
        </StyledSocialIconsGroup>} */}
      </Upper>
      {createdAt && (
        <>
          <Strip />
          <Joindate>
            <span style={{ marginRight: "4px" }}>Joined</span>
            {dayjs(createdAt).format("MMM DD, YYYY")}
          </Joindate>
        </>
      )}
      {showUploadImageModal && (
        <UploadImageModal
          imageVariant={ImageVariant.Avatar}
          onOpenFile={() => {
            clearImageErrors();
            open();
          }}
          onClose={() => setShowUploadImageModal(false)}
          hasImageDimensionError={hasImageDimensionError}
          hasImageSizeError={hasImageSizeError}
          hasImageFileFormatError={hasImageFileFormatError}
          uploading={uploadingAvatarImage}
        />
      )}
    </User>
  );
};

const UsernameCenter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: ${(props: { isPublic: boolean; }) =>
    props.isPublic ? "17px" : "12px"};
  width: 100%;
`;

const StyledButtonSecondarySmall = styled(ButtonSecondarySmall)`
  min-width: 122px;
`;

const StyledButtonPrimarySmall = styled(ButtonPrimarySmall)`
  min-width: 122px;
  @media screen and (min-width: ${RESPONSIVE.small}) and (max-width: ${RESPONSIVE.medium}) {
    padding: 0 15px;
  }
`;

const Balance = styled.div`
  font-family: "DM Sans";
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 16px;
  text-align: center;
  color: #fcfcfd;
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 0;
  gap: 8px;
  align-items: center;
  .percentage {
    font-family: "DM Sans";
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    line-height: 16px;
    text-align: center;
    color: #7fba7a;
  }
`;
const Rank = styled.div`
  z-index: 4;
  font-family: "Poppins";
  font-style: normal;
  font-weight: 600;
  font-size: 21px;
  line-height: 35px;
  text-align: center;
  padding: 0;
  height: 40px;
  gap: 10px;
  background: #252e40;
  border-radius: 100px;
  position: absolute;
  bottom: -11px;
  left: 50%;
  transform: translateX(-50%);
  .inner {
    min-width: 14px;
    height: 42px;
    box-shadow: inset 0 0 0 3px #353945;
    border-radius: 64px;
    justify-content: center;
    align-items: center;
    display: flex;
    color: #fcfcfd;
    background: #1f2128;
    padding: 0 12px;
    display: flex;
    gap: 10px;
    &.badge-1 {
      box-shadow: inset 0 0 0 3px #ffd166;
      color: #ffd166;
      @media screen and (max-width: ${RESPONSIVE.small}) {
        box-shadow: inset 0 0 0 2px #ffd166;
      }
      &:after {
        content: "";
        height: 18px;
        width: 18px;
        background: url(${BadgePositionGold}) no-repeat center;
        background-size: contain;
        position: absolute;
        top: 50%;
        transform: translateY(18px);
        @media screen and (max-width: ${RESPONSIVE.small}) {
          transform: translateY(19px);
        }
      }
    }
    &.badge-2 {
      box-shadow: inset 0 0 0 3px #e6e8ec;
      color: #e6e8ec;
      @media screen and (max-width: ${RESPONSIVE.small}) {
        box-shadow: inset 0 0 0 2px #e6e8ec;
      }
      &:after {
        content: "";
        height: 18px;
        width: 18px;
        background: url(${BadgePositionSilwer}) no-repeat center;
        background-size: contain;
        position: absolute;
        top: 50%;
        transform: translateY(18px);
        @media screen and (max-width: ${RESPONSIVE.small}) {
          transform: translateY(19px);
        }
      }
    }
    &.badge-3 {
      box-shadow: inset 0 0 0 3px #e4d7cf;
      color: #e4d7cf;
      @media screen and (max-width: ${RESPONSIVE.small}) {
        box-shadow: inset 0 0 0 2px #e4d7cf;
      }
      &:after {
        content: "";
        height: 18px;
        width: 18px;
        background: url(${BadgePositionBronze}) no-repeat center;
        background-size: contain;
        position: absolute;
        top: 50%;
        transform: translateY(18px);
        @media screen and (max-width: ${RESPONSIVE.small}) {
          transform: translateY(19px);
        }
      }
    }
  }
  img {
    height: 26px;
  }
`;
const Desc = styled(Caption2)`
  text-align: center;
  color: ${colors.neutrals4};
  margin: 0 auto;
  width: 100%;
`;
const GreenCopied = styled.span`
  color: #7fba7a;
  position: absolute;
  left: 24px;
`;
const DescLink = styled.div`
  ${getCSSOfStyledComponent(Button2)}
  color: ${colors.neutrals8};
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 8px;
  overflow-wrap: anywhere;
  img {
    height: 16px;
    width: 16px;
  }
`;
const LeagueContainer = styled.div`
  z-index: 3;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0 8px;
  height: 40px;
  gap: 8px;
  width: 126px;
  background: #252e40;
  border-radius: 100px;
  position: absolute;
  bottom: -11px;
  left: 50%;
  transform: translateX(-50%);
  &:hover {
    background-color: #3f8cff;
  }
  img {
    height: 26px;
  }
  span {
    font-family: "DM Sans";
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    line-height: 16px;
    display: flex;
    align-items: center;
    color: #fcfcfd;
  }
`;
const Strip = styled.div`
  height: 1px;
  width: 100%;
  background: #353945;
`;
const Upper = styled.div`
  align-items: start;
  display: flex;
  flex-direction: column;
  text-align: ${(props: { has: boolean; }) => (props.has ? "center" : "left")};
  gap: 20px;

  .circular-chart {
    display: block;
    margin: 10px auto;
    width: 194px;
    height: 194px;
    position: absolute;
    top: -16px;
    margin: 0;
    left: -17px;
  }

  .circle {
    stroke: #ffd166;
    fill: none;
    stroke-width: 1.75;
    stroke-linecap: round;
    animation: progress 1s ease-out forwards;
  }

  @keyframes progress {
    0% {
      stroke-dasharray: 0 100;
    }
  }
`;
const Joindate = styled.div`
  font-family: "Poppins";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
  display: flex;
  align-items: center;
  text-align: center;
  color: #777e91;
`;
const StyledAddProfileDetail = styled.button`
  ${getCSSOfStyledComponent(Caption2)}
  color: ${colors.primaryBlue};
  border: none;
  padding: 0;
  margin: 0 auto;
  &:hover {
    color: ${colors.neutrals8};
  }
`;
const Username = styled.div`
  font-family: "Poppins";
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 32px;
  color: #fcfcfd;
  margin-bottom: 4px;
  display: block;
  overflow-wrap: anywhere;
  img {
    cursor: pointer;
    height: ${(props: { isPublic: boolean; }) =>
    props.isPublic ? "26px" : "28px"};
    width: ${(props: { isPublic: boolean; }) =>
    props.isPublic ? "26px" : "28px"};
    vertical-align: middle;
    margin-left: 6px;
  }
  @media screen and (max-width: ${RESPONSIVE.medium}) {
    font-size: 20px;
  }
  @media screen and (max-width: ${RESPONSIVE.small}) {
    font-size: 24px;
  }
`;
const UsernameAddress = styled.div`
  cursor: pointer;
  font-family: "Poppins";
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #fcfcfd;
  display: flex;
  align-items: center;
  gap: 8px;
  &:hover {
    filter: brightness(2);
  }
`;
const StyledProfileImageContainer = styled.div`
  position: relative;
  width: 160px;
  height: 160px;
  border-radius: 100%;
  overflow: hidden;
  z-index: 3;
  background: url(${(props: any) => props.imgSrc}) no-repeat center;
  background-size: cover;
`;
const User = styled.div`
  z-index: 2;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 22px;
  gap: 48px;
  width: 256px;
  background: #23262f;
  box-shadow: 0px 40px 32px -24px rgba(15, 15, 15, 0.12);
  border-radius: 16px;
  position: sticky;
  top: 98px;
  margin-top: -180px;
  margin-bottom: 64px;
  box-sizing: border-box;
  @media (max-width: 850px) {
    width: 200px;
  }
  @media (max-width: 576px) {
    margin-bottom: 0;
    width: 100%;
    box-sizing: border-box;
  }
`;
const StyledButtonPrimary = styled(ButtonPrimary)`
  ${getCSSOfStyledComponent(Button2)}
  padding: 0px 15px;
  color: ${colors.neutrals8} !important;
`;
const StyledButtonSecondary = styled(ButtonSecondary)`
  ${getCSSOfStyledComponent(Button2)}
  background-color: ${colors.neutrals3};
  padding: 0px 15px;
  color: ${colors.neutrals8} !important;
`;

export default UserModule;
