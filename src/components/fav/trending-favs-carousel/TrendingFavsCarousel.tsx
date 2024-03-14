import React from "react";
import { FormattedMessage } from "react-intl";

import FavsCarousel from "../favs-carousel/FavsCarousel";
import { useAppSelector } from "../../../core/hooks/rtkHooks";

const TrendingFavsCarousel = () => {
  const { favsById, multiFavsInfo } = useAppSelector(state => state.favs);

  const trendingFavs = multiFavsInfo
    ? Object.values(multiFavsInfo)
      .sort((a, b) => +b.data.updatedAt - +a.data.updatedAt)
      .map((o) => o.data.id)
      .map((o) => favsById[o])
    : [];

  return (
    <FavsCarousel
      favs={trendingFavs}
      titleElement={
        <FormattedMessage
          defaultMessage="Trending {assetName}"
          values={{
            assetName: "Stocks",
          }}
        />
      }
    />
  );
};

export default TrendingFavsCarousel;
