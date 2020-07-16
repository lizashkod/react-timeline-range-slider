import React from 'react'
import {addHours, differenceInMilliseconds, endOfToday, format, startOfToday} from 'date-fns'

import TimeRange from './TimeRange'

const selectedStart = new Date()
const selectedEnd = addHours(new Date(), 4)

const startTime = addHours(startOfToday(), 7)
const endTime = endOfToday()

const getBlockedIntervals = (dayStart, dayEnd) => {
  const dayLength = differenceInMilliseconds(dayEnd, dayStart)

  const start1 = addHours(startOfToday(), 7)
  const startPercentage1 = differenceInMilliseconds(start1, dayStart)/dayLength * 100

  const end1 = addHours(startOfToday(), 9)
  const endPercentage1 = differenceInMilliseconds(end1, dayStart)/dayLength * 100

  const start2 = addHours(startOfToday(), 16)
  const startPercentage2 = differenceInMilliseconds(start2, dayStart)/dayLength * 100

  const end2 = addHours(startOfToday(), 20)
  const endPercentage2 = differenceInMilliseconds(end2, dayStart)/dayLength * 100

  return [{
    id: '$$-2',
    source: { percent: startPercentage1, value: Number(format(start1, 'T')), id: '$$-2-1' },
    target: { percent: endPercentage1, value: Number(format(end1, 'T')), id: '$$-2-2'}
  }, {
    id: '$$-3',
    source: { percent: startPercentage2, value: Number(format(start2, 'T')), id: '$$-3-1' },
    target: { percent: endPercentage2, value: Number(format(end2, 'T')), id: '$$-3-2'}
  }]
}

const halfHour = 1000 * 60 * 30

class App extends React.Component {
  state = {
    error: false,
    updatedInterval: [selectedStart, selectedEnd],
    selectedInterval: [selectedStart, selectedEnd],
  }

  onUpdateCallback = ({ error, updated }) => this.setState({ error, updatedInterval: updated })

  onChangeCallback = selectedInterval => this.setState({ selectedInterval })

  render() {
    const { selectedInterval, updatedInterval, error } = this.state
    return (
      <div className='container'>
        <div className='info'>
          <span>Selected Interval: </span>
          {selectedInterval.map(d => <span>{format(d, 'dd MMM, HH:mm')}</span>)}
        </div>

        <TimeRange
          error={error}
          step={halfHour}
          ticksNumber={36}
          selectedInterval={selectedInterval}
          updatedInterval={updatedInterval}
          timelineInterval={[startTime, endTime]}
          onUpdateCallback={this.onUpdateCallback}
          onChangeCallback={this.onChangeCallback}
          disabledIntervals={getBlockedIntervals(startTime, endTime)}
        />
      </div>
    )
  }
}

export default App
