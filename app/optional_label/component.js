import Knockout from 'knockout'
import ViewModel from './view_model'

(function() {
  'use strict'

  Knockout.components.register('optional_label', {
    viewModel: ViewModel,
    template: `
      <label data-bind="enable: textPresent(), text: text">
      </label>
    `
  })
})()
