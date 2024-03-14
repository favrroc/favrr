import dayjs from "dayjs";
import React from "react";
import { Else, If, Then } from "react-if";
import styled from "styled-components";

import { FavEntity } from "../../../../../generated-graphql/graphql";
import { colors } from "../../../../core/constants/styleguide.const";
import { useWatchResize } from "../../../../core/hooks/useWatchResize";
import { fanMatchPath } from "../../../../core/util/pathBuilder.util";
import { OceanaCoinIconImage } from "../../../assets/app-images/AppImages";
import Loader from "../../../loader/Loader";
import CountDownInMatches from "../../../time/count-down/CountDownInMatches";
import FanMatchLikeButton from "./children/FanMatchLikeButton";
import FavAvatar from "./children/FavAvatar";
import FavCoin from "./children/FavCoin";
import FavTitle from "./children/FavTitle";
import MatchTitle from "./children/MatchTitle";
import MatchWeek from "./children/MatchWeek";

const bgColorByWeek: {
  [weekNumber: number]: string;
} = {
  1: colors.primaryGreen,
  2: colors.primaryBlue,
  3: colors.primaryPurple,
  4: colors.primaryPink,
  5: colors.accentTan
};

interface IFanMatchTileProps {
  isLoading: boolean;
  title: string;
  firstFav: FavEntity;
  secondFav: FavEntity;
  endDate: Date;
  isLiveMatch: boolean;
  isOnFanMatchesPage: boolean;
  liveFanMatchResults?: [number, number];
  fanMatchId: string;
  isLike?: boolean;
  isSharing?: boolean;
}

const FanMatchTile = (props: IFanMatchTileProps) => {
  const {
    isLoading,
    title,
    firstFav,
    secondFav,
    endDate,
    isLiveMatch,
    isOnFanMatchesPage,
    liveFanMatchResults,
    fanMatchId,
    isLike,
    isSharing
  } = props;
  const { smallerThanTablet } = useWatchResize();

  const weekNumber = dayjs(endDate).diff(dayjs(), "week") + 1;
  const fanMatchTileHeight = isLiveMatch && isOnFanMatchesPage ? !smallerThanTablet? 360 : 208 : 208;

  const redirectToFanMatchPage = () => {
    if (liveFanMatchResults && isLiveMatch && !isOnFanMatchesPage) {
      window.location.href = fanMatchPath();
    }
  };

  return (
    <StyledFanMatchTile
      endDate={endDate}
      isLiveMatch={isLiveMatch}
      smallerThanTablet={smallerThanTablet}
      isOnFanMatchesPage={isOnFanMatchesPage}
      fanMatchTileHeight={fanMatchTileHeight}
      isSharing={isSharing}
      onClick={redirectToFanMatchPage}
      fanMatchId={fanMatchId}
    >
      <BoxShadow />

      {/* LikeButton */}
      {!isLoading &&
        fanMatchId &&
        !(isLiveMatch && !smallerThanTablet && isOnFanMatchesPage) &&
        !isSharing && (
        <FanMatchLikeButton
          isLiveMatch={isLiveMatch}
          fanMatchId={fanMatchId}
          isLike={!!isLike}
          isOnFanMatchesPage={isOnFanMatchesPage}
        />
      )}

      {/* Background Coin Image */}
      {(!isOnFanMatchesPage || isLiveMatch) && (
        <StyledCoinImage
          isBigCoin={isLiveMatch && !smallerThanTablet && isOnFanMatchesPage}
        >
          <OceanaCoinIconImage />
        </StyledCoinImage>
      )}

      {/* Tile Content */}
      <If condition={isLoading}>
        <Then>
          <Loader wrapperStyle={{ height: `${fanMatchTileHeight}px` }} />
        </Then>
        <Else>
          <>
            {/* Title Section */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}
            >
              <MatchTitle
                endDate={endDate}
                title={isSharing ? "Oceana Match: " + title : title}
                isLiveMatch={isLiveMatch}
                isOnFanMatchPage={isOnFanMatchesPage}
              />
              <MatchWeek
                week={`Week ${weekNumber}`}
                isLiveMatch={isLiveMatch}
                isOnFanMatchesPage={isOnFanMatchesPage}
              />
            </div>

            <StyledTable
              isLiveMatch={isLiveMatch}
              isOnFanMatchesPage={isOnFanMatchesPage}
            >
              <thead>
                <tr>
                  {/* First Fav Avatar */}
                  <th style={{ paddingBottom: isLiveMatch ? "6px" : "0px" }}>
                    <FavAvatar
                      fav={firstFav}
                      isLiveMatch={isLiveMatch}
                      isOnFanMatchesPage={isOnFanMatchesPage}
                    />
                  </th>

                  {/* Score */}
                  <th style={{ paddingBottom: isLiveMatch ? "6px" : "0px" }}>
                    <div
                      style={{
                        fontStyle: "normal",
                        fontWeight: "700",
                        textAlign: "center",
                        letterSpacing: "-0.012em",
                        fontFamily:
                          isLiveMatch || isSharing ? "Oswald" : "DM Sans",
                        fontSize:
                          isLiveMatch &&
                          isOnFanMatchesPage &&
                          !smallerThanTablet
                            ? "64px"
                            : "32px",
                        lineHeight:
                          isLiveMatch &&
                          isOnFanMatchesPage &&
                          !smallerThanTablet
                            ? "64px"
                            : "40px",
                        color:
                          !isOnFanMatchesPage && weekNumber >= 4
                            ? colors.neutrals1
                            : isOnFanMatchesPage && weekNumber >= 2
                              ? colors.neutrals4
                              : colors.neutrals8
                      }}
                    >
                      {liveFanMatchResults
                        ? `${liveFanMatchResults[0]} : ${liveFanMatchResults[1]}`
                        : "- : -"}
                    </div>
                  </th>

                  {/* Second Fav Avatar */}
                  <th style={{ paddingBottom: isLiveMatch ? "6px" : "0px" }}>
                    <FavAvatar
                      fav={secondFav}
                      isLiveMatch={isLiveMatch}
                      isOnFanMatchesPage={isOnFanMatchesPage}
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  {/* First Fav Title */}
                  <StyledTd>
                    <FavTitle
                      fav={firstFav}
                      isLiveMatch={isLiveMatch}
                      isOnFanMatchesPage={isOnFanMatchesPage}
                      endDate={endDate}
                    />
                    <FavCoin
                      fav={firstFav}
                      isLiveMatch={isLiveMatch}
                      isOnFanMatchesPage={isOnFanMatchesPage}
                    />
                  </StyledTd>

                  {/* Countdown */}
                  <td style={{ verticalAlign: "baseline" }}>
                    <CountDownInMatches
                      endDate={dayjs(endDate)}
                      isLiveMatch={isLiveMatch}
                      isOnFanMatchesPage={isOnFanMatchesPage}
                      isLiveMatchAndSmallerThanTablet={
                        isLiveMatch && smallerThanTablet
                      }
                      isSharing={isSharing as boolean}
                    />
                  </td>

                  {/* Second Fav Title */}
                  <StyledTd>
                    <FavTitle
                      fav={secondFav}
                      isLiveMatch={isLiveMatch}
                      isOnFanMatchesPage={isOnFanMatchesPage}
                      endDate={endDate}
                    />
                    <FavCoin
                      fav={secondFav}
                      isLiveMatch={isLiveMatch}
                      isOnFanMatchesPage={isOnFanMatchesPage}
                    />
                  </StyledTd>
                </tr>
              </tbody>
            </StyledTable>
          </>
        </Else>
      </If>
    </StyledFanMatchTile>
  );
};

