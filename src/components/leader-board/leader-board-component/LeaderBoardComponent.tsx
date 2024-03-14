import dayjs from "dayjs";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";

import { useAppDispatch, useAppSelector } from "../../../core/hooks/rtkHooks";
import { Unit, formatNumber } from "../../../core/util/string.util";
import FollowButton from "../../button/follow-button/FollowButton";
import {
  Body1Bold,
  Button2,
  ButtonSecondary,
  ButtonSmall,
  Caption2,
  Flex,
  ShareButton
} from "../../styleguide/styleguide";
import ListButton from "./children/ListButton";

import badge1Src from "../../../assets/images/badge1.svg";
import badge2Src from "../../../assets/images/badge2.svg";
import badge3Src from "../../../assets/images/badge3.svg";
import globeSrc from "../../../assets/images/globe.svg";
import { ReactComponent as ShareIcon } from "../../../assets/images/utility-icons/share.svg";
import { RESPONSIVE } from "../../../core/constants/responsive.const";
import { colors } from "../../../core/constants/styleguide.const";
import { useLowercasedAccount } from "../../../core/hooks/useLowercasedAccount";
import { FollowButtonTypes } from "../../../core/interfaces/follow.type";
import { setShowShareProfileModal } from "../../../core/store/slices/modalSlice";
import { howItWorksPath } from "../../../core/util/pathBuilder.util";
import { OceanaCoinImage } from "../../assets/app-images/AppImages";
import { IShareProfileProps } from "../../modal/share-profile/ShareProfileModal";

const LeaderBoardComponent = () => {
  const dispatch = useAppDispatch();
  const [index, setIndex] = useState(0);
  const { profile } = useAppSelector((state) => state.user);
  const { address } = useLowercasedAccount();

  const { participantsData } = useAppSelector((state) => state.participants);
  const sortedParticipantsData = [...participantsData]
    .sort((a, b) => b.equity - a.equity)
    .slice(0, 5);

  const openShareModal = (action: boolean, data: IShareProfileProps) => {
    dispatch(
      setShowShareProfileModal({
        showModal: action,
        props: {
          sharetitle: "Share Profile",
          url: data.url,
          img: data.img || "",
          customAction: false,
          public: true
        }
      })
    );
  };

  return (
    <>
      <LeaderComponent>
        <Preview>
          {sortedParticipantsData.map((list, i) => {
            return (
              <SlideIn
                className={index === i ? "visible" : ""}
                key={`Preview-${i}`}
              >
                <Link
                  to={`${
                    profile.address === list.profile.address
                      ? "/portfolio"
                      : `/fan/${
                        list.profile?.fullName || list.profile?.address
                      }`
                  }`}
                >
                  <PreviewThumbnail
                    img={
                      list?.profile?.profileImageUrl ||
                      OceanaCoinImage().props.src
                    }
                  >
                    <Badge>
                      <div className={`inner badge-${i + 1}`}>{i + 1}</div>
                    </Badge>
                  </PreviewThumbnail>
                </Link>
                <Body1Bold
                  style={{ overflowWrap: "anywhere" }}
                  className="font-neutrals8"
                >
                  <Link
                    to={`${
                      profile.address === list.profile.address
                        ? "/portfolio"
                        : `/fan/${
                          list.profile?.fullName || list.profile?.address
                        }`
                    }`}
                  >
                    {list.displayName}
                  </Link>
                </Body1Bold>
                <br />
                <StyledButtonSmall>
                  {formatNumber({
                    value: list.equity,
                    unit: Unit.USDC,
                    summarize: true,
                    withUnit: true,
                    decimalToFixed: 1
                  })}
                </StyledButtonSmall>
                <br />
                {list.profile.bio && list.profile.bio !== "null" && (
                  <StyledCaption2 className="font-neutrals4">
                    {list.profile.bio}
                  </StyledCaption2>
                )}
                <DescLink>
                  <img
                    src={globeSrc}
                    alt={`oceana.market/fan/${list.displayName}`}
                  />
                  <Link
                    to={`${
                      profile.address === list.profile.address
                        ? "/portfolio"
                        : `/fan/${
                          list.profile?.fullName || list.profile?.address
                        }`
                    }`}
                  >
                    oceana.market/fan/{list.displayName}
                  </Link>
                </DescLink>
                <Flex className="justify-center align-center gap-8 mt-48">
                  <FollowButton
                    type={FollowButtonTypes.Button}
                    followAddress={list.profile.address}
                    following={list.isFollowing}
                  />
                  {/* <BorderedButton iconSrc={shareSrc} />
                <BorderedButton iconSrc={moreSrc} /> */}
                  <ShareButton
                    onClick={() =>
                      openShareModal(true, {
                        img:
                          list?.profile?.profileImageUrl ||
                          OceanaCoinImage().props.src,
                        url: window.location.href
                      })
                    }
                  >
                    <ShareIcon />
                  </ShareButton>
                </Flex>
                {/* <Flex className="justify-center align-center gap-26 mt-50">
                  {list.profile.twitterInfo && <TwitterImage url={list.profile.twitterInfo} />}
                  {list.profile.facebookInfo && <FacebookImage url={list.profile.facebookInfo} />}
                  {list.profile.discordInfo && <DiscordImage url={list.profile.discordInfo} />}
                </Flex> */}
                {list.profile.createdAt && (
                  <Joined>
                    {`Joined ${dayjs(list.profile.createdAt).format(
                      "MMM DD, YYYY"
                    )}`}
                  </Joined>
                )}
              </SlideIn>
            );
          })}
        </Preview>
        <List>
          <Heading>
            <h2>Fan LeaderBoard</h2>
            <Desc>
              Discover the fans at the top & bottom of the Oceana foodchain.{" "}
              <Link to={howItWorksPath(1, "faq03")}>Learn More</Link>
            </Desc>
          </Heading>
          <PosRel>
            {participantsData.length > 0 && <ActiveIndicator index={index} />}
            <StyledLeaderList>
              {sortedParticipantsData.map((list, i) => {
                return (
                  <ListButton
                    key={`LeaderButton-${i}`}
                    setIndex={() => setIndex(i)}
                    data={list}
                    badge={i + 1}
                    classStyle={`${index === i ? "active" : ""}`}
                    address={address as string}
                  />
                );
              })}
            </StyledLeaderList>
          </PosRel>
          <Flex className="justify-center mt-32">
            <Link to="/fans">
              <ButtonSecondary>See All</ButtonSecondary>
            </Link>
          </Flex>
        </List>
      </LeaderComponent>
      <StyledExploreTop id="explore-top" />
    </>
  );
};

