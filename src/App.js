import 'normalize.css/normalize.css'
import 'semantic-ui-css/semantic.min.css'
import './App.css'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'
import AboutUs from './AboutUs'
import AppBody from './AppBody'
import AppHeader from './AppHeader'
import AppFooter from './AppFooter'
import Date from './Date'
import DateRangeFilter from './DateRangeFilter'
import TrafficViolations from './TrafficViolations'

export default class App extends Component {
  static defaultProps = { endDate: Date.now(), startDate: Date.startOfMonth() }

  static propTypes = {
    endDate: PropTypes.instanceOf(Date).isRequired,
    startDate: PropTypes.instanceOf(Date).isRequired
  }

  constructor(props) {
    super(props)
    this.state = { endDate: props.endDate, startDate: props.startDate }
  }

  get endDate() {
    return this.state.endDate
  }

  // Needs to be binded to `this`
  // (see https://reactjs.org/docs/handling-events.html).
  onDateRangeChange = (selectedRange) => {
    const [newStartDate, newEndDate] = selectedRange
    this.setState({ endDate: newEndDate, startDate: newStartDate })
  }

  get startDate() {
    return this.state.startDate
  }

  render() {
    const { endDate, startDate } = this.state
    return(
      <div>
        <AppHeader>
          <DateRangeFilter endDate={endDate}
            onChange={this.onDateRangeChange} startDate={startDate}/>
        </AppHeader>
        <Grid container inverted stackable>
          <AppBody>
            <TrafficViolations endDate={endDate} startDate={startDate}/>
          </AppBody>
          <AppFooter>
            <AboutUs title='Info'/>
          </AppFooter>
        </Grid>
      </div>)
  }
}
