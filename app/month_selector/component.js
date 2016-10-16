import '../optional_label/component'
import '../searchable_dropdown_selector/component'
import Knockout from 'knockout'
import ViewModel from './view_model'

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
})()
