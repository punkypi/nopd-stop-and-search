import Request from './traffic_stop_count_by_month/request'

export default class TrafficStopCountByMonth {
  constructor({ index } = {}) {
    this.request = new Request({ index: index})
  }

  count() {
    return this.request.count()
  }

  request() {
    return this.request
  }
}
