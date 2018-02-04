import RuntimeError from './RuntimeError'

export default class ValidationError extends RuntimeError {
  static get name() {
    return 'ValidationError'
  }
}
