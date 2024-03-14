import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

import BasePage from "../base-page/BasePage";
// import NewsList from "../../components/news/news-list/NewsList";
import InfiniteScroll from "react-infinite-scroll-component";
import { UserEntity } from "../../../generated-graphql/graphql";
import { ApolloActionType, apolloClient, ClientType } from "../../core/clients/apolloClient";
import FavTile from "../../components/fav/fav-tile/FavTile";
import EmptyState from "../../components/portfolio/children/EmptyState";
import FollowTab from "../../components/portfolio/FollowTab";
import UserModule from "../../components/portfolio/User-Module";
import { Block, ButtonSecondarySmall, Flex } from "../../components/styleguide/styleguide";
import { generateFindFollowersQuery, generateFindFollowingsQuery } from "../../core/graphql-queries/backend-queries/follow.query";
import { useAppSelector } from "../../core/hooks/rtkHooks";
import { EmptyStateTypes } from "../../core/interfaces/emptystate.type";
import { ParticipantInfo } from "../../core/store/slices/participantsSlice";
import { extractFavStatisticsInfo } from "../../core/util/base.util";
import "./public-profile-page.scss";
import { notFoundPath } from "../../core/util/pathBuilder.util";
import Loader from "../../components/loader/Loader";

const PublicProfilePage = () => {
  const { username } = useParams<{ username: string; }>();
  const navigate = useNavigate();

  const {
    favsById,
    multiFavsInfo,
    topFavs
  } = useAppSelector(state => state.favs);
  const { loadingParticipantsData, participantsData } = useAppSelector(state => state.participants);

  // tab indicator
  const [currentTab, setCurrentTab] = useState<number>(0);

  // number of stocks to show
  const [stocksCountPosition, setStocksCountPosition] = useState<number>(12);

  // find user data from participantsData
  const user = useMemo(() => {
    if (!loadingParticipantsData && participantsData) {
      const filtered = participantsData.filter(data => data.profile.fullName === username || data.profile.address === username).at(0);
      if (filtered) {
        return filtered;
      }
      else {
        navigate(notFoundPath());
      }
    }
  }, [username, loadingParticipantsData, participantsData]);

  // following & followers data
  const [followings, setFollowings] = useState<ParticipantInfo[]>([]);
  const [followers, setFollowers] = useState<ParticipantInfo[]>([]);

  useEffect(() => {
    const userAddress = user?.profile.address;
    if (userAddress && !loadingParticipantsData && participantsData) {
      apolloClient(ClientType.GRAPHQL, ApolloActionType.QUERY, generateFindFollowingsQuery(userAddress))
        .then(response => {
          const followingsAddresses = (response.findFollowings as UserEntity[]).map(r => r.address);
          setFollowings(participantsData.filter(d => followingsAddresses.includes(d.profile.address)));
        });

      apolloClient(ClientType.GRAPHQL, ApolloActionType.QUERY, generateFindFollowersQuery(userAddress))
        .then(response => {
          const followersAddresses = (response.findFollowers as UserEntity[]).map(r => r.address);
          setFollowers(participantsData.filter(d => followersAddresses.includes(d.profile.address)));
        });
    }
  }, [user?.profile.address, loadingParticipantsData, participantsData]);

  // handle click 'load more stocks' button
  const loadMoreStocks = () => setStocksCountPosition(stocksCountPosition + 12);

  if (loadingParticipantsData) {
    return (
      <BasePage
        className="public-profile-page"
        contentStyle={{
          boxSizing: "border-box", width: "100%", padding: 0, justifyContent: "center",
          alignItems: "center",
          display: "flex"
        }}
      >
        <Loader />
      </BasePage>
    );
  }

  if (!(loadingParticipantsData || user)) {
    return (
      <BasePage
        className="public-profile-page"
        contentStyle={{
          boxSizing: "border-box", width: "100%", padding: 0, justifyContent: "center",
          alignItems: "center",
          display: "flex"
        }}
      ><h1>User not found.</h1></BasePage>);
  }

  const loadMore = () => null;

  return (
    <BasePage
      className="public-profile-page"
      contentStyle={{ boxSizing: "border-box", width: "100%", padding: 0 }}
    >
      <Banner coverimg={user?.profile?.bannerImageUrl || ""}>
        <BannerInner />
      </Banner>
      <StyledFlex>
        <Left>
          {user && <UserModule user={user} />}
        </Left>
        <Right>
          <Tabs>
            <Tab className={`${currentTab === 0 ? "active" : ""}`} onClick={() => setCurrentTab(0)}>Portfolio</Tab>
            <Tab className={`${currentTab === 1 ? "active" : ""}`} onClick={() => setCurrentTab(1)}>Following</Tab>
            <Tab className={`${currentTab === 2 ? "active" : ""}`} onClick={() => setCurrentTab(2)}>Followers</Tab>
          </Tabs>
          <TabBlocks>
            {currentTab === 0 && <Block>
              {user?.stocksIdList.length === 0 ? (
                <EmptyState public={true} variant={EmptyStateTypes.TrendData} />
              ) : (
                <div className="padding-container max-width-1120">
                  <InfiniteScroll
                    className="explore-cards-container"
                    dataLength={user?.stocksIdList.length as number}
                    hasMore={false}
                    loader={
                      <span className="initial-loader">
                        <Loader />
                      </span>
                    }
                    next={loadMore}
                  >
                    {user?.stocksIdList?.slice(0, stocksCountPosition)?.map((favId, i) => {
                      const favIdString = favId?.toString();
                      const {
                        data: favInfo,
                        isIPO,
                        marketPriceDeltaForWeek,
                        marketPriceDeltaPercentForWeek,
                      } = extractFavStatisticsInfo(multiFavsInfo, Number(favIdString) as number);
                      return (
                        <FavTile
                          key={favIdString || i}
                          fav={favsById[favIdString]}
                          favInfo={favInfo}
                          isIPO={isIPO}
                          isTop10={topFavs?.slice(0, 10).find(t => t.id === Number(favIdString) as number)}
                          marketPriceDeltaForWeek={marketPriceDeltaForWeek}
                          marketPriceDeltaPercentForWeek={marketPriceDeltaPercentForWeek}
                        />
                      );
                    })}
                  </InfiniteScroll>

                  {/* Load More Button */}
                  {user && stocksCountPosition < user?.stocksIdList.length && (
                    <ButtonSecondarySmall
                      style={{ margin: "50px auto 80px", padding: "0 16px" }}
                      onClick={loadMoreStocks}
                    >
                      More
                    </ButtonSecondarySmall>
                  )}
                </div>
              )}
            </Block>}

            {currentTab === 1 && (
              <Block>
                <FollowTab
                  isFollowingTab={true}
                  data={followings}
                  public={true}
                />
              </Block>
            )}

            {currentTab === 2 && <Block>
              <FollowTab
                isFollowingTab={false}
                data={followers}
                public={true}
              />
            </Block>}

          </TabBlocks>
        </Right>
      </StyledFlex>
    </BasePage>
  );
};

