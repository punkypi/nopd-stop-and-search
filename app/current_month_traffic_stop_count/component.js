import Knockout from 'knockout'
import View from './view.html!text'
import ViewModel from './view_model.js'

(function() {
  'use strict'

  Knockout.components.register(
    'current_month_traffic_stop_count',
    { template: View, viewModel: ViewModel })

  Knockout.cleanNode(document)
  Knockout.applyBindings()
})()
