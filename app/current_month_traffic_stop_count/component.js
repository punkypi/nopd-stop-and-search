import Knockout from 'knockout'
import ViewModel from './view_model'

(function() {
  'use strict'

  Knockout.components.register('current_month_traffic_stop_count', {
    viewModel: ViewModel,
    template: `<h2 data-bind="text: toString()"></h2>`
  })
})()
