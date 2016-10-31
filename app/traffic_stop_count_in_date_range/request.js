import URI from 'uri'

export default class TrafficStopCountInDateRangeRequest {
  constructor({ endDate, startDate } = {}) {
    this.endDate = endDate
    this.startDate = startDate
  }

  count() {
    if (!this.isValid()) { return 0 }
    try {
      var request = new XMLHttpRequest()
      request.open('get', this.uri().normalize(), false)
      request.setRequestHeader("X-App-Token", "3QZx3OfxcculHVue3kYIPrrKZ")
      request.setRequestHeader("Accept", "application/json")
      request.send()
      return JSON.parse(request.response)[0].count_stopdescription
    }
    catch (e) {
      return 0
    }
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

  toString() {
    return "GET " + this.uri()
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
