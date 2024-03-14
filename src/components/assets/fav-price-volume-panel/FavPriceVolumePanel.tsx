import dayjs, { ManipulateType } from "dayjs";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FormattedMessage } from "react-intl";

import { FavEntity } from "../../../../generated-graphql/graphql";
import ipoSrc from "../../../assets/images/ipo.svg";
import profilePlaceholderSrc from "../../../assets/images/person-placeholder.svg";
import { oceanaShareExContract } from "../../../core/constants/contract";
import { HistoricalFavInfo } from "../../../core/graphql-queries/subgraph-queries/favInfo.query";
import { useWatchVisible } from "../../../core/hooks/useWatchVisible";
import {
  ChartMode,
  DataPointRaw,
  FavStatistics,
  TimeRange
} from "../../../core/interfaces/chart.type";
import {
  generateTimeStep,
  getColorOfValue,
  parseDataByTimeScale
} from "../../../core/util/base.util";
import { Unit, formatNumber, toUSDC } from "../../../core/util/string.util";
import PriceChart from "../../chart/price-chart/PriceChart";
import VolumeChart from "../../chart/volume-chart/VolumeChart";
import ResponsiveImage from "../../image/responsive-image/ResponsiveImage";
import ExclusivePicker from "../../input/exclusive-picker/ExclusivePicker";
import NumberAnimatedLabel from "../../label/NumberAnimatedLabel";
import Loader from "../../loader/Loader";
import "../line-chart-type/LineChartType";
import "./fav-price-volume-panel.scss";

interface FavPriceVolumePanelProps {
  loading: boolean;
  fav: FavEntity;
  sharesSold: number;
  sharesDelta: number;
  isIPO: boolean;
  volumeDeltaPercent: number;
  favsInfo: HistoricalFavInfo;
  favsInfoOnlyOneDay: HistoricalFavInfo;
}

