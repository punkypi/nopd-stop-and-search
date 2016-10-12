import $ from 'jquery'
import Knockout from 'knockout'
import Dropdown from 'semantic-ui-dropdown'
import Transition from 'semantic-ui-transition'
import Request from './request'
import Month from '../month'

$.fn.dropdown = Dropdown
$.fn.transition = Transition

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
