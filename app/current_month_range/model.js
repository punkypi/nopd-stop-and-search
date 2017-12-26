import Month from '../month.js'

export default class CurrentMonthRange {
  constructor() {
    this.month = Month.current()
  }

  end() {
    return this.month.end()
  }

  month() {
    return this.month
  }

  start() {
    return this.month.start()
  }

  toInteger() {
    return this.month.toInteger()
  }

  toString() {
    return this.month.toString()
  }
}
