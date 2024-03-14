import { Chart, ChartOptions } from "chart.js";
import dayjs from "dayjs";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";

import { ResponsiveContext, screenType } from "../../../core/context/responsive.context";
import { useWatchResize } from "../../../core/hooks/useWatchResize";
import { useWatchVisible } from "../../../core/hooks/useWatchVisible";
import { FavStatistics, TimeRange } from "../../../core/interfaces/chart.type";
import { basicNumberFormatterSummarizer, formatNumber, Unit } from "../../../core/util/string.util";
import "./volume-chart.scss";

interface Props {
  data: Array<FavStatistics>;
  timeRange: TimeRange;
  timeScale: TimeRange;
}

const sizes = {
  [screenType.DESKTOP]: {
    [TimeRange.HOUR]: 80,
    [TimeRange.DAY]: 80,
    [TimeRange.WEEK]: 85,
    [TimeRange.MONTH]: 90,
    [TimeRange.TRIMESTER]: 80,
    [TimeRange.SEMESTER]: 70,
    [TimeRange.ALL]: 80,
  },
  [screenType.TABLET]: {
    [TimeRange.HOUR]: 50,
    [TimeRange.DAY]: 58,
    [TimeRange.WEEK]: 58,
    [TimeRange.MONTH]: 50,
    [TimeRange.TRIMESTER]: 58,
    [TimeRange.SEMESTER]: 50,
    [TimeRange.ALL]: 50,
  },
  [screenType.MOBILE]: {
    [TimeRange.HOUR]: 50,
    [TimeRange.DAY]: 58,
    [TimeRange.WEEK]: 58,
    [TimeRange.MONTH]: 50,
    [TimeRange.TRIMESTER]: 58,
    [TimeRange.SEMESTER]: 50,
    [TimeRange.ALL]: 50,
  },
};

type ChartData = {
  labels: (string | string[] | undefined)[];
  datasets: {
    backgroundColor: string;
    borderRadius: number;
    barThickness: number;
    minBarLength: number;
    data: number[];
    fill: boolean;
    pointRadius: number;
  }[];
};

