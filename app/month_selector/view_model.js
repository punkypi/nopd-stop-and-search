import Immutable from 'immutable'
import Knockout from 'knockout'
import Month from '../month.js'

export default class MonthSelectorViewModel {
  static monthNamesOfTheYear() {
    return Immutable.Set.of(
      "January",
      "February",
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
    )
  }

  constructor({ label, bindSelectedMonthTo } = {}) {
    this.selectedMonth = bindSelectedMonthTo || Knockout.observable()
    this.label = Knockout.observable(Knockout.unwrap(label))
    this.optionalMonths = Knockout.observableArray(
      this.constructor.monthNamesOfTheYear().map(function(monthName) {
      return { name: monthName, value: monthName }
    }));
  }

  get defaultMonth() {
    return Month.current().name()
  }
}
