import React from "react";
import { Link } from "react-router-dom";

import { FavEntity } from "../../../../generated-graphql/graphql";
import { FavInfo } from "../../../../generated-subgraph/graphql";
import { DEFAULT_IPO_AVAILABLE_SHARES } from "../../../core/constants/base.const";
import { getColorOfValue } from "../../../core/util/base.util";
import { favPath } from "../../../core/util/pathBuilder.util";
import { formatNumber, Unit } from "../../../core/util/string.util";
import LikeButton from "../../button/like-button/LikeButton";
import ResponsiveImage from "../../image/responsive-image/ResponsiveImage";
import Countdown from "../../time/count-down/CountDown";
import FavBadge from "../fav-badge/FavBadge";
import IpoBadge from "../ipo-badge/IpoBadge";
import ProgressBar from "../progress-bar/ProgressBar";

import missingImgSrc from "../../../assets/images/img-placeholder.svg";
import "./fav-tile.scss";

interface Props {
  fav: FavEntity | undefined;
  favInfo: FavInfo;
  isIPO: boolean;
  isTop10: FavEntity | undefined;
  marketPriceDeltaForWeek: number;
  marketPriceDeltaPercentForWeek: number;
  className?: string;
}
const FavTile = (props: Props) => {
  const { fav, favInfo, isIPO, isTop10, marketPriceDeltaForWeek, marketPriceDeltaPercentForWeek } = props;

  const ppsUSDCWithUnit = formatNumber({ value: favInfo?.marketPrice || 1, unit: Unit.USDC, summarize: false, withUnit: true });
  const sharesLeft: number = favInfo?.availableSupply === 0 ? 0 : favInfo?.availableSupply ? favInfo?.availableSupply : DEFAULT_IPO_AVAILABLE_SHARES;
  const sharesTotal: number = DEFAULT_IPO_AVAILABLE_SHARES;
  const strIpoEndTime = new Date(favInfo?.ipoEndTime || 0).toISOString() as string;

  return (
    <div className={`fav-tile ${props.className || ""}`}>
      <Link to={favPath(fav?.title as string)} className="image-container">
        {isTop10 && <FavBadge />}
        {isIPO && <IpoBadge />}
        <ResponsiveImage
          images={[{ key: "default", image: fav?.mobileSizeImage || "" }]}
          defaultImg={missingImgSrc}
        />
        <LikeButton
          isFavorite={fav?.isLike || false}
          favId={fav?.id}
        />
        {isIPO && <Countdown endDate={strIpoEndTime} />}
      </Link>
      <div className="tile-info-inner">
        <div className="name-price">
          <Link to={favPath(fav?.title as string)} className="tile-name">
            {fav?.displayName}
          </Link>
          <span className="tile-price">{ppsUSDCWithUnit}</span>
        </div>
        <hr />
        {isIPO ? (
          <ProgressBar
            sharesLeft={sharesLeft}
            sharesTotal={sharesTotal}
            isIpo={true}
          />
        ) : (
          <>
            {sharesLeft === 0 ? <ProgressBar
              sharesLeft={sharesLeft}
              sharesTotal={sharesTotal}

            /> :
              <div style={{ display: "flex" }}>
                <div style={{ display: "flex" }} dangerouslySetInnerHTML={{ __html: fav?.sparkline || "" }}></div>
                <div
                  className={`delta-eth ${getColorOfValue(marketPriceDeltaForWeek)}`}
                >
                  {formatNumber({ value: marketPriceDeltaForWeek, unit: Unit.USDC, summarize: true, withUnit: true, withSign: true })}
                </div>
                <div className="delta-percent">
                  {formatNumber({ value: marketPriceDeltaPercentForWeek, unit: Unit.PERCENT, summarize: true, withUnit: true })}
                </div>
              </div>
            }
          </>
        )}
      </div>
    </div>
  );
};

export default React.memo(FavTile);
