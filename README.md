### Installation

     npm i react-timeline-range-slider
### Props

| Prop | Type | Default | Description|
|--|--|--|--|
| timelineInterval | array |[startOfToday(), endOfToday()]|Interval to display|
|selectedInterval|array|[new Date(), addHours(new Date(), 1)]|Selected interval inside the timeline|
|disabledIntervals|array|[]|Array of disabled intervals inside the timeline|
|containerClassName|string||ClassName of the wrapping container|
|step|number|48|Number of milliseconds between steps|
|ticksNumber|number|1800000|Number of steps on the timeline (the default value is 30 minutes)|
|error|bool|false|Is the selected interval is not valid|
|onUpdateCallback|function|||
|onChangeCallback|function|||
### Example

    import React from 'react'  
    import {addHours, endOfToday, format, startOfToday, setHours} from 'date-fns'  
    import TimeRange from 'react-time-slider'  
      
    const selectedStart = new Date()
    const selectedEnd = addHours(new Date(), 4)
      
    const startTime = addHours(startOfToday(), 7)  
    const endTime = endOfToday()

	const disabledIntervals = [  
      { start: new Date(), end: addHours(new Date(), 2) },  
      { start: addHours(new Date(), 7), end: addHours(new Date(), 12) },
      { start: setHours(new Date(), 0), end: setHours(new Date(), 10) },
    ]
      
    class App extends React.Component {  
      state = {  
        error: false,  
	    selectedInterval: [selectedStart, selectedEnd],  
      }  
      
      onUpdateCallback = ({ error }) => this.setState({ error })  
      
      onChangeCallback = selectedInterval => this.setState({ selectedInterval })  
      
      render() {  
        const { selectedInterval, error } = this.state  
	    return (  
          <TimeRange  error={error}  
            ticksNumber={36}  
            selectedInterval={selectedInterval}  
            timelineInterval={[startTime, endTime]}  
            onUpdateCallback={this.onUpdateCallback}  
            onChangeCallback={this.onChangeCallback}
            disabledIntervals={disabledIntervals}  
          />
         )  
      }  
    }  
      
    export default App
