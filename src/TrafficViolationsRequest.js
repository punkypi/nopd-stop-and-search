import SODA from 'soda-js'
import URI from './URI'

const MAX_ROWS = 1000000000
export default class TrafficViolationsRequest {
  constructor({ onError, onSuccess } = {}) {
    this.error = (error) => {
      console.log('error')
      if (typeof onError === 'function') { onError(error) }
    }
    this.success = (rows) => {
      console.log('success')
      if (typeof onSuccess === 'function') { onSuccess(rows) }
    }
  }

  get nolaDataQuery() {
    // @note data.nola.gov will limit queries to 1000 unless specified
    return new SODA.Consumer('data.nola.gov').query()
      .withDataset('nfft-hjwi', { apiToken: '3QZx3OfxcculHVue3kYIPrrKZ' })
      .limit(MAX_ROWS)
  }

  get query() {
    return this.nolaDataQuery.where({ stopdescription: 'TRAFFIC VIOLATION' })
  }

  submit() {
    this.query.getRows().on('success', this.success).on('error', this.error)
  }

  toString() {
    return `GET ${this.uri}`
  }

  get uri() {
    return URI(this.query.getURL())
  }
}
