import '../optional_label/component'
import Knockout from 'knockout'
import ViewModel from './view_model'

(function() {
  'use strict'

  Knockout.components.register('searchable_dropdown_selector', {
    viewModel: ViewModel,
    template: `
      <div class="ui field">
        <optional_label params="text: label">
        </optional_label>
        <div class="ui search selection dropdown">
          <input type="hidden" data-bind="textInput: selectedOption">
          <i class="dropdown icon"/>
          <div class="default text" data-bind="text: selectedOption">
          </div>
          <div class="menu" data-bind="foreach: options()">
            <div class="item" data-bind="
              attr: { 'data-value': value }, text: name">
            </div>
          </div>
        </div>
      </div>
    `
  })
})()
