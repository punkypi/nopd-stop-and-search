import '../optional_label/component.js'
import '../searchable_dropdown_selector/component.js'
import Knockout from 'knockout'
import ViewModel from './view_model.js'

(function() {
  'use strict'

  Knockout.components.register('month_selector', {
    viewModel: ViewModel,
    template: `
      <searchable_dropdown_selector params="
        bindLabelTo: label,
        bindSelectedOptionTo: selectedMonth,
        bindOptionsTo: optionalMonths,
        defaultOption: defaultMonth
      ">
      </searchable_dropdown_selector>
    `
  })

  Knockout.cleanNode(document)
  Knockout.applyBindings()
})()
