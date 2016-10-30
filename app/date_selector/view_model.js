import Knockout from 'knockout'
import Date from '../date.js'

export default class DateSelectorViewModel {
  constructor({
    bindSelectedDateTo,
    dayLabel, defaultMonth, defaultYear, monthLabel,
    optionalMonths, optionalYears, yearLabel } = {}) {
    this.initYearSelector(
      { defaultValue: defaultYear, options: optionalYears, label: yearLabel })
    this.initMonthSelector(
      { defaultValue: defaultMonth, options: optionalMonths,
        label: monthLabel })
    this.initDaySelector({ label: dayLabel })
    bindSelectedDateTo = Knockout.computed(() => (
      new Date(
        { year: this.selectedYear(), month: this.selectedMonth(),
          day: this.selectedDay() })))
  }

  initDaySelector({ defaultValue, label="Day" } = {}) {
    this.selectedDay = Knockout.observable()
    this.optionalDays = Knockout.computed(() => (
      Date.daysIn({ year: this.selectedYear(), month: this.selectedMonth() })
        .map((date) => ({ name: date.day, value: date.day }))
    ))
    this.dayLabel = Knockout.observable(Knockout.unwrap(label))
    this.defaultDay = defaultValue || Date.now().day
  }

  initYearSelector({ defaultValue, options, label="Year" } = {}) {
    this.selectedYear = Knockout.observable()
    this.optionalYears = Knockout.observableArray(
      options.map((year) => ({ name: year, value: year })))
    this.yearLabel = Knockout.observable(Knockout.unwrap(label))
    this.defaultYear = defaultValue || Date.now().year
  }

  initMonthSelector({ defaultValue, label="Month", options } = {}) {
    this.selectedMonth = Knockout.observable()
    this.optionalMonths = Knockout.observableArray(
      (options || Date.monthsOfTheYear()).map((date) => (
        { name: date.monthName(), value: date.monthName() })))
    this.monthLabel = Knockout.observable(Knockout.unwrap(label))
    this.defaultMonth = defaultValue || Date.now().monthName()
  }
}