const VolumeChart = (props: Props) => {
  const { data, timeRange, timeScale } = props;
  const { windowWidth } = useWatchResize();

  const chartRef = useRef<Chart | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const YAxisCanvasRef = useRef<HTMLCanvasElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const outerContainerRef = useRef<HTMLDivElement>(null);
  const backgroundOverlayRef = useRef<HTMLDivElement>(null);
  const rectangleSet = useRef(false);
  const { currentScreenType } = useContext(ResponsiveContext);

  const [isVisible, setIsVisible] = useState(false);
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [chartData, setChartData] = useState<ChartData>();

  useWatchVisible({
    elementRef: canvasRef,
    visibleOffset: 250,
    onVisibilityChange: (visibility) => setIsVisible(visibility),
  });

  useEffect(() => {
    const dataPoints = data.map((favStatistics) => ({
      time: dayjs(favStatistics?.date).valueOf(),
      y: favStatistics?.volume as number,
    }));
    dataPoints.sort((A, B) => (A.time > B.time ? 1 : -1));

    const labels = dataPoints.map(({ time }) => {
      if (timeScale == TimeRange.MONTH) {
        return dayjs(time).format("MMM");
      }
      if (timeScale == TimeRange.WEEK || timeScale == TimeRange.TRIMESTER) {
        const endWeekTime = dayjs(time);
        const startWeekTime = endWeekTime.subtract(1, "week");
        return [
          `${startWeekTime.format("MMM")}`,
          `${startWeekTime.format("DD")} - ${endWeekTime.format("DD")}`,
        ];
      }
      if (timeScale == TimeRange.DAY) {
        return dayjs(time).format("ddd");
      }
      if (timeScale == TimeRange.HOUR) {
        return dayjs(time).format("HH") + " hr";
      }
    });
    const dataValues = dataPoints.map(({ y }) => y);
    const newChartData = {
      labels: labels,
      datasets: [
        {
          backgroundColor: "#3F8CFF",
          borderRadius: 4,
          barThickness: 16,
          minBarLength: 4,
          data: dataValues,
          fill: false,
          pointRadius: 0,
        },
      ],
    };

    if (rootRef.current) {
      const barWidth = sizes[currentScreenType][timeRange];
      const newWidth = Math.max(newChartData.datasets[0].data.length * barWidth + 35, rootRef.current.clientWidth);
      setCanvasWidth(newWidth);
    }

    setChartData(newChartData);
  }, [data, timeScale, timeRange]);

  const options = useMemo(() => {
    const options: ChartOptions<"bar"> = {
      responsive: false,
      maintainAspectRatio: false,
      scales: {
        xAxis: {
          offset: true,
          grid: {
            display: false,
          },
        },
        yAxis: {
          min: 0,
          ticks: {
            padding: 5,
            autoSkip: true,
            maxTicksLimit: 4,
            callback: (value) => {
              return basicNumberFormatterSummarizer({ value: +value });
            }
          },
          grid: {
            borderDash: [8, 8],
            borderWidth: 0,
            color: "#353945",
          },
        },
      },

      plugins: {
        legend: {
          display: false,
        },

        tooltip: {
          mode: "index",
          intersect: false,
          enabled: false,
          external: (context) => {
            let tooltipEl = document.getElementById("chartjs-tooltip");

            const tooltipModel = context.tooltip;
            const dataPoint = tooltipModel.dataPoints[0];
            const value = dataPoint.raw as number;

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

            const dataLabel = `${formatNumber({ value: value, unit: Unit.SHARE, summarize: true })} Share${value != 1 ? "s" : ""}`;
            tooltipEl.innerHTML = `<div class="shares">${dataLabel}</div>`;

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
            tooltipEl.style.top =
              position.top +
              dataPoint.element.y +
              window.pageYOffset -
              10 +
              "px";
          },
        },
      },
    };
    return options;
  }, [windowWidth]);

  useEffect(() => {
    if (!rootRef.current) {
      return;
    }

    const barWidth = sizes[currentScreenType][timeRange];
    const newWidth = Math.max(chartData ? chartData.datasets[0].data.length * barWidth + 35 : 0, rootRef.current.clientWidth);
    setCanvasWidth(newWidth);
  }, [window.innerWidth, currentScreenType]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !rootRef.current || !isVisible) {
      return;
    }
    if (chartRef.current?.canvas != canvas) {
      chartRef.current?.destroy();
      chartRef.current = null;
      rectangleSet.current = false;
    }
    chartRef.current?.destroy();
    canvas.width = canvasWidth;
    chartRef.current = new Chart(canvas, {
      type: "bar",
      data: chartData as ChartData,
      options: {
        ...options,
        animation: {
          onProgress: () => {
            const scale = window.devicePixelRatio;

            if (!chartRef.current) {
              return;
            }
            const sourceCanvas = chartRef.current.canvas;
            const copyWidth = chartRef.current.scales["yAxis"].width - 10;
            const copyHeight =
              chartRef.current.scales["yAxis"].height +
              chartRef.current.scales["yAxis"].top +
              10;

            const targetCtx = YAxisCanvasRef.current?.getContext("2d");
            if (!targetCtx) {
              return;
            }

            targetCtx.scale(scale, scale);
            targetCtx.canvas.width = copyWidth * scale;
            targetCtx.canvas.height = copyHeight * scale;

            targetCtx.canvas.style.width = `${copyWidth}px`;
            targetCtx.canvas.style.height = `${copyHeight}px`;
            targetCtx.drawImage(
              sourceCanvas,
              0,
              0,
              copyWidth * scale,
              copyHeight * scale,
              0,
              0,
              copyWidth * scale,
              copyHeight * scale
            );

            // if (backgroundOverlayRef.current) {
            //   backgroundOverlayRef.current.style.setProperty(
            //     "visibility",
            //     "visible"
            //   );
            // }

            const sourceCtx = sourceCanvas.getContext("2d");
            if (!sourceCtx) {
              return;
            }
            // Normalize coordinate system to use css pixels.

            // sourceCtx.clearRect(0, 0, copyWidth * scale, copyHeight * scale);
            rectangleSet.current = true;
          },
          onComplete: () => {
            if (!chartRef.current || rectangleSet.current == false) {
              return;
            }
            const copyWidth = chartRef.current.scales["yAxis"].width;
            const copyHeight =
              chartRef.current.scales["yAxis"].height +
              chartRef.current.scales["yAxis"].top +
              10;

            const sourceCtx = chartRef.current.canvas.getContext("2d");
            if (!sourceCtx) {
              return;
            }
            sourceCtx.clearRect(0, 0, copyWidth, copyHeight);
          }
        }
      }
    });
  }, [chartData, options, isVisible]);

  useEffect(() => {
    if (outerContainerRef.current) {
      outerContainerRef.current.scrollLeft =
        outerContainerRef.current.scrollWidth;
    }
  }, [chartData, outerContainerRef.current, timeScale, timeRange]);

  useEffect(() => {
    return () => {
      chartRef.current?.destroy();
    };
  }, []);

  return (
    <div className="volume-chart" ref={rootRef}>
      <div className="chart-container-outer" ref={outerContainerRef}>
        <div className="chart-container">
          {rootRef.current !== null && (
            <canvas
              ref={canvasRef}
              height={rootRef.current.clientHeight}
            ></canvas>
          )}
        </div>
      </div>
      <div
        className="background-overlay"
        ref={backgroundOverlayRef}
      // style={{ visibility: "hidden" }}
      >
        {rootRef.current !== null && (
          <canvas
            className="axis-canvas"
            ref={YAxisCanvasRef}
            width="0"
            height={rootRef.current.clientHeight}
          ></canvas>
        )}
      </div>
    </div>
  );
};

export default React.memo(VolumeChart);
