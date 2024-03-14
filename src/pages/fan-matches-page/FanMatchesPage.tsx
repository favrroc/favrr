import dayjs from "dayjs";
import React from "react";
import { Else, If, Then } from "react-if";
import styled from "styled-components";

import { ReactComponent as MedalIcon } from "../../assets/images/medal.svg";
import { ReactComponent as ShareIcoon } from "../../assets/images/utility-icons/share.svg";
import LiveBadge from "../../components/badge/LiveBadge";
import LikeButton2 from "../../components/button/like-button/LikeButton2";
import FanMatchTile from "../../components/fav/fan-match-carousel/fan-match-tile/FanMatchTile";
import GetUpdateModule from "../../components/get-update-module/GetUpdateModule";
import PageGridLayout from "../../components/layout/PageGridLayout";
import Loader from "../../components/loader/Loader";
import { DEFAULT_IPO_AVAILABLE_SHARES } from "../../core/constants/base.const";
import { RESPONSIVE } from "../../core/constants/responsive.const";
import { colors } from "../../core/constants/styleguide.const";
import { useAppDispatch, useAppSelector } from "../../core/hooks/rtkHooks";
import { useAuthentication } from "../../core/hooks/useAuthentication";
import { useWatchResize } from "../../core/hooks/useWatchResize";
import { toggleFanMatchLikesInfo } from "../../core/store/slices/fanMatchSlice";
import {
  setShowShareFanMatchModalAction
} from "../../core/store/slices/modalSlice";
import { pixelToNumber } from "../../core/util/string.util";
import BasePage from "../base-page/BasePage";
import FanMatchStatusBar from "./resources/FanMatchStatusBar";
import { FanMatchStatsCategory } from "./resources/constants";