const Joined = styled.div`
  padding-top: 48px;
  margin-top: 48px;
  border-top: 1px solid #353945;
  font-family: "Poppins";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
  text-align: center;
  color: #777e91;
`;

const DescLink = styled(Button2)`
  color: ${colors.neutrals8};
  display: flex;
  justify-content: center;
  margin-top: 20px;
  overflow-wrap: anywhere;
  img {
    height: 16px;
    width: 16px;
    margin-right: 8px;
  }
`;

const PosRel = styled.div`
  position: relative;
`;

const StyledButtonSmall = styled(ButtonSmall)`
  text-align: center;
  color: ${colors.neutrals8};
  margin-top: 4px;
`;

const StyledCaption2 = styled(Caption2)`
  margin-top: 20px;
`;

const PreviewThumbnail = styled.div`
  width: 160px;
  height: 160px;
  border-radius: 100%;
  margin: auto;
  margin-bottom: 32px;
  background: #fcfcfd;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url("${(props: { img: string }) => props.img}");
  background-size: cover;
  position: relative;
`;

const Badge = styled.div`
  font-family: "Poppins";
  font-style: normal;
  font-weight: 600;
  font-size: 21px;
  line-height: 35px;
  text-align: center;
  position: absolute;
  bottom: 15px;
  right: 0;
  .inner {
    width: 35px;
    height: 35px;
    box-shadow: inset 0 0 0 2px #353945;
    border-radius: 64px;
    justify-content: center;
    align-items: center;
    display: flex;
    color: #fcfcfd;
    background: #1f2128;
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
        background: url(${badge1Src}) no-repeat center;
        background-size: contain;
        position: absolute;
        top: 50%;
        transform: translateY(13px);
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
        background: url(${badge2Src}) no-repeat center;
        background-size: contain;
        position: absolute;
        top: 50%;
        transform: translateY(13px);
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
        background: url(${badge3Src}) no-repeat center;
        background-size: contain;
        position: absolute;
        top: 50%;
        transform: translateY(13px);
      }
    }
  }
`;

const Heading = styled.div`
  margin: 40px 80px 40px;
  @media screen and (max-width: ${RESPONSIVE.medium}) {
    margin: 32px 32px 56px;
  }
  @media screen and (max-width: ${RESPONSIVE.small}) {
    margin: 0px 0 56px;
  }
`;

const StyledLeaderList = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
  > *:nth-child(n + 6) {
    display: none;
  }
  @media screen and (max-width: ${RESPONSIVE.small}) {
    flex-direction: row;
    gap: 0;
    flex-wrap: wrap;
    justify-content: space-between;
    > * {
      order: 4;
      flex: none;
    }
    > *:nth-child(1) {
      order: 2;
      top: -32px;
      flex: 1;
      max-width: 33.33333%;
    }
    > *:nth-child(2) {
      order: 1;
      flex: 1;
      max-width: 33.33333%;
    }
    > *:nth-child(3) {
      order: 3;
      flex: 1;
      max-width: 33.33333%;
    }
  }
