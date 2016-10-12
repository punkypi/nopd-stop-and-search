import '../optional_label/component'
import Knockout from 'knockout'
import ViewModel from './view_model'

(function() {
  'use strict'

  Knockout.components.register('month_selector', {
    viewModel: ViewModel,
    template: `
      <div class="field">
        <optional_label params="text: label">
        </optional_label>
        <div class="ui search selection dropdown">
          <input type="hidden" data-bind="textInput: selectedMonth">
          <i class="dropdown icon"/>
          <div class="default text" data-bind="text: selectedMonth">
          </div>
          <div class="menu" data-bind="foreach: selectableMonths()">
            <div class="item" data-bind="
              attr: { 'data-value': name() }, text: name()">
            </div>
          </div>
        </div>
      </div>
    `
  })
})()
