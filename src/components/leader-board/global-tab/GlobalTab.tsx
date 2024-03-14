import React from "react";

import LeaderList from "../leader-board-component/children/LeaderList";
import TabContent from "../tab-content/TabContent";
import { useAppSelector } from "../../../core/hooks/rtkHooks";

const GlobalTab = () => {
  const { loadingParticipantsData, participantsData } = useAppSelector(state => state.participants);

  return (
    <TabContent>
      <LeaderList groupIndex={0} loading={loadingParticipantsData} list={participantsData} />
    </TabContent>
  );
};

export default GlobalTab;
