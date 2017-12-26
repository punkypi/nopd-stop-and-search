import ES6Error from 'es6-error'

// Any process-haulting issue that could happen at run time.
export default class RuntimeError extends ES6Error {
  static get name() {
    return 'RuntimeError'
  }

  constructor(message = 'No Message Supplied') {
    super(message)
  }
}
