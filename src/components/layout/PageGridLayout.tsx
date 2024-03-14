import React from "react";
import styled from "styled-components";

import { RESPONSIVE } from "../../core/constants/responsive.const";
import { colors } from "../../core/constants/styleguide.const";
import { pixelToNumber } from "../../core/util/string.util";

interface Props {
  leftSide: JSX.Element,
  rightSide: JSX.Element
}

const PageGridLayout = ( props: Props ) => {
  return (
    <StyledMainSection>
      <StyledLeftSide>
        {props.leftSide}
      </StyledLeftSide>
      <StyledRightSide>
        {props.rightSide}
      </StyledRightSide>
    </StyledMainSection>
  );
};

const StyledMainSection = styled.div`
  max-width: 1120px;
  margin: auto;
  display: flex;
  flex-direction: column;
  background-color: ${colors.neutrals1};
  gap:72px;

  @media screen and (min-width: ${RESPONSIVE.xSmall}) {
    gap: 72px;
    padding: 64px 4.5px;
  }
  @media screen and (min-width: ${RESPONSIVE.mobile}) {
    padding: 64px 24px
  }
  @media screen and (min-width: ${RESPONSIVE.small}) {
    padding: 80px 56px;
    gap: 68px;
  }
  @media screen and (min-width: ${RESPONSIVE.tablet}) {
    padding: 80px 56px;
  }
  @media screen and (min-width: ${pixelToNumber(RESPONSIVE.large) + 1}px) {
    flex-direction: row;
    padding: 80px 76px;
    gap: 40px;
  }
  @media screen and (min-width: ${RESPONSIVE.xLarge}) {
    padding: 96px 160px;
    gap: 96px;
  }
`;

const StyledLeftSide = styled.div`
  flex: 1;
`;

const StyledRightSide = styled.div`
  width: 100%;
  @media screen and (min-width: ${pixelToNumber(RESPONSIVE.large) + 1}px) {
    width: 384px;
  }
`;

export default PageGridLayout;