import React from "react";
import styled from "styled-components";

import { Link } from "react-router-dom";
import { FavEntity } from "../../../../../generated-graphql/graphql";
import { colors } from "../../../../core/constants/styleguide.const";
import { stopAnchorMouseEventPropagination } from "../../../../core/util/base.util";
import { fanMatchPath, favPath } from "../../../../core/util/pathBuilder.util";
import MatchFavAvatar from "./children/MatchFavAvatar";
import Title from "./children/Title";

interface IMatch {
  matchResult: [number, number] | undefined;
  firstFav: FavEntity;
  secondFav: FavEntity;
}

const Match = (props: IMatch) => {
  const { matchResult, firstFav, secondFav } = props;

  const MatchScore =
    matchResult === undefined
      ? "- : -"
      : `${matchResult[0]} : ${matchResult[1]}`;

  const handleClick = () => {
    if (matchResult) {
      window.location.href = fanMatchPath();
    }
  };

  return (
    <>
      {firstFav && secondFav && (
        <StyledFanMatchCard onClick={handleClick}>
          <StyledScore matchResult={matchResult}>
            <StyledValueOfScore matchResult={matchResult}>
              {MatchScore}
            </StyledValueOfScore>
          </StyledScore>

          <Title title={""} />
          <StyledInfoSection>
            <StyledFavInfoSection>
              <MatchFavAvatar fav={firstFav} />
              <StyledFavTitle
                to={favPath(firstFav.title as string)}
                onClick={stopAnchorMouseEventPropagination}
              >
                {firstFav.displayName?.split(" ")[1]}
              </StyledFavTitle>
            </StyledFavInfoSection>

            <StyledFavInfoSection>
              <MatchFavAvatar fav={secondFav} />
              <StyledFavTitle
                to={favPath(secondFav.title as string)}
                onClick={stopAnchorMouseEventPropagination}
              >
                {secondFav.displayName?.split(" ")[1]}
              </StyledFavTitle>
            </StyledFavInfoSection>
          </StyledInfoSection>
        </StyledFanMatchCard>
      )}
    </>
  );
};

const StyledFanMatchCard = styled.div`
  position: relative;
  border-radius: 20px;
  padding: 16px 14px 8px 14px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${colors.neutrals2};
  &:hover {
    background-color: ${colors.neutrals1};
    cursor: pointer;
  }
`;

const StyledInfoSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const StyledFavInfoSection = styled.div`
  width: 30%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StyledFavTitle = styled(Link)`
  font-family: "Poppins";
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
`;

const StyledScore = styled.div`
  position: absolute;
  width: 52px;
  height: 30px;
  background-color: ${(props: { matchResult: boolean }) => {
    return props.matchResult ? "#7FBA7A14" : `${colors.neutrals1}`;
  }};
  border-radius: 60px;
  top: 26px;
  text-align: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StyledValueOfScore = styled.span`
  font-family: ${(props: { matchResult: boolean }) => {
    return props.matchResult ? "Oswald" : "Poppins";
  }};
  font-weight: ${(props: { matchResult: boolean }) => {
    return props.matchResult ? "700" : "500";
  }};
  font-size: 16px;
  line-height: 24px;
  color: ${(props: { matchResult: boolean }) => {
    return props.matchResult === undefined
      ? `${colors.neutrals4}`
      : `${colors.primaryGreen}`;
  }};
`;

export default Match;
