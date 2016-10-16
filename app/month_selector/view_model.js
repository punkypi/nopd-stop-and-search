import Knockout from 'knockout'
import Month from '../month'

export default class MonthSelectorViewModel {
  constructor({ label, bindSelectedMonthTo } = {}) {
    this.defaultMonth = Month.current().name()
    this.selectedMonth = bindSelectedMonthTo || Knockout.observable()
    this.label = Knockout.observable(Knockout.unwrap(label))
    this.optionalMonths = Knockout.observableArray([
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
    ].map(function(monthName) {
      let month = new Month({ index: monthName })
      return { name: month.name(), value: month.name() }
    }));
  }
}
