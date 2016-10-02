import Moment from 'moment'

export default class CurrentMonthRange {
  start() {
    return new Moment().startOf('month')
  }
  end() {
    return new Moment().endOf('month')
  }
}
