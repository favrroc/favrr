import dayjs from "dayjs";

import { ShareAsset } from "../../../generated-subgraph/graphql";
import { useAppDispatch } from "../hooks/rtkHooks";
import { ChartMode, FavStatistics, TimeRange } from "../interfaces/chart.type";
import { FavStatisticsInfo, MultiFavInfo } from "../interfaces/fav.type";
import { setShowShareFanMatchModalAction } from "../store/slices/modalSlice";
import { toUSDC } from "./string.util";

export function boundObject(state: any, payload: any) {
  if (payload) {
    const keys = Object.keys(payload);
    keys.forEach((key) => {
      state[key] = payload[key];
    });
  }
}

export const MULTI_FAVS_INFO_INITIAL_DATA: FavStatisticsInfo = {
  data: {
    amountInPool: 0,
    availableSupply: 0,
    circulatingSupply: 0,
    id: "",
    ipoEndTime: 0,
    ipoPrice: "",
    ipoSupply: 0,
    marketPrice: "",
    minAmountInPool: 0,
    totalSupply: 0,
    updatedAt: "",
    volume: "",
    volumeUSDC: "",
    totalCost: 0
  },
  isIPO: false,
  sharesDelta: 0,
  marketPriceDelta: 0,
  marketPriceDeltaPercent: 0,
  marketCap: 0,
  volumeDeltaPercent: 0,
  marketPriceDeltaForWeek: 0,
  marketPriceDeltaPercentForWeek: 0,
  volumeUSDCDelta: 0,
};

export const extractFavStatisticsInfo = (
  multiFavsInfo: MultiFavInfo,
  favId: number | undefined
) => {
  return multiFavsInfo[favId || 1] || MULTI_FAVS_INFO_INITIAL_DATA;
};

export const getColorOfValue = (value: number | undefined) => {
  return typeof value === "number" ? (
    value > 0 ? "positive" : (
      value < 0 ? "negative" : "neutral"
    )
  ) : "positive";
};

export const calculateEquityFromShareAssets = (assetsInfo: Array<ShareAsset>) => {
  const currUnixTimestamp = dayjs().unix();
  const currEquity = assetsInfo.reduce((a, b) => {
    const price = toUSDC(
      b.favInfo.ipoEndTime < currUnixTimestamp
        ? b.favInfo.marketPrice
        : b.favInfo.ipoPrice
    );
    return a + price * b.amount;
  }, 0);

  return currEquity;
};

export const parseDataByTimeScale = (props: {
  timeScale: TimeRange,
  chartMode: ChartMode;
  data: any,
  dataOnlyOneDay: any;
  setFirstTransactionUnixTimestamp?: (value: React.SetStateAction<number>) => void;
}) => {
  const { timeScale, chartMode, data, dataOnlyOneDay, setFirstTransactionUnixTimestamp } = props;

  const currentDayjs = dayjs();
  let parsedData: any;
  let startUnixTimestamp = 0;

  if (timeScale === TimeRange.ALL) {
    // Get unix timestamp at which value exists from fetched timetravel data. If such a timestamp doesn't exist, return 0
    const firstDayUnixTimestamp = +((data ? Object.keys(data).filter((k) => data[k].length > 0)[0] : "t0")?.slice(1) || 0);

    // Get unix timestamp at which value exists from fetched timetravel dataOnlyOneDay. If such a timestamp doesn't exist, return 0
    const firstHourUnixTimestamp = +((dataOnlyOneDay ? Object.keys(dataOnlyOneDay).filter((k) => dataOnlyOneDay[k].length > 0)[0] : "t0")?.slice(1) || 0);

    // Get true if history amount is less than one day
    const lessThanOneDay = currentDayjs.diff(dayjs.unix(firstDayUnixTimestamp), "day") < 1;

    if (setFirstTransactionUnixTimestamp && firstDayUnixTimestamp) setFirstTransactionUnixTimestamp(firstDayUnixTimestamp);

    parsedData = lessThanOneDay ? dataOnlyOneDay : data;

    const timeStep = generateTimeStep({ startUnixTimestamp: lessThanOneDay ? firstHourUnixTimestamp : firstDayUnixTimestamp, timeScale });

    // Calculate start timestamp that will be drawn on the chart
    startUnixTimestamp = timeStep === TimeRange.TRIMESTER ? currentDayjs.subtract(chartMode === ChartMode.PRICE ? 6 : 7, "month").startOf("second").unix()
      : timeStep === TimeRange.MONTH ? currentDayjs.subtract(3, "month").startOf("second").unix()
        : timeStep === TimeRange.WEEK ? currentDayjs.subtract(1, "month").startOf("second").unix()
          : timeStep === TimeRange.DAY ? currentDayjs.subtract(1, "week").startOf("second").unix()
            : currentDayjs.subtract(1, "day").startOf("second").unix();
  }
  else if (timeScale === TimeRange.SEMESTER) {
    startUnixTimestamp = currentDayjs.subtract(chartMode === ChartMode.PRICE ? 6 : 7, "month").startOf("second").unix();
    parsedData = data;
  }
  else if (timeScale === TimeRange.TRIMESTER) {
    startUnixTimestamp = currentDayjs.subtract(3, "month").startOf("second").unix();
    if (chartMode === ChartMode.VOLUME) {
      startUnixTimestamp -= 7 * 24 * 3600;
    }
    parsedData = data;
  }
  else if (timeScale === TimeRange.MONTH) {
    startUnixTimestamp = currentDayjs.subtract(1, "month").startOf("second").unix();
    if (chartMode === ChartMode.VOLUME) {
      startUnixTimestamp -= 7 * 24 * 3600;
    }
    parsedData = data;
  }
  else if (timeScale === TimeRange.WEEK) {
    startUnixTimestamp = currentDayjs.subtract(1, "week").startOf("second").unix();
    if (chartMode === ChartMode.VOLUME) {
      startUnixTimestamp -= 24 * 3600;
    }
    parsedData = data;
  }
  else if (timeScale === TimeRange.DAY) {
    startUnixTimestamp = currentDayjs.subtract(1, "day").startOf("second").unix();
    if (chartMode === ChartMode.VOLUME) {
      startUnixTimestamp -= 3600;
    }
    parsedData = dataOnlyOneDay;
  }

  return {
    startUnixTimestamp,
    parsedData
  };
};

