import Knockout from 'knockout'
import ViewModel from './view_model'

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
            <div class="field">
              <label>In</label>
              <select
                id="month-select"
                class="ui search selection dropdown"
                data-bind="options: selectableMonths(), value: selectedMonth">
              </select>
            </div>
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
})()
