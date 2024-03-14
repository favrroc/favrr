import React from "react";
import styled from "styled-components";

import { Body2, Caption1 } from "../../../components/styleguide/styleguide";
import { RESPONSIVE } from "../../../core/constants/responsive.const";
import { colors } from "../../../core/constants/styleguide.const";
import { useWatchResize } from "../../../core/hooks/useWatchResize";
import { getCSSOfStyledComponent } from "../../../core/util/base.util";
import { Unit, formatNumber } from "../../../core/util/string.util";
import { FanMatchStatsCategory } from "./constants";
import { Else, If, Then } from "react-if";

interface Props {
  category: FanMatchStatsCategory;
  firstFavScore: number;
  secondFavScore: number;
  maxScore: number;
  showDecimals: boolean;
  isThereLiveMatch: boolean;
}

const FanMatchStatusBar = (props: Props) => {
  const {
    category,
    firstFavScore,
    secondFavScore,
    maxScore,
    showDecimals,
    isThereLiveMatch
  } = props;
  const { smallerThanTablet } = useWatchResize();

  const formatValue = (category: FanMatchStatsCategory, value: number) => {
    return category === FanMatchStatsCategory.PPS
      ? value.toString()
      : category === FanMatchStatsCategory.DeltaPPS
        ? formatNumber({
          value,
          withUnit: true,
          unit: showDecimals ? Unit.PERCENT : Unit.SHARE,
          summarize: true
        })
        : category === FanMatchStatsCategory.MarketCap
          ? formatNumber({
            value,
            unit: showDecimals ? Unit.USDC : Unit.SHARE,
            summarize: false
          })
          : formatNumber({
            value,
            unit: showDecimals ? Unit.USDC : Unit.SHARE,
            summarize: false
          });
  };

  const firstFavScoreBarWidth =
    maxScore === 0 ? 0 : (firstFavScore / maxScore) * 100;
  const secondFavScoreBarWidth =
    maxScore === 0 ? 0 : (secondFavScore / maxScore) * 100;
  const firstFavColor = isThereLiveMatch
    ? firstFavScore > secondFavScore
      ? colors.primaryGreen
      : colors.neutrals8
    : colors.neutrals4;
  const secondFavColor = isThereLiveMatch
    ? secondFavScore > firstFavScore
      ? colors.primaryGreen
      : colors.neutrals8
    : colors.neutrals4;

  const formattedFirstScore = formatValue(category, firstFavScore);
  const formattedSecondScore = formatValue(category, secondFavScore);

  return (
    <>
      <StyledContainer>
        <StyledStatusTitleBoard>
          <StyledScore
            isFirstFav={true}
            color={firstFavColor}
            smallerThanTablet={smallerThanTablet}
          >
            {isThereLiveMatch ? formattedFirstScore : "-"}
          </StyledScore>
          <StyledStatusTitle>{category}</StyledStatusTitle>
          <StyledScore
            isFirstFav={false}
            color={secondFavColor}
            smallerThanTablet={smallerThanTablet}
          >
            {isThereLiveMatch ? formattedSecondScore : "-"}
          </StyledScore>
        </StyledStatusTitleBoard>

        <StyledBarSection>
          <StyledLeftBar>
            <If condition={isThereLiveMatch}>
              <Then>
                <StyledLeftBarScored
                  style={{
                    width: `${firstFavScoreBarWidth}%`,
                    backgroundColor: firstFavColor
                  }}
                ></StyledLeftBarScored>
              </Then>
              <Else>
                <StyledEmptyStatusBarLeft />
              </Else>
            </If>
          </StyledLeftBar>
          <StyledRightBar>
            <If condition={isThereLiveMatch}>
              <Then>
                <StyledRightBarScored
                  style={{
                    width: `${secondFavScoreBarWidth}%`,
                    backgroundColor: secondFavColor
                  }}
                ></StyledRightBarScored>
              </Then>
              <Else>
                <StyledEmptyStatusBarRight />
              </Else>
            </If>
          </StyledRightBar>
        </StyledBarSection>
      </StyledContainer>
    </>
  );
};

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 16px 0px 16px 0px;
  gap: 4px;
  @media screen and (min-width: ${RESPONSIVE.tablet}) {
    gap: 24px;
  }
`;

const StyledStatusTitle = styled.div`
  ${getCSSOfStyledComponent(Caption1)}
  @media screen and (min-width: ${RESPONSIVE.tablet}) {
    ${getCSSOfStyledComponent(Body2)}
  }
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  color: ${colors.neutrals4};
  font-size: 14px;
  @media screen and(min-width: ${RESPONSIVE.tablet}) {
    font-size: 16px;
  }
`;

const StyledBarSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 12px;
  margin-top: 16px;
  margin-bottom: 16px;
  width: 100%;
`;

const StyledLeftBar = styled.div`
  width: 50%;
  height: 5px;
  border-radius: 3px;
  background-color: ${colors.neutrals3};
  position: relative;
`;

const StyledLeftBarScored = styled.div`
  position: absolute;
  width: 30%;
  height: 5px;
  border-radius: 3px;
  top: 0;
  right: 1.5px;
  background-color: ${colors.neutrals8};
`;

const StyledRightBar = styled.div`
  width: 50%;
  height: 5px;
  border-radius: 3px;
  background-color: ${colors.neutrals3};
  position: relative;
`;

const StyledRightBarScored = styled.div`
  position: absolute;
  width: 70%;
  height: 5px;
  border-radius: 3px;
  top: 0;
  left: 1.5px;
  background-color: ${colors.primaryGreen};
`;

interface IStyledScore {
  isFirstFav: boolean;
  color: string;
  smallerThanTablet: boolean;
}
const StyledScore = styled.div`
  position: absolute;
  font-family: "Oswald";
  font-style: normal;
  font-weight: ${(props: IStyledScore) =>
    props.smallerThanTablet ? 500 : 600};
  font-size: ${(props: IStyledScore) =>
    props.smallerThanTablet ? "16px" : "24px"};
  line-height: ${(props: IStyledScore) =>
    props.smallerThanTablet ? "24px" : "32px"};
  left: ${(props: IStyledScore) => (props.isFirstFav ? "6px" : "auto")};
  right: ${(props: IStyledScore) => (props.isFirstFav ? "auto" : "6px")};
  color: ${(props: IStyledScore) => props.color};
`;

const StyledStatusTitleBoard = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  position: relative;
`;

const StyledEmptyStatusBarRight = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 6px;
  height: 6px;
  border-radius: 100%;
  background-color: ${colors.neutrals4};
`;

const StyledEmptyStatusBarLeft = styled.div`
  position: absolute;
  top: 0px;
  right: 0px;
  width: 6px;
  height: 6px;
  border-radius: 100%;
  background-color: ${colors.neutrals4};
`;
export default FanMatchStatusBar;
