import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import badge1Src from "../../../../assets/images/badge1.svg";
import badge2Src from "../../../../assets/images/badge2.svg";
import badge3Src from "../../../../assets/images/badge3.svg";
import { RESPONSIVE } from "../../../../core/constants/responsive.const";
import { colors, sizes } from "../../../../core/constants/styleguide.const";
import { useWatchResize } from "../../../../core/hooks/useWatchResize";
import { FollowButtonTypes } from "../../../../core/interfaces/follow.type";
import { ParticipantInfo } from "../../../../core/store/slices/participantsSlice";
import { getColorOfValue, getCSSOfStyledComponent } from "../../../../core/util/base.util";
import { formatNumber, pixelToNumber, Unit } from "../../../../core/util/string.util";
import FollowButton from "../../../button/follow-button/FollowButton";
import { Body2Bold, Caption1, Caption1Bold, Caption2Bold, HairlineSmall } from "../../../styleguide/styleguide";
import { OceanaCoinImage } from "../../../assets/app-images/AppImages";

interface Props {
  data: ParticipantInfo;
  badge: number;
  classStyle: string;
  setIndex: () => void;
  address: string;
}
const ListButton = (props: Props) => {
  const { windowWidth } = useWatchResize();

  return (
    <ListItem
      className={`${props.classStyle}`}
      onClick={props.setIndex}
    >
      <Badge className="badge">
        <div className={`inner badge-${props.badge}`}>{props.badge}</div>
      </Badge>
      <div className="flex-basis-56">
        <Link to={`${props.data.profile.address === props.address ? "/portfolio" : `/fan/${props.data.profile?.fullName || props.data.profile?.address}`}`}>
          <Thumbnail img={props.data.profile.profileImageUrl || OceanaCoinImage().props.src} />
        </Link>
      </div>
      <Flex>
        <Title className="ellipsis">
          <Link to={`${props.data.profile.address === props.address ? "/portfolio" : `/fan/${props.data.profile?.fullName || props.data.profile?.address}`}`}>
            {props.data.displayName}
          </Link>
        </Title>
        <Equity>
          {formatNumber({
            value: props.data.equity,
            unit: Unit.USDC,
            summarize: true,
            withUnit: true,
            decimalToFixed: 1,
          })}
        </Equity>
        <EquityDeltaPercent
          className={`${getColorOfValue(
            props.data.equityDeltaPercent
          )} show-md`}
        >
          {formatNumber({
            value: props.data.equityDeltaPercent,
            unit: Unit.PERCENT,
            summarize: true,
            withUnit: true,
            withSign: true,
          })}
        </EquityDeltaPercent>
      </Flex>
      <EquityDeltaPercent
        className={`${getColorOfValue(
          props.data.equityDeltaPercent
        )} hide-md`}
      >
        {formatNumber({
          value: props.data.equityDeltaPercent,
          unit: Unit.PERCENT,
          summarize: true,
          withUnit: true,
          withSign: true,
        })}
      </EquityDeltaPercent>
      <FollowButton 
        type={windowWidth > pixelToNumber(RESPONSIVE.large) ? FollowButtonTypes.Button : FollowButtonTypes.Icon}
        following={props.data.isFollowing}
        followAddress={props.data.profile.address}
      />
    </ListItem>
  );
};

