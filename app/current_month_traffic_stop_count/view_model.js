import TrafficStopCountByMonth from '../traffic_stop_count_by_month.js'
import Month from '../month.js'

export default class CurrentMonthTrafficStopCount {
  count() {
    return new TrafficStopCountByMonth(
      { index: this.currentMonth().toInteger() }).count()
  }

  currentMonth() {
    return Month.current()
  }

  title() {
    return "Traffic Stops Made This Month: "
  }

  toString() {
    return this.title() + this.count()
  }
}
