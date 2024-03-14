import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import React, { useEffect, useMemo, useRef } from "react";
import styled from "styled-components";

import { colors } from "../../../core/constants/styleguide.const";
import { useAppSelector } from "../../../core/hooks/rtkHooks";
import { useForceRender } from "../../../core/hooks/useForceRender";
import "./count-down.scss";

dayjs.extend(duration);

enum TimeFields {
  SECONDS = 0,
  MINUTES,
  HOURS,
  DAYS
}

interface Props {
  endDate: dayjs.Dayjs;
  isLiveMatch: boolean;
  isOnFanMatchesPage: boolean;
  isLiveMatchAndSmallerThanTablet: boolean;
  isSharing: boolean;
}

const CountDownInMatches = ({
  endDate,
  isLiveMatch,
  isOnFanMatchesPage,
  isLiveMatchAndSmallerThanTablet,
  isSharing
}: Props) => {
  if (!endDate.isValid()) {
    return null;
  }

  const { fanMatchesList } = useAppSelector((state) => state.fanMatch);
  const isLiveSharing =
    dayjs(fanMatchesList[0]?.expiredAt).diff(dayjs(), "week") === 0
      ? true
      : false;

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

  const daysMinWidth =
    days >= 10 || firstElement != TimeFields.DAYS ? "23px" : "12px";
  const hoursMinWidth =
    hours >= 10 || firstElement != TimeFields.HOURS ? "20px" : "10px";
  const minutesMinWidth =
    minutes >= 10 || firstElement != TimeFields.MINUTES ? "28px" : "14px";
  const secondsMinWidth =
    minutes >= 10 || firstElement != TimeFields.MINUTES ? "23px" : "12px";

  const hoursString =
    hours < 10 && firstElement != TimeFields.HOURS ? `0${hours}` : hours;
  const minutesString =
    minutes < 10 && firstElement != TimeFields.MINUTES
      ? `0${minutes}`
      : minutes;
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
    <StyledCountDwon
      className={days < 1 ? "no-days-left" : ""}
      isLiveMatch={isLiveMatch}
      isOnFanMatchesPage={isOnFanMatchesPage}
      isLiveMatchAndSmallerThanTablet={isLiveMatchAndSmallerThanTablet}
      endDate={endDate}
      isSharing={isSharing}
      isLiveSharing={isLiveSharing}
    >
      {endDate.diff(dayjs(), "day") === 0 && `🔥`}
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
    </StyledCountDwon>
  );
};

const StyledCountDwon = styled.div`
  /* width: ${(props: {
    isLiveMatch: boolean;
    isLiveMatchAndSmallerThanTablet: boolean;
    endDate: dayjs.Dayjs;
  }) => {
    return props.isLiveMatch
      ? "113px"
      : props.isLiveMatchAndSmallerThanTablet
        ? "102px"
        : props.endDate.diff(dayjs(), "day") < 7
          ? "102px"
          : "79px";
  }}; */
  border: 1px solid
    ${(props: {
      isOnFanMatchesPage: boolean;
      isLiveMatch: boolean;
      isLiveMatchAndSmallerThanTablet: boolean;
      endDate: dayjs.Dayjs;
      isSharing: boolean;
      isLiveSharing: boolean;
    }) => {
    return !props.isLiveMatch
      ? !props.isOnFanMatchesPage
        ? !props.isSharing
          ? props.endDate.diff(dayjs(), "week") > 2
            ? `${colors.neutrals3}`
            : `${colors.neutrals8}`
          : props.isLiveSharing
            ? `${colors.neutrals8}`
            : `${colors.primaryGreen}`
        : props.isLiveMatchAndSmallerThanTablet
          ? `${colors.neutrals8}`
          : `${colors.primaryGreen}`
      : `${colors.neutrals8}`;
  }};
  border-radius: 60px;
  padding: 0px 6px;
  font-weight: 400;
  font-size: ${(props: { isLiveMatch: boolean }) => {
    return props.isLiveMatch ? "14px" : "12px";
  }};
  line-height: ${(props: { isLiveMatch: boolean }) => {
    return props.isLiveMatch ? "24px" : "20px";
  }};

  font-family: "Poppins";
  display: inline-flex;
  justify-content: center;
  gap: 4px;
  color: ${(props: {
    isOnFanMatchesPage: boolean;
    isLiveMatch: boolean;
    isLiveMatchAndSmallerThanTablet: boolean;
    endDate: dayjs.Dayjs;
    isSharing: boolean;
    isLiveSharing: boolean;
  }) => {
    return !props.isLiveMatch
      ? !props.isOnFanMatchesPage
        ? !props.isSharing
          ? props.endDate.diff(dayjs(), "week") > 2
            ? `${colors.neutrals3}`
            : `${colors.neutrals8}`
          : props.isLiveSharing
            ? `${colors.neutrals8}`
            : `${colors.primaryGreen}`
        : props.isLiveMatchAndSmallerThanTablet
          ? `${colors.neutrals8}`
          : `${colors.primaryGreen}`
      : `${colors.neutrals8}`;
  }};

  .timeslot {
    display: inline-block;
    text-align: center;
  }
`;

export default CountDownInMatches;
