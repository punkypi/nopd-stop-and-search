import '../month_selector/component.js'
import Knockout from 'knockout'
import ViewModel from './view_model.js'

(function(){
  'use strict'

  Knockout.components.register('traffic_stop_count_by_month', {
    viewModel: ViewModel,
    template: `
      <div class="ui">
        <div class="title">
          <h2 class="ui header">
            <i class="car icon"></i>
            <div class="content" data-bind="text: title()"></div>
          </h2>
        </div>
        <div class="content">
          <div class="ui form">
            <month_selector params="
              bindSelectedMonthTo: selectedMonth,
              label: 'In'
            ">
            </month_selector>
          </div>
          <div class="ui centered grid">
            <div class="ui column centered row">
              <div class="ui horizontal statistic">
                <div class="value" data-bind="text: count"></div>
                <div class="label">Total</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  })

  Knockout.cleanNode(document)
  Knockout.applyBindings()
})()
