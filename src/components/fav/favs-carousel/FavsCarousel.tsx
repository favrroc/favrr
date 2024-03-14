import React, { useRef } from "react";
import Slider from "react-slick";

import FavTile from "../fav-tile/FavTile";
import { useAppSelector } from "../../../core/hooks/rtkHooks";
import { FavEntity } from "../../../../generated-graphql/graphql";
import { extractFavStatisticsInfo } from "../../../core/util/base.util";
import leftArrowSrc from "../../../assets/images/left-arrow.svg";
import emptyNewsSrc from "../../../assets/images/news.svg";
import "../../../assets/styles/vendor/slick-theme.css";
import "../../../assets/styles/vendor/slick.css";
import "./favs-carousel.scss";
import { useWatchResize } from "../../../core/hooks/useWatchResize";

const FavsCarousel = (props: {
  favs: FavEntity[];
  titleElement: JSX.Element;
}) => {
  const { favs, titleElement } = props;
  const { windowWidth } = useWatchResize();
  const { topFavs, multiFavsInfo } = useAppSelector(state => state.favs);
  const sliderRef = useRef<Slider>(null);

  const tilesPerPage = windowWidth < 660 ? 1 : 2;

  return (
    <>
      <h2 className="section-title similar-favs-section-title">
        <span>{titleElement}</span>
        <button
          className={`left-arrow arrow-btn`}
          onClick={() => sliderRef.current?.slickPrev()}
        >
          <img src={leftArrowSrc} />
        </button>
        <button
          className={`right-arrow arrow-btn`}
          onClick={() => sliderRef.current?.slickNext()}
        >
          <img src={leftArrowSrc} />
        </button>
      </h2>
      <Slider
        className={`similar-favs ${tilesPerPage == 1 ? "single-tile" : ""}`}
        arrows={false}
        dots={false}
        infinite={true}
        slidesPerRow={tilesPerPage}
        ref={sliderRef}
      >
        {favs?.map((fav, i) => {
          const {
            data: favInfo,
            isIPO,
            marketPriceDeltaForWeek,
            marketPriceDeltaPercentForWeek,
          } = extractFavStatisticsInfo(multiFavsInfo, fav?.id);

          return (
            <FavTile
              key={i}
              fav={fav as FavEntity}
              favInfo={favInfo}
              isIPO={isIPO}
              isTop10={topFavs?.slice(0,10).find(t => t.id === fav?.id)}
              marketPriceDeltaForWeek={marketPriceDeltaForWeek}
              marketPriceDeltaPercentForWeek={marketPriceDeltaPercentForWeek}
              className={tilesPerPage == 1 ? "single-tile" : ""}
            />
          );
        })}
      </Slider>
      {!favs.length && (
        <div className="trending-list-empty">
          <img src={emptyNewsSrc} className="empty-img" />
          <span className="empty-label">No Trends Yet</span>
        </div>
      )}
    </>
  );
};

export default FavsCarousel;
