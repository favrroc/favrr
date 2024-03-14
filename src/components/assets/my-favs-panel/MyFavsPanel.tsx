import dayjs from "dayjs";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Else, If, Then } from "react-if";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import { Transition } from "react-transition-group";
import styled from "styled-components";

import { FavEntity } from "../../../../generated-graphql/graphql";
import { UserInfo } from "../../../../generated-subgraph/graphql";
import chevronSrc from "../../../assets/images/chevron.svg";
import favPlaceholderSrc from "../../../assets/images/person-placeholder.svg";
import emptyWatchlistSrc from "../../../assets/images/star.svg";
import { useAppSelector } from "../../../core/hooks/rtkHooks";
import {
  extractFavStatisticsInfo,
  getColorOfValue
} from "../../../core/util/base.util";
import { favPath, stocksPath } from "../../../core/util/pathBuilder.util";
import { Unit, formatNumber } from "../../../core/util/string.util";
import BorderedButton from "../../button/bordered-button/BorderedButton";
import ResponsiveImage from "../../image/responsive-image/ResponsiveImage";
import Loader from "../../loader/Loader";
import "./my-favs-panel.scss";
import Match from "./watch-list-matches/Match";
import { useWatchResize } from "../../../core/hooks/useWatchResize";

const MyFavsRow = (props: {
  fav: FavEntity | null;
  shares: number;
  price: number;
  priceDelta: number;
  isIpo: boolean;
}) => {
  const { fav, shares, price, priceDelta, isIpo } = props;

  return (
    <Link to={favPath(fav?.title as string)} className="my-favs-row">
      <div className="image-container">
        <ResponsiveImage
          images={[{ key: "default", image: fav?.iconImage || "" }]}
          defaultImg={favPlaceholderSrc}
        />
      </div>
      <div className="name-amount-section">
        <div
          className="fav-name"
          style={{ display: "flex", alignItems: "end" }}
        >
          <FavName>{fav?.displayName}</FavName>
          {shares != undefined && <span className="fav-coin">{fav?.coin}</span>}
        </div>
        <div className="shares-amount">
          {shares == undefined ? (
            <span className="fav-coin">{fav?.coin}</span>
          ) : (
            <FormattedMessage
              defaultMessage="{shares} {shares, select, 1 {{ipoText} share} other {{ipoText} shares}}"
              values={{
                shares: formatNumber({
                  value: shares,
                  unit: Unit.SHARE,
                  summarize: true
                }),
                ipoText: isIpo ? "IPO" : ""
              }}
            />
          )}
        </div>
      </div>
      <div className="price" style={{ textAlign: "right" }}>
        <div className="current-price">
          {formatNumber({
            value: price,
            unit: Unit.USDC,
            summarize: false,
            withUnit: true
          })}
        </div>
        <div className={`delta-price ${getColorOfValue(priceDelta)}`}>
          {formatNumber({
            value: priceDelta,
            unit: Unit.USDC,
            summarize: true,
            withSign: true,
            withUnit: true
          })}
        </div>
      </div>
    </Link>
  );
};

const FavName = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  display: -webkit-box;
  word-break: break-word;
