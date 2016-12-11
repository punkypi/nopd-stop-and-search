import '../optional_label/component.js'
import Knockout from 'knockout'
import View from './view.html!text'
import ViewModel from './view_model.js'

(function() {
  'use strict'

  Knockout.components.register(
    'searchable_dropdown_selector',
    { template: View, viewModel: ViewModel })

  Knockout.cleanNode(document)
  Knockout.applyBindings()
})()
