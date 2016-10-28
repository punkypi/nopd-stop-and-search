import Knockout from 'knockout'
import ViewModel from './view_model.js'

(function() {
  'use strict'

  Knockout.components.register('optional_label', {
    viewModel: ViewModel,
    template: `
      <label data-bind="enable: textPresent(), text: text">
      </label>
    `
  })

  Knockout.cleanNode(document)
  Knockout.applyBindings()
})()
