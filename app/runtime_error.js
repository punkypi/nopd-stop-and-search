import ES6Error from 'es6-error'

export default class extends ES6Error {
  static get name() {
    return 'RuntimeError'
  }

  constructor(message = 'No Message Supplied') {
    super(message)
  }
}