const FanMatchesPage = () => {
  const dispatch = useAppDispatch();
  const { checkAuthentication } = useAuthentication();
  const { smallerThanTablet } = useWatchResize();
  const { favsById } = useAppSelector((state) => state.favs);
  const { participantsData } = useAppSelector((state) => state.participants);
  const {
    loadingFanMatchesList,
    fanMatchesList,
    liveMatchResults,
    loadingFanMatchStatsData,
    statsData
  } = useAppSelector((state) => state.fanMatch);
  const { isLoggedIn } = useAppSelector((state) => state.user);

  const numberOfTotalFans = participantsData.length;
  const isLoadingStats = loadingFanMatchStatsData;
  const statsSectionHeight = smallerThanTablet ? 536 : 728;
  const defaultLiveMatchDate = dayjs().add(1, "week");
  const defaultNextMatchDate = dayjs().add(2, "week");
  const isThereLiveMatch =
    fanMatchesList &&
    (dayjs(fanMatchesList[0]?.expiredAt).diff(dayjs(), "week") === 0
      ? true
      : false);

  const showShareFanMatchModal = () => {
    dispatch(
      setShowShareFanMatchModalAction({
        showModal: true,
        props: {
          fanMatchId: String(fanMatchesList[0].id),
          url: location.href,
          shareTitle: "Oceana Match: " + fanMatchesList[0].title
        }
      })
    );
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    if (checkAuthentication()) {
      dispatch(
        toggleFanMatchLikesInfo({ fanMatchId: String(fanMatchesList[0].id) })
      );
    }
  };

  return (
    <BasePage
      contentStyle={{
        boxSizing: "border-box",
        width: "100%",
        alignItems: "center",
        padding: "0px"
      }}
    >
      <HeroBanner>
        <p
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center"
          }}
        >
          <span>{`SCORE BIG PRIZES BY HELPING YOUR`}</span>&nbsp;
          <span>{`FAVES WIN!`}</span>
        </p>
        <h1>FAN MATCHES</h1>
      </HeroBanner>
      <PageGridLayout
        leftSide={
          <>
            <StyledTodayMatch>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "12px",
                  position: "relative"
                }}
              >
                <StyledH1>
                  {isThereLiveMatch ? `TODAY'S MATCH` : `NEXT MATCH`}
                </StyledH1>
                {isThereLiveMatch && <LiveBadge isOnLandingPage={true} />}

                <ShareButton onClick={showShareFanMatchModal}>
                  <ShareIcoon />
                </ShareButton>
                {!smallerThanTablet &&
                  !(
                    (loadingFanMatchesList && !fanMatchesList[0]?.id) ||
                    isLoadingStats
                  ) && (
                  <StyledLikeButton
                    isActive={fanMatchesList[0]?.isLike}
                    onClick={handleClick}
                    fromTop={12}
                    fromRight={40}
                    isOnLandingPage={true}
                  />
                )}
              </div>
              <StyledP>{`The battle begins: Boost your idol's stats to claim victory!`}</StyledP>
              <div style={{ marginTop: "32px" }}>
                <FanMatchTile
                  isLoading={
                    (loadingFanMatchesList && !fanMatchesList[0]?.id) ||
                    isLoadingStats
                  }
                  title={fanMatchesList[0]?.title || ""}
                  firstFav={favsById[fanMatchesList[0]?.leftFav.id]}
                  secondFav={favsById[fanMatchesList[0]?.rightFav.id]}
                  liveFanMatchResults={
                    isThereLiveMatch ? liveMatchResults : undefined
                  }
                  endDate={dayjs(
                    fanMatchesList[0]?.expiredAt || defaultLiveMatchDate
                  ).toDate()}
                  isLiveMatch={true}
                  isOnFanMatchesPage={true}
                  fanMatchId={fanMatchesList[0]?.id || ""}
                  isLike={Boolean(fanMatchesList[0]?.isLike)}
                  isSharing={false}
                />
              </div>
            </StyledTodayMatch>
            <StyledMatchStatus>
              <StyledFanMatchSatsTitleSeciton>
                <MedalIcon />
                <StyledMatchStatusTitle>{`MATCH STATS`}</StyledMatchStatusTitle>
                <StyledUSDCLabel>{`(USDC)`}</StyledUSDCLabel>
              </StyledFanMatchSatsTitleSeciton>
              <If
                condition={
                  (loadingFanMatchesList && !fanMatchesList[0]?.id) ||
                  isLoadingStats
                }
              >
                <Then>
                  <Loader
                    wrapperStyle={{ height: `${statsSectionHeight}px` }}
                  />
                </Then>
                <Else>
                  <>
                    <FanMatchStatusBar
                      category={FanMatchStatsCategory.Investors}
                      firstFavScore={statsData.first.numberOfInvestors || 0}
                      secondFavScore={statsData.second.numberOfInvestors || 0}
                      maxScore={numberOfTotalFans}
                      showDecimals={false}
                      isThereLiveMatch={isThereLiveMatch}
                    />
                    <FanMatchStatusBar
                      category={FanMatchStatsCategory.Fans}
                      firstFavScore={statsData.first.numberOfFans || 0}
                      secondFavScore={statsData.second.numberOfFans || 0}
                      maxScore={numberOfTotalFans}
                      showDecimals={false}
                      isThereLiveMatch={isThereLiveMatch}
                    />
                    <FanMatchStatusBar
                      category={FanMatchStatsCategory.PPS}
                      firstFavScore={statsData.first.pps || 1}
                      secondFavScore={statsData.second.pps || 1}
                      maxScore={
                        Math.max(
                          statsData.first.pps || 1,
                          statsData.second.pps || 1
                        ) * 1.5
                      }
                      showDecimals={true}
                      isThereLiveMatch={isThereLiveMatch}
                    />
                    <FanMatchStatusBar
                      category={FanMatchStatsCategory.MarketCap}
                      firstFavScore={
                        statsData.first.marketCap ||
                        DEFAULT_IPO_AVAILABLE_SHARES
                      }
                      secondFavScore={
                        statsData.second.marketCap ||
                        DEFAULT_IPO_AVAILABLE_SHARES
                      }
                      maxScore={
                        Math.max(
                          statsData.first.marketCap ||
                          DEFAULT_IPO_AVAILABLE_SHARES,
                          statsData.second.marketCap ||
                          DEFAULT_IPO_AVAILABLE_SHARES
                        ) * 1.5
                      }
                      showDecimals={false}
                      isThereLiveMatch={isThereLiveMatch}
                    />
                    <FanMatchStatusBar
                      category={FanMatchStatsCategory.DeltaPPS}
                      firstFavScore={statsData.first.delta || 0}
                      secondFavScore={statsData.second.delta || 0}
                      maxScore={
                        Math.max(
                          statsData.first.delta || 0,
                          statsData.second.delta || 0
                        ) * 1.5
                      }
                      showDecimals={true}
                      isThereLiveMatch={isThereLiveMatch}
                    />
                    <FanMatchStatusBar
                      category={FanMatchStatsCategory.ShareVolumn}
                      firstFavScore={statsData.first.shareVolume || 0}
                      secondFavScore={statsData.second.shareVolume || 0}
                      maxScore={
                        Math.max(
                          statsData.first.shareVolume || 0,
                          statsData.second.shareVolume || 0
                        ) * 1.5
                      }
                      showDecimals={false}
                      isThereLiveMatch={isThereLiveMatch}
                    />
                    <FanMatchStatusBar
                      category={FanMatchStatsCategory.USDCVolumn}
                      firstFavScore={statsData.first.usdcVolume || 0}
                      secondFavScore={statsData.second.usdcVolume || 0}
                      maxScore={
                        Math.max(
                          statsData.first.usdcVolume || 0,
                          statsData.second.usdcVolume || 0
                        ) * 1.5
                      }
                      showDecimals={true}
                      isThereLiveMatch={isThereLiveMatch}
                    />
                    <FanMatchStatusBar
                      category={FanMatchStatsCategory.Equity}
                      firstFavScore={
                        statsData.first.equity || DEFAULT_IPO_AVAILABLE_SHARES
                      }
                      secondFavScore={
                        statsData.second.equity || DEFAULT_IPO_AVAILABLE_SHARES
                      }
                      maxScore={
                        Math.max(
                          statsData.first.equity ||
                          DEFAULT_IPO_AVAILABLE_SHARES,
                          statsData.second.equity ||
                          DEFAULT_IPO_AVAILABLE_SHARES
                        ) * 1.5
                      }
                      showDecimals={true}
                      isThereLiveMatch={isThereLiveMatch}
                    />
                    <FanMatchStatusBar
                      category={FanMatchStatsCategory.TodaysReturn}
                      firstFavScore={statsData.first.todaysReturn || 0}
                      secondFavScore={statsData.second.todaysReturn || 0}
                      maxScore={
                        Math.max(
                          statsData.first.todaysReturn || 1,
                          statsData.second.todaysReturn || 1
                        ) * 1.5
                      }
                      showDecimals={true}
                      isThereLiveMatch={isThereLiveMatch}
                    />
                    <FanMatchStatusBar
                      category={FanMatchStatsCategory.TotalReturn}
                      firstFavScore={statsData.first.totalReturn || 0}
                      secondFavScore={statsData.second.totalReturn || 0}
                      maxScore={
                        Math.max(
                          statsData.first.totalReturn || 0,
                          statsData.second.totalReturn || 0
                        ) * 1.5
                      }
                      showDecimals={true}
                      isThereLiveMatch={isThereLiveMatch}
                    />
                  </>
                </Else>
              </If>
            </StyledMatchStatus>
          </>
        }
        rightSide={
          <>
            <StyledNextMatches>
              <StyledNextMatchesTitle>{`NEXT MATCHES`}</StyledNextMatchesTitle>
              <StyledNextMatchesGroupTwo>
                <FanMatchTile
                  isLoading={loadingFanMatchesList}
                  title={fanMatchesList[1]?.title || ""}
                  firstFav={favsById[fanMatchesList[1]?.leftFav.id]}
                  secondFav={favsById[fanMatchesList[1]?.rightFav.id]}
                  endDate={dayjs(
                    fanMatchesList[1]?.expiredAt || defaultNextMatchDate
                  ).toDate()}
                  isLiveMatch={false}
                  isOnFanMatchesPage={true}
                  fanMatchId={fanMatchesList[1]?.id || ""}
                  isLike={Boolean(fanMatchesList[1]?.isLike)}
                  isSharing={false}
                />
                <FanMatchTile
                  isLoading={loadingFanMatchesList}
                  title={fanMatchesList[2]?.title || ""}
                  firstFav={favsById[fanMatchesList[2]?.leftFav.id]}
                  secondFav={favsById[fanMatchesList[2]?.rightFav.id]}
                  endDate={dayjs(
                    fanMatchesList[2]?.expiredAt || defaultNextMatchDate
                  ).toDate()}
                  isLiveMatch={false}
                  isOnFanMatchesPage={true}
                  fanMatchId={fanMatchesList[2]?.id || ""}
                  isLike={Boolean(fanMatchesList[2]?.isLike)}
                  isSharing={false}
                />
              </StyledNextMatchesGroupTwo>

              <StyledNextMatchesGroupTwo>
                <FanMatchTile
                  isLoading={loadingFanMatchesList}
                  title={fanMatchesList[3]?.title || ""}
                  firstFav={favsById[fanMatchesList[3]?.leftFav.id]}
                  secondFav={favsById[fanMatchesList[3]?.rightFav.id]}
                  endDate={dayjs(
                    fanMatchesList[3]?.expiredAt || defaultNextMatchDate
                  ).toDate()}
                  isLiveMatch={false}
                  isOnFanMatchesPage={true}
                  fanMatchId={fanMatchesList[3]?.id || ""}
                  isLike={Boolean(fanMatchesList[3]?.isLike)}
                  isSharing={false}
                />
                <FanMatchTile
                  isLoading={loadingFanMatchesList}
                  title={fanMatchesList[4]?.title || ""}
                  firstFav={favsById[fanMatchesList[4]?.leftFav.id]}
                  secondFav={favsById[fanMatchesList[4]?.rightFav.id]}
                  endDate={dayjs(
                    fanMatchesList[4]?.expiredAt || defaultNextMatchDate
                  ).toDate()}
                  isLiveMatch={false}
                  isOnFanMatchesPage={true}
                  fanMatchId={fanMatchesList[4]?.id || ""}
                  isLike={Boolean(fanMatchesList[4]?.isLike)}
                  isSharing={false}
                />
              </StyledNextMatchesGroupTwo>

              <div style={{ marginTop: "16px", width: "100%" }}>
                <GetUpdateModule isOnFanMatchesPage={true} />
              </div>
            </StyledNextMatches>
          </>
        }
      />
    </BasePage>
  );
};

