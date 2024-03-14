import React, { useRef, useState } from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import styled from "styled-components";

import { RESPONSIVE } from "../../../../core/constants/responsive.const";
import { League } from "../../../../core/enums/league.enum";
import { LeagueLib, Leagues } from "../../../../core/util/league.util";

interface Props {
  selected: League;
  setSelected: (league: League) => void;
}
const LeagueFilter = (props: Props) => {
  const [scrolling, setScrolling] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  return (
    <Wrapper>
      <ScrollContainer
        className={`scroll-container ${scrolling ? `scrolling` : ""}`}
        vertical={true}
        hideScrollbars={false}
        onStartScroll={() => setScrolling(true)}
        onEndScroll={() => setScrolling(false)}
        style={{ cursor: "grabbing" }}
        ref={(scroll) => {
          scrollRef.current = (scroll as any)?.container?.current || null;
        }}
      >
        <Buttons>
          <Indicator current={props.selected} />
          {Leagues.map(league => (
            <StyledLeague
              key={`league-${league}`}
              onClick={() => props.setSelected(league)}
              className={props.selected === league ? "selected" : ""}
              src={LeagueLib[league].image.props.src}
            />
          ))}
        </Buttons>
      </ScrollContainer>
    </Wrapper>
  );
};

const Indicator = styled.div`
  background-color: rgba(63, 140, 255, 0.08);
  box-shadow: inset 0 0 0 3px #3f8cff;
  position: absolute;
  height: 72px;
  width: 72px;
  border-radius: 100%;
  transition: all 0.3s ease;
  left: calc(
    ${(props: { current: number; }) => (props.current) * 112}px + 16px
  );
  @media screen and (max-width: ${RESPONSIVE.small}) {
    height: 52px;
    width: 52px;
    left: calc(
      ${(props: { current: number; }) => (props.current) * 92}px + 16px
    );
  }
`;

const Wrapper = styled.div`
  .scroll-container {
    max-width: 1120px;
    margin: auto;
  }
  margin-bottom: 84px;
  @media screen and (max-width: ${RESPONSIVE.small}) {
    margin-bottom: 48px;
  }
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;
  padding: 0 16px;
  width: min-content;
  max-width: 1120px;
  justify-content: space-between;
  gap: 40px;
  margin-bottom: 8px;
  position: relative;
`;

const StyledLeague = styled.div`
  user-select: none;
  cursor: pointer;
  opacity: 1;
  transition: all 0.5s ease;
  height: 72px;
  width: 72px;
  border-radius: 100%;
  background-image: url(${(props: { src: any; }) => props.src});
  background-repeat: no-repeat;
  background-position: center;
  background-size: 60px;
  &:hover {
    transition: all 0.5s ease;
    background-color: rgba(63, 140, 255, 0.2);
  }
  @media screen and (max-width: ${RESPONSIVE.small}) {
    height: 52px;
    width: 52px;
    background-size: 45px;
  }
`;

export default LeagueFilter;
