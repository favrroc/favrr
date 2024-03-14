import React from "react";

import dayjs from "dayjs";
import { FavEntity } from "../../../../generated-graphql/graphql";
import { useAppSelector } from "../../../core/hooks/rtkHooks";
import { useWatchResize } from "../../../core/hooks/useWatchResize";
import FanMatchTile from "../../fav/fan-match-carousel/fan-match-tile/FanMatchTile";
import CarouselTemplate from "../CarouselTemplate";

const FanMatchCarousel = () => {
  const { smallerThanTablet, smallerThanXLarge } = useWatchResize();

  const { favsById } = useAppSelector(
    (state) => state.favs
  );
  const { loadingFanMatchesList, fanMatchesList, liveMatchResults } =
    useAppSelector((state) => state.fanMatch);

  const tilesPerPage = smallerThanTablet ? 1 : smallerThanXLarge ? 2 : 3;
  const isInfinitiveScroll = fanMatchesList.length > tilesPerPage;

  return (
    <CarouselTemplate
      carouselTitle={`FAN MATCHES`}
      carouselDescription={`Huge celebrity face-offs: score big prizes by helping your faves win!`}
      mainParameter={fanMatchesList?.map((fanMatch, i) => {
        return (
          <FanMatchTile
            key={i}
            isLoading={loadingFanMatchesList}
            title={fanMatch.title || ""}
            firstFav={favsById[fanMatch?.leftFav.id] as FavEntity}
            secondFav={favsById[fanMatch?.rightFav.id] as FavEntity}
            endDate={dayjs(fanMatch?.expiredAt).toDate() as Date}
            isLiveMatch={i === 0}
            isOnFanMatchesPage={false}
            liveFanMatchResults={i === 0 ? liveMatchResults : undefined}
            fanMatchId={fanMatch?.id as string}
            isLike={fanMatch?.isLike || false}
            isSharing={false}
          />
        );
      })}
      numberOfTiles={fanMatchesList?.length}
      settings={{
        rows:1,
        dots: true,
        arrows: false,
        infinite: isInfinitiveScroll,
        speed: 300,
        slidesToShow: tilesPerPage,
        slidesToScroll: tilesPerPage,
      }}
    />
  );
};

export default FanMatchCarousel;