const HeroBanner = styled.div`
  width: 100%;
  padding: 56px 0px;
  border-bottom: solid 1px ${colors.neutrals3};
  h1 {
    font-family: "Oswald";
    font-style: normal;
    font-weight: 700;
    font-size: 32px;
    line-height: 40px;
    text-align: center;
    letter-spacing: -0.02em;
    color: ${colors.neutrals8};
    margin: 0;
  }
  p {
    padding: 0;
    margin: 0;
    font-family: "Poppins";
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 24px;
    text-align: center;
    color: ${colors.neutrals4};
  }
  @media screen and (min-width: ${pixelToNumber(RESPONSIVE.mobile) + 1}px) {
    h1 {
      font-size: 48px;
      line-height: 56px;
    }
    padding: 48px 0px;
  }
  @media screen and (min-width: ${RESPONSIVE.large}) {
    padding: 56px 0px;
  }
  @media screen and (min-width: ${RESPONSIVE.xLarge}) {
    padding: 72px 0px;
  }
`;

const StyledTodayMatch = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
const StyledNextMatches = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
const StyledMatchStatus = styled.div`
  width: 100%;
`;

const StyledH1 = styled.h1`
  font-family: "Oswald";
  font-style: normal;
  font-weight: 700;
  font-size: 40px;
  line-height: 56px;
  letter-spacing: -0.02em;
  color: ${colors.neutrals8};
  margin: 0;
  @media screen and (max-width: ${RESPONSIVE.mobile}) {
    font-size: 32px;
  }
`;

