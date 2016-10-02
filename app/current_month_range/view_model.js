import CurrentMonthRange from './model'

export default class CurrentMonthRangeViewModel {
  currentMonthRange() {
    return new CurrentMonthRange()
  }
  startOfMonth() {
    return this.currentMonthRange().start()
  }
  startString() {
    return this.startOfMonth().format("YYYY-MM-DDTHH:mm:ss")
  }
  endOfMonth() {
    return this.currentMonthRange().end()
  }
  endString() {
    return this.endOfMonth().format("YYYY-MM-DDTHH:mm:ss")
  }
}
