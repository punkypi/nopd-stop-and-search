import Knockout from 'knockout'
import Request from './request'
import Month from '../month'

export default class TrafficStopCountByMonthViewModel {
  constructor() {
    this.selectableMonths = Knockout.observableArray([
      "Januaray",
      "Feburary",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ])

    this.selectedMonth = Knockout.observable(Month.current().toString())
    this.count = Knockout.computed(() => {
      return new Request({index: this.selectedMonth()}).count()
    })
  }

  selectableMonths() {
    return this.selectableMonths
  }

  title() {
    return "Traffic Violations"
  }
}
