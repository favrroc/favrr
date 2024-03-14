import React from "react";
import styled from "styled-components";

import { Link } from "react-router-dom";
import badge1Src from "../../../../assets/images/badge1.svg";
import badge2Src from "../../../../assets/images/badge2.svg";
import badge3Src from "../../../../assets/images/badge3.svg";
import { RESPONSIVE } from "../../../../core/constants/responsive.const";
import { colors, sizes } from "../../../../core/constants/styleguide.const";
import { useAppSelector } from "../../../../core/hooks/rtkHooks";
import { useWatchResize } from "../../../../core/hooks/useWatchResize";
import { FollowButtonTypes } from "../../../../core/interfaces/follow.type";
import { ParticipantInfo } from "../../../../core/store/slices/participantsSlice";
import { getColorOfValue } from "../../../../core/util/base.util";
import { formatNumber, pixelToNumber, Unit } from "../../../../core/util/string.util";
import { OceanaCoinImage } from "../../../assets/app-images/AppImages";
import FollowButton from "../../../button/follow-button/FollowButton";

interface Props {
  data: ParticipantInfo;
  badge: number;
  classStyle: string;
  hasMore: boolean;
  setIndex: () => void;
}

const LeaderButton = (props: Props) => {
  const { data, badge, classStyle, hasMore } = props;
  const { windowWidth } = useWatchResize();
  const { profile } = useAppSelector(state => state.user);

  return (
    <LeaderItem
      className={`${classStyle} ${badge <= 3 ? "" : "disable-event"}`}
      hasMore={hasMore}
    >
      <Badge className="badge">
        <div className={`inner badge-${badge}`}>{badge}</div>
      </Badge>
      <div className="flex-basis-56">
        <Link to={`${profile.address === data.profile.address ? "/portfolio" : `/fan/${data.profile?.fullName || data.profile?.address}`}`}><Thumbnail
          img={data?.profile?.profileImageUrl || OceanaCoinImage().props.src}
        /></Link>
      </div>
      <Flex className="button-flex">
        <FlexBasis className="list-info ellipsis">
          <Link to={`${profile.address === data.profile.address ? "/portfolio" : `/fan/${data.profile?.fullName || data.profile?.address}`}`}>{data?.displayName}</Link>
        </FlexBasis>
        {data.rank <= 3 && windowWidth > pixelToNumber(RESPONSIVE.small) ? (
          <>
            <div style={{ display: "flex", flexDirection: "row", gap: "8px" }}>
              <span className="list-info price">
                {formatNumber({
                  value: data?.equity,
                  unit: Unit.USDC,
                  summarize: true,
                  withUnit: true,
                  decimalToFixed: 1,
                })}
              </span>
              <span className={`perc ${getColorOfValue(data?.equityDeltaPercent)}`}>
                {formatNumber({
                  value: data?.equityDeltaPercent,
                  unit: Unit.PERCENT,
                  summarize: true,
                  withUnit: true,
                  withSign: true
                })}
              </span>
            </div>
          </>
        ) : (
          <>
            <FlexBasis className="list-info price">
              {formatNumber({
                value: data?.equity,
                unit: Unit.USDC,
                summarize: true,
                withUnit: true,
                decimalToFixed: 1,
              })}
            </FlexBasis>
            <FlexBasis
              className={`perc ${getColorOfValue(data?.equityDeltaPercent)} hide-md show-sm`}
            >
              {formatNumber({
                value: data?.equityDeltaPercent,
                unit: Unit.PERCENT,
                summarize: true,
                withUnit: true,
                withSign: true
              })}
            </FlexBasis>
          </>
        )}
      </Flex>
      {data.rank >= 4 && (
        <FlexBasis
          className={`perc ${getColorOfValue(data?.equityDeltaPercent)} show-md hide-sm`}
          style={{ flex: 0.5 }}
        >
          {formatNumber({
            value: data?.equityDeltaPercent,
            unit: Unit.PERCENT,
            summarize: true,
            withUnit: true,
            withSign: true
          })}
        </FlexBasis>
      )}
      <FollowButton
        type={windowWidth > pixelToNumber(RESPONSIVE.medium) ? FollowButtonTypes.Button : FollowButtonTypes.Icon}
        following={data.isFollowing}
        followAddress={data.profile?.address}
      />
    </LeaderItem>
  );
};
const LeaderItem = styled.div`
  width: 100%;
  box-sizing: border-box;
  align-items: center;
  display: flex;
  position: relative;
  gap: 30px;
  @media screen and (max-width: 375px) {
    gap: 16px;
  }
  font-family: "Poppins";
  font-style: normal;
  font-weight: 600;
  font-size: ${sizes.base};
  line-height: 32px;
  color: #fcfcfd;
  position: relative;
  &.disable-event {
    pointer-events: none;
  }
  > button {
    pointer-events: all;
  }
  > div {
    flex: 1;
  }
  &:hover {
    background: #1f2128;
    border-radius: 20px;
  }
  a:hover {
    color: #3f8cff !important;
  }
  &.active {
    border-radius: 0;
    cursor: default;
    background: linear-gradient(
      179.82deg,
      #242731 0.15%,
      rgba(31, 33, 40, 0) 99.85%
    );
    border-radius: 12px;
  }
  .price {
    font-family: "Poppins";
    font-weight: 500;
    font-size: ${sizes.base};
    line-height: ${sizes.lg};
    color: ${colors.neutrals5};
  }
  .perc {
    font-family: "Poppins";
    font-weight: 500;
    font-size: ${sizes.base};
    line-height: ${sizes.lg};
    color: ${colors.primaryGreen};
    &.red {
      color: ${colors.primaryPink};
    }
    &.green {
      color: ${colors.primaryGreen};
    }
  }
  &.hidden-list {
    display: none;
  }
  .flex-basis-56 {
    flex-basis: 56px !important;
    flex: 0;
  }
  flex-direction: column;
  padding: 16px 32px;
  height: auto;
  margin-top: 32px;
  @media screen and (max-width: ${RESPONSIVE.medium}) {
    padding: 16px;
  }
  &:nth-child(-n + 3):not(.limit-list) {
    .button-flex {
      .list-info {
        flex-basis: auto !important;
        max-width: 100%;
      }
    }
    padding: 40px 32px;
    @media screen and (max-width: ${RESPONSIVE.medium}) {
      font-size: ${sizes.base};
    }
    @media screen and (max-width: ${RESPONSIVE.small}) {
      padding: 16px 13px;
      gap: 16px;
    }
  }
  &:nth-child(odd) {
    background: #242731;
    border-radius: 20px;
  }
  &:first-child {
    border-radius: 12px;
  }
  &:nth-child(-n + 3):not(.limit-list) {
    background: none;
    max-width: 33.33333%;
    &.active {
      background: linear-gradient(
        179.82deg,
        #242731 0.15%,
        rgba(31, 33, 40, 0) 99.85%
      );
    }
    @media screen and (max-width: ${RESPONSIVE.medium}) {
      .price,
      .perc {
        font-size: 12px;
      }
    }
    @media screen and (max-width: ${RESPONSIVE.small}) {
      font-weight: 500;
      font-size: ${sizes.base};
      line-height: ${sizes.lg};
      .price,
      .perc {
        font-weight: 600;
        font-size: 12px;
        line-height: 20px;
      }
    }
  }
  &:nth-child(n + 4) {
    pointer-events: all;
  }
  &:nth-child(n + 4),
  &.limit-list {
    flex-direction: row;
    .button-flex {
      flex-direction: row;
      @media screen and (max-width: ${RESPONSIVE.medium}) {
        flex-direction: column;
        gap: 0;
        flex-basis: 0 !important;
        .list-info {
          flex-basis: 100% !important;
          font-family: "Poppins";
          font-style: normal;
          font-weight: 500;
          font-size: ${sizes.base};
          line-height: ${sizes.lg};
        }
      }
    }
    .perc {
      flex: 1;
      &.red {
        text-indent: -8px;
      }
    }
    .price,
    .perc {
      font-weight: 600;
      font-size: ${sizes.base};
      line-height: 32px;
      text-align: left;
      @media screen and (max-width: ${RESPONSIVE.small}) {
        font-family: "Poppins";
        font-style: normal;
        font-weight: 600 !important;
        font-size: 12px !important;
        line-height: 12px !important;
      }
    }
    .perc {
      @media screen and (max-width: ${RESPONSIVE.small}) {
        margin-top: 6px;
        flex-basis: 0 !important;
      }
    }
    @media screen and (max-width: ${RESPONSIVE.large}) {
      font-size: ${sizes.base};
      .price,
      .perc {
        font-weight: 500;
        font-size: ${sizes.base};
      }
    }
  }
  /* 
  &.last-button {
    background: none;
    display: ${(props: any) => (props.hasMore ? "inherit" : "none")};
  } */
`;
const Flex = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  ${LeaderItem}:nth-child(-n + 3) & {
    gap: 4px;
    width: 100%;
  }
  @media screen and (max-width: ${RESPONSIVE.medium}) {
    flex-direction: column;
    gap: 0;
    align-items: start;
    width: 100px;
    ${LeaderItem}:nth-child(-n + 3) & {
      align-items: center;
      gap: 4px;
    }
  }
  @media screen and (max-width: ${RESPONSIVE.small}) {
    gap: 0;
    ${LeaderItem}:nth-child(n+4) &,
    ${LeaderItem}.limit-list & {
      * {
        text-align: left !important;
      }
    }
  }
