import Moment from 'moment'
import URI from 'uri'

export default class TrafficStopCountByMonthRequest {
  constructor({ index } = {}) {
    this.month = new Moment().month(index)
  }

  count() {
    var request = new XMLHttpRequest()
    request.open('get', this.uri().normalize(), false)
    request.setRequestHeader("X-App-Token", "3QZx3OfxcculHVue3kYIPrrKZ")
    request.setRequestHeader("Accept", "application/json")
    request.send()
    return JSON.parse(request.response)[0].count_stopdescription
  }

  dbFormat() {
    return 'YYYY-MM-DDTHH:mm:ss'
  }

  endOfMonth() {
    return this.month.endOf('month')
  }

  month() {
    return this.month
  }

  eventdateRangeBeginning() {
    return this.startOfMonth().format(this.dbFormat())
  }

  eventdateRangeEnd() {
    return this.endOfMonth().format(this.dbFormat())
  }

  startOfMonth() {
    return this.month.startOf('month')
  }

  uri() {
    return URI("https://data.nola.gov/resource/nfft-hjwi")
      .addQuery({ $where: "stopdescription like '%TRAFFIC VIOLATION%' and " +
                          "eventdate between " +
                          `'${this.eventdateRangeBeginning()}' and ` +
                          `'${this.eventdateRangeEnd()}'` })
      .addQuery({ $select: "count(stopdescription)"})
  }
}