const Tabs = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 12px;
  position: sticky;
  top: 82px;
  padding: 16px 0;
  background: #1F2128;
  z-index: 2;
  margin-bottom: 32px;
  &::-webkit-scrollbar {
    display: none;
  }
`;
const Tab = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 6px 12px;
  gap: 10px;
  height: 28px;
  border-radius: 100px;
  background: none;

  font-family: 'DM Sans';
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 16px;
  display: flex;
  align-items: center;
  color: #777E91;
  &:hover {
    color: #FCFCFD;
  }
  &.active {
    color: #23262F;
    background: #E6E8EC;
  }
`;
const TabBlocks = styled.div`
  margin-bottom: 250px;
  @media screen and (max-width: 576px) {
    margin-bottom: 64px;
  }
`;

const Banner = styled.div`
  height: 326px;
  display: flex;
  justify-content: center;
  padding-bottom: 32px;
  background: #15171C url(${(props: { coverimg: string; }) => props.coverimg}) no-repeat center;
  background-size: cover;
  @media screen and (max-width: 1024px) {
    height: 297px;
  }
  @media screen and (max-width: 576px) {
    height: 271px;
  }
`;

const BannerInner = styled.div`
  padding-top: 0;
  padding-left: 76px;
  padding-right: 76px;
  max-width: 1120px;
  width: 100%;
  align-items: end;
  justify-content: end;
  display: flex;
  @media (max-width: 1023px) {
    padding-left: 76px;
    padding-right: 76px;
  }
  @media (max-width: 767px) {
    padding-left: 24px;
    padding-right: 24px;
  }
  @media (max-width: 375px) {
    padding-left: 24px;
    padding-right: 24px;
  }
  @media (max-width: 320px) {
    padding-left: 4px;
    padding-right: 4px;
  }
`;

const StyledFlex = styled(Flex)`
  gap: 48px;
  padding-top: 67px;
  padding-left: 76px;
  padding-right: 76px;
  max-width: 1120px;
  margin: auto;

  display: grid;
  grid-template-columns: 256px 1fr;
  grid-template-rows: auto 1fr;
  column-gap: 64px;

  @media (max-width: 1024px) {
    column-gap: 48px;
  }
  @media (max-width: 1023px) {
    padding-left: 76px;
    padding-right: 76px;
  }
  @media (max-width: 850px) {
    grid-template-columns: 200px 1fr;
  }
  @media (max-width: 767px) {
    padding-left: 24px;
    padding-right: 24px;
  }
  @media (max-width: 576px) {
    flex-direction: column;
    grid-template-columns: 1fr;
  }
  @media (max-width: 375px) {
    padding-left: 24px;
    padding-right: 24px;
  }
  @media (max-width: 320px) {
    padding-left: 4px;
    padding-right: 4px;
  }
`;

const Left = styled.div`
  flex: 0 0 256px;
`;
const Right = styled.div`
  flex: 1;
  min-width: 0;
`;

export default PublicProfilePage;
