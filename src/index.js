import React from "react";
import { useMemo } from "react";
import { scaleTime } from "d3-scale";
import { Slider, Rail, Handles, Tracks, Ticks } from "react-compound-slider";
import {
  format,
  addHours,
  startOfToday,
  endOfToday,
  differenceInMilliseconds,
  isBefore,
  isAfter,
  set,
  addMinutes,
} from "date-fns";

import SliderRail from "./components/SliderRail";
import Track from "./components/Track";
import Tick from "./components/Tick";
import Handle from "./components/Handle";

import "./styles/index.scss";

const getTimelineConfig = (timelineStart, timelineLength) => (date) => {
  const percent =
    (differenceInMilliseconds(date, timelineStart) / timelineLength) * 100;
  const value = Number(format(date, "T"));
  return { percent, value };
};

const getFormattedBlockedIntervals = (
  blockedDates = [],
  [startTime, endTime]
) => {
  if (!blockedDates.length) return null;

  const timelineLength = differenceInMilliseconds(endTime, startTime);
  const getConfig = getTimelineConfig(startTime, timelineLength);

  const formattedBlockedDates = blockedDates.map((interval, index) => {
    let { start, end } = interval;

    if (isBefore(start, startTime)) start = startTime;
    if (isAfter(end, endTime)) end = endTime;

    const source = getConfig(start);
    const target = getConfig(end);

    return { id: `blocked-track-${index}`, source, target };
  });

  return formattedBlockedDates;
};

const getNowConfig = ([startTime, endTime]) => {
  const timelineLength = differenceInMilliseconds(endTime, startTime);
  const getConfig = getTimelineConfig(startTime, timelineLength);

  const source = getConfig(new Date());
  const target = getConfig(addMinutes(new Date(), 1));

  return { id: "now-track", source, target };
};

function checkIsSelectedIntervalNotValid([start, end], source, target) {
  const { value: startInterval } = source;
  const { value: endInterval } = target;

  if (
    (startInterval > start && endInterval <= end) ||
    (startInterval >= start && endInterval < end)
  )
    return true;
  if (start >= startInterval && end <= endInterval) return true;

  const isStartInBlockedInterval =
    start > startInterval && start < endInterval && end >= endInterval;
  const isEndInBlockedInterval =
    end < endInterval && end > startInterval && start <= startInterval;

  return isStartInBlockedInterval || isEndInBlockedInterval;
}

function TimeRange(props) {
  const {
    sliderRailClassName,
    timelineInterval,
    selectedInterval,
    containerClassName,
    error,
    step,
    showNow,
    formatTick,
    mode,
  } = props;

  function getDateTicks() {
    const { timelineInterval, ticksNumber } = props;
    return scaleTime()
      .domain(timelineInterval)
      .ticks(ticksNumber)
      .map((t) => +t);
  }

  const domain = timelineInterval.map((t) => Number(t));

  const disabledIntervals = useMemo(
    () =>
      getFormattedBlockedIntervals(
        props?.disabledIntervals,
        props?.timelineInterval
      ),
    [props.disabledIntervals, props.timelineInterval]
  );
  const now = useMemo(
    () => getNowConfig(props?.timelineInterval),
    [props.timelineInterval]
  );
  function handleUpdate(newTime) {
    const { onUpdateCallback } = props;
    if (onUpdateCallback !== undefined) {
      if (disabledIntervals?.length) {
        const isValuesNotValid = disabledIntervals.some(({ source, target }) =>
          checkIsSelectedIntervalNotValid(newTime, source, target)
        );
        const formattedNewTime = newTime.map((t) => new Date(t));
        onUpdateCallback({ error: isValuesNotValid, time: formattedNewTime });
        return;
      }
      const formattedNewTime = newTime.map((t) => new Date(t));
      onUpdateCallback({ error: false, time: formattedNewTime });
    }
  }
  function handleChange(newTime) {
    const { onChangeCallback } = props;
    const formattedNewTime = newTime.map((t) => new Date(t));
    onChangeCallback(formattedNewTime);
  }
  return (
    <div
      className={containerClassName || "react_time_range__time_range_container"}
    >
      <Slider
        mode={mode}
        step={step}
        domain={domain}
        onUpdate={handleUpdate}
        onChange={handleChange}
        values={selectedInterval.map((t) => +t)}
        rootStyle={{ position: "relative", width: "100%" }}
      >
        <Rail>
          {({ getRailProps }) => (
            <SliderRail
              className={sliderRailClassName}
              getRailProps={getRailProps}
            />
          )}
        </Rail>
        <Handles>
          {({ handles, getHandleProps }) => (
            <>
              {handles.map((handle) => (
                <Handle
                  error={error}
                  key={handle.id}
                  handle={handle}
                  domain={domain}
                  getHandleProps={getHandleProps}
                />
              ))}
            </>
          )}
        </Handles>
        <Tracks left={false} right={false}>
          {({ tracks, getTrackProps }) => (
            <>
              {tracks?.map(({ id, source, target }) => (
                <Track
                  error={error}
                  key={id}
                  source={source}
                  target={target}
                  getTrackProps={getTrackProps}
                />
              ))}
            </>
          )}
        </Tracks>
        {disabledIntervals?.length && (
          <Tracks left={false} right={false}>
            {({ getTrackProps }) => (
              <>
                {disabledIntervals.map(({ id, source, target }) => (
                  <Track
                    key={id}
                    source={source}
                    target={target}
                    getTrackProps={getTrackProps}
                    disabled
                  />
                ))}
              </>
            )}
          </Tracks>
        )}
        {showNow && (
          <Tracks left={false} right={false}>
            {({ getTrackProps }) => (
              <Track
                key={now?.id}
                source={now?.source}
                target={now?.target}
                getTrackProps={getTrackProps}
              />
            )}
          </Tracks>
        )}
        <Ticks values={getDateTicks()}>
          {({ ticks }) => (
            <>
              {ticks.map((tick) => (
                <Tick
                  key={tick.id}
                  tick={tick}
                  count={ticks.length}
                  format={formatTick}
                />
              ))}
            </>
          )}
        </Ticks>
      </Slider>
    </div>
  );
}
export default TimeRange;

TimeRange.defaultProps = {
  selectedInterval: [
    set(new Date(), { minutes: 0, seconds: 0, milliseconds: 0 }),
    set(addHours(new Date(), 1), { minutes: 0, seconds: 0, milliseconds: 0 }),
  ],
  timelineInterval: [startOfToday(), endOfToday()],
  formatTick: (ms) => format(new Date(ms), "HH:mm"),
  disabledIntervals: [],
  step: 1000 * 60 * 30,
  ticksNumber: 48,
  error: false,
  mode: 3,
};
