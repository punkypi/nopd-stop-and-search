import CurrentMonthRange from '../current_month_range/model'
import TrafficStopCountByMonth from '../traffic_stop_count_by_month'

export default class CurrentMonthTrafficStopCount {
  count() {
    return new TrafficStopCountByMonth(
      { index: this.currentMonthRange().toInteger() }).count()
  }

  currentMonthRange() {
    return new CurrentMonthRange()
  }

  title() {
    return "Traffic Stops Made This Month: "
  }

  toString() {
    return this.title() + this.count()
  }
}
