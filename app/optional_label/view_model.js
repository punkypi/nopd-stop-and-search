import Knockout from 'knockout'

export default class OptionalLabelViewModel {
  constructor({ text } = {}) {
    this.text = Knockout.observable(Knockout.unwrap(text))
  }

  textPresent() {
    return typeof this.text() !== "undefined" && this.text() !== null
  }
}
