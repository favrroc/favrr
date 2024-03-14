import React from "react";
import styled from "styled-components";

import { RESPONSIVE } from "../../../../../core/constants/responsive.const";
import { colors } from "../../../../../core/constants/styleguide.const";
import { getCSSOfStyledComponent } from "../../../../../core/util/base.util";
import { Body2, Caption2 } from "../../../../styleguide/styleguide";

interface IMatchWeekProps {
  week: string;
  isLiveMatch: boolean;
  isOnFanMatchesPage: boolean;
}

const MatchWeek = ({ week, isLiveMatch, isOnFanMatchesPage }: IMatchWeekProps) =>
  isOnFanMatchesPage ? (
    isLiveMatch ? (
      <StyledLiveMatchWeek>{week}</StyledLiveMatchWeek>
    ) : (
      <Caption2 style={{ color: colors.neutrals4 }}>{week}</Caption2>
    )
  ) : (
    <Caption2 style={{ color: colors.neutrals2 }}>{week}</Caption2>
  );

const StyledLiveMatchWeek = styled.div`
  ${getCSSOfStyledComponent(Caption2)}
  color: ${colors.neutrals3};
  @media screen and (min-width: ${RESPONSIVE.tablet}) {
    ${getCSSOfStyledComponent(Body2)}
    color: ${colors.neutrals2};
  }
`;

export default MatchWeek;