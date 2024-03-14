import React from "react";
import { CSSTransition } from "react-transition-group";
import styled from "styled-components";

import { ReactComponent as OutterStarIcon } from "../../../assets/images/outter-star.svg";
import { ReactComponent as StarIcon } from "../../../assets/images/star.svg";
import { colors } from "../../../core/constants/styleguide.const";

interface Props {
  isActive?: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  fromRight: number;
  fromTop: number;
  isOnLandingPage: boolean;
  isLiveMatch: boolean;
}

const LikeButton2 = (props: Props) => {
  const {
    isActive,
    onClick,
    fromTop,
    fromRight,
    isOnLandingPage,
    isLiveMatch
  } = props;

  return (
    <StyledLikeButton
      className={isActive ? "highlighted" : ""}
      onClick={onClick}
      fromTop={fromTop}
      fromRight={fromRight}
      isOnLandingPage={isOnLandingPage}
      isLiveMatch={isLiveMatch}
    >
      <StarIcon />
      <CSSTransition in={isActive} timeout={600} classNames="like-transition">
        <OutterStarIcon className="colorfull-icon" />
      </CSSTransition>
    </StyledLikeButton>
  );
};

const StyledLikeButton = styled.button`
  position: absolute;
  top: ${(props: Props) => {
    return props.fromTop;
  }}px;
  right: ${(props: Props) => {
    return props.fromRight;
  }}px;
  background-color: rgba(60, 144, 255, 0.08);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  padding: 0px;
  z-index: 1;

  svg {
    margin: auto;
    transform: translateY(-1px);
    width: 16px;
    height: 16px;
  }

  path {
    fill: ${(props: Props) => {
    return props.isOnLandingPage
      ? props.isLiveMatch
        ? `${colors.neutrals2}`
        : `${colors.neutrals4}`
      : `${colors.neutrals2}`;
  }};
  }

  &:hover {
    path {
      fill: ${colors.primaryPink};
    }
  }

  &.highlighted {
    path {
      fill: ${colors.primaryPink};
    }

    & .colorfull-icon {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
  }

  & .colorfull-icon {
    position: absolute;
    left: 50%;
    top: calc(50% - 1px);
    transition: all 0.5s linear;
    transform: translate(-50%, -50%) scale(1);
    opacity: 0;

    path {
      fill: ${colors.primaryPink};
      fill-rule: unset;
    }
  }

  & .like-transition-enter-active {
    transform: translate(-50%, -50%) scale(1.2) !important;
    opacity: 1;
  }

  & .like-transition-enter-done {
    transform: translate(-50%, -50%) scale(1);
    transition: all 0.1s linear;
    opacity: 1;
  }

  & .like-transition-exit {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
  }

  & .like-transition {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
  }
`;

export default LikeButton2;
