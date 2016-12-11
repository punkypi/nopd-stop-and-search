import URI from 'uri'
import BasicObject from '../basic_object.js'
import NotImplementedError from '../not_implemented_error.js'

export default class extends BasicObject {
  static get name() {
    return 'Request'
  }

  get host() {
    return URI("https://data.nola.gov/resource/nfft-hjwi")
  }

  json() {
    return this.response()
  }

  get params() {
    throw new NotImplementedError(
      "BasicObject#params must be implemented in a subclass")
  }

  query() {
    return this.uri().query()
  }

  responseWrapper(response) {
    return response
  }

  response() {
    if (!this.isValid()) { return [] }
    try {
      var request = new XMLHttpRequest()
      request.open('get', this.uri().normalize(), false)
      request.setRequestHeader("X-App-Token", "3QZx3OfxcculHVue3kYIPrrKZ")
      request.setRequestHeader("Accept", "application/json")
      request.send()
      return JSON.parse(request.response)
    }
    catch (e) {
      return []
    }
  }

  result() {
    return this.responseWrapper(this.response())
  }

  toString() {
    return "GET " + this.uri()
  }

  uri() {
    if (!this.filters) { return this.host.addQuery(this.params) }
    return this.host.addQuery(this.filters).addQuery(this.params)
  }
}
