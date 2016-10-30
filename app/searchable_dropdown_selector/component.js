import '../optional_label/component.js'
import Knockout from 'knockout'
import ViewModel from './view_model.js'

(function() {
  'use strict'

  Knockout.components.register('searchable_dropdown_selector', {
    viewModel: ViewModel,
    template: `
      <div class="ui field">
        <optional_label data-bind="visible: labelPresent()"
          params="text: label">
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

  Knockout.cleanNode(document)
  Knockout.applyBindings()
})()