`;

type SharesByFavId = {
  [favId: string]: number;
};
const MyFavsPanel = (props: {
  loadingUserInfo: boolean;
  userInfo: UserInfo | undefined;
  userInfo24: UserInfo | undefined;
  historyFavIds: number[];
}) => {
  const { loadingUserInfo, userInfo, userInfo24, historyFavIds } = props;

  const { windowWidth } = useWatchResize();
  
  const {
    loadingFavs,
    favsById,
    watchlistFavIds,
    loadingMultiFavsInfo,
    multiFavsInfo
  } = useAppSelector((state) => state.favs);
  const { fanMatchesList, liveMatchResults, loadingFanMatchesList } =
    useAppSelector((state) => state.fanMatch);

  const watchlistedFanMatches = fanMatchesList.filter(
    (fanMatch) => fanMatch?.isLike
  );

  const watchlistContainerRef = useRef<HTMLDivElement | null>(null);
  const matchesContainerRef = useRef<HTMLDivElement | null>(null);
  const loading = loadingUserInfo || loadingFavs || loadingMultiFavsInfo;

  const [sharesByFavId, setSharesByFavId] = useState<SharesByFavId>({});
  const [myFavIds, setMyFavIds] = useState<number[]>([]);
  const [watchlistExpanded, setWatchlistExpanded] = useState(false);
  const [matchesExpanded, setMatchesExpanded] = useState(
    window.innerWidth > 660
  );

  const trueWatchlistFavIds = useMemo(() => {
    return watchlistFavIds;
  }, [watchlistFavIds]);

  // const endedFirstFavId = fanMatchesList[0]?.leftFav.id;
  // const endedSecondFavId = fanMatchesList[0]?.rightFav.id;

  // const endedFirstFavInfo = userInfo?.shareAssets.find((firstfav) => {
  //   return Number(firstfav.favInfo.id) === endedFirstFavId;
  // });

  // const endedSecondFavInfo = userInfo?.shareAssets.find((secondfav) => {
  //   return Number(secondfav.favInfo.id) === endedSecondFavId;
  // });

  // const myFav =
  //   (endedFirstFavInfo?.amount || 1) > (endedSecondFavInfo?.amount || 1)
  //     ? "first"
  //     : "second";

  // const matchResult =
  //   myFav === "first"
  //     ? endedMatchResult[0] > endedMatchResult[1]
  //       ? "Congrates, " +
  //         (favsInfo[
  //           (fanMatchesList[0]?.leftFav.id || 1) - 1
  //         ]?.displayName?.split(" ")[1] || "Left Favorite") +
  //         " Won!"
  //       : "Oh no, " +
  //         (favsInfo[
  //           (fanMatchesList[0]?.leftFav.id || 1) - 1
  //         ]?.displayName?.split(" ")[1] || "Left Favorite") +
  //         " Lost!"
  //     : endedMatchResult[0] > endedMatchResult[1]
  //       ? "Oh no, " +
  //       (favsInfo[
  //         (fanMatchesList[0]?.rightFav.id || 1) - 1
  //       ]?.displayName?.split(" ")[1] || "Right Favorite") +
  //       " Lost!"
  //       : "Congrates, " +
  //       (favsInfo[
  //         (fanMatchesList[0]?.rightFav.id || 1) - 1
  //       ]?.displayName?.split(" ")[1] || "Right Favorite") +
  //       " Won!";

  useEffect(() => {
    if (!loadingUserInfo) {
      const _sharesByFavId: SharesByFavId = {};
      userInfo?.shareAssets?.map((shareAsset) => {
        const key = shareAsset.favInfo.id;
        const shares = shareAsset.amount;

        _sharesByFavId[key] = shares;
      });

      setSharesByFavId(_sharesByFavId);
      const availableFavIds = historyFavIds.filter(
        (o) => _sharesByFavId[o.toString()] > 0
      );
      setMyFavIds(availableFavIds);
    }
  }, [userInfo, userInfo24, favsById, loadingUserInfo]);

  useEffect(() => {
    if (watchlistContainerRef.current) {
      
      const maxHeight = watchlistExpanded
        ? watchlistContainerRef.current.scrollHeight + "px"
        : "0px";
      watchlistContainerRef.current?.style.setProperty("max-height", maxHeight);
    }
  }, [trueWatchlistFavIds, watchlistExpanded, loading]);

  useEffect(() => {
    if (matchesContainerRef.current) {
      const maxHeight = matchesExpanded
        ? matchesContainerRef.current.scrollHeight + "px"
        : "0px";
      matchesContainerRef.current?.style.setProperty("max-height", maxHeight);
    }
  }, [fanMatchesList.length, matchesExpanded]);

  useEffect(() => {
    setWatchlistExpanded(windowWidth > 660);
  }, []);

  return (
    <div className="my-favs-panel">
      <h2 className="panel-title my-favs">
        <FormattedMessage defaultMessage="My Stocks" />
      </h2>
      {loading ? (
        <Loader />
      ) : myFavIds.length === 0 ? (
        <div className="empty-section empty-myfavs-section">
          <div className="img-container">
            <img src={favPlaceholderSrc} />
          </div>
          <div className="empty-label">
            <FormattedMessage defaultMessage="Nothing Yet" />
          </div>

          <Link to={stocksPath()}>
            <button className="action-button find-favs-button">
              <FormattedMessage
                defaultMessage="Find {assetsName}"
                values={{
                  assetsName: "Stocks"
                }}
              />
            </button>
          </Link>
        </div>
      ) : (
        myFavIds.map((favId, i) => {
          const favIdString = favId.toString();
          const {
            data: favInfo,
            marketPriceDelta,
            isIPO
          } = extractFavStatisticsInfo(multiFavsInfo, favId);

          return (
            <MyFavsRow
              key={`${favId}-${i}`}
              fav={favsById[favIdString]}
              price={favInfo.marketPrice || favInfo.ipoPrice || 1}
              priceDelta={marketPriceDelta}
              shares={sharesByFavId[favIdString]}
              isIpo={isIPO}
            />
          );
        })
      )}
      <h2
        className="panel-title"
        style={{
          marginTop: 54,
          marginBottom: 0
        }}
      >
        <span style={{ margin: "auto 0px", fontFamily: "Poppins" }}>
          <FormattedMessage defaultMessage="Matches" />
        </span>

        {!loadingFanMatchesList && !!watchlistedFanMatches?.length && (
          <BorderedButton
            buttonProps={{
              onClick: () => setMatchesExpanded(!matchesExpanded),
              style: {
                marginLeft: "auto",
                transition: "0.3s all ease-out",
                transform: matchesExpanded ? "rotate(90deg)" : ""
              }
            }}
            iconSrc={chevronSrc}
          />
        )}
      </h2>

      {loadingFanMatchesList ? (
        <Loader wrapperStyle={{ marginTop: 32 }} />
      ) : (
        <If
          condition={
            watchlistedFanMatches.length === 0 || fanMatchesList === undefined
          }
        >
          <Then>
            <div className="empty-section empty-watchlist-section">
              <div className="img-container" style={{ opacity: 0.26 }}>
                <img src={emptyWatchlistSrc} />
              </div>
              <div className="empty-label">
                <FormattedMessage defaultMessage="Nothing Yet" />
              </div>
            </div>
          </Then>
          <Else>
            <Transition
              in={matchesExpanded}
              timeout={700}
              mountOnEnter
              unmountOnExit
            >
              <div
                className={`rows-container ${
                  matchesExpanded ? "expanded" : ""
                }`}
                ref={matchesContainerRef}
                style={{ marginBottom: 0, marginTop: "35px" }}
              >
                {/* <Match
                  key={0}
                  title={matchResult? matchResult : ""}
                  firstFav={firstFav as FavEntity}
                  secondFav={secondFav as FavEntity}
                  matchResult={endedMatchResult}
                /> */}

                {watchlistedFanMatches?.map((fanMatch, i) => {
                  const firstFav = favsById[fanMatch?.leftFav.id];
                  const secondFav = favsById[fanMatch?.rightFav.id];
                  const endDate = fanMatch
                    ? dayjs(fanMatch.expiredAt)
                    : dayjs();
                  const isLiveMatch = endDate.diff(dayjs(), "week") === 0;

                  return (
                    <Match
                      key={i + 1}
                      firstFav={firstFav as FavEntity}
                      secondFav={secondFav as FavEntity}
                      matchResult={isLiveMatch ? liveMatchResults : undefined}
                    />
                  );
                })}
              </div>
            </Transition>
          </Else>
        </If>
      )}
      <h2
        className="panel-title"
        style={{
          marginTop: 54,
          marginBottom: 0
        }}
      >
        <span style={{ margin: "auto 0px" }}>
          <FormattedMessage defaultMessage="Watchlist" />
        </span>

        {trueWatchlistFavIds.length ? (
          <BorderedButton
            buttonProps={{
              onClick: () => setWatchlistExpanded(!watchlistExpanded),
              style: {
                marginLeft: "auto",
                transition: "0.3s all ease-out",
                transform: watchlistExpanded ? "rotate(90deg)" : ""
              }
            }}
            iconSrc={chevronSrc}
          />
        ) : null}
      </h2>
      {!loading && trueWatchlistFavIds.length === 0 && (
        <div className="empty-section empty-watchlist-section">
          <div className="img-container" style={{ opacity: 0.26 }}>
            <img src={emptyWatchlistSrc} />
          </div>
          <div className="empty-label">
            <FormattedMessage defaultMessage="Nothing Yet" />
          </div>
        </div>
      )}
      {loading ? (
        <Loader wrapperStyle={{ marginTop: 32 }} />
      ) : (
        <Transition
          in={watchlistExpanded}
          timeout={700}
          mountOnEnter
          unmountOnExit
        >
          <div
            className={`rows-container ${watchlistExpanded ? "expanded" : ""}`}
            ref={watchlistContainerRef}
            style={{ marginBottom: 0 }}
          >
            {trueWatchlistFavIds.map((favId, i) => {
              const favIdString = favId.toString();
              const {
                data: favInfo,
                marketPriceDelta,
                isIPO
              } = extractFavStatisticsInfo(multiFavsInfo, favId);
              return (
                <MyFavsRow
                  key={`watchlist-${favId}-${i}`}
                  fav={favsById[favIdString]}
                  price={favInfo.marketPrice || favInfo.ipoPrice || 1}
                  priceDelta={marketPriceDelta}
                  shares={sharesByFavId[favIdString]}
                  isIpo={isIPO}
                />
              );
            })}
          </div>
        </Transition>
      )}
    </div>
  );
};

export default React.memo(MyFavsPanel);
