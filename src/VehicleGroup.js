export default class VehicleGroup {
  constructor({ count, make, model } = {}) {
    this._count = count
    this._make = make
    this._model = model
  }

  get count() {
    return this._count || 0
  }

  get key() {
    return `${this.make}${this.model}${Math.random().toString(36).substr(2, 9)}`
  }

  get make() {
    return this._make || ''
  }

  get makeAndModel() {
    if (!this.make && !this.model) { return 'Not Supplied' }
    if (!this.make) { return `${this.model}` }
    if (!this.model) { return `${this.make}` }
    return `${this.make} ${this.model}`
  }

  get model() {
    return this._model || ''
  }

  get toString() {
    return `${this.makeAndModel}: ${this.count}`
  }
}
