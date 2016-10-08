import TrafficStopCountByMonth from '../traffic_stop_count_by_month'
import Month from '../month'

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
