import Now from '../now'

export default class CurrentMonthRange {
  constructor() {
    this.month = Now.month()
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