const StyledMatchStatusTitle = styled.h1`
  font-family: "Oswald";
  font-style: normal;
  font-weight: 700;
  font-size: 32px;
  line-height: 40px;
  letter-spacing: -0.02em;
  color: ${colors.neutrals8};
  @media screen and (max-width: ${RESPONSIVE.mobile}) {
    font-size: 24px;
    line-height: 32px;
    font-weight: 600;
  }
`;

const StyledNextMatchesTitle = styled.h1`
  font-family: "Oswald";
  font-style: normal;
  font-weight: 700;
  font-size: 32px;
  line-height: 40px;
  letter-spacing: -0.02em;
  color: ${colors.neutrals8};
  margin-bottom: 16px;
  @media screen and (max-width: ${RESPONSIVE.mobile}) {
    font-size: 24px;
    font-weight: 600;
  }
`;

const StyledP = styled.p`
  padding: 0;
  margin: 0;
  font-family: "Poppins";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: ${colors.neutrals4};
`;

const StyledNextMatchesGroupTwo = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 32px;
  margin: 16px 0px 16px 0px;
  @media screen and (min-width: ${RESPONSIVE.tablet}) {
    margin: 16px 0px;
  }
  @media screen and (min-width: ${RESPONSIVE.medium}) {
    flex-direction: row;
  }
  @media screen and (min-width: ${pixelToNumber(RESPONSIVE.large) + 1}px) {
    flex-direction: column;
  }
`;

const StyledLikeButton = styled(LikeButton2)`
  background-color: red;
`;

const StyledUSDCLabel = styled.span`
  font-family: "Poppins";
  font-size: 14px;
  color: ${colors.neutrals4};
  @media screen and (min-width: ${RESPONSIVE.large}) {
    font-size: 16px;
  }
`;

const StyledFanMatchSatsTitleSeciton = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 96px 0px 44px 0px;
  gap: 12px;
  @media screen and (min-width: ${pixelToNumber(RESPONSIVE.mobile) + 1}px) {
    margin: 80px 0px 52px 0px;
  }
`;

const ShareButton = styled.button`
  position: absolute;
  width: 32px;
  height: 32px;
  top: 12px;
  right: 2px;
  border-radius: 40px;
  box-shadow: inset 0 0 0 2px #353945;
  background-size: 20px;
  background-position: center;
  background-repeat: no-repeat;
  &:hover {
    box-shadow: inset 0 0 0 2px #fcfcfd;
    filter: brightness(2);
  }
`;

export default FanMatchesPage;
