import dayjs from "dayjs";
import React from "react";

import { colors } from "../../../../../core/constants/styleguide.const";
import { useWatchResize } from "../../../../../core/hooks/useWatchResize";
import {
  Body2,
  Headline4
} from "../../../../styleguide/styleguide";

interface IFavTitleProps {
  endDate: Date;
  title: string;
  isLiveMatch: boolean;
  isOnFanMatchPage: boolean;
}

const MatchTitle = ({
  endDate,
  title,
  isLiveMatch,
  isOnFanMatchPage,
}: IFavTitleProps) => {
  const { smallerThanTablet } = useWatchResize();

  const diffOfWeek = dayjs(endDate).diff(dayjs(), "week");

  if (isLiveMatch && !smallerThanTablet && isOnFanMatchPage) {
    return <Headline4 style={{ color: colors.neutrals8 }}>{title}</Headline4>;
  }

  return (
    <Body2
      style={{
        fontWeight: !(isLiveMatch && isOnFanMatchPage) ? 500 : 400,
        textTransform: "capitalize",
        color: (diffOfWeek > 2 && !isOnFanMatchPage) ? colors.neutrals3 : colors.neutrals8,
      }}
    >
      {title}
    </Body2>
  );
};

export default MatchTitle;