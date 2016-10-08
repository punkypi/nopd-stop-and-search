import Knockout from 'knockout'
import ViewModel from './view_model'

(function(){
  'use strict'

  Knockout.components.register('traffic_stop_count_by_month', {
    viewModel: ViewModel,
    template: `
      <div class="row">
        <div class="five columns">
          <h2 data-bind="text: title()"></h2>
        </div>
        <div class="two columns">
          <select data-bind="
            options: selectableMonths(),
            value: selectedMonth">
          </select>
        </div>
        <div class="five columns">
          <h2 data-bind="text: count"></h2>
        </div>
      </div>`
  })
})()
