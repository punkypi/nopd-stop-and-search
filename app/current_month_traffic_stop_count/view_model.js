import CurrentMonthRange from '../current_month_range/model'
import URI from 'uri'

export default class CurrentMonthTrafficStopCount {
  count() {
    var request = new XMLHttpRequest()
    request.open('get', this.uri().normalize(), false)
    request.setRequestHeader("X-App-Token", "3QZx3OfxcculHVue3kYIPrrKZ")
    request.setRequestHeader("Accept", "application/json")
    request.send()
    return JSON.parse(request.response)[0].count_stopdescription
  }

  currentMonthRange() {
    return new CurrentMonthRange()
  }

  dbFormat() {
    return 'YYYY-MM-DDTHH:mm:ss'
  }

  endOfMonth() {
    return new this.currentMonthRange().end()
  }

  eventdateRangeBeginning() {
    return this.startOfMonth().format(this.dbFormat())
  }

  eventdateRangeEnd() {
    return this.endOfMonth().format(this.dbFormat())
  }

  startOfMonth() {
    return this.currentMonthRange().start()
  }

  title() {
    return "Traffic Stops Made This Month: "
  }

  toString() {
    return this.title() + this.count()
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
