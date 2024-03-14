import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import React, { useEffect, useMemo, useRef } from "react";

import { useForceRender } from "../../../core/hooks/useForceRender";
import "./count-down.scss";

dayjs.extend(duration);

enum TimeFields {
  SECONDS = 0,
  MINUTES,
  HOURS,
  DAYS,
}

const Countdown = (props: { endDate: string; }) => {
  const endDate = useMemo(() => {
    return dayjs(props.endDate);
  }, [props.endDate]);

  if (!endDate.isValid()) {
    return null;
  }

  const forceRender = useForceRender();
  const updateIntervalIdRef = useRef(
    null as null | ReturnType<typeof setInterval>
  );

  const now = dayjs();
  const duration = dayjs.duration(endDate.diff(now));
  const days = endDate.diff(now, "day");
  const hours = duration.hours();
  const minutes = duration.minutes();
  const seconds = duration.seconds();

  let firstElement = TimeFields.SECONDS;
  if (days) {
    firstElement = TimeFields.DAYS;
  } else if (hours) {
    firstElement = TimeFields.HOURS;
  } else if (minutes) {
    firstElement = TimeFields.MINUTES;
  }

  const daysMinWidth = days >= 10 || firstElement != TimeFields.DAYS ? "23px" : "12px";
  const hoursMinWidth = hours >= 10 || firstElement != TimeFields.HOURS ? "20px" : "10px";
  const minutesMinWidth = minutes >= 10 || firstElement != TimeFields.MINUTES ? "28px" : "14px";
  const secondsMinWidth = minutes >= 10 || firstElement != TimeFields.MINUTES ? "23px" : "12px";

  const hoursString = hours < 10 && firstElement != TimeFields.HOURS ? `0${hours}` : hours;
  const minutesString = minutes < 10 && firstElement != TimeFields.MINUTES ? `0${minutes}` : minutes;
  const secondsString = seconds < 10 ? `0${seconds}` : seconds;

  const hideSeconds = useMemo(() => days > 1, [days]);

  useEffect(() => {
    updateIntervalIdRef.current = setInterval(
      forceRender,
      hideSeconds ? 55 * 1000 : 990
    );

    return () => {
      if (updateIntervalIdRef.current) {
        clearInterval(updateIntervalIdRef.current);
      }
    };
  }, [hideSeconds]);



  return (
    <div className={days < 1 ? "countdown no-days-left" : "countdown"}>
      {firstElement >= TimeFields.DAYS ? (
        <span className="timeslot day" style={{ minWidth: daysMinWidth }}>
          {`${days}d`}
        </span>
      ) : null}
      {firstElement >= TimeFields.HOURS ? (
        <span className="timeslot hour" style={{ minWidth: hoursMinWidth }}>
          {`${hoursString}h`}
        </span>
      ) : null}
      {firstElement >= TimeFields.MINUTES ? (
        <span className="timeslot minute" style={{ minWidth: minutesMinWidth }}>
          {`${minutesString}m`}
        </span>
      ) : null}
      {!hideSeconds && (
        <span className="timeslot second" style={{ minWidth: secondsMinWidth }}>
          {`${secondsString}s`}
        </span>
      )}
    </div>
  );
};

export default Countdown;
