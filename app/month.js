import Moment from 'moment'

export default class Month {
  static named(name) {
    return new Month({ index: name })
  }

  static current() {
    return new Month({ index: new Moment().month() })
  }

  constructor({ index } = {}) {
    this.moment = new Moment().month(index)
  }

  abbreviation() {
    return this.moment.format("MMM")
  }

  end() {
    return this.moment.endOf('month')
  }

  name() {
    return this.moment.format("MMMM")
  }

  start() {
    return this.moment.startOf('month')
  }

  toInteger() {
    return this.moment.month()
  }

  toString() {
    return this.name()
  }
}
