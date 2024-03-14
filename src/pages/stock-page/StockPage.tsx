import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { FormattedMessage } from "react-intl";
import styled from "styled-components";

import emptyStateSrc from "../../assets/images/empty-state.svg";
import TickersBar from "../../components/assets/tickers-bar/TickersBar";
import FavTile from "../../components/fav/fav-tile/FavTile";
import IpoCarousel from "../../components/fav/ipo-carousel/IpoCarousel";
import TopFavsPanel from "../../components/fav/top-favs-panel/TopFavsCarousel";
import CategoriesPicker from "../../components/filter/categories-picker/CategoriesPicker";
import FiltersButton from "../../components/filter/filters-button/FiltersButton";
import HeroPromo from "../../components/hero/hero-promo/HeroPromo";
import Loader from "../../components/loader/Loader";
import SEO from "../../components/seo/SEO";
import { RESPONSIVE } from "../../core/constants/responsive.const";
import { colors } from "../../core/constants/styleguide.const";
import { ResponsiveContext, screenType } from "../../core/context/responsive.context";
import { useAppSelector } from "../../core/hooks/rtkHooks";
import { useLowercasedAccount } from "../../core/hooks/useLowercasedAccount";
import { useWatchResize } from "../../core/hooks/useWatchResize";
import { extractFavStatisticsInfo } from "../../core/util/base.util";
import BasePage from "../base-page/BasePage";
import "./stock-page.scss";

const HEADER_HEIGHT = 82;
const HEADER_HEIGHT_MOBILE = 14;

type SortingOption = "trendy" | "cheap" | "expensive";

const StockPage = () => {
  const { windowWidth } = useWatchResize();
  const { isConnected } = useLowercasedAccount();
  const { currentScreenType } = useContext(ResponsiveContext);
  const { favs, multiFavsInfo, topFavs, loading } = useAppSelector(
    state => state.favs
  );

  const [selectedCategories, setSelectedCategories] = useState<Array<string>>(
    []
  );
  const [sortingCriteria, setSortingCriteria] =
    useState<SortingOption>("trendy");
  const [displayIPOS, setDisplayIPOS] = useState(true);

  const favsByCategory = React.useMemo(() => {
    return selectedCategories.length === 0
      ? favs
      : favs.filter(
        (o) => o.category?.toLowerCase() === selectedCategories[0]
      );
  }, [favs, selectedCategories]);

  const { favsByTrendy, favsByCheap, favsByExpensive } = React.useMemo(() => {
    const byTrendy = multiFavsInfo
      ? Object.values(multiFavsInfo)
        .sort((a, b) => +b.data.updatedAt - +a.data.updatedAt)
        .filter((o) => displayIPOS || !o.isIPO)
        .map((o) => o.data.id)
        .map((o) => favsByCategory.filter((oo) => oo.id === +o)[0])
        .filter((o) => !!o)
      : [];

    const byCheap = multiFavsInfo
      ? Object.values(multiFavsInfo)
        .sort((a, b) => +a.data.marketPrice - +b.data.marketPrice)
        .filter((o) => displayIPOS || !o.isIPO)
        .map((o) => o.data.id)
        .map((o) => favsByCategory.filter((oo) => oo.id === +o)[0])
        .filter((o) => !!o)
      : [];

    return {
      favsByTrendy: byTrendy,
      favsByCheap: byCheap,
      favsByExpensive: [...byCheap].reverse(),
    };
  }, [multiFavsInfo, favsByCategory, displayIPOS]);

  const filteredFavs = React.useMemo(() => {
    return sortingCriteria === "trendy"
      ? favsByTrendy
      : sortingCriteria === "cheap"
        ? favsByCheap
        : favsByExpensive;
  }, [favsByTrendy, favsByExpensive, favsByCheap, sortingCriteria]);

  const loadMore = () => null;

  const exploreTitleRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const checkTitleSticky = () => {
      if (exploreTitleRef.current) {
        const rect = exploreTitleRef.current.getBoundingClientRect();
        if (
          currentScreenType == screenType.MOBILE
            ? rect.top <= HEADER_HEIGHT_MOBILE
            : rect.top <= HEADER_HEIGHT
        ) {
          exploreTitleRef.current.classList.add("sticky");
        } else {
          exploreTitleRef.current.classList.remove("sticky");
        }
      }
    };
    checkTitleSticky();
    window.addEventListener("scroll", checkTitleSticky);
    return () => window.removeEventListener("scroll", checkTitleSticky);
  }, [currentScreenType]);

  const numberOfColumns = useMemo(() => {
    if (windowWidth <= 620) {
      return 1;
    }
    if (windowWidth <= 1050) {
      return 2;
    }
    if (windowWidth <= 1200) {
      return 3;
    }
    if (windowWidth <= 1550) {
      return 4;
    }
    if (windowWidth <= 1740) {
      return 4;
    }
    return 4;
  }, [windowWidth]);

  const renderFavTiles = () => (
    filteredFavs?.slice(0, visibleFavsNumber).map((fav, i) => {
      const {
        data: favInfo,
        isIPO,
        marketPriceDeltaForWeek,
        marketPriceDeltaPercentForWeek,
      } = extractFavStatisticsInfo(multiFavsInfo, fav?.id);
      return (
        <StyledFavTile
          key={fav?.key || i}
          fav={fav}
          favInfo={favInfo}
          isIPO={isIPO}
          isTop10={topFavs?.slice(0, 10).find(t => t.id === fav?.id)}
          marketPriceDeltaForWeek={marketPriceDeltaForWeek}
          marketPriceDeltaPercentForWeek={marketPriceDeltaPercentForWeek}
        />
      );
    })
  );

  const loadedFavsLength = favs.length || 0;
  const hasMore = false;

  const numberOfRows = Math.floor(loadedFavsLength / numberOfColumns);
  const visibleFavsNumber = hasMore
    ? numberOfRows * numberOfColumns
    : loadedFavsLength;

  return (
    <BasePage
      className="stock-page"
      style={{ "--number-columns": numberOfColumns } as any}
    >
      <SEO
        title={`Top IPO & Trending Celebrity Stocks on Oceana Market - Play, Earn & Support Charities`}
        description={`Discover the latest IPO and trending celebrity stocks on Oceana Market, the ultimate celebrity stock trading game. Analyze trendlines, stock prices, and market caps to make informed decisions, while supporting charities and earning rewards as a fan!`}
        name={`Oceana Market`}
        type={`Stocks Page`}
      />
      <HeroBanner>
        <p>INVEST IN WHO YOU LOVE</p>
        <h1>{"WHO'S"} YOUR HERO?</h1>
      </HeroBanner>
      <hr className="section-divider" />
      <div className="padding-container">
        <IpoCarousel />
        <TopFavsPanel />
        <StyledExploreTop id="explore-top" />
      </div>
      <div id="explore" className="section-title explore-title" ref={exploreTitleRef}>
        <span className="explore-label">
          <FormattedMessage defaultMessage="Explore" />
        </span>
        <div className="filter-container">
          <CategoriesPicker
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
          />
          <FiltersButton
            sorting={sortingCriteria}
            onChangeSorting={(sorting) => setSortingCriteria(sorting)}
            includeIPOs={displayIPOS}
            onIncludeIPOsChange={(value) => setDisplayIPOS(value)}
          />
        </div>
      </div>
      <StyledPaddingContainer className="padding-container width-100-perc">
        <InfiniteScroll
          className="explore-cards-container"
          dataLength={visibleFavsNumber}
          hasMore={hasMore}
          loader={
            <span className="initial-loader">
              <Loader />
            </span>
          }
          next={loadMore}
        >
          {loading && (
            <span className="initial-loader">
              <Loader />
            </span>
          )}
          {loadedFavsLength == 0 ? (
            <div className="empty-filter-results">
              <img src={emptyStateSrc} />
              <FormattedMessage defaultMessage="No Results Found" />
            </div>
          ) : (
            <>
              {renderFavTiles()}
              {!isConnected && <InsertHeroPromo numberOfColumns={numberOfColumns}>
                <HeroPromo />
              </InsertHeroPromo>}
            </>
          )}
        </InfiniteScroll>
      </StyledPaddingContainer>
      <TickersBar />
    </BasePage>
  );
};

