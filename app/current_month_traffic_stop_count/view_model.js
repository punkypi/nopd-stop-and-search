import TrafficStopCountByMonth from '../traffic_stop_count_by_month'
import Now from '../now'

export default class CurrentMonthTrafficStopCount {
  count() {
    return new TrafficStopCountByMonth(
      { index: this.currentMonth().toInteger() }).count()
  }

  currentMonth() {
    return Now.month()
  }

  title() {
    return "Traffic Stops Made This Month: "
  }

  toString() {
    return this.title() + this.count()
  }
}
