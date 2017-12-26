import TVRequest from './TrafficViolationsRequest'

export default class TrafficViolationsInRangeRequest extends TVRequest {
  constructor({ endDate, onError, onSuccess, startDate } = {}) {
    super({ onError: onError, onSuccess: onSuccess })
    this.endDate = endDate
    this.startDate = startDate
  }

  isValid() {
    return this.startDate.isValid() && this.endDate.isValid()
  }

  get query() {
    return super.query.where('eventdate between ' +
      `'${this.startDate.toDBString()}' and '${this.endDate.toDBString()}'`)
  }

  submit() {
    if (!this.isValid()) { return }
    super.submit()
  }
}
