import BasicObject from '../basic_object.js'

export default class extends BasicObject {
  static get constraints() {
    return {
      count: {
        numericality: { onlyinteger: true },
        presence: true
      },
      vehicle_make: { presence: true },
      vehicle_model: { presence: true }
    }
  }

  constructor({ count, vehicle_make, vehicle_model }={}) {
    super()
    this.count = count
    this.vehicle_make = vehicle_make
    this.vehicle_model = vehicle_model
    this.validate()
  }

  get vehicleName() {
    return `${this.vehicle_make} ${this.vehicle_model}`
  }
}
