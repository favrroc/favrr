import React, { useEffect, useState } from "react";

import LeaderList from "../leader-board-component/children/LeaderList";
import LeagueFilter from "../leader-board-component/children/LeagueFilter";
import TabContent from "../tab-content/TabContent";
import { useAppSelector } from "../../../core/hooks/rtkHooks";
import { League } from "../../../core/enums/league.enum";

const LeagueTab = () => {
  const { loadingParticipantsData, participantsData } = useAppSelector(state => state.participants);

  const [selected, setSelected] = useState<League>(League.Microbe);

  const filteredParticipantsData = participantsData.filter(data => data.league === selected);

  return (
    <TabContent>
      <LeagueFilter selected={selected} setSelected={setSelected} />
      <LeaderList groupIndex={selected} loading={loadingParticipantsData} list={filteredParticipantsData} />
    </TabContent>
  );
};

export default LeagueTab;
