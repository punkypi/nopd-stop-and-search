import CoreArray from 'core-js/library/es6/array.js'
import Moment from 'moment'

export default class Date {
  static daysIn({ year, month } = {}) {
    let moment = new Moment({ year: year })
    moment.month(month)
    return Array(moment.daysInMonth()).fill().map((_, i) => (
      new Date({ year: year, month: month, day: i + 1 })
    ))
  }

  static monthNamesOfTheYear() {
    return CoreArray.from([
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
  }

  static monthNumber(month) {
    return this.monthsAndNumbers()[month]
  }

  static monthsAndNumbers() {
    return {
      "Januaray": 1, "Feburary": 2, "March": 3, "April": 4, "May": 5, "June": 6,
      "July": 7, "August": 8, "September": 9, "October": 10, "November": 11,
      "December": 12  }
  }

  static monthsOfTheYear() {
    return Array(12).fill().map((_, i) => (
      new Date({ year: Date.now().year, month: i + 1 })
    ))
  }

  static now() {
    let now = new Moment()
    return new Date(
      { year: now.year(), month: now.month() + 1, day: now.date() })
  }

  constructor({ year, month, day } = {}) {
    this.year = year
    if (typeof month == "string") {
      this.month = this.constructor.monthNumber(month)
    }
    else {
      this.month = month
    }
    this.day = day
  }

  change({ year, month, day } = {}) {
    if (typeof year != 'undefined') {
      this.year = year
    }

    if (typeof month != 'undefined') {
      this.month = month
    }

    if (typeof day != 'undefined') {
      this.day = day
    }
  }

  get day() {
    return this._day
  }

  set day(newDay) {
    this._day = newDay
  }

  get month() {
    return this._month
  }

  set month(newMonth) {
    this._month = newMonth
  }

  monthName() {
    return this.toMoment().format("MMMM")
  }

  toMoment() {
    return new Moment({ year: this.year, month: this.month - 1, day: this.day })
  }

  get year() {
    return this._year
  }

  set year(newYear) {
    this._year = newYear
  }
}