const ListItem = styled.div`
  width: 100%;
  align-items: center;
  height: 88px;
  display: flex;
  position: relative;
  gap: 20px;
  cursor: pointer;
  @media screen and (max-width: 375px) {
    gap: 16px;
  }
  padding: 0 32px;
  font-family: "Poppins";
  font-weight: 500;
  font-size: ${sizes.base};
  line-height: ${sizes.lg};
  color: ${colors.neutrals8};
  position: relative;
  box-sizing: border-box;
  &.disable-event {
    pointer-events: none;
  }
  &:hover {
    background: #1f2128;
    border-radius: 20px;
  }
  &.active {
    background: none;
    border-radius: 0;
    cursor: default;
    @media screen and (max-width: ${RESPONSIVE.small}) {
      background: linear-gradient(
        179.82deg,
        #242731 0.15%,
        rgba(31, 33, 40, 0) 99.85%
      );
      border-radius: 12px;
    }
  }

  @media screen and (max-width: ${RESPONSIVE.medium}) {
    padding: 0 16px;
  }
  
  &.hidden-list {
    display: none;
  }
  .flex-basis-56 {
    flex-basis: 56px !important;
    flex: 0;
  }
  @media screen and (max-width: ${RESPONSIVE.small}) {
    flex-direction: column;
    padding: 16px 8px;
    height: auto;
    margin-top: 32px;
    &:nth-child(4),
    &:nth-child(5) {
      margin-top: 0;
      * {
        text-align: left !important;
      }
      flex-direction: row;
      .badge {
        position: relative;
        top: initial;
        right: initial;
      }
    }
  }
`;
const Badge = styled.div`
  font-family: "Poppins";
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 20px;
  text-align: center;
  flex-basis: 24px !important;
  flex: 0 !important;
  .inner {
    width: 24px;
    height: 24px;
    box-shadow: inset 0 0 0 2px #353945;
    border-radius: 64px;
    justify-content: center;
    align-items: center;
    display: flex;
    color: #fcfcfd;
    &.badge-1 {
      box-shadow: inset 0 0 0 2px #ffd166;
      color: #ffd166;
      &:after {
        content: "";
        height: 10px;
        width: 10px;
        background: url(${badge1Src}) no-repeat center;
        background-size: contain;
        position: absolute;
        top: 50%;
        transform: translateY(9px);
      }
    }
    &.badge-2 {
      box-shadow: inset 0 0 0 2px #e6e8ec;
      color: #e6e8ec;
      &:after {
        content: "";
        height: 10px;
        width: 10px;
        background: url(${badge2Src}) no-repeat center;
        background-size: contain;
        position: absolute;
        top: 50%;
        transform: translateY(9px);
      }
    }
    &.badge-3 {
      box-shadow: inset 0 0 0 2px #e4d7cf;
      color: #e4d7cf;
      &:after {
        content: "";
        height: 10px;
        width: 10px;
        background: url(${badge3Src}) no-repeat center;
        background-size: contain;
        position: absolute;
        top: 50%;
        transform: translateY(9px);
      }
    }
  }
  @media screen and (max-width: ${RESPONSIVE.small}) {
    position: absolute;
    top: 68px;
    right: calc(50% - 36px);
    .inner {
      background: #1f2128;
    }
  }
`;
const Flex = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 188px;

  @media screen and (max-width: 1200px) {
    width: 144px;
  }
  @media screen and (max-width: 375px) {
    width: 116px;
  }

  @media screen and (max-width: ${RESPONSIVE.large}) {
    flex: 1;
  }
  
  ${ListItem}:nth-child(-n+3) & {
    @media screen and (max-width: ${RESPONSIVE.small}) {
      align-items: center;
    }
  }
`;
const Thumbnail = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 100%;
  background: url("${(props: { img: string; }) => props.img}") no-repeat
    center;
  background-size: cover;
  ${ListItem}:nth-child(-n+3) & {
    @media screen and (max-width: ${RESPONSIVE.small}) {
      width: 72px;
      height: 72px;
    }
  }
`;
const Title = styled(Body2Bold)`
  color: ${colors.neutrals8};
  a:hover {
    color: #3f8cff !important;
  }
`;
const Equity = styled.span`
  ${getCSSOfStyledComponent(Caption1)}
  color: ${colors.neutrals6};
  padding: 0px;
  
  @media screen and (max-width: ${RESPONSIVE.medium}) {
    ${getCSSOfStyledComponent(HairlineSmall)}
    padding-bottom: 6px;
    padding-top: 2px;
    
    ${ListItem}:nth-child(-n+3) & {
      ${getCSSOfStyledComponent(Caption2Bold)}
    }
  }
`;
const EquityDeltaPercent = styled.span`
  ${getCSSOfStyledComponent(Caption1Bold)}
  flex: 1;

  @media screen and (max-width: ${RESPONSIVE.large}) {
    ${getCSSOfStyledComponent(HairlineSmall)}
  }
`;

export default ListButton;
