import React, { lazy, useEffect, useState } from "react";
import styled from "styled-components";

import BasePage from "../base-page/BasePage";

// import LeaderList from "../../components/leader-board/leader-board-component/children/LeaderList";
const LeaderList = lazy(() => import("../../components/leader-board/leader-board-component/children/LeaderList"));
import LeagueFilter from "../../components/leader-board/leader-board-component/children/LeagueFilter";
import { Block, Caption1Bold } from "../../components/styleguide/styleguide";
import TabSwitcher from "../../components/tabs/tab-switcher/TabSwitcher";
import { RESPONSIVE } from "../../core/constants/responsive.const";
import { League } from "../../core/enums/league.enum";
import { useAppSelector } from "../../core/hooks/rtkHooks";
import SEO from "../../components/seo/SEO";
import { useSearchParams } from "react-router-dom";

const LeaderboardPage = () => {
  const { loadingParticipantsData, participantsData } = useAppSelector(state => state.participants);

  const [tabIndex, setTabIndex] = useState(0);
  const [selected, setSelected] = useState<League>(League.Microbe);

  const filteredParticipantsData = participantsData.filter(data => data.league === selected);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const targetTab = searchParams.get("target");
    const leagueTab = searchParams.get("league");

    if (targetTab) {
      setTabIndex(parseInt(targetTab) || 0);
      if(leagueTab) {
        setSelected(League[leagueTab as keyof typeof League]);
      }
    }
  }, []);

  return (
    <BasePage style={{ "--number-columns": 0 } as any} contentStyle={{ paddingLeft: "0px", paddingRight: "0px", paddingTop: 0 }}>
      <SEO
        title={tabIndex === 0 ? `
          Oceana Market Leaderboard: Top Fans in Virtual Celebrity Stock Trading - Follow & Learn
        ` : `
          Oceana Market Leagues: Top Players in Each League - Virtual Celebrity Stock Trading Mastery
        `}
        description={tabIndex === 0 ? `
        Meet the top-performing fans on Oceana Market's virtual celebrity stock trading leaderboard. View their avatars, nicknames, total equity, and daily performance. Follow the best players to gain insights into their successful strategies and improve your game!
        ` : `
        Explore the top players across various leagues on Oceana Market, where users are grouped based on performance and accomplishments. Learn from the masters of virtual celebrity stock trading and enhance your own strategies in this exciting investment game!
        `}
        name={`Oceana Market`}
        type={`Leader Board Page`}
      />
      <Block>
        <StyledCaption1Bold className="font-grey">MASTER EACH LEAGUE TO WIN</StyledCaption1Bold>
        <Headline>FAN LEADERBOARD</Headline>
        <StyledTabSwitcherContainer>
          <TabSwitcher active={tabIndex} setFilterAction={setTabIndex} listOfButtons={["Global", "League"]} />
        </StyledTabSwitcherContainer>
        <div>
          {tabIndex === 0 && <LeaderList groupIndex={0} loading={loadingParticipantsData} list={participantsData} />}
          {tabIndex === 1 && (
            <>
              <LeagueFilter selected={selected} setSelected={setSelected} />
              <LeaderList groupIndex={selected} loading={loadingParticipantsData} list={filteredParticipantsData} />
            </>
          )}
        </div>
      </Block>
    </BasePage>
  );
};

const StyledCaption1Bold = styled(Caption1Bold)`
  display: block;
  width: 100%;
  margin-top: 72px;
  margin-bottom: 8px;
  text-align: center;
  @media screen and (max-width: ${RESPONSIVE.large}) {
    margin-top: 56px;
  }
  @media screen and (max-width: ${RESPONSIVE.medium}) {
    margin-top: 48px;
  }
  @media screen and (max-width: ${RESPONSIVE.small}) {
    margin-top: 56px;
  }
`;

const Headline = styled.div`
  font-family: "Oswald";
  margin: 0;
  font-style: normal;
  font-weight: 700;
  font-size: 48px;
  line-height: 56px;
  text-align: center;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  text-align: center;
  color: #fcfcfd;
  @media screen and (max-width: ${RESPONSIVE.small}) {
    font-family: "Oswald";
    font-style: normal;
    font-weight: 700;
    font-size: 32px;
    line-height: 40px;
  }
`;

const StyledTabSwitcherContainer = styled.div`
  margin-top: 76px;
  margin-bottom: 80px;
  @media screen and (max-width: ${RESPONSIVE.large}) {
    margin-top: 60px;
  }
  @media screen and (max-width: ${RESPONSIVE.medium}) {
    margin-top: 48px;
    margin-bottom: 48px;
  }
  @media screen and (max-width: ${RESPONSIVE.small}) {
    margin-top: 32px;
  }
`;

export default LeaderboardPage;
