import RuntimeError from './RuntimeError'

exoprt default class ValidationError extends RuntimeError {
  static get name() {
    return 'ValidationError'
  }
}
