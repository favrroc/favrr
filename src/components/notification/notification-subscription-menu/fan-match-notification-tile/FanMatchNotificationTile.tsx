import React from "react";
import styled from "styled-components";

import { FanMatchEntity } from "../../../../../generated-graphql/graphql";
import { colors } from "../../../../core/constants/styleguide.const";
import { useAppSelector } from "../../../../core/hooks/rtkHooks";
import { Body2, Body2Bold, Caption2 } from "../../../styleguide/styleguide";

interface IFanMatchNotificationTile {
  title: string;
  matchStatus: boolean;
  fanMatch?: FanMatchEntity;
}

const FanMatchNotificationTile = (props: IFanMatchNotificationTile) => {
  const { fanMatch } = props;

  const { favs, multiFavsInfo } = useAppSelector((state) => state.favs);
  const { liveMatchResults } = useAppSelector((state) => state.fanMatch);

  const favsInfo = Object.values(multiFavsInfo)
    .map((o) => o.data.id)
    .map((o) => favs?.filter((oo) => oo.id === +o)[0])
    .filter((o) => !!o);
  const winner = liveMatchResults[0] > liveMatchResults[1] ? "first" : "second";
  const WinnerMessage =
    winner === "first"
      ? "Congrats, " +
        favsInfo[(fanMatch?.leftFav.id || 1) - 1]?.displayName?.split(" ")[1] +
        " Won!"
      : "Congrats, " +
        favsInfo[(fanMatch?.rightFav.id || 1) - 1]?.displayName?.split(" ")[1] +
        " Won!";

  return (
    <StyledFanMatchTile>
      <StyledAvatarGroup>
        <StyledFirstFavAvatar
          className={winner === "first" ? "won" : ""}
          src={favsInfo[(fanMatch?.leftFav?.id || 1) - 1].iconImage}
        />
        <StyledSecondFavAvatar
          className={winner === "second" ? "won" : ""}
          src={favsInfo[(fanMatch?.rightFav?.id || 1) - 1].iconImage}
        />
      </StyledAvatarGroup>
      <StyledInformationSection>
        <StyledMatchTitleDiv>
          <Body2Bold>
            {liveMatchResults[0]}&nbsp;:&nbsp;{liveMatchResults[1]}
          </Body2Bold>
          <StyledSmallDot />
          <Body2Bold>{fanMatch?.title}</Body2Bold>
        </StyledMatchTitleDiv>
        <Body2Bold style={{ width: "120%" }}>{WinnerMessage}</Body2Bold>
        <StyledMatchRsultDiv>
          <Body2 style={{ color: colors.primaryPink }}>{`Match Ended`}</Body2>
          <StyledSmallDot />
          <Caption2
            style={{ color: colors.neutrals4 }}
          >{`10 minutes ago`}</Caption2>
        </StyledMatchRsultDiv>
      </StyledInformationSection>
      <StyledDot />
    </StyledFanMatchTile>
  );
};

const StyledFanMatchTile = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 24px;
  padding: 16px;
  height: 104px;
  background-color: ${colors.neutrals2};
  border-radius: 20px;
  &:hover {
    background-color: ${colors.neutrals1};
    cursor: pointer;
  }
`;

const StyledAvatarGroup = styled.div`
  position: relative;
  width: 64px;
  height: 64px;
`;

const StyledFirstFavAvatar = styled.img`
  position: absolute;
  width: 44px;
  height: 44px;
  border-radius: 100%;
  border: 2px solid ${colors.neutrals8};
  z-index: 0;
  top: 0px;
  right: 20px;
  &.won {
    border: 2px solid ${colors.primaryGreen};
    z-index: 1;
  }
`;

const StyledSecondFavAvatar = styled.img`
  position: absolute;
  width: 44px;
  height: 44px;
  border-radius: 100%;
  border: 2px solid ${colors.neutrals8};
  top: 20px;
  right: 0px;
  z-index: 0;
  &.won {
    border: 2px solid ${colors.primaryGreen};
    z-index: 1;
  }
`;

const StyledInformationSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 208px;
`;

const StyledDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 100%;
  background-color: ${colors.primaryBlue};
`;

const StyledMatchTitleDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 6px;
  width: 120%;
`;

const StyledSmallDot = styled.div`
  width: 4px;
  height: 4px;
  border-radius: 100%;
  background-color: ${colors.neutrals4};
`;

const StyledMatchRsultDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 6px;
  width: 120%;
`;
export default FanMatchNotificationTile;
