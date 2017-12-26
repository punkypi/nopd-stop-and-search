import RuntimeError from './RuntimeError'

// Any process-haulting issue that could happen at run time.
export default class NotImplementedError extends RuntimeError {
  static get name() {
    return 'NotImplementedError'
  }
}
