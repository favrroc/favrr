import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import styled from "styled-components";

import { FavEntity } from "../../../../generated-graphql/graphql";
import { ReactComponent as LeftArrowIcon } from "../../../assets/images/left-arrow.svg";
import { ReactComponent as RightArrowIcon } from "../../../assets/images/right-arrow.svg";
import "../../../assets/styles/vendor/slick-theme.css";
import "../../../assets/styles/vendor/slick.css";
import { RESPONSIVE } from "../../../core/constants/responsive.const";
import { colors } from "../../../core/constants/styleguide.const";
import { useAppSelector } from "../../../core/hooks/rtkHooks";
import { useWatchResize } from "../../../core/hooks/useWatchResize";
import { EmptyStateTypes } from "../../../core/interfaces/emptystate.type";
import LiveBadge from "../../badge/LiveBadge";
import GetUpdateModule from "../../get-update-module/GetUpdateModule";
import Loader from "../../loader/Loader";
import EmptyState from "../../portfolio/children/EmptyState";
import "./fan-match-carousel.scss";
import FanMatchTile from "./fan-match-tile/FanMatchTile";

const FanMatchCarousel = () => {
  const { smallerThanTablet, smallerThanXLarge } = useWatchResize();
  const { favs, loadingMultiFavsInfo, loadingFavs } = useAppSelector(
    (state) => state.favs
  );
  const { loadingFanMatchesList, fanMatchesList, liveMatchResults } =
    useAppSelector((state) => state.fanMatch);

  const parentRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<Slider>(null);

  const [, forceRender] = useState({});
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const tilesPerPage = smallerThanTablet ? 1 : smallerThanXLarge ? 2 : 3;

  const slickDot = parentRef.current?.querySelector(
    ".slick-dots .slick-active"
  );
  const buttonWidth = slickDot?.clientWidth;
  const isInfiniteScroll = fanMatchesList.length > tilesPerPage;

  if (!!!slickDot) {
    setTimeout(() => forceRender({}), 100);
  }

  useEffect(() => {
    const numberOfSlides = Math.ceil(fanMatchesList.length / tilesPerPage);
    setCurrentSlide(Math.min(Math.max(currentSlide, 0), numberOfSlides - 1));
  }, [fanMatchesList, tilesPerPage, smallerThanTablet, smallerThanXLarge]);

  const tabsSizes = {
    1: 11.2,
    2: 20,
    3: 33.33
  };

  const settings = {
    rows: 1,
    dots: true,
    arrows: false,
    infinite: isInfiniteScroll,
    speed: 300,
    slidesToShow: tilesPerPage,
    slidesToScroll: tilesPerPage
  };

  const getCurrentButton = () => {
    setTimeout(() => {
      const el = parentRef.current?.querySelector(".slick-dots .slick-active");
      if (el?.parentElement) {
        const index = Array.from(el.parentElement.children).indexOf(el);
        setCurrentSlide(index);
      }
    }, 100);
  };

  return (
    <IPO
      className="ipo-carousel"
      obj={{
        count: currentSlide,
        tiles: tabsSizes[tilesPerPage],
        btnwidth: buttonWidth
      }}
      ref={parentRef}
    >
      <H2
        className="similar-favs-section-title"
        style={{ position: "relative" }}
      >
        <div style={{ display: "flex", gap: "12px", position: "relative" }}>
          <span>{`FAN MATCHES`}</span>
          <LiveBadge isOnLandingPage={false} />
        </div>

        {isInfiniteScroll && (
          <>
            <div style={{ position: "absolute", right: "48px", top: "-16px" }}>
              <ArrowButton onClick={() => sliderRef.current?.slickPrev()}>
                <LeftArrowIcon />
              </ArrowButton>
            </div>
            <div style={{ position: "absolute", right: "0px", top: "-16px" }}>
              <ArrowButton onClick={() => sliderRef.current?.slickNext()}>
                <StyledRightArrowIcon />
              </ArrowButton>
            </div>
          </>
        )}
      </H2>
      <StyledP className="styled-p">{`Huge celebrity face-offs: score big prizes by helping your faves wins!`}</StyledP>
      {loadingFavs && loadingMultiFavsInfo ? (
        <Loader wrapperStyle={{ minHeight: "250px" }} />
      ) : (
        <>
          <Slider
            className={`similar-favs ${tilesPerPage == 1 ? "single-tile" : ""}`}
            beforeChange={() => {
              getCurrentButton();
            }}
            initialSlide={0}
            centerPadding="32px"
            ref={sliderRef}
            {...settings}
          >
            {fanMatchesList?.map((fanMatch, i) => {
              const firstFav = favs.find(
                (fav) => fav.id === fanMatch.leftFav.id
              );
              const secondFav = favs.find(
                (fav) => fav.id === fanMatch.rightFav.id
              );
              return (
                <FanMatchTile
                  key={i}
                  isLoading={loadingFanMatchesList}
                  title={fanMatch.title || ""}
                  firstFav={firstFav as FavEntity}
                  secondFav={secondFav as FavEntity}
                  endDate={dayjs().add(1, "day").add(i, "week").toDate()}
                  isLiveMatch={i === 0}
                  isOnFanMatchesPage={false}
                  liveFanMatchResults={i === 0 ? liveMatchResults : undefined}
                  fanMatchId={String(fanMatch?.id)}
                  isLike={fanMatch?.isLike || false}
                  isSharing={false}
                />
              );
            })}
            <GetUpdateModule isOnFanMatchesPage={false} />
          </Slider>
        </>
      )}
      {!loadingFavs && !loadingMultiFavsInfo && !fanMatchesList.length && (
        <div className="trending-list-empty">
          <EmptyState public={false} variant={EmptyStateTypes.IPO} />
        </div>
      )}
    </IPO>
  );
};

const IPO = styled.div`
  max-width: ${RESPONSIVE.maxWidth} !important;
  .slick-dots {
    &:after {
      left: ${(props: { obj: { count: number; btnwidth: number } }) =>
    props.obj.count * props.obj.btnwidth}px !important;
      width: ${(props: { obj: { btnwidth: number } }) =>
    props.obj.btnwidth}px !important;
    }
  }
  .slick-track {
    padding-top: 60px;
  }
`;

const H2 = styled.h2`
  font-family: "Oswald";
  font-style: normal;
  font-weight: 700;
  font-size: 40px;
  line-height: 48px;
  @media screen and (max-width: ${RESPONSIVE.small}) {
    font-size: 32px;
    line-height: 40px;
  }
`;

const StyledP = styled.p`
  padding: 0;
  color: #808191;
`;

const ArrowButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 100%;
  box-shadow: inset 0 0 0 2px #353945;
  background-position: center;
  background-repeat: no-repeat;
  &:hover {
    box-shadow: inset 0 0 0 2px #fcfcfd;
    filter: brightness(2);
  }
`;

const StyledRightArrowIcon = styled(RightArrowIcon)`
  path {
    fill: ${colors.neutrals4};
  }
`;
export default FanMatchCarousel;
