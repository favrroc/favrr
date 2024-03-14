import React, { useEffect, useState } from "react";
import styled from "styled-components";

import userSrc from "../../../../assets/images/user.svg";
import { RESPONSIVE } from "../../../../core/constants/responsive.const";
import { useAppDispatch, useAppSelector } from "../../../../core/hooks/rtkHooks";
import { useWatchResize } from "../../../../core/hooks/useWatchResize";
import { setNumOfLoadedRowsByGroup } from "../../../../core/store/slices/leaderboardSlice";
import { ParticipantInfo } from "../../../../core/store/slices/participantsSlice";
import ShowMoreButton from "../../../button/show-more-button/ShowMoreButton";
import FanMatchCarousel from "../../../fav/fan-match-carousel/FanMatchCarousel";
import Loader from "../../../loader/Loader";
import LeaderButton from "./LeaderButton";

interface Props {
  groupIndex: number; // 0: Global, 1 ~ 10: League
  loading: boolean;
  list: Array<ParticipantInfo>;
}

const LeaderList = (props: Props) => {
  const { groupIndex, loading, list } = props;
  const dispatch = useAppDispatch();
  const { smallerThanTablet, smallerThanXLarge } = useWatchResize();

  const { numOfLoadedRowsByGroup } = useAppSelector(state => state.leaderboard);
  const { favs } = useAppSelector(state => state.favs);
  const {
    loadingFanMatchesList,
    fanMatchesList,
    liveMatchResults
  } = useAppSelector(state => state.fanMatch);

  const [index, setIndex] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const unrankedDataList = list.slice(0, numOfLoadedRowsByGroup[groupIndex]);
  const dataList = unrankedDataList.map((participantData, index) => ({
    ...participantData,
    rank: index + 1
  }));
  const numberOfFanMatchTiles = smallerThanTablet ? 1 : smallerThanXLarge ? 2 : 3;

  useEffect(() => {
    setHasMore(numOfLoadedRowsByGroup[groupIndex] < list.length);
  }, [list, numOfLoadedRowsByGroup, groupIndex]);

  const handleShowMore = () => {
    const temp = [...numOfLoadedRowsByGroup];
    temp[groupIndex] = numOfLoadedRowsByGroup[groupIndex] + Math.min(25, list.length - numOfLoadedRowsByGroup[groupIndex]);
    dispatch(setNumOfLoadedRowsByGroup(temp));
  };

  return (
    <StyledLeaderComponent style={list.length === 0 ? {
      justifyContent: "center",
      flexDirection: "column",
      alignItems: "center",
      gap: "8px",
    } : {}}>
      {loading ? (
        <NoFans><Loader /></NoFans>
      ) : list.length === 0 ? (
        <>
          <img
            style={{ width: "160px", marginBottom: "22px" }}
            src={userSrc}
            alt="No Fans"
          />
          <NoFans>No Fans Yet</NoFans>
          <NoFansP>Explore other leagues to see their top fans.</NoFansP>
        </>
      ) : (
        <List>
          <PosRel>
            <LeadersList>
              <>
                {dataList.map((data, i) => (
                  <React.Fragment key={`fr-${i}`}>
                    {dataList.length === 2 && <div key={`empty-div-${i}`}></div>}
                    {i === 7 && (
                      <StyledFanMatchBoard key={`fan-match-board-${i}`}>
                        <FanMatchCarousel />
                      </StyledFanMatchBoard>
                    )}
                    <LeaderButton
                      key={`LeaderButton-${i}`}
                      setIndex={() => setIndex(i)}
                      data={data}
                      badge={i + 1}
                      classStyle={`${index === i ? "active" : ""} ${dataList.length <= 3 ? "limit-list" : ""}`}
                      hasMore={hasMore}
                    />
                  </React.Fragment>
                ))}
                {hasMore && (
                  <>
                    <div style={{ margin: "auto" }}>
                      <ShowMoreButton onAction={handleShowMore} />
                    </div>

                    <LeaderButton
                      key={`LeaderButton-100`}
                      setIndex={() => setIndex(dataList.length)}
                      data={dataList[dataList.length - 1]}
                      badge={dataList.length}
                      classStyle={`last-button`}
                      hasMore={hasMore}
                    />
                  </>
                )}
              </>
            </LeadersList >
          </PosRel >
        </List >
      )}
    </StyledLeaderComponent >
  );
};

const NoFans = styled.div`
  font-family: "DM Sans";
  font-style: normal;
  font-weight: 700;
  font-size: 32px;
  line-height: 40px;
  text-align: center;
  letter-spacing: -0.02em;
  color: #fcfcfd;
  @media screen and (max-width: ${RESPONSIVE.small}) {
    font-size: 24px;
  }
`;

const NoFansP = styled.div`
  font-family: "Poppins";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  text-align: center;
  color: #777e91;
`;

const PosRel = styled.div`
  position: relative;
`;

const LeadersList = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
  button {
    gap: 32px;
    @media screen and (max-width: ${RESPONSIVE.small}) {
      gap: 16px;
    }
  }
  flex-direction: row;
  gap: 0;
  flex-wrap: wrap;
  /* justify-content: space-between; */
  > * {
    order: 4;
    flex: none;
  }
  > *:nth-child(1):not(.limit-list) {
    order: 2;
    top: -32px;
    flex: 1;
  }
  > *:nth-child(2):not(.limit-list) {
    order: 1;
    flex: 1;
  }
  > *:nth-child(3):not(.limit-list) {
    order: 3;
    flex: 1;
  }
`;

const StyledLeaderComponent = styled.div`
  display: flex;
  max-width: 1120px;
  margin: auto;
  width: calc(100% - 32px);
  margin-bottom: 128px;
  @media screen and (max-width: ${RESPONSIVE.small}) {
    width: 100%;
    margin-bottom: 96px;
    width: 100%;
  }
`;

const List = styled.div`
  width: 100%;
  border-radius: 12px;
  flex: 1;
  min-height: 300px;
  padding: 4px 0 56px 0;
  z-index: 1;
  h2 {
    font-family: "Oswald";
    font-style: normal;
    font-weight: 700;
    font-size: 40px;
    line-height: 48px;
    letter-spacing: -0.02em;
    text-transform: uppercase;
    color: #fcfcfd;
    margin: 0 0 12px;
  }
  @media screen and (max-width: ${RESPONSIVE.small}) {
    background: none;
    box-shadow: none;
    padding: 0;
  }
`;

const StyledFanMatchBoard = styled.div`
  width:100%;
  margin-top: 56px;
  margin-bottom: 56px;
`;

export default LeaderList;
