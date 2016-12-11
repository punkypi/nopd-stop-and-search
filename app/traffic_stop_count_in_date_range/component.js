import '../date_selector/component.js'
import '../traffic_violations_grouped_by_vehicle/component.js'
import Knockout from 'knockout'
import View from './view.html!text'
import ViewModel from './view_model.js'

(function() {
  'use strict'

  Knockout.components.register(
    'traffic_stop_count_in_date_range',
    { template: View, viewModel: ViewModel })

  Knockout.cleanNode(document)
  Knockout.applyBindings()
})()
