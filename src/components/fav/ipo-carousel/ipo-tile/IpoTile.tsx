import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import ResponsiveImage from "../../../image/responsive-image/ResponsiveImage";
import Countdown from "../../../time/count-down/CountDown";
import ProgressBar from "../../progress-bar/ProgressBar";
import { FavEntity } from "../../../../../generated-graphql/graphql";
import { FavInfo } from "../../../../../generated-subgraph/graphql";
import { DEFAULT_IPO_AVAILABLE_SHARES } from "../../../../core/constants/base.const";
import { favPath } from "../../../../core/util/pathBuilder.util";
import { getColorOfValue } from "../../../../core/util/base.util";
import { formatNumber, Unit } from "../../../../core/util/string.util";
import missingImgSrc from "../../../../assets/images/img-placeholder.svg";
import "./ipo-tile.scss";
import LikeButton from "../../../button/like-button/LikeButton";

interface Props {
  fav: FavEntity | undefined;
  favInfo: FavInfo;
  isIPO: boolean;
  marketPriceDeltaForWeek: number;
  marketPriceDeltaPercentForWeek: number;
  className?: string;
}

const FavTile = (props: Props) => {
  const { fav, favInfo, isIPO, marketPriceDeltaForWeek, marketPriceDeltaPercentForWeek } = props;
  const pps = favInfo?.marketPrice || favInfo?.ipoPrice;
  const sharesLeft: number = favInfo?.availableSupply;
  const sharesTotal: number = DEFAULT_IPO_AVAILABLE_SHARES;

  return (
    <div className={`ipo-tile ${props.className || ""}`}>
      <Link to={favPath(fav?.title as string)} className="image-container">
        <ResponsiveImage
          images={[{ key: "default", image: fav?.mobileSizeImage || "" }]}
          defaultImg={missingImgSrc}
        />
        <LikeButton
          isFavorite={fav?.isLike || false}
          favId={fav?.id}
        />
        {isIPO && <Countdown endDate={new Date(favInfo?.ipoEndTime || 0).toISOString() as string} />}
        <Thumbnail src={`${encodeURI(fav?.iconImage as string)}`} />
      </Link>
      <div className="tile-info-inner">
        <div className="name-price">
          <Link to={favPath(fav?.title as string)} className="tile-name">
            {fav?.displayName}
          </Link>
          <span className="tile-price" style={{display: "flex", flexDirection: "column", gap: 6}}>
            <span className="inner-label">IPO PRICE</span>
            <span>
              {formatNumber({ value: pps, unit: Unit.USDC, summarize: false, withUnit: true })}
            </span>
          </span>
        </div>
        {isIPO ? (
          <ProgressBar
            sharesLeft={sharesLeft}
            sharesTotal={sharesTotal}
            isIpo={true}
          />
        ) : (
          <div style={{ display: "flex" }}>
            <span dangerouslySetInnerHTML={{ __html: fav?.sparkline || "" }}></span>
            <span
              className={`delta-eth ${getColorOfValue(marketPriceDeltaForWeek)}`}
            >
              {formatNumber({ value: marketPriceDeltaForWeek, unit: Unit.USDC, summarize: true, withUnit: true, withSign: true })}
            </span>
            <span className="delta-percent">
              {formatNumber({ value: marketPriceDeltaPercentForWeek, unit: Unit.PERCENT, summarize: true, withUnit: true })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const TickerSpan = styled.span`
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 20px;
  color: #808191;
  margin-left: 4px;
  margin-right: 4px;
`;

const Thumbnail = styled.div`
  height: 80px;
  width: 80px;
  border-radius: 100%;
  border: solid 4px #242731;
  background: url(${(props: { src: string; }) => props.src}) no-repeat center;
  background-size: cover;
  position: absolute;
  bottom: -44px;
  left: 50%;
  transform: translateX(-50%);
`;

export default React.memo(FavTile);
