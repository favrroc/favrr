import React from "react";
import Marquee from "react-fast-marquee";
import { Link } from "react-router-dom";
import styled from "styled-components";

import FavThumb from "../../fav/fav-thumb/FavThumb";
import { useAppSelector } from "../../../core/hooks/rtkHooks";
import { FavEntity } from "../../../../generated-graphql/graphql";
import { FavStatisticsInfo } from "../../../core/interfaces/fav.type";
import { CURRENCY } from "../../../core/constants/base.const";
import { extractFavStatisticsInfo, getColorOfValue } from "../../../core/util/base.util";
import { favPath } from "../../../core/util/pathBuilder.util";
import { formatNumber, Unit } from "../../../core/util/string.util";
import "./tickers-bar.scss";

const TickerItem = (props: {
  fav: FavEntity;
  favStatisticsInfo: FavStatisticsInfo;
}) => {
  const { fav, favStatisticsInfo } = props;
  const { data: favInfo, marketPriceDelta, marketPriceDeltaPercent } = favStatisticsInfo;

  const pps: number = favInfo.marketPrice || favInfo.ipoPrice;
  return (
    <div className="ticker-item">
      <StyledLink to={favPath(fav?.title as string)}>
        <span><FavThumb images={[{ key: "default", image: fav?.iconImage || "" }]} size={32} /></span>
        <span className="coin-label">
          {fav?.coin}
        </span>
        <span
          className={`price-label ${getColorOfValue(marketPriceDelta)}`}
        >
          <span>{formatNumber({ value: pps, unit: Unit.USDC, summarize: true })} {CURRENCY}</span>
        </span>
        <span className={`delta ${getColorOfValue(marketPriceDelta)}`}>
          <span>{formatNumber({ value: marketPriceDeltaPercent, unit: Unit.PERCENT, summarize: true, withUnit: true })}</span>
        </span>
      </StyledLink>
    </div>
  );
};

const StyledLink = styled(Link)`
  display: flex;
  gap: 8px;
  &:hover * {
    color: #3f8cff !important;
  }
`;

const TickersBar = () => {
  const { favsById, multiFavsInfo } = useAppSelector(state => state.favs);

  const displayElements =
    (Object.keys(multiFavsInfo).length > 0) &&
      (Object.keys(favsById).length > 0)
      ? Object.values(multiFavsInfo)
        .sort((a, b) => (+b.data.updatedAt - +a.data.updatedAt))
        .map(o => o.data.id)
        .slice(0, 12)
        .map(favId => favsById[favId])
      : [];

  if (!displayElements.length) {
    return null;
  }

  return (
    <Marquee className="tickers-bar" gradient={false} pauseOnHover speed={28}>
      {displayElements.map((fav, i) => (
        <React.Fragment key={fav?.key || i}>
          <TickerItem fav={fav as FavEntity} favStatisticsInfo={extractFavStatisticsInfo(multiFavsInfo, fav?.id)} />
          <div className="vertical-separator" />
        </React.Fragment>
      ))}
    </Marquee>
  );
};

export default TickersBar;