export const generateFavStatisticsData = (props: {
  dataCount: number,
  startUnixTimestamp: number,
  step: TimeRange;
}) => {
  const { dataCount, startUnixTimestamp, step } = props;
  const initialData: Array<FavStatistics> = [];

  for (let i = 0; i < dataCount; i++) {
    initialData.push({
      date: dayjs.unix(startUnixTimestamp).add(i + 1, step === TimeRange.HOUR ? "hour" : "day").toISOString(),
      equity: 0,
      equityDelta: 0,
      equityDeltaPercent: 0
    });
  }

  return initialData;
};

export const generateTimeStep = (props: {
  timeScale: TimeRange,
  startUnixTimestamp: number;
}) => {
  const { timeScale, startUnixTimestamp } = props;
  const currentDayjs = dayjs();

  if ((timeScale === TimeRange.ALL && currentDayjs.diff(dayjs.unix(startUnixTimestamp), "day") < 1) || timeScale === TimeRange.DAY) {
    return TimeRange.HOUR;
  }
  else if ((timeScale === TimeRange.ALL && currentDayjs.diff(dayjs.unix(startUnixTimestamp), "week") < 1) || timeScale === TimeRange.WEEK) {
    return TimeRange.DAY;
  }
  else if ((timeScale === TimeRange.ALL && currentDayjs.diff(dayjs.unix(startUnixTimestamp), "month") < 1) || timeScale === TimeRange.MONTH) {
    return TimeRange.WEEK;
  }
  else if ((timeScale === TimeRange.ALL && currentDayjs.diff(dayjs.unix(startUnixTimestamp), "month") < 6) || timeScale === TimeRange.SEMESTER) {
    return TimeRange.MONTH;
  }
  return TimeRange.TRIMESTER;
};

export const delay = async (seconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
};

export const getCSSOfStyledComponent = (component: any) => {
  return (component.componentStyle.rules.join() + component.componentStyle?.baseStyle?.rules.join() || "").replace(/,/g, "").replace(/undefined/g, "");
};

export const scrollToTopOfExplore = () => {
  setTimeout(() => {
    document.querySelector("#explore-top")?.scrollIntoView({ behavior: "smooth", block: "start", inline: "center" });
  }, 1000);
};

export const preventEnterKey = (e: React.KeyboardEvent<HTMLFormElement>) => {
  if (e.code === "Enter" || e.code === "NumpadEnter") e.preventDefault();
};

export const stopAnchorMouseEventPropagination = (
  e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
) => {
  const dispatch = useAppDispatch();
  e.stopPropagation();
  dispatch(setShowShareFanMatchModalAction({ showModal: false }));
};