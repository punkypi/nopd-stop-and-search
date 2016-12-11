import Knockout from 'knockout'
import View from './view.html!text'
import ViewModel from './view_model.js'

(function() {
  'use strict'

  Knockout.components.register(
    'traffic_violations_grouped_by_vehicle',
    { template: View, viewModel: ViewModel })

  Knockout.cleanNode(document)
  Knockout.applyBindings()
})()
