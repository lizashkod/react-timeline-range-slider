import React from 'react'
import PropTypes from 'prop-types'
import { scaleTime } from 'd3-scale'
import { format, addHours, startOfToday, endOfToday } from 'date-fns'
import { Slider, Rail, Handles, Tracks, Ticks } from 'react-compound-slider'

import SliderRail from './components/SliderRail'
import Track from './components/Track'
import Tick from './components/Tick'
import Handle from './components/Handle'

import './styles/timerange.scss'

const formatTick = ms => format(new Date(ms), 'HH:mm')

class TimeRange extends React.Component {
  onChange = newTime => {
    const formattedNewTime = newTime.map(t => new Date(t))
    this.props.onChangeCallback(formattedNewTime)
  }

  checkIsSelectedIntervalNotValid = ([start, end], source, target) => {
    const { value: startInterval } = source
    const { value: endInterval } = target

    if (startInterval > start && endInterval <= end || startInterval >= start && endInterval < end) return true
    if (start >= startInterval && end <= endInterval) return true

    const isStartInBlockedInterval = start > startInterval && start < endInterval && end >= endInterval
    const isEndInBlockedInterval = end < endInterval && end > startInterval && start <= startInterval
    return isStartInBlockedInterval || isEndInBlockedInterval
  }

  onUpdate = newTime => {
    const { onUpdateCallback, disabledIntervals } = this.props
    const isValuesNotValid = disabledIntervals.some(({ source, target }) =>
      this.checkIsSelectedIntervalNotValid(newTime, source, target))

    const formattedNewTime = newTime.map(t => new Date(t))
    onUpdateCallback({ error: isValuesNotValid, updated: formattedNewTime })
  }

  getDateTicks = () => {
    const { timelineInterval, ticksNumber } = this.props
    return scaleTime().domain(timelineInterval).ticks(ticksNumber).map(t => +t)
  }

  render() {
    const {
      sliderRailClassName,
      disabledIntervals,
      selectedInterval,
      containerStyle,
      handleStyle,
      error,
      step,
    } = this.props

    const domain = this.props.timelineInterval.map(t => +t)

    return (
      <div className={containerStyle || 'time_range__container' }>
        <Slider
          mode={3}
          step={step}
          domain={domain}
          onUpdate={this.onUpdate}
          onChange={this.onChange}
          values={selectedInterval.map(t => +t)}
          rootStyle={{ position: 'relative', width: '100%' }}
        >
          <Rail>
            {({ getRailProps }) => <SliderRail className={sliderRailClassName} getRailProps={getRailProps} />}
          </Rail>

          <Handles>
            {({ handles, getHandleProps }) => (
              <>
                {handles.map(handle => (
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
                {tracks?.map(({ id, source, target }) =>
                  <Track
                    error={error}
                    key={id}
                    source={source}
                    target={target}
                    getTrackProps={getTrackProps}
                  />
                )}
              </>
            )}
          </Tracks>

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

          <Ticks values={this.getDateTicks()}>
            {({ ticks }) => (
              <>{ticks.map(tick => <Tick key={tick.id} tick={tick} count={ticks.length} format={formatTick} />)}</>)}
          </Ticks>
        </Slider>
      </div>
    )
  }
}

TimeRange.propTypes = {
  ticksNumber: PropTypes.number.isRequired,
  selectedInterval: PropTypes.arrayOf(PropTypes.object).isRequired,
  timelineInterval: PropTypes.arrayOf(PropTypes.object).isRequired,
  disabledIntervals: PropTypes.arrayOf(PropTypes.object).isRequired,
  containerStyle: PropTypes.string,
  sliderRailClassName: PropTypes.string,
}

TimeRange.defaultProps = {
  selectedInterval: [new Date(), addHours(new Date(), 1)],
  timelineInterval: [startOfToday(), endOfToday()],
}

export default TimeRange
