import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import { FormattedMessage } from "react-intl";

const TimeSince = (props: { date: string; }) => {
  const date = dayjs(props.date);
  const now = dayjs();

  const [intervalTime, setIntervalTime] = useState(60 * 1000);
  const [, forceUpdate] = useState({});

  const intervalRef = useRef<null | ReturnType<typeof setInterval>>(null);

  useEffect(() => {
    if (intervalTime) {
      intervalRef.current = setInterval(() => forceUpdate({}), intervalTime);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [intervalTime]);

  const weeks = now.diff(date, "week");
  let newInterval = 60 * 1000;
  let element: JSX.Element = (
    <FormattedMessage defaultMessage="A few seconds ago" />
  );

  const minutes = now.diff(date, "minute");
  if (minutes) {
    newInterval = 60 * 1000;
    element = (
      <FormattedMessage
        defaultMessage="{number} {number, select, 1 {minute} other {minutes}} ago"
        values={{ number: minutes }}
      />
    );
  }

  const hours = now.diff(date, "hour");
  if (hours) {
    newInterval = 60 * 60 * 1000;
    element = (
      <FormattedMessage
        defaultMessage="{number} {number, select, 1 {hour} other {hours}} ago"
        values={{ number: hours }}
      />
    );
  }

  const days = now.diff(date, "day");
  if (days) {
    newInterval = 0;
    element = (
      <FormattedMessage
        defaultMessage="{number} {number, select, 1 {day} other {days}} ago"
        values={{ number: days }}
      />
    );
  }

  if (weeks) {
    newInterval = 0;
    element = (
      <FormattedMessage
        defaultMessage="{number} {number, select, 1 {week} other {weeks}} ago"
        values={{ number: weeks }}
      />
    );
  }

  if (newInterval != intervalTime) {
    setIntervalTime(newInterval);
  }

  return <span className="time-since">{element}</span>;
};

export default TimeSince;
