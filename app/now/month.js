import Moment from 'moment'

export default class Month {
  constructor() {
    this.moment = new Moment()
  }

  end() {
    return this.moment.endOf('month')
  }

  start() {
    return this.moment.startOf('month')
  }

  toInteger() {
    return this.moment.month()
  }

  toString() {
    return this.moment.format("MMMM")
  }
}
