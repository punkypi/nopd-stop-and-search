import Knockout from 'knockout'
import Request from './request.js'

export default class TrafficViolationsGroupedByVehicleViewModel {
  constructor({ bindEndDateTo, bindStartDateTo } = {}) {
    if (!bindStartDateTo) { throw new Error("bindStartDateTo is required") }
    if (!bindEndDateTo) { throw new Error("bindEndDateTo is required") }

    this.endDate = Knockout.observable()
    bindEndDateTo.subscribe((newEndDate) => (this.endDate(newEndDate)))
    this.startDate = Knockout.observable()
    bindStartDateTo.subscribe((newEndDate) => (this.startDate(newEndDate)))

    this.endDateString = Knockout.pureComputed(function() {
      if (typeof this.endDate() == "undefined") { return "Not Specified" }
      return this.endDate().format()
    }, this)

    this.startDateString = Knockout.pureComputed(function() {
      if (typeof this.startDate() == "undefined") { return "Not Specified" }
      return this.startDate().format()
    }, this)

    this.result = Knockout.pureComputed(function() {
      if (!this.startDate()) { return [] }
      if (!this.endDate()) { return [] }
      return new Request(
        { startDate: this.startDate(), endDate: this.endDate() }).result()
    }, this)
  }

  get title() {
    return 'Vehicle Info.'
  }
}
