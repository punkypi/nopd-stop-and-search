import ES6Object from 'core-js/library/es6/object.js'
import ES7Object from 'core-js/library/es7/object.js'
import validate from 'validate.js'
import ValidationError from './validation_error.js'

export default class BasicObject {
  static get constraints() {
    return {}
  }

  static from(object={}) {
    return new BasicObject().merge(object)
  }

  constructor() {
  }

  get class() {
    return this.constructor
  }

  entries() {
    return ES7Object.entries(this)
  }

  inspect() {
    return `{${this.entries().map((entry) => ` ${entry[0]}: ${entry[1]}`)} }`
  }

  merge(object) {
    return ES6Object.assign(this, object)
  }

  toString() {
    return this.inspect()
  }

  validate() {
    let validation = validate(this, this.class.constraints)
    if (!validation) { return true }
    throw new ValidationError(new this.class.from(validation).inspect())
  }
}
