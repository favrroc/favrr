import React, { useMemo, useRef, useState } from "react";
import Slider from "react-slick";
import styled from "styled-components";

import { FavEntity } from "../../../../generated-graphql/graphql";
import leftArrowSrc from "../../../assets/images/left-arrow.svg";
import emptyNewsSrc from "../../../assets/images/news.svg";
import "../../../assets/styles/vendor/slick-theme.css";
import "../../../assets/styles/vendor/slick.css";
import { RESPONSIVE } from "../../../core/constants/responsive.const";
import { useAppSelector } from "../../../core/hooks/rtkHooks";
import { useWatchResize } from "../../../core/hooks/useWatchResize";
import { extractFavStatisticsInfo } from "../../../core/util/base.util";
import Loader from "../../loader/Loader";
import "./ipo-carousel.scss";
import IpoTile from "./ipo-tile/IpoTile";
import EmptyState from "../../portfolio/children/EmptyState";
import { EmptyStateTypes } from "../../../core/interfaces/emptystate.type";

const IpoCarousel = () => {
  const { windowWidth } = useWatchResize();
  const { favs, multiFavsInfo, loadingMultiFavsInfo, loadingFavs } = useAppSelector(state => state.favs);
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  let favsIpo = Object.values(multiFavsInfo)
    .filter((o) => o.isIPO)
    .sort((a, b) => +b.data.updatedAt - +a.data.updatedAt)
    .map((o) => o.data.id)
    .map((o) => favs?.filter((oo) => oo.id === +o)[0])
    .filter((o) => !!o);

  favsIpo = favsIpo.slice(0, 14);

  const parentRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<Slider>(null);

  const tilesPerPage = windowWidth < 660 ? 1 : windowWidth < 1025 ? windowWidth < 850 ? 2 : 3 : 4;

  const tabsSizes = {
    1: 11.2,
    2: 20,
    3: 33.33,
    4: 33.33
  };

  const isInfiniteScroll = useMemo(() => {
    if (favsIpo.length > tilesPerPage) {
      return true;
    }
    return false;
  }, [favsIpo]);

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
        const index = Array.from(
          el.parentElement.children
        ).indexOf(el);
        setCurrentSlide(index);
      }
    }, 100);
  };

  const buttonWidth = parentRef.current?.querySelector(".slick-dots .slick-active")?.clientWidth;

  return (
    <IPO className="ipo-carousel" obj={{ count: currentSlide, tiles: tabsSizes[tilesPerPage], btnwidth: buttonWidth }} ref={parentRef}>
      <H2 className="similar-favs-section-title">
        <span>HOT IPOs</span>
        {isInfiniteScroll && favsIpo.length > 0 && <><button
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
        </button></>}
      </H2>
      <StyledP className="styled-p">Get exclusive IPO pricing on select stocks before time runs out.</StyledP>
      {(loadingFavs && loadingMultiFavsInfo) ? (
        <Loader wrapperStyle={{ minHeight: "250px" }} />
      ) :
        <>
          <Slider
            className={`similar-favs ${tilesPerPage == 1 ? "single-tile" : ""}`}
            beforeChange={(value) => {
              getCurrentButton();
            }}
            initialSlide={0}
            ref={sliderRef}
            {...settings}
          >
            {favsIpo?.map((fav, i) => {
              const {
                data: favInfo,
                isIPO,
                marketPriceDeltaForWeek,
                marketPriceDeltaPercentForWeek,
              } = extractFavStatisticsInfo(multiFavsInfo, fav?.id);

              return (
                <IpoTile
                  key={i}
                  fav={fav as FavEntity}
                  favInfo={favInfo}
                  isIPO={isIPO}
                  marketPriceDeltaForWeek={marketPriceDeltaForWeek}
                  marketPriceDeltaPercentForWeek={marketPriceDeltaPercentForWeek}
                  className={tilesPerPage == 1 ? "single-tile" : ""}
                />
              );
            })}
          </Slider>
        </>
      }
      {!loadingFavs && !loadingMultiFavsInfo && !favsIpo.length && (
        <div className="trending-list-empty">
          {/* <img src={emptyNewsSrc} className="empty-img" alt="Empty" />
          <span className="empty-label">Nothing Yet</span> */}
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
      left: ${(props: { obj: { count: number, btnwidth: number; }; }) => props.obj.count * props.obj.btnwidth}px !important;
      width: ${(props: { obj: { btnwidth: number; }; }) => props.obj.btnwidth}px !important;
    }
  }
`;

const RangeInput = styled.input`
  height: 10px;
  -webkit-appearance: none;
  margin: 10px 0;
  width: 100%;
  overflow: hidden;
  max-width: 360px;
  margin: auto;
  background: none;

  &:focus {
    outline: none;
  }
  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 4px;
    cursor: pointer;
    animate: 0.2s;
    box-shadow: 0px 0px 0px #000000;
    background: #353945;
    border-radius: 50px;
    border: 0px solid #000000;
    overflow: hidden;
  }
  &::-webkit-slider-thumb {
    box-shadow: 0px 0px 0px #000000;
    border: 0px solid #2497E3;
    height: 4px;
    width: 90px;
    border-radius: 0px;
    background: #b1b5c4;
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: 0px;
    border-radius: 50px;
  }
  &:focus::-webkit-slider-runnable-track {
    background: #353945;
  }
  &::-moz-range-track {
    width: 100%;
    height: 4px;
    cursor: pointer;
    animate: 0.2s;
    box-shadow: 0px 0px 0px #000000;
    background: #353945;
    border-radius: 5px;
    border: 0px solid #000000;
  }
  &::-moz-range-thumb {
    box-shadow: 0px 0px 0px #000000;
    border: 0px solid #2497E3;
    height: 4px;
    width: 90px;
    border-radius: 0px;
    background: #b1b5c4;
    cursor: pointer;
  }
  &::-ms-track {
    width: 100%;
    height: 4px;
    cursor: pointer;
    animate: 0.2s;
    background: transparent;
    border-color: transparent;
    color: transparent;
  }
  &::-ms-fill-lower {
    background: #353945;
    border: 0px solid #000000;
    border-radius: 10px;
    box-shadow: 0px 0px 0px #000000;
  }
  &::-ms-fill-upper {
    background: #353945;
    border: 0px solid #000000;
    border-radius: 10px;
    box-shadow: 0px 0px 0px #000000;
  }
  &::-ms-thumb {
    margin-top: 1px;
    box-shadow: 0px 0px 0px #000000;
    border: 0px solid #2497E3;
    height: 4px;
    width: 90px;
    border-radius: 0px;
    background: #b1b5c4;
    cursor: pointer;
  }
  &::-moz-range-progress {
    appearance: none;
    background: red;
    transition-delay: 30ms;
  }
  &:focus::-ms-fill-lower {
    background: #353945;
  }
  &:focus::-ms-fill-upper {
    background: #353945;
  }
`;

const H2 = styled.h2`
  font-family: 'Oswald';
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

export default IpoCarousel;
