import '../searchable_dropdown_selector/component.js'
import Knockout from 'knockout'
import View from './view.html!text'
import ViewModel from './view_model.js'

(function() {
  'use strict'

  Knockout.components.register(
    'date_selector', { template: View, viewModel: ViewModel })

  Knockout.cleanNode(document)
  Knockout.applyBindings()
})()
