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

/**
 * A display of NOLA Stop and Search data.
 * @param {Object} props
 * @param {Date} props.endDate
 *  the inclusive end of the date range
 * @param {Date} props.startDate
 *  the inclusive start of the date range
 */
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

  /**
   * @return {Date}
   *  the inclusive end of the date range
   */
  get endDate() {
    return this.state.endDate
  }

  /**
   * Needs to be binded to `this`.
   * @see {@link https://reactjs.org/docs/handling-events.html}
   * @see {@link http://blueprintjs.com/docs/v1/#datetime/daterangepicker}
   * @method
   * @param {Date[]} selectedRange
   *  the current date range, boundaries may be null
   */
  onDateRangeChange = (selectedRange) => {
    const [newStartDate, newEndDate] = selectedRange
    this.setState({ endDate: newEndDate, startDate: newStartDate })
  }

  /**
   * {@link https://reactjs.org/docs/react-component.html#render}
   */
  render() {
    const { endDate, onDateRangeChange, startDate } = this
    return(
      <div>
        <AppHeader>
          <DateRangeFilter endDate={endDate}
            onChange={onDateRangeChange} startDate={startDate}/>
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

  /**
   * @return {Date}
   *  the inclusive start of the date range
   */
  get startDate() {
    return this.state.startDate
  }
}
