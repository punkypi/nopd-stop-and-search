import TVRequest from './TrafficViolationsRequest'

export default class MostRecentEventDateRequest extends TVRequest {
  constructor({ onError, onSuccess } = {}) {
    super({ onError: onError, onSuccess: onSuccess })
    this.success = (rows) => {
      if (typeof onSuccess === 'function') {
        onSuccess(rows[0].max_eventdate)
      }
    }
  }

  get query() {
    return super.query.select('max(eventdate)')
  }
}
