import VehicleCount from './vehicle_count.js'
import StopAndSearchRequest from '../stop_and_search/request.js'

export default class extends StopAndSearchRequest {
  static get name() {
    return 'StopAndSearchRequest'
  }

  constructor({ endDate, startDate } = {}) {
    super()
    this.endDate = endDate
    this.startDate = startDate
  }

  dbFormat() {
    return 'YYYY-MM-DDTHH:mm:ss'
  }

  eventdateRangeBeginning() {
    return this.startDate.format(this.dbFormat())
  }

  eventdateRangeEnd() {
    return this.endDate.format(this.dbFormat())
  }

  isValid() {
    return this.startDate.isValid() && this.endDate.isValid()
  }

  get params() {
    return {
      stopdescription: "TRAFFIC VIOLATION",
      $where: `eventdate between '${this.eventdateRangeBeginning()}' and
              '${this.eventdateRangeEnd()}'`,
      $select: "count(*), vehiclemake, vehiclemodel",
      $group: "vehiclemake, vehiclemodel",
      $order: "count desc"
    }
  }

  responseWrapper(response) {
    return response.map((record) => (new VehicleCount({
      count: record.count || 'Not Supplied',
      vehicle_make: record.vehiclemake || 'Not Supplied',
      vehicle_model: record.vehiclemodel || 'Not Supplied'
    })))
  }
}
