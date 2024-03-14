import React from "react";
import { FormattedMessage } from "react-intl";

import FavsCarousel from "../favs-carousel/FavsCarousel";
import { useAppSelector } from "../../../core/hooks/rtkHooks";

const SimilarFavsCarousel = (props: {
  selfFavId: number;
  category: string | undefined | null;
}) => {
  const { selfFavId, category } = props;

  const { favs } = useAppSelector(state => state.favs);
  const similarFavs = favs.filter(
    (o) => o.category === category && o.id !== selfFavId
  );

  return (
    <FavsCarousel
      favs={similarFavs}
      titleElement={
        <FormattedMessage
          defaultMessage="Similar {assetName}"
          values={{
            assetName: "Stocks",
          }}
        />
      }
    />
  );
};

export default SimilarFavsCarousel;
