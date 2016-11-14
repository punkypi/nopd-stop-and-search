import RuntimeError from './runtime_error.js'

export default class extends RuntimeError {
  static get name() {
    return 'ValidationError'
  }
}