const StyledPaddingContainer = styled.div`
  @media (max-width: ${RESPONSIVE.small}) {
    padding-left: 0 !important; 
    padding-right: 0 !important;
    margin: 0;
  }
`;

const StyledFavTile = styled(FavTile)`
  @media (max-width: ${RESPONSIVE.small}) {
    padding-left: 25px;
    padding-right: 25px;
    box-sizing: border-box;
  }
  @media (max-width: ${RESPONSIVE.xSmall}) {
    padding-left: 4px; 
    padding-right: 4px; 
  }
`;

const InsertHeroPromo = styled.div`
  grid-row-start: 3;
  grid-row-end: 3;
  grid-column-start: 1;
  grid-column-end: ${(props: { numberOfColumns: number; }) => props.numberOfColumns + 1};
  width: 100%;
  position: relative;
  max-width: 1120px;
  margin: 40px 0;
  @media (max-width: ${RESPONSIVE.large}) {
    margin: 34px 0;
  }
  @media (max-width: ${RESPONSIVE.small}) {
    margin: 32px 0;
  }
`;

const HeroBanner = styled.div`
  padding: 72px 16px 16px;
  h1 {
    font-family: 'Oswald';
    font-style: normal;
    font-weight: 700;
    font-size: 48px;
    line-height: 56px;
    text-align: center;
    letter-spacing: -0.02em;
    color: ${colors.neutrals8};
    margin: 0;
  }
  p {
    padding: 0;
    margin: 0;
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 24px;
    text-align: center;
    color: ${colors.grey};
  }
  @media screen and (max-width: ${RESPONSIVE.small}) {
    padding: 64px 16px 16px;
    h1 {
      font-size: 32px;
      line-height: 40px;
    }
  }
`;
const StyledExploreTop = styled.div`
  width: 100%;
  height: 1px;
  margin-top: 48px;
  margin-bottom: 80px;

  @media screen and (max-width: 375px) {
    margin-top: 16px;
    margin-bottom: 80px;
  }
`;

export default StockPage;
