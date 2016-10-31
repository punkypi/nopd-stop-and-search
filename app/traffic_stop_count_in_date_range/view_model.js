import Knockout from 'knockout'
import Date from '../date.js'
import Request from './request.js'

export default class TrafficStopCountInDateRangeViewModel {
  constructor() {
    this.startDate = Knockout.observable()
    this.endDate = Knockout.observable()
    this.count = Knockout.computed(function() {
      if (typeof this.startDate() == "undefined") { return 0 }
      if (typeof this.endDate() == "undefined") { return 0 }
      return new Request(
        { startDate: this.startDate(), endDate: this.endDate() }).count()
    }, this)
    this.startDateString = Knockout.computed(function() {
      if (typeof this.startDate() == "undefined") { return "" }
      return this.startDate().format()
    }, this)
    this.endDateString = Knockout.computed(function() {
      if (typeof this.endDate() == "undefined") { return "" }
      return this.endDate().format()
    }, this)
  }

  defaultEndDate() {
    return Date.endOfMonth()
  }

  defaultStartDate() {
    return Date.startOfMonth()
  }

  defaultStartDateYear() {
    return Date.now().year
  }

  defaultStartDateMonth() {
    return Date.now().monthName()
  }

  defaultStartDateDay() {
    return 1
  }

  endDateLabel() {
    return "To"
  }

  optionalYears() {
    return [2011, 2012, 2013, 2014, 2015, 2016]
  }

  startDateLabel() {
    return "From"
  }

  title() {
    return "Traffic Violations"
  }
}