const FavPriceVolumePanel = (props: FavPriceVolumePanelProps) => {
  const {
    loading,
    fav,
    sharesSold,
    sharesDelta,
    isIPO,
    volumeDeltaPercent: volumeDeltaPercentOneDay,
    favsInfo,
    favsInfoOnlyOneDay
  } = props;

  const [hoverPoint, setHoverPoint] = useState<DataPointRaw | undefined>();
  const [currentTimeScale, setCurrentTimeScale] = useState<TimeRange>(
    TimeRange.ALL
  );
  const [currentMode, setCurrentMode] = useState<ChartMode>(ChartMode.PRICE);
  const [priceChartData, setPriceChartData] = useState<Array<FavStatistics>>();
  const [volumeChartData, setVolumeChartData] =
    useState<Array<FavStatistics>>();
  const [, setIsVisible] = useState(false);
  const [showOverview, setShowOverview] = useState(true);
  const [overviewPrice, setOverviewPrice] = useState(0);
  const [overviewPriceDeltaPercentage, setOverviewPriceDeltaPercentage] =
    useState(0);
  const [priceDeltaPeriodLabel, setPriceDeltaPeriodLabel] = useState("");

  const panelRef = useRef<HTMLDivElement>(null);
  const shouldAnimateNumber = useRef(true);

  const creationDate = dayjs(oceanaShareExContract.deployedTime);

  // PriceChart only needs to know if timeStep is HOUR or not.
  const timeStep = generateTimeStep({
    timeScale: currentTimeScale,
    startUnixTimestamp: creationDate.unix()
  });

  useEffect(() => {
    setCurrentMode(isIPO ? ChartMode.VOLUME : ChartMode.PRICE);
  }, [isIPO]);

  useEffect(() => {
    const {
      startUnixTimestamp,
      parsedData: _favsInfo
    }: {
      startUnixTimestamp: number;
      parsedData: HistoricalFavInfo;
    } = parseDataByTimeScale({
      timeScale: currentTimeScale,
      chartMode: currentMode,
      data: favsInfo,
      dataOnlyOneDay: favsInfoOnlyOneDay
    });

    let tmpData: Array<FavStatistics> = [];
    let prevPrice = 0;
    // generate price data
    for (const tstamp in _favsInfo) {
      if (_favsInfo[tstamp]?.length > 0) {
        const unix = +tstamp.substring(1) || 0;

        if (unix < startUnixTimestamp) {
          continue;
        }

        const favInfo = _favsInfo[tstamp][0];
        const price = toUSDC(favInfo?.marketPrice || favInfo?.ipoPrice) || 1;

        const priceDelta = price - prevPrice;
        const priceDeltaPercent =
          prevPrice === 0 ? 0 : (priceDelta / prevPrice) * 100;
        tmpData.push({
          date: new Date(unix * 1000).toISOString(),
          price: price,
          equityDeltaPercent: priceDeltaPercent,
          volume: favInfo?.volume
        });

        prevPrice = price;
      }
    }

    const overviewLastPrice = tmpData[tmpData.length - 1]?.price as number;
    const overviewFirstPrice = tmpData[0]?.price as number;
    setOverviewPrice(overviewLastPrice);
    setOverviewPriceDeltaPercentage(
      overviewFirstPrice === 0
        ? 0
        : ((overviewLastPrice - overviewFirstPrice) / overviewFirstPrice) * 100
    );

    // clone the tmpData and set to priceChartData
    setPriceChartData([...tmpData]);

    // generate volume chart data
    if (tmpData && tmpData.length) {
      if (
        currentTimeScale == TimeRange.SEMESTER ||
        (currentTimeScale == TimeRange.ALL && timeStep == TimeRange.MONTH)
      ) {
        // need to get the volume at the end of every month
        tmpData = tmpData
          .filter(
            (o, i) =>
              dayjs(o.date).format("YYYY-MM-DD") ===
              dayjs(o.date).endOf("month").format("YYYY-MM-DD") &&
              i < tmpData.length - 1
          )
          .concat(tmpData[tmpData.length - 1]);
      } else if (
        currentTimeScale == TimeRange.TRIMESTER ||
        currentTimeScale == TimeRange.MONTH ||
        (currentTimeScale == TimeRange.ALL && timeStep == TimeRange.WEEK)
      ) {
        const currDay = dayjs().day();
        tmpData = tmpData.filter((o) => currDay === dayjs(o.date).day());
      }

      let [emptyBarsLength, barGapUnit] = [0, "day"];
      [emptyBarsLength, barGapUnit] =
        currentTimeScale === TimeRange.ALL
          ? [5, "month"]
          : currentTimeScale == TimeRange.SEMESTER
            ? [6, "month"]
            : currentTimeScale == TimeRange.TRIMESTER
              ? [13, "week"]
              : currentTimeScale == TimeRange.MONTH
                ? [5, "week"]
                : currentTimeScale == TimeRange.WEEK
                  ? [7, "day"]
                  : currentTimeScale == TimeRange.DAY
                    ? [24, "hour"]
                    : timeStep == TimeRange.MONTH
                      ? [5, "week"]
                      : timeStep == TimeRange.WEEK
                        ? [5, "week"]
                        : timeStep == TimeRange.DAY
                          ? [7, "day"]
                          : timeStep == TimeRange.HOUR
                            ? [7, "hour"]
                            : [7, "hour"];

      emptyBarsLength = Math.max(emptyBarsLength - tmpData.length, 0);

      const emptyBarsData: Array<FavStatistics> = [];
      const firstDateDayjs = dayjs(tmpData[0].date);
      for (let i = 1; i <= emptyBarsLength; ++i) {
        emptyBarsData.push({
          date: firstDateDayjs
            .subtract(i, barGapUnit as ManipulateType)
            .toISOString(),
          volume: 0
        });
      }
      tmpData = emptyBarsData.reverse().concat(tmpData);

      tmpData = tmpData.map((o, idx) => {
        const v2: number = o?.volume || 0;
        const v1: number = idx === 0 ? 0 : tmpData[idx - 1]?.volume || 0;

        return {
          date: dayjs(o.date || 0).toISOString(),
          price: 0,
          volume: v2 - v1
        };
      });

      tmpData = tmpData.slice(1);
    }
    setVolumeChartData(tmpData);

    document.getElementById("chartjs-tooltip")?.remove();
  }, [favsInfo, favsInfoOnlyOneDay, currentMode, currentTimeScale]);

  useWatchVisible({
    elementRef: panelRef,
    visibleOffset: 250,
    onVisibilityChange: (visibility) => setIsVisible(visibility)
  });

  const lastDataPoint = useMemo<DataPointRaw | undefined>(() => {
    if (priceChartData) {
      const lastPoint = priceChartData[priceChartData.length - 1];
      return {
        x: new Date(lastPoint?.date || "").getTime(),
        price: lastPoint?.price as number,
        delta: lastPoint?.equityDelta as number,
        deltaPercentage: lastPoint?.equityDeltaPercent as number
      };
    }
    return;
  }, [priceChartData]);

  useEffect(() => {
    setHoverPoint(lastDataPoint);
  }, [lastDataPoint]);

  useEffect(() => {
    setPriceDeltaPeriodLabel(
      showOverview
        ? currentTimeScale === TimeRange.ALL
          ? ""
          : currentTimeScale === TimeRange.DAY
            ? "24h"
            : currentTimeScale === TimeRange.WEEK
              ? "1W"
              : currentTimeScale === TimeRange.MONTH
                ? "1M"
                : currentTimeScale === TimeRange.TRIMESTER
                  ? "3M"
                  : currentTimeScale === TimeRange.SEMESTER
                    ? "6M"
                    : ""
        : currentTimeScale === TimeRange.DAY
          ? "1h"
          : "24h"
    );
  }, [showOverview, currentTimeScale]);

  return loading ? (
    <Loader wrapperStyle={{ minHeight: "312px" }} />
  ) : (
    <div className="fav-price-volume-panel" ref={panelRef}>
      <div className="coin-summary">
        <div className="coin-icon-container">
          <ResponsiveImage
            className="coin-icon"
            images={[{ key: "default", image: fav?.iconImage || "" }]}
            defaultImg={profilePlaceholderSrc}
          />
        </div>
        <div>
          <div className="fav-coin-name">
            <span>{fav?.displayName}</span>
            <span className="coin-symbol">{fav?.coin}</span>
          </div>
          {currentMode == ChartMode.VOLUME ? (
            <div className="bought-shares">
              <FormattedMessage
                defaultMessage="<White>{shares}</White> {isIPO, select, true {IPO} other {}} {shares, select, 1 {Share} other {Shares}} Sold"
                values={{
                  shares: formatNumber({
                    value: sharesSold,
                    unit: Unit.SHARE,
                    summarize: true
                  }),
                  White: (content: JSX.Element) => (
                    <span className="almost-white">{content}</span>
                  ),
                  isIPO
                }}
              />
            </div>
          ) : (
            <div className="price-change">
              <NumberAnimatedLabel
                shouldAnimate={shouldAnimateNumber.current}
                className="almost-white"
                finalLabel={formatNumber({
                  value: showOverview ? overviewPrice : hoverPoint?.price,
                  unit: Unit.USDC,
                  summarize: false,
                  withUnit: true
                })}
              />
              {"  "}
              <NumberAnimatedLabel
                shouldAnimate={shouldAnimateNumber.current}
                finalLabel={formatNumber({
                  value: showOverview ? overviewPrice : hoverPoint?.price,
                  unit: Unit.USD,
                  summarize: true,
                  withUnit: true
                })}
              />
            </div>
          )}
          <div>
            {(() => {
              let volumeDeltaPercentOneHour = 0;
              if (volumeChartData && timeStep == TimeRange.HOUR) {
                const currVolume =
                  volumeChartData[volumeChartData?.length - 1]?.volume || 0;
                const oneHourAgoVolume =
                  volumeChartData[volumeChartData?.length - 2]?.volume || 0;
                const volumeDeltaOneHour = currVolume - oneHourAgoVolume;
                volumeDeltaPercentOneHour =
                  oneHourAgoVolume === 0
                    ? 0
                    : (volumeDeltaOneHour / oneHourAgoVolume) * 100;
              }

              const value = isIPO
                ? sharesDelta
                : currentMode == ChartMode.PRICE
                  ? showOverview
                    ? overviewPriceDeltaPercentage
                    : hoverPoint?.deltaPercentage
                  : timeStep == TimeRange.HOUR
                    ? volumeDeltaPercentOneHour
                    : volumeDeltaPercentOneDay;
              const units = isIPO
                ? ` share${+sharesDelta == 1 ? "" : "s"}`
                : "%";
              return (
                <NumberAnimatedLabel
                  shouldAnimate={shouldAnimateNumber.current}
                  className={`delta ${getColorOfValue(value)}`}
                  finalLabel={
                    formatNumber({
                      value: value,
                      unit: Unit.PERCENT,
                      summarize: true,
                      withSign: true
                    }) + units
                  }
                />
              );
            })()}
            <span className="delta-timeframe">{priceDeltaPeriodLabel}</span>
          </div>
        </div>
      </div>
      <div className="chart-wrapper">
        {currentMode == ChartMode.PRICE && isIPO ? (
          <div className="still-ipo">
            <img src={ipoSrc} />
            <div>
              <FormattedMessage
                defaultMessage="No price trends yet while {coin} is in IPO."
                values={{ coin: fav?.coin }}
              />
            </div>
          </div>
        ) : currentMode == ChartMode.VOLUME ? (
          <VolumeChart
            data={volumeChartData as Array<FavStatistics>}
            timeScale={timeStep}
            timeRange={currentTimeScale}
          />
        ) : (
          <PriceChart
            data={priceChartData as Array<FavStatistics>}
            timeScale={timeStep}
            onHoverPoint={(newHoverPoint) => {
              shouldAnimateNumber.current = false;

              // newHoverPoint === null means mouse cursor is outside of canvas
              setShowOverview(newHoverPoint === null);

              if (
                newHoverPoint?.x != hoverPoint?.x ||
                newHoverPoint?.price != hoverPoint?.price ||
                newHoverPoint?.delta != hoverPoint?.delta
              ) {
                setHoverPoint(newHoverPoint || lastDataPoint);
              }
            }}
          />
        )}
      </div>

      <ExclusivePicker
        className="mode-picker"
        value={currentMode}
        onChange={(newValue) => {
          shouldAnimateNumber.current = false;
          setCurrentMode(newValue);
        }}
        options={[
          {
            label: <FormattedMessage defaultMessage="Price" />,
            value: ChartMode.PRICE
          },
          {
            label: <FormattedMessage defaultMessage="Volume" />,
            value: ChartMode.VOLUME
          }
        ]}
      />
      <ExclusivePicker
        disabled={currentMode == ChartMode.PRICE && isIPO}
        value={currentTimeScale}
        onChange={(newValue) => setCurrentTimeScale(newValue)}
        options={[
          { label: "1D", value: TimeRange.DAY },
          {
            label: "1W",
            value: TimeRange.WEEK,
            disabled: Math.abs(creationDate.diff(dayjs(), "day")) < 1
          },
          {
            label: "1M",
            value: TimeRange.MONTH,
            disabled: Math.abs(creationDate.diff(dayjs(), "week")) < 1
          },
          {
            label: "3M",
            value: TimeRange.TRIMESTER,
            disabled: Math.abs(creationDate.diff(dayjs(), "month")) < 1
          },
          {
            label: "6M",
            value: TimeRange.SEMESTER,
            disabled: Math.abs(creationDate.diff(dayjs(), "month")) < 3
          },
          {
            label: "All",
            value: TimeRange.ALL
          }
        ]}
      />
    </div>
  );
};

export default FavPriceVolumePanel;
