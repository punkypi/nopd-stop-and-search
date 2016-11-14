import '../date_selector/component.js'
import '../traffic_violations_grouped_by_vehicle/component.js'
import Knockout from 'knockout'
import ViewModel from './view_model.js'

(function() {
  'use strict'

  Knockout.components.register('traffic_stop_count_in_date_range', {
    viewModel: ViewModel,
    template: `
      <div class="ui">
        <h2 class="ui header">
          <i class="car icon"></i>
          <div class="content" data-bind="text: title()"></div>
        </h2>
        <div class="ui grid container">
          <div class="ui column row">
            <div class="ten wide column">
              <div class="ui form">
                <div class="field">
                  <label data-bind="text: startDateLabel()"></label>
                  <date_selector class="fields"
                    params="bindSelectedDateTo: startDate,
                            defaultYear: defaultStartDateYear(),
                            defaultMonth: defaultStartDateMonthName(),
                            defaultDay: defaultStartDateDay(),
                            optionalYears: optionalYears()">
                  </date_selector>
                </div>
                <div class="field">
                  <label data-bind="text: endDateLabel()"></label>
                  <date_selector class="fields"
                    params="bindSelectedDateTo: endDate,
                            defaultYear: defaultEndDateYear(),
                            defaultMonth: defaultEndDateMonthName(),
                            defaultDay: defaultEndDateDay(),
                            optionalYears: optionalYears()">
                  </date_selector>
                </div>
              </div>
            </div>
            <div class="middle aligned center aligned six wide column">
              <div class="ui huge horizontal statistic">
                <div class="value" data-bind="text: count"></div>
                <div class="label">Total</div>
              </div>
            </div>
          </div>
            <traffic_violations_grouped_by_vehicle class="ui row"
              params="bindStartDateTo: startDate, bindEndDateTo: endDate">
            </traffic_violations_grouped_by_vehicle>
          </div>
        </div>
      </div>
    `
  })

  Knockout.cleanNode(document)
  Knockout.applyBindings()
})()
