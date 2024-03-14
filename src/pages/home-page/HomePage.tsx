import React, {
  lazy,
  Suspense,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { FormattedMessage } from "react-intl";
import styled from "styled-components";

import TickersBar from "../../components/assets/tickers-bar/TickersBar";
import FavTile from "../../components/fav/fav-tile/FavTile";
import CategoriesPicker from "../../components/filter/categories-picker/CategoriesPicker";
import FiltersButton from "../../components/filter/filters-button/FiltersButton";
import Hero from "../../components/hero/Hero";
import LeaderBoardComponent from "../../components/leader-board/leader-board-component/LeaderBoardComponent";
import Loader from "../../components/loader/Loader";
import BasePage from "../base-page/BasePage";
// import IpoCarousel from "../../components/fav/ipo-carousel/IpoCarousel";
// import TopFavsPanel from "../../components/fav/top-favs-panel/TopFavsCarousel";
// const LeaderBoardComponent = lazy(() => import("../../components/leader-board/leader-board-component/LeaderBoardComponent"));
const IpoCarousel = lazy(
  () => import("../../components/fav/ipo-carousel/IpoCarousel")
);
const TopFavsPanel = lazy(
  () => import("../../components/fav/top-favs-panel/TopFavsCarousel")
);
const FanMatchCarousel = lazy(
  () => import("../../components/fav/fan-match-carousel/FanMatchCarousel")
);
const FanMatchesCarousel = lazy(
  () => import("../../components/carousel/fan-match/FanMatchCarousel")
);

import emptyStateSrc from "../../assets/images/empty-state.svg";
import BlogRelated from "../../components/blog/BlogRelated";
import HeroPromo from "../../components/hero/hero-promo/HeroPromo";
import SEO from "../../components/seo/SEO";
import { RESPONSIVE } from "../../core/constants/responsive.const";
import {
  ResponsiveContext,
  screenType
} from "../../core/context/responsive.context";
import { useAppDispatch, useAppSelector } from "../../core/hooks/rtkHooks";
import { useLowercasedAccount } from "../../core/hooks/useLowercasedAccount";
import { useWatchResize } from "../../core/hooks/useWatchResize";
import { setShowConnectWalletModalAction } from "../../core/store/slices/modalSlice";
import { extractFavStatisticsInfo } from "../../core/util/base.util";
import "./home-page.scss";

const HEADER_HEIGHT = 82;
const HEADER_HEIGHT_MOBILE = 14;

type SortingOption = "trendy" | "cheap" | "expensive";

interface Props {
  openConnectWalletModal?: boolean;
}

const HomePage = ({ openConnectWalletModal }: Props) => {
  const dispatch = useAppDispatch();
  const { windowWidth } = useWatchResize();
  const { isConnected } = useLowercasedAccount();
  const { currentScreenType } = useContext(ResponsiveContext);
  const { favs, multiFavsInfo, loading, topFavs } = useAppSelector(
    (state) => state.favs
  );

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortingCriteria, setSortingCriteria] =
    useState<SortingOption>("trendy");
  const [displayIPOS, setDisplayIPOS] = useState(true);

  const favsByCategory = React.useMemo(() => {
    return selectedCategories.length === 0
      ? favs
      : favs.filter((o) => o.category?.toLowerCase() === selectedCategories[0]);
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
      favsByExpensive: [...byCheap].reverse()
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
    if (openConnectWalletModal) {
      dispatch(setShowConnectWalletModalAction(true));
    }
  }, [openConnectWalletModal]);

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
    if (windowWidth <= 870) {
      return 2;
    }
    if (windowWidth <= 1210) {
      return 3;
    }
    if (windowWidth <= 1440) {
      return 4;
    }
    if (windowWidth <= 1740) {
      return 4;
    }
    return 4;
  }, [windowWidth]);

  const loadedFavsLength = favs.length || 0;
  const hasMore = false;

  const numberOfRows = Math.floor(loadedFavsLength / numberOfColumns);
  const visibleFavsNumber = hasMore
    ? numberOfRows * numberOfColumns
    : loadedFavsLength;

  const renderFavTiles = () =>
    filteredFavs?.slice(0, visibleFavsNumber).map((fav, i) => {
      const {
        data: favInfo,
        isIPO,
        marketPriceDeltaForWeek,
        marketPriceDeltaPercentForWeek
      } = extractFavStatisticsInfo(multiFavsInfo, fav?.id);
      return (
        <StyledFavTile
          key={fav?.key || i}
          fav={fav}
          favInfo={favInfo}
          isIPO={isIPO}
          isTop10={topFavs?.slice(0, 10).find((t) => t.id === fav?.id)}
          marketPriceDeltaForWeek={marketPriceDeltaForWeek}
          marketPriceDeltaPercentForWeek={marketPriceDeltaPercentForWeek}
        />
      );
    });

  return (
    <BasePage
      className="home-page"
      style={{ "--number-columns": numberOfColumns } as any}
    >
      <SEO
        title={`Oceana Market - The Celebrity Investment Game That Supports Charity`}
        description={`With Oceana Market, you can buy and sell virtual stocks representing your favorite celebrities. For every transaction, commissions go to charity! Join our beta test and help us build a better world.`}
        name={`Oceana Market`}
        type={`Explore Page`}
      />
      <Hero />
      <hr className="section-divider" />
      <div className="padding-container">
        {/* <Suspense fallback={<></>}>
          <FanMatchesCarousel />
        </Suspense> */}
        <Suspense fallback={<></>}>
          <IpoCarousel />
        </Suspense>
        <Suspense fallback={<></>}>
          <FanMatchCarousel />
        </Suspense>
        <Suspense fallback={<></>}>
          <TopFavsPanel />
        </Suspense>
        <LeaderBoardComponent />
      </div>

      <div
        id="explore"
        className="section-title explore-title"
        ref={exploreTitleRef}
      >
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

      <StyledPaddingContainer className="padding-container max-width-1120 width-100-perc">
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
              <img src={emptyStateSrc} alt="No results" />
              <FormattedMessage defaultMessage="No Results Found" />
            </div>
          ) : (
            <>
              {renderFavTiles()}
              {!isConnected && (
                <InsertHeroPromo numberOfColumns={numberOfColumns}>
                  <HeroPromo />
                </InsertHeroPromo>
              )}
            </>
          )}
        </InfiniteScroll>
      </StyledPaddingContainer>
      <TickersBar />
      <PostsPaddingContainer className="padding-container max-width-1120 width-100-perc">
        <BlogRelated dark={true} />
      </PostsPaddingContainer>
    </BasePage>
  );
};

export default HomePage;

const StyledPaddingContainer = styled.div`
  @media (max-width: ${RESPONSIVE.small}) {
    padding-left: 0 !important;
    padding-right: 0 !important;
    margin: 0;
  }
`;

const PostsPaddingContainer = styled.div`
  margin-top: 216px;
  @media (max-width: ${RESPONSIVE.medium}) {
    margin-top: 160px;
  }
  @media (max-width: ${RESPONSIVE.small}) {
    margin: 0;
    margin-top: 76px;
    margin-bottom: 41px;
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
  grid-column-end: ${(props: { numberOfColumns: number }) =>
    props.numberOfColumns + 1};
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
