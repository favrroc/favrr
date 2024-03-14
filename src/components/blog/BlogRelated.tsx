import React, { useMemo, useRef, useState } from "react";
import Slider from "react-slick";
import styled from "styled-components";

import leftArrowSrc from "../../assets/images/left-arrow.svg";
import "../../assets/styles/vendor/slick-theme.css";
import "../../assets/styles/vendor/slick.css";
import { blogs } from "../../core/constants/blogs.const";
import { RESPONSIVE } from "../../core/constants/responsive.const";
import { useAppSelector } from "../../core/hooks/rtkHooks";
import { useWatchResize } from "../../core/hooks/useWatchResize";
import { EmptyStateTypes } from "../../core/interfaces/emptystate.type";
import Loader from "../loader/Loader";
import EmptyState from "../portfolio/children/EmptyState";
import "./blog-related.scss";
import BlogTile from "./blog-tile/BlogTile";

const BlogRelated = ({ dark = false, heading = "POPULAR POSTS", list = blogs }: { dark?: boolean, heading?: string, list?: any; }) => {
  const { windowWidth } = useWatchResize();
  const { loadingMultiFavsInfo, loadingFavs } = useAppSelector(state => state.favs);
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const favsIpo = list;

  const parentRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<Slider>(null);

  const tilesPerPage = windowWidth < 660 ? 1 : windowWidth < 1025 ? windowWidth < 850 ? 2 : 3 : 3;

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
    <IPO className={`blog-related ${dark ? "" : "light-theme"}`} obj={{ count: currentSlide, tiles: tabsSizes[tilesPerPage], btnwidth: buttonWidth }} ref={parentRef}>
      <H2 className="similar-favs-section-title">
        <span>{heading}</span>
        {isInfiniteScroll && favsIpo.length > 0 && <><button
          className={`left-arrow arrow-btn ${dark ? "" : "light-theme"}`}
          onClick={() => sliderRef.current?.slickPrev()}
        >
          <img src={leftArrowSrc} />
        </button>
        <button
          className={`right-arrow arrow-btn ${dark ? "" : "light-theme"}`}
          onClick={() => sliderRef.current?.slickNext()}
        >
          <img src={leftArrowSrc} />
        </button></>}
      </H2>
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
            {favsIpo?.map((fav) => {
              return (
                <BlogTile dark={dark} key={fav.url} featured={false} hideDetail={true} tile={fav} />
              );
            })}
            <BlogTile dark={dark} featured={false} moreButton={true} />
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

export default BlogRelated;