const StyledFanMatchTile = styled.div`
  position: relative;
  background-color: ${(props: IFanMatchTileProps) => {
    const week = dayjs(props.endDate).diff(dayjs(), "week") + 1;
    return props.isOnFanMatchesPage && week > 1
      ? colors.neutrals2
      : props.fanMatchId !== undefined ||
        (props.isSharing && props.liveFanMatchResults === undefined)
        ? bgColorByWeek[week]
        : colors.neutrals2;
  }};
  gap: ${(props: IFanMatchTileProps) => {
    return props.isLiveMatch ? "8px" : props.isSharing ? "0px" : "4px";
  }};
  width: 100%;
  height: ${(props: IFanMatchTileProps & { fanMatchTileHeight: number }) =>
    props.fanMatchTileHeight + "px"};
  box-sizing: border-box;
  padding: ${(props: IFanMatchTileProps & { smallerThanTablet: boolean }) =>
    props.isLiveMatch && props.isOnFanMatchesPage && !props.smallerThanTablet
      ? "0px 24px"
      : "0px 12px"};
  border-radius: 18px;
  transition: transform 0.5s ease;
  display: flex;
  flex-direction: column;
  justify-content: center;
  &:hover {
    transform: ${(props: IFanMatchTileProps) => {
    return props.isOnFanMatchesPage ? "translateY(0px)" : "translateY(-10px)";
  }};
    cursor: ${(props: IFanMatchTileProps) => {
    return props.isOnFanMatchesPage ? "" : "pointer";
  }};
  }
`;

const StyledCoinImage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: ${(props: { isBigCoin: boolean }) => {
    return props.isBigCoin ? "315px" : "187.5px";
  }};
  height: ${(props: { isBigCoin: boolean }) => {
    return props.isBigCoin ? "315px" : "187.5px";
  }};
  display: flex;
  padding: 0px;

  svg {
    margin: auto;
    transform: translateY(-1px);
    width: 100%;
    height: 100%;
  }

  path {
    opacity: 0.06;
    fill: ${colors.neutrals8};
  }
`;

const BoxShadow = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  height: 100%;
  width: 70%;
  box-shadow: 0px 29px 13.222px -25.778px rgba(19, 20, 24, 0.6);
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  th {
    /* padding-bottom: ${(props: {
      isLiveMatch: boolean;
      isOnFanMatchesPage: boolean;
    }) => {
    return props.isLiveMatch && props.isOnFanMatchesPage ? "20px" : "0px";
  }}; */
  }
  th,
  td {
    text-align: center;
    a {
      display: block;
      margin: auto;
    }
  }
  tr {
    width: 100%;
  }
  tr:nth-child(1) {
    width: 300px;
  }
`;

const StyledTd = styled.td`
  display: flex;
  flex-direction: column;
`;

export default React.memo(FanMatchTile);
