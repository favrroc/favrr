import dayjs from "dayjs";
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { FavEntity } from "../../../../../../generated-graphql/graphql";
import { colors } from "../../../../../core/constants/styleguide.const";
import { useWatchResize } from "../../../../../core/hooks/useWatchResize";
import {
  getCSSOfStyledComponent,
  stopAnchorMouseEventPropagination
} from "../../../../../core/util/base.util";
import { favPath } from "../../../../../core/util/pathBuilder.util";
import { Body1Bold, Caption1 } from "../../../../styleguide/styleguide";

interface IFavTitleProps {
  endDate: Date;
  fav: FavEntity;
  isLiveMatch: boolean;
  isOnFanMatchesPage: boolean;
}

const FavTitle = ({
  endDate,
  fav,
  isLiveMatch,
  isOnFanMatchesPage,
}: IFavTitleProps) => {
  const { smallerThanTablet } = useWatchResize();

  const diffOfWeek = dayjs(endDate).diff(dayjs(), "week");

  if (isLiveMatch && isOnFanMatchesPage && !smallerThanTablet) {
    return (
      <StyledBody1Bold
        to={favPath(fav?.title as string)}
        onClick={stopAnchorMouseEventPropagination}
      >
        {fav?.displayName}
      </StyledBody1Bold>
    );
  }

  return (
    <StyledCaption1
      to={favPath(fav?.title as string)}
      onClick={stopAnchorMouseEventPropagination}
      style={{
        color: (diffOfWeek > 2 && !isOnFanMatchesPage) ? colors.neutrals3 : colors.neutrals8
      }}
    >
      {fav?.displayName}
    </StyledCaption1>
  );
};

const StyledBaseFavTitle = styled(Link)`
  text-align: center;
  white-space: nowrap;
  color: ${colors.neutrals8};
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
  z-index: 1;
  &:hover {
    color: ${colors.primaryBlue};
  }
`;

const StyledCaption1 = styled(StyledBaseFavTitle)`
  ${getCSSOfStyledComponent(Caption1)}
`;

const StyledBody1Bold = styled(StyledBaseFavTitle)`
  ${getCSSOfStyledComponent(Body1Bold)}
`;

export default FavTitle;
