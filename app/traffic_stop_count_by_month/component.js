import '../month_selector/component.js'
import Knockout from 'knockout'
import View from './view.html!text'
import ViewModel from './view_model.js'

(function(){
  'use strict'

  Knockout.components.register(
    'traffic_stop_count_by_month',
    { template: View, viewModel: ViewModel })

  Knockout.cleanNode(document)
  Knockout.applyBindings()
})()
