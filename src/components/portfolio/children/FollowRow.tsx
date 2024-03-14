import React, { useRef, useState } from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { RESPONSIVE } from "../../../core/constants/responsive.const";
import { colors, sizes } from "../../../core/constants/styleguide.const";
import { useAppSelector } from "../../../core/hooks/rtkHooks";

import { FollowButtonTypes } from "../../../core/interfaces/follow.type";
import { ParticipantInfo } from "../../../core/store/slices/participantsSlice";
import { getColorOfValue } from "../../../core/util/base.util";
import { favPath } from "../../../core/util/pathBuilder.util";
import { formatNumber, formatUserDisplay, Unit } from "../../../core/util/string.util";
import FollowButton from "../../button/follow-button/FollowButton";
import LikeButton from "../../button/like-button/LikeButton";

import badge1Src from "../../../assets/images/badge1.svg";
import badge2Src from "../../../assets/images/badge2.svg";
import badge3Src from "../../../assets/images/badge3.svg";
import usernoneSrc from "../../../assets/images/user_none.svg";
import { OceanaCoinImage } from "../../assets/app-images/AppImages";
import { Flex } from "../../styleguide/styleguide";

interface Props {
  follow: ParticipantInfo;
  hasMore: boolean;
  numOfLoadedRows: number;
  className?: string;
}

const FollowRow = (props: Props) => {
  const { follow, hasMore, numOfLoadedRows, className } = props;
  const { favsById } = useAppSelector(state => state.favs);
  const [scrolling, setScrolling] = useState(false);
  const { profile } = useAppSelector(state => state.user);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  if (!!!follow) {
    return <></>;
  }
  const displayName = formatUserDisplay(follow.profile.address as string, follow.profile?.fullName as string);

  return (
    <StyledFlex className={className} hasMore={hasMore} numOfLoadedRows={numOfLoadedRows}>
      <LeftFlex>
        <div style={{ position: "relative" }}>
          <Link to={`${profile.address === follow.profile.address ? "/portfolio" : `/fan/${follow.profile?.fullName || follow.profile?.address}`}`}>
            <StyledImg src={follow.profile.profileImageUrl || OceanaCoinImage().props.src} />
          </Link>
          <Badge className={`pos-${follow.rank}`}>
            {formatNumber({
              value: follow.rank,
              unit: Unit.EMPTY,
              summarize: true
            })}
          </Badge>
        </div>
        <NameGrowthFollowContainer>
          <NameGrowthContainer>
            <Name>
              <Link to={`${profile.address === follow.profile.address ? "/portfolio" : `/fan/${follow.profile?.fullName || follow.profile?.address}`}`}>{displayName}</Link>
            </Name>
            <Growth>
              {formatNumber({
                value: follow.equity,
                unit: Unit.USDC,
                summarize: true,
                withUnit: false,
                decimalToFixed: 1,
              })}
              <span style={{ marginRight: "6px" }}>{` USDC`}</span>
              <span className={`${getColorOfValue(follow.equityDeltaPercent)}`}>
                {formatNumber({
                  value: follow.equityDeltaPercent,
                  unit: Unit.PERCENT,
                  summarize: true,
                  withUnit: true,
                  withSign: true,
                })}
              </span>
            </Growth>
          </NameGrowthContainer>
          <FollowButton
            type={FollowButtonTypes.Icon}
            following={follow.isFollowing}
            followAddress={follow.profile.address}
          />
        </NameGrowthFollowContainer>
      </LeftFlex>
      <StyledScrollContainer
        className={`scroll-container ${scrolling ? `scrolling` : ""}`}
        vertical={true}
        hideScrollbars={false}
        onStartScroll={() => setScrolling(true)}
        onEndScroll={() => setScrolling(false)}
        items={follow.stocksIdList.length}
        ref={(scroll: any) => {
          scrollRef.current = (scroll as any)?.container?.current || null;
        }}
      >
        <FavParent>
          {follow.stocksIdList.length > 0 ? <>
            {follow.stocksIdList.map((favId, index) => (
              <FavTile key={index}>
                <Link to={favPath(favsById[favId]?.title as string)}>
                  <img src={favsById[favId].mobileSizeImage || usernoneSrc} alt="Tile" />
                </Link>
                <StyledLikeButton>
                  <LikeButton
                    isFavorite={favsById[favId]?.isLike || false}
                    favId={favId}
                  />
                </StyledLikeButton>
              </FavTile>
            ))}
          </> : <>
            {[1, 2, 3, 4, 5].map((_fav, index) => (
              <FavTileEmpty key={index}>
                <img src={usernoneSrc} alt="Tile" />
              </FavTileEmpty>
            ))}
          </>}
        </FavParent>
      </StyledScrollContainer>
    </StyledFlex>
  );
};

