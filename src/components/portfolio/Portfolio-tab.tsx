import dayjs from "dayjs";
import React, { useEffect, useState } from "react";

import styled from "styled-components";
import { UserInfo } from "../../../generated-subgraph/graphql";
import { useAppSelector } from "../../core/hooks/rtkHooks";
import { toUSDC } from "../../core/util/string.util";
import AddressEquityPanel from "../assets/address-equity-panel/AddressEquityPanel";
import EquityChart from "../assets/equity-chart/EquityChart";
import MyFavsPanel from "../assets/my-favs-panel/MyFavsPanel";
import Loader from "../loader/Loader";
import { Flex } from "../styleguide/styleguide";
import "./portfolio-tab.scss";

const PortoflioTab = () => {
  const {
    historicalUserInfo: history,
    historicalUserInfoOnlyOneDay: historyOnlyOneDay,
    historyFavIds,
    loadingHistoricalUserInfo,
  } = useAppSelector(state => state.user);

  const [currUserInfo, setCurrUserInfo] = useState<UserInfo | undefined>();
  const [prevUserInfo, setPrevUserInfo] = useState<UserInfo | undefined>();
  const [totalEquity, setTotalEquity] = useState(0);
  const [totalEquity24, setTotalEquity24] = useState(0);
  const [totalFavs, setTotalFavs] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [totalShares, setTotalShares] = useState(0);

  useEffect(() => {
    let _currUserInfo: UserInfo | undefined;
    let _prevUserInfo: UserInfo | undefined;

    if (history) {
      const [prevKey, currKey] = Object.keys(history).slice(-2);
      _prevUserInfo = history[prevKey]?.at(0);
      _currUserInfo = history[currKey]?.at(0) || _prevUserInfo;
    }

    const currUnixTimestamp = dayjs().unix();
    let _totalFavs = 0;

    const _totalEquity =
      _currUserInfo?.shareAssets.reduce((a, b) => {
        if (b.amount !== 0) _totalFavs++;
        const price = toUSDC(
          b.favInfo.ipoEndTime < currUnixTimestamp
            ? b.favInfo.marketPrice
            : b.favInfo.ipoPrice
        );
        return a + price * b.amount;
      }, 0) || 0;

    const _totalEquity24 =
      _prevUserInfo?.shareAssets.reduce((a, b) => {
        const price = toUSDC(
          b.favInfo.ipoEndTime < currUnixTimestamp
            ? b.favInfo.marketPrice
            : b.favInfo.ipoPrice
        );
        return a + price * b.amount;
      }, 0) || 0;

    const _totalCost = toUSDC(_currUserInfo?.totalCost);
    const _totalShares = _currUserInfo?.totalShares
      ? +_currUserInfo?.totalShares
      : 0;

    setCurrUserInfo(_currUserInfo);
    setPrevUserInfo(_prevUserInfo);
    setTotalEquity(_totalEquity);
    setTotalEquity24(_totalEquity24);
    setTotalFavs(_totalFavs);
    setTotalCost(_totalCost);
    setTotalShares(_totalShares);
  }, [history]);

  return <>
    {loadingHistoricalUserInfo ? (
      <Loader wrapperStyle={{ minHeight: "312px" }} />
    ) : (
      <>
        <EquityChart
          history={history}
          historyOnlyOneDay={historyOnlyOneDay}
          className="section"
        />
      </>
    )}
    <StyledFlex>
      <div className="section">
        {loadingHistoricalUserInfo ? (
          <Loader wrapperStyle={{ minHeight: "312px" }} />
        ) : (
          <AddressEquityPanel
            totalEquity={totalEquity}
            totalCost={totalCost}
            todaysReturn={totalEquity - totalEquity24}
            todaysReturnPercent={
              totalEquity24 === 0
                ? 0
                : ((totalEquity - totalEquity24) / totalEquity24) * 100
            }
            totalReturn={totalEquity - totalCost}
            totalReturnPercent={
              totalCost === 0
                ? 0
                : ((totalEquity - totalCost) / totalCost) * 100
            }
            totalFavs={totalFavs}
            totalShares={totalShares}
          />
        )}
      </div>
      <MyFavsPanel
        loadingUserInfo={loadingHistoricalUserInfo}
        userInfo={currUserInfo}
        userInfo24={prevUserInfo}
        historyFavIds={historyFavIds}
      />
    </StyledFlex>
  </>;
};

const StyledFlex = styled(Flex)`
  gap: 20px;
  > * {
    flex: 1;
  }
  @media screen and (max-width: 850px) {
    flex-direction: column;
    gap: 40px;
  }
`;

export default PortoflioTab;