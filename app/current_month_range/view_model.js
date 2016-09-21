import Moment from 'moment'

export default class CurrentMonthRangeViewModel {
  startOfMonth() {
    return new Moment().startOf('month')
  }
  startString() {
    return this.startOfMonth().format("YYYY-MM-DDTHH:mm:ss")
  }
  endOfMonth() {
    return new Moment().endOf('month')
  }
  endString() {
    return this.endOfMonth().format("YYYY-MM-DDTHH:mm:ss")
  }
}
