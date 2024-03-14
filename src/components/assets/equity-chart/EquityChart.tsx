import dayjs from "dayjs";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { ChartMode, DataPointRaw, FavStatistics, TimeRange } from "../../../core/interfaces/chart.type";
import { UserInfoHistory } from "../../../core/interfaces/user.type";
import { calculateEquityFromShareAssets, getColorOfValue, parseDataByTimeScale } from "../../../core/util/base.util";
import { Unit, formatNumber } from "../../../core/util/string.util";
import PriceChart from "../../chart/price-chart/PriceChart";
import ExclusivePicker from "../../input/exclusive-picker/ExclusivePicker";
import NumberAnimatedLabel from "../../label/NumberAnimatedLabel";
import "./equity-chart.scss";

const EquityChart = (props: {
  history: UserInfoHistory | undefined;
  historyOnlyOneDay: UserInfoHistory | undefined;
  className: string;
}) => {
  const { history, historyOnlyOneDay, className } = props;
  const currDayjs = dayjs();
  const currUnixTimestamp = currDayjs.unix();

  const [currentTimeScale, setCurrentTimeScale] = useState<TimeRange>(
    TimeRange.ALL
  );
  const [timeStep] = useState<TimeRange>(TimeRange.HOUR);
  const [hoverPoint, setHoverPoint] = useState<DataPointRaw | null>(null);
  const [parsedData, setParsedData] = useState<Array<FavStatistics>>([]);
  const [firstTransactionUnixTimestamp, setFirstTransactionUnixTimestamp] = useState(currUnixTimestamp);
  const [showOverview, setShowOverview] = useState(true);
  const [overviewEquity, setOverviewEquity] = useState(0);
  const [overviewEquityDelta, setOverviewEquityDelta] = useState(0);
  const [overviewEquityDeltaPercentage, setOverviewEquityDeltaPercentage] = useState(0);
  const [equityPeriodLabel, setEquityPeriodLabel] = useState("");

  const shouldAnimateRef = useRef(true);

  useEffect(() => {
    const tmpData: Array<FavStatistics> = [];

    const { startUnixTimestamp, parsedData: _history }: {
      startUnixTimestamp: number,
      parsedData: UserInfoHistory | undefined;
    } = parseDataByTimeScale({
      timeScale: currentTimeScale,
      chartMode: ChartMode.PRICE,
      data: history,
      dataOnlyOneDay: historyOnlyOneDay,
      setFirstTransactionUnixTimestamp
    });

    if (_history) {
      let prevEquity = 0;

      for (const tstamp in _history) {
        if (_history[tstamp].length) {
          const unixTimestamp = +tstamp.substring(1) || 0;

          if (unixTimestamp < startUnixTimestamp) {
            continue;
          }

          // calculate total equity
          const currEquity = calculateEquityFromShareAssets(_history[tstamp][0].shareAssets);

          tmpData.push({
            date: new Date(unixTimestamp * 1000).toISOString(),
            equity: currEquity,
            equityDelta: currEquity - prevEquity,
            equityDeltaPercent:
              prevEquity === 0
                ? 0
                : ((currEquity - prevEquity) / prevEquity) * 100,
          });

          prevEquity = currEquity;
        }
      }

      const overviewLastEquity = tmpData[tmpData.length - 1]?.equity as number;
      const overviewFirstEquity = tmpData[0]?.equity as number;
      setOverviewEquity(overviewLastEquity);
      setOverviewEquityDelta(overviewLastEquity - overviewFirstEquity);
      setOverviewEquityDeltaPercentage(overviewFirstEquity === 0 ? 0 : ((overviewLastEquity - overviewFirstEquity) / overviewFirstEquity * 100));
    }

    // generate initial data
    /* let initialData: Array<FavStatistics> = [];

    const _timeStep = generateTimeStep({ startUnixTimestamp, timeScale: currentTimeScale });
    setTimeStep(_timeStep);

    if (currentTimeScale !== TimeRange.ALL) {
      if (_timeStep == TimeRange.HOUR) {
        initialData = generateFavStatisticsData({ dataCount: 24 - tmpData.length, startUnixTimestamp, step: TimeRange.HOUR });
      }
      else if (_timeStep == TimeRange.DAY) {
        initialData = generateFavStatisticsData({ dataCount: 7 - tmpData.length, startUnixTimestamp, step: TimeRange.DAY });
      }
      else if (_timeStep == TimeRange.WEEK) {
        initialData = generateFavStatisticsData({ dataCount: 30 - tmpData.length, startUnixTimestamp, step: TimeRange.DAY });
      }
      else if (_timeStep == TimeRange.MONTH) {
        initialData = generateFavStatisticsData({ dataCount: 90 - tmpData.length, startUnixTimestamp, step: TimeRange.DAY });
      }
      else if (_timeStep == TimeRange.TRIMESTER) {
        initialData = generateFavStatisticsData({ dataCount: 180 - tmpData.length, startUnixTimestamp, step: TimeRange.DAY });
      }
    } */

    // setParsedData(initialData.concat(tmpData));
    setParsedData(tmpData);
  }, [history, historyOnlyOneDay, currentTimeScale]);

  const lastDataPoint = useMemo<DataPointRaw | null>(() => {
    const lastPoint = parsedData[parsedData.length - 1];
    return {
      x: new Date(lastPoint?.date || "").getTime(),
      price: lastPoint?.equity as number,
      delta: lastPoint?.equityDelta as number,
      deltaPercentage: lastPoint?.equityDeltaPercent as number,
    };
  }, [parsedData]);

  useEffect(() => {
    setHoverPoint(lastDataPoint);
  }, [lastDataPoint]);

  useEffect(() => {
    setEquityPeriodLabel(
      showOverview ? (
        currentTimeScale === TimeRange.DAY || currentTimeScale === TimeRange.ALL ? "24h"
          : currentTimeScale === TimeRange.WEEK ? "1W"
            : currentTimeScale === TimeRange.MONTH ? "1M"
              : currentTimeScale === TimeRange.TRIMESTER ? "3M"
                : currentTimeScale === TimeRange.SEMESTER ? "6M" : ""
      ) : (
        currentTimeScale === TimeRange.DAY ? "1h" : "24h"
      )
    );
  }, [showOverview, currentTimeScale]);

  // const intl = useIntl();
  return (
    <div className={`equity-chart ${className || ""}`}>
      <>
        <div className="price-row" style={{ letterSpacing: (hoverPoint?.price || 0) > 10 ** 10 ? "-1px" : "0px" }}>
          <span style={{ marginRight: "12px" }}>
            <span style={{ opacity: "0" }}>
              {formatNumber({
                value: showOverview ? overviewEquity : hoverPoint?.price,
                unit: Unit.USDC,
                summarize: false,
                withUnit: true,
              })}
            </span>
            <span style={{ position: "absolute", left: 0, top: 0 }}>
              <NumberAnimatedLabel
                shouldAnimate={overviewEquity > 0 ? shouldAnimateRef.current : false}
                className="eth-price"
                finalLabel={formatNumber({
                  value: showOverview ? overviewEquity : hoverPoint?.price,
                  unit: Unit.USDC,
                  summarize: false,
                  withUnit: true,
                })}
              />
            </span>
          </span>
          <NumberAnimatedLabel
            shouldAnimate={shouldAnimateRef.current}
            className="usd-price"
            finalLabel={formatNumber({
              value: showOverview ? overviewEquity : hoverPoint?.price,
              unit: Unit.USD,
              summarize: true,
              withUnit: true,
            })}
          />
        </div>
        <div className="delta-row">
          <NumberAnimatedLabel
            shouldAnimate={overviewEquityDelta > 0 ? shouldAnimateRef.current : false}
            className={`eth-delta ${getColorOfValue(showOverview ? overviewEquityDelta : hoverPoint?.delta)}`}
            finalLabel={formatNumber({
              value: showOverview ? overviewEquityDelta : hoverPoint?.delta,
              unit: Unit.USDC,
              summarize: false,
              withSign: true,
              withUnit: true,
            })}
          />
          <NumberAnimatedLabel
            shouldAnimate={shouldAnimateRef.current}
            className="percentage-delta"
            finalLabel={formatNumber({
              value: showOverview ? overviewEquityDeltaPercentage : hoverPoint?.deltaPercentage,
              unit: Unit.PERCENT,
              summarize: true,
              withSign: true,
              withUnit: true,
            })}
          />
          <span className="percentage-timeframe">
            {equityPeriodLabel}
          </span>
        </div>
      </>
      <div className="canvas-container">
        <PriceChart
          isPortfolio={currentTimeScale === TimeRange.ALL}
          data={parsedData as Array<FavStatistics>}
          timeScale={timeStep}
          onHoverPoint={(newHoverPoint) => {
            shouldAnimateRef.current = false;
            // newHoverPoint === null means mouse cursor is outside of canvas
            setShowOverview(newHoverPoint === null);
            setHoverPoint(() => {
              return newHoverPoint || lastDataPoint;
            });
          }}
        />
      </div>
      <ExclusivePicker
        value={currentTimeScale}
        onChange={(newValue) => {
          shouldAnimateRef.current = false;
          setCurrentTimeScale(newValue);
        }}
        options={[
          {
            label: "1D",
            value: TimeRange.DAY,
            disabled: currUnixTimestamp === firstTransactionUnixTimestamp
          },
          {
            label: "1W",
            value: TimeRange.WEEK,
            disabled:
              currDayjs.diff(dayjs.unix(firstTransactionUnixTimestamp), "day") < 1
          },
          {
            label: "1M",
            value: TimeRange.MONTH,
            disabled: currDayjs.diff(dayjs.unix(firstTransactionUnixTimestamp), "week") < 1
          },
          {
            label: "3M",
            value: TimeRange.TRIMESTER,
            disabled: currDayjs.diff(dayjs.unix(firstTransactionUnixTimestamp), "month") < 1
          },
          {
            label: "6M",
            value: TimeRange.SEMESTER,
            disabled: currDayjs.diff(dayjs.unix(firstTransactionUnixTimestamp), "month") < 3
          },
          {
            label: "All",
            value: TimeRange.ALL,
          },
        ]}
      />
    </div>
  );
};

export default React.memo(EquityChart);
