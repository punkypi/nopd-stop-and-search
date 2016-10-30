import '../searchable_dropdown_selector/component.js'
import Knockout from 'knockout'
import ViewModel from './view_model.js'

(function() {
  'use strict'

  Knockout.components.register('date_selector', {
    viewModel: ViewModel,
    template: `
      <searchable_dropdown_selector class="field" params="
        bindSelectedOptionTo: selectedYear,
        bindOptionsTo: optionalYears,
        defaultOption: defaultYear
      ">
      </searchable_dropdown_selector>
      <searchable_dropdown_selector class="field" params="
        bindSelectedOptionTo: selectedMonth,
        bindOptionsTo: optionalMonths,
        defaultOption: defaultMonth
      ">
      </searchable_dropdown_selector>
      <searchable_dropdown_selector class="field" params="
        bindSelectedOptionTo: selectedDay,
        bindOptionsTo: optionalDays,
        defaultOption: defaultDay
      ">
      </searchable_dropdown_selector>
    `
  })

  Knockout.cleanNode(document)
  Knockout.applyBindings()
})()