const StyledScrollContainer = styled(ScrollContainer)`
  width: 100%;
  cursor: ${(props: { items: number; }) => props.items > 5 ? "grabbing" : "default"};
  @media screen and (max-width: ${RESPONSIVE.large}) {
    cursor: ${(props: { items: number; }) => props.items > 3 ? "grabbing" : "default"};
  }
  @media screen and (max-width: ${RESPONSIVE.small}) {
    cursor: ${(props: { items: number; }) => props.items > 4 ? "grabbing" : "default"};
  }
  @media screen and (max-width: 376px) {
    cursor: ${(props: { items: number; }) => props.items > 3 ? "grabbing" : "default"};
  }
  @media screen and (max-width: ${RESPONSIVE.xSmall}) {
    cursor: ${(props: { items: number; }) => props.items > 3 ? "grabbing" : "default"};
  }
  flex: "1";
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
`;

const LeftFlex = styled(Flex)`
  gap: 24px;
  width: 280px;
  @media screen and (max-width: ${RESPONSIVE.medium}) {
    position: relative;
    flex: 1;
    width: 100%;
    align-items: center;
  }
`;
const StyledLikeButton = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  button {
      background: none;
  }
`;
const FavParent = styled.div`
  display: flex;
  gap: 16px;
  box-sizing: border-box;
  width: min-content;
  @media screen and (min-width: 820px) {
    padding-top: 10px;
  }
  &::-webkit-scrollbar {
    display: none;
  }
`;
const StyledFlex = styled.div`
  padding-bottom: 24px;
  margin-bottom: 32px;
  @media screen and (min-width: 820px) {
    margin-bottom: 22px;
  }
  border-bottom: solid 1px #353945;
  &:nth-child(${(props: any) => props.numOfLoadedRows}) {
    border-bottom: ${(props: any) => props.hasMore ? "0px" : "solid 1px #353945"}
  }
  align-items: center;

  display: grid;
  grid-template-columns: 256px 1fr;
  grid-template-rows: auto 1fr;
  column-gap: 32px;

  @media screen and (max-width: ${RESPONSIVE.medium}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 32px;
    grid-template-columns: 1fr;
  }
  &:last-child {
    border-bottom: none;
  }
  &.last-button {
    border: none;
    background: none;
    display: ${(props: any) => (props.hasMore ? "grid" : "none")};
  }
`;
const FavTileEmpty = styled.div`
    width: 89px;
    height: 118px;
    background: #242731;
    border-radius: 12px;
    position: relative;
    overflow: hidden;
    img {
      object-fit: cover;
      width: 58px;
      height: 58px;
      position: absolute;
      top: 50%;
      transform: translateY(-50%) translateX(-50%);
      left: 50%;
    }
`;
const FavTile = styled.div`
    width: 89px;
    height: 118px;
    background: #242731;
    border-radius: 12px;
    position: relative;
    overflow: hidden;
    img {
        object-fit: cover;
        width: 100%;
        height: 100%;
    }
    @media screen and (min-width: 820px) {
      transition: transform ease-out 0.2s;
      &:hover {
        transform: translateY(-10px);
      }
    }
`;
const Badge = styled.div`
    /* width: 24px; */
    height: 24px;
    background: #1F2128;
    border: 2px solid #353945;
    border-radius: 64px;
    position: absolute;
    text-align: center;
    padding: 0 1px;
    bottom: 5px;
    left: 46px;
    min-width: 8px;
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 600;
    font-size: 12px;
    line-height: 24px;
    box-sizing: border-box;
    min-width: 24px;
    align-items: center;
    display: flex;
    justify-content: center;
    &.pos-1 {
      border-color: #FFD166;
      color: #FFD166;
      &:after {
        content: "";
        width: 11px;
        height: 11px;
        background: url(${badge1Src}) no-repeat center;
        display: block;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: -11px;
      }
    }
    &.pos-2 {
      border-color: #E6E8EC;
      color: #E6E8EC;
      &:after {
        content: "";
        width: 11px;
        height: 11px;
        background: url(${badge2Src}) no-repeat center;
        display: block;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: -11px;
      }
    }
    &.pos-3 {
      border-color: #E4D7CF;
      color: #E4D7CF;
      &:after {
        content: "";
        width: 11px;
        height: 11px;
        background: url(${badge3Src}) no-repeat center;
        display: block;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: -11px;
      }
    }
    @media screen and (max-width: 850px) {
      left: 46px;
      bottom: 5px;
    }
`;
const NameGrowthFollowContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 10px;

  @media screen and (max-width: ${RESPONSIVE.medium}) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;
const NameGrowthContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
const Growth = styled.div`
    font-family: 'Poppins';
    font-weight: 600;
    font-size: ${sizes.xs};
    line-height: ${sizes.xs};
    text-transform: uppercase;
    color: ${colors.neutrals4};
`;
const Name = styled.div`
    font-family: 'Poppins';
    font-weight: 500;
    font-size: ${sizes.base};
    line-height: ${sizes.lg};
    color: ${colors.neutrals8};
`;
const StyledImg = styled.img`
    width: 72px;
    height: 72px;
    background: ${colors.neutrals4};
    border-radius: 48px;
    object-fit: cover;
    margin: auto;
`;

export default FollowRow;