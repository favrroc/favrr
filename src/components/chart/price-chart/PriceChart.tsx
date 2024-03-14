import { Chart, ChartOptions } from "chart.js";
import dayjs from "dayjs";
import React, { useEffect, useMemo, useRef, useState } from "react";
import "../../../components/assets/line-chart-type/LineChartType";

import { oceanaShareExContract } from "../../../core/constants/contract";
import { useAppSelector } from "../../../core/hooks/rtkHooks";
import { useWatchResize } from "../../../core/hooks/useWatchResize";
import { useWatchVisible } from "../../../core/hooks/useWatchVisible";
import { DataPointRaw, FavStatistics, TimeRange } from "../../../core/interfaces/chart.type";
import { basicNumberFormatterSummarizer, formatNumber, Unit } from "../../../core/util/string.util";

interface Props {
  isPortfolio?: boolean;
  data: Array<FavStatistics>;
  timeScale: TimeRange;
  onHoverPoint?: (point: DataPointRaw | null) => void;
}

const PriceChart = (props: Props) => {
  const { isPortfolio, data, timeScale, onHoverPoint } = props;
  const { windowWidth } = useWatchResize();

  const userWalletAddress = useAppSelector(state => state.user.profile.address);
  const participantsInfoByAddress = useAppSelector(state => state.participants.participantsInfoByAddress);

  const userJoinedTimestamp = participantsInfoByAddress[userWalletAddress]?.profile?.createdAt;

  const [isVisible, setIsVisible] = useState(false);

  const canvasRef = useRef<null | HTMLCanvasElement>(null);
  const hoveringCanvasRef = useRef(false);

  useWatchVisible({
    elementRef: canvasRef,
    visibleOffset: 250,
    onVisibilityChange: (visibility) => setIsVisible(visibility),
  });

  const chartData = useMemo(() => {
    const dataPoints = data?.map((favStatistics) => ({
      x: dayjs(favStatistics?.date).valueOf(),
      y:
        favStatistics?.price
          ? favStatistics.price as number
          : favStatistics.equity as number,
      delta: favStatistics.equityDelta as number,
      deltaPercentage: favStatistics.equityDeltaPercent as number,
      timeScale: timeScale
    }));

    dataPoints?.sort((A, B) => (A.x > B.x ? 1 : -1));

    const emptyStateData = [
      {
        x: oceanaShareExContract.deployedTime,
        y: 0,
        delta: 0,
        deltaPercentage: 0,
        timeScale: timeScale
      },
      {
        x: dayjs().valueOf(),
        y: 0,
        delta: 0,
        deltaPercentage: 0,
        timeScale: timeScale
      }
    ];

    // generate second dataset data for zero equity line
    const zerolineDataPoints = [];
    if (data?.length && isPortfolio) {
      const itStep = 86400000;
      const bridgeDateTimestamp = dayjs(data[0]?.date).valueOf();
      const startDateTimestamp = userJoinedTimestamp;
      for (let i = startDateTimestamp; i < bridgeDateTimestamp; i += itStep) {
        zerolineDataPoints.push({
          x: i,
          y: 0,
          delta: 0,
          deltaPercentage: 0,
          timeScale: timeScale
        });
      }
      zerolineDataPoints.push({
        x: bridgeDateTimestamp,
        y: data[0].equity as number,
        delta: data[0].equityDelta as number,
        deltaPercentage: data[0].equityDeltaPercent as number,
        timeScale: timeScale
      });
    }
    return {
      datasets: [
        {
          borderColor: "#7FBA7A",
          data: dataPoints?.length === 0 ? emptyStateData : dataPoints,
          fill: false,
          pointRadius: dataPoints?.length === 1 ? 4 : 0,
          pointBackgroundColor: dataPoints?.length === 1 ? "#7FBA7A" : undefined
        },
        {
          borderColor: "#7FBA7A",
          data: zerolineDataPoints,
          fill: false,
          pointRadius: 0,
          pointBackgroundColor: undefined
        }
      ]
    };
  }, [data]);

  const options = useMemo(() => {
    const totalDuration = 1200;
    const numOfDataPoints = chartData.datasets.reduce((a, b) => {
      return a + b.data?.length;
    }, 0);
    const delayBetweenPoints = totalDuration / (numOfDataPoints || 2);

    // const delay = (ctx: any) => easing(ctx.index / data.length) * totalDuration;
    const previousY = (ctx: any) =>
      ctx.index === 0
        ? ctx.chart.scales.yAxis.getPixelForValue(100)
        : ctx.chart
          .getDatasetMeta(ctx.datasetIndex)
          .data[ctx.index - 1]?.getProps(["y"], true)?.y;
    const animation = {
      x: {
        type: "number",
        easing: "linear",
        duration: delayBetweenPoints,
        from: NaN, // the point is initially skipped
        delay: (ctx: any) => {
          if (ctx.type !== "data" || ctx.xStarted) {
            return 0;
          }
          ctx.xStarted = true;
          return ctx.index * delayBetweenPoints;
        },
      },
      y: {
        type: "number",
        easing: "linear",
        duration: delayBetweenPoints,
        from: previousY,
        delay(ctx: any) {
          if (ctx.type !== "data" || ctx.yStarted) {
            return 0;
          }
          ctx.yStarted = true;
          return ctx.index * delayBetweenPoints;
        },
      },
    };
    const options: ChartOptions<"line"> = {
      responsive: true,
      maintainAspectRatio: false,
      // animation: false,
      scales: {
        xAxis: {
          type: "time",
          display: false,
          grid: {
            display: false,
          },
          ticks: {
            callback: (tick) => {
              return tick;
            },
          },
        },
        yAxis: {
          min: data?.length === 0 ? -1 : 0,
          max: data?.length === 0 ? 1 : undefined,
          ticks: {
            autoSkip: true,
            maxTicksLimit: data?.length === 0 ? 3 : 4,
            callback: (value) => {
              return basicNumberFormatterSummarizer({ value: +value });
            }
          },
          grid: {
            borderDash: [8, 8],
            borderWidth: 0,
            // borderWidth: 10000,
            color: "#353945",
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: data?.length ? {
          filter: (tooltipItem) => tooltipItem?.datasetIndex === 0,
          mode: "nearest",
          intersect: false,

          // Disable the on-canvas tooltip
          enabled: false,

          external: function (context) {
            // Tooltip Element
            let tooltipEl = document.getElementById("chartjs-tooltip");

            const tooltipModel = context.tooltip;
            if (tooltipModel.dataPoints.length === 0 || !hoveringCanvasRef.current) {
              tooltipEl?.remove();
              return;
            }

            const value = (tooltipModel.dataPoints[0]?.raw as any)?.y as number;
            const date = dayjs((tooltipModel.dataPoints[0]?.raw as any)?.x);

            const dataPointRaw = tooltipModel.dataPoints[0]?.raw as {
              x: number;
              y: number;
              delta: number;
              deltaPercentage: number;
              timeScale: TimeRange;
            };

            if (onHoverPoint && hoveringCanvasRef.current && data?.length) {
              onHoverPoint({
                delta: dataPointRaw?.delta,
                price: dataPointRaw?.y,
                deltaPercentage: dataPointRaw?.deltaPercentage,
                x: dataPointRaw?.x,
              });
            }

            // Create element on first render
            if (!tooltipEl) {
              tooltipEl = document.createElement("div");
              tooltipEl.id = "chartjs-tooltip";
              tooltipEl.innerHTML = "<table></table>";
              tooltipEl.style.position = "absolute";
              document.body.appendChild(tooltipEl);
            }

            if (tooltipModel.opacity === 0) {
              tooltipEl.style.opacity = "0";
              return;
            } else {
              tooltipEl.style.opacity = "";
            }
            const dataLabel = formatNumber({ value: value, unit: Unit.USDC, summarize: true, withUnit: true, decimalToFixed: 2 });

            tooltipEl.innerHTML = `<div class="shares">${dataLabel}</div><div class="date">${date.format(
              dataPointRaw?.timeScale == TimeRange.HOUR ? "h:mma" : "MMMM Do"
            )}</div>`;

            const position = context.chart.canvas.getBoundingClientRect();
            const toolTipWidth = tooltipEl.clientWidth;
            const leftPosition = Math.min(
              position.left +
              window.pageXOffset +
              tooltipModel.caretX -
              toolTipWidth / 2,
              windowWidth - toolTipWidth
            );
            tooltipEl.style.left = leftPosition + "px";
            tooltipEl.style.top = position.top + window.pageYOffset + "px";
          },
        } : undefined,
      },
      animation: animation as any
    };
    return options;
  }, [timeScale, data, windowWidth]);

  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isVisible) {
      return;
    }
    chartRef.current?.destroy();
    chartRef.current = null;
    chartRef.current = new Chart(canvas, {
      type: "LineWithCursor" as any,
      data: chartData,
      options,
    });
  }, [chartData, options, isVisible]);

  useEffect(() => {
    return () => chartRef.current?.destroy();
  }, []);

  useEffect(() => {
    //It is important to also trigger remove on unmount
    return () => {
      document.getElementById("chartjs-tooltip")?.remove();
    };
  }, []);

  return (
    // <div className="price-chart">
    //   {canvasRect &&
    <canvas
      ref={canvasRef}
      onMouseEnter={() => {
        hoveringCanvasRef.current = true;
      }}
      onMouseLeave={() => {
        hoveringCanvasRef.current = false;
        if (onHoverPoint) {
          onHoverPoint(null);
        }
      }}
    ></canvas>
    // }
    // </div>}
  );
};

export default PriceChart;