`;
const Thumbnail = styled.div`
  width: 160px;
  height: 160px;
  background: #fcfcfd url("${(props: { img: string; }) => props.img}") no-repeat
    center;
  background-size: cover;
  @media screen and (max-width: ${RESPONSIVE.medium}) {
    width: 72px;
    height: 72px;
  }
  ${LeaderItem}:nth-child(n+4) &,
  ${LeaderItem}.limit-list & {
    width: 88px;
    height: 88px;
    @media screen and (max-width: ${RESPONSIVE.medium}) {
      width: 56px;
      height: 56px;
    }
  }
  border-radius: 100%;
`;
const Badge = styled.div`
  font-family: "Poppins";
  font-style: normal;
  font-weight: 600;
  font-size: 21px;
  line-height: 35px;
  text-align: center;
  flex-basis: 24px !important;
  flex: 0 !important;
  width: 52px;
  ${LeaderItem}:nth-child(-n+3):not(.limit-list) & {
    width: auto;
  }
  .inner {
    min-width: 26px;
    height: 42px;
    padding: 0 8px;
    box-shadow: inset 0 0 0 2px #353945;
    border-radius: 64px;
    justify-content: center;
    align-items: center;
    display: flex;
    color: #fcfcfd;
    @media screen and (max-width: ${RESPONSIVE.medium}) {
      min-width: 12px;
      height: 24px;
      padding: 0 6px;
    }
    ${LeaderItem}:nth-child(-n+3):not(.limit-list) & {
      &.badge-1 {
        box-shadow: inset 0 0 0 3px #ffd166;
        color: #ffd166;
        @media screen and (max-width: ${RESPONSIVE.medium}) {
          box-shadow: inset 0 0 0 2px #ffd166;
        }
        &:after {
          content: "";
          height: 18px;
          width: 18px;
          transform: translateY(17px);
          @media screen and (max-width: ${RESPONSIVE.medium}) {
            height: 10px;
            width: 10px;
            transform: translateY(9px);
          }
          background: url(${badge1Src}) no-repeat center;
          background-size: contain;
          position: absolute;
          top: 50%;
        }
      }
      &.badge-2 {
        box-shadow: inset 0 0 0 3px #e6e8ec;
        color: #e6e8ec;
        @media screen and (max-width: ${RESPONSIVE.medium}) {
          box-shadow: inset 0 0 0 2px #e6e8ec;
        }
        &:after {
          content: "";
          height: 18px;
          width: 18px;
          transform: translateY(17px);
          @media screen and (max-width: ${RESPONSIVE.medium}) {
            height: 10px;
            width: 10px;
            transform: translateY(9px);
          }
          background: url(${badge2Src}) no-repeat center;
          background-size: contain;
          position: absolute;
          top: 50%;
        }
      }
      &.badge-3 {
        box-shadow: inset 0 0 0 3px #e4d7cf;
        color: #e4d7cf;
        @media screen and (max-width: ${RESPONSIVE.medium}) {
          box-shadow: inset 0 0 0 2px #e4d7cf;
        }
        &:after {
          content: "";
          height: 18px;
          width: 18px;
          transform: translateY(17px);
          @media screen and (max-width: ${RESPONSIVE.medium}) {
            height: 10px;
            width: 10px;
            transform: translateY(9px);
          }
          background: url(${badge3Src}) no-repeat center;
          background-size: contain;
          position: absolute;
          top: 50%;
        }
      }
    }
  }
  position: absolute;
  top: 158px;
  right: calc(50% - 74px);
  ${LeaderItem}:nth-child(n+4) &,
  ${LeaderItem}.limit-list & {
    position: relative;
    top: unset;
    right: unset;
  }
  @media screen and (max-width: ${RESPONSIVE.medium}) {
    top: 90px;
    right: calc(50% - 37px);
    font-family: "Poppins";
    font-style: normal;
    font-weight: 600;
    font-size: 12px;
    line-height: 20px;
  }
  @media screen and (max-width: ${RESPONSIVE.small}) {
    top: 68px;
    right: calc(50% - 36px);
  }
  .inner {
    background: #1f2128;
  }
`;
const FlexBasis = styled.div`
  flex: 1;
  text-align: left;
`;
export default LeaderButton;
