import React, { useEffect, useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

import OldEquityPanel from "../../components/assets/equity-panel/OldEquityPanel";
import FavPriceVolumePanel from "../../components/assets/fav-price-volume-panel/FavPriceVolumePanel";
import MarketCapRow from "../../components/assets/market-cap-row/MarketCapRow";
import { FavActivityPanel } from "../../components/fav/activity-panel/ActivityPanel";
import SimilarFavs from "../../components/fav/similar-favs-carousel/SimilarFavsCarousel";
import FavPortrait from "../../components/image/fav-portrait/FavPortrait";
import AboutText from "../../components/text/about-text/AboutText";
import BuySellPanel from "../../components/transaction/buy-sell-panel/BuySellPanel";
import { useAppDispatch, useAppSelector } from "../../core/hooks/rtkHooks";
import { useWatchResize } from "../../core/hooks/useWatchResize";
import * as favsActions from "../../core/store/slices/favsSlice";
import { extractFavStatisticsInfo } from "../../core/util/base.util";
import { notFoundPath } from "../../core/util/pathBuilder.util";
import { pixelToNumber, toUSDC } from "../../core/util/string.util";
import BasePage from "../base-page/BasePage";

import Sticky from "react-stickynode";
import { FavEntity } from "../../../generated-graphql/graphql";
import { ShareAsset, UserInfo } from "../../../generated-subgraph/graphql";
import CharityDonation from "../../components/charity-donation/CharityDonation";
import SEO from "../../components/seo/SEO";
import { Flex } from "../../components/styleguide/styleguide";
import {
  DEFAULT_IPO_AVAILABLE_SHARES,
  DEFAULT_IPO_SUPPLY,
  DEFAULT_POOL_SIZE
} from "../../core/constants/base.const";
import { RESPONSIVE } from "../../core/constants/responsive.const";
import "./fav-page.scss";

const FavPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { title } = useParams<{ title: string }>();
  const {
    loadingFavs,
    favs,
    loadingMultiFavsInfo,
    multiFavsInfo,
    loadingHistoricalFavInfo,
    historicalFavInfo,
    historicalFavInfoOnlyOneDay,
    loadingFavBlockchainHistories,
    favBlockchainHistories,
    topFavs
  } = useAppSelector((state) => state.favs);
  const { historicalUserInfo, userInfo } = useAppSelector(
    (state) => state.user
  );
  const { windowWidth } = useWatchResize();

  const [buyPanelPinned, setBuyPanelPinned] = useState(false);

  const loading =
    loadingFavs ||
    loadingMultiFavsInfo ||
    loadingHistoricalFavInfo ||
    loadingFavBlockchainHistories;
  const fav: FavEntity | undefined = useMemo(() => {
    return favs.filter((o) => o.title === title)[0];
  }, [favs, title]);
  const favId = fav?.id || 1;

  const {
    data: favInfo,
    isIPO,
    sharesDelta,
    marketCap,
    marketPriceDelta,
    volumeUSDCDelta,
    volumeDeltaPercent
  } = useMemo(
    () => extractFavStatisticsInfo(multiFavsInfo, fav?.id),
    [multiFavsInfo, fav]
  );

  let currUserInfo: UserInfo | undefined;
  let prevUserInfo: UserInfo | undefined;

  if (historicalUserInfo) {
    const [prevKey, currKey] = Object.keys(historicalUserInfo).slice(-2);
    prevUserInfo = historicalUserInfo[prevKey]?.at(0);
    currUserInfo = historicalUserInfo[currKey]?.at(0) || prevUserInfo;
  }

  let currentPrice = 0;
  let shares = 0;
  let equity = 0;
  let equity24 = 0;
  let todaysReturn = 0;
  let todaysReturnPercent = 0;
  let totalReturn = 0;
  let totalReturnPercent = 0;
  let avgCost = 0;
  let charityValue = 0;

  const shareAsset: ShareAsset | undefined = currUserInfo?.shareAssets.filter(
    (o) => +o.favInfo.id === favId
  )[0];
  const shareAsset24: ShareAsset | undefined = prevUserInfo?.shareAssets.filter(
    (o) => +o.favInfo.id === favId
  )[0];
  // undefined value of shareAsset means you are not holding this fav's shares. And EquityPanel should be hidden.
  if (shareAsset) {
    currentPrice = toUSDC(
      shareAsset.favInfo.ipoEndTime * 1000 < Date.now()
        ? shareAsset.favInfo.marketPrice
        : shareAsset.favInfo.ipoPrice
    );
    shares = shareAsset.amount;
    equity = currentPrice * shares;

    const price24 = toUSDC(
      (shareAsset24?.favInfo?.ipoEndTime || 0) * 1000 < Date.now()
        ? shareAsset24?.favInfo?.marketPrice
        : shareAsset24?.favInfo?.ipoPrice
    );
    const shares24 = shareAsset24?.amount || 0;
    equity24 = price24 * shares24;

    todaysReturn = equity - equity24;
    todaysReturnPercent = equity24 === 0 ? 0 : (todaysReturn / equity24) * 100;

    const totalCost = toUSDC(shareAsset.totalCost);
    totalReturn = equity - totalCost;
    totalReturnPercent = totalCost === 0 ? 0 : (totalReturn / totalCost) * 100;
    avgCost = shares === 0 ? 0 : totalCost / shares;
  }

  const shares25Perc =
    (isIPO ? DEFAULT_IPO_AVAILABLE_SHARES : DEFAULT_POOL_SIZE) * 0.25;
  charityValue = shares25Perc * (currentPrice === 0 ? 1 : currentPrice);

  const holdingShares: number = useMemo(
    () =>
      userInfo?.shareAssets.filter((o) => +o.favInfo.id === favId)[0]?.amount ||
      0,
    [userInfo, favId]
  );

  useEffect(() => {
    const updateBuyPanelPinned = () => {
      const favPortraitElement = document.querySelector(".fav-portrait");
      const favPortraitBottom = favPortraitElement
        ? favPortraitElement?.getBoundingClientRect().y +
          favPortraitElement?.getBoundingClientRect().height
        : 0;

      const shouldBePinned =
        favPortraitBottom < 50 && windowWidth < pixelToNumber(RESPONSIVE.large);
      if (buyPanelPinned !== shouldBePinned) {
        setBuyPanelPinned(shouldBePinned);
      }
    };

    updateBuyPanelPinned();
    window.addEventListener("scroll", updateBuyPanelPinned);
    window.addEventListener("resize", updateBuyPanelPinned);
    return () => {
      window.removeEventListener("scroll", updateBuyPanelPinned);
      window.removeEventListener("resize", updateBuyPanelPinned);
    };
  }, [buyPanelPinned]);

  useEffect(() => {
    if (favId) {
      dispatch(favsActions.loadHistoricalFavInfo(favId));
      dispatch(favsActions.loadBlockchainHistoriesByFavId(favId));
    }
  }, [favId]);

  useEffect(() => {
    if (favs.length && !fav) {
      navigate(notFoundPath());
    }
  }, [favs.length, fav]);

  return (
    <BasePage
      className="fav-page"
      style={{
        paddingBottom: buyPanelPinned
          ? "180px"
          : undefined /* Avoid pinned overlay footer*/
      }}
      contentStyle={{ paddingTop: 0 }}
    >
      <SEO
        title={`Celebrity Stock Profiles of ${fav?.displayName} on Oceana Market - Detailed Info, Analysis & Trading Opportunities`}
        description={`Explore in-depth celebrity stock profiles of ${fav?.displayName} on Oceana Market, featuring names, tick symbols, IPO status, current prices, percentage changes, volume, market cap, celeb intros, transaction history, similar stocks, and quick buy/sell options for seamless trading.`}
        name={`Oceana Market`}
        type={`Celeb Stock Profile`}
      />
      <BuySellPanel
        fav={fav as FavEntity}
        className={`pinned-panel ${buyPanelPinned ? "" : "hidden"}`}
        type="row"
        isIPO={isIPO}
        ipoEndTime={favInfo?.ipoEndTime}
        holdingShares={holdingShares}
        loading={loadingFavs || loadingMultiFavsInfo}
        favInfo={favInfo}
      />
      <div className="top-module">
        <div className="left-col">
          <h1 className="fav-identifier show-md">
            <span className="fav-name">{fav?.displayName}</span>
            <span className="fav-share-name">{fav?.coin}</span>
          </h1>
          <FavPortrait
            image={[{ key: "default", image: fav?.mobileSizeImage }]}
            fav={fav as FavEntity | undefined}
            isTop10={topFavs?.slice(0, 10).find((t) => t.id === fav?.id)}
            isIPO={isIPO}
          />
          <BuySellPanel
            fav={fav as FavEntity}
            className={`${buyPanelPinned ? "hidden" : ""} show-md`}
            isIPO={isIPO}
            ipoEndTime={favInfo?.ipoEndTime}
            loading={loadingFavs || loadingMultiFavsInfo}
            favInfo={favInfo}
            holdingShares={holdingShares}
          />
          <div className="bottom-content">
            <FavPriceVolumePanel
              loading={loading}
              fav={fav as FavEntity}
              sharesSold={
                isIPO
                  ? DEFAULT_IPO_SUPPLY - favInfo.availableSupply
                  : DEFAULT_POOL_SIZE - favInfo.amountInPool
              }
              sharesDelta={sharesDelta}
              isIPO={isIPO}
              volumeDeltaPercent={volumeDeltaPercent}
              favsInfo={historicalFavInfo}
              favsInfoOnlyOneDay={historicalFavInfoOnlyOneDay}
            />

            <hr />

            {fav && (
              <MarketCapRow
                isIPO={isIPO}
                favInfo={favInfo}
                marketCap={marketCap}
                sharesDelta={sharesDelta}
                volumeUSDCDelta={volumeUSDCDelta}
                marketPriceDelta={marketPriceDelta}
              />
            )}

            <FixedFlex
              className="show-md-and-lower"
              style={{ marginTop: "160px" }}
            >
              <CharityDonation charityValue={charityValue} fav={fav} />
            </FixedFlex>

            {holdingShares > 0 ? (
              <OldEquityPanel
                totalEquity={equity}
                totalCost={avgCost}
                todaysReturn={todaysReturn}
                todaysReturnPercent={todaysReturnPercent}
                totalReturn={totalReturn}
                totalReturnPercent={totalReturnPercent}
                shares={holdingShares}
                currentPrice={currentPrice}
                coin={fav?.coin as string | undefined}
                expandedVersion
              />
            ) : null}

            <div className="about-section">
              <h2 className="section-title about-title">
                <FormattedMessage
                  defaultMessage="about {name}"
                  values={{ name: fav?.displayName }}
                />
              </h2>
              <AboutText fullText={fav?.about || ""} />
            </div>

            <h2 className="section-title">
              <FormattedMessage defaultMessage="Activity" />
            </h2>
            {fav && (
              <FavActivityPanel
                fav={fav as FavEntity}
                loading={loading}
                blockchainHistoriesData={favBlockchainHistories}
                holdingShares={holdingShares}
              />
            )}
            {/* <h2 className="section-title">
            <FormattedMessage defaultMessage="News" />
          </h2>
          <NewsList favKeys={[fav?.key as string]} /> */}
            {favId && (
              <SimilarFavs selfFavId={favId} category={fav?.category} />
            )}
          </div>
        </div>
        <div className="right-col">
          <h1 className="fav-identifier hide-md">
            <span className="fav-name">{fav?.displayName}</span>
            <span className="fav-share-name">{fav?.coin}</span>
          </h1>
          <Sticky top={76} bottomBoundary=".right-col">
            <FixedFlex className="floating-element">
              <BuySellPanel
                fav={fav as FavEntity}
                className={`${buyPanelPinned ? "hidden" : ""}`}
                isIPO={isIPO}
                ipoEndTime={favInfo?.ipoEndTime}
                loading={loadingFavs || loadingMultiFavsInfo}
                favInfo={favInfo}
                holdingShares={holdingShares}
              />
              <div
                className="hide-md"
                style={{
                  marginTop: isIPO ? "62px" : "0",
                  paddingBottom: "76px"
                }}
              >
                <CharityDonation charityValue={charityValue} fav={fav} />
              </div>
            </FixedFlex>
          </Sticky>
        </div>
      </div>
    </BasePage>
  );
};

const FixedFlex = styled(Flex)`
  flex-direction: column;
  gap: 76px;
  /* position: sticky;
  top: 90px;
  max-height: 100vh;
  overflow-y: scroll; */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  .buy-sell-panel {
    margin-top: -29px;
  }
  &.show-md-and-lower {
    display: none !important;
    @media screen and (max-width: 1024px) {
      display: flex !important;
    }
  }
  @media screen and (max-width: ${RESPONSIVE.large}) {
    position: relative;
    top: 0;
    max-height: inherit;
    overflow-y: inherit;
  }
`;

export default FavPage;
