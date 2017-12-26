import TVRequest from './TrafficViolationsRequest'

export default class TrafficViolationCountInRangeRequest extends TVRequest {
  constructor({ endDate, onError, onSuccess, startDate } = {}) {
    super({ onError: onError, onSuccess: onSuccess })
    this.endDate = endDate
    this.startDate = startDate
    this.success = (rows) => {
      if (typeof onSuccess === 'function') {
        onSuccess(rows[0].count_stopdescription)
      }
    }
  }

  isValid() {
    return this.startDate.isValid() && this.endDate.isValid()
  }

  get query() {
    return super.query.where('eventdate between ' +
      `'${this.startDate.toDBString()}' and '${this.endDate.toDBString()}'`)
      .select('count(stopdescription)')
  }

  submit() {
    if (!this.isValid()) { return }
    super.submit()
  }
}
