import Knockout from 'knockout'

export default class MessageEditorViewModel {
  constructor(params) {
    console.log(params)
    this.text = Knockout.observable(params.initialText || '');
  }
}
