import Knockout from 'knockout'
import Request from './request.js'
import Month from '../month.js'

export default class TrafficStopCountByMonthViewModel {
  constructor() {
    this.selectedMonth = Knockout.observable(this.defaultMonth())
    this.count = Knockout.computed(() => {
      return new Request({ index: this.selectedMonth() }).count()
    })
  }

  defaultMonth() {
    return Month.current().toString()
  }

  title() {
    return "Traffic Violations"
  }
}
