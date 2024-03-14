import React from "react";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";

import { fansPath, homePath } from "../../../core/util/pathBuilder.util";
import { EmptyStateTypes } from "../../../core/interfaces/emptystate.type";
import { ButtonPrimary, ButtonSecondary, Flex } from "../../styleguide/styleguide";
import { colors, sizes } from "../../../core/constants/styleguide.const";
import accountDarkSrc from "../../../assets/images/account-dark.svg";
import emptySrc from "./../../../assets/images/empty.svg";
import { RESPONSIVE } from "../../../core/constants/responsive.const";

interface Props {
  variant: EmptyStateTypes;
  public: boolean;
}
const EmptyState = (props: Props) => {
  const variant = props.variant;

  let src: any;
  let title = "";
  let description = "";
  let actionButton = <></>;

  switch (variant) {
  case EmptyStateTypes.TrendData:
    src = props.public ? accountDarkSrc : emptySrc;
    title = "Nothing Yet";
    description = props.public ? "This fan doesn't own any stocks." : "Trend data about the tems you buy will show up here.";
    actionButton = props.public ? <></> : (
      <Link to={homePath()}>
        <ButtonSecondary>
            Explore Now
        </ButtonSecondary>
      </Link>
    );
    break;

  case EmptyStateTypes.Followers:
    src = accountDarkSrc;
    title = props.public ? "Nobody Yet" : "No Followers Yet";
    description = props.public ? "Fans who follow this user show up here." : "Fans who follow you will show up here.";
    break;

  case EmptyStateTypes.IPO:
    src = accountDarkSrc;
    title = "Nothing Yet";
    description = "The hottest stock IPOs show up here.";
    break;

  case EmptyStateTypes.Followings:
    src = accountDarkSrc;
    title = props.public ? "Nobody Yet" : "Follow Fans";
    description = props.public ? "Fans this user follows show up here." : "Follow other like-minded fans to grow your community.";
    actionButton = props.public ? <></> : (
      <Link to={fansPath()}>
        <ButtonPrimary>
            Explore Fans
        </ButtonPrimary>
      </Link>
    );
  }

  return (
    <StyledFlex>
      <Image src={src} alt="Empty" />
      <StyledH2>{title}</StyledH2>
      <P>{description}</P>
      {actionButton}
    </StyledFlex>
  );
};

const opacityKeyframe = keyframes`
  from {
      opacity: 0;
  } to {
      opacity: 1;
  }
`;
const StyledFlex = styled(Flex)`
  animation: 0.5s ${opacityKeyframe} forwards;
  flex-direction: column;
  align-items: center;
  max-width: 311px;
  margin: 29px auto;
`;
const Image = styled.img`
  margin-bottom: 24px;
  width: 160px;

  @media screen and (max-width: ${RESPONSIVE.small}){
    width: 97px;
  }
`;
const P = styled.p`
    font-family: 'Poppins';
    font-weight: 400;
    font-size: ${sizes.sm};
    line-height: ${sizes.lg};
    text-align: center;
    color: ${colors.grey};
    margin-bottom: 40px;
    margin-top: 8px;
`;
const StyledH2 = styled.h2`
  font-family: 'Poppins';
  font-weight: 600;
  font-size: ${sizes.bg};
  line-height: ${sizes.xxl};
  text-align: center;
  letter-spacing: -0.02em;
  color: ${colors.neutrals8};
  margin: 0;

  @media screen and (max-width: ${RESPONSIVE.small}){
    font-size: ${sizes.lg};
    line-height: 32px;
  }
`;

export default EmptyState;