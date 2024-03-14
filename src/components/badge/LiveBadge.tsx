import React from "react";
import styled from "styled-components";

import { colors } from "../../core/constants/styleguide.const";
import { HairlineSmall } from "../styleguide/styleguide";
import { RESPONSIVE } from "../../core/constants/responsive.const";

const LiveBadge = (props: { isOnLandingPage: boolean }) => {
  const { isOnLandingPage } = props;
  return (
    <StyledLiveBadge isOnLandingPage={isOnLandingPage}>
      <StyledBadgeLabel>
        <HairlineSmall
          style={{ lineHeight: "initial" }}
        >{`LIVE`}</HairlineSmall>
      </StyledBadgeLabel>
    </StyledLiveBadge>
  );
};

const StyledLiveBadge = styled.div`
  position: relative;
  margin-top: ${(props: { isOnLandingPage: boolean }) => {
    return props.isOnLandingPage ? "16px" : "7px";
  }};
  background-color: ${colors.primaryGreen};
  border-radius: 10px;
  width: 44px;
  height: 20px;
  line-height: 18px;
  text-align: center;
  @media screen and (min-width: ${RESPONSIVE.large}) {
    margin-top: ${(props: { isOnLandingPage: boolean }) => {
    return props.isOnLandingPage ? "14px" : "10px";
  }};
  }
`;

const StyledBadgeLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
export default LiveBadge;
