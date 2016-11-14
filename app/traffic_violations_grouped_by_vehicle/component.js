import Knockout from 'knockout'
import ViewModel from './view_model.js'

(function() {
  'use strict'

  Knockout.components.register('traffic_violations_grouped_by_vehicle', {
    viewModel: ViewModel,
    template: `
      <h2 class="ui header">
        <div class="content" data-bind="text: title"></div>
      </h2>

      <div id='results' class="ui grid container"
        data-bind="foreach: result">
        <div class="row">
          <div class="one wide column">
          </div>
          <div class="two wide column">
            <div class="ui horizontal statistic">
              <div class="value" data-bind="text: count"></div>
              <div class="label" data-bind="text: vehicleName"></div>
            </div>
          </div>
        </div>
      </div>
    `
  })

  Knockout.cleanNode(document)
  Knockout.applyBindings()
})()
