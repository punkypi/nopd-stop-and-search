import Knockout from 'knockout'
import ViewModel from './view_model.js'

(function(){
  'use strict'

  Knockout.components.register('message_editor', {
    viewModel: ViewModel,
    template: `
      Message: <input data-bind="value: text" />
      (length: <span data-bind="text: text().length"></span>)`
  })

  Knockout.cleanNode(document)
  Knockout.applyBindings()
})();
