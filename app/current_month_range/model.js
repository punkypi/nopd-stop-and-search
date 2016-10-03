import Moment from 'moment'

export default class CurrentMonthRange {
  end() {
    return new Moment().endOf('month')
  }

  start() {
    return new Moment().startOf('month')
  }

  toInteger() {
    return new Moment().month()
  }

  toString() {
    return new Moment().format("MMMM")
  }
}
