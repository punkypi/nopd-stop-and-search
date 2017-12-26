import TVRequest from './TrafficViolationsRequest'
import VehicleGroup from './VehicleGroup'

export default class TrafficViolationVehicleGroupsInRangeRequest
  extends TVRequest {
  constructor({ endDate, onError, onSuccess, startDate } = {}) {
    super({ onError: onError, onSuccess: onSuccess })
    this.endDate = endDate
    this.startDate = startDate
    this.success = (rows) => {
      if (typeof onSuccess === 'function') {
        onSuccess(rows.map((row) => new VehicleGroup({
          count: row.count, make: row.vehiclemake, model: row.vehiclemodel
        })))
      }
    }
  }

  isValid() {
    return this.startDate.isValid() && this.endDate.isValid()
  }

  get query() {
    return super.query.where('eventdate between ' +
      `'${this.startDate.toDBString()}' and '${this.endDate.toDBString()}'`)
      .select('count(*), vehiclemake, vehiclemodel')
      .group('vehiclemake, vehiclemodel')
      .order('count desc')
  }

  submit() {
    if (!this.isValid()) { return }
    super.submit()
  }
}
