import $ from 'jquery'
import Knockout from 'knockout'
import Dropdown from 'semantic-ui-dropdown'
import Transition from 'semantic-ui-transition'
import Month from '../month'

$.fn.dropdown = Dropdown
$.fn.transition = Transition

export default class MonthSelectorViewModel {
  constructor({ label, selectedMonth } = {}) {
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
    ].map(function(monthName) {
      return new Month({ index: monthName })
    }));

    this.selectedMonth = selectedMonth
    this.label = Knockout.observable(Knockout.unwrap(label))
    this.initSelect()
  }

  initSelect() {
    $(".dropdown").dropdown()
  }

  label() {
    return 'Label'
  }

  selectableMonths() {
    return this.selectableMonths
  }
}