`;

const ActiveIndicator = styled.div`
  content: "";
  box-shadow: -51px 0 42px -12px rgb(0 0 0 / 20%);
  z-index: 0;
  position: absolute;
  transform: translateY(
    ${(props: any) => props.index * 88 + props.index * 16}px
  );
  transition: all 0.5s ease;
  width: 80%;
  height: 88px;
  &:before {
    content: "";
    background: #242731;
    border-radius: 20px;
    position: absolute;
    height: 75px;
    width: 75px;
    z-index: 0;
    left: -36px;
    transform: rotate(45deg);
    top: 7px;
  }
  @media screen and (max-width: ${RESPONSIVE.small}) {
    display: none;
  }
`;

const Desc = styled.div`
  font-family: "Poppins";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #b1b5c4;
  a {
    color: #3f8cff;
    cursor: pointer;
    &:hover {
      color: #fcfcfd !important;
    }
  }
`;

const LeaderComponent = styled.div`
  display: flex;
  max-width: ${RESPONSIVE.maxWidth};
  margin: auto;
  width: 100%;
  margin-top: 128px;
  /* margin-bottom: 128px; */
  box-sizing: border-box;
  /* padding: 0; */
  @media screen and (min-width: ${RESPONSIVE.xLarge}) {
    /* padding-left: 0;
    padding-right: 0; */
  }
  @media screen and (max-width: 1439px) {
    /* padding-left: 76px;
    padding-right: 76px; */
  }
  @media screen and (max-width: ${RESPONSIVE.large}) {
    /* padding-left: 76px;
    padding-right: 76px; */
  }
  @media screen and (max-width: ${RESPONSIVE.medium}) {
    /* padding-left: 76px;
    padding-right: 76px; */
  }
  @media screen and (max-width: ${RESPONSIVE.small}) {
    /* padding-left: 24px;
    padding-right: 24px; */
  }
  @media screen and (max-width: 375px) {
    /* padding: 0 24px; */
    /* margin-bottom: 96px; */
    width: 100%;
  }
  @media screen and (max-width: 320px) {
    padding: 0 4px;
  }
`;

const Preview = styled.div`
  position: relative;
  flex-basis: 444px;
  display: flex;
  align-items: center;
  z-index: 0;
  text-align: center;

  @media screen and (max-width: ${RESPONSIVE.large}) {
    flex-basis: 332px;
  }

  @media screen and (max-width: ${RESPONSIVE.medium}) {
    flex-basis: 290px;
  }

  @media screen and (max-width: ${RESPONSIVE.small}) {
    display: none;
  }
`;
const List = styled.div`
  background: #242731;
  box-shadow: 0 0 20px 0px rgba(15, 15, 15, 0.15);
  border-radius: 12px;
  flex: 1;
  min-height: 300px;
  padding: 1rem 0 56px 0;
  z-index: 1;
  h2 {
    font-family: "Oswald";
    font-style: normal;
    font-weight: 700;
    font-size: 40px;
    line-height: 48px;
    letter-spacing: -0.02em;
    text-transform: uppercase;
    color: #fcfcfd;
    margin: 0 0 12px;
    @media screen and (max-width: 768px) {
      font-family: "Oswald";
      font-style: normal;
      font-weight: 700;
      font-size: 32px;
      line-height: 40px;
    }
  }
  @media screen and (max-width: ${RESPONSIVE.small}) {
    background: none;
    box-shadow: none;
    padding: 0;
  }
`;

const slideKeyframe = keyframes`
from {
    left: 50%;
    opacity: 0;
} to {
    opacity: 1;
    left: 0;
}
`;

const SlideIn = styled.div`
  background: #242731;
  border-radius: 12px 0px 0px 12px;
  /* height: 150px; */
  flex: 1;
  padding: 48px 60px;
  @media screen and (max-width: 768px) {
    padding: 80px 46px;
  }
  @media screen and (max-width: 576px) {
    padding: 80px 32px;
  }
  position: relative;
  left: 50%;
  visibility: hidden;
  display: none;
  /* min-height: 478px; */
  opacity: 0;
  &.visible {
    display: block;
    visibility: visible;
    animation: 0.5s ${slideKeyframe} forwards;
  }
`;

/* const SocialIcon = styled.img`
`; */

const StyledExploreTop = styled.div`
  width: 100%;
  height: 1px;
  margin-top: 48px;
  margin-bottom: 80px;

  @media screen and (max-width: 375px) {
    margin-top: 16px;
    margin-bottom: 80px;
  }
`;

export default LeaderBoardComponent;
